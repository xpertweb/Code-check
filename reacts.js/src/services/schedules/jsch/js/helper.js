function roundFloat(num) {
  // return Math.round((num + Number.EPSILON) * 100) / 100;
  return Math.round(num*(1/0.5)) / (1/0.5);
}

module.exports = {
  roundFloat
}