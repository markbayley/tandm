import React, { useState, useEffect } from 'react';
import { Form, Image, ProgressBar } from 'react-bootstrap';
import db from '../firebase-config';
import { v4 as uuidv4 } from 'uuid';

const ImageUpload = ({ onUpload, rootPath }) => {
    const [imagePath, setImagePath] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(0);

    useEffect(() => {
        if (onUpload) {
            onUpload(imagePath)
        }
    }, [imagePath])

    const addFile = async (event) => {
        if (event && event.target && event.target.files.length && event.target.files[0].type) {
            var metadata = {
                contentType: event.target.files[0].type,
            };
            setImagePath(null)
            const uploadTask = db.storage().ref().child(`${rootPath || 'images'}/_${uuidv4()}_${event.target.files[0].name.match(/\.[0-9a-z]+$/i)[0]}`).put(event.target.files[0], metadata);

            uploadTask.on('state_changed', function (snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageUploadProgress(progress)
            }, function (error) {
            }, function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    setImagePath(downloadURL)
                });
            });

            return true;
        }
    }

    return (
        <>
            {
                imagePath ? <Image src={imagePath} thumbnail /> : <ProgressBar now={imageUploadProgress} />
            }
            <Form.File accept="image/*" className="position-relative" name="image" onChange={addFile} />
        </>
    )
}

export default ImageUpload;