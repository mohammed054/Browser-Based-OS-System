import React, { useState, useEffect } from 'react';

/**
 * Mobile Fallback Component
 * Detects mobile devices and provides simplified portfolio experience
 */
const MobileFallback = ({ onContinue, onSimplified }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 768 ||
        'ontouchstart' in window
      );
      
      setIsMobile(isMobileDevice);
      
      // Show message after a short delay on mobile
      if (isMobileDevice) {
        setTimeout(() => setShowMessage(true), 2000);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile || !showMessage) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999,
      padding: '20px',
      textAlign: 'center',
      color: 'white',
      fontFamily: 'var(--font-ui, system-ui, sans-serif)'
    }}>
      {/* Icon */}
      <div style={{
        width: '80px',
        height: '80px',
        background: 'linear-gradient(135deg, var(--os-cyan, #38bdf8), var(--os-cyan-hover, rgba(56, 189, 248, 0.2)))',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '40px',
        marginBottom: '20px',
        animation: 'mobile-bounce 2s infinite'
      }}>
        📱
      </div>

      {/* Title */}
      <h1 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        margin: '0 0 10px 0',
        background: 'linear-gradient(45deg, #38bdf8, #a855f7)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        MohammedOS
      </h1>

      <p style={{
        fontSize: '16px',
        margin: '0 0 20px 0',
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: '1.4'
      }}>
        Best experienced on desktop
      </p>

      {/* Message */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '30px',
        maxWidth: '400px'
      }}>
        <p style={{
          margin: '0 0 15px 0',
          fontSize: '14px',
          lineHeight: '1.5',
          color: 'rgba(255, 255, 255, 0.8)'
        }}>
          This interactive OS-style portfolio requires keyboard, mouse, and a larger screen for the full experience.
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '10px',
          fontSize: '12px',
          textAlign: 'left',
          color: 'rgba(255, 255, 255, 0.6)'
        }}>
          <div>⌨️</div>
          <div>Keyboard shortcuts (Ctrl+Space, Alt+Tab)</div>
          <div>🖱️</div>
          <div>Precise mouse interactions</div>
          <div>🖼️</div>
          <div>Window management system</div>
          <div>🎮</div>
          <div>Interactive Easter eggs</div>
        </div>
      </div>

      {/* Options */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        width: '100%',
        maxWidth: '300px'
      }}>
        <button
          onClick={onContinue}
          style={{
            background: 'linear-gradient(135deg, var(--os-cyan, #38bdf8), var(--os-cyan-hover, rgba(56, 189, 248, 0.2)))',
            border: 'none',
            borderRadius: '12px',
            padding: '15px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(56, 189, 248, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(56, 189, 248, 0.3)';
          }}
        >
          Try Anyway 🚀
        </button>

        <button
          onClick={onSimplified}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            padding: '15px 20px',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.8)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
        >
          View Simplified Portfolio 📄
        </button>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.5)'
      }}>
        💡 Tip: Come back on desktop for the full experience!
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes mobile-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

/**
 * Simplified Portfolio Component
 * Mobile-friendly version of the portfolio
 */
const SimplifiedPortfolio = ({ onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#0a0a0a',
      color: 'white',
      overflow: 'auto',
      padding: '20px',
      fontFamily: 'var(--font-ui, system-ui, sans-serif)',
      zIndex: 999998
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{
          fontSize: '24px',
          margin: 0,
          background: 'linear-gradient(45deg, #38bdf8, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Mohammed Hassoun
        </h1>
        <button
          onClick={onClose}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'transparent',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>
      </div>

      {/* About Section */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#38bdf8' }}>
          About Me
        </h2>
        <p style={{ lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.9)' }}>
          Frontend Engineer specializing in React, modern web technologies, and creative UI/UX design. 
          I build sophisticated user interfaces that blur the line between web and native applications.
        </p>
      </section>

      {/* Skills Section */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#38bdf8' }}>
          Technical Skills
        </h2>
        <div style={{ display: 'grid', gap: '10px' }}>
          {[
            { name: 'React', level: 90 },
            { name: 'JavaScript', level: 85 },
            { name: 'TypeScript', level: 75 },
            { name: 'CSS3', level: 90 },
            { name: 'Node.js', level: 85 },
            { name: 'Python', level: 80 }
          ].map(skill => (
            <div key={skill.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>{skill.name}</span>
                <span>{skill.level}%</span>
              </div>
              <div style={{
                height: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${skill.level}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #38bdf8, #a855f7)',
                  borderRadius: '4px',
                  transition: 'width 1s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#38bdf8' }}>
          Featured Projects
        </h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          {[
            {
              title: 'Browser-Based OS System',
              description: 'Interactive OS-style portfolio with window management, apps, and Easter eggs',
              tech: 'React, CSS3, JavaScript'
            },
            {
              title: 'E-Commerce Platform',
              description: 'Full-stack shopping solution with payment processing and inventory management',
              tech: 'React, Node.js, MongoDB'
            },
            {
              title: 'AI Chat Assistant',
              description: 'Machine learning powered conversational interface with NLP capabilities',
              tech: 'Python, TensorFlow, React'
            }
          ].map((project, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '15px'
              }}
            >
              <h3 style={{ margin: '0 0 8px 0', color: 'white' }}>
                {project.title}
              </h3>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                {project.description}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Tech: {project.tech}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#38bdf8' }}>
          Contact
        </h2>
        <div style={{ display: 'grid', gap: '10px' }}>
          {[
            { icon: '📧', label: 'Email', value: 'mohammed.hassoun@example.com' },
            { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/mohammedhassoun' },
            { icon: '🐙', label: 'GitHub', value: 'github.com/mhassoun' }
          ].map((contact, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>{contact.icon}</span>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  {contact.label}
                </div>
                <div style={{ color: '#38bdf8' }}>
                  {contact.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '20px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.6)'
      }}>
        <p style={{ margin: '0 0 10px 0' }}>
          🎯 For the full interactive experience, view this portfolio on a desktop computer!
        </p>
        <p style={{ margin: 0, fontSize: '12px' }}>
          Built with React and creative UI engineering
        </p>
      </div>
    </div>
  );
};

export { MobileFallback, SimplifiedPortfolio };