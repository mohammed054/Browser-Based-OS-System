import React, { useEffect, useMemo, useState } from 'react'
import { PROFILE } from '../config/profile'
import { CONTACT_CHANNELS, PROJECTS, SKILL_GROUPS, SYSTEM_METADATA } from '../data/portfolio'

const MobileFallback = ({ onContinue, onSimplified }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobileDevice = (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 768 ||
        'ontouchstart' in window
      )

      setIsMobile(mobileDevice)
      if (mobileDevice) {
        setTimeout(() => setShowMessage(true), 1200)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isMobile || !showMessage) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(160deg, #07111f 0%, #111827 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        padding: 20,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'var(--font-ui, system-ui, sans-serif)'
      }}
    >
      <div
        style={{
          width: 82,
          height: 82,
          borderRadius: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          marginBottom: 20,
          background: 'linear-gradient(135deg, #38bdf8, #f59e0b)',
          boxShadow: '0 16px 36px rgba(56, 189, 248, 0.25)'
        }}
      >
        OS
      </div>

      <h1
        style={{
          fontSize: 26,
          fontWeight: 700,
          margin: '0 0 8px 0',
          background: 'linear-gradient(45deg, #38bdf8, #f59e0b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        {PROFILE.firstName}OS
      </h1>

      <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.86)', marginBottom: 18 }}>
        Best experienced on desktop
      </p>

      <div
        style={{
          maxWidth: 420,
          padding: 20,
          borderRadius: 18,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          marginBottom: 28
        }}
      >
        <p style={{ lineHeight: 1.5, fontSize: 14, color: 'rgba(255,255,255,0.82)' }}>
          This portfolio behaves like an operating environment. The full version depends on keyboard shortcuts,
          precise mouse interaction, and overlapping windows.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 14, width: '100%', maxWidth: 320 }}>
        <button
          onClick={onContinue}
          style={{
            padding: '14px 18px',
            borderRadius: 14,
            border: 'none',
            background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
            color: 'white',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Try anyway
        </button>

        <button
          onClick={onSimplified}
          style={{
            padding: '14px 18px',
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.22)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.84)',
            fontSize: 14,
            cursor: 'pointer'
          }}
        >
          View simplified portfolio
        </button>
      </div>
    </div>
  )
}

const SimplifiedPortfolio = ({ onClose }) => {
  const mobileSkills = useMemo(() => SKILL_GROUPS.flatMap((group) => group.skills).slice(0, 6), [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#07111f',
        color: 'white',
        overflow: 'auto',
        padding: 20,
        fontFamily: 'var(--font-ui, system-ui, sans-serif)',
        zIndex: 999998
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h1
          style={{
            fontSize: 24,
            margin: 0,
            background: 'linear-gradient(45deg, #38bdf8, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          {PROFILE.name}
        </h1>
        <button
          onClick={onClose}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.24)',
            background: 'transparent',
            color: 'white',
            fontSize: 20,
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: '#38bdf8' }}>About</h2>
        <p style={{ lineHeight: 1.6, color: 'rgba(255,255,255,0.86)' }}>{SYSTEM_METADATA.summary}</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: '#38bdf8' }}>Skills</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {mobileSkills.map((skill) => (
            <div key={skill.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span>{skill.name}</span>
                <span>{skill.level}%</span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${skill.level}%`,
                    height: '100%',
                    borderRadius: 999,
                    background: 'linear-gradient(90deg, #38bdf8, #f59e0b)'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: '#38bdf8' }}>Projects</h2>
        <div style={{ display: 'grid', gap: 14 }}>
          {PROJECTS.slice(0, 3).map((project) => (
            <div
              key={project.id}
              style={{
                padding: 16,
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)'
              }}
            >
              <h3 style={{ margin: '0 0 8px 0' }}>{project.title}</h3>
              <p style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.82)', lineHeight: 1.5 }}>{project.summary}</p>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                Focus: {project.focus.slice(0, 2).join(', ')}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: '#38bdf8' }}>Contact</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {CONTACT_CHANNELS.slice(0, 3).map((contact) => (
            <div key={contact.label} style={{ display: 'flex', gap: 10 }}>
              <span>•</span>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{contact.label}</div>
                <div style={{ color: '#38bdf8' }}>{contact.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export { MobileFallback, SimplifiedPortfolio }
