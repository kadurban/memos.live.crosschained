import React, { useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import Moralis from "moralis";

async function queryMoralisSearchByTag(val, setTokens) {
  const values = val.split(' '); 
  const query = new Moralis.Query('MemosToken');
  query.containsAll("tags", values);
  query.descending('createdAt');
  query.limit(300);
  const memosTokens = await query.find();
  setTokens(memosTokens);
}

function SearchPage() {
  const [tokens, setTokens] = useState([]);
  const [query, setQuery] = useState([]);

  return (
    <>
      <div>
        <h1 className="App-page-title">
          Search by tag
        </h1>
        <form className="Form">
          <DebounceInput
            placeholder="e.g.: celebrity"
            minLength={3}
            debounceTimeout={700}
            value={query}
            onChange={e => {
              setQuery(e.target.value.toLowerCase());
              queryMoralisSearchByTag(e.target.value, setTokens);
            }}
          />
          {/*<br/>*/}
          {/*<br/>*/}
          {/*{query.length > 0 ? <>*/}
          {/*  {tokens.length > 0 ? (*/}
          {/*    <SliderMain items={tokens} />*/}
          {/*  ) : <AlertMessage text="Nothing was found. Try another tag to search."/>}*/}
          {/*</> : <AlertMessage text="Start typing to search"/>}*/}
        </form>
      </div>
    </>
  );
}

export default SearchPage;