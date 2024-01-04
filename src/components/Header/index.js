import {Component} from 'react'
import {Link} from 'react-router-dom'
import {HiOutlineSearch} from 'react-icons/hi'
import {AiFillCloseCircle} from 'react-icons/ai'
import {MdMenuOpen} from 'react-icons/md'
import './index.css'

class Header extends Component {
  state = {showMenu: false, currentPath: ''}

  componentDidMount() {
    const path = window.location.pathname
    this.setState({currentPath: path})
  }

  onSearchInput = event => {
    const {changeSearchInput} = this.props
    changeSearchInput(event.target.value)
  }

  onKeyDownEnter = event => {
    const {getSearchApiData} = this.props
    if (event.key === 'Enter') {
      getSearchApiData()
    }
  }

  showSearch = () => {
    const {currentPath} = this.state
    return currentPath === '/search'
  }

  onShowSearchInput = () => {
    const {getSearchApiData} = this.props
    const showInput = this.showSearch()
    if (showInput) {
      getSearchApiData()
    }
  }

  toggleMenuItems = () => {
    this.setState(prev => ({showMenu: !prev.showMenu}))
  }

  render() {
    const {currentPath, showMenu} = this.state
    const showInput = this.showSearch()
    const homeClassName = currentPath === '/' ? 'selected' : null
    const popularClassName = currentPath === '/popular' ? 'selected' : null
    const accountClassName = currentPath === '/account' ? 'selected' : null
    return (
      <nav>
        <div className="navbar-container">
          <div className="navbar-logo-link-container">
            <Link to="/">
              <img
                src="https://res.cloudinary.com/dc2b69ycq/image/upload/v1669787785/Movies%20App/Movies_Logo_nu3gsl.png"
                alt="website logo"
                className="logo"
              />
            </Link>
            <ul className="link-container">
              <Link to="/" className="link-route">
                <li className={`header-link ${homeClassName}`}>Home</li>
              </Link>
              <Link to="/popular" className="link-route">
                <li className={`header-link ${popularClassName}`}>Popular</li>
              </Link>
            </ul>
          </div>

          <div className="search-account">
            <div className="search-container">
              {showInput && (
                <input
                  type="search"
                  className="search-input"
                  onChange={this.onSearchInput}
                  onKeyDown={this.onKeyDownEnter}
                />
              )}
              <Link to="/search">
                <button
                  type="button"
                  onClick={this.onShowSearchInput}
                  data-testid="searchButton"
                  className="search-button"
                >
                  <HiOutlineSearch size={18} color="#ffffff" />
                </button>
              </Link>
            </div>
            <Link to="/account">
              <img
                src="https://res.cloudinary.com/dc2b69ycq/image/upload/v1669785109/Movies%20App/Vector_Avatar1_hiwft7.png"
                alt="profile"
                className="avatar-img"
              />
            </Link>
            <button
              type="button"
              className="menu-button"
              onClick={this.toggleMenuItems}
            >
              <MdMenuOpen />
            </button>
          </div>
        </div>
        {showMenu && (
          <ul className="menu-link-container">
            <Link to="/" className="route-link">
              <li className={`menu-link ${homeClassName}`}>Home</li>
            </Link>
            <Link to="/popular" className="route-link">
              <li className={`menu-link ${popularClassName}`}>Popular</li>
            </Link>
            <Link to="/account" className="route-link">
              <li className={`menu-link ${accountClassName}`}>Account</li>
            </Link>
            <li>
              <button
                type="button"
                className="close-button"
                onClick={this.toggleMenuItems}
              >
                <AiFillCloseCircle />
              </button>
            </li>
          </ul>
        )}
      </nav>
    )
  }
}

export default Header
