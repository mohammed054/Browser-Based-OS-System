import React, { useState } from 'react';

const Resume = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isDownloading, setIsDownloading] = useState(false);

  const resumeContent = {
    personal: {
      name: 'Mohammed Hassoun',
      title: 'Frontend Engineer / OS-style UI Builder',
      location: 'San Francisco, CA',
      email: 'mohammed.hassoun@example.com',
      phone: '+1 (555) 123-4567',
      linkedin: 'linkedin.com/in/mohammedhassoun',
      github: 'github.com/mhassoun'
    },
    summary: `Passionate frontend engineer with 5+ years of experience building innovative web applications and browser-based experiences. Specialized in React, advanced UI/UX design, and system architecture. Proven track record of delivering high-performance, user-centric solutions that push the boundaries of what's possible in modern browsers.`,
    experience: [
      {
        title: 'Senior Frontend Engineer',
        company: 'Tech Innovations Inc.',
        period: '2022 - Present',
        description: 'Lead development of enterprise web applications using React and modern JavaScript frameworks.',
        achievements: [
          'Improved application performance by 40% through optimization techniques',
          'Led a team of 5 developers in implementing best practices',
          'Implemented comprehensive CI/CD pipelines reducing deployment time by 60%'
        ]
      },
      {
        title: 'Full Stack Developer',
        company: 'Digital Solutions LLC',
        period: '2020 - 2022',
        description: 'Developed and maintained full-stack web applications with Node.js and React.',
        achievements: [
          'Built 10+ production applications serving 100K+ users',
          'Reduced server costs by 30% through architectural improvements',
          'Mentored junior developers and conducted code reviews'
        ]
      },
      {
        title: 'Frontend Developer',
        company: 'StartUp Hub',
        period: '2019 - 2020',
        description: 'Created responsive and interactive user interfaces for various client projects.',
        achievements: [
          'Delivered 20+ client projects with 100% satisfaction rate',
          'Implemented responsive design patterns ensuring cross-device compatibility',
          'Collaborated closely with design teams to bring concepts to life'
        ]
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of Technology',
        period: '2015 - 2019',
        gpa: '3.8/4.0',
        achievements: [
          'Dean\'s List for 6 semesters',
          'President of Coding Club',
          'Graduated Magna Cum Laude'
        ]
      }
    ],
    skills: {
      frontend: ['React', 'JavaScript', 'TypeScript', 'HTML5/CSS3', 'Tailwind CSS', 'Next.js'],
      backend: ['Node.js', 'Python', 'Express.js', 'MongoDB', 'PostgreSQL', 'REST APIs'],
      tools: ['Git', 'Docker', 'AWS', 'VS Code', 'Figma', 'Webpack'],
      soft: ['Problem Solving', 'Team Leadership', 'Project Management', 'Communication']
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${resumeContent.personal.name} - Resume</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .name { font-size: 32px; margin: 0; color: #1a1a1a; }
            .title { font-size: 18px; color: #666; margin: 5px 0; }
            .contact { margin: 15px 0; font-size: 14px; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 20px; font-weight: bold; color: #1a1a1a; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            .item { margin-bottom: 20px; }
            .item-title { font-weight: bold; color: #1a1a1a; }
            .item-period { color: #666; font-style: italic; }
            .achievements { margin-left: 20px; }
            .achievements li { margin-bottom: 5px; }
            .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .skill-category { margin-bottom: 15px; }
            .skill-title { font-weight: bold; color: #1a1a1a; }
            .skill-list { display: flex; flex-wrap: wrap; gap: 5px; }
            .skill-tag { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="name">${resumeContent.personal.name}</h1>
            <p class="title">${resumeContent.personal.title}</p>
            <div class="contact">
              ${resumeContent.personal.email} | ${resumeContent.personal.phone} | ${resumeContent.personal.location}
            </div>
            <div class="contact">
              ${resumeContent.personal.linkedin} | ${resumeContent.personal.github}
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Professional Summary</h2>
            <p>${resumeContent.summary}</p>
          </div>

          <div class="section">
            <h2 class="section-title">Experience</h2>
            ${resumeContent.experience.map(exp => `
              <div class="item">
                <div class="item-title">${exp.title} - ${exp.company}</div>
                <div class="item-period">${exp.period}</div>
                <p>${exp.description}</p>
                <ul class="achievements">
                  ${exp.achievements.map(ach => `<li>${ach}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2 class="section-title">Education</h2>
            ${resumeContent.education.map(edu => `
              <div class="item">
                <div class="item-title">${edu.degree}</div>
                <div class="item-period">${edu.school} | ${edu.period} | GPA: ${edu.gpa}</div>
                <ul class="achievements">
                  ${edu.achievements.map(ach => `<li>${ach}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2 class="section-title">Skills</h2>
            <div class="skills-grid">
              ${Object.entries(resumeContent.skills).map(([category, skills]) => `
                <div class="skill-category">
                  <div class="skill-title">${category.charAt(0).toUpperCase() + category.slice(1)}</div>
                  <div class="skill-list">
                    ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </body>
        </html>
      `;

      // Create blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeContent.personal.name.replace(' ', '_')}_Resume.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Show success message
      setTimeout(() => {
        setIsDownloading(false);
        alert('Resume downloaded successfully! You can open the HTML file in your browser or print to PDF.');
      }, 1000);

    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
      alert('Download failed. Please try again.');
    }
  };

  const handleZoom = (direction) => {
    if (direction === 'in' && zoomLevel < 150) {
      setZoomLevel(zoomLevel + 10);
    } else if (direction === 'out' && zoomLevel > 50) {
      setZoomLevel(zoomLevel - 10);
    } else if (direction === 'reset') {
      setZoomLevel(100);
    }
  };

  return (
    <div style={{ 
      width: '100%',
      height: '100%',
      minHeight: 0,
      background: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      // Fix content scaling for maximized windows
      transform: 'none',
      transformOrigin: 'top left'
    }}>
      {/* PDF Viewer Toolbar */}
      <div style={{
        height: '40px',
        background: '#e0e0e0',
        borderBottom: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px'
      }}>
        {/* Left side - File info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#666' }}>📄</span>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#333' }}>
            {resumeContent.personal.name}_Resume.pdf
          </span>
        </div>

        {/* Center - Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              background: currentPage === 1 ? '#ccc' : '#fff',
              border: '1px solid #999',
              borderRadius: '3px',
              padding: '4px 8px',
              fontSize: '11px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            ←
          </button>
          <span style={{ fontSize: '12px', color: '#333' }}>
            Page {currentPage} of 1
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(1, currentPage + 1))}
            disabled={currentPage === 1}
            style={{
              background: currentPage === 1 ? '#ccc' : '#fff',
              border: '1px solid #999',
              borderRadius: '3px',
              padding: '4px 8px',
              fontSize: '11px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            →
          </button>
        </div>

        {/* Right side - Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={() => handleZoom('out')}
            style={{
              background: '#fff',
              border: '1px solid #999',
              borderRadius: '3px',
              padding: '2px 6px',
              fontSize: '10px',
              cursor: 'pointer'
            }}
          >
            −
          </button>
          <span style={{ fontSize: '11px', color: '#333', minWidth: '35px', textAlign: 'center' }}>
            {zoomLevel}%
          </span>
          <button
            onClick={() => handleZoom('in')}
            style={{
              background: '#fff',
              border: '1px solid #999',
              borderRadius: '3px',
              padding: '2px 6px',
              fontSize: '10px',
              cursor: 'pointer'
            }}
          >
            +
          </button>
          <div style={{ width: '1px', height: '20px', background: '#ccc', margin: '0 4px' }} />
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            style={{
              background: isDownloading ? '#ccc' : '#007acc',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              padding: '4px 8px',
              fontSize: '10px',
              cursor: isDownloading ? 'not-allowed' : 'pointer'
            }}
          >
            {isDownloading ? '⏳' : '⬇'} Download
          </button>
        </div>
      </div>

      {/* PDF Content Area */}
      <div style={{ 
        flex: 1,
        background: 'white',
        overflow: 'auto',
        padding: '20px',
        transform: `scale(${zoomLevel / 100})`,
        transformOrigin: 'top center'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
          fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
          fontSize: '12px',
          lineHeight: '1.6',
          color: '#333'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '24px', margin: '0', color: '#1a1a1a' }}>
              {resumeContent.personal.name}
            </h1>
            <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
              {resumeContent.personal.title}
            </p>
            <div style={{ fontSize: '11px', color: '#666', margin: '15px 0' }}>
              {resumeContent.personal.email} | {resumeContent.personal.phone} | {resumeContent.personal.location}
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              {resumeContent.personal.linkedin} | {resumeContent.personal.github}
            </div>
          </div>

          {/* Summary */}
          <div style={{ marginBottom: '25px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a1a', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
              Professional Summary
            </h2>
            <p style={{ fontSize: '11px', margin: '10px 0' }}>
              {resumeContent.summary}
            </p>
          </div>

          {/* Experience */}
          <div style={{ marginBottom: '25px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a1a', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
              Experience
            </h2>
            {resumeContent.experience.map((exp, index) => (
              <div key={index} style={{ marginBottom: '15px' }}>
                <div style={{ fontWeight: 'bold', color: '#1a1a1a', fontSize: '12px' }}>
                  {exp.title} - {exp.company}
                </div>
                <div style={{ color: '#666', fontStyle: 'italic', fontSize: '10px', marginBottom: '5px' }}>
                  {exp.period}
                </div>
                <p style={{ fontSize: '10px', margin: '5px 0' }}>
                  {exp.description}
                </p>
                <ul style={{ marginLeft: '15px', margin: '5px 0', fontSize: '10px' }}>
                  {exp.achievements.map((ach, achIndex) => (
                    <li key={achIndex} style={{ marginBottom: '3px' }}>
                      {ach}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Education */}
          <div style={{ marginBottom: '25px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a1a', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
              Education
            </h2>
            {resumeContent.education.map((edu, index) => (
              <div key={index} style={{ marginBottom: '15px' }}>
                <div style={{ fontWeight: 'bold', color: '#1a1a1a', fontSize: '12px' }}>
                  {edu.degree}
                </div>
                <div style={{ color: '#666', fontStyle: 'italic', fontSize: '10px', marginBottom: '5px' }}>
                  {edu.school} | {edu.period} | GPA: {edu.gpa}
                </div>
                <ul style={{ marginLeft: '15px', margin: '5px 0', fontSize: '10px' }}>
                  {edu.achievements.map((ach, achIndex) => (
                    <li key={achIndex} style={{ marginBottom: '3px' }}>
                      {ach}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a1a', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
              Skills
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {Object.entries(resumeContent.skills).map(([category, skills]) => (
                <div key={category} style={{ marginBottom: '10px' }}>
                  <div style={{ fontWeight: 'bold', color: '#1a1a1a', fontSize: '11px', marginBottom: '5px' }}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                    {skills.map((skill, skillIndex) => (
                      <span key={skillIndex} style={{
                        background: '#f0f0f0',
                        padding: '1px 4px',
                        borderRadius: '2px',
                        fontSize: '9px',
                        border: '1px solid #ddd'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        height: '24px',
        background: '#e0e0e0',
        borderTop: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        color: '#666'
      }}>
        Ready • {resumeContent.personal.name}_Resume.pdf • 1 page • HTML-to-PDF format
      </div>
    </div>
  );
};

export default Resume;
