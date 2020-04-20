const mongoose = require("mongoose");
let IdolInfoModel = require("../models/idol_info");

createIdolInfo = () => {
  let data = {
    avatar: "unknown",
    full_name: "unknown",
    nick_name: 'dungct',
    basic_info: {
      country: "Viet name",
      birthday: "1997/08/13",
      gender: 1,
    },
    job_info: {
      name: "Developer",
      start_time: "2019/12/01",
      end_time: null,
    },
    extension: [
      {
        name: "unknown",
        url: "unknown",
      },
      {
        name: "unknown",
        url: "unknown",
      },
    ],
  };
  IdolInfoModel.create(data, (error) => {
    if (error) {
      console.log("Create database is fail");
      console.log(error);
      return;
    }
    console.log("Create database is successfully");
  });
};

module.exports = createIdolInfo;
