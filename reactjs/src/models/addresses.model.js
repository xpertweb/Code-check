
export const addressSchemaProps = {
  line1: { type: String, required: true, length: { min: 1, max: 100 } },
  line2: { type: String, length: { min: 0, max: 100 } },
  locale: { type: String, required: true, length: { min: 1, max: 100 } },
  state: { type: String, required: true, length: { min: 1, max: 100 } },
  postcode: { type: String, required: true, length: { min: 1, max: 10 } },
  country: { type: String, required: true, length: { min: 1, max: 100 } }
};
