import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const getSidebarItems = async () => {
  const response = await axios.get(`${API_URL}/api/common/sidebar`, {
    withCredentials: true,
  });
  return response.data.menu;
};
