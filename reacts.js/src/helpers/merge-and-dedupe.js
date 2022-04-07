module.exports = (a, b, property) => {
  var c = a.concat(b);
  return c.filter((thing, index, self) =>
    index === self.findIndex((t) => (
      t[property] === thing[property]
    ))
  );
};
