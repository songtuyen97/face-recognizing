const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let IdolInfoSchema = new Schema({
  nick_name: String,
  avatar: String,
  full_name: String,
  basic_info: {
    country: String,
    birthday: Date,
    gender: Number,
  },
  job_info: {
    name: String,
    start_time: Date,
    end_time: Date,
  },
  extension: [
    {
      name: String,
      url: String,
    }
  ],
  Created_at: {
      type: Date,
      default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

let model = mongoose.model('idol_info', IdolInfoSchema);

module.exports = model;
