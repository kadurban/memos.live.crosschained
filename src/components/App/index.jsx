import React, { useEffect, useState, useContext } from 'react';
import Moralis from 'moralis';
import MainPage from '../../pages/MainPage';
import WizardPage from '../../pages/WizardPage';
import AboutPage from '../../pages/AboutPage';
import ProfilePage from '../../pages/ProfilePage';
import MyCollectionPage from '../../pages/MyCollectionPage';
import UnsupportedChainInfo from '../../components/UnsupportedChainInfo';
import Loader from '../../components/Loader';
import SettingsContext from '../../SettingsContext';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ErrorBoundary from '../ErrorBoundary';
import {getConfig} from "../../config";
import TopBar from '../TopBar'
import Menu from '../Menu'
import 'swiper/swiper-bundle.css';
import './index.css';
import {applyTheme} from "../../lib/utils";
import {MoralisProvider} from "react-moralis";

window.Moralis = Moralis;
window.soundsLoaded = {};

applyTheme();

function App() {
  const { settingsState, setSettingsState } = useContext(SettingsContext);
  const [ appLoaded, setAppLoadedStatus ] = useState(false);

  useEffect(() => {
    initializeAppConfiguration(setSettingsState);

    async function initializeAppConfiguration() {
      const web3 = window.ethereum && window.ethereum.on ? new Moralis.Web3(window.ethereum) : null;
      let chainId = null

      if (web3) chainId = await web3.eth.net.getId();
      if (!web3) chainId = 1;
      const appConfiguration = getConfig(chainId);

      Moralis.start({
        serverUrl: appConfiguration.MORALIS_SERVER_URL,
        appId: appConfiguration.MORALIS_APP_ID,
      })
      const user = Moralis.User.current();
      setSettingsState((prevSettingsState) => ({
        ...prevSettingsState,
        appConfiguration,
        user
      }));
      const consoleColor = appConfiguration.IS_MAINNET ? 'rgb(255 190 0)' : 'rgb(200 250 200)';
      console.info(`%c ${appConfiguration.NETWORK_NAME} `, `background: ${consoleColor}; color: #000; font-size: 24px;`);

      setAppLoadedStatus(true);

      Moralis.onChainChanged(() => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <>
        {settingsState.appConfiguration && (
          <>
            {!settingsState.appConfiguration.MINT_CONTRACT_ADDRESS && <UnsupportedChainInfo/>}

            {settingsState.appConfiguration.MINT_CONTRACT_ADDRESS && (
              <MoralisProvider appId={settingsState.appConfiguration.MORALIS_APP_ID}
                               serverUrl={settingsState.appConfiguration.MORALIS_SERVER_URL}>
                <Router>
                  {appLoaded ? (
                    <div className="App-main-content ">
                      <TopBar/>
                      <div className="App-primary-content">
                        <div className="App-primary-content-inner">
                          <div className="App-primary-content-left">
                            <Menu/>
                          </div>
                          <div className="App-primary-content-right">
                            <Switch>
                              <Route path="/wizard" render={props => <WizardPage {...props} />}/>
                              <Route path="/my" render={props => <MyCollectionPage {...props} />}/>
                              <Route path="/profile" render={props => <ProfilePage {...props} />}/>
                              <Route path="/about" render={props => <AboutPage {...props} />}/>
                              <Route path="/" render={props => <MainPage {...props} />}/>
                            </Switch>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Loader isOverlay text="Loading..."/>
                  )}
                </Router>
              </MoralisProvider>
            )}
          </>
        )}
      </>
    </ErrorBoundary>
  );
}

export default App;
