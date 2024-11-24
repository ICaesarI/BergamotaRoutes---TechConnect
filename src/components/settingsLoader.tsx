import React from "react";

const SettingsLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="settingsLoader">
        <div className="settingsLoader__bar"></div>
        <div className="settingsLoader__bar"></div>
        <div className="settingsLoader__bar"></div>
        <div className="settingsLoader__bar"></div>
        <div className="settingsLoader__bar"></div>
        <div className="settingsLoader__ball"></div>
      </div>
    </div>
  );
};

export default SettingsLoader;
