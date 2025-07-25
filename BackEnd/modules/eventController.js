const fs = require('fs');
const path = require('path');
const Event = require('../models/event');
const Rsvp = require('../models/rsvp');
const User = require('../models/user');
const mailSender = require('../utils/mailSender');
const { fileDelete } = require('../middleware/fileUpload');
const { DateTime } = require('luxon');

exports.createEvent = (req, res) => {
    let newEvent = new Event(req.body);
    console.log("New File name:", req.file.filename," Original Name:", req.file.originalname);
    newEvent.image = req.file.originalname;
    newEvent.hostName = req.user.userId;
    newEvent = convertDateTime(req.body.startDate, req.body.endDate, newEvent);
    newEvent.save().then(() => {
        sendEmailNotification(req.user.email, "Event Created Successfully", `Your event "${newEvent.event}" has been created successfully.`).then(() => {
            res.status(200).json({
                status: 'success',
                message: 'Event created successfully',
                data: newEvent,
            });
        }).catch(err => {
            res.status(500).json({
                status: 'fail',
                message: 'Error sending email notification',
            });
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
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            event.startDateFormatted = DateTime.fromJSDate(start).toFormat('MM-dd-yyyy hh:mm a');
            event.endDateFormatted = DateTime.fromJSDate(end).toFormat('MM-dd-yyyy hh:mm a');
            event.image = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${event.image}`;
        });
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
            sendEmailNotification(req.user.email, "Event Registered Successfully", `Your event "${event.event}" has been Registered successfully.`).then(() => {
                res.status(200).json({
                    status: 'success',
                    message: 'User registered for the event successfully',
                    data: event,
                });
            }).catch(err => {
            res.status(500).json({
                status: 'fail',
                message: 'Error sending email notification',
            });
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
            sendEmailNotification(req.user.email, "Event Un-Registered Successfully", `Your event "${event.event}" has been Un-Registered successfully.`).then(() => {
                res.status(200).json({
                    status: 'success',
                    message: 'User unregistered from the event successfully',
                });
            }).catch(err => {
                res.status(500).json({
                    status: 'fail',
                    message: 'Error sending email notification',
                });
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
        sendEmailNotification(req.user.email, "Event Deleted Successfully", `Your event "${event.event}" has been deleted successfully.`).then(() => {
            const registeredUsers = event.registeredUsers;
            registeredUsers.forEach(userId => {
                User.findById(userId).then(user => {
                    if (user) {
                        sendEmailNotification(user.email, "Event Deleted Notification", `The event "${event.event}" you registered for has been deleted.`).catch(err => {
                            console.error(`Error sending email to ${user.email}:`, err);
                        });
                    }
                }).catch(err => {
                    console.error(`Error finding user with ID ${userId}:`, err);
                });
            });
            fileDelete(event);
            res.status(200).json({
                status: 'success',
                message: 'Event deleted successfully',
                data: event,
            });
        }).catch(err => {
            res.status(500).json({
                status: 'fail',
                message: 'Error sending email notification',
            });
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
    Event.find({registeredUsers: userId}).lean().then((events) => {
        if (events.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'No registered events found',
            });
        }
        events.forEach(event => {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            event.startDateFormatted = DateTime.fromJSDate(start).toFormat('MM-dd-yyyy hh:mm a');
            event.endDateFormatted = DateTime.fromJSDate(end).toFormat('MM-dd-yyyy hh:mm a');
            event.image = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${event.image}`;
            console.log("Event:", event);
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
        event.place = req.body.place || event.place;
        event.description = req.body.description || event.description;
        event = convertDateTime(req.body.startDate || event.startDate, req.body.endDate || event.endDate, event);
        console.log("Updated Event:", event);
        event.save().then(() => {
            sendEmailNotification(req.user.email, "Event Updated Successfully", `Your event "${event.event}" has been updated successfully.`).then(() => {
            const registeredUsers = event.registeredUsers;
            registeredUsers.forEach(userId => {
                User.findById(userId).then(user => {
                    if (user) {
                        sendEmailNotification(user.email, "Event Update Notification", `The event "${event.event}" you registered for has been updated by the event organizer.`).catch(err => {
                            console.error(`Error sending email to ${user.email}:`, err);
                        });
                    }
                }).catch(err => {
                    console.error(`Error finding user with ID ${userId}:`, err);
                });
            });
            res.status(200).json({
                status: 'success',
                message: 'Event updated successfully',
                data: event,
            });
            }).catch(err => {
                res.status(500).json({
                    status: 'fail',
                    message: 'Error sending email notification',
                });
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
        sendEmailNotification(req.user.email, "RSVP Updated Successfully", `Your RSVP for the event has been updated to "${status}".`).then(() => {
            const event = rsvpDetails.event;
            User.findById(event.hostName).then(user => {
                if (user) {
                    sendEmailNotification(user.email, "RSVP Notification", `User ${req.user.firstName} ${req.user.lastName} has updated their RSVP status to "${status}" for the event "${event.event}".`).catch(err => {
                        console.error(`Error sending email to ${user.email}:`, err);
                    });
                }
            }).catch(err => {
                console.error(`Error finding user with ID ${event.hostName}:`, err);
            });
        }).catch(err => {
            res.status(500).json({
                status: 'fail',
                message: 'Error sending email notification',
            });
        });
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

async function sendEmailNotification(email, title, body) {
  try {
    const mailResponse = await mailSender(email, title, body);
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

const convertDateTime = (startDate, endDate, eventDetails) => {
    let startDateISO = startDate.includes('Z') ? startDate : `${startDate}:00Z`;
    let endDateISO = endDate.includes('Z') ? endDate : `${endDate}:00Z`;
    eventDetails.startDate = DateTime.fromISO(startDateISO).toJSDate();
    eventDetails.endDate = DateTime.fromISO(endDateISO).toJSDate();
    return eventDetails;
};