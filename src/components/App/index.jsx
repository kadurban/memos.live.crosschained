import React, { useEffect, useState, useContext } from 'react';
import Moralis from 'moralis';
import MainPage from '../../pages/MainPage';
import WizardPage from '../../pages/WizardPage';
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
      alert('You need Metamask to use this application');
      console.info(`%c Current network is not supported`, 'background: rgb(255 255 172); color: #000; font-size: 24px;');
      setSettingsState((prevSettingsState) => ({ ...prevSettingsState, appConfiguration: null}));
      setAppLoadedStatus(true);
    } else {
      initializeAppConfiguration(setSettingsState);
    }

    async function initializeAppConfiguration() {
      const web3 = new Moralis.Web3(window.ethereum);
      const chainId = await web3.eth.net.getId();
      const appConfiguration = getConfig(chainId);

      if (appConfiguration.MORALIS_APP_ID && appConfiguration.MINT_CONTRACT_ADDRESS) {
        Moralis.initialize(appConfiguration.MORALIS_APP_ID);
        Moralis.serverURL = appConfiguration.MORALIS_SERVER_URL;
        const user = Moralis.User.current();
        setSettingsState((prevSettingsState) => ({...prevSettingsState, appConfiguration, user }));
        const consoleColor = appConfiguration.IS_MAINNET ? 'rgb(255 190 0)' : 'rgb(200 250 200)';
        console.info(`%c ${appConfiguration.NETWORK_NAME} `, `background: ${consoleColor}; color: #000; font-size: 24px;`);
        setIsChainSupported(true);
      } else {
        setIsChainSupported(false);
      }

      setAppLoadedStatus(true);

      Moralis.onChainChanged(() => {
        window.location.reload();
      });

      // Moralis.onAccountsChanged(() => {
      //   window.location.reload();
      // });
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
                      <Route path="/wizard" render={props => <WizardPage {...props} />} />
                      <Route path="/about" render={props => <AboutPage {...props} />} />
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
          <Loader isOverlay text="Loading..."/>
        )}
      </Router>
    </ErrorBoundary>
  );
}

export default App;
