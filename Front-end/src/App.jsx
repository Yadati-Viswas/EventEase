import { useState } from 'react'
import Login from './components/pages/login';
import SignUp from './components/pages/signup';
import About from './components/pages/about';
import Contact from './components/pages/contact';
import NewEvent from './components/pages/newEvent';
import Home from './components/Home';
import Profile from './components/pages/profile';
import AllEvents from './components/pages/allEvents';
import MyEvents from './components/pages/myEvents';
import UpdateEvent from './components/pages/updateEvent';
import RegisteredEvents from './components/pages/registeredEvents';
import { BrowserRouter , Routes, Route } from 'react-router-dom';

function App() {

  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/users/profile" element={<Profile />} />
        <Route path="/users/login" element={<Login />} />
        <Route path="/users/signup" element={<SignUp />} />
        <Route path="/users/myEvents" element={<MyEvents />} />
        <Route path="/users/registeredEvents" element={<RegisteredEvents />} />
        <Route path="/events/newEvent" element={<NewEvent />} />
        <Route path="/events/allEvents" element={<AllEvents />} />
        <Route path="/events/UpdateEvent" element={<UpdateEvent/>}/>
      </Routes>
  )
};

export default App;
