const TEXT_EXTENSIONS = ['txt', 'md'];
const AUDIO_EXTENSIONS = ['mp3', 'ogg'];
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov'];

function getConfig(currentNetworkId) {
  const EXTENSIONS = {
    TEXT_EXTENSIONS,
    AUDIO_EXTENSIONS,
    IMAGE_EXTENSIONS,
    VIDEO_EXTENSIONS,
    UPLOADER_SUPPORTED_EXTENSIONS: [
      ...TEXT_EXTENSIONS,
      ...AUDIO_EXTENSIONS,
      ...IMAGE_EXTENSIONS,
      ...VIDEO_EXTENSIONS,
    ]
  }

  const config = {
    // 1: {
    //   NETWORK_NAME: 'ethereum (rinkeby)',
    //   MORALIS_APP_ID: 'YGa7VBVv6LC36UmV8FcAW1BpwPHzfs0a0QvYZMwS',
    //   MORALIS_SERVER_URL: 'https://grd67eeqwloc.moralisweb3.com:2053/server',
    //   MINT_CONTRACT_ADDRESS: '0x021C643724fe02a130cb4bA3e551af13991C760D',
    //   ITEMS_TO_FILTER: ['5', '1', '7', '6', '3', '2', '4']
    // },
    4: {
      NETWORK_NAME: 'rinkeby',
      MORALIS_APP_ID: 'YGa7VBVv6LC36UmV8FcAW1BpwPHzfs0a0QvYZMwS',
      MORALIS_SERVER_URL: 'https://grd67eeqwloc.moralisweb3.com:2053/server',
      MINT_CONTRACT_ADDRESS: '0x021C643724fe02a130cb4bA3e551af13991C760D',
      ITEMS_TO_FILTER: ['5', '1', '7', '6', '3', '2', '4']
    },
    80001: {
      NETWORK_NAME: 'mumbai',
      MORALIS_APP_ID: 'yCh3QlUbZuOyiJbKFyOYMR3DrzQOCBv9GCnBs96I',
      MORALIS_SERVER_URL: 'https://vw1uxhuol8vp.bigmoralis.com:2053/server',
      MINT_CONTRACT_ADDRESS: '0x021C643724fe02a130cb4bA3e551af13991C760D',
      ITEMS_TO_FILTER: []
    }
  };

  return {
    ...config[currentNetworkId],
    MAX_FILE_SIZE: 45000000,
    EXTENSIONS
  }
}

export { getConfig };