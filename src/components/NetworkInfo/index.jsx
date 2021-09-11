import React, {useContext} from 'react';
import SVG from "../../SVG";
import SettingsContext from "../../SettingsContext";
import './index.css';

const changeNetwork = (networkName) => {
  localStorage.setItem('currentNetwork', networkName);
  window.location.reload();
};

function NetworkInfo(props) {
  const { settingsState, setSettingsState } = useContext(SettingsContext);
  const { NETWORK_NAME } = window.config;

  return (
    <section className="NetworkInfo">
      {(NETWORK_NAME === 'mumbai' || NETWORK_NAME === 'polygon') && (
        <svg style={{width: '24px', height: '24px', fill: '#8247E5'}} x="0px" y="0px" viewBox="0 0 38.4 33.5">
          <g>
            <path className="st0" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/>
          </g>
        </svg>
      )}
      {(NETWORK_NAME === 'rinkeby' || NETWORK_NAME === 'ethereum') && (
        <svg style={{width: '24px', height: '24px'}} width="100%" height="100%" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 784.37 1277.39">
          <g>
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
      )}
      <div className="NetworkInfo-selector">
        <select value={NETWORK_NAME} onChange={(e) => changeNetwork(e.target.value)}>
          <option value="mumbai">Mumbai</option>
          <option value="rinkeby">Rinkeby</option>
        </select>
      </div>
    </section>
  );
}

export default NetworkInfo;