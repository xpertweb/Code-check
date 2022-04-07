module.exports = (butlerId, date, workDays) => {
  const matchingWorkDays = workDays.filter(
    workDay =>
      workDay.butlerId === butlerId &&
      workDay.date.toString() === date.toString()
  );
  if (matchingWorkDays.length !== 0) {
    return matchingWorkDays[0];
  }
  return null;
};
