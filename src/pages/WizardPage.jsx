import React from 'react';
import Wizard from '../components/Wizard'
import AlertMessage from '../components/AlertMessage'

function WizardPage(props) {
  return (
    <div className="Page-wrapper">
      <h1>NFT Wizard</h1>
      <Wizard/>
    </div>
  );
}

export default WizardPage;