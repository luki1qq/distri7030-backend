"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upload = exports.s3 = void 0;

var _clientS = require("@aws-sdk/client-s3");

var _multer = _interopRequireDefault(require("multer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import multerS3 from "multer-s3-v3";
var s3 = new _clientS.S3Client({
  region: "sa-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
exports.s3 = s3;

var storage = _multer["default"].memoryStorage();

var upload = (0, _multer["default"])({
  storage: storage
});
exports.upload = upload;