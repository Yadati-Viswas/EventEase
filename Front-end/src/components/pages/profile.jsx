import React, { use } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import {useAuth} from "../AuthContext";

export default function Profile() {
  const { user } = useAuth();
  console.log("User Profile:", user);
  if (!user) {
    return (
      <div className="font-sans">
        <Navbar />
        <div className="flex-grow flex items-center justify-center bg-[#dcdcdc] min-h-screen">
          <p className="text-gray-500">Loading user details...</p>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className="font-sans">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-[#dcdcdc] min-h-screen overflow-hidden">
        <div className="w-full max-w-md bg-gray-100 p-8 rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-black text-center">My Profile</h2>
          <p><strong>First Name: </strong> {user.firstName}</p>
          <p><strong>Last Name: </strong> {user.lastName}</p>
          <p><strong>Email Address: </strong> {user.email}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}