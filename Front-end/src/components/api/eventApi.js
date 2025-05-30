import axios from 'axios';

const baseURL = 'http://localhost:3000';

const dockerURL = 'http://backend-service:3000';

const deploymentURL = 'https://eventease-lmt5.onrender.com';

async function callAPI(method, endpoint, data = null, isAuthRequired = false, extraHeaders = {}) {
  
  const url = `${deploymentURL}${endpoint}`;
  const defaultHeaders = { 'Content-Type': 'application/json', };
  const token = localStorage.getItem('token');
  const authHeaders = isAuthRequired && token ? { Authorization: `Bearer ${token}` } : {};
  const headers = { ...defaultHeaders, ...extraHeaders, ...authHeaders };
  const config = { method, url, headers,  ...(data && { data: data }),  withCredentials: true,};
  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

async function checkSessionApi() {
  return callAPI('GET', '/users/check-session', null, true);
}

async function allEventsApi() {
  return callAPI('GET', '/events/all', null, true);
}

async function myEventsApi() {
  return callAPI('GET', '/users/myEvents', null, true);
}

async function logoutApi() {
  return callAPI('GET', '/users/logout', null, true);
}

async function getRegisteredEventsApi() {
  return callAPI('GET', '/events/registered-events', null, true);
}

async function registerEventApi(event, eventId) {
  return callAPI('POST', `/events/register/${eventId}`, event, true);
}

async function loginApi(userData) {
  return callAPI('POST', '/users/login', userData);
}

async function signupApi(userData) {
  return callAPI('POST', '/users/signup', userData);
}

async function deleteEventApi(eventId) {
  return callAPI('POST', `/events/delete/${eventId}`, null, true);
}

async function addEventApi(formData) {
  return callAPI('POST', '/events/newEvent', formData, true, { 'Content-Type': 'multipart/form-data' });
}

async function updateEventApi(formData, eventId) {
  return callAPI('POST', `/events/updateEvent/${eventId}`, formData, true, { 'Content-Type': 'multipart/form-data' });
}

async function postGoogleApi(token) {
  return callAPI('POST', '/users/google-login', { token });
}

async function sendOtpApi(email) {
  return callAPI('POST', '/send-otp', { email });
}

async function verifyOtpApi(email, otp) {
  return callAPI('POST', '/verify-otp', { email, otp });
}

async function resetPasswordApi(email, newPassword) {
  return callAPI('POST', '/users/reset-password', { email, newPassword });
}

export { checkSessionApi, allEventsApi, myEventsApi, logoutApi, getRegisteredEventsApi, 
  registerEventApi, loginApi, signupApi, deleteEventApi, addEventApi, updateEventApi, 
  postGoogleApi, sendOtpApi, verifyOtpApi, resetPasswordApi };