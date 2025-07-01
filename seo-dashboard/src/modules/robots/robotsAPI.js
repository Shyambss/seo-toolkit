import axios from 'axios';
const API = import.meta.env.VITE_API_BASE_URL;

const BASE = `${API}/api/robots`;

export const getRobotsConfig = () => axios.get(BASE);
export const updateRobotsConfig = (data) => axios.put(BASE, data);
