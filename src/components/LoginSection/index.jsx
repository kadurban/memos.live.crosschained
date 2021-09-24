import React, {useContext, useEffect, useRef} from 'react';
import SettingsContext from '../../SettingsContext';
import {toast} from "react-toastify";
import SVG from "../../SVG";
import {NavLink} from "react-router-dom";
import Jazzicon, {jsNumberForAddress} from "react-jazzicon";
import './index.css';

function addressShoring(str) {
  return '0x' + (str.substring(2, 6) + '...' + str.substring(str.length - 4, str.length)).toUpperCase();
}

function LoginSection() {
  const { settingsState, setSettingsState } = useContext(SettingsContext);
  const dropdownContent = useRef(null);

  async function login() {
    const user = await window.Moralis.Web3.authenticate();
    setSettingsState((prevSettingsState) => ({ ...prevSettingsState, user }));
    toast.info('Wallet connected');
  }

  function logout() {
    window.Moralis.User.logOut();
    setSettingsState((prevSettingsState) => ({ ...prevSettingsState, user: null }));
    toast.info(`Wallet disconnected`);
  }

  function handleClickOutside (event) {
    if (
      dropdownContent &&
      dropdownContent.current &&
      dropdownContent.current.classList.contains('Dropdown-content-active') &&
      !dropdownContent.current.contains(event.target)
    ) {
      dropdownContent.current.classList.add('fade-out');
      setTimeout(() => {
        dropdownContent.current.classList.remove('Dropdown-content-active');
        dropdownContent.current.classList.remove('fade-out');
      }, 200);
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      {!settingsState.user && (
        <button onClick={() => login()}>
          <SVG wallet/> Connect Wallet
        </button>
      )}
      {settingsState.user && (
        <div className="Dropdown">
          <button
            className="Dropdown-trigger"
            onClick={() => dropdownContent.current.classList.toggle('Dropdown-content-active')}
            title={settingsState.user.attributes.ethAddress}
          >
            <div className="net-info">
              <span>
                {addressShoring(settingsState.user.attributes.ethAddress)}
              </span>
              <br/>
              <span className="net-icon">
                {settingsState.appConfiguration.NETWORK_NAME === 'ethereum' && <EthereumIcon/>}
                {settingsState.appConfiguration.NETWORK_NAME === 'rinkeby' && <EthereumIcon/>}
                {settingsState.appConfiguration.NETWORK_NAME === 'polygon' && <PolygonIcon/>}
                {settingsState.appConfiguration.NETWORK_NAME === 'mumbai' && <PolygonIcon/>}
              </span>
              {settingsState.appConfiguration.NETWORK_NAME}
            </div>
            <Jazzicon diameter={40} seed={jsNumberForAddress(settingsState.user.attributes.ethAddress)}/>
          </button>
          <div className="Dropdown-content" ref={dropdownContent}>
            <NavLink exact to="/profile" onClick={() => {}}>
              Profile
            </NavLink>
            <button onClick={() => logout()}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EthereumIcon() {
  return (
    <svg width="16px" height="16px" version="1.1" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 784.37 1277.39">
      <g id="Layer_x0020_1">
        <metadata id="CorelCorpID_0Corel-Layer"/>
        <g id="_1421394342400">
          <g>
            <polygon fill="#343434" fillRule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "/>
            <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "/>
            <polygon fill="#3C3C3B" fillRule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "/>
            <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89 "/>
            <polygon fill="#141414" fillRule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33 "/>
            <polygon fill="#393939" fillRule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33 "/>
          </g>
        </g>
      </g>
    </svg>
  );
}

function PolygonIcon() {
  return (
    <svg width="16px" height="16px" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 38.4 33.5">
      <g>
        <path fill="#8247E5" className="st0" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3
          c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7
          c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
          c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1
          L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
          c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/>
      </g>
    </svg>
  );
}

export default LoginSection;