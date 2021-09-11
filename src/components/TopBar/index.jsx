import React, { useEffect, useState, useContext } from 'react';
import LoginSection from '../LoginSection';
import NetworkSelector from '../NetworkInfo';
import logoLight from '../../assets/img/logo-light.png';
import './index.css';
import SVG from '../../SVG';

function TopBar() {
  return (
    <div className="Top-bar">
      <span className="Top-bar-inner">
        <div className="Top-bar-left">
          <button className='Top-bar-menu-btn'>
            <SVG menu/>
          </button>
          <div className="Top-bar-logo">
            <img src={logoLight} alt="memos.live"/>
            <div className="Top-bar-logo-text">
              <div>
                memos.live
              </div>
              <div>
                Humanity Memories NFTs
              </div>
            </div>
          </div>
        </div>
        <div className="Top-bar-right">
          <NetworkSelector/>
          <LoginSection/>
        </div>
      </span>
    </div>
  );
}

export default TopBar;
