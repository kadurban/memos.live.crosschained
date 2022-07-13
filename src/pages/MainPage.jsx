import React, {useRef, useEffect, useState, useContext} from 'react';
import { DebounceInput } from 'react-debounce-input';
import Card from "../components/Card";
import SettingsContext from "../SettingsContext";
// import ScrollContainer from 'react-indiana-drag-scroll';
import UnsupportedChainInfo from "../components/UnsupportedChainInfo";
import Loader from "../components/Loader";
import GridLayout from "../components/GridLayout";
import { uniq } from "../lib/utils";
import SVG from "../components/SVG";

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function MainPage(props) {
  const { settingsState, setSettingsState } = useContext(SettingsContext);
  const [ nftListLoaded, setNftListLoadedStatus ] = useState(false);
  const [ nftList, setNftList ] = useState([]);
  // const scrollableElementRef = useRef(null);

  async function getCollectionsCrosschain() {
    const { AVAILABLE_NETWORKS } = settingsState.appConfiguration;
    let retrievedNfts = [];

    for (const network of AVAILABLE_NETWORKS) {
      try {
        const NFTs = await window.Moralis.Web3API.token.getNFTOwners({
          chain: network.NETWORK_NAME,
          address: network.MINT_CONTRACT_ADDRESS,
        });

        if (NFTs.result) {
          for (const nft of NFTs.result) {
            nft.onChain = network.NETWORK_NAME
          }
          const uniqueNFTs = uniq(NFTs.result, 'token_id'); // Moralix API bug workarounf
          retrievedNfts = [...retrievedNfts, ...uniqueNFTs]
        }
      } catch (e) {}
    }
    console.log('Recent NFTs:');
    console.log(retrievedNfts);
    return shuffle(retrievedNfts);
  }

  useEffect(async () => {
    setNftList(await getCollectionsCrosschain(settingsState));
    setNftListLoadedStatus(true);
  }, []);

  return (
    <div className="Page-wrapper">
      <h1>
        Recent
        <SearchForm/>
      </h1>

      {!nftListLoaded && <Loader/>}

      {/*{nftListLoaded && nftList.length > 0 && (*/}
      {/*  <div className="NftList-cards-holder">*/}
      {/*    {nftList.map((nft, i) => {*/}
      {/*      if (nft.token_uri) {*/}
      {/*        return <Card onChain={nft.onChain} tokenUri={nft.token_uri} key={i}/>;*/}
      {/*      }*/}
      {/*    })}*/}
      {/*  </div>*/}
      {/*)}*/}

      {/*<br/>*/}
      {/*<br/>*/}
      {/*<br/>*/}
      {nftListLoaded && nftList.length > 0 && <GridLayout nftList={nftList}/>}
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