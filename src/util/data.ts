import axios, { AxiosRequestConfig, AxiosPromise, AxiosInstance,AxiosResponse } from 'axios';
import {Constants} from "../config/constants";
import {LoginService}  from './login';
import { showAlert, stopSwalLoading, closeSwal } from '../util/alerts.service';


export class DataService{
    axiosIns:AxiosInstance;
    private consts;
    loginService: LoginService;
    constructor(){
        this.consts = new Constants();
        this.axiosIns = axios.create({
            baseURL:this.consts.API_BASE,
            timeout: 10000,
        });
        this.loginService = LoginService.getInstance();
        // // console.log("DataService Called Now");
        // if(this.loginService.user.authenticated){
        //      // Alter defaults after instance has been created
        //     this.axiosIns.defaults.headers.common['Authorization'] = this.loginService.getAuthHeader();
        // }
    }
    
    public callService = (key, payload = {}, options:any={}):Promise<AxiosResponse> =>{
        let {url, method} = this.consts.API_URLS[key];
        if(!url || !method){
            return Promise.reject("Invalid Service Call");
        }
        if(method==="GET"){
            return this.getData(url,payload, options).then(res=>{
                return res;
            }).catch(err=>{
                // // console.log(err);
                if(err.response){

                    if(!options.dont_handle_error){
                        showAlert({
                            title:"Oops!",
                            text: typeof err.response.data.message == "string" ? err.response.data.message : "Unknown error, please try again",
                            icon: "error"
                        });
                    }
                    if(err.response.status == 401){
                        // relogin is required , Logout here
                        this.loginService.logout();
                    }

                    throw err.response;
                }else{
                    throw {data: {message: "Unknown Error Occured"}};
                }
                // throw err;
            })
        }else{
            return this.postData(url,payload, options).then(res=>{
                return res;
            }).catch(err=>{
                // // console.log(err);
                if(err.response){
                    // console.log(err.response);
                    if(!options.dont_handle_error){
                        showAlert({
                            title:"Oops!",
                            text: typeof err.response.data.message == "string" ? err.response.data.message : "Unknown error, please try again",
                            icon: "error"
                        });
                    }

                    if(err.response.status == 401){
                        // relogin is required , Logout here
                        this.loginService.logout();
                    }
                    throw err.response;
                }else{
                    throw {data: {message: "Unknown Error Occured"}};
                }
                // throw err;
            })
        }
    }

    getData = (url , params = {} , options = {}):Promise<AxiosResponse> =>{
        let headers = {};
        if(this.loginService.user.authenticated){
            headers["Authorization"] = this.loginService.getAuthHeader();
        }
        return this.axiosIns.request({
            method:"GET",
            url,
            params,
            headers
        });
    }

    postData = (url:string, data = {}, options = {}):Promise<AxiosResponse> =>{
        let headers = {};
        if(this.loginService.user.authenticated){
            headers["Authorization"] = this.loginService.getAuthHeader();
        }
        return this.axiosIns.request({
            method:"POST",
            url,
            data,
            headers
        })
    }

}




