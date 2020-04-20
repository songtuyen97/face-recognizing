const faceApi = require('face-api.js');
let canvas = require('canvas');

const { Canvas, Image, ImageData } = canvas
faceApi.env.monkeyPatch({ Canvas, Image, ImageData })

// Try experimenting on wherever your models are located. Mine are from up one folder
// You will get 'Error: Only absolute urls are supported' if you don't specify the absolute path
const MODELS_URL = './public/models';

async function loadModels() {
    await faceApi.nets.ssdMobilenetv1.loadFromDisk(MODELS_URL);
    await faceApi.nets.tinyFaceDetector.loadFromDisk(MODELS_URL);
    await faceApi.nets.faceRecognitionNet.loadFromDisk(MODELS_URL); 
    await faceApi.nets.faceLandmark68Net.loadFromDisk(MODELS_URL);
}
// ------------------------------------------API------------------------------
const http = require('http');
const express = require('express');
const route = require('./route/index');
const cors = require('cors');
const {connectToDB} = require('./database/database');

let App = express();

let server = http.createServer(App);

let PORT = 3001;
let HOST = '0.0.0.0';
server.listen(PORT, async ()=> {
    console.log('Server is running... port:', PORT);
    // load model
    console.log('Models is loading...');
    await loadModels();
    console.log('---------Models was loaded----------');
})

// connect DB
connectToDB().then(()=> {
    console.log('Connecting to DB is successfully');
}).catch((error)=> {
    console.log('Connect to DB is fail');
});
// ---
App.use(express.json());
App.use(cors());
App.use((req, res, next)=> {
    // set faceApi global for App
    req.faceApi = faceApi;
    next();
})

App.use(route);