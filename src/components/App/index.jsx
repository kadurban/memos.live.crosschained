import React, { useEffect, useState, useContext } from 'react';
import Moralis from 'moralis';
import MainPage from '../../pages/MainPage';
import Loader from '../../components/Loader';
import SettingsContext from '../../SettingsContext';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ErrorBoundary from '../ErrorBoundary';
import {getConfig} from "../../config";
// import bgDark from '../../assets/img/bg-dark.jpg';
// import bgLight from '../../assets/img/bg-light.jpg';
// import logoLight from '../../assets/img/logo-light.png';
// import logoDark from '../../assets/img/logo-dark.png';
// import 'swiper/swiper.scss';
// import './App.scss';
// import '../../assets/markdown.scss';

window.Moralis = Moralis;
window.config = getConfig();
window.soundsLoaded = {};

console.info(`%c ${window.config.NETWORK_DISPLAY_NAME} `, 'background: rgb(172 255 172); color: #000; font-size: 24px;');

function App() {
  const { settingsState, setSettingsState } = useContext(SettingsContext);
  const [ appLoaded, setAppLoadedStatus ] = useState(false);

  useEffect(() => {
    Moralis.initialize(window.config.MORALIS_APP_ID);
    Moralis.serverURL = window.config.MORALIS_SERVER_URL;
    const user = window.Moralis.User.current();
    setSettingsState((prevSettingsState) => ({ ...prevSettingsState, user }));
    setAppLoadedStatus(true);
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        {appLoaded ? (
          <div className="App-main-content">
            <Switch>
              {/*<Route path="/profile" render={props => <ProfilePage {...props} />} />*/}
              {/*<Route path="/new" render={props => <CreateTokenPage {...props} />} />*/}
              {/*<Route path="/about" render={props => <AboutPage {...props} />} />*/}
              {/*<Route path="/search" render={props => <SearchPage {...props} />} />*/}
              <Route path="/" render={props => <MainPage {...props} />} />
            </Switch>
          </div>
        ) : (
          <Loader/>
        )}
      </Router>
    </ErrorBoundary>
  );
}

export default App;
