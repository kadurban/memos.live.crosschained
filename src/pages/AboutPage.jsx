import React from 'react';
import gif from '../assets/img/presa-gif.gif';

function AboutPage(props) {
  return (
    <div className="Page-wrapper">
      {/*<h1>*/}
      {/*  About memos.live*/}
      {/*</h1>*/}

      <h1>About digital interactive cards of memos.live</h1>
      <div className="light-background-with-padding bigger-padding markdown">
        <div>
          With memos.live users can create digital interactive cards (NFTs) which are associated with various events
          which are important in their opinion.
          NFTs created with memos.live are not just a single picture or video. Think about it like it is a
          package of various information and files (date, time, pictures, videos, text
          information and etc.) associated with the event and represented as interactive digital cards.
          It can be "birth of a child" or a day when a favorite "football team wins a championship" or a day when
          "Bitcoin was launched" and so on…
          <br/>
          <br/>
          <h2>
            MLU token
          </h2>
          Ti create a new card user must have MLU tokens. Smart contract will use these funds for minting.
          <br/>
          Cost of card creation is <b>1 MLU</b> from the beginning. But every next card creation cost will be increased
          by <b>0.001 MLU</b>.
          <br/>
          All MLU tokens received by contract during cards creation will be distributed between memos.live card holders proportionally.
          <br/>
          <br/>
          <img src={gif} alt="Moralis"/>
        </div>
        <hr/>
        <h3>Partners</h3>
        <div className="partners-logos">
          <a href="https://moralis.io/" target="_blank">
            <img src="https://moralis.io/wp-content/uploads/2021/01/logo_footer.svg" alt="Moralis"/>
            <span>
              The Ultimate Web3 Development Platform ❤️
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;