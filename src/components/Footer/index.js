import {FaGoogle, FaInstagram, FaYoutube, FaTwitter} from 'react-icons/fa'

import './index.css'

const Footer = () => (
  <div className="footer-bg">
    <ul className="list-container">
      <li className="icon">
        <FaGoogle />
      </li>
      <li className="icon">
        <FaInstagram />
      </li>
      <li className="icon">
        <FaTwitter />
      </li>
      <li className="icon">
        <FaYoutube />
      </li>
    </ul>
    <p className="footer-para">Contact Us</p>
  </div>
)

export default Footer
