module.exports = {
  description: 'Get settings used to calculate butler ratings',
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
