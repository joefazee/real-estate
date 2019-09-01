const jwt = require('jsonwebtoken');
const { env, jwtSecret } = require('../config');

const secret = env === 'production' ? jwtSecret : 'secret';

const bufferSecret = new Buffer.from(secret, "base64");

exports.issue = payload => jwt.sign(payload, bufferSecret, { expiresIn: 86400 });

exports.verify = (token, cb) => jwt.verify(token, bufferSecret, cb);
