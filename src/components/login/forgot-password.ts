import Vue from "vue";
import Component from "vue-class-component";
import "./forgot-password.scss"
import { DataService } from "../../util/data";
import { showAlert } from "../../util/alerts.service";

@Component({
    template: require("./forgot-password.html")
})
export class ForgotPasswordComponent extends Vue {
    user_creds : any = {
        email: null,
        otp: null,
        password: null
    }
    error = null;
    dataServ: DataService = new DataService();
    requestSent : boolean = false;
    successMessage : string = null;
    loggingIn : boolean = false;
    title = "Forgot password | My App"
    description = "Forgot password on My App";
    constructor() {
        super();
        this.successMessage = null;
    }

    mounted() { }
    requestResetPass(){
        if(!this.user_creds.email || !this.validateEmail(this.user_creds.email)){
            this.error = "Uh-Oh! Email doesn't look right, please check again";
            return;
            
        }
        this.loggingIn = true;
        this.dataServ.callService("request_reset_password", {email: this.user_creds.email}, {dont_handle_error: true}).then(data=>{
            this.requestSent = true;
            this.loggingIn = false;
        }).catch(err=>{
            this.loggingIn = false;
            if(err.data){
                this.error = err.data.message;
            }else{
                this.error = "Oops! Unknown error occured";
            }
        })

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

    resetPassword(){
        if(!this.user_creds.email || !this.validateEmail(this.user_creds.email)){
            this.error = "Uh-Oh! Email doesn't look right, please check again";
        }
        if(!this.user_creds.password){
            this.error = "Seriously! Without password ?";
            return;
        }
        if(this.user_creds.password.length < 8 ){
            this.error = "Aww, Your password is cute and small. Can you keep it atleast 8 characters long?"
            return;
        }
        if(!this.user_creds.otp ){
            this.error = "Seriously! Without otp ?"
            return;
        }
        this.loggingIn = true;
        this.dataServ.callService("reset_password", {
            email: this.user_creds.email,
            password: this.user_creds.password,
            otp: this.user_creds.otp    
        }, {dont_handle_error: true}).then(data=>{
            this.loggingIn = false;
            this.error = null;
            this.successMessage = "You got it! Password reset success.Now login to your account using your new password"
        }).catch(err=>{
            this.loggingIn = false;
            if(err.data){
                this.error = err.data.message;
            }else{
                this.error = "Oops! Unknown error occured";
            }
        })

    }
}