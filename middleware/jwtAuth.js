const jwt = require('jsonwebtoken');
const { secretForJWT } = require('../config');
const responseHelper = require('../helpers/responseHelper');
const { user } = require('../models/user');

var verifyJetToken = async function (token) {
  return new Promise(function (resolve, reject) {
    jwt.verify(token, secretForJWT, function (err, decoded) {
      if (err) reject();
      resolve(decoded);
    });
  });
};
module.exports = {
  jwtChecker: async function (req, res, next) {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
      var values = req.headers.authorization.split(' ');
      var token = values[0].length > 20 ? values[0] : values[1];
      let isExisted;
      var isToken;

      if (req.tokenData === undefined) {
        isToken = await user.findOne({
          userToken: token,
        });
        if (isToken == null) {
          isToken = await user.findOne({
            userToken: token,
          });
        }
      } else {
        isToken = await user.findOne({
          userToken: token,
        });
      }

      if (isToken != null) isExisted = true;
      else isExisted = false;


      if (isExisted) {
        verifyJetToken(token)
          .then((userData) => {
            req.tokenData = userData;
            next();
          })
          .catch(() => {
            return responseHelper.sendJsonResponse(req, res, 401, null, 'Token Expired', 'Error');
          });
      } else return responseHelper.sendJsonResponse(req, res, 401, null, 'Token Expired', 'Error');
    } else {
      return responseHelper.sendJsonResponse(req, res, 422, null, 'Token Required.', 'Error');
    }
  },
  setJwtToken: async function (userData) {
    return new Promise(function (resolve, reject) {
      let ecpt = {
        _id: userData._id,
      };

      jwt.sign(
        {
          user: ecpt,
        },
        secretForJWT,
        function (err, token) {
          if (err) reject(false);
          else resolve(token);
        }
      );
    });
  },
  validateToken: async function (token) {
    if (token) {
      let userId;
      const newDate = new Date();
      // check token is valid and time not exceeded
      isToken = await user.findOne({
        'forgotPassword.token': token,
        'forgotPassword.tokenExpireTime': { $gte: newDate },
      });

      if (isToken == null) return false;
      else {
        const res = await verifyJetToken(token);
        userId = res.user._id;

        // check userId available
        const user = await user.findOne({
          _id: userId,
        });
        if (user) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  },
  verifyTokenAndUpdate: async function (token) {
    if (token) {
      let userId;
      const newDate = new Date();
      // check token is valid and time not exceeded
      isToken = await user.findOne({
        'verifyMail.token': token,
        'verifyMail.tokenExpireTime': { $gte: newDate },
      });

      if (isToken == null) return false;
      else {
        const res = await verifyJetToken(token);
        userId = res.user._id;

        // check userId available
        const user = await user.findOne({
          _id: userId,
          userRole: 'chef',
        });
        if (user) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  },
};
