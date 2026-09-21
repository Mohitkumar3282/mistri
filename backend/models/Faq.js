import { createAppModel, Mixed } from './appModel.js';

// FAQ groups: one document per category holding its questions.
const Faq = createAppModel('Faq', {
  key: 'category',
  collection: 'faqs',
  fields: {
    questions: [Mixed],
  },
});

export default Faq;
