const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

const csvFilter = (req,file, cb) => {

  if (file.mimetype.includes("csv")) {
    cb(null, true);
  } else {
    cb("Please upload only csv file.", false);
  }
};

var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null,  __basedir + '/file/');
  },
  filename: function(req, file, cb){
    cb(null, uuidv4());
  },
});
var uploadFile = multer({ storage: storage, fileFilter: csvFilter });
module.exports = uploadFile;
