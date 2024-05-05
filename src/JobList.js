import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import JobCard from './JobCard';

// Given in the doc
const fetchJobs = async (limit, offset) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const body = JSON.stringify({ limit, offset });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body
    };

    try {
        const response = await fetch("https://api.weekday.technology/adhoc/getSampleJdJSON", requestOptions);
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + data.message);
        }
        return { jobs: data.jdList, totalCount: data.totalCount };
    } catch (error) {
        console.error('Failed to fetch jobs:', error.message);
        return { jobs: [], totalCount: 0 };
    }
};

// Lists the job
const JobList = () => {

    // various states which takes care of state change
    const [jobs, setJobs] = useState([]);
    const [displayJobs, setDisplayJobs] = useState([]);
    const [companyFilter, setCompanyFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [experienceFilter, setExperienceFilter] = useState('');
    const [salaryFilter, setSalaryFilter] = useState('');
    const [remoteFilter, setRemoteFilter] = useState('');  
    const [locationFilter, setLocationFilter] = useState('');  
    const [offset, setOffset] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 10;

    //part of infinite scroll checks and displays if any more date is present to be displayed
    const fetchMoreData = () => {
        if (jobs.length >= totalCount) return;
        fetchJobs(limit, offset).then(data => {
            setJobs(prevJobs => [...prevJobs, ...data.jobs]);
            setOffset(prevOffset => prevOffset + limit);
        });
    };

    // Filters the job cards
    useEffect(() => {
        const filteredJobs = jobs.filter(job =>
            (!companyFilter || job.companyName.toLowerCase().includes(companyFilter.toLowerCase())) &&
            (!roleFilter || job.jobRole.toLowerCase().includes(roleFilter.toLowerCase())) &&
            (!experienceFilter || (job.minExp && job.minExp >= parseInt(experienceFilter))) &&
            (!salaryFilter || (job.minJdSalary && job.minJdSalary >= parseInt(salaryFilter))) &&
            (!remoteFilter || (remoteFilter === 'Remote' ? job.location.toLowerCase().includes('remote') : !job.location.toLowerCase().includes('remote'))) &&
            (!locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase()))
        );
        setDisplayJobs(filteredJobs);
    }, [companyFilter, roleFilter, experienceFilter, salaryFilter, remoteFilter, locationFilter, jobs]);

    useEffect(() => {
        fetchJobs(limit, 0).then(data => {
            setJobs(data.jobs);
            setTotalCount(data.totalCount);
        });
    }, []);

    return (
        <>
            <div className='header'>
           
            <input className='nav' type="text" placeholder="Search Company Name" value={companyFilter} onChange={e => setCompanyFilter(e.target.value)} />
            <input className='nav' type="text" placeholder="Roles" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} />
            <select className='nav' value={experienceFilter} onChange={e => setExperienceFilter(e.target.value)}>
                <option value="">Experience</option>
                <option value="1">1+ Years</option>
                <option value="3">3+ Years</option>
                <option value="5">5+ Years</option>
                <option value="8">8+ Years</option>
                <option value="10">10+ Years</option>
            </select>
            <select className='nav' value={salaryFilter} onChange={e => setSalaryFilter(e.target.value)}>
                <option value="">Minimum Base Pay Salary</option>
                <option value="5">₹5 LPA+</option>
                <option value="10">₹10 LPA+</option>
                <option value="20">₹20 LPA+</option>
                <option value="30">₹30 LPA+</option>
                <option value="50">₹50 LPA+</option>
                <option value="80">₹80 LPA+</option>

            </select>
            <select className='nav' value={remoteFilter} onChange={e => {
                setRemoteFilter(e.target.value);
                if (e.target.value !== 'Onsite') {
                    setLocationFilter('');  
                }
            }}>
                <option value="">Location</option>
                <option value="Remote">Remote</option>
                <option value="Onsite">Onsite</option>
            </select>
            {remoteFilter === 'Onsite' && (
                <input className='nav' type="text" placeholder="Enter specific location" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} />
            )}
             </div>
            <InfiniteScroll
                dataLength={displayJobs.length}
                next={fetchMoreData}
                hasMore={displayJobs.length < totalCount}
                loader={<h4>Loading...</h4>}
            >
                <div className="job-grid">
                    {displayJobs.map(job => <JobCard key={job.id || job.title} job={job} />)}
                </div>
            </InfiniteScroll>
        </>
    );
};

export default JobList;
