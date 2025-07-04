export const RegisterEvent = async (event, setRegisteredEvents, registerEventApi, isAuthenticated, e) => {
    e.preventDefault();
    if(!isAuthenticated) {
      alert("Please login to register for the event.");
      return;
    }
    const eventId = event._id;
    const response = await registerEventApi(event, eventId);
    if (response.status === 200) {
      alert("Registered successfully!");
      setRegisteredEvents((prev) => [...prev, eventId]);
    } else {
      alert("Registration failed!");
    }
  };
export const UnregisterEvent = async (event, setRegisteredEvents, UnregisterEventApi, isAuthenticated,e) => {
    e.preventDefault();
    if(!isAuthenticated) {
      alert("Please login to Unregister for the event.");
      return;
    }
    const eventId = event._id;
    const response = await UnregisterEventApi(eventId);
    if (response.status === 200) {
      alert("Unregistered successfully!");
      setRegisteredEvents((prev) => prev.filter((id) => id !== eventId));
    } else {
      alert("Unregistration failed!");
    }
  };