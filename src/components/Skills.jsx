import React, { useState, useEffect } from 'react';

const Skills = () => {
  const [animatedSkills, setAnimatedSkills] = useState({});
  const [systemStatus, setSystemStatus] = useState('ONLINE');

  const skillModules = {
    'Frontend.js': [
      { name: 'React', level: 90 },
      { name: 'JavaScript', level: 85 },
      { name: 'TypeScript', level: 75 },
      { name: 'HTML/CSS', level: 90 }
    ],
    'Backend.sys': [
      { name: 'Node.js', level: 85 },
      { name: 'Python', level: 80 },
      { name: 'Express.js', level: 80 },
      { name: 'REST APIs', level: 85 }
    ],
    'Database.dll': [
      { name: 'MongoDB', level: 75 },
      { name: 'PostgreSQL', level: 70 },
      { name: 'Redis', level: 65 }
    ],
    'Tools.exe': [
      { name: 'Git', level: 85 },
      { name: 'Docker', level: 70 },
      { name: 'AWS', level: 65 },
      { name: 'VS Code', level: 90 }
    ],
    'UX.lib': [
      { name: 'Problem Solving', level: 90 },
      { name: 'Team Collaboration', level: 85 },
      { name: 'Communication', level: 80 },
      { name: 'Project Management', level: 75 }
    ]
  };

  // Animate skill bars on mount
  useEffect(() => {
    const timers = {};
    
    Object.entries(skillModules).forEach(([moduleName, skills], moduleIndex) => {
      skills.forEach((skill, skillIndex) => {
        const key = `${moduleName}-${skill.name}`;
        timers[key] = setTimeout(() => {
          setAnimatedSkills(prev => ({ ...prev, [key]: true }));
        }, 100 + (moduleIndex * 200) + (skillIndex * 100));
      });
    });

    return () => {
      Object.values(timers).forEach(timer => clearTimeout(timer));
    };
  }, []);

  const getBarColor = (level) => {
    if (level >= 90) return '#22c55e';  // Green
    if (level >= 80) return '#3b82f6';  // Blue
    if (level >= 70) return '#f59e0b';  // Yellow
    return '#ef4444';  // Red
  };

  const getNeonShadow = (color) => `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`;

  return (
    <div style={{ 
      width: '520px',
      height: '420px',
      background: '#0a0a0a',
      color: '#00ff00',
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      padding: '16px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Scan line effect */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00ff00, transparent)',
          animation: 'scanline 3s linear infinite',
          zIndex: 10
        }}
      />

      {/* System Header */}
      <div style={{ 
        marginBottom: '12px', 
        borderBottom: '1px solid #00ff00',
        paddingBottom: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#00ff00' }}>
            SKILLS.SYS v2.1
          </div>
          <div style={{ fontSize: '9px', color: '#00cc00' }}>
            System Diagnostics Interface
          </div>
        </div>
        <div style={{ 
          fontSize: '10px', 
          color: systemStatus === 'ONLINE' ? '#00ff00' : '#ff0000',
          background: `${systemStatus === 'ONLINE' ? '#00ff00' : '#ff0000'}20`,
          padding: '2px 6px',
          borderRadius: '2px',
          border: `1px solid ${systemStatus === 'ONLINE' ? '#00ff00' : '#ff0000'}`
        }}>
          ● {systemStatus}
        </div>
      </div>

      {/* Skills Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '12px',
        height: 'calc(100% - 60px)',
        overflow: 'auto'
      }}>
        {Object.entries(skillModules).map(([moduleName, skills]) => (
          <div key={moduleName} style={{
            background: '#000000',
            border: '1px solid #00ff00',
            borderRadius: '4px',
            padding: '8px',
            boxShadow: getNeonShadow('#00ff00')
          }}>
            {/* Module Header */}
            <div style={{ 
              marginBottom: '8px',
              fontSize: '10px',
              color: '#00ff00',
              fontWeight: 'bold',
              borderBottom: '1px dashed #00ff00',
              paddingBottom: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>[{moduleName}]</span>
              <span style={{ fontSize: '8px', color: '#00cc00' }}>
                LOADED
              </span>
            </div>

            {/* Skill Progress Bars */}
            {skills.map((skill, index) => {
              const key = `${moduleName}-${skill.name}`;
              const isAnimated = animatedSkills[key];
              const barColor = getBarColor(skill.level);
              
              return (
                <div key={skill.name} style={{ marginBottom: '6px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '2px',
                    fontSize: '9px'
                  }}>
                    <span style={{ color: '#00ff00' }}>
                      {skill.name.toUpperCase()}
                    </span>
                    <span style={{ 
                      color: barColor,
                      fontWeight: 'bold',
                      textShadow: getNeonShadow(barColor)
                    }}>
                      {skill.level}%
                    </span>
                  </div>
                  
                  {/* Progress Bar with Neon Effect */}
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#0a0a0a',
                    border: '1px solid #333333',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    {/* Animated fill */}
                    <div style={{
                      width: isAnimated ? `${skill.level}%` : '0%',
                      height: '100%',
                      background: barColor,
                      boxShadow: getNeonShadow(barColor),
                      transition: 'width 0.8s ease-out',
                      position: 'relative'
                    }}>
                      {/* Pulsing overlay */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        animation: 'pulse 2s ease-in-out infinite'
                      }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* System Footer */}
      <div style={{ 
        marginTop: '8px', 
        borderTop: '1px solid #00ff00',
        paddingTop: '4px',
        fontSize: '8px',
        color: '#00cc00',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>MEMORY: {Object.values(skillModules).flat().length} SKILLS LOADED</span>
        <span>CPU: {(Math.random() * 20 + 30).toFixed(1)}%</span>
        <span>TEMP: {(Math.random() * 20 + 40).toFixed(1)}°C</span>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(420px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #00ff00;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default Skills;