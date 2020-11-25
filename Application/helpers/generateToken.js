const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

/**
 * Generate Token
 * @param {string} 
 * @returns {string} token
 */
exports.createUserToken = (data = {}, secretkey, expiration_time = "1h") => {
  const token = jwt.sign(data, secretkey, { expiresIn: expiration_time });

  return token;
};
