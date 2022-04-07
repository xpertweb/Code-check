module.exports = {
  description: 'An api dedicated specifically for visit plans starting on a date to maximize performance',
  definitions: {
    messages: {
      'properties': {
        'startDate': {
          'type': 'string',
          'description': 'The starting date of the daterange property of the visit plan'
        }
      }
    }
  }
};
