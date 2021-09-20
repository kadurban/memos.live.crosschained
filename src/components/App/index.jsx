import React, { useEffect, useState, useContext } from 'react';
import Moralis from 'moralis';
import MainPage from '../../pages/MainPage';
import CreatePage from '../../pages/CreatePage';
import AboutPage from '../../pages/AboutPage';
import SearchPage from '../../pages/SearchPage';
import ProfilePage from '../../pages/ProfilePage';
import MyCollectionPage from '../../pages/MyCollectionPage';
import Loader from '../../components/Loader';
import UnsupportedChainInfo from '../../components/UnsupportedChainInfo';
import SettingsContext from '../../SettingsContext';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ErrorBoundary from '../ErrorBoundary';
import {getConfig} from "../../config";
// import bgDark from '../../assets/img/bg-dark.jpg';
// import bgLight from '../../assets/img/bg-light.jpg';
// import logoLight from '../../assets/img/logo-light.png';
// import logoDark from '../../assets/img/logo-dark.png';
import TopBar from '../TopBar'
import Menu from '../Menu'
import 'swiper/swiper-bundle.css';
import './index.css';
import MyNFTs from "../MyNFTs";

window.Moralis = Moralis;
window.soundsLoaded = {};

function App() {
  const { settingsState, setSettingsState } = useContext(SettingsContext);
  const [ appLoaded, setAppLoadedStatus ] = useState(false);
  const [ isChainSupported, setIsChainSupported ] = useState(false);

  useEffect(() => {
    if (!window.ethereum || !window.ethereum.on) {
      // alert('You need Metamask to use this');
      console.info(`%c Current network is not supported`, 'background: rgb(255 255 172); color: #000; font-size: 24px;');
      setSettingsState((prevSettingsState) => ({ ...prevSettingsState, appConfiguration: null}));
    } else {
      initializeAppConfiguration(setSettingsState);
    }

    async function initializeAppConfiguration() {
      const web3 = new Moralis.Web3(window.ethereum);
      const chainId = await web3.eth.net.getId();
      const appConfiguration = getConfig(chainId);

      if (appConfiguration.MORALIS_APP_ID) {
        Moralis.initialize(appConfiguration.MORALIS_APP_ID);
        Moralis.serverURL = appConfiguration.MORALIS_SERVER_URL;
        const user = Moralis.User.current();
        setSettingsState((prevSettingsState) => ({...prevSettingsState, appConfiguration, user }));
        console.info(`%c ${appConfiguration.NETWORK_NAME} `, 'background: rgb(172 255 172); color: #000; font-size: 24px;');
        setIsChainSupported(true);
      } else {
        setIsChainSupported(false);
      }

      setAppLoadedStatus(true);

      Moralis.onChainChanged(() => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        {appLoaded ? (
          <div className="App-main-content">
            <TopBar/>
            <div className="App-primary-content">
              <div className="App-primary-content-inner">
                {isChainSupported && <div className="App-primary-content-left">
                  <Menu/>
                </div>}
                <div className="App-primary-content-right">
                  {isChainSupported ? (
                    <Switch>
                      <Route path="/new" render={props => <CreatePage {...props} />} />
                      <Route path="/about" render={props => <AboutPage {...props} />} />
                      {/*<Route path="/search" render={props => <SearchPage {...props} />} />*/}
                      <Route path="/profile" render={props => <ProfilePage {...props} />} />
                      <Route path="/my" render={props => <MyCollectionPage {...props} />} />
                      <Route path="/" render={props => <MainPage {...props} />} />
                    </Switch>
                  ) : (
                    <UnsupportedChainInfo/>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loader/>
        )}
      </Router>
    </ErrorBoundary>
  );
}

export default App;
