const TEXT_EXTENSIONS = ['txt', 'md'];
// const AUDIO_EXTENSIONS = ['mp3', 'ogg'];
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov'];
// const ARVR_EXTENSIONS = ['3ds', 'stl'];

function getConfig(currentNetworkId) {
  const EXTENSIONS = {
    TEXT_EXTENSIONS,
    // AUDIO_EXTENSIONS,
    IMAGE_EXTENSIONS,
    VIDEO_EXTENSIONS,
    // ARVR_EXTENSIONS,
    UPLOADER_SUPPORTED_EXTENSIONS: [
      ...TEXT_EXTENSIONS,
      // ...AUDIO_EXTENSIONS,
      ...IMAGE_EXTENSIONS,
      ...VIDEO_EXTENSIONS,
      // ...ARVR_EXTENSIONS,
    ]
  }

  const config = {
    80001: {
      NETWORK_NAME: 'mumbai',
      MORALIS_APP_ID: 'yCh3QlUbZuOyiJbKFyOYMR3DrzQOCBv9GCnBs96I',
      MORALIS_SERVER_URL: 'https://vw1uxhuol8vp.bigmoralis.com:2053/server',
      MINT_CONTRACT_ADDRESS: '0x1735AEd35c5EE5cf4f790eB2cCF35Fdfa043c4b0',
      IS_PROD: false
    },
    137: {
      NETWORK_NAME: 'polygon',
      MORALIS_APP_ID: 'vQQwKrM8teokHCdmpcUbfN9t2LIPIDK5EA0eWoS2',
      MORALIS_SERVER_URL: 'https://b01upn4bpwmu.moralishost.com:2053/server',
      MINT_CONTRACT_ADDRESS: '0xA8AE487947de1c0D5164a5043FC010F36F42f816',
      IS_PROD: true
    }
  };

  return {
    ...config[currentNetworkId],
    MAX_FILE_SIZE: 45000000,
    EXTENSIONS
  }
}

export { getConfig };