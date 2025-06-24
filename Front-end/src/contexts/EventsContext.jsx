import React, { createContext, useContext, useState,useEffect } from 'react';
import { getRegisteredEventsApi } from '../components/api/eventApi';

const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  useEffect(() => {
    const getRegisteredEvents = async () => {
      const response = await getRegisteredEventsApi();
      if (response.status === 200 || response.status === 304) {
        setRegisteredEvents(response.data.data.map(event => event._id));
      } else {
        alert(response.message);
      }
    };
    getRegisteredEvents();
  }, []);
  return (
    <EventsContext.Provider value={{ registeredEvents, setRegisteredEvents }}>
      {children}
    </EventsContext.Provider>
  );
};

// This export must be outside the component, at the top level:
export const useEvents = () => useContext(EventsContext);