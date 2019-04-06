import axios, {
  AxiosRequestConfig,
  AxiosPromise,
  AxiosInstance,
  AxiosResponse
} from "axios";
import { Constants } from "../config/constants";
import { localService } from "./local";

export class LoginService {
  axiosIns: AxiosInstance;
  private consts;
  private static _instance: LoginService;

  static createInstance() {
    LoginService.getInstance();
  }
  static getInstance() {
    return this._instance || (this._instance = new this());
  }

  authenticated: boolean = false;
  user = {
    token: null,
    data: null,
    authenticated: false
  };

  constructor() {
    this.consts = new Constants();
    this.axiosIns = axios.create({
      baseURL: this.consts.API_BASE,
      timeout: 10000
    });
  }

  login(data, options = {}) {
    if (!data) {
      return Promise.reject(Error("Invalid Email"));
    }
    if (!data.email) {
      return Promise.reject(Error("Invalid Email"));
    }
    if (!data.password) {
      return Promise.reject(Error("Invalid password"));
    }
    let loginData = {
      email: data.email,
      password: data.password
    };
    let loginUrl = this.consts.API_HOST + this.consts.API_URLS.login.url;
    return this.axiosIns.post(loginUrl, loginData).then(res => {
      // console.log(res);
      if (!res.data) {
        return Promise.reject(Error("An unknown error occured"));
      }
      let data = res.data;
      this.user.token = data.token;
      this.user.data = { ...data.user };
      localStorage.setItem("user_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      this.user.authenticated = true;

      // window.location.reload();
      return res.data;
    });
  }

  setUserData(user) {
    this.user.data = { ...user };
    localService.setUser({ ...user });
  }
  /* updateUserData(userData) {
    // Will Be used in case of profile Update
    for (let key in this.user.data) {
      if (this.user.data.hasOwnProperty(key) && userData.hasOwnProperty(key)) {
        this.user.data[key] = userData[key];
      }
    }
    localService.setUser({...this.user.data});
  } */
  signup(data, options = {}) {
    if (!data) {
      return Promise.reject(Error("Invalid Email"));
    }
    if (!data.email) {
      return Promise.reject(Error("Invalid Email"));
    }
    if (!data.password) {
      return Promise.reject(Error("Invalid password"));
    }
    if (!data.name) {
      return Promise.reject(Error("Name is required"));
    }
    let signupData = {
      email: data.email,
      password: data.password,
      name: data.name,
      pet_name: data.pet_name
    };
    let signupUrl = this.consts.API_HOST + this.consts.API_URLS.signup.url;
    return this.axiosIns.post(signupUrl, signupData).then(res => {
      // console.log(res);
      if (!res.data) {
        return Promise.reject(Error("An unknown error occured"));
      }
      return res.data;
    });
  }
  checkLogin() {
    let token = localStorage.getItem("user_token");
    // // console.log("I have been called");
    /* 
        this.user.authenticated = true;
        this.user.token = "Bello";
        this.user.data = {
            a:"a",
            b:"b"
        }
        // console.log("I have been called"); */

    if (token) {
      this.user.authenticated = true;
      this.user.token = token;
      // Check authenticity of this token from server asyncronously.
      let url = this.consts.API_HOST + this.consts.API_URLS.check_auth.url;
      let headers = {
        Authorization: this.getAuthHeader()
      };
      this.axiosIns
        .post(url, {}, { headers })
        .then(res => {
          if (res && res.data && res.data._id) {
            this.user.data = { ...res.data };
            this.setUserData(this.user.data);
          } else {
            // User not authenticated or something else is unexpectedly wrong
            // Logout user
            this.user.authenticated = false;
            this.user.token = null;
            this.user.data = null;
            // Also Delete User Token from local Database
            localStorage.removeItem("user_token");
            localStorage.removeItem("user");
          }
        })
        .catch(err => {
          this.user.authenticated = false;
          this.user.token = null;
          this.user.data = null;
          // // console.log(err);
          // // console.log(err.request);
          // // console.log(err.response);
          if (err.response && err.response.status === 401) {
            // Delete User Token from local storage as well
            localStorage.removeItem("user_token");
            localStorage.removeItem("user");
          }
        });

      try {
        this.user.data = localService.getUser();
        if (this.user.data) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        this.user.authenticated = false;
        this.user.data = null;
        this.user.token = null;
        return false;
      }
    } else {
      this.user.authenticated = false;
      this.user.token = null;
      this.user.data = null;
      return false;
    }
  }

  fbLogin(accessToken) {
    let url = this.consts.API_HOST + this.consts.API_URLS.fb_login.url;
    let data = {
      accessToken: accessToken
    };
    return this.axiosIns.post(url, data).then(res => {
      // console.log(res);
      if (!res.data) {
        return Promise.reject(Error("An unknown error occured"));
      }
      let data = res.data;
      this.user.token = data.token;
      this.user.data = { ...data.user };
      localStorage.setItem("user_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      this.user.authenticated = true;

      // window.location.reload();
      return res.data;
    });
  }

  getAuthHeader() {
    return "Bearer " + localStorage.getItem("user_token");
  }
  getUserData() {
    return this.user.data;
  }
  logout() {
    // Do other calls
    // Then remove token from storage
    localStorage.removeItem("user_token");
    localStorage.removeItem("user");
    this.user = {
      authenticated: false,
      token: null,
      data: null
    };
    // window.location.reload();
    return true;
  }
}
