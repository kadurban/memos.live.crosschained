import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
import SettingsContext from './SettingsContext';
import App from './components/App';

import 'modern-css-reset/dist/reset.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
// import "@pathofdev/react-tag-input/build/index.css";

function AppContextWrap() {
  const [settingsState, setSettingsState] = useState({
    user: null
  });

  return (
    <SettingsContext.Provider value={{ settingsState, setSettingsState }}>
      <App/>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        closeButton={false}
        limit={3}
      />
    </SettingsContext.Provider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <AppContextWrap/>
  </React.StrictMode>,
  document.getElementById('root')
);
