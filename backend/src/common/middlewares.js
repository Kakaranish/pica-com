import { v4 as uuid } from 'uuid';
import path from "path";
import azure from 'azure-storage';
import sharp from 'sharp';
import { validationResult } from 'express-validator';

require('dotenv').config();

export const uploadImageMW = async (req, res, next) => {
    if (!req.files?.file) return next();

    const file = req.files.file;
    const fileExt = path.extname(file.name);

    let blobOptions;
    if (fileExt === '.jpg' || fileExt === '.jpeg')
        blobOptions = { contentSettings: { contentType: 'image/jpeg' } }
    else if (fileExt === '.png')
        blobOptions = { contentSettings: { contentType: 'image/png' } };
    else return res.json({ errors: ['must be image type'] });

    const blobService = azure.createBlobService();
    const img = await sharp(file.data)
        .resize({ width: 200 })
        .toBuffer();

    const commonUuid = uuid();
    const generatedFilename = commonUuid + fileExt;
    const thumbnailGeneratedFilename = commonUuid + '-thumbnail' + fileExt;

    await blobService.createBlockBlobFromText(process.env.BLOB_CONTAINER,
        generatedFilename, file.data, blobOptions, err => { if (err) throw err; });
    await blobService.createBlockBlobFromText(process.env.BLOB_CONTAINER,
        thumbnailGeneratedFilename, img, blobOptions, err => { if (err) throw err; });

    req.image = {
        uri: blobService.getUrl('images', generatedFilename),
        blobName: generatedFilename,
        thumbnailUri: blobService.getUrl('images', thumbnailGeneratedFilename),
        thumbnailBlobName: thumbnailGeneratedFilename,
    };
    next();
};

export const validationExaminator = async (req, res, next) => {
    if (validationResult(req).errors.length > 0)
        return res.status(400).json(validationResult(req).errors);
    next();
};