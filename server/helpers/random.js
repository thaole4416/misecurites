function random(min, max) {
  min = (min / 100).toFixed(0) * 1;
  max = (max / 100).toFixed(0) * 1;
  return (Math.round(Math.random() * (max - min + 1)) + min) * 100;
}

async function autoId  (maxId)  {
  let a = maxId.split("A")[1] * 1 + 1;
  if(a < 10 ) return `29A00000${a}`
  else if(a < 100 ) return `29A0000${a}`
  else if(a < 1000 ) return `29A000${a}`
  else if(a < 10000 ) return `29A00${a}`
  else if(a < 100000 ) return `29A0${a}`
  else if(a < 1000000 ) return `29A${a}`
}

module.exports = {
  random: random,
  autoId: autoId
};
