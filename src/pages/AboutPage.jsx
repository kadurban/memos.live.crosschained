import React from 'react';
import AlertMessage from '../components/AlertMessage';

function AboutPage(props) {
  return (
    <div className="Page-wrapper">
      <h1>
        About Memorable NFTs
      </h1>

      <div className="light-background-with-padding bigger-padding markdown">
        <div>
          With memos.live anyone can create NFTs which are correlated with various events which are important in your opinion. NFTs created with memos.live are not just a single picture or video. Think about it like it is a package of various information and files associated with the event (date, time, pictures, videos, text). These packages of information are represented like Cards which users can interact with. It can be "birth of a child" or a day when a favorite "football team wins a championship" or a day when "Bitcoin was launched" and so on…
        </div>
        <hr/>
        <h3 style={{textAlign: 'center'}}>Partners</h3>
        <div className="partners-logos">
          <a href="https://moralis.io/" target="_blank">
            <img src="https://moralis.io/wp-content/uploads/2021/01/logo_footer.svg" alt="Moralis"/>
            <span>
              The Ultimate Web3 Development Platform
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;