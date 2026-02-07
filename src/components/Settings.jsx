import { useState } from 'react';

const Settings = ({ theme, toggleTheme }) => {
  const [activeCategory, setActiveCategory] = useState('System');
  const [activeSubcategory, setActiveSubcategory] = useState(null);

  const settingsCategories = [
    { icon: '🔧', label: 'System', subcategories: ['About', 'Display', 'Sound', 'Power'] },
    { icon: '🎨', label: 'Personalization', subcategories: ['Themes', 'Background', 'Colors'] },
    { icon: '👤', label: 'Accounts', subcategories: ['Your info', 'Sign-in options', 'Access work or school'] },
    { icon: '🔒', label: 'Privacy', subcategories: ['General', 'Location', 'Camera', 'Microphone'] },
  ];

  const getContentForCategory = () => {
    switch (activeCategory) {
      case 'System':
        if (activeSubcategory === 'About') {
          return (
            <div>
              <h3>About</h3>
              <div className="settings-section">
                <h4>Device specifications</h4>
                <div className="setting-item">
                  <span>OS Version:</span>
                  <span>Browser-Based OS v1.0</span>
                </div>
                <div className="setting-item">
                  <span>System Type:</span>
                  <span>Web Application</span>
                </div>
                <div className="setting-item">
                  <span>Memory:</span>
                  <span>Simulated 8GB RAM</span>
                </div>
              </div>
            </div>
          );
        } else if (activeSubcategory === 'Display') {
          return (
            <div>
              <h3>Display</h3>
              <div className="settings-section">
                <h4>Scale and layout</h4>
                <div className="setting-item">
                  <span>Display resolution:</span>
                  <span>{window.innerWidth} x {window.innerHeight}</span>
                </div>
                <div className="setting-item">
                  <span>Scale:</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div>
            <h3>System</h3>
            <div className="settings-section">
              <h4>About</h4>
              <p>View system information and manage device settings.</p>
              <button className="settings-button" onClick={() => setActiveSubcategory('About')}>System info</button>
            </div>
            <div className="settings-section">
              <h4>Display</h4>
              <p>Change display settings like resolution and scale.</p>
              <button className="settings-button" onClick={() => setActiveSubcategory('Display')}>Display settings</button>
            </div>
          </div>
        );

      case 'Personalization':
        if (activeSubcategory === 'Themes') {
          return (
            <div>
              <h3>Themes</h3>
              <div className="settings-section">
                <h4>Choose your theme</h4>
                <div className="theme-options">
                  <div className={`theme-option ${theme === 'dark' ? 'active' : ''}`} onClick={() => toggleTheme()}>
                    <div className="theme-preview dark-preview"></div>
                    <span>Dark</span>
                  </div>
                  <div className={`theme-option ${theme === 'light' ? 'active' : ''}`} onClick={() => toggleTheme()}>
                    <div className="theme-preview light-preview"></div>
                    <span>Light</span>
                  </div>
                </div>
                <div className="setting-item">
                  <span>Current theme:</span>
                  <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div>
            <h3>Personalization</h3>
            <div className="settings-section">
              <h4>Themes</h4>
              <p>Choose your color theme and customize the look of your OS.</p>
              <button className="settings-button" onClick={() => setActiveSubcategory('Themes')}>Theme settings</button>
            </div>
            <div className="settings-section">
              <h4>Background</h4>
              <p>Change your desktop background and lock screen.</p>
            </div>
          </div>
        );

      case 'Accounts':
        return (
          <div>
            <h3>Accounts</h3>
            <div className="settings-section">
              <h4>Your info</h4>
              <p>Manage your account information and profile picture.</p>
              <div className="setting-item">
                <span>Name:</span>
                <span>Demo User</span>
              </div>
              <div className="setting-item">
                <span>Email:</span>
                <span>user@demo.com</span>
              </div>
            </div>
          </div>
        );

      case 'Privacy':
        return (
          <div>
            <h3>Privacy</h3>
            <div className="settings-section">
              <h4>General</h4>
              <p>Control privacy settings for your device.</p>
              <div className="toggle-setting">
                <span>Allow apps to access your location</span>
                <label className="toggle">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="toggle-setting">
                <span>Allow camera access</span>
                <label className="toggle">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a category</div>;
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setActiveSubcategory(null);
  };

  const handleSubcategoryClick = (subcategory) => {
    setActiveSubcategory(subcategory);
  };

  return (
    <div className="settings-app">
      <div className="settings-sidebar">
        <h2>Settings</h2>
        <div className="settings-nav">
          {settingsCategories.map((category, index) => (
            <div key={index}>
              <div
                className={`settings-nav-item ${activeCategory === category.label ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.label)}
              >
                <span className="nav-icon">{category.icon}</span>
                <span className="nav-label">{category.label}</span>
              </div>
              {activeCategory === category.label && category.subcategories && (
                <div className="subcategories">
                  {category.subcategories.map((sub, subIndex) => (
                    <div
                      key={subIndex}
                      className={`subcategory-item ${activeSubcategory === sub ? 'active' : ''}`}
                      onClick={() => handleSubcategoryClick(sub)}
                    >
                      {sub}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="settings-content">
        {getContentForCategory()}
      </div>
    </div>
  );
};

export default Settings;
