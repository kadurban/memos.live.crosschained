import React, { useState, useRef, useEffect, useCallback } from 'react';
import ClampLines from 'react-clamp-lines';
import humanizeDuration  from 'humanize-duration';
import moment from 'moment';
import Jdenticon from 'react-jdenticon';
import SVG from '../../SVG';
import Portal from '../../Portal';
import Viewer from '../Viewer';
import { getContentByUrl, playSound } from '../../lib/utils';
import './index.css';

const constructDataForCardView = ({name, attributes}) => {
  console.log(`=== Card "${name}" have ${attributes.length} attributes:`, attributes);
  return attributes.reduce((acc, attribute) => {
    switch (attribute.key) {
      case 'Date':
        acc.eventDate = attribute.value
        break;

      case 'Tag':
        acc.tags.push(attribute.value);
        break;

      case 'File':
        if (attribute.trait_type === 'Text') acc.texts.push({ link: attribute.value, data: null });
        if (attribute.trait_type === 'Image') acc.images.push(attribute.value);
        // if (attribute.trait_type === 'Audio') acc.audios.push(attribute.value);
        if (attribute.trait_type === 'Video') acc.videos.push(attribute.value);
        break;

      default:
          break;
    }

    return acc;
  }, {eventDate: '', tags: [], texts: [], audios: [], images: [], videos: [] });
}

export function DurationTimer(props) {
  const [, updateState] = React.useState();
  const duration = moment.duration(moment(props.eventDate, 'YYYY-MM-DD HH:mm:ss').diff(moment(Date.now())));
  const inEventInPast = duration.asSeconds().toString().charAt(0) === '-';
  const humanizedTimer = humanizeDuration(duration, {
    maxDecimalPoints: 0,
    units: ['y', 'd'],
    conjunction: " and "
  });
  const hours = Math.abs(duration.hours());
  const minutes = Math.abs(duration.minutes());
  const seconds = Math.abs(duration.seconds());

  const forceUpdate = React.useCallback(() => updateState({}), []);
  useEffect(() => setInterval(forceUpdate, 1000), []);

  return (
    <>
      {!inEventInPast && 'Coming in '}
      {inEventInPast && 'Passed  '}
      {humanizedTimer}
      {props.exactTime && ` and ${hours} h ${minutes} m ${seconds} s`}
    </>
  );
}

// function moveLight(e) {
//   var rect = e.target.getBoundingClientRect();
//   var x = e.clientX - rect.left;
//   var y = e.clientY - rect.top;
//   console.log('+++');
//   console.log(x, y);
// }

