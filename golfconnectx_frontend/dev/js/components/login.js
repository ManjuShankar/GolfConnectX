/* React Libraries */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import toastr from 'toastr';
import Spinner from 'react-spinner';
/*constants*/
import {
    IMG_CONSTANT
} from '../constants/application.constants';
var serialize = require('form-serialize');
/*Actions*/
import {
    userSignIn, contactUs, fbSignIn
} from '../actions/loginAction';

import {
    isvalidLogin
} from '../utils/Validation';

/*Functions*/
import {
    getFormSerializedData
} from '../utils/functions';

import {
    APP_URL
} from '../constants/applicationUrl';

/*Components*/
import App from '../containers/App';
import {isValidEmail} from '../utils/Validation';
import FacebookLogin from 'react-facebook-login';
let ImgPath = IMG_CONSTANT.BASE_PATH;

class Login extends Component {
    constructor(props, context) {
        super(props, context);
        this.onSubmit=this.onSubmit.bind(this);
        this.onSignup=this.onSignup.bind(this);
        this.state={
            buttonDisabled : true,
            name : "", email : "", msg : "",
            errName : "", errEmail : "", errMsg: "", ajaxCallInProgress:false,

        }
    }
 responseFacebook(response){
   this.setState({ajaxCallInProgress:true});
   this.props.fbSignIn(response).then(() => {
                if(this.props.userDetails!=undefined && this.props.userDetails!=null && this.props.userDetails.exists == false){
                    this.context.router.push(APP_URL.RREGISTER);
                }

            else{
                this.context.router.push(APP_URL.HOME);
                this.setState({ajaxCallInProgress:false});
             }

            }).catch((error) => {
                this.setState({ajaxCallInProgress:false});
                console.log("error",error);
            });
}
    onSubmit(e) {
      this.setState({ajaxCallInProgress:true});
        let formData = getFormSerializedData('login_form');
        let errors = isvalidLogin(formData)
        if (_.size(errors) == 0) {
            this.props.userSignIn(formData).then(() => {
                this.context.router.push(APP_URL.HOME);
            }).catch((error) => {
                toastr.error("Not a valid EmailId/Password");
                 this.setState({ajaxCallInProgress:false});
            });
        } else {
            toastr.error("Please enter UserName or Password", "Failure");
        }
    }


    onSendClick(){

       let form = document.querySelector('#contactForm');
           let formData = serialize(form, { hash: true });

           this.props.contactUs(formData).then(()=>{
                  $('#name').val('');
                  $("#email").val('');
                  $('#message').val('');
                  $('#contactMessage').val('');
                  $("#myModal").modal('hide');

             }).catch((error)=>{
             });
    }
    ForgotPassword(){
      this.context.router.push('/enterEmail');
    }

