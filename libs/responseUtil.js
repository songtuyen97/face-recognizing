const response_message = require('../common/response_message');
const response_key = require('../common/response_message_key');
const logger = require('../libs/logger');

let res_data = {
    status: false,
    code: 0,
    message: "",
    data: null,
}

let SUCCESSFULLY_KEY_DEFAULT = 'COMMON.SUCCESSFULLY';
let FAIL_KEY_DEFAULT = 'COMMON.FAIL';
let SERVER_FAIL_KEY_DEFAULT = 'COMMON.ERROR_SERVER';

function formatKey(key, status) {
    let keys = key.split('.');
    if(keys.length !== 2) {
        key = status ? SUCCESSFULLY_KEY_DEFAULT : FAIL_KEY_DEFAULT;
        keys = key.split('.');
    }

    let countError = 0;
    if(!response_message[keys[0]] || !response_key[keys[0]]) {
        logger('Response key is invalid');
        countError++;
    } 
    else if(!response_message[keys[0]][keys[1]] || !response_key[keys[0]][keys[1]]) {
        logger('Response key is invalid');
        countError++;
    }
    if(countError > 0) key = status ? SUCCESSFULLY_KEY_DEFAULT : FAIL_KEY_DEFAULT;

    return key;
}
function beforeResponse(key, status) {
    let key_ = formatKey(key, status);
    let keys_ = key_.split('.');
    console.log(keys_);
    let messageRes = response_message[keys_[0]][keys_[1]];
    let codeRes = response_key[keys_[0]][keys_[1]]["CODE"];
    let httpCodeRes = response_key[keys_[0]][keys_[1]]["HTTP_CODE"];

    let dataRes = {
        status: status,
        message: messageRes,
        code: codeRes,
        http_code: httpCodeRes
    }

    return dataRes;
}
function responseSuccess({res, key = SUCCESSFULLY_KEY_DEFAULT, data = null}) {
    let dataRes = beforeResponse(key, true);
    // add data
    dataRes.data = data;
    
    res.status(dataRes.http_code).json(dataRes);
}

function responseFail({res, key = FAIL_KEY_DEFAULT, data = null}) {
    if(typeof key !== 'string') {
        logger(key);
        key = SERVER_FAIL_KEY_DEFAULT;
    }
    let dataRes = beforeResponse(key, false);
    // add data
    dataRes.data = data;

    res.status(dataRes.http_code).json(dataRes);
}


module.exports = {
    responseSuccess,
    responseFail
}
