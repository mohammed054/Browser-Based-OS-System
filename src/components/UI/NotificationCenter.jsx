import React, { useState, useEffect, useCallback } from 'react';

const NotificationCenter = ({ notifications, onRemoveNotification }) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  // Auto-dismiss notifications
  useEffect(() => {
    const timers = notifications.map(notification => {
      if (notification.duration && notification.duration > 0) {
        return setTimeout(() => {
          onRemoveNotification(notification.id);
        }, notification.duration);
      }
      return null;
    });

    return () => {
      timers.forEach(timer => timer && clearTimeout(timer));
    };
  }, [notifications, onRemoveNotification]);

  // Update visible notifications when notifications change
  useEffect(() => {
    setVisibleNotifications(notifications);
  }, [notifications]);

  const handleRemoveNotification = useCallback((id) => {
    // Add fade-out animation
    const element = document.getElementById(`notification-${id}`);
    if (element) {
      element.style.animation = 'slideOutRight 0.3s ease-out forwards';
      setTimeout(() => {
        onRemoveNotification(id);
      }, 300);
    } else {
      onRemoveNotification(id);
    }
  }, [onRemoveNotification]);

  const getNotificationIcon = (type) => {
    const iconMap = {
      'system': '⚙️',
      'app': '📱',
      'error': '❌',
      'success': '✅',
      'warning': '⚠️',
      'info': 'ℹ️'
    };
    return iconMap[type] || '📢';
  };

  const getNotificationTitle = (type, customTitle) => {
    if (customTitle) return customTitle;
    
    const titleMap = {
      'system': 'System',
      'app': 'Application',
      'error': 'Error',
      'success': 'Success',
      'warning': 'Warning',
      'info': 'Information'
    };
    return titleMap[type] || 'Notification';
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-container">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          id={`notification-${notification.id}`}
          className={`notification ${notification.type || 'system'}`}
        >
          <div className="notification-icon">
            {getNotificationIcon(notification.type)}
          </div>
          <div className="notification-content">
            <div className="notification-title">
              {getNotificationTitle(notification.type, notification.title)}
            </div>
            <div className="notification-message">
              {notification.message}
            </div>
          </div>
          <button
            className="notification-close"
            onClick={() => handleRemoveNotification(notification.id)}
            title="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter;