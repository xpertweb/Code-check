module.exports = (butlersNeedingManagement) => {

  // requested visitButlers full of data
  const filledResults = butlersNeedingManagement.map(butler => {
    return {
      butler
    };
  });

  // const visitPlanIdSort = (a, b) => {
  //   return (a.requestedVisit.visitPlanId).localeCompare(b.requestedVisit.visitPlanId);
  // }

  const butlerRatingSort = (a, b) => {
    return parseFloat(b.butler.rating) - parseFloat(a.butler.rating);
  };
  //sort by rating
  return filledResults.sort(butlerRatingSort);
};
