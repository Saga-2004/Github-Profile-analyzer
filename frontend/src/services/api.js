import axios from 'axios'

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || '/api'
})

export const analyzeProfile = (username) => API.get(`/api/profiles/analyze/${username}`)
export const getAllProfiles = (params) => API.get('/api/profiles', { params })
export const getProfile = (username) => API.get(`/api/profiles/${username}`)
export const deleteProfile = (username) => API.delete(`/api/profiles/${username}`)