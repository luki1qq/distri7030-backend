"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAccessToken = createAccessToken;

var _secrets = require("../utils/secrets.js");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function createAccessToken(payload) {
  return new Promise(function (resolve, reject) {
    _jsonwebtoken["default"].sign(payload, _secrets.JWT_SECRET, {}, function (err, token) {
      if (err) {
        reject(err);
      }

      resolve(token);
    });
  });
}