import { v4 as uuid } from 'uuid';
import path from "path";
import azure from 'azure-storage';
import { validationResult } from 'express-validator';

require('dotenv').config();

export const uploadPictureMW = async (req, res, next) => {
    if (!req.files?.file) return next();

    const file = req.files.file;
    const fileExt = path.extname(file.name);
    const generatedFilename = uuid() + fileExt;

    const blobService = azure.createBlobService();

    let blobOptions;
    if (fileExt === '.jpg' || fileExt === '.jpeg')
        blobOptions = { contentSettings: { contentType: 'image/jpeg' } }
    else if (fileExt === '.png')
        blobOptions = { contentSettings: { contentType: 'image/png' } };
    else return res.json({ errors: ['must be image type'] });

    const container = 'images';
    blobService.createBlockBlobFromText(container, generatedFilename, file.data,
        blobOptions, err => { if (err) throw err; });

    req.picture = {
        uri: blobService.getUrl('images', generatedFilename),
        blobName: generatedFilename,
        blobContainer: container
    };
    next();
};

export const validationExaminator = async (req, res, next) => {
    if (validationResult(req).errors.length > 0)
        return res.status(400).json(validationResult(req).errors);
    next();
};