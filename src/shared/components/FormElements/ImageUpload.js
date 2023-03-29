import React, { useRef, useState, useEffect } from 'react';

import Button from './Button';
import './ImageUpload.css';

const ImageUpload = props => {
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    const filePickerRef = useRef();

    useEffect(() => {
        if (!file) {
            return;
        }
        const fileReader = new FileReader(); //api build into browser
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file]);

    const pickedHandler = event => {
        let pickedFile;
        let fileIsValid = isValid;
        if (event.target.files && event.target.files.length === 1) { //files default if event is native file picker
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid =true;
        } else {
            setIsValid(false);
            fileIsValid =false;
        }
        props.onInput(props.id, pickedFile, isValid, fileIsValid);
    };

    const pickImageHandler = () => {
        filePickerRef.current.click();

    };

    return (
        <div className="form-control">
            <input 
            id={props.id} 
            ref={filePickerRef}
            style={{display: 'none'}} 
            type="file" 
            accept=".jpg, .PNG, .jpeg" 
            onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className="image-upload__preview">
                    {previewUrl && <img src={previewUrl} alt="Preview" />}
                    {!previewUrl && <p>Please pick and image.</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>} {/*dont expose errors*/}
        </div> //why can I use this without importing Input.css?

    );
};

export default ImageUpload;