// const faceApi = require('face-api.js');
// let fetch = require('node-fetch');
const path = require('path');
const multer = require('multer');
const IdolInfoModel = require('../../models/idol_info');
let canvas = require('canvas');
// // faceApi.env.monkeyPatch({ fetch: fetch });
let fs = require('fs');

// const { Canvas, Image, ImageData } = canvas
// faceApi.env.monkeyPatch({ Canvas, Image, ImageData })

// Try experimenting on wherever your models are located. Mine are from up one folder
// You will get 'Error: Only absolute urls are supported' if you don't specify the absolute path
// const MODELS_URL = './public/models';
const LABEL_DESCRIPTORS_FILE_URL = 'dataTrained.txt';
let faceOptions = null;
let faceApi = null;

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '../../../public/images/detected')
    },
    filename: function (req, file, cb) {
        let typeFile = file.originalname.split('.')[file.originalname.split('.').length - 1].toLowerCase();
        if(typeFile !== 'jpg'  && typeFile !== 'jpeg'  && typeFile !== 'png' ) {
            cb('error', null);
            return;
        }

        const fileName = 'face_000' + '.' + typeFile;
        cb(null, fileName);
    }
  })

let upload = multer({ storage: storage }).single('images');

async function recognizingFace(imageName) {
    initfaceOption();

    let imageInput = await imageDetecting(imageName);

    let labelFaceDescriptors = readDataFromFileStream();

    let faceMatcher = new faceApi.FaceMatcher(labelFaceDescriptors, 0.9);

    if(imageInput) {
        const bestMatch = faceMatcher.findBestMatch(imageInput.descriptor);
    return bestMatch;
    }

    return null;
}

function initfaceOption() {
    let inputSize = 128;
    let scoreThreshold = 0.58;
    faceOptions = new faceApi.TinyFaceDetectorOptions({
        inputSize,
        scoreThreshold
    });
}


function readDataFromFileStream() {
    let labelReadFromFile = JSON.parse(
      fs.readFileSync(LABEL_DESCRIPTORS_FILE_URL, "utf-8")
    );
    let labelFaceDescriptors = [];
    labelReadFromFile.forEach(labelData => {
      labelFaceDescriptors.push(
        new faceApi.LabeledFaceDescriptors(
          labelData.label,
          labelData.descriptors.map(descriptor => new Float32Array(descriptor))
        )
      );
    }); 

    return labelFaceDescriptors;
}

async function imageDetecting(imageName) {
    let firstPath = './public/images/detected/';
    let image = await canvas.loadImage(firstPath + imageName);
    const result = await faceApi
    .detectSingleFace(image, faceOptions)
    .withFaceLandmarks()
    .withFaceDescriptor();

    return result;
}


function recognizingFaceMain(req) {
    faceApi = req.faceApi;
    return new Promise((resolve, reject)=> {
        upload(req, null, async (err)=> {
            if(err) {
                reject('COMMON.ERROR_SERVER');
                return;
            }
            if(!req.file) {
                reject('COMMON.INVALID_DATA', 'file');
                return;
            }

            try {
                let result = await recognizingFace(req.file.filename);
                console.log(result);
                if(!result || result.label === 'unknown') {
                    reject('USER.UNKNOWN');
                    return;
                }

                let dataRes = await IdolInfoModel.findOne({nick_name: result.label});
                if(!dataRes) {
                    reject('COMMON.INVALID_DATA', 'file');
                    return;
                }

                resolve(dataRes);
            } catch (error) {
                reject('COMMON.ERROR_SERVER', error);
            }
        })
    })
}
/**
 * training
 */
async function writeDataToFileStream(labelFaceDescriptors) {
    // write result into file
    let writeStream = fs.createWriteStream(LABEL_DESCRIPTORS_FILE_URL);
    let dataBuffer = new Buffer(JSON.stringify(labelFaceDescriptors));
    writeStream.write(dataBuffer, (err)=> {
        if(err) {
            console.log('writing is error');
        } else {
            console.log('written');
        }
    })
}

async function detectAllFaces() {
    let labels = ['dungct', 'viruss', 'tuyennds'];

    return Promise.all(labels.map(async label=> {
        const imageCounting = 5;
        let descriptions = [];
    
        for(let i = 1; i <= imageCounting; i++) {
            let image = await canvas.loadImage('./public/images/' + label + '/'+ i +'.jpg');
            const detection = await faceApi.detectSingleFace(image, faceOptions).withFaceLandmarks() 
            .withFaceDescriptor();

            if(detection) descriptions.push(detection.descriptor);
        }
    
        return new faceApi.LabeledFaceDescriptors(label, descriptions);
    }))
}

async function trainingMain(req) {
    faceApi = req.faceApi;

    initfaceOption();

    let trainingData = await detectAllFaces();

    writeDataToFileStream(trainingData);   
}
module.exports = {
    recognizingFaceMain,
    trainingMain
}