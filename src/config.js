const TEXT_EXTENSIONS = ['txt', 'md'];
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png'];
const ANIMATION_EXTENSIONS = ['gif'];
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov'];
// const AUDIO_EXTENSIONS = ['mp3', 'ogg'];
// const EXECUTABLE_EXTENSIONS = ['html'];
// const ARVR_EXTENSIONS = ['3ds', 'stl'];

const EXTENSIONS = {
  TEXT_EXTENSIONS,
  IMAGE_EXTENSIONS,
  ANIMATION_EXTENSIONS,
  VIDEO_EXTENSIONS,
  UPLOADER_SUPPORTED_EXTENSIONS: [
    ...TEXT_EXTENSIONS,
    ...IMAGE_EXTENSIONS,
    ...ANIMATION_EXTENSIONS,
    ...VIDEO_EXTENSIONS,
  ]
};

function getConfig(chainId) {
  const mumbaiSystemName = 'mumbai';
  const mumbaiUtilityContractAddress = '0xa9600001331DF60B1B10fAe1684e1b37BeF98b66';
  const mumbaiNftContractAddress = '0x576eB2cA9524049c5C94c29F03Ae432121bD46ec';

  const polygonSystemName = 'polygon';
  const polygonUtilityContractAddress = '0x8FC84aB3E8DF0559df005D3e656Ea6Da2aFBEBCE';
  const polygonNftContractAddress = '0x820Eb6837B36d82B4B6d912a7702C5dA31259Df9';

  const avalancheSystemName = 'avalanche';
  const avalancheUtilityContractAddress = '0x7966979596ca5cD6176d973275Ec23805BD054aF';
  const avalancheNftContractAddress = '0x5a881Cfe11C7F54B506b2A75DbdDBcF57f3CDDBF';

  let CONFIG = {
    MAX_FILE_SIZE: 50000000,
    EXTENSIONS,
    AVAILABLE_NETWORKS: [{
      NETWORK_NAME: avalancheSystemName,
      UTILITY_CONTRACT_ADDRESS: avalancheUtilityContractAddress,
      MINT_CONTRACT_ADDRESS: avalancheNftContractAddress
    }, {
      NETWORK_NAME: polygonSystemName,
      UTILITY_CONTRACT_ADDRESS: polygonUtilityContractAddress,
      MINT_CONTRACT_ADDRESS: polygonNftContractAddress
    }],
    FUTURE_NETWORKS: ['bsc', 'solana']
  };

  if (/192.168.1.5/.test(window.location.href) || /http:\/\/localhost:3000/.test(window.location.href) || /test.memos.live/.test(window.location.href)) {
    CONFIG.AVAILABLE_NETWORKS = [...CONFIG.AVAILABLE_NETWORKS, {
      NETWORK_NAME: mumbaiSystemName,
      UTILITY_CONTRACT_ADDRESS: mumbaiUtilityContractAddress,
      MINT_CONTRACT_ADDRESS: mumbaiNftContractAddress
    }]
  }

  if (chainId === 80001) { // mumbai
    CONFIG = {
      ...CONFIG,
      IS_MAINNET: false,
      NETWORK_NAME: mumbaiSystemName,
      UTILITY_CONTRACT_ADDRESS: mumbaiUtilityContractAddress,
      MINT_CONTRACT_ADDRESS: mumbaiNftContractAddress
    }
  }

  // MAINNETS
  if (chainId === 137) { // polygon
    CONFIG = {
      ...CONFIG,
      IS_MAINNET: true,
      NETWORK_NAME: polygonSystemName,
      UTILITY_CONTRACT_ADDRESS: polygonUtilityContractAddress,
      MINT_CONTRACT_ADDRESS: polygonNftContractAddress
    }
  }

  if (chainId === 1) { // avalanche
    CONFIG = {
      ...CONFIG,
      IS_MAINNET: true,
      NETWORK_NAME: avalancheSystemName,
      UTILITY_CONTRACT_ADDRESS: avalancheUtilityContractAddress,
      MINT_CONTRACT_ADDRESS: avalancheNftContractAddress
    }
  }

  if (CONFIG.IS_MAINNET) {
    return {
      ...CONFIG,
      MORALIS_SERVER_URL: 'https://s1y78pftafiy.usemoralis.com:2053/server',
      MORALIS_APP_ID: 'B5YAeM54YwgVfhCEb7u1Zd4wye3U1vRLrUMJgPIR'
    }
  } else {
    return {
      ...CONFIG,
      MORALIS_SERVER_URL: 'https://9yqxytt7d1ew.usemoralis.com:2053/server',
      MORALIS_APP_ID: '9w2T8sfZ5APXJQVVUwVzYep6IiSWCJ63om5Sx1WP'
    }
  }
}

export { getConfig };