import React from 'react';
import './index.css';

function AlertMessage({ text, children }) {
    return (
        <div className="AlertMessage">
            <div className="AlertMessage-text">
                {text}
            </div>
            {children && (
                <div className="AlertMessage-controls">
                    {children}
                </div>
            )}
        </div>
    );
}

export default AlertMessage;
