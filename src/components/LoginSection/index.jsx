import React, {useContext, useEffect, useRef} from 'react';
import SettingsContext from '../../SettingsContext';
import {toast} from "react-toastify";
import SVG from "../SVG";
import {ChainIcon} from "../ChainIcon";
import {NavLink} from "react-router-dom";
import Jazzicon, {jsNumberForAddress} from "react-jazzicon";
import './index.css';

function addressShoring(str) {
  return '0x' + (str.substring(2, 6) + '...' + str.substring(str.length - 4, str.length)).toUpperCase();
}

export async function login(setSettingsState, cb) {
  const user = await window.Moralis.Web3.authenticate();
  setSettingsState((prevSettingsState) => ({ ...prevSettingsState, user }));
  toast.info('Wallet connected');
  if (cb) cb();
}

function LoginSection() {
  const { settingsState, setSettingsState } = useContext(SettingsContext);
  const dropdownContent = useRef(null);

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
        <button onClick={() => login(setSettingsState)}>
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
                <ChainIcon chain={settingsState.appConfiguration.NETWORK_NAME}/>
              </span>
              {settingsState.appConfiguration.NETWORK_NAME}
            </div>
            <Jazzicon diameter={40} seed={jsNumberForAddress(settingsState.user.attributes.ethAddress)}/>
          </button>
          <div className="Dropdown-content" ref={dropdownContent}>
            {/*<NavLink exact to="/profile" onClick={() => {}}>*/}
            {/*  Profile*/}
            {/*</NavLink>*/}
            <button onClick={() => logout()}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginSection;