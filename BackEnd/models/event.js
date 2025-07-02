const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    event: {type: String, required: [true, 'Event is required']},
    hostName: {type: Schema.Types.ObjectId, ref: 'User'},
    place: {type: String, required: [true, 'Place is required']},
    description: {type: String, required: [true, 'Description is required']},
    startDate: {type: String, required: [true, 'Start Date is required']},
    endDate: {type: String, required: [true, 'End Date is required']},
    image: {type: String, required: [true, 'Image is required']},
    registeredUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    rsvp: [{ type: Schema.Types.ObjectId, ref: 'Rsvp' }]
}, {timestamps: true});

module.exports = mongoose.model('Event', eventSchema);