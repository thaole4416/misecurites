function random(min, max) {
  min = (min / 100).toFixed(0) * 1;
  max = (max / 100).toFixed(0) * 1;
  return (Math.round(Math.random() * (max - min + 1)) + min) * 100;
}

module.exports = {
  random: random,
};
