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
import SVG from "../SVG";
import Modal from "../Modal";
import Portal from "../../Portal";
import {playSound, randomInteger, fromWei, toWei} from "../../lib/utils";
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
  const { register, formState: { errors }, watch } = useForm();
  const CardPreviewBeforeMint = useRef(null);
  const CardPreviewBeforeMintGenerated = useRef(null);
  const CardPreviewImage = useRef(null);
  const { settingsState, setSettingsState } = useContext(SettingsContext);

  const [tokenURI, setTokenURI] = useState(null);
  const [metaDataState, setMetaData] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewName, setPreviewName] = useState('');
  const [previewDate, setPreviewDate] = useState('');
  const [description, setDescription] = useState('');
  const [previewTime, setPreviewTime] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [attachedFileTypes, setAttachedFileTypes] = useState([]);
  const [currentNftCost, setCurrentNftCost] = useState('');
  const [currentAllowance, setCurrentAllowance] = useState('');
  const [approvalInputShown, setApprovalInputShown] = useState(false);

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
          width: 600,
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

  useEffect(() => {
    renderCanvas();
    getCurrentNftCost();
    getAllowance();
  }, []);

  const specifyTime = watch('specifyTime');

  const handleImageChange = (event) => {
    const attachedImageFile = event.target.files[0];
    const extension = attachedImageFile.name.split('.').pop().toLowerCase();

    if (attachedImageFile && (IMAGE_EXTENSIONS.includes(extension) || ANIMATION_EXTENSIONS.includes(extension)) && attachedImageFile.size <= settingsState.appConfiguration.MAX_FILE_SIZE) {
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

        setImageFile(event.target.files[0]);
        // setImageFile(attachedImageFile);
        setPreviewImage(URL.createObjectURL(attachedImageFile));
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
      reader.readAsArrayBuffer(attachedImageFile);
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
      if (IMAGE_EXTENSIONS.includes(extension) || ANIMATION_EXTENSIONS.includes(extension)) fileType = 'Picture';
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

    const resultFilesList = [...attachedFiles, ...newFiles];

    const fileTypesArr = resultFilesList.reduce((acc, file) => ([...acc, file.trait_type]), []);
    const fileTypes = [...new Set(fileTypesArr)];
    setAttachedFileTypes(fileTypes);

    setAttachedFiles(resultFilesList);
    renderCanvas();
  }

  const onFormSubmit = async (e) => {
    e.preventDefault();
    if (Number(currentNftCost) > Number(currentAllowance)) {
      window.alert(`Not enough MLU tokens allowed. Approve more tokens (at least ${currentNftCost} MLU) to be used by smart contract`);
      return false;
    }
    if (!window.confirm('Is everything ready and you want to mint new NFT?')) return false;

    let data = {};
    for (const [key, value] of new FormData(e.target)) {
      data[key] = value;
    }
    console.log('Form data:', data);

    console.log('===> Uploading files to IPFS');
    setUploadStatusInProgress(true);
    document.body.style.overflow = 'hidden';

    console.log('===> Saving marketplace image');
    const imageDataBase64 = CardPreviewBeforeMintGenerated.current.querySelector('canvas').toDataURL();
    const previewOnCardImage = new Moralis.File(`${uuid()}.${data.image.name.split('.').pop()}`, data.image);

    await previewOnCardImage.saveIPFS();
    const previewOnCardImageUrl = previewOnCardImage.ipfs();

    const savedMarcetplacesCoverImage = new Moralis.File(`${uuid()}.${data.image.name.split('.').pop()}`, { base64: imageDataBase64 });
    await savedMarcetplacesCoverImage.saveIPFS();
    const savedMarcetplacesCoverImageUrl = savedMarcetplacesCoverImage.ipfs();

    let metaData = {
      image: savedMarcetplacesCoverImageUrl,
      // image_data: svgCode, // TODO: Put svg here
      external_url: 'https://memos.live/',
      description: data.description,
      name: data.name,
      attributes: []
    };

    metaData.attributes.push({
      key: 'File',
      trait_type: 'Picture',
      value: previewOnCardImageUrl
    });

    // date to attribute
    if (moment(data.eventDate, 'YYYY-MM-DD HH:mm:ss').isValid()) {
      metaData.attributes.push({
        key: 'Date',
        value: data.exactTime ? `${data.eventDate} ${data.exactTime}` : data.eventDate
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

    await createToken(tokenURI);
    // window.location.reload();
  }

  const getCurrentNftCost = async () => {
    const web3 = new Moralis.Web3(window.ethereum);
    const nftContract = new web3.eth.Contract(
      window.nftContractAbi,
      settingsState.appConfiguration.MINT_CONTRACT_ADDRESS
    );
    const result = await nftContract.methods.getCurrentCost().call();
    setCurrentNftCost(fromWei(result));
  }

  const getAllowance = async () => {
    if (settingsState.user) {
      const web3 = new Moralis.Web3(window.ethereum);
      const utilityContract = new web3.eth.Contract(
        window.utilityContractAbi,
        settingsState.appConfiguration.UTILITY_CONTRACT_ADDRESS
      );
      const result = await utilityContract.methods.allowance(
        settingsState.user.attributes.ethAddress,
        settingsState.appConfiguration.MINT_CONTRACT_ADDRESS
      ).call();
      setCurrentAllowance(fromWei(result));
    }
  }

  const createToken = async (tokenURI) => {
    const web3 = new Moralis.Web3(window.ethereum);

    const txParams = {
      to: settingsState.appConfiguration.MINT_CONTRACT_ADDRESS,
      from: window.ethereum.selectedAddress,
      data: web3.eth.abi.encodeFunctionCall({
        name: 'createToken',
        type: 'function',
        inputs: [{
          type: 'string',
          name: 'tokenURI'
        }]
      }, [tokenURI])
    };

    await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [txParams]
    });
    toast.info("Card was succesfully minted. You will be able to see it in your collection in several minutes");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  if (tokenURI) {
    return (
      <>
        <h1>Full Preview Before Minting</h1>

        <AlertMessage text="You can play with your newly created card and check if everything looking good. And if so then you only need to sign a transaction to put your NFT to the blockchain."/>

        <div className="Wizard-full-preview">
          <Card tokenUri={tokenURI} onChain={settingsState.appConfiguration.NETWORK_NAME}/>
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
              <legend>Card data</legend>

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
                />
                <ValidationMessage message="Required field"/>
              </div>

              <div className="Form-group">
                {imageFile && (
                  <FilePreview file={imageFile} valid={true}>
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
                    accept={[...IMAGE_EXTENSIONS.map(ext => `.${ext}`), ...ANIMATION_EXTENSIONS.map(ext => `.${ext}`)]}
                    required
                    type="file"
                    name="image"
                    defaultValue={imageFile}
                    onChange={handleImageChange}
                    style={{display: !imageFile ? 'block' : 'none'}}
                  />
                  {!imageFile && <>
                    <button className="btn-big" type="button">
                      <SVG previewImage/>
                      Add preview image
                    </button>
                    <ValidationMessage message="Required field"/>
                  </>}
                </div>
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

              <div className="Form-group">
                <label className="Form-label">
                  Date <SVG hintIcon
                            dataHint="You can specify the date and time which is your new NFT will be associated."/>
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={previewDate}
                  onChange={(e) => setPreviewDate(e.target.value)}
                  onBlur={(e) => {
                    setPreviewDate(e.target.value);
                    renderCanvas();
                  }}
                />
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
                          const fileTypesArr = filtered.reduce((acc, file) => ([...acc, file.trait_type]), []);
                          const fileTypes = [...new Set(fileTypesArr)];
                          setAttachedFileTypes(fileTypes);
                          renderCanvas();
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
            </fieldset>

            <fieldset style={{maxWidth: '260px'}}>
              <legend>Minting Info</legend>

              <div>
                Current cost of card minting:
                <br/>
                <b>{currentNftCost} MLU</b>
              </div>

              <br/>

              <div>
                MLU tokens approved for smart contract:
                <br/>
                <b>{currentAllowance} MLU</b>
              </div>

              <br/>

              <>
                <button
                  className=""
                  type="button"
                  onClick={() => setApprovalInputShown(true)}
                  disabled={!settingsState.utilityBalance}
                >
                  Allow smart contract to use your MLU tokens
                </button>

                <br/>
                <br/>

                <button
                  className="btn-action btn-big"
                  type="submit"
                  disabled={!settingsState.user || !settingsState.utilityBalance}
                >
                  <SVG bolt/> Mint on {settingsState.appConfiguration.NETWORK_NAME}
                </button>

                <br/>

                <button
                  className="btn-big"
                  type="button"
                  onClick={() => alert('Join discord to get MLU tokens.')}
                >
                  Buy MLU tokens <br/>(own it to be able to mint)
                </button>
              </>

              <Portal>
                {approvalInputShown && (
                  <Modal
                    show={approvalInputShown}
                    onCancel={() => setApprovalInputShown(false)}
                  >
                    <ApprovalForm
                      settingsState={settingsState}
                      currentNftCost={currentNftCost}
                      setApprovalInputShown={setApprovalInputShown}
                      getAllowance={getAllowance}
                      getCurrentNftCost={getCurrentNftCost}
                    />
                  </Modal>
                )}
              </Portal>
            </fieldset>
`
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
                    <img src={logoLight} alt="memos.live"/>memos.live - Community-driven Collection. The more cards from the collection you own, the more you earn at the time of creating each next card
                  </div>

                  {['Picture', 'Text', 'Video'].map((item, index) => (
                    <div className="layer-icon" style={{display: attachedFileTypes.includes(item) ? 'block' : 'none'}} key={index}>
                      {item === 'Picture' && <SVG image/>}
                      {item === 'Video' && <SVG video/>}
                      {item === 'Text' && <SVG feather/>}
                    </div>
                  ))}
                  <div className="layer-icon" style={{display: 'none'}}>
                    <SVG audio/>
                  </div>

                  {['Picture', 'Text', 'Video'].map((item, index) => (
                      <div className={`layer-ray layer-icon${index + 1}-ray`} style={{display: attachedFileTypes.includes(item) ? 'block' : 'none'}} key={index}/>
                  ))}
                  <div className="layer-ray layer-icon4-ray" style={{display: 'none'}}/>

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

              <br/>

              <div className="important-note">
                IMPORTANT!
                <br/>
                This is an exact view of the NFT at major marketplaces like OpenSea or Rarible.
                <br/>
                Make sure that everything looks nice and well. You will not have chance to change it after minting.
                <br/>
                If it looks weird (buggy) than try to use latest version of your broser.
              </div>

            </fieldset>
          </>
        </form>
      </div>
    </>
  );
}

function ApprovalForm(props) {
  const [approvalTxPending, setApprovalTxPending] = useState(false);
  const [utilityApproveValue, setUtilityApproveValue] = useState(fromWei(props.settingsState.utilityBalance.balance));

  const sendApprovalTx = async () => {
    setApprovalTxPending(true);
    const web3 = new Moralis.Web3(window.ethereum);
    const utilityContract = new web3.eth.Contract(
      window.utilityContractAbi,
      props.settingsState.appConfiguration.UTILITY_CONTRACT_ADDRESS
    );

    await utilityContract.methods.approve(
      props.settingsState.appConfiguration.MINT_CONTRACT_ADDRESS,
      toWei(utilityApproveValue)
    ).send({
      from: props.settingsState.user.attributes.ethAddress
    });

    setApprovalTxPending(false);
    props.setApprovalInputShown(false);
    props.getAllowance();
    props.getCurrentNftCost();
  }

  return (
    <div className="Form">
      {approvalTxPending && <Loader isOverlay text="Approval in progress..."/>}
      <label>
        MLU amount to approve:
      </label>
      <input
        type="number"
        min={props.currentNftCost}
        max={fromWei(props.settingsState.utilityBalance.balance)}
        value={utilityApproveValue}
        onChange={(e) => setUtilityApproveValue(e.target.value)}
        step="0.001"
      />
      <br/>
      <button type="button" className="btn-action btn-big" onClick={() => sendApprovalTx()}>
        Confirm
      </button>
    </div>
  );
}

export default Wizard;
