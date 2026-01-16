// services/entityService.js
import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/entity`;

export const getEntities = (search = "") => {
  const params = {};
  if (search) {
    params.search = search;
  }

  return axios.get(`${API_URL}`, {
    params,
    withCredentials: true,
  });
};