import React from 'react';
import { Link } from 'gatsby';
import './project.scss';

interface ProjectProps {
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
}

const Project: React.FC<ProjectProps> = ({ title, description, imageUrl, projectUrl }) => {
  return (
    <div className="project-tile">
      <Link to={projectUrl} className="project-link">
        <div className="project-image" style={{ backgroundImage: `url(${imageUrl})` }}>
          <div className="project-overlay">
            <h3 className="project-title">{title}</h3>
            <p className="project-description">{description}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Project;