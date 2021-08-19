import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:80/backend",
});
export default instance;
