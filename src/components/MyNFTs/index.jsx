import React, { useEffect, useState, useContext, useRef } from 'react';
import SettingsContext from "../../SettingsContext";
import Card from "../Card";
import AlertMessage from "../AlertMessage";
import { getSpecsFromHash } from "../../lib/utils";
import Loader from "../Loader";
import './index.css';

async function getUserNfts() {
  const options = {
    chain: window.config.NETWORK_NAME
  };

  // window.Moralis.Web3API.account.getNFTs(options).then(msg => console.log(msg))
  const retrievedNfts = await window.Moralis.Web3API.account.getNFTs(options);
  console.log('My NFTs:');
  console.log(retrievedNfts);
  if (window.config.NETWORK_NAME === 'mumbai') {
    return retrievedNfts.result;
  }
  if (window.config.NETWORK_NAME === 'rinkeby') {
    // return retrievedNfts;
    return retrievedNfts.filter((item) => !window.config.ITEMS_TO_FILTER.includes(item.token_id));
  }

  // console.error('Critical error ================ :')
  // console.error(e)
}

function MyNFTs(props) {
  const { settingsState, setSettingsState } = useContext(SettingsContext);
  const [ nftListLoaded, setNftListLoadedStatus ] = useState(false);
  const [ nftList, setNftList ] = useState([]);
  const scrollableElementRef = useRef(null);

  useEffect(async () => {
    let retrievedNfts = [];

    if (settingsState.user) {
      retrievedNfts = await getUserNfts();
    }

    setNftList(retrievedNfts);
    setNftListLoadedStatus(true);

    // autoScroll();
    // function autoScroll() {
    //   console.log(scrollableElementRef.current)
    //   scrollableElementRef.current.scrollBy(0, 100);
    //   setTimeout(autoScroll, 100);
    // }
  }, []);

  return (
    <section className="MyNFTs">
      {!settingsState.user ? (
        <AlertMessage text="You need to connect your wallet to see your NFTs"/>
      ) : (
        <>
          <h1>Most Recent</h1>
          {!nftListLoaded && (
            <div className="MyNFTs-loader-holder">
              <Loader text="Loading"/>
            </div>
          )}
          {nftListLoaded && nftList.length === 0 && (
            <div className="MyNFTs-loader-holder">
              Nothing to show
            </div>
          )}

          {nftListLoaded && nftList.length > 0 && (
            <div className="MyNFTs-cards-holder" ref={scrollableElementRef}>
              {/*<div className="MyNFTs-cards-holder-arrow-next"/>*/}
              {/*<div className="MyNFTs-cards-holder-arrow-prev"/>*/}
              {nftList.map((nft, i) => (
                <Card
                  key={nft.token_uri + i}
                  tokenUri={nft.token_uri}
                  tokenIpfsHash={nft.token_uri.split('ipfs/')[1]}
                  specs={getSpecsFromHash(nft.token_uri.split('ipfs/')[1])}
                  // owner={nft}
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