import React, {useContext, useEffect, useState} from 'react';
import LoginLogout from '../components/LoginLogout'
import NetworkSelector from '../components/NetworkSelector'
import Editor from '../components/Editor'
import SettingsContext from "../SettingsContext";
import MyNFTs from "../components/MyNFTs";
import {getConfig} from "../config";

const config = getConfig();

function MainPage(props) {
  const { settingsState, setSettingsState } = useContext(SettingsContext);

  return (
    <section>
      <h1>Main page</h1>
      <hr/>
      <LoginLogout/>
      <hr/>
      <MyNFTs/>
      <hr/>
      <NetworkSelector/>
      <hr/>
      <Editor/>

      {/*<SliderMain {...props} sliderTitle="Recently added" items={recentlyAddedWithDate} />*/}
    </section>
  );
}

export default MainPage;