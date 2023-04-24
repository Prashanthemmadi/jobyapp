import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="link">
      <li className="jobs-list">
        <div className="company-container">
          <div className="company-card">
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="company-logo"
            />
            <div>
              <h1 className="job-title">{title}</h1>
              <div className="rating-card">
                <AiFillStar className="rating-icon" />
                <p className="rating">{rating}</p>
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
            <h1 className="salary">{packagePerAnnum}</h1>
          </div>
          <hr />
          <h1 className="head">Description</h1>
          <p className="description">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobItem
