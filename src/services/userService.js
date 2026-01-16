import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/user`;

export const getUsers = (filters = {}) => {
  const params = {};

  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.sortField) params.sortField = filters.sortField;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;

  return axios.get(`${API_URL}`, {
    params,
    withCredentials: true,
  });
};