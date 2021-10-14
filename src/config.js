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
  const rinkebySystemName = 'rinkeby';
  const rinkebyContractAddress = '0xE4716B9207939a876700DF6860946Cffb922AFDc';
  const mumbaiSystemName = 'mumbai';
  const mumbaiContractAddress = '0x554B11dD7A704d679B381A8A48842D907F883981';

  const AVAILABLE_NETWORKS = [{
    NETWORK_NAME: rinkebySystemName,
    MINT_CONTRACT_ADDRESS: rinkebyContractAddress
  }, {
    NETWORK_NAME: mumbaiSystemName,
    MINT_CONTRACT_ADDRESS: mumbaiContractAddress
  }]

  let CONFIG = {
    MAX_FILE_SIZE: 50000000,
    EXTENSIONS,
    AVAILABLE_NETWORKS
  };

  // TESTNETS
  if (chainId === 4) {
    CONFIG = {
      ...CONFIG,
      IS_MAINNET: false,
      NETWORK_NAME: rinkebySystemName,
      MINT_CONTRACT_ADDRESS: rinkebyContractAddress
    }
  }
  if (chainId === 80001) {
    CONFIG = {
      ...CONFIG,
      IS_MAINNET: false,
      NETWORK_NAME: mumbaiSystemName,
      MINT_CONTRACT_ADDRESS: mumbaiContractAddress
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
      MORALIS_SERVER_URL: 'https://h5o44mx7eetj.grandmoralis.com:2053/server',
      MORALIS_APP_ID: 'FNvFOOWbPAhDCJZis6hBetpWO5XnySNepMrw47Ya'
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