import React, {useContext, useEffect, useRef} from 'react';
import Card from "../../components/Card";
import './index.css';

function GridLayout(props) {
  return (
    <div className="GridLayout">
      {props.nftList.map((nft, i) => {
        if (nft.token_uri) {
          return <Card onChain={nft.onChain} tokenUri={nft.token_uri} key={i}/>;
        }
      })}
    </div>
  );
}

export default GridLayout;