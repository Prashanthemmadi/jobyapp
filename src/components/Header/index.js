import {Link, withRouter} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import Cookies from 'js-cookie'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const {history} = props

  const logout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div>
      <div className="header-container-mobile">
        <div>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="logo"
            />
          </Link>
        </div>
        <ul className="list">
          <li>
            <Link to="/">
              <AiFillHome className="home-icon" />
            </Link>
          </li>
          <li>
            <Link to="/jobs">
              <BsFillBriefcaseFill className="home-icon" />
            </Link>
          </li>
          <li>
            <button type="button" className="mobile-logout" onClick={logout}>
              <FiLogOut className="home-icon" />
            </button>
          </li>
        </ul>
      </div>
      <div className="header-container-desktop">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
        </Link>
        <ul className="list-card">
          <li>
            <Link to="/" className="home-name">
              Home
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="home-name">
              Jobs
            </Link>
          </li>
        </ul>
        <button type="button" className="log-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default withRouter(Header)
