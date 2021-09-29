const TEXT_EXTENSIONS = ['txt', 'md'];
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov'];
// const AUDIO_EXTENSIONS = ['mp3', 'ogg'];
// const EXECUTABLE_EXTENSIONS = ['html'];
// const ARVR_EXTENSIONS = ['3ds', 'stl'];

const EXTENSIONS = {
  TEXT_EXTENSIONS,
  IMAGE_EXTENSIONS,
  VIDEO_EXTENSIONS,
  UPLOADER_SUPPORTED_EXTENSIONS: [
    ...TEXT_EXTENSIONS,
    ...IMAGE_EXTENSIONS,
    ...VIDEO_EXTENSIONS,
  ]
};

function getConfig(chainId) {
  let CONFIG = {
    MAX_FILE_SIZE: 50000000,
    EXTENSIONS
  };

  // TESTNETS
  if (chainId === 4) {
    CONFIG = {
      ...CONFIG,
      IS_MAINNET: false,
      NETWORK_NAME: 'rinkeby',
      MINT_CONTRACT_ADDRESS: null
    }
  }
  if (chainId === 80001) {
    CONFIG = {
      ...CONFIG,
      IS_MAINNET: false,
      NETWORK_NAME: 'mumbai',
      MINT_CONTRACT_ADDRESS: '0x40f2A0B241a54dF0B5DA1f1C3dA0c4EcaC5EBA97'
    }
  }

  // MAINNETS
  if (chainId === 1) {
    CONFIG = {
      ...CONFIG,
      IS_MAINNET: true,
      NETWORK_NAME: 'ethereum',
      MINT_CONTRACT_ADDRESS: null
    }
  }
  if (chainId === 137) {
    CONFIG = {
      ...CONFIG,
      IS_MAINNET: true,
      NETWORK_NAME: 'polygon',
      MINT_CONTRACT_ADDRESS: null
    }
  }

  if (CONFIG.IS_MAINNET) {
    return {
      ...CONFIG,
      MORALIS_SERVER_URL: '',
      MORALIS_APP_ID: ''
    }
  } else {
    return {
      ...CONFIG,
      MORALIS_SERVER_URL: 'https://shmps0vikusx.moralishost.com:2053/server',
      MORALIS_APP_ID: 'Jb0YBIwKQ0RIy4Mq6PA25YoXPq1tjULYJjR02aR3'
    }
  }
}

export { getConfig };