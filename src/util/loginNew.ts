import axios, { AxiosRequestConfig, AxiosPromise, AxiosInstance,AxiosResponse } from 'axios';
import {Constants} from "../config/constants";

export default{
    user : {
        token: null,
        data: null,
        authenticated:false
    },
    // ARIHANT - Doubt about the following code- 
    // Dont want to create new Constants() every time i have to use the service
    // how to use this.consts instead of new Constants() every time
    consts: new Constants(),
    axiosIns: axios.create({
            baseURL:(new Constants()).API_BASE,
            timeout: 10000,
    }),

    login(data, options = {}){
        if(!data)
            {return Promise.reject(Error("Invalid Email"));}
        if(!data.email)
            {return Promise.reject(Error("Invalid Email"));}
        if(!data.password){
            return Promise.reject(Error("Invalid password"))
        }
        let loginData = {
            email: data.email,
            password: data.password
        }
        let loginUrl = this.consts.API_HOST + this.consts.API_URLS.login.url
        return this.axiosIns.post(loginUrl, loginData).then(res=>{
            // console.log(res);
            if(!res.data){
                return Promise.reject(Error("An unknown error occured"));
            }
            let data = res.data;
            this.user.authenticated = true;
            this.user.token = data.token;
            this.user.data = {...data.data};
            localStorage.setItem("user_token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            // window.location.reload();
            return res.data;
        }).catch(err=>{
            // console.log(err);
            return Promise.reject(err);
        });

    },
    checkLogin(){
        let token = localStorage.getItem("user_token");
        // console.log("I have been called");
        /* 
        this.user.authenticated = true;
        this.user.token = "Bello";
        this.user.data = {
            a:"a",
            b:"b"
        }
        // console.log("I have been called"); */
        
        
        if(token){
            this.user.authenticated = true;
            this.user.token = token;
            try{
                this.user.data = JSON.parse(localStorage.getItem("user"));
                return true;
            }catch(err){
                this.user.authenticated = false;
                this.user.data = null;
                this.user.token = null;
                return false;
            }
        }else{
            this.user.authenticated = false;
            this.user.token = null;
            this.user.data = null;
            return false;
        }
       
    },
    getAuthHeader(){
        return "Bearer "+ localStorage.getItem("user_token");
    },
    logout(){
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




