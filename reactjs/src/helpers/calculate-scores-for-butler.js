const sum = arr => arr.reduce((a,b) => a + b, 0);

/*
  [Y] * # of feedback scores > [A] - [coefficient] * # of feedback scores < [coefficientThreshold] + ( sum ( all feedback > [B]) + sum (all feedback < [B]) * [X] ) / ((# of feedback > [B]) + (# of feedback < [B]) * X )
*/

module.exports =  ( feedbackSettings, allButlerFeedback, debugging )=>{
  let {premiumThresholdRating, penaltyThresholdRating, premiumRating, negativeRating, penalizeRepeatedBadRatingCoefficient, penalizeRepeatedBadRatingThreshold} = feedbackSettings;

  premiumThresholdRating = parseFloat(premiumThresholdRating); // A
  penaltyThresholdRating = parseFloat(penaltyThresholdRating); // B
  premiumRating = parseFloat(premiumRating); // X
  negativeRating = parseFloat(negativeRating); // Y
  penalizeRepeatedBadRatingCoefficient  = parseFloat(penalizeRepeatedBadRatingCoefficient); // [NewCoefficient]
  penalizeRepeatedBadRatingThreshold = parseFloat(penalizeRepeatedBadRatingThreshold); // [NewVar]

  const allScores = allButlerFeedback.map(x=> parseFloat(x.score));
  const scoresAboveGoodThreshold = allScores.filter(x=> x > premiumThresholdRating);
  const scoresAboveNegativeThreshold = allScores.filter(x=> x > penaltyThresholdRating);
  const scoresBelowNegativeThreshold = allScores.filter(x=> x < penaltyThresholdRating);
  const scoresBelowCoefficientThreshold = allScores.filter(x=> x < penalizeRepeatedBadRatingThreshold);

  const finalScore = (sum(scoresAboveNegativeThreshold) + sum(scoresBelowNegativeThreshold) * negativeRating)
    / (scoresAboveNegativeThreshold.length + (scoresBelowNegativeThreshold.length * negativeRating));

  const goodRatingBoost = premiumRating * scoresAboveGoodThreshold.length;
  const badRatingCut = (penalizeRepeatedBadRatingCoefficient * scoresBelowCoefficientThreshold.length);

  // this makes the rating have a precision of 2
  return Math.round((goodRatingBoost + (finalScore - badRatingCut)) * 1e2) / 1e2;
};
