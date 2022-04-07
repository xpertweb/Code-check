const { ruuid, rdate } = require('./validators/regex');

export const feedbackSchemaProps = {
  score: { type: Number, range: { min: 0, max: 5 }, required: true },
  visitDate: { type: String, required: true, format: [rdate, 'Visit date is invalid'] },
  butlerId: {
    type: String,
    required: true,
    format: [ruuid, 'Butler id must be uuid']
  }
};
