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
  const rinkebyNftContractAddress = '0xf1ea15BbF4E86BF2dbc9727b30Cb75799a69E013';
  const rinkebyUtilityContractAddress = '0xB5fAbac4C4134c28D44420848F9f39292Bb7658B';

  const mumbaiSystemName = 'mumbai';
  const mumbaiContractAddress = '0xf1ea15BbF4E86BF2dbc9727b30Cb75799a69E013';
  const mumbaiUtilityContractAddress = '0xB5fAbac4C4134c28D44420848F9f39292Bb7658B';

  const bscTestnetSystemName = 'bsc testnet';
  const bscTestnetContractAddress = '0xf1ea15BbF4E86BF2dbc9727b30Cb75799a69E013';
  const bscUtilityContractAddress = '0xB5fAbac4C4134c28D44420848F9f39292Bb7658B';

  let CONFIG = {
    MAX_FILE_SIZE: 50000000,
    EXTENSIONS,
    AVAILABLE_NETWORKS: [],
    FUTURE_NETWORKS: ['avalanche', 'solana', 'polygon']
  };

  if (/http:\/\/localhost:3000/.test(window.location.href) || /test.memos.live/.test(window.location.href)) {
    CONFIG.AVAILABLE_NETWORKS = [...CONFIG.AVAILABLE_NETWORKS, /*{
      NETWORK_NAME: bscTestnetSystemName,
      UTILITY_CONTRACT_ADDRESS: bscUtilityContractAddress,
      MINT_CONTRACT_ADDRESS: bscTestnetContractAddress
    }, {
      NETWORK_NAME: mumbaiSystemName,
      UTILITY_CONTRACT_ADDRESS: mumbaiUtilityContractAddress,
      MINT_CONTRACT_ADDRESS: mumbaiContractAddress
    }, */{
      NETWORK_NAME: rinkebySystemName,
      UTILITY_CONTRACT_ADDRESS: rinkebyUtilityContractAddress,
      MINT_CONTRACT_ADDRESS: rinkebyNftContractAddress
    }]
  }

  // TESTNETS
  if (chainId === 4) { // rinkeby
    CONFIG = {
      ...CONFIG,
      IS_MAINNET: false,
      NETWORK_NAME: rinkebySystemName,
      UTILITY_CONTRACT_ADDRESS: rinkebyUtilityContractAddress,
      MINT_CONTRACT_ADDRESS: rinkebyNftContractAddress,
    }
  }
  if (chainId === 97) { // bsc testnet
    CONFIG = {
      ...CONFIG,
      IS_MAINNET: false,
      NETWORK_NAME: bscTestnetSystemName,
      UTILITY_CONTRACT_ADDRESS: bscUtilityContractAddress,
      MINT_CONTRACT_ADDRESS: bscTestnetContractAddress
    }
  }
  if (chainId === 80001) { // mumbai
    CONFIG = {
      ...CONFIG,
      IS_MAINNET: false,
      NETWORK_NAME: mumbaiSystemName,
      UTILITY_CONTRACT_ADDRESS: mumbaiUtilityContractAddress,
      MINT_CONTRACT_ADDRESS: mumbaiContractAddress
    }
  }

  // MAINNETS
  if (chainId === 1) { // ethereum
    CONFIG = {
      ...CONFIG,
      IS_MAINNET: true,
      NETWORK_NAME: 'ethereumSystemName',
      MINT_CONTRACT_ADDRESS: null
    }
  }
  if (chainId === 137) { // polygon
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
      MORALIS_SERVER_URL: 'https://ignyyaf4y67u.usemoralis.com:2053/server',
      MORALIS_APP_ID: 'f6VsXQZc2RkBRYggsardTgaXf6ase0Bf5sAt9NtR'
    }
  }
}

export { getConfig };