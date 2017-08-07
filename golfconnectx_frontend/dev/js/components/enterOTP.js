import React, {Component} from 'react';
import {render} from 'react-dom';
import {IMG_CONSTANT} from '../constants/application.constants';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {EnterOTP} from '../actions/loginAction';
import {isValidEmail} from '../utils/Validation';
var serialize = require('form-serialize');
import {isExistObj} from '../utils/functions';
class EnterCorrectOTP extends Component
{
    constructor(props,context) {
    super(props, context);
    }
    onOTPsubmitbuttonClick(){
      let form = document.querySelector('#OTPForm');
       let formData = serialize(form, { hash: true });
       this.props.EnterOTP(formData).then(()=>{
             $("#email").val('');
            this.context.router.push("/enterNewPassword");
         }).catch((error)=>{
         });

    }
     onSubmit(e){

   if((e.keyCode ==13)  && (this.refs.otp.value != "")){

      $("#OTPForm").submit(function(e){
          e.preventDefault();
         });
      $("#btnSubmit").trigger("click");
  }
 else{
       $("#OTPForm").submit(function(e){
        e.preventDefault();
      });
    }

   }


    render()
    {
      return(
        <div className="enterValidOTP">
        <form id="OTPForm" >
         <div className="bgimage">
          <div className="bgpic">
              <div className="BgadminDashboard"></div>
          </div>
          </div>
          <div className="row">
            <div className="container-fluid">
              <div className="mt7pc">
                <div className="logoIcon">
                  <img src="/assets/img/Golf_login_Logo.png" className="golfLogo" />
                </div>
                <div className="col-sm-12 mt1pc">
                  <div className="col-sm-4"></div>
                  <div className="col-sm-4 txtcenter">
                    <h5 className="txtwhite">Security code sent to your email address.</h5>
                  </div>
                  <div className="col-sm-4"></div>
                </div>
                <div className="col-sm-12 zeroPad">
                  <div className="col-sm-12 mt10px mb10px">
                    <div className="col-sm-3"></div>
                    <div className="col-sm-5">
                      <div className="col-sm-12">
                        <div className="txtwhite col-sm-4 zeroPad txtRyt fnt16px">Enter Security Code : </div>
                        <div className="col-sm-8">
                        {isExistObj(this.props.activeUser) && isExistObj(this.props.activeUser.email) && <input type="hidden" value={this.props.activeUser.email.email} name="email" />}
                          <input type="text" placeholder="Enter Code" ref="otp" name="otp" className="form-control" onKeyDown={this.onSubmit.bind(this)} />
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-4"></div>
                  </div>
                  <div className="col-sm-12 mb1pc mt10px">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                      <div className="col-sm-12">
                      <div className="OTPResendDiv pdryt10pc txtRyt col-sm-6"><input type="button" value="Resend Code" className="OTPResend-butn" /></div>
                      <div className="OTPSubmitDiv pl1pc col-sm-6"><input type="button" value="Submit" id="btnSubmit" className="OTPSubmit-butn" onClick={this.onOTPsubmitbuttonClick.bind(this)} /></div>
                      </div>
                    </div>
                    <div className="col-sm-4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </form>
        </div>
      );
   }
}
EnterCorrectOTP.contextTypes = {
  router: React.PropTypes.object.isRequired
};
function mapStateToProps(state) {
    return {
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails')))

    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({EnterOTP}, dispatch);
}
export default connect(mapStateToProps, matchDispatchToProps) (EnterCorrectOTP);
