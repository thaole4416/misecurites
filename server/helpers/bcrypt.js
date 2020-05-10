const bcrypt = require("bcrypt");
const saltRounds = 10;

const hash = async (matKhau) => {
  return await bcrypt.hash(matKhau, saltRounds);
};

const compare = async (matKhau, matKhauHash) => {
  return await bcrypt.compare(matKhau, matKhauHash);
};

module.exports = {
  hash: hash,
  compare: compare,
};
