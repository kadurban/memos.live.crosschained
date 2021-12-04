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

  const avalancheSystemName = 'avalanche';
  const avalancheUtilityContractAddress = '0xa9600001331DF60B1B10fAe1684e1b37BeF98b66';
  const avalancheNftContractAddress = '0x576eB2cA9524049c5C94c29F03Ae432121bD46ec';

  let CONFIG = {
    MAX_FILE_SIZE: 50000000,
    EXTENSIONS,
    AVAILABLE_NETWORKS: [{
      NETWORK_NAME: avalancheSystemName,
      UTILITY_CONTRACT_ADDRESS: avalancheUtilityContractAddress,
      MINT_CONTRACT_ADDRESS: avalancheNftContractAddress
    }],
    FUTURE_NETWORKS: ['avalanche', 'solana']
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
      MORALIS_SERVER_URL: 'https://sluthrytwo9u.usemoralis.com:2053/server',
      MORALIS_APP_ID: 'Af2lpGqSuP81zD68XZOR8oN5aS646Bkefn8eMMkI'
    }
  } else {
    return {
      ...CONFIG,
      MORALIS_SERVER_URL: 'https://y5xpun8zyqtc.usemoralis.com:2053/server',
      MORALIS_APP_ID: 'd1MBBkZMwdoVXYMjZtS0zPj2JfASuuV2FmwZ64Cl'
    }
  }
}

export { getConfig };