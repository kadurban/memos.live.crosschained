import React, {useContext, useEffect, useState} from 'react';
import SettingsContext from '../../SettingsContext';
import {toast} from "react-toastify";

function LoginSection() {
  const { settingsState, setSettingsState } = useContext(SettingsContext);

  async function login() {
    const user = await window.Moralis.Web3.authenticate();
    setSettingsState((prevSettingsState) => ({ ...prevSettingsState, user }));
    toast('Wallet connected');
  }

  function logout() {
    window.Moralis.User.logOut();
    setSettingsState((prevSettingsState) => ({ ...prevSettingsState, user: null }));
    toast(`Wallet disconnected`);
  }

  return (
    <div>
      {!settingsState.user && (
        <button onClick={() => login()}>
          Connect Wallet
        </button>
      )}
      {settingsState.user && (
        <button onClick={() => logout()}>
          Logout
        </button>
      )}
    </div>
  );
}

export default LoginSection;