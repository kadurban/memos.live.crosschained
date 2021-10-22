import React, {useRef, useEffect, useState, useContext} from 'react';
import { DebounceInput } from 'react-debounce-input';
import Card from "../components/Card";
import SettingsContext from "../SettingsContext";
import ScrollContainer from 'react-indiana-drag-scroll';
import UnsupportedChainInfo from "../components/UnsupportedChainInfo";
import Loader from "../components/Loader";
import SVG from "../SVG";

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

  useEffect(async () => {
    setNftList(await getNFTOwners(settingsState));
    setNftListLoadedStatus(true);
  }, []);

  return (
    <div className="Page-wrapper main">
      <h1>
        Recent
        <SearchForm/>
      </h1>

      {!nftListLoaded && <Loader/>}

      {nftListLoaded && nftList.length > 0 && (
        <ScrollContainer className="NftList-cards-holder" ref={scrollableElementRef}>
          {nftList.map((nft, i) => <Card onChain={nft.onChain} tokenUri={nft.token_uri} key={nft.token_uri + i}/>)}*/}
        </ScrollContainer>
      )}
    </div>
  );
}

function SearchForm() {
  const [isSearchOpened, setIsSearchOpened] = useState(false);

  const onSubmit = () => {};
  const onClick = () => {};

  return (
      <div className="SearchForm" style={{ display: 'inline-block'}}>
        {isSearchOpened && <input type="search" placeholder="Type to search..."/>}
        <div
          style={{ display: 'inline-block', position: 'relative', top: '5px', left: '1rem', cursor: 'pointer'}}
          onClick={() => alert('Search is in development and will be here very soon')}
        >
          <SVG search/>
        </div>
      </div>
  )
}

export default MainPage;