import React, { useEffect, useState } from 'react';
import { getContentByUrl } from '../../lib/utils';

function MyNFTs(props) {
  const [ nftListLoaded, setLoaNftListLoadedStatus ] = useState(false);
  const [ nftList, setNftList ] = useState([]);

  useEffect(async () => {
    const options = { chain: 'rinkeby' };
    const retrievedNfts = await window.Moralis.Web3API.account.getNFTs(options);

    console.log('My NFTs:');

    for (let nft of retrievedNfts) {
      nft = {
        aaa: 'aaa'
        // ...nft,
        // metadata: await getContentByUrl(nft.token_uri)
      }
    }
    console.log(retrievedNfts);

    // retrievedNfts = retrievedNfts.map(nft => ({
    //   ...nft,
    //   metadata: getContentByUrl(nft.token_uri)
    // }));

    // setTimeout(() => console.log(retrievedNfts), 1000);

    setLoaNftListLoadedStatus(true);
    setNftList(retrievedNfts);
  }, []);

  return (
    <section>
      <h1>My NFT List</h1>
      {!nftListLoaded && 'Retrieving your NFTs'}
      {nftListLoaded && nftList.length === 0 && 'Nothing to show'}

      {nftListLoaded && (
        <>
          Total NFTs: <strong>{nftList.length}</strong>
          <br/>
          {nftList.map(nft => (
            <div key={nft.token_address}>
              {nft.metadata && nft.metadata.image ? (
                  <img src={nft.metadata.image} alt=""/>
                ) : 'Loading NFT'
              }
            </div>
          ))}
        </>
      )}
    </section>
  );
}

export default MyNFTs;