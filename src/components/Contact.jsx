import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subject: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const contactInfo = {
    email: 'mohammed.hassoun@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/mohammedhassoun',
    github: 'github.com/mhassoun'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '', subject: '' });
      setIsSubmitting(false);
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus(''), 3000);
    }, 1500);
  };

  const isFormValid = formData.name && formData.email && formData.message;

  return (
    <div style={{ 
      height: '100%', 
      padding: '20px',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      color: 'white',
      overflow: 'auto'
    }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '10px', color: '#38bdf8' }}>
          Get In Touch
        </h1>
        <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: '1.5' }}>
          I'm always interested in hearing about new opportunities and exciting projects.
          Feel free to reach out!
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '30px',
        maxWidth: '1000px'
      }}>
        {/* Contact Information */}
        <div>
          <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#38bdf8' }}>
            Contact Information
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(56, 189, 248, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}>
              <span style={{ fontSize: '20px' }}>📧</span>
              <div>
                <div style={{ fontSize: '14px', color: '#94a3b8' }}>Email</div>
                <div style={{ fontSize: '16px' }}>{contactInfo.email}</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(56, 189, 248, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}>
              <span style={{ fontSize: '20px' }}>📱</span>
              <div>
                <div style={{ fontSize: '14px', color: '#94a3b8' }}>Phone</div>
                <div style={{ fontSize: '16px' }}>{contactInfo.phone}</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(56, 189, 248, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}>
              <span style={{ fontSize: '20px' }}>📍</span>
              <div>
                <div style={{ fontSize: '14px', color: '#94a3b8' }}>Location</div>
                <div style={{ fontSize: '16px' }}>{contactInfo.location}</div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#38bdf8' }}>
              Social Profiles
            </h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { name: 'LinkedIn', icon: '💼', url: contactInfo.linkedin },
                { name: 'GitHub', icon: '🐙', url: contactInfo.github }
              ].map((social) => (
                <a
                  key={social.name}
                  href={`https://${social.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 15px',
                    background: 'rgba(56, 189, 248, 0.2)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(56, 189, 248, 0.3)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(56, 189, 248, 0.2)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <span>{social.icon}</span>
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#38bdf8' }}>
            Send Me a Message
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontSize: '14px', 
                color: '#94a3b8' 
              }}>
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#38bdf8';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontSize: '14px', 
                color: '#94a3b8' 
              }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#38bdf8';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontSize: '14px', 
                color: '#94a3b8' 
              }}>
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#38bdf8';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontSize: '14px', 
                color: '#94a3b8' 
              }}>
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#38bdf8';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                background: isFormValid && !isSubmitting 
                  ? '#38bdf8' 
                  : 'rgba(56, 189, 248, 0.3)',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isFormValid && !isSubmitting ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                opacity: isFormValid && !isSubmitting ? 1 : 0.6
              }}
              onMouseEnter={(e) => {
                if (isFormValid && !isSubmitting) {
                  e.target.style.background = '#0ea5e9';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (isFormValid && !isSubmitting) {
                  e.target.style.background = '#38bdf8';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {submitStatus === 'success' && (
              <div style={{
                padding: '12px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                color: '#10b981',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                ✅ Message sent successfully! I'll get back to you soon.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;