import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/ticket`;

export const getTickets = (filters = {}) => {
  return axios.get(`${API_URL}/`, {
    params: {
      search: filters.search,
      sortField: filters.sortField,
      sortOrder: filters.sortOrder,
      entityId: filters.entityId,
      page: filters.page,
      limit: filters.limit,
    },
    withCredentials: true
  });
};

export const getTicketStats = () => {
  return axios.get(`${API_URL}/stats`, {
    withCredentials: true,
  });
};

export const getTicketDetails = (id) => {
  return axios.get(`${API_URL}/${id}/details`, {
    withCredentials: true,
  });
};