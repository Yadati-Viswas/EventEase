const fs = require('fs');
const path = require('path');
const Event = require('../models/event');
const Rsvp = require('../models/rsvp');
const User = require('../models/user');

exports.createEvent = (req, res) => {
    let newEvent = new Event(req.body);
    console.log("New File name:", req.file.filename," Original Name:", req.file.originalname);
    newEvent.image = req.file.originalname;
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
    Event.find().lean().then(async (events) => {
        let userDetails = null;
        if (events.length > 0) {
            userDetails = await User.findById(events[0].hostName).lean();
        }
        const updatedEvents = await Promise.all(events.map(async (event) => {
        const user = await User.findById(event.hostName).lean();
        return {
            ...event,
            organizer: user ? user.firstName + " " + user.lastName : "Unknown Host"
        };
        }));
        updatedEvents.forEach(event => {
            event.image = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${event.image}`;
        });
        console.log("Updated Events:", updatedEvents);
        res.status(200).json({
            status: 'success',
            message: 'Events retrieved successfully',
            data: updatedEvents ,
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
        if (events.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'No registered events found',
            });
        }
        events.forEach(event => {
            event.image = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${event.image}`;
        });
        res.status(200).json({
            status: 'success',
            message: 'Registered events retrieved successfully',
            data: events,
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
            event.image = req.file.originalname;
        }
        event.event = req.body.event || event.event;
        event.date = req.body.date || event.date;
        event.place = req.body.place || event.place;
        event.description = req.body.description || event.description;
        event.startTime = req.body.startTime || event.startTime;
        event.endTime = req.body.endTime || event.endTime;
        console.log("Updated Event:", event);
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

exports.sendRsvp = (req, res) => {
    const eventId = req.params.id;
    const status = req.body.rsvp;
    const userId = req.user.userId;

    Rsvp.findOneAndUpdate({ event: eventId, user: userId }, { $set: { event: eventId, user: userId, status: status } },
        { upsert: true, new: true }).then(rsvpDetails => {
        //console.log(rsvpDetails);
        Event.findByIdAndUpdate(eventId, { $addToSet: { rsvp: rsvpDetails._id } }).then(() => {
        return res.status(200).json({
            status: 'success',
            message: 'RSVP Updated Successfully',
            data: rsvpDetails,
        });
    }).catch(err => {
        if( err.name === 'ValidationError') {
            err.status = 400;
        }
        console.log(err.message); 
        next(err); 
    })
    }).catch(err => {
        if( err.name === 'ValidationError') {
            err.status = 400;
        }
        console.log(err.message); 
        next(err); 
    });
}

exports.getRsvp = (req, res) => {
    const eventId = req.params.id;
    Rsvp.countDocuments({ event: eventId, status:"Yes" }).then(countRsvp => {
        console.log("RSVP Count:", countRsvp);
        res.status(200).json({
            status: 'success',
            message: 'RSVP count retrieved successfully',
            data: { countRsvp },
        });
    }).catch(err => {
        if( err.name === 'ValidationError') {
            err.status = 400;
        }
        console.log(err.message); 
        next(err); 
    });
}