const bcrypt = require("bcrypt");

const encryptPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (incomingPassword, savedPassword) => {
  return await bcrypt.compare(incomingPassword, savedPassword);
};

module.exports = {
  encryptPassword,
  comparePassword,
};
