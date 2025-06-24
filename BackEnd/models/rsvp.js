const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    event: { type: Schema.Types.ObjectId, ref: 'Event' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Yes', 'No', 'May be'] },
}, { timestamps: true });

rsvpSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Rsvp', rsvpSchema);