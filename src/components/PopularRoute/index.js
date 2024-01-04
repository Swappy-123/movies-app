import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import Header from '../Header'
import Footer from '../Footer'
import MovieItem from '../MovieItem'

import './index.css'

const apiStatusList = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  faliure: 'FAILURE',
}

class PopularRoute extends Component {
  state = {popularList: [], apistatus: apiStatusList.initial}

  componentDidMount() {
    this.getPopularApiData()
  }

  getPopularApiData = async () => {
    this.setState({apistatus: apiStatusList.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/movies-app/popular-movies'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const updatedData = data.results.map(each => ({
        id: each.id,
        overview: each.overview,
        title: each.title,
        backdropPath: each.backdrop_path,
        posterPath: each.poster_path,
      }))
      this.setState({
        popularList: updatedData,
        apistatus: apiStatusList.success,
      })
    } else {
      this.setState({apiStatus: apiStatusList.faliure})
    }
  }

  renderPopularSuccessView = () => {
    const {popularList} = this.state
    return (
      <ul className="list-container">
        {popularList.map(each => (
          <MovieItem movieData={each} key={each.id} />
        ))}
      </ul>
    )
  }

  renderPopularFailureView = () => (
    <div className="faliure-bg">
      <img
        src="https://res.cloudinary.com/dc2b69ycq/image/upload/v1670040709/Movies%20App/alert-triangle_sc1zom.png"
        alt="faliure view"
        className="faliure-img"
      />
      <p className="faliure-title">Something went wrong. Please try again</p>
      <button
        type="button"
        className="failure-button"
        onClick={this.getPopularApiData}
      >
        Try Again
      </button>
    </div>
  )

  renderPopularProgressView = () => (
    <div className="popular-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderPopularViews = () => {
    const {apistatus} = this.state
    switch (apistatus) {
      case apiStatusList.success:
        return this.renderPopularSuccessView()

      case apiStatusList.faliure:
        return this.renderPopularFailureView()

      case apiStatusList.inProgress:
        return this.renderPopularProgressView()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="popular-bg">{this.renderPopularViews()}</div>
        <Footer />
      </>
    )
  }
}

export default PopularRoute
