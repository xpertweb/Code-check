module.exports = (list, propertyToDedupeBy) => {
  return list.filter((thing, index, self) =>
    index === self.findIndex((t) => (
      t[propertyToDedupeBy] === thing[propertyToDedupeBy]
    ))
  );
};