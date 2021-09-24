import React, {useContext, useEffect} from 'react';
import { Link, NavLink } from "react-router-dom";
import SettingsContext from '../../SettingsContext';
import SVG from '../../SVG';
import './index.css';

function moveHighlight(topValue) {
  document.querySelector('.Menu-primary-highlight').style.top = `${topValue}px`;
}

function Menu() {
  const { settingsState, setSettingsState } = useContext(SettingsContext);

  const onMenuClick = (e) => {
    moveHighlight(e.target.offsetTop);
    // TODO: do it for mobile only
    document.querySelector('.Menu').classList.add('Menu-hide-animation');
    setTimeout(() => {
      setSettingsState(prevSettingsState => {
        const newState = { ...prevSettingsState, menuShown: false };
        document.body.style.overflow = null;
        return newState;
      });
    }, 200);
  };

  useEffect(() => {
    moveHighlight(document.querySelector('.active').offsetTop);
  }, [])

  return (
    <div className="Menu">
      {/*<button className="Menu-close-btn" onClick={onMenuClick}>*/}
      {/*  <SVG close/>*/}
      {/*</button>*/}

      <div className="Menu-primary">
        <div className="Menu-primary-highlight"/>
        <NavLink exact to="/" className="Menu-primary-item" onClick={onMenuClick}>
          <SVG compas/> Discover
        </NavLink>
        <NavLink exact to="/my" className="Menu-primary-item" onClick={onMenuClick}>
          <SVG carousel/> My collection
        </NavLink>
        <NavLink to="/new" className="Menu-primary-item" onClick={onMenuClick}>
          <SVG wizard/> Wizard
        </NavLink>
        {/*<NavLink to="/search" className="Menu-primary-item" onClick={onMenuClick}>*/}
        {/*  <SVG search/> Search*/}
        {/*</NavLink>*/}
        <NavLink to="/about" className="Menu-primary-item" onClick={onMenuClick}>
          <SVG question/> About
        </NavLink>
      </div>

      <div className="Menu-bottom">
        <a href="https://discord.gg/RA7JPyuySj" target="_blank">
          <SVG discord/>
        </a>
        <a href="https://twitter.com/LiveMemos" target="_blank">
          <SVG twitter/>
        </a>
        <a href="https://t.me/memoslive_chat" target="_blank">
          <SVG telegram/>
        </a>
      </div>

    </div>
  );
}

export default Menu;
