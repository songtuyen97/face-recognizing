const mongoose = require('mongoose');

module.exports = {
    connectToDB: async ()=> {
        return await mongoose.connect('mongodb://localhost:27017/recognizing', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
}