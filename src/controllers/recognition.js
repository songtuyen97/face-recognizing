const recognitionService = require('../services/recognition');
const {responseSuccess, responseFail} = require('../../libs/responseUtil');
module.exports = {
    training: async ({req, res, next})=> {
        try {
            let result = await recognitionService.trainingMain(req);
            // responseSuccess({res, key: 'COMMON.SUCCESSFULLY', data: result});
        } catch (error) {
            console.log(error);
        }
    },
    recognizing: async ({req, res, next})=> {
        try {
            let result = await recognitionService.recognizingFaceMain(req);
            responseSuccess({res, key: 'COMMON.SUCCESSFULLY', data: result});
        } catch (error) {
            responseFail({res, key: error});
        }
    }
}