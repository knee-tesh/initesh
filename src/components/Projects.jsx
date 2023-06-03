import { projectData } from './data.js';

const Projects = () => {
    return (
        <div className="projects-container">
            <h2>Experience</h2>
            <div className="projects-grid">
                {projectData && projectData.map((project) => (
                    <div className="project-card" key={project.id}>
                        <div className='project-marker'></div>
                        <div className="project-header">
                        <h2>{project.title}</h2>
                            <div className="small-icons">
                                <a href={project.website} target='_blank'><i className="fa-solid fa-link"></i></a>
                            </div>
                        </div>
                        <h3 className='project-position'>{project.position}</h3>
                        <p>{project.description}</p>
                    </div>
                ))
                }
            </div>
        </div>
    )
}

export default Projects;