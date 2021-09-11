import React, { useEffect, useState, useContext } from 'react';
import SettingsContext from "../../SettingsContext";
import Card from "../Card";
import AlertMessage from "../AlertMessage";
import { Grid } from "react-virtualized";
import './index.css';

async function getUserNfts() {
  const options = { chain: window.config.NETWORK_NAME };

  // window.Moralis.Web3API.account.getNFTs(options).then(msg => console.log(msg))
  const retrievedNfts = await window.Moralis.Web3API.account.getNFTs(options);
  console.log('My NFTs:');
  console.log(retrievedNfts);
  if (window.config.NETWORK_NAME === 'mumbai') {
    return retrievedNfts.result;
  }
  if (window.config.NETWORK_NAME === 'rinkeby') {
    return retrievedNfts;
  }

  // console.error('Critical error ================ :')
  // console.error(e)
}

function MyNFTs(props) {
  const { settingsState, setSettingsState } = useContext(SettingsContext);
  const [ nftListLoaded, setNftListLoadedStatus ] = useState(false);
  const [ nftList, setNftList ] = useState([]);

  useEffect(async () => {
    let retrievedNfts = [];

    if (settingsState.user) {
      retrievedNfts = await getUserNfts();
    }

    setNftList(retrievedNfts);
    setNftListLoadedStatus(true);
  }, []);

  return (
    <section className="MyNFTs">
      {!settingsState.user ? (
        <AlertMessage text="You need to connect your wallet to see your NFTs"/>
      ) : (
        <>
          <h1>Your NFTs</h1>
          {!nftListLoaded && 'Retrieving your NFTs'}
          {nftListLoaded && nftList.length === 0 && 'Nothing to show'}

          {nftListLoaded && nftList.length > 0 && (
            <div className="MyNFTs-cards-holder">
              {/*<div className="MyNFTs-cards-holder-arrow-next"/>*/}
              {/*<div className="MyNFTs-cards-holder-arrow-prev"/>*/}
              {nftList.map((nft, i) => (
                <Card
                  key={nft.token_uri + i}
                  tokenUri={nft.token_uri}
                  tokenAddress={nft.token_address}
                  tokenId={nft.token_id}
                  owner={nft.owner_of}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default MyNFTs;