function Card(props) {
  const imgEl = useRef(null);
  const [state, setState] = useState({
    rotated: false,
    imageLoaded: false,
    imageLoadError: false,
    viewer: null,
    metadataTransformed: null
  });

  useEffect(() => {
    async function getTokenMetadata() {
      const metadataStr = await getContentByUrl(props.tokenUri);
      const metadata = JSON.parse(metadataStr);
      const cardData = constructDataForCardView(metadata);
      setState({
        ...state,
        cardData: {
          ...cardData,
          image: metadata.image,
          // image_data: metadata.image_data && metadata.image_data.substr(0, 4) === '<svg' ? metadata.image_data : null,
          name: metadata.name,
          description: metadata.description,
        }
      });
    }
    getTokenMetadata();
  }, []);

  const owner = props.owner;

  if (!state.cardData) return '';

  const isValidDate = moment(state.cardData.eventDate, "YYYY-MM-DD HH:mm:ss").isValid();
  const exactTime = state.cardData.eventDate.split(' ').length === 2;

  console.log(state.cardData)

  let totalActionTypesCount = 0;
  if (state.cardData.description.length > 0) totalActionTypesCount++;
  if (state.cardData.texts.length > 0) totalActionTypesCount++;
  if (state.cardData.images.length > 0) totalActionTypesCount++;
  if (state.cardData.audios.length > 0) totalActionTypesCount++;
  if (state.cardData.videos.length > 0) totalActionTypesCount++;

  return (
    <>
      {state.viewer && (
        <Portal>
          <Viewer { ...state.viewer } preview={state.cardData.image} onClose={() => {
            document.querySelector('.Viewer').classList.add('Viewer-hide-animation');
            setTimeout(() => {
              setState(() => {
                document.body.style.overflow = 'initial';
                return { ...state, viewer: null};
              });
            }, 400);
          }}/>
        </Portal>
      )}
    
      <div className="Card-holder">
        <div className={`Card ${(state.rotated && 'Card-rotated') || ''} ${props.appearsAnimation ? props.appearsAnimation: ''}`}>
          <button
            tabIndex={state.rotated ? -1 : 0}
            className="Card-front"
            onClick={() => setState(() => {
              playSound('cardFlip1');
              return { ...state, rotated: true };
            })}
            // onMouseMove={(e) => moveLight(e)}
          >
            <div className="Card-timer">
              <div className="Card-date">
                {isValidDate ? (
                  moment(state.cardData.eventDate, "YYYY-MM-DD HH:mm:ss").format(exactTime ? 'LLL' : 'LL')
                ) : null}
              </div>
              <div className="Card-date-ago">
                {isValidDate && <DurationTimer eventDate={state.cardData.eventDate} exactTime={exactTime}/>}
              </div>
            </div>
            <div className={`Card-preview ${!state.imageLoaded ? 'Card-preview-loading' : ''}`}>
              {(!state.imageLoaded || state.imageLoadError) && (
                <Jdenticon size="268" value={props.tokenUri}/>
              )}
              <img
                style={{ opacity: !state.imageLoaded ? 0 : 1 }}
                ref={imgEl}
                src={state.cardData.image}
                onLoad={() => setState({ ...state, imageLoaded: true })}
                onError={() => setState({ ...state, imageLoaded: true, imageLoadError: true })}
              />
            </div>
            <div className="Card-title">
              <ClampLines
                text={state.cardData.name}
                lines={3}
                buttons={false}
              />
            </div>
          </button>

          <div
            className="Card-back"
            onClick={() => setState(() => {
              playSound('cardFlip2');
              return { ...state, rotated: false };
            })}
          >
            <div className={`Card-back-actions count-${totalActionTypesCount}`}>
              <CardIcon onChain={props.onChain}/>
              {state.cardData.images && state.cardData.images.length > 0 && (
                <button
                  tabIndex={state.rotated ? 0 : -1}
                  className="Card-back-action-button"
                  onClick={(e) => setState(() => {
                    e.stopPropagation();
                    document.body.style.overflow = 'hidden';
                    return {
                      ...state,
                      viewer: {
                        type: 'images',
                        content: state.cardData.images
                      }
                    }
                  })}
                >
                  <SVG image/>
                </button>
              )}

              {state.cardData.videos && state.cardData.videos.length > 0 && (
                <button
                  tabIndex={state.rotated ? 0 : -1}
                  className="Card-back-action-button"
                  onClick={(e) => setState(() => {
                    e.stopPropagation();
                    document.body.style.overflow = 'hidden';
                    return {
                      ...state,
                      viewer: {
                        type: 'videos',
                        content: state.cardData.videos
                      }
                    }
                  })}
                >
                  <SVG video/>
                </button>
              )}

              {state.cardData.description && state.cardData.description.length && (
                <button
                  tabIndex={state.rotated ? 0 : -1}
                  className="Card-back-action-button"
                  onClick={(e) => setState(() => {
                    e.stopPropagation();
                    document.body.style.overflow = 'hidden';
                    return {
                      ...state,
                      viewer: {
                        type: 'description',
                        content: state.cardData.description
                      }
                    }
                  })}
                >
                  <SVG info/>
                </button>
              )}

              {state.cardData.texts && state.cardData.texts.length > 0 && (
                <button
                  tabIndex={state.rotated ? 0 : -1}
                  className="Card-back-action-button"
                  onClick={(e) => setState(() => {
                    e.stopPropagation();
                    document.body.style.overflow = 'hidden';
                    return {
                      ...state,
                      viewer: {
                        type: 'texts',
                        content: state.cardData.texts
                      }
                    }
                  })}
                >
                  <SVG feather/>
                </button>
              )}

              {state.cardData.audios && state.cardData.audios.length > 0 && (
                <button
                  tabIndex={state.rotated ? 0 : -1}
                  className="Card-back-action-button"
                  onClick={(e) => setState(() => {
                    e.stopPropagation();
                    document.body.style.overflow = 'hidden';
                    return {
                      ...state,
                      viewer: {
                        type: 'audios',
                        content: state.cardData.audios
                      }
                    }
                  })}
                >
                  <SVG sound/>
                </button>
              )}

            </div>

            <button
              tabIndex={state.rotated ? 0 : -1}
              className="Card-back-action-button flip-back"
              onClick={() => setState(() => {
                playSound('cardFlip2');
                return { ...state, rotated: false };
              })}
            >
              <SVG flipBack/>
            </button>
            {/*<div className={`Card-back-info ${totalActionTypesCount === 0 ? 'larger' : ''}`}>*/}
            {/*<div>*/}
            {/*  <Element specs={props.specs} index={0}/>*/}
            {/*  <Element specs={props.specs} index={1}/>*/}
            {/*  <Element specs={props.specs} index={2}/>*/}
            {/*  <Element specs={props.specs} index={3}/>*/}
            {/*</div>*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
    </>
  );
}


// function Element(props) {
//   const specsArray = props.specs.split('');
//   return <span>{specsArray[props.index]}</span>
// }

export function CardIcon({onChain}) {
  function EthereumSvg() {
    return (
      <svg width="50px" height="50px" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 784.37 1277.39">
       <g id="Layer_x0020_1">
        <metadata id="CorelCorpID_0Corel-Layer"/>
         <g id="_1421394342400">
         <g>
          <polygon fill="#343434" fillRule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "/>
           <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "/>
           <polygon fill="#3C3C3B" fillRule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "/>
           <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89 "/>
           <polygon fill="#141414" fillRule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33 "/>
           <polygon fill="#393939" fillRule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33 "/>
         </g>
        </g>
       </g>
      </svg>
    );
  }

  function PolygonSvg() {
    return (
      <svg width="50px" height="50px" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 38.4 33.5">
        <g>
          <path fill="#8247E5" className="st0" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3
            c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7
            c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
            c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1
            L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
            c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/>
        </g>
      </svg>
    );
  }

  function BscSvg() {
    return (
      <svg height="150px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 116 135"
           className="c-icon c-icon-custom-size d-block mx-auto mt-3" role="img">
        <title>Speedy Node Binance</title>
        <svg width="116" height="135" viewBox="0 0 116 135" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M23.2529 89.2103C27.4894 84.9873 31.7259 80.6561 35.9624 76.4331C36.071 76.5414 36.1796 76.6497 36.2882 76.7579C43.4577 83.9045 50.5185 90.9428 57.6879 98.0893C58.0138 98.4142 57.9051 98.4142 58.3396 98.0893C65.5091 90.9428 72.5698 83.9045 79.7393 76.7579C79.8479 76.6497 79.8479 76.5414 79.9565 76.4331C84.3016 80.7644 88.5381 84.9873 92.7746 89.2103C92.7746 89.2103 92.666 89.3186 92.5573 89.4268C81.1514 100.796 69.7455 112.166 58.3396 123.535C58.1224 123.752 58.1224 123.752 57.7965 123.535C46.3906 112.166 34.9847 100.796 23.5788 89.4268C23.3616 89.3186 23.2529 89.3186 23.2529 89.2103Z"
            fill="url(#speedyBscPaint0_linear)" fill-opacity="0.7" stroke="white" stroke-width="2"
            stroke-miterlimit="10"></path>
          <path
            d="M35.9624 58.4586C31.7259 54.2356 27.4894 50.0126 23.2529 45.7897C23.2529 45.6814 23.3616 45.6814 23.4702 45.5731C34.8761 34.2036 46.282 22.8341 57.6879 11.4645C57.9051 11.248 58.0138 11.248 58.231 11.4645C69.6369 22.8341 81.0428 34.2036 92.4487 45.5731C92.5573 45.6814 92.5573 45.6814 92.6659 45.7897C88.4295 50.0126 84.193 54.2356 79.9565 58.4586C79.9565 58.4586 79.8479 58.3503 79.7393 58.242C72.5698 51.0955 65.5091 44.0572 58.3396 36.9106C58.0138 36.5858 58.1224 36.5858 57.6879 36.9106C50.5184 43.9489 43.349 51.0955 36.2882 58.1337C36.1796 58.242 36.071 58.3503 35.9624 58.4586Z"
            fill="url(#speedyBscPaint1_linear)" fill-opacity="0.7" stroke="white" stroke-width="2"
            stroke-miterlimit="10"></path>
          <path
            d="M57.9045 80.3314C53.668 76.1084 49.3229 71.7772 45.0864 67.5542C49.3229 63.3313 53.668 59 58.0131 54.6688C62.2496 58.8917 66.5947 63.223 70.8312 67.4459C66.5947 71.7772 62.2496 76.0002 57.9045 80.3314Z"
            fill="url(#speedyBscPaint2_linear)" fill-opacity="0.7" stroke="white" stroke-width="2"
            stroke-miterlimit="10"></path>
          <path
            d="M26.946 67.4459C26.946 67.5542 26.8374 67.5542 26.8374 67.5542C26.8374 67.6625 26.7288 67.6625 26.7288 67.6625C22.7095 71.6689 18.5817 75.7836 14.5625 79.79C14.2366 80.1148 14.2366 80.1148 13.9107 79.79C9.89148 75.7836 5.76363 71.6689 1.74441 67.6625C1.41853 67.3376 1.41853 67.3376 1.74441 67.1211C5.76363 63.1147 9.89148 59 13.9107 54.9936C14.128 54.777 14.128 54.777 14.4538 54.9936C18.4731 59 22.6009 63.1147 26.6201 67.1211C26.7288 67.2294 26.8374 67.3376 26.946 67.4459Z"
            fill="url(#speedyBscPaint3_linear)" fill-opacity="0.7" stroke="white" stroke-width="2"
            stroke-miterlimit="10"></path>
          <path
            d="M114.5 67.446C114.5 67.5543 114.391 67.5543 114.391 67.5543C114.391 67.6626 114.283 67.6626 114.283 67.6626C110.264 71.669 106.136 75.7836 102.117 79.79C101.791 80.1149 101.791 80.1149 101.573 79.79C97.5542 75.7836 93.4263 71.669 89.4071 67.6626C89.1898 67.446 89.1898 67.446 89.4071 67.1212C93.5349 63.0065 97.5541 59.0001 101.682 54.8854C101.899 54.6688 102.008 54.6688 102.225 54.8854C106.353 59.0001 110.372 63.0065 114.5 67.1212C114.283 67.3377 114.391 67.3377 114.5 67.446Z"
            fill="url(#speedyBscPaint4_linear)" fill-opacity="0.7" stroke="white" stroke-width="2"
            stroke-miterlimit="10"></path>
          <defs>
            <linearGradient id="speedyBscPaint0_linear" x1="58.0138" y1="76.4331" x2="58.0138" y2="123.698"
                            gradientUnits="userSpaceOnUse">
              <stop stop-color="white"></stop>
              <stop offset="1" stop-color="white" stop-opacity="0.3"></stop>
            </linearGradient>
            <linearGradient id="speedyBscPaint1_linear" x1="57.9594" y1="11.3021" x2="57.9594" y2="58.4586"
                            gradientUnits="userSpaceOnUse">
              <stop stop-color="white"></stop>
              <stop offset="1" stop-color="white" stop-opacity="0.3"></stop>
            </linearGradient>
            <linearGradient id="speedyBscPaint2_linear" x1="57.9588" y1="54.6688" x2="57.9588" y2="80.3314"
                            gradientUnits="userSpaceOnUse">
              <stop stop-color="white"></stop>
              <stop offset="1" stop-color="white" stop-opacity="0.3"></stop>
            </linearGradient>
            <linearGradient id="speedyBscPaint3_linear" x1="14.223" y1="54.8312" x2="14.223" y2="80.0336"
                            gradientUnits="userSpaceOnUse">
              <stop stop-color="white"></stop>
              <stop offset="1" stop-color="white" stop-opacity="0.3"></stop>
            </linearGradient>
            <linearGradient id="speedyBscPaint4_linear" x1="101.872" y1="54.723" x2="101.872" y2="80.0337"
                            gradientUnits="userSpaceOnUse">
              <stop stop-color="white"></stop>
              <stop offset="1" stop-color="white" stop-opacity="0.3"></stop>
            </linearGradient>
          </defs>
        </svg>

      </svg>
    );
  }

  function ArbitrumSvg() {
    return (
      <svg height="150px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102 135"
           className="c-icon c-icon-custom-size d-block mx-auto mt-3" role="img">
        <title>Speedy Node Arbitrum</title>
        <svg width="102" height="135" viewBox="0 0 102 135" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#speedyArbitrumClip0)">
            <path opacity="0.3"
                  d="M0.483887 92.569V96.5467L11.514 102.929L15.8705 105.427L28.9398 112.92L44.5117 121.893C45.0678 122.17 45.5313 122.448 45.9021 122.633C46.4582 123.003 46.9216 123.188 47.0143 123.281C48.1266 123.836 49.7024 124.113 51.1854 124.113C52.4831 124.113 53.7807 123.836 54.9857 123.373L97.5305 98.7668C99.9404 96.9167 101.423 94.049 101.516 90.9039V43.9115C101.423 40.4888 99.477 37.3436 96.6036 35.4935L55.6345 11.9973C52.7611 10.5172 49.1462 10.5172 46.2728 11.9973C45.9021 12.1823 6.41606 35.031 6.41606 35.031C5.85992 35.3085 5.30377 35.586 4.84032 35.9561C2.245 37.8061 0.669267 40.7663 0.483887 43.9115L0.483887 92.569Z"
                  fill="url(#speedyArbitrumPaint0_linear)"></path>
            <path
              d="M50.9072 13.6624C52.1122 13.6624 53.3172 13.9399 54.3368 14.4024L95.2131 37.8061C97.345 39.1937 98.6427 41.4138 98.828 43.9115V90.8114C98.7354 93.0315 97.7158 95.0666 96.0473 96.3616L53.8733 120.783C53.0391 121.06 52.1122 121.245 51.278 121.245C50.2584 121.245 49.0534 121.06 48.4046 120.69C48.2192 120.598 47.9412 120.413 47.385 120.135C47.0143 119.95 46.5508 119.673 46.0874 119.395L30.5154 110.422L17.4461 102.929L13.0897 100.432L3.26451 94.9741V92.569V44.004C3.3572 41.6913 4.56217 39.5637 6.50866 38.2687C6.87942 37.9912 7.25018 37.8061 7.62094 37.6211L7.71364 37.5286L7.80632 37.4361C21.061 29.7582 46.18 15.235 47.5704 14.495C48.59 13.9399 49.7023 13.6624 50.9072 13.6624ZM50.9072 10.8873C49.2388 10.8873 47.6631 11.2573 46.18 11.9973C45.8093 12.1823 6.32328 35.031 6.32328 35.031C5.76714 35.3085 5.211 35.586 4.74755 35.9561C2.15223 37.8061 0.576494 40.7663 0.391113 43.9115V92.569V96.5467L11.4212 102.929L15.7777 105.427L28.847 112.92L44.4189 121.893C44.9751 122.17 45.4385 122.448 45.8093 122.633C46.3654 123.003 46.8289 123.188 46.9216 123.281C48.0338 123.836 49.6096 124.113 51.0926 124.113C52.3903 124.113 53.6879 123.836 54.8929 123.373L97.5304 98.7668C99.9403 96.9167 101.423 94.049 101.516 90.9039V43.9115C101.423 40.4888 99.4769 37.3436 96.6035 35.4935L55.6344 11.9973C54.2441 11.2573 52.5757 10.8873 50.9072 10.8873Z"
              fill="url(#speedyArbitrumPaint1_linear)"></path>
            <path opacity="0.7" d="M53.1318 84.2436L68.7965 108.757L83.2561 100.432L62.7716 68.0552L53.1318 84.2436Z"
                  fill="url(#speedyArbitrumPaint2_linear)"></path>
            <path opacity="0.7"
                  d="M96.4181 90.5339V83.8735L73.9871 48.9067L65.645 63.06L87.3345 98.0268L95.2132 93.494C95.9547 92.8465 96.4181 91.9214 96.5108 90.9964L96.4181 90.5339Z"
                  fill="url(#speedyArbitrumPaint3_linear)"></path>
            <path
              d="M11.8846 100.894L47.4777 44.004L42.1943 43.819C36.8183 43.7265 31.0715 45.1141 28.4762 49.4618L7.52821 81.8384L1.9668 90.3489V95.8992"
              fill="url(#speedyArbitrumPaint4_linear)"></path>
            <path
              d="M11.8846 100.894L47.4777 44.004L42.1943 43.819C36.8183 43.7265 31.0715 45.1141 28.4762 49.4618L7.52821 81.8384L1.9668 90.3489V95.8992"
              stroke="url(#speedyArbitrumPaint5_linear)" stroke-width="2" stroke-miterlimit="10"></path>
            <path d="M28.9398 112.92L32.462 106.907L69.6307 44.004L54.9857 44.0965L16.7974 105.427"
                  fill="url(#speedyArbitrumPaint6_linear)"></path>
            <path d="M28.9398 112.92L32.462 106.907L69.6307 44.004L54.9857 44.0965L16.7974 105.427"
                  stroke="url(#speedyArbitrumPaint7_linear)" stroke-width="2" stroke-miterlimit="10"></path>
          </g>
          <defs>
            <linearGradient id="speedyArbitrumPaint0_linear" x1="0.483893" y1="67.5002" x2="101.536" y2="67.5002"
                            gradientUnits="userSpaceOnUse">
              <stop stop-color="white"></stop>
              <stop offset="1" stop-color="white" stop-opacity="0.3"></stop>
            </linearGradient>
            <linearGradient id="speedyArbitrumPaint1_linear" x1="50.9536" y1="10.8873" x2="50.9536" y2="124.113"
                            gradientUnits="userSpaceOnUse">
              <stop stop-color="white" stop-opacity="0.2"></stop>
              <stop offset="0.348958" stop-color="white"></stop>
            </linearGradient>
            <linearGradient id="speedyArbitrumPaint2_linear" x1="53.1754" y1="88.4039" x2="83.2814" y2="88.4039"
                            gradientUnits="userSpaceOnUse">
              <stop stop-color="white"></stop>
              <stop offset="1" stop-color="white" stop-opacity="0.3"></stop>
            </linearGradient>
            <linearGradient id="speedyArbitrumPaint3_linear" x1="65.6461" y1="73.4977" x2="96.4474" y2="73.4977"
                            gradientUnits="userSpaceOnUse">
              <stop stop-color="white"></stop>
              <stop offset="1" stop-color="white" stop-opacity="0.3"></stop>
            </linearGradient>
            <linearGradient id="speedyArbitrumPaint4_linear" x1="1.9503" y1="72.3729" x2="47.4628" y2="72.3729"
                            gradientUnits="userSpaceOnUse">
              <stop stop-color="white"></stop>
              <stop offset="1" stop-color="white" stop-opacity="0.3"></stop>
            </linearGradient>
            <linearGradient id="speedyArbitrumPaint5_linear" x1="24.7222" y1="43.8147" x2="24.7222" y2="100.894"
                            gradientUnits="userSpaceOnUse">
              <stop stop-color="white"></stop>
              <stop offset="1" stop-color="white" stop-opacity="0"></stop>
            </linearGradient>
            <linearGradient id="speedyArbitrumPaint6_linear" x1="16.8227" y1="78.461" x2="69.6503" y2="78.461"
                            gradientUnits="userSpaceOnUse">
              <stop stop-color="white"></stop>
              <stop offset="1" stop-color="white" stop-opacity="0.3"></stop>
            </linearGradient>
            <linearGradient id="speedyArbitrumPaint7_linear" x1="43.2141" y1="44.004" x2="43.2141" y2="112.92"
                            gradientUnits="userSpaceOnUse">
              <stop stop-color="white"></stop>
              <stop offset="1" stop-color="white" stop-opacity="0"></stop>
            </linearGradient>
            <clipPath id="speedyArbitrumClip0">
              <rect width="101.032" height="113.226" fill="white" transform="translate(0.483887 10.8873)"></rect>
            </clipPath>
          </defs>
        </svg>

      </svg>
    );
  }

  function AvalancheSvg() {
    return (
      <svg width="106" height="135" viewBox="0 0 106 135" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M27.3478 113H10.0256C6.38464 113 4.59174 113 3.48841 112.314C2.30234 111.545 1.58518 110.281 1.50243 108.88C1.44727 107.59 2.32993 106.024 4.12282 102.866L46.8766 27.8299C48.697 24.6439 49.6073 23.0509 50.7658 22.4741C52.007 21.8424 53.4965 21.8424 54.7653 22.4741C55.9238 23.0509 56.834 24.6439 58.6545 27.8299L67.4535 43.1007L67.5087 43.1831C69.4671 46.5888 70.4601 48.3466 70.9014 50.1593C71.3703 52.1368 71.3703 54.2516 70.9014 56.2292C70.4601 58.0694 69.4671 59.7997 67.4811 63.2878L45.0285 102.811L44.9733 102.92C42.9874 106.381 41.9944 108.111 40.6152 109.43C39.0981 110.858 37.2777 111.929 35.2917 112.506C33.4712 113 31.43 113 27.3478 113ZM71.0945 113H95.9192C99.5878 113 101.408 113 102.512 112.286C103.698 111.517 104.442 110.226 104.498 108.826C104.553 107.59 103.67 106.079 101.96 103.113C101.905 103.003 101.85 102.92 101.767 102.811L89.3269 81.6347L89.189 81.3875C87.4512 78.4487 86.5686 76.9656 85.4377 76.3888C84.1964 75.7571 82.7069 75.7571 81.4657 76.3888C80.3348 76.9656 79.397 78.5311 77.5765 81.6622L65.2193 102.838L65.1641 102.92C63.3436 106.024 62.4334 107.59 62.5161 108.88C62.5989 110.281 63.3161 111.572 64.5021 112.341C65.5779 113 67.4259 113 71.0945 113Z" fill="url(#speedyAvalanchePaint0_linear)" stroke="white" stroke-width="2.5"></path>
        <defs>
          <linearGradient id="speedyAvalanchePaint0_linear" x1="25.8469" y1="113" x2="63.0292" y2="41.973" gradientUnits="userSpaceOnUse">
            <stop stop-color="white" stop-opacity="0.06"></stop>
            <stop offset="1" stop-color="white" stop-opacity="0.85"></stop>
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return <>
    {onChain === 'rinkeby' && <div className="Card-chain eth"><EthereumSvg/></div>}
    {onChain === 'mumbai' && <div className="Card-chain polygon"><PolygonSvg/></div>}
  </>
}

export default Card;
