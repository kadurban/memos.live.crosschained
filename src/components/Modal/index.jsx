import React from 'react';
import './index.css';

export default function Modal(props) {
  return (
    <div className="Modal">
      <div className="Modal-content">
        <button className="Modal-hide" onClick={props.onCancel}>✕</button>
        {props.children}
      </div>
    </div>
  );
}