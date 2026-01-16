import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/assets`;

export const getComputers = (filters = {}) => {
  const params = {};

  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.sortField) params.sortField = filters.sortField;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;
  if (filters.entityId && filters.entityId !== "0") params.entityId = filters.entityId;

  return axios.get(`${API_URL}/computers`, {
    params,
    withCredentials: true,
  });
};

export const getComputersStats = () => {
  return axios.get(`${API_URL}/computers/count`, {
    withCredentials: true,
  });
};

export const getPrinters = (filters = {}) => {
  const params  = {};

  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.sortField) params.sortField = filters.sortField;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;
  if (filters.entityId && filters.entityId !== "0") params.entityId = filters.entityId;

  return axios.get(`${API_URL}/printers`, {
    params,
    withCredentials: true,
  });
};

export const getPrintersStats = () => {
  return axios.get(`${API_URL}/printers/count`, {
    withCredentials: true,
  });
};

export const getSoftware = (filters = {}) => {
  const params = {};

  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.sortField) params.sortField = filters.sortField;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;
  if (filters.entityId && filters.entityId !== "0") params.entityId = filters.entityId;

  return axios.get(`${API_URL}/software`, {
    params,
    withCredentials: true,
  });
};

export const getSoftwareStats = () => {
  return axios.get(`${API_URL}/software/count`, {
    withCredentials: true,
  });
};