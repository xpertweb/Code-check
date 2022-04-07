module.exports = {
  description: 'Get settings used to run allocations',
  definitions: {
    messages: {
      'properties': {
        'text': {
          'type': 'string',
          'description': 'The message text'
        },
        'startDate': {
          'type': 'string',
        },
        'endDate': {
          'type': 'string',
        }
      }
    }
  }
};
