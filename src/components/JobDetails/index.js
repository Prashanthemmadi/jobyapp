import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiStatus = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobDetails extends Component {
  state = {jobDetails: [], similarJobs: [], status: ''}

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({status: apiStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updateJobDetails = [data.job_details].map(each => ({
        companyLogoUrl: each.company_logo_url,
        companyWebsiteUrl: each.company_website_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        skills: each.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        lifeAtCompany: {
          description: each.life_at_company.description,
          imageUrl: each.life_at_company.image_url,
        },
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))

      const updateSimilarJobs = data.similar_jobs.map(item => ({
        companyLogoUrl: item.company_logo_url,
        employmentType: item.employment_type,
        id: item.id,
        jobDescription: item.job_description,
        location: item.location,
        rating: item.rating,
        title: item.title,
      }))
      this.setState({
        jobDetails: updateJobDetails,
        similarJobs: updateSimilarJobs,
        status: apiStatus.success,
      })
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  retryDetails = () => {
    this.getJobDetails()
  }

  detailsFailure = () => (
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
        <button type="button" className="err-btn" onClick={this.retryDetails}>
          Retry
        </button>
      </div>
    </div>
  )

  detailsLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  detailsSuccess = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      lifeAtCompany,
      location,
      rating,
      packagePerAnnum,
      title,
    } = jobDetails[0]

    return (
      <div>
        <div className="job-deta-card">
          <div className="job-details-card">
            <div className="card-job">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="details-logo"
              />
              <div>
                <h1 className="title">{title}</h1>
                <div className="rating-card">
                  <AiFillStar className="rating-icon" />
                  <p className="rating">{rating}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="details-container">
            <div className="job-details-card">
              <div className="location-card">
                <MdLocationOn className="location-icon" />
                <p className="location">{location}</p>
              </div>
              <div className="location-card">
                <BsFillBriefcaseFill className="location-icon1" />
                <p className="location">{employmentType}</p>
              </div>
            </div>
            <p className="salary1">{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="anchor-container">
            <h1 className="description">Description</h1>
            <a href={companyWebsiteUrl} className="anchor">
              Visit <BiLinkExternal />
            </a>
          </div>
          <p className="para1">{jobDescription}</p>
          <h1 className="para">Skills</h1>
          <ul className="skill-card">
            {skills.map(each => (
              <li className="skill-list">
                <img
                  src={each.imageUrl}
                  alt={each.name}
                  className="skill-image"
                />
                <p className="skill-name">{each.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="life-heading">Life at Company</h1>
          <div className="life-card">
            <p className="life-para">{lifeAtCompany.description}</p>
            <img src={lifeAtCompany.imageUrl} alt="life at company" />
          </div>
        </div>
        <h1 className="similar-heading">Similar Jobs</h1>
        <ul className="similar-container">
          {similarJobs.map(eachItem => (
            <SimilarJobs details={eachItem} key={eachItem.id} />
          ))}
        </ul>
      </div>
    )
  }

  detailsCondition = () => {
    const {status} = this.state
    switch (status) {
      case apiStatus.inProgress:
        return this.detailsLoader()
      case apiStatus.success:
        return this.detailsSuccess()
      case apiStatus.failure:
        return this.detailsFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="job-details-container">{this.detailsCondition()}</div>
      </div>
    )
  }
}

export default JobDetails
