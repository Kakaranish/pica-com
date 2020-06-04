import React, { useState } from 'react';

const ImageUploader = (params) => {

    const onImageChangeCb = params.onChange;
    const [previewPath, setPreviewPath] = useState(null);

    const onChange = event => {
        const file = event.target.files[0];
        if (!file || !isFileImageType(file)) {
            setPreviewPath(null);
            return;
        }
        const path = URL.createObjectURL(file);
        setPreviewPath(path);
        onImageChangeCb(file);
    };

    return (
        <>
            <div className="custom-file">
                <input className="custom-file-input" type="file" onChange={onChange} accept="image/*" />
                <label className="custom-file-label" htmlFor="uploadedFile">Choose image</label>
            </div>

            {
                previewPath &&
                <div className="text-center mt-4 mb-2">
                    <img src={previewPath} className="img-fluid" />
                </div>
            }

        </>
    );
};

/**
 * @param {File} file 
 */
const isFileImageType = file => {
    const fileType = file.type;
    const validImageTypes = ['image/jpeg', 'image/png'];
    return validImageTypes.includes(fileType);
}

export default ImageUploader;