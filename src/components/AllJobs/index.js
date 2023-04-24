import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiOutlineSearch} from 'react-icons/ai'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const statusConstant = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllJobs extends Component {
  state = {
    profileData: [],
    apiStatus: '',
    jobsData: [],
    jobStatus: '',
    checkboxInputs: [],
    radioInput: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJob()
  }

  getJob = async () => {
    this.setState({jobStatus: statusConstant.inProgress})
    const {checkboxInputs, radioInput, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${checkboxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updateJobs = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({jobsData: updateJobs, jobStatus: statusConstant.success})
    } else {
      this.setState({jobStatus: statusConstant.failure})
    }
  }

  getProfile = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const optionsProfile = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseProfile = await fetch(profileApiUrl, optionsProfile)

    if (responseProfile.ok === true) {
      const fetchedDataProfile = [await responseProfile.json()]
      const updatedDataProfile = fetchedDataProfile.map(eachItem => ({
        name: eachItem.profile_details.name,
        profileImageUrl: eachItem.profile_details.profile_image_url,
        shortBio: eachItem.profile_details.short_bio,
      }))
      this.setState({
        profileData: updatedDataProfile,
        responseSuccess: true,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onGetProfileView = () => {
    const {profileData, responseSuccess} = this.state
    if (responseSuccess) {
      const {name, profileImageUrl, shortBio} = profileData[0]
      return (
        <div className="profile-container">
          <img src={profileImageUrl} className="profile-icon" alt="profile" />
          <h1 className="profile-name">{name}</h1>
          <p className="profile-description">{shortBio}</p>
        </div>
      )
    }
    return null
  }

  retry = () => {
    this.getProfile()
  }

  profileError = () => (
    <div>
      <button type="button" className="err-btn" onClick={this.retry}>
        Retry
      </button>
    </div>
  )

  profileLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  profileCondition = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.profileLoader()
      case apiStatusConstants.success:
        return this.onGetProfileView()
      case apiStatusConstants.failure:
        return this.profileError()
      default:
        return null
    }
  }

  onGetInputOption = event => {
    const {checkboxInputs} = this.state
    const inputNotInList = checkboxInputs.filter(
      eachItem => eachItem === event.target.id,
    )
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkboxInputs: [...prevState.checkboxInputs, event.target.id],
        }),
        this.getJob,
      )
    } else {
      const filteredData = checkboxInputs.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState({checkboxInputs: filteredData}, this.getJob)
    }
  }

  checkBoxView = () => (
    <ul>
      {employmentTypesList.map(each => (
        <li key={each.employmentTypeId} className="check-list">
          <input
            type="checkbox"
            id={each.employmentTypeId}
            onChange={this.onGetInputOption}
          />
          <label htmlFor={each.employmentTypeId} className="check-label">
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  changeRadio = event => {
    this.setState({radioInput: event.target.id}, this.getJob)
  }

  radioView = () => (
    <ul>
      {salaryRangesList.map(each => (
        <li key={each.salaryRangeId} className="check-list">
          <input
            type="radio"
            id={each.salaryRangeId}
            name="salary"
            onChange={this.changeRadio}
          />
          <label className="check-label" htmlFor={each.salaryRangeId}>
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  retryJob = () => {
    this.getJob()
  }

  jobFailure = () => (
    <div className="job-failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-err-img"
      />
      <h1 className="err-head">Oops! Something Went Wrong</h1>
      <p className="err-head">
        We cannot seem to find the page you are looking for
      </p>
      <div>
        <button type="button" className="err-btn" onClick={this.retryJob}>
          Retry
        </button>
      </div>
    </div>
  )

  jobLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  jobSuccess = () => {
    const {jobsData} = this.state
    const length = jobsData.length > 0

    return length ? (
      <ul>
        {jobsData.map(each => (
          <JobItem jobDetails={each} key={each.id} />
        ))}
      </ul>
    ) : (
      <div className="job-failure">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="job-err-img"
        />
        <h1 className="err-head">No Jobs Found</h1>
        <p className="err-head">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  jobCondition = () => {
    const {jobStatus} = this.state
    switch (jobStatus) {
      case statusConstant.inProgress:
        return this.jobLoader()
      case statusConstant.success:
        return this.jobSuccess()
      case statusConstant.failure:
        return this.jobFailure()
      default:
        return null
    }
  }

  onGetSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJob()
    }
  }

  onSubmitSearchInput = () => {
    this.getJob()
  }

  render() {
    const {searchInput} = this.state

    return (
      <div className="jobs-container1">
        <Header />
        <input
          className="search-input"
          type="search"
          value={searchInput}
          placeholder="Search"
          onChange={this.onGetSearchInput}
          onKeyDown={this.onEnterSearchInput}
        />
        <button
          data-testid="searchButton"
          type="button"
          className="search-button"
          onClick={this.onSubmitSearchInput}
        >
          <AiOutlineSearch className="search-icon" />
        </button>
        <div className="jobs-container">
          <div className="profile-lg">
            {this.profileCondition()}
            <hr />
            <h1 className="employee-type">Type of Employment</h1>
            {this.checkBoxView()}
            <hr />
            <h1 className="employee-type">Salary Range</h1>
            {this.radioView()}
          </div>
          <div className="jobs-card">{this.jobCondition()}</div>
        </div>
      </div>
    )
  }
}

export default AllJobs
