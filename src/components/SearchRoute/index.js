import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import MovieItem from '../MovieItem'

import './index.css'

const apiStatusList = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  noResult: 'NO_RESULT',
}

class SearchRoute extends Component {
  state = {searchData: [], searchInput: '', apiStatus: apiStatusList.initial}

  changeSearchInput = value => {
    this.setState({searchInput: value})
  }

  getSearchApiData = async () => {
    this.setState({apiStatus: apiStatusList.inProgress})
    const {searchInput} = this.state
    const url = `https://apis.ccbp.in/movies-app/movies-search?search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const updatedData = data.results.map(eachMovie => ({
        id: eachMovie.id,
        backdropPath: eachMovie.backdrop_path,
        overview: eachMovie.overview,
        posterPath: eachMovie.poster_path,
        title: eachMovie.title,
      }))
      if (updatedData.length === 0) {
        this.setState({apiStatus: apiStatusList.noResult})
      } else {
        this.setState({
          searchData: updatedData,
          apiStatus: apiStatusList.success,
        })
      }
    } else {
      this.setState({apiStatus: apiStatusList.failure})
    }
  }

  renderSearchSuccessView = () => {
    const {searchData} = this.state
    return (
      <ul className="list-container">
        {searchData.map(eachMovie => (
          <MovieItem movieData={eachMovie} key={eachMovie.id} />
        ))}
      </ul>
    )
  }

  renderSearchFailureView = () => (
    <div className="no-result-view-container">
      <img
        src="https://res.cloudinary.com/dc2b69ycq/image/upload/v1670002135/Movies%20App/Failure_l6kgfg.png"
        alt="failure view"
        className="failure-image"
      />
      <p className="failure-text">Something went wrong. Please try again</p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getSearchApiData}
      >
        Try Again
      </button>
    </div>
  )

  renderNoResultView = () => {
    const {searchInput} = this.state

    return (
      <div className="no-result-view-container">
        <img
          src="https://res.cloudinary.com/dc2b69ycq/image/upload/v1670000784/Movies%20App/Not_Found_qfz2oz.png"
          alt="no movies"
          className="no-result-image"
        />
        <p className="no-result-text">
          {`
          Your search for ${searchInput} did not find any matches.`}
        </p>
      </div>
    )
  }

  renderSearchProgressView = () => (
    <div className="popular-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#D81F26" height={50} width={50} />
    </div>
  )

  getDataViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusList.success:
        return this.renderSearchSuccessView()

      case apiStatusList.failure:
        return this.renderSearchFailureView()

      case apiStatusList.inProgress:
        return this.renderSearchProgressView()

      case apiStatusList.noResult:
        return this.renderNoResultView()

      default:
        return null
    }
  }

  getData = () => (
    <Header
      changeSearchInput={this.changeSearchInput}
      getSearchApiData={this.getSearchApiData}
    />
  )

  render() {
    return (
      <>
        {this.getData()}
        <div className="search-bg">{this.getDataViews()}</div>
      </>
    )
  }
}

export default SearchRoute
