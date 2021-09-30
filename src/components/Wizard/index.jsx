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
import CanvasRenderer from '../CanvasRenderer';
import SVG from "../../SVG";
import { playSound, randomInteger, getSpecsFromHash } from "../../lib/utils";
import TextareaAutosize from 'react-textarea-autosize';
import html2canvas from 'html2canvas';
import './index.css';
import Moralis from "moralis";

const soundsArray = ['effect1', 'effect2', 'effect3', 'effect4', 'effect5', 'effect6', 'effect7', 'effect8'];

const formConfig = {
  image: {
    required: 'Field is required',
  },
  name: {
    required: 'Field is required',
    maxLength: { value: 100, message: 'Max length is 100' },
  }
}

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
  const [tokenURI, setTokenURI] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [image, setImageFile] = useState(null);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const CardPreviewBeforeMint = useRef(null);
  const CardPreviewBeforeMintGenerated = useRef(null);
  const { settingsState, setSettingsState } = useContext(SettingsContext);

  const [previewName, setPreviewName] = useState('');
  const [previewDate, setPreviewDate] = useState('');
  const [previewTime, setPreviewTime] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const isValidDate = moment(previewDate, "YYYY-MM-DD HH:mm:ss").isValid();
  const exactTime = previewDate.length > 0 && previewTime.length > 0;

  const {
    UPLOADER_SUPPORTED_EXTENSIONS,
    IMAGE_EXTENSIONS,
    AUDIO_EXTENSIONS,
    TEXT_EXTENSIONS,
    VIDEO_EXTENSIONS,
  } = settingsState.appConfiguration.EXTENSIONS;

  useEffect(() => {
    if (CardPreviewBeforeMint && CardPreviewBeforeMintGenerated) {
      setTimeout(function () {
        html2canvas(CardPreviewBeforeMint.current, {
          allowTaint: true,
          useCORS: true
        }).then(function(canvas) {
          if (CardPreviewBeforeMintGenerated.current) {
            CardPreviewBeforeMintGenerated.current.innerHTML = '';
            CardPreviewBeforeMintGenerated.current.appendChild(canvas);
          }
        });
      }, 300);
    }
  });

  const specifyTime = watch('specifyTime');

  const handleImageChange = (event) => {
    const image = event.target.files[0];
    const extension = image.name.split('.').pop().toLowerCase();

    if (image && [...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS].includes(extension) && image.size <= settingsState.appConfiguration.MAX_FILE_SIZE) {
      setImageFile(image);
      setPreviewImage(URL.createObjectURL(image));

      var reader = new FileReader();
      reader.onloadend = function () {
        CardPreviewBeforeMintGenerated.current.src = reader.result;
      }
      reader.readAsDataURL(image);
    } else {
      alert(`Please select a correct file type for preview. Supported: ${[...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS].join(', ')}. Max 20mb.`);
    }
  }

  const handleFilesChange = (event) => {
    const newFiles = [...event.target.files].map((file) => {
      const extension = file.name.split('.').pop().toLowerCase();

      let fileType = null;
      if (TEXT_EXTENSIONS.includes(extension)) fileType = 'Text';
      if (IMAGE_EXTENSIONS.includes(extension)) fileType = 'Image';
      if (VIDEO_EXTENSIONS.includes(extension)) fileType = 'Video';

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
    setAttachedFiles([...attachedFiles, ...newFiles]);
  }

  const onFormSubmit = async (data) => {
    console.log('Form data:');
    console.log(data);
    // await sleep(500);

    console.log('===> Uploading files to IPFS');
    setUploadStatusInProgress(true);
    document.body.style.overflow = 'hidden';

    console.log('===> Saving marketplace image');
    const imageDataBase64 = CardPreviewBeforeMintGenerated.current.querySelector('canvas').toDataURL();
    const savedImage = new Moralis.File(`${uuid()}.${data.image[0].name.split('.').pop()}`, { base64: imageDataBase64 });
    await savedImage.saveIPFS();
    const saveiImageUrl = savedImage.ipfs();
    let metaData = {
      image: saveiImageUrl,
      // image_data: svgCode, // TODO: Put svg here
      external_url: 'https://memos.live/',
      description: data.description,
      name: data.name,
      attributes: [],
      background_color: '',
      // animation_url: saveiImageUrl,
    };

    // date to attribute
    if (moment(data.eventDate, 'YYYY-MM-DD HH:mm:ss').isValid()) {
      metaData.attributes.push({
        key: 'Date',
        value: data.exactTime ? `${data.eventDate} ${data.exactTime}` : data.eventDate,
        trait_type: 'Event Date'
      });
    }

    // tags to attributes
    // for (const tag of tags) {
    //   metaData.attributes.push({
    //     key: 'Tag',
    //     value: tag,
    //     trait_type: 'Tag'
    //   });
    // }

    // Linked items to attributes
    // for (const linkedItem of linkedItems) {
    //   metaData.attributes.push({
    //     key: 'Linked Item',
    //     value: linkedItem,
    //     trait_type: 'Linked Item'
    //   });
    // }

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

    await mintToken(tokenURI);

    window.location.reload();
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
          <Card
            tokenUri={tokenURI}
            // tokenIpfsHash={'https://ipfs.moralis.io:2053/ipfs/QmY2AEigcqjeC3uyprugYzNKNmS26UqqtUPopqjLEF3nAU'}
            // specs={getSpecsFromHash(tokenURI.split('ipfs/')[1])}
            // specs={[]}
          />
        </div>
      </>
    )
  }

  return (
    <>
      {isUploading && <Loader isUploader/>}

      {!settingsState.user && (
        <AlertMessage
          text="You need to login to be able to create new"
        >
          <button className="btn-action btn-big" onClick={() => login(setSettingsState)} type="button">
            <SVG wallet/> Connect Wallet
          </button>
        </AlertMessage>
      )}

      {settingsState.user && <div className="light-background-with-padding">
        <form
          className="Form"
          autoComplete="off"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <>
            <fieldset style={{width: '200px'}}>

              <legend>General</legend>
              <div className="Form-group">
                <label className="Form-label">Name</label>
                <input
                  type="text"
                  maxLength={75}
                  {...register("name", {...formConfig.name})}
                  placeholder="e.g.: Bitcoin was Launched"
                  value={previewName}
                  onChange={(e) => setPreviewName(e.target.value)}
                />
                {errors.name && <ValidationMessage message={errors.name.message}/>}
              </div>

              <div className="Form-group">
                <label className="Form-label">
                  Description <small style={{marginLeft: '.2rem', color: '#afafaf'}}>(text or markdown)</small>
                </label>
                <TextareaAutosize
                  cacheMeasurements
                  {...register("description")}
                  placeholder="e.g.: Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group of people..."
                  defaultValue=""
                />
                {errors.description && <ValidationMessage message={errors.description.message}/>}
              </div>

              <div className="Form-group">
                {image && (
                  <FilePreview file={image} valid={true}>
                    <button onClick={() => {
                      setImageFile(null);
                      setPreviewImage(null);
                    }} type="button">
                      <SVG trash/>
                    </button>
                  </FilePreview>
                )}
                <div className="Form-group-file-wrapper">
                  <input
                    accept={[...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS].map(ext => `.${ext}`)}
                    type="file"
                    {...register("image", {...formConfig.image})}
                    onChange={handleImageChange}
                    style={{display: !image ? 'block' : 'none'}}
                  />
                  {!image && <>
                    <button className="btn-regular btn-big" type="button">
                      <SVG previewImage/>
                      Add preview image
                    </button>
                  </>}
                </div>
                {!image && errors.image && <ValidationMessage message={errors.image.message}/>}
              </div>

              <div className="Form-group">
                <label className="Form-label">
                  Event Date <SVG hintIcon
                                  dataHint="You can specify the date and time which is your new NFT will be associated."/>
                </label>
                <input
                  type="date"
                  {...register("eventDate", {...formConfig.eventDate})}
                  value={previewDate}
                  onChange={(e) => setPreviewDate(e.target.value)}
                />
                {errors.eventDate && <ValidationMessage message={errors.eventDate.message}/>}
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
                      {...register("exactTime")}
                      value={previewTime}
                      onChange={(e) => setPreviewTime(e.target.value)}
                    />
                    {errors.exactTime && <ValidationMessage message={errors.exactTime.message}/>}
                  </div>
                )}
              </div>

            </fieldset>
            <fieldset>
              <legend>Related data</legend>

              <div className="Form-group">
                <label className="Form-label">
                  Extra files (image, video, audio, text): <SVG hintIcon
                                                                dataHint={`Invalid or unsupported files will not be attached. Supported are: ${[...UPLOADER_SUPPORTED_EXTENSIONS].join(', ')}. Max 20mb.`}/>
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
                  <button className="btn-regular btn-big" type="button">
                    <SVG plus/> Add file(s)
                  </button>
                </div>
              </div>

              {/*<div className="Form-group">*/}
              {/*  <label className="Form-label">*/}
              {/*    Tags <SVG hintIcon dataHint="Use it to help others find your NFT. 3-5 tags should be enough." />*/}
              {/*  </label>*/}
              {/*  <ReactTagInput*/}
              {/*    maxTags={7}*/}
              {/*    removeOnBackspace={true}*/}
              {/*    tags={tags}*/}
              {/*    onChange={(newTags) => setTags(newTags)}*/}
              {/*  />*/}
              {/*</div>*/}

              {/*<div className="Form-group">*/}
              {/*  <label className="Form-label">*/}
              {/*    Linked items: <SVG hintIcon dataHint="Specify token addresses of NFTs that are associated with NFT you are creating now." />*/}
              {/*  </label>*/}
              {/*  <ReactTagInput*/}
              {/*    maxTags={50}*/}
              {/*    removeOnBackspace={true}*/}
              {/*    tags={linkedItems}*/}
              {/*    onChange={(newItems) => setLinkedItems(newItems)}*/}
              {/*  />*/}
              {/*</div>*/}

              {/*<div className="Form-group">*/}
              {/*  <label className="Form-label">*/}
              {/*    Royalty % /!*<SVG hintIcon dataHint="Your fees for secondary sales. Small values are prefered." />*!/*/}
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
              {/*      type="number"*/}
              {/*      min={0} max={99}*/}
              {/*      value={royalty}*/}
              {/*      {...register("royalty")}*/}
              {/*      onChange={(e) => {*/}
              {/*        setRoyalty(parseInt(e.target.value > 99 ? 99 : e.target.value < 0 ? 0 : e.target.value, 10));*/}
              {/*      }}*/}
              {/*    />*/}
              {/*  </div>*/}
              {/*</div>*/}

            </fieldset>
            <fieldset>
              <legend>Preview</legend>

              <div className="Card-preview-before-mint-wrap">
                <div className="Card-preview-before-mint" ref={CardPreviewBeforeMint}>
                  <div className="Card Card-inactive">
                    <div className="Card-front">
                      <div className="Card-timer">
                        <div className="Card-date">
                          {isValidDate ? (
                            moment(previewDate, "YYYY-MM-DD HH:mm:ss").format(exactTime ? 'LLL' : 'LL')
                          ) : null}
                        </div>
                      </div>
                      <div className="Card-preview" style={{opacity: 0}}>
                        <img src={previewImage}/>
                      </div>
                      <div className="Card-title">
                        {previewName}
                      </div>
                    </div>
                  </div>

                  <CanvasRenderer imageUrl={previewImage}/>

                  {/*<div className="Card-preview-before-mint">*/}
                  {/*  <div className="Card Card-inactive">*/}
                  {/*    <div className="Card-front">*/}
                  {/*      <div className="Card-timer">*/}
                  {/*        <div className="Card-date">*/}
                  {/*          {isValidDate ? (*/}
                  {/*            moment(`${previewDate} ${previewTime}`, "YYYY-MM-DD HH:mm:ss").format(exactTime ? 'LLL' : 'LL')*/}
                  {/*          ) : null}*/}
                  {/*        </div>*/}
                  {/*        <div className="Card-date-ago">*/}
                  {/*          {isValidDate && <DurationTimer eventDate={`${previewDate} ${previewTime}`} exactTime={exactTime}/>}*/}
                  {/*        </div>*/}
                  {/*      </div>*/}
                  {/*      <div className="Card-preview ">*/}
                  {/*        <img src={previewImage}/>*/}
                  {/*      </div>*/}
                  {/*      <div className="Card-title">*/}
                  {/*        {previewName}*/}
                  {/*      </div>*/}
                  {/*    </div>*/}
                  {/*  </div>*/}

                  {/*  <CanvasRenderer*/}
                  {/*    titleStr={previewName}*/}
                  {/*    dateStr={isValidDate ? moment(`${previewDate} ${previewTime}`, "YYYY-MM-DD HH:mm:ss").format(exactTime ? 'LLL' : 'LL') : ''}*/}
                  {/*  />*/}
                </div>

                <div className="Card-preview-before-mint-generated" ref={CardPreviewBeforeMintGenerated}/>
              </div>

              <div className="important-note">
                IMPORTANT!
                <br/>
                This is an exact view of card on other marketplaces like OpenSea, Rarible and many others.
                <br/>
                Make sure that everything looks nice and well. You will not have chance to change it after minting.
              </div>

              <button className="btn-action btn-big" type="submit">
                <SVG bolt/> Mint on {settingsState.appConfiguration.NETWORK_NAME}
              </button>
            </fieldset>
          </>
        </form>
      </div>}
    </>
  );
}

export default Wizard;
