import React, {Component} from 'react';
import {render} from 'react-dom';
import {IMG_CONSTANT} from '../constants/application.constants';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ChangePassword} from '../actions/loginAction';
import {isValidEmail} from '../utils/Validation';
var serialize = require('form-serialize');
import {isExistObj} from '../utils/functions';
class EnterNewPassword extends Component
{
    constructor(props,context) {
    super(props, context);
    this.state={
        errPass1:"",errPass2:"",
        rePass:"",newPass:""
    };

    }
    onPasswordChangeClick(){
      let form = document.querySelector('#PasswordForm');
       let formData = serialize(form, { hash: true });
       this.props.ChangePassword(formData).then(()=>{
              $("#email").val('');
             $("#email").val('');
            this.context.router.push("/");
         }).catch((error)=>{
         });

    }
    validatePass(e){
        if(e.target.name == "password"){
            if(e.target.value == ""){
              this.setState({
              errPass1 : ( <span className="color-red"> Please enter your Password </span> ),
              newPass : ""
              });
            }
            else{
              this.setState({
              errPass1 : "",
              newPass : e.target.value
              });
            }
      if((this.state.rePass != "") && (this.state.rePass != e.target.value)){
             this.setState({
                errPass2 : (<span className="color-red">Password Doesnt Match</span>),

            });
      }
      else{
            this.setState({
                errPass2 : ""
            });
      }

  }
        if(e.target.name == "confirmPassword"){

            if(this.state.newPass != e.target.value )
            {
            this.setState({
                    errPass2 : (<span className="color-red">Password Doesnt Match</span>),
                    rePass : null
                    });

            }
            else{
                this.setState({
                errPass2 : "",
                rePass : e.target.value
                 });
                }
            }
        }
    onSubmit(e){
   if((e.keyCode ==13)  && (this.refs.confirmPassword.value != "") && (!this.state.errPass2)){
        $("#btnSubmit").trigger("click");
    }

   }

    render()
    {
      return(
        <div className="enterPswrd">
        <form id="PasswordForm">
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

                  </div>
                  <div className="col-sm-4"></div>
                </div>
                <div className="col-sm-12 zeroPad">
                  <div className="col-sm-12 mt10px mb10px">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-5">
                      <div className="col-sm-12 zeroPad">
                        <div className="col-sm-12 mb10px">
                          <div className="txtwhite col-sm-4 zeroPad txtRyt fnt16px">Enter New Password : </div>
                          <div className="col-sm-8">
                          {isExistObj(this.props.activeUser) && isExistObj(this.props.activeUser.email) && <input type="hidden" value={this.props.activeUser.email.email} name="email"/>}
                            <input type="password" placeholder="Enter new password" name="password" className="form-control" onChange={this.validatePass.bind(this)} />
                            {this.state.errPass1}
                          </div>
                        </div>
                        <div className="col-sm-12 mt10px">
                          <div className="txtwhite col-sm-4 zeroPad txtRyt fnt16px">Re-enter Password : </div>
                          <div className="col-sm-8">
                            <input type="password" placeholder="re-enter password" ref="confirmPassword" name="confirmPassword" className="form-control" onChange={this.validatePass.bind(this)} onKeyDown={this.onSubmit.bind(this)}/>
                             {this.state.errPass2}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-3"></div>
                  </div>
                  <div className="col-sm-12 mb1pc mt10px">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                      <div className="col-sm-12">
                        <div className="pswrdSubmitDiv txtcenter"><input type="button" id="btnSubmit" value="Submit" className="PasswordSubmit-butn" onClick={this.onPasswordChangeClick.bind(this)}/></div>
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
EnterNewPassword.contextTypes = {
  router: React.PropTypes.object.isRequired
};
function mapStateToProps(state) {
    return {
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails')))

    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({ChangePassword}, dispatch);
}
export default connect(mapStateToProps, matchDispatchToProps) (EnterNewPassword);
