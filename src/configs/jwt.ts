import { ApolloError } from "apollo-server-errors";

var CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');

// const privateKey = CryptoJS.AES.encrypt('privateKey', 'secretKey').toString()
const privateKey = 'privateKey'
const option = {
  expiresIn: '90d'
}
const JWTtoken = {
  encode: (data) => {
    return jwt.sign({
      data,
    }, privateKey, option)
  },
  decode: async (token) => {
    try {
      const res = await jwt.verify(token, privateKey);
      return res.data
    } catch(err) {
      throw new ApolloError('UNAUTHENTICATED', 'UNAUTHENTICATED')
    }
  }
}

export {
  JWTtoken
}