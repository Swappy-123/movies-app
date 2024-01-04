import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import VideosSlider from '../VideosSlider'
import './index.css'

const apiStatusList = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class TopRatedSection extends Component {
  state = {apiStatus: apiStatusList.initial, topRated: ''}

  componentDidMount() {
    this.getTopRatedData()
  }

  getTopRatedData = async () => {
    this.setState({apiStatus: apiStatusList.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/movies-app/top-rated-movies'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const updatedList = data.results.map(each => ({
        backdropPath: each.backdrop_path,
        id: each.id,
        title: each.title,
        overview: each.overview,
        posterPath: each.poster_path,
      }))
      this.setState({topRated: updatedList, apiStatus: apiStatusList.success})
    } else {
      this.setState({apiStatus: apiStatusList.failure})
    }
  }

  renderSuccessView = () => {
    const {topRated} = this.state
    return <VideosSlider videoData={topRated} />
  }

  renderFaliureView = () => (
    <div className="failure-view">
      <img
        src="https://res.cloudinary.com/dc2b69ycq/image/upload/v1670040709/Movies%20App/alert-triangle_sc1zom.png"
        alt="failure view"
        className="failure-image"
      />
      <p className="failure-title">Something went wrong. Please try again</p>
      <button
        type="button"
        className="failure-button"
        onClick={this.getTopRatedData}
      >
        Try Again
      </button>
    </div>
  )

  renderProgressView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusList.success:
        return this.renderSuccessView()

      case apiStatusList.failure:
        return this.renderFaliureView()

      case apiStatusList.inProgress:
        return this.renderProgressView()

      default:
        return null
    }
  }

  render() {
    return this.renderViews()
  }
}

export default TopRatedSection
