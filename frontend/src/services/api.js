import axios from 'axios'

const API = axios.create({ baseURL: '/api' })

export const analyzeProfile = (username) => API.get(`/profiles/analyze/${username}`)
export const getAllProfiles = (params) => API.get('/profiles', { params })
export const getProfile = (username) => API.get(`/profiles/${username}`)
export const deleteProfile = (username) => API.delete(`/profiles/${username}`)
