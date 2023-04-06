import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";

// axios.get(url, config...) 같은 axios 메서드를 편하게 사용하기 위한 함수
const fetcher = async (method, url, ...rest) => {
  const res = await axios[method](url, ...rest);
  return res.data;
};

export default fetcher;
