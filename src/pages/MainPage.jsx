import React, {useContext, useEffect, useState} from 'react';
import Loader from '../components/Loader'
import AlertMessage from "../components/AlertMessage";

function MainPage(props) {
  return (
    <div className="Page-wrapper">
      <h1>Discover</h1>
      <AlertMessage text="Page development is in progress"/>
    </div>
  );
}

export default MainPage;