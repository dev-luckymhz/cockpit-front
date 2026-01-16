import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/user`;

export const AuthService = {
  checkSession: async () => {
    try {
      const res = await axios.get(`${API_URL}/profile`, { withCredentials: true });
      return res.status === 200;
    } catch {
      return false;
    }
  },

  login: (username, password) => {
    try {

      console.log(API_URL);
      
      return axios.post(`${API_URL}/login`, { email: username, password }, {
        withCredentials: true,
      });
    } catch {
      return false;
    }
  },

  getProfile: async () => {
    try {
      const res = await axios.get(`${API_URL}/profile`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.error("Erreur lors de la récupération du profil :", err);
      throw err;
    }
  },

  createUser: async (userData) => {
    return axios.post(`${API_URL}/register`, userData, {
      withCredentials: true,
    });
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout failed', err);
    }
  },
};