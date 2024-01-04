import {Link} from 'react-router-dom'

import './index.css'

const MovieItem = props => {
  const {movieData} = props
  const {id, title, posterPath} = movieData
  return (
    <li className="list-item">
      <Link to={`/movies/${id}`}>
        <img src={posterPath} alt={title} className="item-image" />
      </Link>
    </li>
  )
}

export default MovieItem
