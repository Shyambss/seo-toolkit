// src/modules/OpenGraph/api.js
import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL;

const BASE_URL = `${API}/api/og-tags`;

export const fetchAllOgTags = async () => axios.get(`${BASE_URL}/get`);
export const fetchOgTagByUrl = async (page_url) =>
  axios.get(`${BASE_URL}/get`, { params: { page_url } });
export const createOgTag = async (data) => axios.post(`${BASE_URL}/add`, data);
export const updateOgTag = async (data) => axios.put(`${BASE_URL}/update`, data);
export const deleteOgTag = async (page_url) =>
  axios.delete(`${BASE_URL}/delete`, { data: { page_url } });
