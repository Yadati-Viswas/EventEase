import React, { createContext, useContext, useState,useEffect } from 'react';
import { getRegisteredEventsApi } from '../components/api/eventApi';

const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  useEffect(() => {
    getRegisteredEvents();
  }, []);
  const getRegisteredEvents = async () => {
      const response = await getRegisteredEventsApi();
      if (response.status === 200 || response.status === 304) {
        setRegisteredEvents(response.data.data);
      } else {
        alert(response.message);
      }
  };
  return (
    <EventsContext.Provider value={{ registeredEvents, setRegisteredEvents, getRegisteredEvents }}>
      {children}
    </EventsContext.Provider>
  );
};

// This export must be outside the component, at the top level:
export const useEvents = () => useContext(EventsContext);