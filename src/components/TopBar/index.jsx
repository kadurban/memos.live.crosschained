import React, { useEffect, useState, useContext } from 'react';
import LoginSection from '../LoginSection';
import logoLight from '../../assets/img/logo-light.png';
import './index.css';
import SVG from '../SVG';
import SettingsContext from "../../SettingsContext";

function TopBar() {
  const { settingsState } = useContext(SettingsContext);

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
                memos.live <small style={{ fontSize: '.8rem' }}>ALPHA</small>
              </div>
              <div>
                Memorable NFTs
              </div>
            </div>
          </div>
        </div>
        {settingsState.appConfiguration && (
          <div className="Top-bar-right">
            {/*<div className="Top-bar-right-network-info">*/}
            {/*  {(settingsState.appConfiguration.NETWORK_NAME === 'mumbai' || settingsState.appConfiguration.NETWORK_NAME === 'polygon') && (*/}
            {/*    <svg style={{width: '28px', height: '28px', fill: '#8247E5'}} x="0px" y="0px" viewBox="0 0 38.4 33.5">*/}
            {/*      <g>*/}
            {/*        <path className="st0" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/>*/}
            {/*      </g>*/}
            {/*    </svg>*/}
            {/*  )}*/}
            {/*  {(settingsState.appConfiguration.NETWORK_NAME === 'rinkeby' || settingsState.appConfiguration.NETWORK_NAME === 'ethereum') && (*/}
            {/*    <svg style={{width: '28px', height: '28px'}} width="100%" height="100%" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 784.37 1277.39">*/}
            {/*      <g>*/}
            {/*        <g id="_1421394342400">*/}
            {/*          <g>*/}
            {/*            <polygon fill="#343434" fillRule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "/>*/}
            {/*            <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "/>*/}
            {/*            <polygon fill="#3C3C3B" fillRule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "/>*/}
            {/*            <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89 "/>*/}
            {/*            <polygon fill="#141414" fillRule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33 "/>*/}
            {/*            <polygon fill="#393939" fillRule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33 "/>*/}
            {/*          </g>*/}
            {/*        </g>*/}
            {/*      </g>*/}
            {/*    </svg>*/}
            {/*  )}*/}
            {/*</div>*/}
            <LoginSection/>
          </div>
        )}
      </span>
    </div>
  );
}

export default TopBar;
