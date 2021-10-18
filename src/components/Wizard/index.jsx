import React, {useState, useContext, useEffect, useRef} from 'react';
import { useForm } from 'react-hook-form';
import {v4 as uuid} from 'uuid';
import moment from 'moment';
import { toast } from 'react-toastify';
import SettingsContext from '../../SettingsContext';
import { login } from "../LoginSection";
import AlertMessage from '../AlertMessage';
import Card from '../Card';
import Loader from '../Loader';
import SVG from "../../SVG";
import { playSound, randomInteger, debounce } from "../../lib/utils";
import TextareaAutosize from 'react-textarea-autosize';
import html2canvas from 'html2canvas';
import Moralis from "moralis";
import jimp from "jimp";
import './index.css';
import logoLight from "../../assets/img/logo-light.png";

const soundsArray = ['effect1', 'effect2', 'effect3', 'effect4', 'effect5', 'effect6', 'effect7', 'effect8'];

const ValidationMessage = ({ message }) => (
  <div className="Form-validation-message">
    {message}
  </div>
);

const FilePreview = ({ file, valid, children }) => (
  <div className={`Form-file-preview ${!valid ? 'invalid' : ''}`}>
    <div className="Form-file-preview-info">
      {!valid && <b>Unsupported </b>}{file.name}
    </div>
    <div className="Form-file-preview-controls">
      {children}
    </div>
  </div>
);

