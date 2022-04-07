module.exports = {
  description: 'Get all the bank account numbers of all butlers',
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
