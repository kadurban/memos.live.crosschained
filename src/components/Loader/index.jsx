import React, { useContext } from 'react';
import SettingsContext from '../../SettingsContext';
import logoLight from '../../assets/img/logo-light.png';
import './index.css';

export default function Loader({ isUploader, isOverlay, text }) {
    const { settingsState } = useContext(SettingsContext);

    return (
      <>
        {isOverlay && text && <div className="Loader Loader-overlay">
          <div className="Loader-logo-wrap">
            <img className="Loader-logo" src={logoLight}/>
          </div>
          <div className="Loader-info">
            <h2>
              {text}
            </h2>
          </div>
        </div>}

        {isUploader && <div className="Loader Loader-overlay">
          <div className="Loader-logo-wrap">
            <img className="Loader-logo" src={logoLight}/>
          </div>
          <div className="Loader-info">
            <h2>
              Uploading attached files.
            </h2>
            <p>
              This may take some time.
            </p>
          </div>
        </div>}

        {!isUploader && <div className="Loader">
          <img className="Loader-logo" src={logoLight}/>
          {text && (
            <div className="Loader-info">{text}</div>
          )}
        </div>}
      </>
    );
}