function Wizard() {
  const [isUploading, setUploadStatusInProgress] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const CardPreviewBeforeMint = useRef(null);
  const CardPreviewBeforeMintGenerated = useRef(null);
  const CardPreviewImage = useRef(null);
  const { settingsState, setSettingsState } = useContext(SettingsContext);

  const [tokenURI, setTokenURI] = useState(null);
  const [metaDataState, setMetaData] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [image, setImageFile] = useState(null);
  const [previewName, setPreviewName] = useState('');
  const [previewDate, setPreviewDate] = useState('');
  const [description, setDescription] = useState('');
  const [previewTime, setPreviewTime] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [fileTypesAttached, setFileTypesAttached] = useState({});
  const [royalty, setRoyalty] = useState(3);
  const isValidDate = moment(previewDate, "YYYY-MM-DD HH:mm:ss").isValid();
  const exactTime = previewDate.length > 0 && previewTime.length > 0;

  const {
    UPLOADER_SUPPORTED_EXTENSIONS,
    IMAGE_EXTENSIONS,
    ANIMATION_EXTENSIONS,
    TEXT_EXTENSIONS,
    VIDEO_EXTENSIONS,
  } = settingsState.appConfiguration.EXTENSIONS;

  const renderCanvas = () => {
    if (CardPreviewBeforeMint && CardPreviewBeforeMintGenerated) {
      setTimeout(function () {
        html2canvas(CardPreviewBeforeMint.current, {
          allowTaint: true,
          useCORS: true,
          watch: 600,
          height: 600
        }).then(function(canvas) {
          if (CardPreviewBeforeMintGenerated.current) {
            CardPreviewBeforeMintGenerated.current.innerHTML = '';
            CardPreviewBeforeMintGenerated.current.appendChild(canvas);
          }
        });
      }, 300);
    }
  };

  useEffect(renderCanvas, []);

  const specifyTime = watch('specifyTime');

  const handleImageChange = (event) => {
    const image = event.target.files[0];
    const extension = image.name.split('.').pop().toLowerCase();

    if (image && IMAGE_EXTENSIONS.includes(extension) && image.size <= settingsState.appConfiguration.MAX_FILE_SIZE) {
      const reader = new FileReader();
      reader.onloadend = async function (data) {
        const jImage = await jimp.read(this.result);
        const { width, height } = jImage.bitmap;

        let resizedImage;
        let resizedWidth;
        let resizedHeight;
        if (width > height) {
          resizedImage = await jImage.resize(jimp.AUTO, 260);
          resizedWidth = jImage.bitmap.width;
          resizedHeight = jImage.bitmap.height;
        } else {
          resizedImage = await jImage.resize(260, jimp.AUTO);
          resizedWidth = jImage.bitmap.width;
          resizedHeight = jImage.bitmap.height;
        }

        setImageFile(image);
        console.log('+++')
        console.log(CardPreviewImage)
        CardPreviewImage.current.width = resizedWidth;
        CardPreviewImage.current.height = resizedHeight;
        if (resizedWidth >= resizedHeight) {
          CardPreviewImage.current.style.left = `-${(resizedWidth - resizedHeight) / 2}px`;
          CardPreviewImage.current.style.top = 0;
        } else {
          CardPreviewImage.current.style.left = 0;
          CardPreviewImage.current.style.top = `-${(resizedHeight - resizedWidth) / 2}px`;
        }
        CardPreviewImage.current.src = await resizedImage.getBase64Async(jimp.MIME_PNG);
      }
      reader.readAsArrayBuffer(image);
      setTimeout(renderCanvas, 500);
    } else {
      alert(`Please select a correct file type for preview. Supported: ${IMAGE_EXTENSIONS.join(', ')}. Max 20mb.`);
    }
  }

  const handleFilesChange = (event) => {
    const newFiles = [...event.target.files].map((file) => {
      const extension = file.name.split('.').pop().toLowerCase();

      let fileType = null;
      if (TEXT_EXTENSIONS.includes(extension)) fileType = 'Text';
      if (IMAGE_EXTENSIONS.includes(extension)) fileType = 'Picture';
      if (VIDEO_EXTENSIONS.includes(extension)) fileType = 'Video';
      if (ANIMATION_EXTENSIONS.includes(extension)) fileType = 'Video';

      return {
        file,
        extension,
        value: null,
        uuid: uuid(),
        key: 'link',
        trait_type: fileType,
        valid: UPLOADER_SUPPORTED_EXTENSIONS.includes(extension) && file.size <= settingsState.appConfiguration.MAX_FILE_SIZE
      }
    });

    const resultFilesList = [...attachedFiles, ...newFiles];
    const fileTypes = resultFilesList.reduce((acc, file) => (
      {...acc, fileType: file.trait_type}
    ), {});
    console.log('===');
    console.log(fileTypes);
    // setFileTypesAttached();

    setAttachedFiles(resultFilesList);
  }

  const onFormSubmit = async (data) => {
    if (!window.confirm('Is everything ready and you want to mint new NFT?')) return false;

    console.log('Form data:');
    console.log(data);

    console.log('===> Uploading files to IPFS');
    setUploadStatusInProgress(true);
    document.body.style.overflow = 'hidden';

    console.log('===> Saving marketplace image');
    // console.log(data.image[0]);
    // console.log('===');
    // console.log(CardPreviewBeforeMintGenerated)
    // console.log(CardPreviewBeforeMintGenerated.current.querySelector('canvas'))
    const imageDataBase64 = CardPreviewBeforeMintGenerated.current.querySelector('canvas').toDataURL();
    // const imageDataBase64 = data.image[0].toDataURL();

    const previewOnCardImage = new Moralis.File(`${uuid()}.${data.image[0].name.split('.').pop()}`, data.image[0]);
    await previewOnCardImage.saveIPFS();
    const previewOnCardImageUrk = previewOnCardImage.ipfs();

    const savedMarcetplacesCoveImage = new Moralis.File(`${uuid()}.${data.image[0].name.split('.').pop()}`, { base64: imageDataBase64 });
    await savedMarcetplacesCoveImage.saveIPFS();
    const savedMarcetplacesCoveImageUrl = savedMarcetplacesCoveImage.ipfs();

    let metaData = {
      image: savedMarcetplacesCoveImageUrl,
      // image_data: svgCode, // TODO: Put svg here
      external_url: 'https://memos.live/',
      description: data.description,
      name: data.name,
      attributes: [],
      // background_color: '',
      // animation_url: saveiImageUrl,
    };

    metaData.attributes.push({
      key: 'File',
      value: previewOnCardImageUrk,
      trait_type: 'Image'
    });

    metaData.attributes.push({
      key: 'Royalty',
      value: 3,
      trait_type: 'Royalty'
    });

    // date to attribute
    if (moment(data.eventDate, 'YYYY-MM-DD HH:mm:ss').isValid()) {
      metaData.attributes.push({
        key: 'Date',
        value: data.exactTime ? `${data.eventDate} ${data.exactTime}` : data.eventDate,
        trait_type: 'Date'
      });
    }

    // save attached files and create attributes object
    for (const fileObject of attachedFiles) {
      if (fileObject.valid) {
        console.log(`===> Saving file (${fileObject.file.size} bytes): ${fileObject.file.name}`);
        const fileToUpload = new Moralis.File(`${fileObject.uuid}.${fileObject.extension}`, fileObject.file);
        await fileToUpload.saveIPFS();
        const uploadedFileUrl = fileToUpload.ipfs();
        metaData.attributes.push({
          key: 'File',
          value: uploadedFileUrl,
          trait_type: fileObject.trait_type
        });
      } else {
        console.log(`===> Invalid file was skipped: ${fileObject.file.name}`);
      }
    }

    const metaDataStringified = JSON.stringify(metaData);
    const tokenMetadataFile = new Moralis.File("metadata.json", { base64: btoa(metaDataStringified) });
    await tokenMetadataFile.saveIPFS();
    const tokenURI = tokenMetadataFile.ipfs();

    console.log('Metadata saved:');
    console.log(metaData);
    console.log(tokenURI);

    setTokenURI(tokenURI);
    setMetaData(metaData);
    toast.info("1 step to finish. Confirm minting by signing transaction.");
    const soundNumber = randomInteger(0, 7);
    setTimeout(() => playSound(soundsArray[soundNumber]), 300);
    setUploadStatusInProgress(false);
    document.body.style.overflow = 'auto';

    // await mintToken(tokenURI);
    // window.location.reload();
  }

  const mintToken = async (tokenURI) => {
    const web3 = new Moralis.Web3(window.ethereum);

    tokenURI = 'ipfs/' + tokenURI.split('ipfs/')[1];

    const encodedFunction = web3.eth.abi.encodeFunctionCall({
      name: 'mint',
      type: 'function',
      inputs: [{
        type: 'address',
        name: 'recipient'
      }, {
        type: 'string',
        name: 'metadata'
      }]
    }, [window.ethereum.selectedAddress, tokenURI]);

    const txParams = {
      to: settingsState.appConfiguration.MINT_CONTRACT_ADDRESS,
      from: window.ethereum.selectedAddress,
      data: encodedFunction
    };

    return await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [txParams]
    });
  };

  if (tokenURI) {
    return (
      <>
        <h1>Full Preview Before Minting</h1>

        <AlertMessage text="You can play with your newly created card and check if everything looking good. And if so then you only need to sign a transaction to put your NFT to the blockchain."/>

        <div className="Wizard-full-preview">
          <Card tokenUri={tokenURI}/>
        </div>
      </>
    )
  }

  return (
    <>
      {isUploading && <Loader isUploader/>}

      <div className="light-background-with-padding" style={{maxWidth: 'none', display: 'inline-block'}}>
        {!settingsState.user && (
          <AlertMessage
            text="You need to login to be able to create new"
          >
            <button className="btn-action btn-big" onClick={() => login(setSettingsState)} type="button">
              <SVG wallet/> Connect Wallet
            </button>
          </AlertMessage>
        )}
        <form
          className="Form"
          autoComplete="off"
          onSubmit={onFormSubmit}
        >
          <>
            <fieldset style={{maxWidth: '260px'}}>
              <legend>General info</legend>

              <div className="Form-group">
                <label className="Form-label">Name</label>
                <input
                  name='name'
                  type="text"
                  required
                  maxLength={75}
                  placeholder="e.g.: Bitcoin was Launched"
                  value={previewName}
                  onChange={(e) => setPreviewName(e.target.value)}
                  onBlur={renderCanvas}
                  // onBlur={(e) => {
                  //   setPreviewName(e.target.value);
                  //   renderCanvas();
                  // }}
                />
                <ValidationMessage message="Required field"/>

              </div>

              <div className="Form-group">
                <label className="Form-label">
                  Date <SVG hintIcon
                            dataHint="You can specify the date and time which is your new NFT will be associated."/>
                </label>
                <input
                  type="date"
                  name="eventDate"
                  required
                  value={previewDate}
                  onChange={(e) => setPreviewDate(e.target.value)}
                  onBlur={(e) => {
                    setPreviewDate(e.target.value);
                    renderCanvas();
                  }}
                />
                <ValidationMessage message="Required field"/>
              </div>

              <div className="Form-group Form-group-set-time">
                <div className="Form-group-set-time-switch">

                  <label className="form-switch" htmlFor="specifyTime">
                    <input
                      className="switch"
                      type="checkbox"
                      id="specifyTime"
                      {...register("specifyTime")}
                    />{' '}
                    <i/>
                    Exact time
                  </label>
                </div>
                {specifyTime && (
                  <div className="Form-group-set-time-input">
                    <input
                      type="time"
                      {...register("previewTime")}
                      value={previewTime}
                      onChange={(e) => {
                        setPreviewTime(e.target.value);
                        renderCanvas();
                      }}
                    />
                    <ValidationMessage message="Required field"/>
                  </div>
                )}
              </div>

              <div className="Form-group">
                <label className="Form-label">
                  Description <small style={{marginLeft: '.2rem', color: '#afafaf'}}>(text or markdown)</small>
                </label>
                <TextareaAutosize
                  cacheMeasurements
                  required
                  placeholder="e.g.: Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group of people..."
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={(e) => {
                    setDescription(e.target.value);
                    renderCanvas();
                  }}
                />
                <ValidationMessage message="Required field"/>
              </div>

              {/*<div className="Form-group">*/}
              {/*  <label className="Form-label">*/}
              {/*    Royalty % <SVG hintIcon dataHint="Your fees for secondary sales. Small values are prefered." />*/}
              {/*  </label>*/}
              {/*  <div className="Form-royalty-picker">*/}
              {/*    <button type="button" className={`btn-regular ${royalty === 3 ? 'active' : ''}`} onClick={() => setRoyalty(3)}>*/}
              {/*      3%*/}
              {/*    </button>*/}
              {/*    <button type="button" className={`btn-regular ${royalty === 5 ? 'active' : ''}`} onClick={() => setRoyalty(5)}>*/}
              {/*      5%*/}
              {/*    </button>*/}
              {/*    <button type="button" className={`btn-regular ${royalty === 7 ? 'active' : ''}`} onClick={() => setRoyalty(7)}>*/}
              {/*      7%*/}
              {/*    </button>*/}
              {/*    <input*/}
              {/*      style={{ width: '20px' }}*/}
              {/*      type="number"*/}
              {/*      min={0} max={99}*/}
              {/*      name="royalty"*/}
              {/*      value={royalty}*/}
              {/*      onChange={(e) => setRoyalty(parseInt(e.target.value > 99 ? 99 : e.target.value < 0 ? 0 : e.target.value, 10))}*/}
              {/*    />*/}
              {/*  </div>*/}
              {/*</div>*/}
            </fieldset>

            <fieldset style={{maxWidth: '260px'}}>
              <legend>Files</legend>

              <div className="Form-group">
                {image && (
                  <FilePreview file={image} valid={true}>
                    <button onClick={() => {
                      setImageFile(null);
                      setPreviewImage(null);
                      CardPreviewImage.current.src = null;
                      renderCanvas();
                    }} type="button">
                      <SVG trash/>
                    </button>
                  </FilePreview>
                )}
                <div className="Form-group-file-wrapper">
                  <input
                    accept={IMAGE_EXTENSIONS.map(ext => `.${ext}`)}
                    required
                    type="file"
                    name="image"
                    value={image || ''}
                    onChange={handleImageChange}
                    style={{display: !image ? 'block' : 'none'}}
                  />
                  <ValidationMessage message="Required field"/>
                  {!image && <>
                    <button className="btn-big" type="button">
                      <SVG previewImage/>
                      Add preview image
                    </button>
                  </>}
                </div>
              </div>

              <div className="Form-group">
                <label className="Form-label">
                  Extra files:
                  <SVG hintIcon
                       dataHint={`Invalid or unsupported files will not be attached. Supported are: ${[...UPLOADER_SUPPORTED_EXTENSIONS].join(', ')}. Max 50mb.`}/>
                </label>
                <div className="Form-group-files-list-wrapper">
                  {attachedFiles.map(({file, uuid, valid}) => (
                    <FilePreview key={uuid} uuid={uuid} file={file} valid={valid}>
                      <button
                        onClick={() => {
                          const filtered = attachedFiles.filter(f => f.uuid !== uuid);
                          setAttachedFiles([...filtered]);
                        }}
                        type="button"
                      >
                        <SVG trash/>
                      </button>
                    </FilePreview>
                  ))}
                </div>
                <div className="Form-group-file-wrapper">
                  <input
                    type="file"
                    name="files"
                    multiple={true}
                    accept={UPLOADER_SUPPORTED_EXTENSIONS.map(ext => '.' + ext)}
                    onChange={handleFilesChange}
                  />
                  <button className="btn-big" type="button">
                    <SVG plus/> Add file(s)
                  </button>
                </div>
              </div>

              <div className="important-note">
                IMPORTANT!
                <br/>
                This is an exact view of the NFT at major marketplaces like OpenSea or Rarible.
                <br/>
                Make sure that everything looks nice and well. You will not have chance to change it after minting.
                <br/>
                If it looks weird than try to use latest version of your broser.
              </div>

              <button className="btn-action btn-big" type="submit" disabled={!settingsState.user}>
                <SVG bolt/> Mint on {settingsState.appConfiguration.NETWORK_NAME}
              </button>
            </fieldset>

            <fieldset>
              <legend>Cover for Major Marketplaces</legend>

              <div className="Market-preview-wrap">
                <div
                  className="Card-preview-before-mint-generated"
                  ref={CardPreviewBeforeMintGenerated}
                />
                <div className="Market-preview" ref={CardPreviewBeforeMint}>
                  <div className="layer-10"/>
                  <div className="layer-20"/>
                  <div className="layer-21">
                    <img src={logoLight} alt="memos.live"/>memos.live - Memorable Interactive NFTs
                  </div>
                  <div className="layer-icon">
                    <SVG video/>
                  </div>
                  <div className="layer-icon">
                    <SVG sound/>
                  </div>
                  <div className="layer-icon">
                    <SVG image/>
                  </div>
                  <div className="layer-icon">
                    <SVG feather/>
                  </div>
                  <div className="layer-ray layer-icon1-ray"/>
                  <div className="layer-ray layer-icon2-ray"/>
                  <div className="layer-ray layer-icon3-ray"/>
                  <div className="layer-ray layer-icon4-ray"/>
                  <div className="layer-11">
                    <div className="layer-11-inner">
                      <div className="date">
                        {isValidDate ? (
                          moment(exactTime ? `${previewDate} ${previewTime}` : previewDate, "YYYY-MM-DD HH:mm:ss").format(exactTime ? 'LLL' : 'LL')
                        ) : null}
                      </div>
                      <div className="title">
                        {previewName}
                      </div>
                    </div>
                  </div>
                  <div className="layer-09">
                    <div className="preview">
                      <div className="preview-img-holder">
                        <img src={previewImage} ref={CardPreviewImage}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
          </>
        </form>
      </div>
    </>
  );
}

export default Wizard;
