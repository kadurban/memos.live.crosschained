import React, {useContext, useEffect, useState} from 'react';
import MyNFTs from '../components/MyNFTs'

function MyCollectionPage(props) {
  return (
    <div className="Page-wrapper main">
      <MyNFTs/>
    </div>
  );
}

export default MyCollectionPage;