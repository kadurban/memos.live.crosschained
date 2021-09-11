import React, { useContext, useState, useEffect, useLayoutEffect } from 'react';
import SwiperCore, { Virtual } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react/';
import ReactMarkdown from 'react-markdown';
import { Howl } from 'howler';
import Loader from '../Loader';
import SettingsContext from '../../SettingsContext';
import SVG from '../../SVG';
import { getContentByUrl, playSound } from '../../lib/utils';
import logoLight from '../../assets/img/logo-light.png';
import logoDark from '../../assets/img/logo-dark.png';
import './index.css';

SwiperCore.use([Virtual]);

export default function Viewer(props) {
  const { settingsState } = useContext(SettingsContext);
  const [state, setState] = useState({
    contents: props.content,
    currentItemIndex: 0
  });

  useEffect(async () => {
    playSound('viewerIn');
    if (props.type === 'texts') {
      const responseData = await getContentByUrl({ url: state.contents[0].link });
      const contents = state.contents;
      contents[state.currentItemIndex].data = responseData
      setState({ ...state, contents });
    }

    if (props.type === 'audios') {
      for (const item of state.contents) {
        // window.createjs.Sound.registerSound({
        //   src: item.link,
        //   id: item.link
        // });
      }
    }
  }, []);

  useLayoutEffect(() => {
    return () => {
      for (const item of state.contents) {
        // window.createjs.Sound.removeSound(item.link);
      }
    }
  }, []);

  const showLogo = props.type === 'description' || props.type === 'texts';

  return (
    <div className={`Viewer Viewer-${props.type}`}>
      <button className="Viewer-close" onClick={() => {
        playSound('viewerOut');
        props.onClose();
      }}>
        <SVG close />
      </button>

      {showLogo && (
        <img className="Viewer-logo" src={settingsState.mode === 'dark' ? logoDark : logoLight} />
      )}

      {props.type !== 'description' && (
        <div className="Viewer-info">
          {state.currentItemIndex + 1} / {state.contents.length}
        </div>
      )}

      <div className="Viewer-inner">
        <div className="Viewer-content-area">



          {props.type === 'description' && state.contents}



          {props.type === 'texts' && (
            <Swiper
              observer={true}
              virtual={{ addSlidesAfter: 1, addSlidesBefore: 1 }}
              slidesPerView={1}
              speed={200}
              spaceBetween={50}
              onSlideChange={async (swiper) => {
                const responseData = await getContentByUrl({ url: state.contents[swiper.activeIndex].link });
                const contents = state.contents;
                contents[swiper.activeIndex].data = responseData
                setState({ ...state, currentItemIndex: swiper.activeIndex, contents });
              }}
            >
              {state.contents.map((item, index) => (
                <SwiperSlide key={index} virtualIndex={index}>
                  <div className="Vewer-texts-inner">
                    {state.contents[index].data && <div className="Vewer-texts-inner-text">
                      <ReactMarkdown
                        className="markdown"
                        skipHtml={true}
                      >
                        {state.contents[index].data}
                      </ReactMarkdown>
                    </div> || <Loader />}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}


          
          {props.type === 'audios' && (
            <Swiper
              observer={true}
              virtual={{ addSlidesAfter: 1, addSlidesBefore: 1 }}
              slidesPerView={1}
              speed={200}
              spaceBetween={50}
              onSlideChange={async (swiper) => {
                setState({ ...state, currentItemIndex: swiper.activeIndex });
                for (const item of state.contents) {
                  // window.createjs.Sound.stop(item);
                }
              }}
            >
              {state.contents.map((item, index) => (
                <SwiperSlide key={index} virtualIndex={index}>
                  {state.contents[index] && (
                    <div className="Vewer-audios-inner">
                      {/* <div className="Viewer-audios-visualizer">
                        visualisation...
                      </div> */}
                      {/* <div className="Viewer-audios-name">
                          {state.contents[index].name}
                      </div> */}
                      <div className="Viewer-audios-controls">
                        <button onClick={() => {
                          // const audio = new Howl({ src: [state.contents[index]] });
                          // audio.once('load', function(){
                          //   audio.play();
                          // });
                        }}>
                          <SVG play />
                        </button>
                      </div>
                    </div>
                  ) || <Loader />}
                </SwiperSlide>
              ))}
            </Swiper>
          )}



          {props.type === 'images' && (
            <Swiper
              observer={true}
              virtual={{ addSlidesAfter: 1, addSlidesBefore: 1 }}
              slidesPerView={1}
              speed={200}
              onSlideChange={async (swiper) => {
                setState({ ...state, currentItemIndex: swiper.activeIndex });
              }}
            >
              {state.contents.map((item, index) => (
                <SwiperSlide key={index} virtualIndex={index}>
                  {state.contents[index] && (
                    <div className="Viewer-images-inner">
                      <img
                        src={state.contents[index]}
                      />
                    </div>
                  ) || <Loader />}
                </SwiperSlide>
              ))}
            </Swiper>
          )}



          {props.type === 'videos' && (
            <Swiper
              observer={true}
              virtual={{ addSlidesAfter: 1, addSlidesBefore: 1 }}
              slidesPerView={1}
              speed={200}
              onSlideChange={async (swiper) => {
                setState({ ...state, currentItemIndex: swiper.activeIndex });
              }}
            >
              {state.contents.map((item, index) => (
                <SwiperSlide key={index} virtualIndex={index}>
                  {state.contents[index] && (
                    <div className="Vewer-images-inner">
                      <video
                        src={state.contents[index]}
                        controls
                      // poster={props.preview}
                      >
                        Your browser doesn't support embedded videos :(
                      </video>
                    </div>
                  ) || <Loader />}
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
};