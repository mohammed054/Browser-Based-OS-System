import React, { useState } from 'react';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(1);

  const projects = [
    {
      id: 1,
      title: 'Browser OS Portfolio',
      description: 'A complete browser-based operating system featuring window management, multiple apps, terminal, and portfolio integration. This system proves advanced React patterns, state management, and creative UI engineering.',
      tech: ['React', 'JavaScript', 'CSS', 'State Management', 'Window Management'],
      status: 'Completed',
      githubUrl: '#',
      liveUrl: '#',
      openAction: 'current',
      features: [
        'Window management with drag/resize',
        'Terminal with portfolio commands', 
        'Multiple integrated apps',
        'System themes and notifications',
        'Desktop icon management',
        'Taskbar and start menu'
      ],
      highlights: [
        '💡 Creative UI engineering',
        '⚡ Advanced state management', 
        '🎨 Consistent design system',
        '🔧 System-level interactions'
      ]
    },
    {
      id: 2,
      title: 'E-Commerce Platform',
      description: 'Modern e-commerce solution with real-time inventory management, secure payment processing, and comprehensive admin dashboard.',
      tech: ['Node.js', 'MongoDB', 'React', 'Stripe API', 'Redis'],
      status: 'WIP',
      githubUrl: '#',
      liveUrl: '#',
      openAction: 'demo',
      features: [
        'Real-time inventory tracking',
        'Secure payment processing',
        'Admin dashboard',
        'User authentication',
        'Order management'
      ],
      highlights: [
        '🛒 Full-stack development',
        '💳 Payment integration',
        '📊 Analytics dashboard',
        '🔒 Security focused'
      ]
    },
    {
      id: 3,
      title: 'AI Chat Assistant',
      description: 'Intelligent chatbot with natural language processing, context awareness, and machine learning capabilities.',
      tech: ['Python', 'TensorFlow', 'NLP', 'FastAPI', 'Docker'],
      status: 'Planning',
      githubUrl: '#',
      liveUrl: '#',
      openAction: 'docs',
      features: [
        'Natural language understanding',
        'Context awareness',
        'Machine learning models',
        'API integration',
        'Multi-language support'
      ],
      highlights: [
        '🤖 AI/ML expertise',
        '🧠 NLP implementation',
        '🌐 API development',
        '📱 Responsive design'
      ]
    },
    {
      id: 4,
      title: 'Component Library',
      description: 'Reusable React component library with comprehensive documentation, TypeScript support, and theme system.',
      tech: ['React', 'TypeScript', 'Storybook', 'Rollup', 'Jest'],
      status: 'Completed',
      githubUrl: '#',
      liveUrl: '#',
      openAction: 'storybook',
      features: [
        '50+ reusable components',
        'TypeScript support',
        'Theme system',
        'Comprehensive docs',
        'Accessibility focused'
      ],
      highlights: [
        '📚 Component engineering',
        '🎨 Design system',
        '📖 Documentation skills',
        '♿ Accessibility focus'
      ]
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Completed': '#22c55e',
      'WIP': '#3b82f6', 
      'Planning': '#f59e0b'
    };
    return colors[status] || '#6b7280';
  };

  const getTechIcon = (tech) => {
    const icons = {
      'React': '⚛️',
      'JavaScript': '🟨',
      'CSS': '🎨',
      'Node.js': '🟩',
      'MongoDB': '🍃',
      'Python': '🐍',
      'TypeScript': '🔷',
      'Docker': '🐳'
    };
    return icons[tech] || '💻';
  };

  const handleProjectAction = (project, action) => {
    switch (action) {
      case 'open':
        if (project.openAction === 'current') {
          alert('You are currently viewing this project!');
        } else {
          console.log(`Opening ${project.title}...`);
        }
        break;
      case 'github':
        console.log(`Opening GitHub for ${project.title}...`);
        break;
      case 'live':
        console.log(`Opening live demo for ${project.title}...`);
        break;
      default:
        break;
    }
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  return (
    <div style={{ 
      width: '520px',
      height: '420px',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      color: 'white',
      display: 'flex',
      overflow: 'hidden'
    }}>
      {/* Left Sidebar - Project List */}
      <div style={{
        width: '180px',
        background: 'rgba(15, 23, 42, 0.8)',
        borderRight: '1px solid rgba(56, 189, 248, 0.2)',
        overflow: 'auto'
      }}>
        <div style={{ padding: '12px', borderBottom: '1px solid rgba(56, 189, 248, 0.2)' }}>
          <h3 style={{ fontSize: '14px', color: '#38bdf8', margin: 0, fontWeight: 'bold' }}>
            📂 Projects
          </h3>
        </div>
        
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project.id)}
            style={{
              padding: '12px',
              borderBottom: '1px solid rgba(56, 189, 248, 0.1)',
              cursor: 'pointer',
              background: selectedProject === project.id 
                ? 'rgba(56, 189, 248, 0.2)' 
                : 'transparent',
              transition: 'all 0.2s ease',
              borderLeft: selectedProject === project.id 
                ? '3px solid #38bdf8' 
                : '3px solid transparent'
            }}
            onMouseEnter={(e) => {
              if (selectedProject !== project.id) {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedProject !== project.id) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <div style={{ fontSize: '12px', color: '#38bdf8', marginBottom: '4px', fontWeight: 'bold' }}>
              {project.title}
            </div>
            <div style={{ 
              fontSize: '10px', 
              color: getStatusColor(project.status), 
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
              {project.status}
            </div>
            <div style={{ marginTop: '4px', display: 'flex', gap: '2px' }}>
              {project.tech.slice(0, 3).map((tech, idx) => (
                <span key={idx} style={{ fontSize: '10px' }}>
                  {getTechIcon(tech)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Right Panel - Project Details */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {selectedProjectData ? (
          <>
            {/* Project Header */}
            <div style={{ 
              padding: '16px', 
              borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
              background: 'rgba(56, 189, 248, 0.05)'
            }}>
              <h2 style={{ fontSize: '18px', color: '#38bdf8', margin: 0, marginBottom: '8px' }}>
                {selectedProjectData.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span 
                  style={{ 
                    fontSize: '11px', 
                    color: getStatusColor(selectedProjectData.status), 
                    fontWeight: 'bold',
                    background: `${getStatusColor(selectedProjectData.status)}20`,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}
                >
                  {selectedProjectData.status}
                </span>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {selectedProjectData.tech.slice(0, 5).map((tech, idx) => (
                    <span key={idx} style={{ fontSize: '11px' }}>
                      {getTechIcon(tech)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Content */}
            <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
              {/* Description */}
              <div style={{ marginBottom: '16px' }}>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#94a3b8', 
                  lineHeight: '1.4',
                  margin: 0
                }}>
                  {selectedProjectData.description}
                </p>
              </div>

              {/* Features */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '13px', color: '#38bdf8', margin: '0 0 8px 0' }}>
                  🔧 Key Features
                </h4>
                <ul style={{ 
                  margin: 0, 
                  padding: '0 0 0 16px', 
                  listStyle: 'none'
                }}>
                  {selectedProjectData.features.map((feature, idx) => (
                    <li key={idx} style={{ 
                      fontSize: '11px', 
                      color: '#94a3b8', 
                      marginBottom: '4px',
                      position: 'relative'
                    }}>
                      <span style={{ color: '#38bdf8', marginRight: '4px' }}>•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '13px', color: '#38bdf8', margin: '0 0 8px 0' }}>
                  🛠️ Tech Stack
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {selectedProjectData.tech.map((tech, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'rgba(56, 189, 248, 0.2)',
                        color: '#38bdf8',
                        padding: '3px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        border: '1px solid rgba(56, 189, 248, 0.3)'
                      }}
                    >
                      {getTechIcon(tech)} {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              {selectedProjectData.highlights && (
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '13px', color: '#38bdf8', margin: '0 0 8px 0' }}>
                    ✨ Highlights
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {selectedProjectData.highlights.map((highlight, idx) => (
                      <div key={idx} style={{ 
                        fontSize: '11px', 
                        color: '#94a3b8',
                        padding: '4px 6px',
                        background: 'rgba(56, 189, 248, 0.1)',
                        borderRadius: '4px',
                        border: '1px solid rgba(56, 189, 248, 0.2)'
                      }}>
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ 
              padding: '12px 16px', 
              borderTop: '1px solid rgba(56, 189, 248, 0.2)',
              background: 'rgba(15, 23, 42, 0.8)',
              display: 'flex',
              gap: '8px'
            }}>
              <button
                onClick={() => handleProjectAction(selectedProjectData, 'open')}
                style={{
                  flex: 1,
                  background: 'rgba(56, 189, 248, 0.2)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38bdf8',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(56, 189, 248, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(56, 189, 248, 0.2)';
                }}
              >
                🚀 Open
              </button>
              
              <button
                onClick={() => handleProjectAction(selectedProjectData, 'github')}
                style={{
                  flex: 1,
                  background: 'rgba(168, 85, 247, 0.2)',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  color: '#a855f7',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(168, 85, 247, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(168, 85, 247, 0.2)';
                }}
              >
                📁 Source
              </button>
              
              <button
                onClick={() => handleProjectAction(selectedProjectData, 'live')}
                style={{
                  flex: 1,
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  color: '#22c55e',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(34, 197, 94, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(34, 197, 94, 0.2)';
                }}
              >
                🌐 Live Demo
              </button>
            </div>
          </>
        ) : (
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
              <h3 style={{ fontSize: '16px', color: '#38bdf8', marginBottom: '8px' }}>
                Select a Project
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.4' }}>
                Choose a project from the sidebar to view details and explore features.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;