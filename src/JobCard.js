import React, { useState } from "react";
import { Avatar } from "@mui/material";


const JobCard = ({ job }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);

    // formats the salary considering if theirs any null value in min salary or max salary
    const formatSalary = () => {
        if (job.minJdSalary && job.maxJdSalary) {
            return `₹ ${job.minJdSalary} - ${job.maxJdSalary} LPA`;
        } else if (job.minJdSalary) {
            return `₹ ${job.minJdSalary} LPA`;
        } else if (job.maxJdSalary) {
            return `₹ ${job.maxJdSalary} LPA`;
        } else {
            return "";
        }
    };

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    // Conditional styling based on job.minExp
    const experienceStyle = {
        visibility: job.minExp ? 'visible' : 'hidden'
    };

    return (
        <div className="job-card">
            
            <div className="heading">
                <h3>{job.companyName || 'No Company Name Available'}</h3>
                <p className="txt">{job.jobRole || 'No Job Role Available'}</p>
                <p className="loc">{job.location || 'No Location Available'}</p>
            </div>
            <div className="salary">
                <p>Estimated Salary: {formatSalary()}</p>
            </div>
            <div className="about">
                <p className="head">About Company:</p>
                <h4>About us</h4>
                <p className="desc">{showFullDescription ? job.jobDetailsFromCompany : `${job.jobDetailsFromCompany.substring(0, 300)}`}</p>
                <button className="descdet" onClick={toggleDescription}>
                    {showFullDescription ? "Hide Details" : "View Job"}
                </button>
            </div>
            <div className="experience" style={experienceStyle}>
                <h3>Minimum Experience</h3>
                <p>{job.minExp} years</p>
            </div>
            <div className="buttons">
            <a href={job.jdLink} className="easy">
                     ⚡ Easy Apply</a>
                <button className="refer">
                    <div className="ava">
                        <Avatar className="blur-avatar" alt="Remy Sharp" src="https://t3.ftcdn.net/jpg/05/61/43/26/360_F_561432620_ghqin7jE48RP4B6JrOpCpio536LOeTVC.jpg" />
                        <Avatar className="blur-avatar" alt="Travis Howard" src="https://t4.ftcdn.net/jpg/02/45/56/35/360_F_245563558_XH9Pe5LJI2kr7VQuzQKAjAbz9PAyejG1.jpg" />
                        <span>Unlock Referral Asks</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default JobCard;
