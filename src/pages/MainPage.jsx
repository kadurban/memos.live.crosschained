import React, {useContext, useEffect, useState} from 'react';
import LoginLogout from '../components/LoginLogout'
import Editor from '../components/Editor'
import SettingsContext from "../SettingsContext";
import MyNFTs from "../components/MyNFTs";

function MainPage(props) {
  const { settingsState, setSettingsState } = useContext(SettingsContext);

  return (
    <section>
      <h1>Main page</h1>
      <hr/>
      <LoginLogout/>
      <br/>
      <MyNFTs/>
      <hr/>
      {settingsState.user && (
        <div>
          Connected to <strong>{window.config.NETWORK}</strong>
          <br/>
          {settingsState.user.attributes.ethAddress}
          <hr/>
        </div>
      )}
      <Editor/>

      {/*<SliderMain {...props} sliderTitle="Recently added" items={recentlyAddedWithDate} />*/}
    </section>
  );
}

export default MainPage;