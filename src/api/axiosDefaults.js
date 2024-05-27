import axios from "axios";

// Setting up default configurations for axios
axios.defaults.baseURL = "https://travelers-tails-api-d0dd6ea40a9c.herokuapp.com";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

// Creating axios instances for making requests
export const axiosReq = axios.create();
export const axiosRes = axios.create();