const User = require("../models/User");

async function generateUniqueNhisNumber() {
  let generated;
  let exists = true;

  while (exists) {
    generated = `NHIS-${Math.floor(100000 + Math.random() * 900000)}`;
    // eslint-disable-next-line no-await-in-loop
    exists = await User.exists({ nhisNumber: generated });
  }

  return generated;
}

module.exports = {
  generateUniqueNhisNumber,
};
