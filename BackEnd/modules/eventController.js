const fs = require('fs');
const path = require('path');
const Event = require('../models/event');

exports.createEvent = (req, res) => {
    let newEvent = new Event(req.body);
    newEvent.image = req.file.filename;
    newEvent.hostName = req.user.userId;
    newEvent.save().then(() => {
        res.status(200).json({
            status: 'success',
            message: 'Event created successfully',
            data: newEvent,
        });
    }).catch(err => {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    });
}

exports.getAllEvents = (req, res) => {
    Event.find().then((events) => {
        const eventswithImage = this.findeventImages(events);
        res.status(200).json({
            status: 'success',
            message: 'Events retrieved successfully',
            data: eventswithImage,
        });
    }).catch(err => {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    });
}

exports.registerEvent = (req, res) => {
    const eventId = req.params.id;
    const userId = req.user.userId;
    console.log("User ID:", userId);
    Event.findById(eventId).then((event) => {
        if (!event) {
            return res.status(404).json({
                status: 'fail',
                message: 'Event not found',
            });
        }
        if (event.registeredUsers.includes(userId)) {
            return res.status(400).json({
                status: 'fail',
                message: 'User already registered for this event',
            });
        }
        
        event.registeredUsers.push(userId);
        event.save().then(() => {
            res.status(200).json({
                status: 'success',
                message: 'User registered for the event successfully',
                data: event,
            });
        }).catch(err => {
            res.status(400).json({
                status: 'fail',
                message: err.message,
            });
        });
    }).catch(err => {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    });
}

exports.UnregisterEvent = (req, res) => {
    const eventId = req.params.id;
    const userId = req.user.userId;
    Event.findById(eventId).then((event) => {
        if(!event) {
            res.status(404).json({
                status: 'fail',
                message: 'Event not found',
            });
        }
        if (!event.registeredUsers.includes(userId)) {
            return res.status(400).json({
                status: 'fail',
                message: 'User not registered for this event',
            });
        }
        event.registeredUsers = event.registeredUsers.filter(id => id.toString() !== userId);
        event.save().then(()=> {
            res.status(200).json({
                status: 'success',
                message: 'User unregistered from the event successfully',
            });
        }).catch(err => {
            res.status(400).json({
                status: 'fail',
                message: err.message,
            });
        });
    });
}

exports.deleteEvent = (req, res) => {
    const eventId = req.params.id;
    Event.findByIdAndDelete(eventId).then((event) => {
        if (!event) {
            return res.status(404).json({
                status: 'fail',
                message: 'Event not found',
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Event deleted successfully',
            data: event,
        });
    }).catch(err => {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    });
}

exports.getRegisteredEvents = (req, res) => {
    const userId = req.user.userId;
    console.log("User ID:", userId);
    if (!userId) {
        return res.status(401).json({
            status: 'fail',
            message: 'User not logged in',
        });
    }
    Event.find({registeredUsers: userId}).then((events) => {
        const eventswithImage = this.findeventImages(events);
        if (events.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'No registered events found',
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Registered events retrieved successfully',
            data: eventswithImage,
        });
    }).catch(err => {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    });
};

exports.updateEvent = (req, res) => {
    const eventId = req.params.id;
    Event.findById(eventId).then((event) => {
        if (!event) {
            return res.status(404).json({
                status: 'fail',
                message: 'Event not found',
            });
        }
        if (req.file) {
            event.image = req.file.filename;
        }
        event.event = req.body.event || event.event;
        event.date = req.body.date || event.date;
        event.place = req.body.place || event.place;
        event.description = req.body.description || event.description;
        event.startTime = req.body.startTime || event.startTime;
        event.endTime = req.body.endTime || event.endTime;
        
        event.save().then(() => {
            res.status(200).json({
                status: 'success',
                message: 'Event updated successfully',
                data: event,
            });
        }).catch(err => {
            res.status(400).json({
                status: 'fail',
                message: err.message,
            });
        });
    }).catch(err => {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    });
}

exports.findeventImages = function findeventImages(events){
    events.map((event) => {
        const imagePath = path.join(__dirname, '../public/images', event.image);
        let imageData = null;
        try {
            imageData = fs.readFileSync(imagePath, { encoding: 'base64' });
        } catch (err) {
            console.error(`Error reading image file for event ${event._id}:`, err.message);
        }
        event.image= imageData;
        return event;
    });
    return events;
}