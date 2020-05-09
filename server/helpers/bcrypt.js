const bcrypt = require("bcrypt");
const saltRounds = 10;

const hash = async (matKhau) => {
  await bcrypt.hash(matKhau, saltRounds);
};

const compare = async (matKhau, matKhauHash) => {
  await bcrypt.compare(matKhau, matKhauHash);
};

module.exports = {
  hash: hash,
  compare: compare,
};
