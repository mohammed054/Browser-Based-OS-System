import React from 'react';

const About = () => {
  const personalInfo = {
    name: 'Mohammed Hassoun',
    title: 'Frontend Engineer / OS-style UI builder',
    location: 'San Francisco, CA',
    experience: '5+ years',
    education: 'B.S. Computer Science',
    bio: 'Passionate frontend engineer specializing in creating immersive browser-based experiences and innovative user interfaces.',
    languages: ['English', 'Arabic', 'Spanish'],
    interests: ['Open Source', 'UI/UX Design', 'System Architecture', 'Performance Optimization']
  };

  const handleAction = (action) => {
    // Action handlers for buttons
    switch (action) {
      case 'projects':
        // Will trigger opening Projects app
        console.log('Opening Projects...');
        break;
      case 'terminal':
        // Will trigger opening Terminal app
        console.log('Opening Terminal...');
        break;
      case 'contact':
        // Will trigger opening Contact app
        console.log('Opening Contact...');
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ 
      width: '100%',
      height: '100%',
      minHeight: 0,
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      color: 'white',
      display: 'flex',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Animated gradient background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(56, 189, 248, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
          animation: 'gradientShift 8s ease-in-out infinite',
          zIndex: 0
        }}
      />
      
      {/* Left side - 60% for visuals */}
      <div style={{ 
        width: '60%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Avatar with cyan glow */}
        <div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 0 40px rgba(56, 189, 248, 0.6), 0 0 80px rgba(56, 189, 248, 0.3)',
            marginBottom: '20px',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        >
          MH
        </div>
        
        {/* Soft cyan glow behind avatar */}
        <div
          style={{
            position: 'absolute',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%)',
            filter: 'blur(20px)',
            animation: 'glow 3s ease-in-out infinite alternate'
          }}
        />
      </div>

      {/* Right side - 40% for content */}
      <div style={{ 
        width: '40%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        padding: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Name and title */}
        <div>
          <h1 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#38bdf8', 
            marginBottom: '8px',
            lineHeight: '1.2'
          }}>
            {personalInfo.name}
          </h1>
          <p style={{ 
            fontSize: '12px', 
            color: '#94a3b8', 
            lineHeight: '1.4',
            marginBottom: '12px'
          }}>
            {personalInfo.title}
          </p>
          
          {/* Short bio */}
          <p style={{ 
            fontSize: '11px', 
            color: '#64748b', 
            lineHeight: '1.3',
            marginBottom: '16px'
          }}>
            {personalInfo.bio}
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => handleAction('projects')}
            style={{
              background: 'rgba(56, 189, 248, 0.2)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(56, 189, 248, 0.3)';
              e.target.style.borderColor = '#38bdf8';
              e.target.style.transform = 'translateX(2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(56, 189, 248, 0.2)';
              e.target.style.borderColor = 'rgba(56, 189, 248, 0.4)';
              e.target.style.transform = 'translateX(0)';
            }}
          >
            🚀 View Projects
          </button>
          
          <button
            onClick={() => handleAction('terminal')}
            style={{
              background: 'rgba(168, 85, 247, 0.2)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              color: '#a855f7',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(168, 85, 247, 0.3)';
              e.target.style.borderColor = '#a855f7';
              e.target.style.transform = 'translateX(2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(168, 85, 247, 0.2)';
              e.target.style.borderColor = 'rgba(168, 85, 247, 0.4)';
              e.target.style.transform = 'translateX(0)';
            }}
          >
            💻 Open Terminal
          </button>
          
          <button
            onClick={() => handleAction('contact')}
            style={{
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              color: '#22c55e',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(34, 197, 94, 0.3)';
              e.target.style.borderColor = '#22c55e';
              e.target.style.transform = 'translateX(2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(34, 197, 94, 0.2)';
              e.target.style.borderColor = 'rgba(34, 197, 94, 0.4)';
              e.target.style.transform = 'translateX(0)';
            }}
          >
            ✉️ Contact Me
          </button>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes glow {
          0% { opacity: 0.4; transform: scale(1); }
          100% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default About;
