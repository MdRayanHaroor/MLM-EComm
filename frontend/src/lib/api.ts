import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isUnauthenticated =
      error.response?.status === 401 ||
      (error.response?.status === 403 &&
        (error.response?.data?.detail === 'Not authenticated' ||
         error.response?.data?.detail === 'Invalid authentication credentials' ||
         error.response?.data?.detail === 'Invalid or expired token'))

    if (isUnauthenticated) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
