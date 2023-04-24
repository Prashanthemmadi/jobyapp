import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import {Component} from 'react'
import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', errorMsg: '', showErr: false}

  success = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  failure = errorMsg => {
    this.setState({errorMsg, showErr: true})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.success(data.jwt_token)
    } else {
      this.failure(data.error_msg)
    }
  }

  changeUser = event => {
    this.setState({username: event.target.value})
  }

  changePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, showErr, errorMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="login-card">
          <div className="logo-card">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="logos"
            />
          </div>
          <form onSubmit={this.submitForm}>
            <label htmlFor="user" className="label">
              USERNAME
            </label>
            <br />
            <input
              type="text"
              id="user"
              placeholder="Username"
              className="input"
              value={username}
              onChange={this.changeUser}
            />
            <br />
            <label htmlFor="password" className="label">
              PASSWORD
            </label>
            <br />
            <input
              type="password"
              id="password"
              placeholder="password"
              className="input"
              value={password}
              onChange={this.changePassword}
            />
            <br />
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
          {showErr && <p className="error">*{errorMsg}</p>}
        </div>
      </div>
    )
  }
}

export default LoginForm
