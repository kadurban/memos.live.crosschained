import React, { useState, useRef, useEffect, useCallback } from 'react';
import ClampLines from 'react-clamp-lines';
import humanizeDuration  from 'humanize-duration';
import moment from 'moment';
import Jdenticon from 'react-jdenticon';
import SVG from '../SVG';
import { ChainIcon } from '../ChainIcon';
import Portal from '../../Portal';
import Viewer from '../Viewer';
import { getContentByUrl, playSound } from '../../lib/utils';
import './index.css';

const constructDataForCardView = ({name, attributes}) => {
  if (name && attributes && Array.isArray(attributes)) {
    return attributes.reduce((acc, attribute) => {
      switch (attribute.key) {
        case 'Date':
          acc.eventDate = attribute.value
          break;

        case 'File':
          if (attribute.trait_type === 'Text') acc.texts.push({ link: attribute.value, data: null });
          if (attribute.trait_type === 'Picture') acc.images.push(attribute.value);
          // if (attribute.trait_type === 'Audio') acc.audios.push(attribute.value);
          if (attribute.trait_type === 'Video') acc.videos.push(attribute.value);
          break;

        default:
            break;
      }

      return acc;
    }, {eventDate: '', texts: [], audios: [], images: [], videos: [] });
  }
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
      const metadataString = await getContentByUrl(props.tokenUri);
      const metadata = JSON.parse(metadataString);

      if (metadata) {
        const cardData = constructDataForCardView(metadata);
        if (cardData) {
          const cardFrontImage = cardData.images[0];
          setState({
            ...state,
            cardData: {
              ...cardData,
              image: cardFrontImage,
              // image_data: metadata.image_data && metadata.image_data.substr(0, 4) === '<svg' ? metadata.image_data : null,
              name: metadata.name,
              description: metadata.description,
            }
          });
        }
      }
    }
    getTokenMetadata();
  }, []);

  // const owner = props.owner;

  if (!state.cardData) return '';

  const isValidDate = moment(state.cardData.eventDate, "YYYY-MM-DD HH:mm:ss").isValid();
  const exactTime = state.cardData.eventDate.split(' ').length === 2;

  let totalActionTypesCount = 0;
  if (state.cardData.description && state.cardData.description.length > 0) totalActionTypesCount++;
  if (state.cardData.texts.length > 0) totalActionTypesCount++;
  if (state.cardData.images.length > 0) totalActionTypesCount++;
  if (state.cardData.audios.length > 0) totalActionTypesCount++;
  if (state.cardData.videos.length > 0) totalActionTypesCount++;

  console.log(`=== Card "${state.cardData.name}" metadata:`, state.cardData);

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
            tabIndex={0}
            className="Card-front"
            onClick={() => setState(() => {
              playSound(state.rotated ? 'cardFlip2' : 'cardFlip1');
              return { ...state, rotated: !state.rotated };
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
              <div className="Card-chain"><ChainIcon chain={props.onChain} width="50px" height="50px"/></div>
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
          </div>
        </div>
      </div>
    </>
  );
}

// export function CardIcon({onChain}) {
//   return <>
//     {(onChain === 'rinkeby' || onChain === 'ethereum') && (
//       <div className="Card-chain eth"><ChainIcon chain={onChain} width="50px" height="50px"/></div>
//     )}
//     {(onChain === 'polygon' || onChain === 'mumbai') && (
//       <div className="Card-chain mum"><ChainIcon chain={onChain} width="50px" height="50px"/></div>
//     )}
//   </>
// }

export default Card;
