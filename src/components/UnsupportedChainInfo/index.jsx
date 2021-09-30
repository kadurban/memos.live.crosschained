import React from 'react';
import './index.css';

import AlertMessage from '../AlertMessage';

async function changeNetwork(id) {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: id }]
  });
}

export default function UnsupportedChainInfo(props) {
  return (
    <div className="UnsupportedChainInfo">
      <h1>Change network in Metamask</h1>
      {/*<AlertMessage text="Switch your wallet to one of the following supported networks:">*/}
      <AlertMessage>
        <h2>Supported networks:</h2>
        <div style={{fontSize: '18px', display: 'flex'}}>
          <svg width="24px" height="24px" version="1.1" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 784.37 1277.39">
            <g id="Layer_x0020_1">
              <metadata id="CorelCorpID_0Corel-Layer"/>
              <g id="_1421394342400">
                <g>
                  <polygon fill="#343434" fillRule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "/>
                  <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "/>
                  <polygon fill="#3C3C3B" fillRule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "/>
                  <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89 "/>
                  <polygon fill="#141414" fillRule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33 "/>
                  <polygon fill="#393939" fillRule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33 "/>
                </g>
              </g>
            </g>
          </svg>
          <span style={{marginLeft: '.5rem'}}>
            Rinkeby - <small>Ethereum Testnet</small>
          </span>
        </div>
        {/*<div style={{fontSize: '18px', display: 'flex'}}>*/}
        {/*  <svg width="24px" height="24px" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 38.4 33.5">*/}
        {/*    <g>*/}
        {/*      <path fill="#8247E5" className="st0" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3*/}
        {/*  c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7*/}
        {/*  c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7*/}
        {/*  c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1*/}
        {/*  L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7*/}
        {/*  c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/>*/}
        {/*    </g>*/}
        {/*  </svg>*/}
        {/*  <span style={{marginLeft: '.5rem'}}>*/}
        {/*    Mumbai - <small>Polygon Testnet</small>*/}
        {/*  </span>*/}
        {/*</div>*/}
      </AlertMessage>
    </div>
  );
}

