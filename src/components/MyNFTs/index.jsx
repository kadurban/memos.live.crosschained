import React, { useEffect, useState, useContext } from 'react';
import SettingsContext from "../../SettingsContext";
import Card from "../Card";

async function getUserNfts() {
  const options = { chain: window.config.NETWORK_NAME };
  const retrievedNfts = await window.Moralis.Web3API.account.getNFTs(options);
  console.log('My NFTs:');
  console.log(retrievedNfts);
  if (window.config.NETWORK_NAME === 'mumbai') {
    return retrievedNfts.result;
  }
  if (window.config.NETWORK_NAME === 'rinkeby') {
    return retrievedNfts;
  }
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
    <section>
      {!settingsState.user ? (
        'You need to connect your wallet to see your NFTs'
      ) : (
        <>
          <h1>My NFT List</h1>
          {!nftListLoaded && 'Retrieving your NFTs'}
          {nftListLoaded && nftList.length === 0 && 'Nothing to show'}

          {nftListLoaded && nftList.length > 0 && (
            <>
              Total NFTs: <strong>{nftList.length}</strong>
              <br/>
              {nftList.map(nft => (
                <Card
                  key={nft.token_uri}
                  tokenUri={nft.token_uri}
                  owner={nft.owner_of}
                />
              ))}
            </>
          )}
        </>
      )}
    </section>
  );
}

export default MyNFTs;