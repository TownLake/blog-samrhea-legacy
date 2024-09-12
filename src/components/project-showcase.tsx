.project-tile {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 75%; // 4:3 aspect ratio
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  
    &:hover {
      transform: translateY(-5px);
    }
  
    .project-link {
      text-decoration: none;
      color: inherit;
    }
  
    .project-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
    }
  
    .project-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 1rem;
      transform: translateY(100%);
      transition: transform 0.3s ease;
    }
  
    &:hover .project-overlay {
      transform: translateY(0);
    }
  
    .project-title {
      margin: 0 0 0.5rem;
      font-size: 1.2rem;
    }
  
    .project-description {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.8;
    }
  }