import React from 'react';

function AboutPage(props) {
  return (
    <div className="Page-wrapper">
      <h1>
        About memos.live:
      </h1>
      <div>
        With memos.live anyone can create, collect and trade NFT which are correlated with various events which are important in your opinion. It can be "birth of a child" or a day when a favorite "football team wins a championship" or a day when "Bitcoin was launched" and so on… NFTs created with memos.live are not just a single picture or video. Think about it like it is a package of various information and files associated with the event (date, time, pictures, videos, text). These packages of information are represented like Cards which users can interact with.
      </div>
      <hr/>
      <h2>Partners</h2>
      <ul>
        <li>
          Moralis
        </li>
        <li>
          NiftyKit
        </li>
      </ul>
    </div>
  );
}

export default AboutPage;