<<<<<<< HEAD
import axios from 'axios';

const BASE = 'http://localhost:5000/api/robots';

export const getRobotsConfig = () => axios.get(BASE);
export const updateRobotsConfig = (data) => axios.put(BASE, data);
=======
import axios from 'axios';

const BASE = 'https://seo-toolkit-08ge.onrender.com/api/robots';

export const getRobotsConfig = () => axios.get(BASE);
export const updateRobotsConfig = (data) => axios.put(BASE, data);
>>>>>>> 6f38cf4 (Update frontend with latest changes)
