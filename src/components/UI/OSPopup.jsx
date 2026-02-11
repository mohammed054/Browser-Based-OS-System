import { useEffect, useCallback } from 'react'
import './OSPopup.css'

const OSPopup = ({
  isVisible,
  title = 'Error',
  message,
  onClose,
  type = 'error'
}) => {
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose()
    }
  }, [onClose])

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape' || event.key === 'Enter') {
      handleClose()
    }
  }, [handleClose])

  useEffect(() => {
    if (!isVisible) {
      return undefined
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, isVisible])

  if (!isVisible) {
    return null
  }

  return (
    <div className="os-popup-overlay visible">
      <div className={`os-popup ${type} visible`}>
        <div className="os-popup-header">
          <div className="os-popup-icon">{type === 'error' ? '⚠️' : 'ℹ️'}</div>
          <div className="os-popup-title">{title}</div>
        </div>

        <div className="os-popup-content">
          <p>{message}</p>
        </div>

        <div className="os-popup-footer">
          <button className="os-popup-ok-button" onClick={handleClose} autoFocus>
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

export default OSPopup
