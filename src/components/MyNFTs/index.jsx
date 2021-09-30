import React, { useEffect, useState, useContext, useRef } from 'react';
import SettingsContext from "../../SettingsContext";
import Card from "../Card";
import AlertMessage from "../AlertMessage";
import { login } from "../LoginSection";
import { getSpecsFromHash } from "../../lib/utils";
import Loader from "../Loader";
import './index.css';
import SVG from "../../SVG";
import {NavLink} from "react-router-dom";

// async function getUserNfts(settingsState) {
//   const { NETWORK_NAME } = settingsState.appConfiguration;
//   const options = {
//     chain: NETWORK_NAME
//   };
//
//   // window.Moralis.Web3API.account.getNFTs(options).then(msg => console.log(msg))
//   const retrievedNfts = await window.Moralis.Web3API.account.getNFTs(options);
//   console.log('User NFTs:');
//   console.log(retrievedNfts);
//   if (NETWORK_NAME === 'mumbai' || NETWORK_NAME === 'polygon') {
//     return retrievedNfts.result;
//   }
//   // if (settingsState.appConfiguration.NETWORK_NAME === 'rinkeby') {
//   //   return retrievedNfts.filter((item) => !settingsState.appConfiguration.ITEMS_TO_FILTER.includes(item.token_id));
//   // }
// }

async function getUserNFTs(settingsState) {
  const { NETWORK_NAME, MINT_CONTRACT_ADDRESS } = settingsState.appConfiguration;
  const options = {
    chain: NETWORK_NAME,
    address: settingsState.user.attributes.ethAddress,
    token_address: MINT_CONTRACT_ADDRESS
  };

  const retrievedNfts = await window.Moralis.Web3API.account.getNFTsForContract(options);
  console.log('User NFTs:');
  console.log(retrievedNfts);
  return retrievedNfts.result;
}


function MyNFTs(props) {
  const { settingsState, setSettingsState } = useContext(SettingsContext);
  const [ nftListLoaded, setNftListLoadedStatus ] = useState(false);
  const [ nftList, setNftList ] = useState([]);
  const scrollableElementRef = useRef(null);

  useEffect(async () => {
    let retrievedNfts = [];

    if (settingsState.user) {
      // retrievedNfts = await getUserNfts(settingsState);
      retrievedNfts = await getUserNFTs(settingsState);
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
        <>
          <AlertMessage text="You need to connect your wallet to see your NFTs">
            <button
              className="btn-action btn-big"
              onClick={() => {
                login(setSettingsState, () => {
                  setTimeout(() => window.location.reload(), 1000)
                });
              }}
            >
              <SVG wallet/> Connect Wallet
            </button>
          </AlertMessage>
        </>
      ) : (
        <>
          {!nftListLoaded && (
            <div className="MyNFTs-loader-holder">
              <Loader text="Loading"/>
            </div>
          )}
          {nftListLoaded && nftList.length === 0 && (
            <AlertMessage text="Nothing to show">
              Go to <NavLink to="/wizard">Wizard page</NavLink> to create new NFT card.
            </AlertMessage>
          )}

          {nftListLoaded && nftList.length > 0 && (
            <div className="NftList-cards-holder" ref={scrollableElementRef}>
              {/*<div className="MyNFTs-cards-holder-arrow-next"/>*/}
              {/*<div className="MyNFTs-cards-holder-arrow-prev"/>*/}
              {nftList.map((nft, i) => (
                <Card
                  key={nft.token_uri + i}
                  tokenUri={nft.token_uri}
                  // tokenIpfsHash={nft.token_uri.split('ipfs/')[1]}
                  // specs={getSpecsFromHash(nft.token_uri.split('ipfs/')[1])}
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