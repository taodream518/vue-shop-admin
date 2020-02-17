import axios from "axios";
import qs from "qs";
import iview from "iview";
import Storage from "../store/storage";
import Routers from "../router";

axios.defaults.baseURL = "http://api.okey.net.cn/admin/";
axios.defaults.timeout = 50000;
axios.defaults.headers["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";

// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    let token = Storage.sessionGet("token");

    if (config.method == "post") {
      if (!config.data) {
        config.data = {};
      }

      if (token) {
        config.data["token"] = token;
      }

      config.data = qs.stringify(config.data);
    } else if (config.method == "get") {
      if (token) {
        config.params["token"] = token;
      }
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  res => {
    if (typeof res.data == "string") {
      alert(res.data);
      return false;
    }

    switch (res.data.ret) {
      case 200:
        if (res.data.data.token) {
          Storage.sessionSet("token", res.data.data.token);
        }
        return res.data.data;
      case 300:
        Storage.sessionRemove("token");
        Routers.push("/login");
        // 重定向
        break;
      default:
        iview.Message.error(res.data.msg);
        return false;
    }
  },
  error => {
    return Promise.reject(error);
  }
);

export default axios;
