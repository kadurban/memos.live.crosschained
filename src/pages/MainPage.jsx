import React, {useRef, useEffect, useState, useContext} from 'react';
import { DebounceInput } from 'react-debounce-input';
import Card from "../components/Card";
import SettingsContext from "../SettingsContext";

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function MainPage(props) {
  const { settingsState, setSettingsState } = useContext(SettingsContext);
  const [ nftListLoaded, setNftListLoadedStatus ] = useState(false);
  const [ nftList, setNftList ] = useState([]);
  const scrollableElementRef = useRef(null);

  async function getNFTOwners() {
    const { AVAILABLE_NETWORKS } = settingsState.appConfiguration;
    let retrievedNfts = [];

    for (const availableNetwork of AVAILABLE_NETWORKS) {
      const NFTs = await window.Moralis.Web3API.token.getNFTOwners({
        chain: availableNetwork.NETWORK_NAME,
        address: availableNetwork.MINT_CONTRACT_ADDRESS,
      });
      if (NFTs.result) {
        for (const nft of NFTs.result) {
          nft.onChain = availableNetwork.NETWORK_NAME
        }
        retrievedNfts = [...retrievedNfts, ...NFTs.result]
      }
    }

    console.log('Recent NFTs:');
    console.log(retrievedNfts);
    return shuffle(retrievedNfts);
  }

  // async function searchNFTs(q) {
  //   const NFTs = await window.Moralis.Web3API.token.searchNFTs({
  //     q,
  //     chain: settingsState.appConfiguration.NETWORK_NAME,
  //     filter: 'name'
  //   });
  //   console.log(NFTs);
  // }

  useEffect(async () => {
    setNftList(await getNFTOwners(settingsState));
    setNftListLoadedStatus(true);
  }, []);

  return (
    <div className="Page-wrapper main">
      <h1>Latest</h1>

      {/*<div className="light-background-with-padding">*/}
      {/*  <DebounceInput*/}
      {/*    type="search"*/}
      {/*    minLength={2}*/}
      {/*    debounceTimeout={300}*/}
      {/*    onChange={e => searchNFTs(e.target.value)}*/}
      {/*  />*/}
      {/*</div>*/}

      {nftListLoaded && nftList.length > 0 && (
        <div className="NftList-cards-holder" ref={scrollableElementRef}>
          {/*<div className="MyNFTs-cards-holder-arrow-next"/>*/}
          {/*<div className="MyNFTs-cards-holder-arrow-prev"/>*/}
          {nftList.map((nft, i) => <Card onChain={nft.onChain} tokenUri={nft.token_uri} key={nft.token_uri + i}/>)}
        </div>
      )}
    </div>
  );
}

export default MainPage;