function EthereumIcon() {
  return (
    <svg width="84" height="135" viewBox="0 0 84 135" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M42.4359 53.5032C42.4359 39.3115 42.4359 25.1197 42.4359 10.928C42.3387 10.928 42.3387 10.928 42.2415 10.8307C41.7555 11.6084 41.2694 12.386 40.7834 13.1636C37.2841 18.9959 33.7847 24.9253 30.1882 30.7575C26.8833 36.2009 23.5784 41.6443 20.2734 47.0878C17.3573 51.8507 14.5384 56.6137 11.6223 61.4739C10.2614 63.8068 8.80338 66.1397 7.44253 68.4726C7.24812 68.7642 7.05371 69.0558 7.05371 69.3474C7.44253 69.639 7.73414 69.4446 8.02575 69.2502C13.858 66.6257 19.593 64.0012 25.4252 61.2795C30.7714 58.8494 36.0204 56.4193 41.3666 53.9892C41.8527 53.9892 42.2415 53.892 42.4359 53.5032Z"
        fill="url(#speedyEthPaint0_linear)" fillOpacity="0.6"></path>
      <path
        d="M41.658 126.211C41.658 125.92 41.658 125.531 41.658 125.239C41.658 116.394 41.658 107.548 41.658 98.7026C41.658 97.8278 41.4636 97.2445 40.5887 96.8557C35.8257 94.134 31.16 91.3151 26.4942 88.4962C22.4116 86.0661 18.3291 83.636 14.2465 81.2059C11.7192 79.6506 9.09472 78.1926 6.56742 76.6373C6.66462 76.8317 6.56742 76.6373 6.47021 76.7345V76.8317C6.56742 76.9289 6.56742 77.1234 6.66462 77.2206C18.2319 93.5508 29.8963 109.881 41.4636 126.211C41.4636 126.211 41.5608 126.211 41.658 126.211Z"
        fill="url(#speedyEthPaint1_linear)" fillOpacity="0.6"></path>
      <path
        d="M42.3389 53.5032C42.3389 39.3115 42.3389 25.1197 42.3389 10.928C42.4361 10.928 42.4361 10.928 42.5333 10.8307C43.0193 11.6084 43.5053 12.386 43.9913 13.1636C47.4907 18.9959 50.99 24.9253 54.5865 30.7575C57.8915 36.2009 61.1964 41.6443 64.5013 47.0878C67.4174 51.8507 70.2363 56.6137 73.1525 61.4739C74.5133 63.8068 75.9714 66.1397 77.3322 68.4726C77.5266 68.7642 77.721 69.0558 77.721 69.3474C77.3322 69.639 77.0406 69.4446 76.749 69.2502C70.9168 66.6257 65.1817 64.0012 59.3495 61.2795C54.0033 58.8494 48.7543 56.4193 43.4081 53.9892C43.0193 53.9892 42.5333 53.892 42.3389 53.5032Z"
        fill="url(#speedyEthPaint2_linear)"></path>
      <path
        d="M42.339 53.5036C43.0194 53.7952 43.6027 53.9896 44.2831 54.2812C48.2684 56.1281 52.351 57.975 56.3364 59.7246C58.2804 60.5995 60.3217 61.5715 62.2658 62.4463C65.0847 63.71 67.9036 64.9736 70.7225 66.2373C72.6666 67.1121 74.7079 68.0842 76.6519 68.959C77.0407 69.1534 77.3324 69.3478 77.7212 69.3478C77.9156 69.6394 77.624 69.7366 77.4296 69.8338C75.5827 70.9031 73.7358 72.0695 71.7917 73.1388C68.7784 74.8884 65.7651 76.6381 62.849 78.3878C59.4469 80.429 56.0447 82.3731 52.6426 84.4144C49.3377 86.3585 46.0328 88.3025 42.7278 90.2466C42.1446 90.441 42.1446 90.0522 42.0474 89.6634C41.9502 89.1774 41.9502 88.6914 41.9502 88.2053C41.9502 77.2213 41.9502 66.1401 41.9502 55.1561C42.0474 54.7672 41.853 54.0868 42.339 53.5036Z"
        fill="url(#speedyEthPaint3_linear)"></path>
      <path
        d="M42.3382 53.5036C42.3382 65.3625 42.3382 77.3185 42.3382 89.1774C42.3382 89.5662 42.0466 90.1494 42.727 90.3438C42.4354 90.6354 42.241 90.5382 41.9494 90.3438C40.0053 89.1774 38.1585 88.1081 36.2144 86.9417C33.4927 85.3864 30.8682 83.734 28.1465 82.1787C24.2583 79.8458 20.4674 77.6101 16.5792 75.2772C13.6631 73.5276 10.6498 71.7779 7.63648 70.0282C7.34487 69.8338 7.15046 69.7366 6.95605 69.445C7.24767 69.1534 7.63648 69.0562 7.92809 68.8618C11.9134 67.0149 15.996 65.168 19.9814 63.4184C23.0919 62.0575 26.1052 60.5995 29.2157 59.2386C33.3955 57.2945 37.6724 55.3505 41.8522 53.5036C42.1438 53.6008 42.241 53.6008 42.3382 53.5036Z"
        fill="url(#speedyEthPaint4_linear)" fillOpacity="0.6"></path>
      <path
        d="M41.5615 126.211C41.5615 125.92 41.5615 125.531 41.5615 125.239C41.5615 116.394 41.5615 107.548 41.5615 98.7026C41.5615 97.8278 41.7559 97.2445 42.6308 96.8557C47.3938 94.134 52.0595 91.3151 56.7253 88.4962C60.8079 86.0661 64.8904 83.636 68.973 81.2059C71.5003 79.6506 74.1248 78.1926 76.6521 76.6373C76.5549 76.8317 76.6521 76.6373 76.7493 76.7345V76.8317C76.6521 76.9289 76.6521 77.1234 76.5549 77.2206C64.9876 93.5508 53.3232 109.881 41.7559 126.211C41.6587 126.211 41.6587 126.211 41.5615 126.211Z"
        fill="url(#speedyEthPaint5_linear)"></path>
      <path
        d="M42.0486 51.9475C42.0486 37.2697 42.0486 22.5919 42.0486 8.01139C41.9514 8.01139 41.9514 8.01139 41.8542 7.91418C41.3682 8.69181 40.8822 9.56665 40.2989 10.3443C36.7024 16.3709 33.0087 22.4947 29.4121 28.5214C26.01 34.1592 22.6079 39.797 19.2057 45.4348C16.1924 50.3922 13.2763 55.3496 10.263 60.2098C8.80493 62.6399 7.34687 64.9728 5.88881 67.4029C5.69441 67.6945 5.5 67.9861 5.5 68.2777C5.88881 68.5693 6.18043 68.3749 6.56924 68.1805C12.5959 65.4588 18.5253 62.7371 24.5519 60.0154C29.9953 57.4881 35.536 55.058 40.9794 52.5307C41.4654 52.5307 41.8542 52.4335 42.0486 51.9475Z"
        stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"
        strokeLinejoin="round"></path>
      <path
        d="M42.0476 126.989C42.0476 126.697 42.0476 126.308 42.0476 126.017C42.0476 116.88 42.0476 107.742 42.0476 98.7025C42.0476 97.8277 41.8532 97.2445 40.9783 96.7585C36.1181 93.9395 31.2579 91.0234 26.3978 88.1073C22.218 85.58 17.941 83.0527 13.7613 80.6226C11.1368 79.0674 8.51227 77.5121 5.79056 75.9568C5.88777 76.1513 5.79056 75.9568 5.69336 76.0541V76.1513C5.79056 76.2485 5.79056 76.4429 5.88777 76.5401C17.8438 93.3563 29.7999 110.27 41.8532 127.086C41.9504 127.086 41.9504 127.086 42.0476 126.989Z"
        stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"
        strokeLinejoin="round"></path>
      <path
        d="M41.9512 51.9475C41.9512 37.2697 41.9512 22.5919 41.9512 8.01139C42.0484 8.01139 42.0484 8.01139 42.1456 7.91418C42.6316 8.69181 43.1176 9.56665 43.7008 10.3443C47.2974 16.3709 50.9911 22.4947 54.5877 28.5214C57.9898 34.1592 61.3919 39.797 64.7941 45.4348C67.8074 50.3922 70.7235 55.3496 73.7368 60.2098C75.1948 62.6399 76.6529 64.9728 78.111 67.4029C78.3054 67.6945 78.4998 67.9861 78.4998 68.2777C78.111 68.5693 77.8194 68.3749 77.4305 68.1805C71.4039 65.4588 65.4745 62.7371 59.4478 60.0154C54.0044 57.4881 48.4638 55.058 43.0204 52.5307C42.6316 52.5307 42.2428 52.4335 41.9512 51.9475Z"
        stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"
        strokeLinejoin="round"></path>
      <path
        d="M41.9494 51.9478C42.6298 52.2394 43.3102 52.4338 43.8934 52.7254C48.0732 54.5723 52.1558 56.5163 56.3355 58.3632C58.3768 59.3352 60.4181 60.2101 62.4594 61.1821C65.3755 62.543 68.2916 63.8066 71.1105 65.0703C73.1518 66.0423 75.193 66.9171 77.2343 67.8892C77.6231 68.0836 77.9148 68.3752 78.4008 68.3752C78.5952 68.6668 78.3036 68.764 78.1092 68.8612C76.1651 70.0276 74.221 71.1941 72.3741 72.2633C69.2636 74.1102 66.1531 75.8599 63.1398 77.7068C59.6404 79.748 56.1411 81.8865 52.6418 83.9278C49.2396 85.9691 45.8375 87.9131 42.4354 89.9544C41.8522 90.1488 41.755 89.76 41.6578 89.3712C41.5605 88.8852 41.5605 88.3992 41.5605 87.9131C41.5605 76.5403 41.5605 65.1675 41.5605 53.7946C41.6578 53.3086 41.4633 52.531 41.9494 51.9478Z"
        stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"
        strokeLinejoin="round"></path>
      <path
        d="M41.9514 51.9478C41.9514 64.1954 41.9514 76.5403 41.9514 88.788C41.9514 89.1768 41.6598 89.8572 42.3402 89.9544C42.0486 90.246 41.8542 90.1488 41.5626 89.9544C39.6185 88.788 37.6744 87.6215 35.6332 86.4551C32.9115 84.8026 30.0926 83.1502 27.3708 81.4977C23.3855 79.1648 19.4001 76.7347 15.4148 74.4018C12.4015 72.555 9.29095 70.8053 6.18043 69.0556C5.88882 68.8612 5.5972 68.764 5.5 68.4724C5.79161 68.1808 6.18043 68.0836 6.47204 67.8892C10.6518 65.9451 14.7344 64.0982 18.9141 62.2514C22.1218 60.7933 25.2324 59.4324 28.4401 57.9744C32.8143 56.0303 37.1884 53.989 41.4654 52.045C41.757 52.045 41.8542 52.045 41.9514 51.9478Z"
        stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"
        strokeLinejoin="round"></path>
      <path
        d="M41.9512 126.989C41.9512 126.697 41.9512 126.308 41.9512 126.017C41.9512 116.88 41.9512 107.742 41.9512 98.7025C41.9512 97.8277 42.1456 97.2445 43.0204 96.7585C47.8806 93.9395 52.7408 91.0234 57.601 88.1073C61.7807 85.58 66.0577 83.0527 70.2375 80.6226C72.862 79.0674 75.4865 77.5121 78.2082 75.9568C78.111 76.1513 78.2082 75.9568 78.3054 76.0541V76.1513C78.2082 76.2485 78.2082 76.4429 78.111 76.5401C66.1549 93.3563 54.1988 110.27 42.1456 127.086C42.1456 127.086 42.0484 127.086 41.9512 126.989Z"
        stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"
        strokeLinejoin="round"></path>
      <defs>
        <linearGradient id="speedyEthPaint0_linear" x1="24.7448" y1="10.8307" x2="24.7448" y2="69.4961"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="#F2F6FF"></stop>
          <stop offset="1" stopColor="#F2F6FF" stopOpacity="0"></stop>
        </linearGradient>
        <linearGradient id="speedyEthPaint1_linear" x1="24.0641" y1="76.6373" x2="24.0641" y2="126.211"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="#F2F6FF"></stop>
          <stop offset="1" stopColor="#F2F6FF" stopOpacity="0"></stop>
        </linearGradient>
        <linearGradient id="speedyEthPaint2_linear" x1="60.03" y1="10.8307" x2="60.03" y2="69.4961"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="white"></stop>
          <stop offset="1" stopColor="white" stopOpacity="0"></stop>
        </linearGradient>
        <linearGradient id="speedyEthPaint3_linear" x1="59.8677" y1="53.5036" x2="59.8677" y2="90.2983"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="white"></stop>
          <stop offset="1" stopColor="white" stopOpacity="0"></stop>
        </linearGradient>
        <linearGradient id="speedyEthPaint4_linear" x1="24.8415" y1="53.5036" x2="24.8415" y2="90.5279"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="#F2F6FF"></stop>
          <stop offset="1" stopColor="#F2F6FF" stopOpacity="0"></stop>
        </linearGradient>
        <linearGradient id="speedyEthPaint5_linear" x1="59.1554" y1="76.6373" x2="59.1554" y2="126.211"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="white"></stop>
          <stop offset="1" stopColor="white" stopOpacity="0"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
}

function PolygonIcon() {
  return (
    <svg width="126" height="135" viewBox="0 0 126 135" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M91.9995 49.5763C90.8957 48.9929 89.6635 48.6876 88.4121 48.6876C87.1606 48.6876 85.9284 48.9929 84.8246 49.5763L68.6527 59.0364L57.3535 65.2476L41.1816 74.7147C40.0778 75.2982 38.8456 75.6034 37.5941 75.6034C36.3426 75.6034 35.1105 75.2982 34.0067 74.7147L21.1539 67.3158C20.0965 66.7127 19.2121 65.8527 18.5844 64.8172C17.9566 63.7816 17.6063 62.6048 17.5664 61.398V46.621C17.5431 45.401 17.8672 44.1991 18.5016 43.1526C19.1359 42.1062 20.055 41.2574 21.1539 40.7032L34.0067 33.6046C35.1105 33.0212 36.3426 32.7159 37.5941 32.7159C38.8456 32.7159 40.0778 33.0212 41.1816 33.6046L54.0344 40.7032C55.0917 41.3063 55.9761 42.1663 56.6039 43.2018C57.2316 44.2373 57.582 45.4141 57.6219 46.6209V56.0811L68.6527 49.5764V40.4097C68.6812 39.1955 68.3656 37.9977 67.7415 36.9519C67.1175 35.906 66.21 35.0539 65.1217 34.492L41.4782 20.8887C40.3744 20.3052 39.1422 20 37.8907 20C36.6392 20 35.4071 20.3052 34.3033 20.8887L10.3914 34.492C9.19783 34.9498 8.18026 35.7679 7.48308 36.8301C6.7859 37.8923 6.44452 39.1448 6.50735 40.4098V67.9096C6.48941 69.1249 6.81599 70.3209 7.45007 71.3619C8.08416 72.4029 9.00037 73.2474 10.0948 73.7995L34.0067 87.4306C35.1105 88.0141 36.3426 88.3194 37.5941 88.3194C38.8456 88.3194 40.0778 88.0141 41.1816 87.4306L57.3535 78.264L68.4126 71.7593L84.528 62.6207C85.6318 62.0372 86.864 61.732 88.1154 61.732C89.3669 61.732 90.5991 62.0372 91.7029 62.6207L104.556 69.7192C105.613 70.3223 106.497 71.1823 107.125 72.2178C107.753 73.2533 108.103 74.4302 108.143 75.637V90.1275C108.166 91.3475 107.842 92.5494 107.208 93.5959C106.574 94.6423 105.655 95.4911 104.556 96.0453L91.7029 103.437C90.5991 104.021 89.3669 104.326 88.1154 104.326C86.864 104.326 85.6318 104.021 84.528 103.437L71.6752 96.3387C70.6178 95.7356 69.7335 94.8756 69.1057 93.8401C68.478 92.8046 68.1276 91.6278 68.0877 90.4209V80.9259L57.3535 87.1302V96.5902C57.3303 97.8102 57.6543 99.0121 58.2887 100.059C58.9231 101.105 59.8422 101.954 60.941 102.508L84.8528 116.111C85.9566 116.695 87.1888 117 88.4403 117C89.6918 117 90.924 116.695 92.0278 116.111L115.94 102.508C116.991 101.902 117.869 101.042 118.491 100.008C119.114 98.9738 119.461 97.8002 119.499 96.5973V69.0904C119.522 67.8704 119.198 66.6685 118.564 65.622C117.929 64.5756 117.01 63.7268 115.911 63.1726L91.9995 49.5763Z"
        fill="url(#speedyPolygonPaint0_linear)" fillOpacity="0.7" stroke="white" strokeWidth="2.5"></path>
      <defs>
        <linearGradient id="speedyPolygonPaint0_linear" x1="63" y1="20" x2="63" y2="117"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="white"></stop>
          <stop offset="1" stopColor="white" stopOpacity="0.3"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
}
