import mongoose from 'mongoose';

/**
 * Atomically returns the next number in a named sequence (e.g. order numbers),
 * safe under concurrent requests - two orders placed at the same instant can never
 * get the same number, unlike a random id.
 */
export const nextSequence = async (name) => {
  const result = await mongoose.connection.db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  const doc = result && result.value !== undefined ? result.value : result;
  return doc.seq;
};

/** Sets a sequence to at least `value`, without going backwards. Used for one-off migrations. */
export const ensureSequenceAtLeast = async (name, value) => {
  await mongoose.connection.db.collection('counters').updateOne(
    { _id: name },
    { $max: { seq: value } },
    { upsert: true }
  );
};
