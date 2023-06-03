const educationData = [
    {
        id:1,
        years: '2012-2016',
        college: 'KIET',
        degree: 'Electronics and Instrumentation Engineering',
        place: 'Ghaziabad, UP',
        website: 'https://www.kiet.edu'
    },
    {
        id:2,
        years: '2011-2012',
        college: 'Kendriya Vidyalaya',
        degree: 'High School',
        place: 'Lucknow, UP',
        website: 'https://rdsolucknow.kvs.ac.in/'
    }
]

const Education = () => {
    return (<div className="projects-container">
            <h2>Education</h2>
            <div className="projects-grid">
                {educationData && educationData.map((education) => (
                    <div className="project-card" key={education.id}>
                        <div className='project-marker'></div>
                        <p>{education.years}</p>
                        <div className="project-header">
                        <h2>{education.college}</h2>
                            <div className="small-icons">
                                <a href={education.website} target='_blank'><i className="fa-solid fa-link"></i></a>
                            </div>
                        </div>
                        <h3 className='project-position'>{education.degree}</h3>
                        <p>{education.place}</p>
                    </div>
                ))
                }
            </div>
        </div>)
}

export default Education