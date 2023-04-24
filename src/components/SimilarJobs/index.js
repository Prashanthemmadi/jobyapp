import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobs = props => {
  const {details} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = details
  return (
    <li className="similar-list">
      <div className="similar-logo-card">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="similar-logo"
        />
        <div>
          <h1 className="title">{title}</h1>
          <div className="rating-card">
            <AiFillStar className="rating-icon" />
            <p className="rating">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="description">Description</h1>
      <p className="para1">{jobDescription}</p>
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
    </li>
  )
}

export default SimilarJobs
