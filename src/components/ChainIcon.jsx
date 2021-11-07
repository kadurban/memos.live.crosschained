import React from 'react';

function ChainIcon({chain, width = '16px', height = '16px'}) {
  return (
    <>
      {(chain === 'rinkeby' || chain === 'ethereum') && (
        <svg width={width} height={height} shapeRendering="geometricPrecision"
             textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd"
             viewBox="0 0 784.37 1277.39">
          <g id="Layer_x0020_1">
            <metadata id="CorelCorpID_0Corel-Layer"/>
            <g id="_1421394342400">
              <g>
                <polygon fill="#343434" fillRule="nonzero"
                         points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "/>
                <polygon fill="#8C8C8C" fillRule="nonzero"
                         points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "/>
                <polygon fill="#3C3C3B" fillRule="nonzero"
                         points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "/>
                <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89 "/>
                <polygon fill="#141414" fillRule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33 "/>
                <polygon fill="#393939" fillRule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33 "/>
              </g>
            </g>
          </g>
        </svg>
      )}
      {(chain === 'mumbai' || chain === 'polygon') && (
        <svg width={width} height={height} fill="#8247E5" viewBox="0 0 38.4 33.5">
          <g>
            <path className="st0" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3
              c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7
              c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
              c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1
              L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
              c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/>
          </g>
        </svg>
      )}
      {(chain === 'bsc' || chain === 'bsc testnet') && (
        <svg width={width} height={height} fill="#f3ba2f" viewBox="0 0 2500.01 2500">
          <g id="Layer_2" data-name="Layer 2">
            <g id="Layer_1-2" data-name="Layer 1">
              <path className="cls-1"
                    d="M764.48,1050.52,1250,565l485.75,485.73,282.5-282.5L1250,0,482,768l282.49,282.5M0,1250,282.51,967.45,565,1249.94,282.49,1532.45Zm764.48,199.51L1250,1935l485.74-485.72,282.65,282.35-.14.15L1250,2500,482,1732l-.4-.4,282.91-282.12M1935,1250.12l282.51-282.51L2500,1250.1,2217.5,1532.61Z"/>
              <path className="cls-1"
                    d="M1536.52,1249.85h.12L1250,963.19,1038.13,1175h0l-24.34,24.35-50.2,50.21-.4.39.4.41L1250,1536.81l286.66-286.66.14-.16-.26-.14"/>
            </g>
          </g>
        </svg>
      )}
      {(chain === 'avalanche') && (
        <svg width={width} height={height} fill="#FFF" viewBox="0 0 254 254">
          <g>
            <circle className="st0" cx="127" cy="127" r="127" fill="#E84142"/>
            <path className="st1" d="M171.8,130.3c4.4-7.6,11.5-7.6,15.9,0l27.4,48.1c4.4,7.6,0.8,13.8-8,13.8h-55.2c-8.7,0-12.3-6.2-8-13.8
              L171.8,130.3z M118.8,37.7c4.4-7.6,11.4-7.6,15.8,0l6.1,11L155.1,74c3.5,7.2,3.5,15.7,0,22.9l-48.3,83.7
              c-4.4,6.8-11.7,11.1-19.8,11.6H46.9c-8.8,0-12.4-6.1-8-13.8L118.8,37.7z"/>
          </g>
        </svg>
      )}
      {(chain === 'solana') && (
        <svg width={width} height={height} viewBox="0 0 397.7 311.7">
          <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="360.8791" y1="351.4553" x2="141.213"
                          y2="-69.2936" gradientTransform="matrix(1 0 0 -1 0 314)">
            <stop offset="0" style={{stopColor: '#00FFA3'}}/>
            <stop offset="1" style={{stopColor: '#DC1FFF'}}/>
          </linearGradient>
          <path style={{fill:'url(#SVGID_1_)'}} className="st0" d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
	c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"/>
          <linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="264.8291" y1="401.6014" x2="45.163"
                          y2="-19.1475" gradientTransform="matrix(1 0 0 -1 0 314)">
            <stop offset="0" style={{stopColor: '#00FFA3'}}/>
            <stop offset="1" style={{stopColor: '#DC1FFF'}}/>
          </linearGradient>
          <path style={{fill:'url(#SVGID_2_)'}} className="st1" d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
	c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"/>
          <linearGradient id="SVGID_3_" gradientUnits="userSpaceOnUse" x1="312.5484" y1="376.688" x2="92.8822"
                          y2="-44.061" gradientTransform="matrix(1 0 0 -1 0 314)">
            <stop offset="0" style={{stopColor: '#00FFA3'}}/>
            <stop offset="1" style={{stopColor: '#DC1FFF'}}/>
          </linearGradient>
          <path style={{fill:'url(#SVGID_3_)'}} className="st2" d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4
	c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"/>
        </svg>
      )}
    </>
  );
}

export { ChainIcon };
