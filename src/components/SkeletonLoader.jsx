import React from 'react';

/**
 * Skeleton Loader Component
 * Shows loading skeleton for apps with realistic delays
 */
const SkeletonLoader = ({ width, height, type = 'window' }) => {
  const getSkeletonContent = () => {
    switch (type) {
      case 'window':
        return (
          <div style={{
            width: width || '520px',
            height: height || '420px',
            background: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Titlebar skeleton */}
            <div style={{
              height: '32px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
              backgroundSize: '200% 100%',
              animation: 'skeleton-shimmer 1.5s infinite',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 10px',
              gap: '8px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: 'rgba(255, 100, 100, 0.5)'
              }} />
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: 'rgba(255, 200, 100, 0.5)'
              }} />
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: 'rgba(100, 255, 100, 0.5)'
              }} />
              <div style={{
                flex: 1,
                height: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                maxWidth: '200px',
                margin: '0 auto'
              }} />
            </div>
            
            {/* Content skeleton */}
            <div style={{ flex: 1, padding: '20px' }}>
              <div style={{
                height: '20px',
                background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-shimmer 1.5s infinite',
                borderRadius: '4px',
                marginBottom: '15px'
              }} />
              <div style={{
                height: '16px',
                background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-shimmer 1.5s infinite',
                borderRadius: '4px',
                marginBottom: '10px',
                width: '80%'
              }} />
              <div style={{
                height: '16px',
                background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-shimmer 1.5s infinite',
                borderRadius: '4px',
                marginBottom: '10px',
                width: '90%'
              }} />
              <div style={{
                height: '16px',
                background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-shimmer 1.5s infinite',
                borderRadius: '4px',
                width: '70%'
              }} />
            </div>
          </div>
        );

      case 'calculator':
        return (
          <div style={{
            width: width || '320px',
            height: height || '400px',
            background: 'rgba(30, 30, 30, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{
              height: '40px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              animation: 'skeleton-shimmer 1.5s infinite'
            }} />
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '8px' 
            }}>
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: '50px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    animation: 'skeleton-shimmer 1.5s infinite',
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>
        );

      case 'terminal':
        return (
          <div style={{
            width: width || '600px',
            height: height || '400px',
            background: '#0a0a0a',
            border: '1px solid rgba(0, 255, 0, 0.3)',
            borderRadius: '8px',
            padding: '15px',
            fontFamily: 'monospace',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '14px',
              background: 'linear-gradient(90deg, #00ff00 25%, #00aa00 50%, #00ff00 75%)',
              backgroundSize: '200% 100%',
              animation: 'skeleton-shimmer 1.5s infinite',
              borderRadius: '2px',
              marginBottom: '10px',
              width: '80%'
            }} />
            <div style={{
              height: '14px',
              background: 'linear-gradient(90deg, #00ff00 25%, #00aa00 50%, #00ff00 75%)',
              backgroundSize: '200% 100%',
              animation: 'skeleton-shimmer 1.5s infinite',
              borderRadius: '2px',
              marginBottom: '10px',
              width: '60%'
            }} />
            <div style={{
              height: '14px',
              background: 'linear-gradient(90deg, #00ff00 25%, #00aa00 50%, #00ff00 75%)',
              backgroundSize: '200% 100%',
              animation: 'skeleton-shimmer 1.5s infinite',
              borderRadius: '2px',
              width: '90%'
            }} />
          </div>
        );

      default:
        return (
          <div style={{
            width: width || '400px',
            height: height || '300px',
            background: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            animation: 'skeleton-pulse 1.5s infinite'
          }} />
        );
    }
  };

  return (
    <div className="skeleton-loader" style={{ 
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 999999,
      animation: 'skeleton-fade-in 0.3s ease-out'
    }}>
      {getSkeletonContent()}
      
      {/* Loading indicator */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 8px',
        background: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '4px',
        fontSize: '10px',
        color: '#fff'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#00ff00',
          animation: 'loading-pulse 1s infinite'
        }} />
        Loading...
      </div>

      <style>{`
        @keyframes skeleton-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes loading-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes skeleton-fade-in {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default SkeletonLoader;