    onSignup() {
        this.context.router.push(APP_URL.RREGISTER);
    }
    /*****/
    onRequired(e){
        if(e.target.name == "name"){
            if(e.target.value == ""){
                this.setState({
                    name : "",
                    errName : (<span className="err-msg1">Please Enter theName </span>),
                    buttonDisabled : true
                });
            }
            else{
                 this.setState({
                    name : e.target.value,
                    errName :"",
                    buttonDisabled : false
                });
            }
        }
        if(e.target.name == "email"){
            let errors = isValidEmail(e.target.value);

            if(errors == false){
                    this.setState({
                    errEmail : (<span className="err-msg1"> Invalid Email</span>),
                    email : "",
                    buttonDisabled: true
               });
            }
            else{
                     this.setState({
                    errEmail : "",
                    email : e.target.value,
                    buttonDisabled: false
               });
            }

        }
         if(e.target.name == "message"){
            if(e.target.value == ""){
                this.setState({
                    msg : "",
                    errMsg : (<span className="err-msg1">Please Enter Something to Send </span>),
                    buttonDisabled : true
                });
            }
            else{
                 this.setState({
                    msg : e.target.value,
                    errMsg:"",
                    buttonDisabled : false
                });
            }
        }
    }
    /*****/
enterCapture(e){
         if((e.target.value != "") && (e.keyCode == 13)){
           this.onSubmit();
         }
 }
    render()
    {
      return(

             <div><div className="bgLoginReg">
                  <div className="BgadminDashboard"></div>
             </div>
            <div className="login-page">
              <div className="navigation">
                <div className="logo_login">
                    <img src={ImgPath+"Golf_CNX_Logo.png"} />
                </div>
              <div className="menu-right">
                <a onClick={this.onSignup} className="txtwhite">Sign Up</a>
                <a data-toggle="modal" data-target="#myModal" className="txtwhite"> Contact Us</a>
                <div className="modal fade addInvite" id="myModal" role="dialog" data-backdrop="static">
                           <form action="" method="post" id="contactForm" name="contactForm" ref="contactForm">
                           <div className="modal-dialog modal-sm mt15pc">
                              <div className="modal-content">
                                  <div className="modal-header col-sm-12 modalHeader"><h4 className="m0px">CONTACT ADMIN</h4></div>
                                  <div className="modal-body col-sm-12 bgwhite mb0px">
                                  <div className="col-sm-12">
                                     <label>Name:</label><input type="text" placeholder="John Doe" id="name" name="name" className="form-control" onChange={this.onRequired.bind(this)}/>
                                     {this.state.errName}
                                  </div>
                                  <div className="col-sm-12">
                                     <label>Email:</label><input type="email" placeholder="abc@gmail.com" id="email" name="email" className="form-control" onChange={this.onRequired.bind(this)}/>
                                     {this.state.errEmail}
                                  </div>
                                  <div className="col-sm-12">
                                  <label>Message</label>
                                   <textarea className="txtarea form-control invtTxtArea" id="contactMessage" name="message" onChange={this.onRequired.bind(this)}/>
                                  {this.state.errMsg}
                                  </div>
                                  </div>
                                 <div className="modal-footer col-sm-12 bgwhite">
                                   <button type="button" className="btn btnSend" id="btnSend" onClick={this.onSendClick.bind(this)} disabled={this.state.buttonDisabled || !this.state.name || !this.state.email || !this.state.msg}>Send</button>
                                   <button type="button" className="btnCncl" data-dismiss="modal">Cancel</button>
                                </div>
                               </div>
                           </div>
                           </form>
                         </div>
              </div>
             </div>
             <div className="middlealign">
                <div className="logoLoginPage">
                  <img src={ImgPath+"Golf_login_Logo.png"} />
                </div>
          {(this.state.ajaxCallInProgress)?(<div className=""><Spinner /></div>):(<form action="" method="post" ref="login_form" id="login_form" name="login_form">

                <div className="formElements">
                  <div className="form-group">
                    <input
                      name="userEmailId"
                      key="userEmailId"
                      type="email"
                      className="form-control"
                      id="userEmailId"
                      placeholder="Email"/>
                  </div>
                  <div className="form-group">
                    <input
                      name="userPassword"
                      id="userPassword"
                      key="userPassword"
                      type="password"
                      className="form-control"
                      placeholder="Password" onKeyDown={this.enterCapture.bind(this)}/>
                </div>
                <div className="LoginButton">
                  <button onClick={this.onSubmit} type="button">
                    <img src={ImgPath+"Login_button.png"}/>
                  </button>
               </div>
                <div className="LoginButton">
               <img src={ImgPath+"FB_Login_button.png"} className="ml39pc"/>
                               <div className="fbLoginbtn"><FacebookLogin appId="194085854431251" autoLoad={false} fields="name,email,picture" callback={this.responseFacebook.bind(this)} >

          </FacebookLogin>
          </div>
                            </div>
               <div className="signup_text_main">
                 <div className="forget_txt cursor-pointer" onClick={this.ForgotPassword.bind(this)}>Forgot Password?</div>
                <div onClick={this.onSignup} className="signup_text cursor-pointer">Sign Up</div>
              </div>
          </div>
          </form>)}
        </div>

      </div>

  </div>
      );
    }

}

Login.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        userDetails: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({userSignIn, contactUs, fbSignIn}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Login);
