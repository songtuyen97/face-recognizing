const faceApi = require('face-api.js');
let fetch = require('node-fetch');
const path = require('path');
let canvas = require('canvas');
// faceApi.env.monkeyPatch({ fetch: fetch });
let fs = require('fs');

const { Canvas, Image, ImageData } = canvas
faceApi.env.monkeyPatch({ Canvas, Image, ImageData })

// Try experimenting on wherever your models are located. Mine are from up one folder
// You will get 'Error: Only absolute urls are supported' if you don't specify the absolute path
const MODELS_URL = './public/models';
const LABEL_DESCRIPTORS_FILE_URL = 'dataTrained.txt';

async function main() {
    // Load model 
    // console.log(faceApi.nets)
    // await loadModels();
        
    //the image that need detecting
    // let path = '1.jpg';
    // let imageInput = await imageDetecting(path);
    //training
    // let labelFaceDescriptors = await detectAllFaces();

    //write data into file
    // writeDataToFileStream(labelFaceDescriptors);

    let labelFaceDescriptors = readDataFromFileStream();

    let faceMatcher = new faceApi.FaceMatcher(labelFaceDescriptors, 0.7);

    if(imageInput) {
        const bestMatch = faceMatcher.findBestMatch(imageInput.descriptor);
    }
};

async function recognizingFace(imageName) {
    let imageInput = await imageDetecting(imageName);

    let labelFaceDescriptors = readDataFromFileStream();

    let faceMatcher = new faceApi.FaceMatcher(labelFaceDescriptors, 0.9);

    if(imageInput) {
        const bestMatch = faceMatcher.findBestMatch(imageInput.descriptor);
        return bestMatch;
    }

    return null;
}

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

async function loadModels() {
    await faceApi.nets.ssdMobilenetv1.loadFromDisk(MODELS_URL)
    await faceApi.nets.faceRecognitionNet.loadFromDisk(MODELS_URL); 
    await faceApi.nets.faceLandmark68Net.loadFromDisk(MODELS_URL);
}

async function imageDetecting(imageName) {
    let firstPath = './public/images/detected/';
    let image = await canvas.loadImage(firstPath + imageName);
    const result = await faceApi
    .detectSingleFace(image, new faceApi.SsdMobilenetv1Options())
    .withFaceLandmarks()
    .withFaceDescriptor();

    return result;
}

async function detectAllFaces() {
    let labels = ['domixi', 'dungct', 'viruss'];

    return Promise.all(labels.map(async label=> {
        const imageCounting = 5;
        let descriptions = [];
    
        for(let i = 1; i <= imageCounting; i++) {
            let image = await canvas.loadImage('./public/images/' + label + '/'+ i +'.jpg');
            const detection = await faceApi.detectSingleFace(image).withFaceLandmarks() 
            .withFaceDescriptor();

            if(detection) descriptions.push(detection.descriptor);
        }
    
        return new faceApi.LabeledFaceDescriptors(label, descriptions);
    }))
}


// ------------------------------------------API------------------------------
const http = require('http');
const express = require('express');
const multer = require('multer');
let App = express();

let server = http.createServer(App);

let PORT = 3000;
server.listen(PORT, async ()=> {
    console.log('Server is running... port: ${PORT}');
    // load model
    console.log('Models is loading...');
    await loadModels();
    console.log('---------Models was loaded----------');
})

App.use(express.json());
App.use((req, res, next)=> {
    next();
})
// ----------
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/public/images/detected')
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
App.post('/', async (req, res, next)=> {
    
    upload(req, res, async (err)=> {
        if(err) {
            res.status(200).json({label: 'Err', distance: null});
        }
        if(!req.file) {
            res.status(200).json({label: 'File is missing', distance: null});
        }
        let result = await recognizingFace(req.file.filename);
        if(!result) {
            res.status(200).json({label: null, distance: null});
            return;
        }
        res.status(200).json({label: result._label, distance: result._distance});
    })
    // console.log('day');
    // console.log(req.files);
    // console.log(req.file);
    // await main();
})

App.get('/training', async (req, res, next)=> {
    let labelFaceDescriptors = await detectAllFaces();

    let result = await writeDataToFileStream(labelFaceDescriptors);

    res.status(200).json('success');
})