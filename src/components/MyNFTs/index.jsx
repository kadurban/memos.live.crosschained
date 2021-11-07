import React, { useEffect, useState, useContext, useRef } from 'react';
import SettingsContext from "../../SettingsContext";
import Card from "../Card";
import AlertMessage from "../AlertMessage";
import { login } from "../LoginSection";
import Loader from "../Loader";
import './index.css';
import SVG from "../SVG";
import {NavLink} from "react-router-dom";
import ScrollContainer from "react-indiana-drag-scroll";

async function getUserNFTs(settingsState) {
  const { AVAILABLE_NETWORKS } = settingsState.appConfiguration;
  let retrievedNfts = [];

  for (const availableNetwork of AVAILABLE_NETWORKS) {
    const NFTs = await window.Moralis.Web3API.account.getNFTsForContract({
      chain: availableNetwork.NETWORK_NAME,
      address: settingsState.user.attributes.ethAddress,
      token_address: availableNetwork.MINT_CONTRACT_ADDRESS
    });
    if (NFTs.result) {
      for (const nft of NFTs.result) {
        nft.onChain = availableNetwork.NETWORK_NAME
      }
      retrievedNfts = [...retrievedNfts, ...NFTs.result]
    }
  }

  console.log('User NFTs:');
  console.log(retrievedNfts);
  return retrievedNfts;
}


function MyNFTs(props) {
  const { settingsState, setSettingsState } = useContext(SettingsContext);
  const [ nftListLoaded, setNftListLoadedStatus ] = useState(false);
  const [ nftList, setNftList ] = useState([]);
  const scrollableElementRef = useRef(null);

  useEffect(async () => {
    let retrievedNfts = [];

    if (settingsState.user) {
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
          {!nftListLoaded && <Loader/>}

          {nftListLoaded && nftList.length === 0 && (
            <AlertMessage text="Nothing to show">
              Go to <NavLink to="/wizard">Wizard page</NavLink> to create new NFT card.
            </AlertMessage>
          )}

          {nftListLoaded && nftList.length > 0 && (
            <ScrollContainer className="NftList-cards-holder" ref={scrollableElementRef}>
              {nftList.map((nft, i) => <Card tokenUri={nft.token_uri} key={nft.token_uri + i} onChain={nft.onChain}/>)}
            </ScrollContainer>
          )}
        </>
      )}
    </section>
  );
}

export default MyNFTs;