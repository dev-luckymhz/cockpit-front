import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/ion`;

export const getCustomers = (search = "") => {
  const params = {};
  if (search) {
    params.email = search;
  }

  return axios.get(`${API_URL}`, {
    params,
    withCredentials: true,
  });
};

export const getCustomerById = () => {
  return axios.get(`${API_URL}/device`, {
    withCredentials: true,
  });
};

export const getCustomerSubscriptions = () => {
  return axios.get(`${API_URL}/device/subscription`, {
    withCredentials: true,
  });
};


export const getCustomerSubscriptionsDB = () => {
  return axios.get(`${API_URL}/subscriptions/db`, {
    withCredentials: true,
  });
};