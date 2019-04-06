import { Component, Vue, Watch } from 'vue-property-decorator';
import VueRouter, { Location, Route, RouteConfig } from 'vue-router';


import './signup.scss';
import { DataService } from '../../util/data';
import { LoginService } from '../../util/login';
import { showAlert } from "../../util/alerts.service";
// import { utilities } from "../../util/utilities";





@Component({
    template: require('./signup.html'),
    name:"signup"
})
export class SignupComponent extends Vue {
    dataService = new DataService();
    // loginService = new LoginService();
    loginService: LoginService = LoginService.getInstance();
    loggingIn = false;
    user_creds = {};
    error = null;
    successSignup = false;
    title = "Register | My App";
    description = "Register with My App";


    constructor(){
        super();
        this.user_creds = {}
        this.successSignup = false;
    }
    created(){
        // // console.log(this.loginService.user.token);
    }
    submit(){
        let data:any = {...this.user_creds};
        // // console.log(data);
        
        if(!data.name){
            this.error = "Please give your name";
            return;
        }
        if(!data.email || !this.validateEmail(data.email)){
            this.error = "Uh-Oh! Email doesn't look right, please check again";
            return;
        }
        if(!data.password){
            this.error = "Seriously! Without password ?";
            return;
        }
        if(data.password.length < 8 ){
            this.error = "Aww, Your password is cute and small. Can you keep it atleast 8 characters long?"
            return;
        }
        this.loggingIn = true;
        this.loginService.signup(data).then(data=>{
            this.loggingIn = false;
            if(data.success){
                this.successSignup = true;
            }
            return;

            /* 
            this.loggingIn = false;
            // console.log(data);
            let redirectPath = this.$route.query.redirect ? this.$route.query.redirect : "/";
            this.$router.replace(redirectPath); 
            */
        }).catch(err=>{
            this.loggingIn = false;
            // // console.log(err);
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                // // console.log(err.response.data);
                // // console.log(err.response.status);
                // // console.log(err.response.headers);
                showAlert({
                    title: "Oops!",
                    text:typeof err.response.data.message == "string" ? err.response.data.message : "Unknown error, please try again",
                    icon:"error"
                })
              } else if (err.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                showAlert({
                    title: "Oops!",
                    text:"Unknown error, please try again",
                    icon:"error"
                });
              } else {
                // Something happened in setting up the request that triggered an Error
                showAlert({
                    title: "Oops!",
                    text:"Unknown error, please try again",
                    icon:"error"
                });
              }
        });
    }
    fieldKeyupEvent($event){
        this.error = null;
    }


    validateEmail(value){
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

        if (reg.test(value) == false) 
        {
            return false;
        }

        return true;

    }
    
}