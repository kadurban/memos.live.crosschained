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
  const polygonUtilityContractAddress = '0x50968e0973C1A7EFF5000A2EBFfe1bF09f3e7169';
  const polygonNftContractAddress = '0x1508d41b315bbA50566c0bFB10a679E218f44C36';

  const avalancheSystemName = 'avalanche';
  const avalancheUtilityContractAddress = '0xb94003CDFe2ec1235f8AAd2b905D83181B3EC276';
  const avalancheNftContractAddress = '0x244566294bb00417f345E68ae5C1d3107a02b01f';

  let CONFIG = {
    MAX_FILE_SIZE: 50000000,
    EXTENSIONS,
    AVAILABLE_NETWORKS: [{
      NETWORK_NAME: polygonSystemName,
      UTILITY_CONTRACT_ADDRESS: polygonUtilityContractAddress,
      MINT_CONTRACT_ADDRESS: polygonNftContractAddress
    }, {
      NETWORK_NAME: avalancheSystemName,
      UTILITY_CONTRACT_ADDRESS: avalancheUtilityContractAddress,
      MINT_CONTRACT_ADDRESS: avalancheNftContractAddress
    }],
    FUTURE_NETWORKS: [/*'solana'*/]
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