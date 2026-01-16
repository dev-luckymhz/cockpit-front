import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/licence`;

export const getAbonnementStats = () => {
  return axios.get(`${API_URL}/stats`, { withCredentials: true });
};

export const getLicences = async ({ search, sortField, sortOrder, entityId }) => {
  const params = {
    search,
    sortField,
    sortOrder,
  };
  if (entityId !== undefined) {
    params.entityId = entityId;
  }

  return axios.get(`${API_URL}`, { withCredentials: true, params  });
};