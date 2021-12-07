import React, {useContext} from 'react';
import './index.css';

import AlertMessage from '../AlertMessage';
import SettingsContext from "../../SettingsContext";
import {ChainIcon} from "../ChainIcon";

export default function UnsupportedChainInfo(props) {
  const { settingsState } = useContext(SettingsContext);
  const { AVAILABLE_NETWORKS, FUTURE_NETWORKS } = settingsState.appConfiguration;

  return (
    <div className="Page-wrapper UnsupportedChainInfo">
      <br/>
      <br/>
      <br/>
      <AlertMessage>
        <h1 style={{marginTop: '1rem'}}>Please connect to supported chain </h1>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
          {AVAILABLE_NETWORKS.map(network => (
            <div key={network.NETWORK_NAME} style={{
              alignItems: 'center',
              fontSize: '20px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <ChainIcon width="100px" height="100px" chain={network.NETWORK_NAME}/>
              <div style={{marginTop: '.5rem', textTransform: 'capitalize'}}>{network.NETWORK_NAME}</div>
            </div>
          ))}
        </div>
        <br/>
        <br/>
        <br/>
        <h2 style={{ marginBottom: '1rem' }}>Networks that soon will be supported:</h2>
        <div>
          {FUTURE_NETWORKS.map(network => (
            <span key={network} style={{ marginRight: '1rem' }}>
              <ChainIcon key={network} width="30px" height="30px" chain={network}/>
            </span>
          ))}
        </div>
        <br/>
      </AlertMessage>
    </div>
  );
}
