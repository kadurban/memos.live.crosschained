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

const constructDataForCardView = (attributes) => {
  return attributes.reduce((acc, attribute) => {

    switch (attribute.key) {
      case 'Date':
        acc.eventDate = attribute.value
        break;

      case 'Tag':
        acc.tags.push(attribute.value);
        break;

      // case 'File':
      //   const IPFSHash = attribute.value.split('/').pop();
      //   attribute.value = `${window.mlConfig.moralisIPFSUrl}/${IPFSHash}`;
      //   if (attribute.trait_type === 'text') acc.texts.push({ link: attribute.value, data: null });
      //   if (attribute.trait_type === 'image') acc.images.push(attribute.value);
      //   if (attribute.trait_type === 'audio') acc.audios.push(attribute.value);
      //   if (attribute.trait_type === 'video') acc.videos.push(attribute.value);
      //   break;

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
      const cardData = constructDataForCardView(metadata.attributes);
      console.log('Card data (transformed metadata):')
      console.log(cardData)
      setState({
        ...state,
        cardData: {
          ...cardData,
          image: metadata.image,
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
    
      <div className={`Card ${state.rotated && 'Card-rotated' || ''} ${props.appearsAnimation ? props.appearsAnimation: ''}`}>
        <div className="Card-front" onClick={() => setState(() => {
          playSound('cardFlip1');
          return { ...state, rotated: true };
        })}>
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
              <Jdenticon size="268" value={props.tokenId}/>
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
        </div>
        <div className="Card-back">
          <div className="Card-back-actions">

            {state.cardData.description && state.cardData.description.length && (
              <button
                className="Card-back-action-button"
                onClick={() => setState(() => {
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
                className="Card-back-action-button"
                onClick={() => setState(() => {
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
              <SVG text/>
            </button>
            )}

            {state.cardData.audios && state.cardData.audios.length > 0 && (
              <button
                className="Card-back-action-button"
                onClick={() => setState(() => {
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

            {state.cardData.images && state.cardData.images.length > 0 && (
              <button
                className="Card-back-action-button"
                onClick={() => setState(() => {
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
                className="Card-back-action-button"
                onClick={() => setState(() => {
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

          </div>
          <div className="Card-back-info">
            <div className="Card-ipfs-hash" onClick={() => setState(() => {
              playSound('cardFlip2');
              return { ...state, rotated: false };
            })}>
              <Jdenticon size="60" value={props.tokenIpfsHash}/>
            </div>
            {/*<div>*/}
            {/*  <Element specs={props.specs} index={0}/>*/}
            {/*  <Element specs={props.specs} index={1}/>*/}
            {/*  <Element specs={props.specs} index={2}/>*/}
            {/*  <Element specs={props.specs} index={3}/>*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
    </>
  );
}

function Element(props) {
  const specsArray = props.specs.split('');
  return <span>{specsArray[props.index]}</span>
}

export default Card;