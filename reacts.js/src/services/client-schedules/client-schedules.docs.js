module.exports = {
  description: 'Get visits without assigned butlers on times specified by client',
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
