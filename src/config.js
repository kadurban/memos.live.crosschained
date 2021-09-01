const TEXT_EXTENSIONS = ['txt', 'md'];
const AUDIO_EXTENSIONS = ['mp3', 'ogg'];
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov'];

function getConfig() {
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

  return {
    NETWORK: 'Rinkeby - Ethereum TESTNET',
    MORALIS_APP_ID: 'YGa7VBVv6LC36UmV8FcAW1BpwPHzfs0a0QvYZMwS',
    MORALIS_SERVER_URL: 'https://grd67eeqwloc.moralisweb3.com:2053/server',
    MINT_CONTRACT_ADDRESS: '0x021C643724fe02a130cb4bA3e551af13991C760D',
    MAX_FILE_SIZE: 22020096,
    EXTENSIONS
  }
}

export { getConfig };