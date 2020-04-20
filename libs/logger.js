const fs = require('fs');

let logPathDir = '../logs';
let logPathFile = '../logs/logErrors.txt';

function logger(logText) {
    let stringFormated = '';

    let currentTime = new Date();

    let currentYear = currentTime.getFullYear();
    let currentMonth = (currentTime.getMonth() + 1);
    let currentDate = currentTime.getDate();
    let currentHour = currentTime.getHours();
    let currentMinute = currentTime.getMinutes();
    let currentSecond = currentTime.getSeconds();

    let currentTimeString = currentYear + '/' + currentMonth + '/' + currentDate + '-' + currentHour + ':' + currentMinute + ':' + currentSecond;

    stringFormated += currentTimeString + ' - ' + logText + '\n';

    // let fileRead = fs.createReadStream(logPathFile);
    // let fileWrite = fs.createWriteStream(fileRead)
    fs.appendFile(logPathFile, stringFormated, function(err) {});
}

module.exports = logger;