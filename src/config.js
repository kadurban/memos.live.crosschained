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
  // const rinkebySystemName = 'rinkeby';
  // const rinkebyUtilityContractAddress = '0x003b6644e9FEaD67790221A39f3EB7C7c1EEbaAA';
  // const rinkebyNftContractAddress = '0xe8d875f77262161Bc822578cc95C21Bbba33D4A3';

  const fujiSystemName = '0x43113';
  const fujiUtilityContractAddress = '0x94D4431FFF6486361579922e0C34Be96CA914F39';
  const fujiNftContractAddress = '0xC9391fB990B6E305b802425D067E1C3156274881';

  const mumbaiSystemName = 'mumbai';
  const mumbaiUtilityContractAddress = '0xa9600001331DF60B1B10fAe1684e1b37BeF98b66';
  const mumbaiNftContractAddress = '0x576eB2cA9524049c5C94c29F03Ae432121bD46ec';

  let CONFIG = {
    MAX_FILE_SIZE: 50000000,
    EXTENSIONS,
    AVAILABLE_NETWORKS: [],
    FUTURE_NETWORKS: ['avalanche', 'solana', 'polygon']
  };

  if (/192.168.1.5/.test(window.location.href) || /http:\/\/localhost:3000/.test(window.location.href) || /test.memos.live/.test(window.location.href)) {
    CONFIG.AVAILABLE_NETWORKS = [...CONFIG.AVAILABLE_NETWORKS, /*{
      NETWORK_NAME: rinkebySystemName,
      UTILITY_CONTRACT_ADDRESS: rinkebyUtilityContractAddress,
      MINT_CONTRACT_ADDRESS: rinkebyNftContractAddress
    }, {
      NETWORK_NAME: fujiSystemName,
      UTILITY_CONTRACT_ADDRESS: fujiUtilityContractAddress,
      MINT_CONTRACT_ADDRESS: fujiNftContractAddress
    }, */{
      NETWORK_NAME: mumbaiSystemName,
      UTILITY_CONTRACT_ADDRESS: mumbaiUtilityContractAddress,
      MINT_CONTRACT_ADDRESS: mumbaiNftContractAddress
    }]
  }

  // TESTNETS
  // if (chainId === 4) { // rinkeby
  //   CONFIG = {
  //     ...CONFIG,
  //     IS_MAINNET: false,
  //     NETWORK_NAME: rinkebySystemName,
  //     UTILITY_CONTRACT_ADDRESS: rinkebyUtilityContractAddress,
  //     MINT_CONTRACT_ADDRESS: rinkebyNftContractAddress,
  //   }
  // }
  // if (chainId === 1) { // fuji
  //   CONFIG = {
  //     ...CONFIG,
  //     IS_MAINNET: false,
  //     NETWORK_NAME: fujiSystemName,
  //     UTILITY_CONTRACT_ADDRESS: fujiUtilityContractAddress,
  //     MINT_CONTRACT_ADDRESS: fujiNftContractAddress
  //   }
  // }
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
  // if (chainId === 1) { // ethereum
  //   CONFIG = {
  //     ...CONFIG,
  //     IS_MAINNET: true,
  //     NETWORK_NAME: 'ethereumSystemName',
  //     MINT_CONTRACT_ADDRESS: null
  //   }
  // }
  // if (chainId === 137) { // polygon
  //   CONFIG = {
  //     ...CONFIG,
  //     IS_MAINNET: true,
  //     NETWORK_NAME: 'polygon',
  //     MINT_CONTRACT_ADDRESS: null
  //   }
  // }

  if (CONFIG.IS_MAINNET) {
    return {
      ...CONFIG,
      MORALIS_SERVER_URL: '',
      MORALIS_APP_ID: ''
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