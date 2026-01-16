import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/eset`;

export const getDeviceGroups = () => {
  return axios.get(`${API_URL}/device-groups/filtered`, {
    withCredentials: true,
  });
};

export const getDevicesByGroup = () => {
  return axios.get(`${API_URL}/device-groups/devices`, {
    withCredentials: true,
  });
};

export const getDevice = (deviceId) => {
  return axios.get(`${API_URL}/devices/${deviceId}`, {
    withCredentials: true,
  });
};

export const getComponentStatsByGroup = () => {
  return axios.get(`${API_URL}/device-groups/component-stats`, {
    withCredentials: true,
  });
};