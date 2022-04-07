module.exports = {
  description: 'Get settings used to calculate CPC (churn per client), a measure of how many clients a butler has costed us',
  definitions: {
    messages: {
      'properties': {
        'thresholdForRatingAlgorithm': {
          'type': 'float',
          'description': 'The threshold used to calculate ratings'
        },
      }
    }
  }
};
