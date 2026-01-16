import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/inventory`;

export const getComputers = () => axios.get(`${API_URL}/computers`, {
    withCredentials: true,
});

export const getPrinters = () => axios.get(`${API_URL}/printers`, {
    withCredentials: true,
});

export const getServers = () =>
  axios.get(`${API_URL}/servers`, { withCredentials: true })

export const getMergedDevices = () =>
  axios.get(`${API_URL}/all`, { withCredentials: true });