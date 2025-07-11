import axios from 'axios';

const API_BASE_URL = 'https://api.sarkhanrahimli.dev';

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
