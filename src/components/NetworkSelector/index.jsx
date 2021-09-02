import React, {useContext} from 'react';
import SettingsContext from "../../SettingsContext";

const changeNetwork = (networkName) => {
  localStorage.setItem('currentNetwork', networkName);
  window.location.reload();
};

function MainPage(props) {
  const { settingsState, setSettingsState } = useContext(SettingsContext);

  return (
    <section>
      Current network: <strong>{window.config.NETWORK_DISPLAY_NAME}</strong>
      {settingsState.user && (
        <div>
          {settingsState.user.attributes.ethAddress}
        </div>
      )}
      <div>
        <select value={window.config.NETWORK_NAME} onChange={(e) => changeNetwork(e.target.value)}>
          {/*<option value="ethereum">Ethereum</option>*/}
          {/*<option value="polygon">Polygon</option>*/}
          <option value="mumbai">Mumbai</option>
          <option value="rinkeby">Rinkeby</option>
        </select>
      </div>
    </section>
  );
}

export default MainPage;