import React, { useState } from 'react';
import Moralis from 'moralis';
import { Redirect } from "react-router-dom";
// import Card from '../Card/Card';
// import SVG from '../SVG';

const mintToken = async (tokenURI) => {
  const web3 = new Moralis.Web3(window.ethereum);

  const encodedFunction = web3.eth.abi.encodeFunctionCall({
    name: 'mintToken',
    type: 'function',
    inputs: [{
      type: 'string',
      name: 'tokenURI'
    }]
  }, [tokenURI]);

  const txParams = {
    to: window.config.MINT_CONTRACT_ADDRESS,
    from: window.ethereum.selectedAddress,
    data: encodedFunction
  };

  const tokenId = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [txParams]
  });

  return tokenId;
};

function PreviewStep(props) {
  const { tokenURI, metaData } = props;
  const [tokenId, setTokenId] = useState(null);
  // const [redirect, setRedirect] = useState(null);
  //
  // if (redirect) {
  //     return <Redirect to={redirect} />
  // }

  return (
    <>
      {tokenId ? (
        <>
          <strong>Token ID:</strong> {tokenId}
        </>
      ) : (
        <>
          <strong>tokenURI:</strong> {tokenURI}
          <textarea
            defaultValue={JSON.stringify(metaData, null, 2)}
            style={{ display: 'block', width: '360px', margin: 'auto', height: '200px', whiteSpace: 'nowrap' }}
          />
          <hr/>

          <button onClick={async () => {
            const tokenId = await mintToken(tokenURI);
            setTokenId(tokenId);
          }}>
            Mint
          </button>
        </>
      )}
    </>
  );
}

export default PreviewStep;
