import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import TopRatedSection from '../TopRatedSection'
import TrendingSection from '../TrendingSection'
import VideosSlider from '../VideosSlider'
import './index.css'

const apiStatusList = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class HomeRoute extends Component {
  state = {apiStatus: apiStatusList.initial, originalsData: ''}

  componentDidMount() {
    this.getOriginalsData()
  }

  getOriginalsData = async () => {
    this.setState({apiStatus: apiStatusList.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/movies-app/originals'
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
      this.setState({
        originalsData: updatedList,
        apiStatus: apiStatusList.success,
      })
    } else {
      this.setState({apiStatus: apiStatusList.failure})
    }
  }

  renderSuccessView = () => {
    const {originalsData} = this.state
    return <VideosSlider videoData={originalsData} />
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
        onClick={this.getOriginalsData}
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

  renderOriginalViews = () => {
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

  renderPosterSuccessView = () => {
    const {originalsData} = this.state
    const randomNumber = Math.floor(Math.random() * (originalsData.length - 1))
    const posterImage = originalsData[randomNumber]

    return (
      <div
        style={{backgroundImage: `url(${posterImage.backdropPath})`}}
        className="bg-image"
      >
        <Header />
        <div className="movie-heading-container">
          <h1 className="poster-title">{posterImage.title}</h1>
          <p className="poster-description">{posterImage.overview}</p>
          <button type="button" className="play-button">
            Play
          </button>
        </div>
      </div>
    )
  }

  renderPosterLoadingView = () => (
    <div className="home-loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderPosterFailureView = () => (
    <div className="poster-failure-view">
      <img
        src="https://res.cloudinary.com/dc2b69ycq/image/upload/v1670040709/Movies%20App/alert-triangle_sc1zom.png"
        alt="failure view"
        className="poster-failure-image"
      />
      <p className="failure-title">Something went wrong. Please try again</p>
      <button
        type="button"
        className="failure-retry-button"
        onClick={this.getOriginalsData}
      >
        Try Again
      </button>
    </div>
  )

  renderPosterOutputView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusList.success:
        return this.renderPosterSuccessView()
      case apiStatusList.inProgress:
        return this.renderPosterLoadingView()
      case apiStatusList.failure:
        return this.renderPosterFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <div className="home-bg">
          {this.renderPosterOutputView()}
          <hr />
          <h1 className="head">Trending Now</h1>
          <div className="video-slider-container">
            <TrendingSection />
          </div>
          <h1 className="head">Top Rated</h1>
          <div className="video-slider-container">
            <TopRatedSection />
          </div>
          <h1 className="head">Originals</h1>
          <div className="video-slider-container">
            {this.renderOriginalViews()}
          </div>
        </div>
        <Footer />
      </>
    )
  }
}

export default HomeRoute
