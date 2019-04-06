import { Component, Vue } from 'vue-property-decorator';
import VueRouter, { Location, Route, RouteConfig } from 'vue-router';


import './login.scss';
import { DataService } from '../../util/data';
import { LoginService } from '../../util/login';
import { showAlert } from "../../util/alerts.service";




@Component({
    template: require('./login.html'),
    name:"login"
})
export class LoginComponent extends Vue {
    dataService = new DataService();
    // loginService = new LoginService();
    loginService: LoginService = LoginService.getInstance();
    loggingIn = false;

    user_creds = {};
    error = null;
    title = "Login | My App"
    description = "Login to My App";


    constructor(){
        super();
        this.user_creds = {}
    }
    created(){
        // // console.log(this.loginService.user.token);
    }
    submit(){
        let data:any = {...this.user_creds};
        if(!data.email || !this.validateEmail(data.email)){
            this.error = "Uh-Oh! Email doesn't look right, please check again";
            return;
        }
        if(!data.password){
            this.error = "Seriously! Without password ?";
            return;
        }
        this.loggingIn = true;
        this.loginService.login(data).then(data=>{
            // console.log(data);
            this.loggingIn = false;
            let redirectPath = this.$route.query.redirect ? this.$route.query.redirect : "/read-public-diaries";
            this.$router.replace(redirectPath);
        }).catch(err=>{
            // console.log(err);
            this.loggingIn = false;
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                // // console.log(err.response.data);
                // // console.log(err.response.status);
                // // console.log(err.response.headers);
                showAlert({
                    title: "Oops!",
                    text:err.response.data.message || "Unknown error, please try again",
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
    fbLogin(event){
        event.preventDefault();
        this.loggingIn = true;
        FB.login((response)=>{
            // console.log(response);
            if (response.authResponse && response.authResponse.accessToken) {
             // console.log('Welcome!  Logging you on server.... ');
            this.loginService.fbLogin(response.authResponse.accessToken).then(data=>{
                this.loggingIn = false;
                let redirectPath = this.$route.query.redirect ? this.$route.query.redirect : "/read-public-diaries";
                this.$router.replace(redirectPath);

            }).catch(err=>{
                this.loggingIn = false;
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
                        text:"Unknown error occured, please try again",
                        icon:"error"
                    });
                } else {
                    // Something happened in setting up the request that triggered an Error
                    showAlert({
                        title: "Oops!",
                        text:"Unknown error occured, please try again",
                        icon:"error"
                    });
                }
            })
            //  FB.api('/me', function(response) {
            //     // console.log(response);
            //    // console.log('Good to see you, ' + response.name + '.');
            //  });



            } else {
            //  // console.log('User cancelled login or did not fully authorize.');
            this.loggingIn = false;
            showAlert({
                title:"Oops!",
                text:"Could not log you in with facebook, Please try again",
                icon:"error"
            })
            }
        }, {scope: "email, public_profile"});
    }
}