module.exports = (d1, d2) => {
  return Math.floor((d2 - d1) / (7 * 24 * 60 * 60 * 1000));
};
