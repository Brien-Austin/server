const bcrypt = require("bcryptjs");
const hashValue = (value, saltRounds) => bcrypt.hash(value, saltRounds || 10);

const compareValue = async (value, hash) =>
  bcrypt.compare(value, hash).catch(() => false);

module.exports = { hashValue, compareValue };
