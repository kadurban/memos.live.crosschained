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
  const rinkebyContractAddress = '0x51f444244D7D73ad2bB4dE8ffA7f40a391959E58';

  const mumbaiSystemName = 'mumbai';
  const mumbaiContractAddress = '0x684b6559E1CCec6E51ac34b95a984d5eC62bb5Ef';

  let CONFIG = {
    MAX_FILE_SIZE: 50000000,
    EXTENSIONS,
    AVAILABLE_NETWORKS: [{
      NETWORK_NAME: rinkebySystemName,
      MINT_CONTRACT_ADDRESS: rinkebyContractAddress
    }, {
      NETWORK_NAME: mumbaiSystemName,
      MINT_CONTRACT_ADDRESS: mumbaiContractAddress
    }],
    FUTURE_NETWORKS: ['solana', 'bsc', 'polygon', 'avalanche']
  };

  // TESTNETS
  if (chainId === 4) { // rinkeby
    CONFIG = {
      ...CONFIG,
      IS_MAINNET: false,
      NETWORK_NAME: rinkebySystemName,
      MINT_CONTRACT_ADDRESS: rinkebyContractAddress,
    }
  }
  if (chainId === 80001) { // mumbai
    CONFIG = {
      ...CONFIG,
      IS_MAINNET: false,
      NETWORK_NAME: mumbaiSystemName,
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