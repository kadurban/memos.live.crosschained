import React, {useContext, useEffect, useState} from 'react';
import MyNFTs from '../components/MyNFTs'

function MyCollectionPage(props) {
  return (
    <div className="Page-wrapper">
      {/*<h1>My Collection</h1>*/}
      <MyNFTs/>
    </div>
  );
}

export default MyCollectionPage;