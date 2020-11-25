/**
 * isValidEmail helper method
 * @param {string} email
 * @returns {Boolean} True or False
 */
exports.isEmailValid = (email) => {
  const regexEx = /\S+@\S+\.\S+/;
  return regexEx.test(email);
};

/**
 * isEmpty helper method
 * @param {string, integer} input
 * @returns {Boolean} True or False
 */

exports.isEmpty = (input) => {
  if (input === undefined || input === "") {
    return true;
  }
  if (input.replace(/\s/g, "").length) {
    return false;
  }
  return true;
};

/**
 * validatePassword helper method
 * @param {string} password
 * @returns {Boolean} True or False
 */
exports.validatePassword = (password) => {
  if (password.length <= 5 || password === "") {
    return false;
  }
  return true;
};

