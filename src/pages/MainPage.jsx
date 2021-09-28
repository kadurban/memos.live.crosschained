import React, {useRef, useEffect, useState, useContext} from 'react';
import Loader from '../components/Loader'
import AlertMessage from "../components/AlertMessage";
import Card from "../components/Card";
import {getSpecsFromHash} from "../lib/utils";
import SettingsContext from "../SettingsContext";

async function getNFTsForContract(settingsState) {
  const { NETWORK_NAME, MINT_CONTRACT_ADDRESS } = settingsState.appConfiguration;
  const options = {
    chain: NETWORK_NAME,
    address: settingsState.user.attributes.ethAddress,
    token_address: MINT_CONTRACT_ADDRESS
  };

  // window.Moralis.Web3API.account.getNFTs(options).then(msg => console.log(msg))
  const retrievedNfts = await window.Moralis.Web3API.account.getNFTsForContract(options);
  console.log('Recent NFTs:');
  console.log(retrievedNfts);
  if (NETWORK_NAME === 'mumbai' || NETWORK_NAME === 'polygon') {
    return retrievedNfts.result;
  }
  // if (settingsState.appConfiguration.NETWORK_NAME === 'rinkeby') {
  //   return retrievedNfts.filter((item) => !settingsState.appConfiguration.ITEMS_TO_FILTER.includes(item.token_id));
  // }
}

function MainPage(props) {
  const { settingsState, setSettingsState } = useContext(SettingsContext);
  const [ nftListLoaded, setNftListLoadedStatus ] = useState(false);
  const [ nftList, setNftList ] = useState([]);
  const scrollableElementRef = useRef(null);

  useEffect(async () => {
    let retrievedNfts = [];

    if (settingsState.user) {
      retrievedNfts = await getNFTsForContract(settingsState);
    }

    setNftList(retrievedNfts);
    setNftListLoadedStatus(true);

  }, []);

  return (
    <div className="Page-wrapper main">
      <h1>Discover</h1>

      {nftListLoaded && nftList.length > 0 && (
        <div className="NftList-cards-holder" ref={scrollableElementRef}>
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
    </div>
  );
}

export default MainPage;