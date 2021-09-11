import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import {v4 as uuid} from 'uuid';
import moment from 'moment';
import { toast } from 'react-toastify';
import SettingsContext from '../../SettingsContext';
import ReactTagInput from "@pathofdev/react-tag-input";
import AlertMessage from '../AlertMessage';
import PreviewStep from '../PreviewStep';
import Loader from '../Loader';
import SVG from "../../SVG";
import { playSound, randomInteger } from "../../lib/utils";
import TextareaAutosize from 'react-textarea-autosize';
import './index.css';
import {getConfig} from "../../config";
import Moralis from "moralis";

const config = getConfig();

const {
  UPLOADER_SUPPORTED_EXTENSIONS,
  IMAGE_EXTENSIONS,
  AUDIO_EXTENSIONS,
  TEXT_EXTENSIONS,
  VIDEO_EXTENSIONS,
} = config.EXTENSIONS;


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

function Editor() {
  const [royalty, setRoyalty] = useState(3);
  const [isUploading, setUploadStatusInProgress] = useState(false);
  const [tokenURI, setTokenURI] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [image, setImageFile] = useState(null);
  const [tags, setTags] = React.useState([]);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { settingsState } = useContext(SettingsContext);

  const specifyTime = watch('specifyTime');

  const handleImageChange = (event) => {
    const image = event.target.files[0];
    const extension = image.name.split('.').pop().toLowerCase();

    if (image && [...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS].includes(extension) && image.size <= config.MAX_FILE_SIZE) {
      setImageFile(image);
    } else {
      alert(`Please select a correct file type for preview. Supported: ${[...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS].join(', ')}. Max 20mb.`);
    }
  }

  const handleFilesChange = (event) => {
    const newFiles = [...event.target.files].map((file) => {
      const extension = file.name.split('.').pop().toLowerCase();

      let fileType = null;
      if (TEXT_EXTENSIONS.includes(extension)) fileType = 'Text File';
      if (IMAGE_EXTENSIONS.includes(extension)) fileType = 'Image File';
      if (AUDIO_EXTENSIONS.includes(extension)) fileType = 'Audio File';
      if (VIDEO_EXTENSIONS.includes(extension)) fileType = 'Video File';

      return {
        file,
        extension,
        value: null,
        uuid: uuid(),
        key: 'link',
        trait_type: fileType,
        valid: UPLOADER_SUPPORTED_EXTENSIONS.includes(extension) && file.size <= config.MAX_FILE_SIZE
      }
    });
    setAttachedFiles([...attachedFiles, ...newFiles]);
  }

  const onFormSubmit = async (data) => {
    console.log('Form data:');
    console.log(data);

    console.log('===> Uploading files to IPFS');
    setUploadStatusInProgress(true);
    document.body.style.overflow = 'hidden';

    console.log('===> Saving main image');
    const savedImage = new Moralis.File(`${uuid()}.${data.image[0].name.split('.').pop()}`, data.image[0]);
    await savedImage.saveIPFS();
    const saveiImageUrl = savedImage.ipfs();
    let metaData = {
      image: saveiImageUrl,
      // image_data: '',
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
        value: data.eventDate,
        trait_type: 'Event Date'
      });
    }

    // tags to attributes
    for (const tag of tags) {
      metaData.attributes.push({
        key: 'Tag',
        value: tag,
        trait_type: 'Tag'
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

    setUploadStatusInProgress(false);
    document.body.style.overflow = 'auto';

    console.log('Metadata saved:');
    console.log(metaData);

    setTokenURI(tokenURI);
    setMetaData(metaData);
    toast.info("1 step to finish. Confirm minting by signing transaction.");
    const soundNumber = randomInteger(0, 7);
    playSound(soundsArray[soundNumber]);
  }

  return (
    <>
      {tokenURI && metaData ? (
        <>
          <h1>
            NFT Preview
          </h1>
          <PreviewStep tokenURI={tokenURI} metaData={metaData}/>
        </>
      ) : (
        <>
          <h1>
            Editor
          </h1>

          {isUploading && <Loader isUploader/>}

          <form
            className="Form"
            autoComplete="off"
            onSubmit={handleSubmit(onFormSubmit)}
          >

            {!settingsState.user ? (
              <AlertMessage
                text="You need to login to be able to create new"
              />
            ) : (
              <>
                <fieldset>

                  <legend>General information</legend>
                  <div className="Form-group">
                    <label className="Form-label">Name</label>
                    <input
                      type="text"
                      {...register("name", { ...formConfig.name })}
                      placeholder="e.g.: Bitcoin was launched"
                      defaultValue={''}
                    />
                    {errors.name && <ValidationMessage message={errors.name.message} />}
                  </div>

                  <div className="Form-group">
                    <label className="Form-label">
                      Description
                    </label>
                    <TextareaAutosize
                      cacheMeasurements
                      {...register("description")}
                      placeholder="e.g.: Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group of people..."
                      defaultValue={''}
                    />
                    {errors.description && <ValidationMessage message={errors.description.message} />}
                  </div>

                  <div className="Form-group">
                    <label className="Form-label" >
                      Main Preview <SVG hintIcon dataHint={`Image or animation for the front side. Supported: ${[...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS].join(', ')}. Max 20mb.`} />
                    </label>
                    {image && (
                      <FilePreview file={image} valid={true}>
                        <button onClick={() => setImageFile(null)} type="button">
                          <SVG trash />
                        </button>
                      </FilePreview>
                    )}
                    <div className="Form-group-file-wrapper">
                      <input
                        accept={[...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS].map(ext => `.${ext}`)}
                        type="file"
                        {...register("image", { ...formConfig.image })}
                        onChange={handleImageChange}
                        style={{ display: !image ? 'block' : 'none' }}
                      />
                      {!image && <>
                        <button className="btn-regular" type="button">
                          <SVG plus />
                          Add
                        </button>
                      </>}
                    </div>
                    {!image && errors.image && <ValidationMessage message={errors.image.message} />}
                  </div>

                  <div className="Form-group">
                    <label className="Form-label">
                      Royalty % <SVG hintIcon dataHint="Your fees for secondary sales. Small values are prefered." />
                    </label>
                    <div className="Form-royalty-picker">
                      <button type="button" className={`btn-regular ${royalty === 3 ? 'active' : ''}`} onClick={() => setRoyalty(3)}>
                        3%
                      </button>
                      <button type="button" className={`btn-regular ${royalty === 5 ? 'active' : ''}`} onClick={() => setRoyalty(5)}>
                        5%
                      </button>
                      <button type="button" className={`btn-regular ${royalty === 7 ? 'active' : ''}`} onClick={() => setRoyalty(7)}>
                        7%
                      </button>
                      <input
                        type="number"
                        min={0} max={99}
                        value={royalty}
                        {...register("royalty")}
                        onChange={(e) => {
                          setRoyalty(parseInt(e.target.value > 99 ? 99 : e.target.value < 0 ? 0 : e.target.value, 10));
                        }}
                      />
                    </div>
                  </div>

                </fieldset>
                <fieldset>
                  <legend>Correlating data</legend>

                  <div className="Form-group">
                    <label className="Form-label">
                      Date <SVG hintIcon dataHint="You can specify the date and time which is your new NFT will be associated." />
                    </label>
                    <input
                      type="date"
                      {...register("eventDate", { ...formConfig.eventDate })}
                      defaultValue=""
                    />
                    {errors.eventDate && <ValidationMessage message={errors.eventDate.message} />}
                  </div>

                  <div className="Form-group Form-group-set-time">
                    <div className="Form-group-set-time-switch">
                      <input
                        className="switch"
                        type="checkbox"
                        id="specifyTime"
                        {...register("specifyTime")}
                      />
                      <label htmlFor="specifyTime">Set time</label>
                    </div>
                    {specifyTime && (
                      <div className="Form-group-set-time-input">
                        <input
                          type="time"
                          {...register("exactTime")}
                          defaultValue=""
                        />
                        {errors.exactTime && <ValidationMessage message={errors.exactTime.message} />}
                      </div>
                    )}
                  </div>

                  <div className="Form-group">
                    <label className="Form-label">
                      Tags <SVG hintIcon dataHint="Use it to help others find your NFT. 3-5 tags should be enough." />
                    </label>
                    <ReactTagInput
                      maxTags={7}
                      removeOnBackspace={true}
                      tags={tags}
                      onChange={(newTags) => setTags(newTags)}
                    />
                  </div>

                  <div className="Form-group">
                    <label className="Form-label">
                      Associated items: <SVG hintIcon dataHint="Specify token addresses of NFTs that are associated with NFT you are creating now." />
                    </label>
                    <ReactTagInput
                      maxTags={7}
                      removeOnBackspace={true}
                      tags={tags}
                      onChange={(newTags) => setTags(newTags)}
                    />
                  </div>

                  <div className="Form-group">
                    <label className="Form-label">
                      Files: <SVG hintIcon dataHint={`Invalid or unsupported files will not be attached. Supported are: ${[...UPLOADER_SUPPORTED_EXTENSIONS].join(', ')}. Max 20mb.`} />
                    </label>
                    <div className="Form-group-files-list-wrapper">
                      {attachedFiles.map(({ file, uuid, valid }) => (
                        <FilePreview key={uuid} uuid={uuid} file={file} valid={valid}>
                          <button
                            onClick={() => {
                              const filtered = attachedFiles.filter(f => f.uuid !== uuid);
                              setAttachedFiles([...filtered]);
                            }}
                            type="button"
                          >
                            <SVG trash />
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
                      <button className="btn-regular" type="button">
                        <SVG plus /> Add files
                      </button>
                    </div>
                  </div>

                </fieldset>

                <button className="btn-primary btn-lg" type="submit">
                  <SVG nextArrow/>
                  Final step
                </button>
              </>
            )}
          </form>
        </>
      )}
    </>
  );
}

export default Editor;
