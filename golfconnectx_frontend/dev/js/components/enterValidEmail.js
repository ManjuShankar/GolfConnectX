import React, {Component} from 'react';
import {render} from 'react-dom';
import {IMG_CONSTANT} from '../constants/application.constants';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {EnterEmail} from '../actions/loginAction';
import {isValidEmail} from '../utils/Validation';
var serialize = require('form-serialize');
class EnterValidEmail extends Component
{
    constructor(props,context) {
    super(props, context);

    }
    onOTPsendbuttonClick(){

      let form = document.querySelector('#emailForm');
       let formData = serialize(form, { hash: true });
       this.props.EnterEmail(formData).then(()=>{
             $("#email").val('');
          this.context.router.push("/enterOTP");
         }).catch((error)=>{

         });

   }
   onSubmit(e){

   if((e.keyCode ==13)  && (this.refs.email.value != "")){

      $("#emailForm").submit(function(e){
        e.preventDefault();
      });
       $("#btnSubmit").trigger("click");
    }
    else{
       $("#emailForm").submit(function(e){
      e.preventDefault();
    });
    }

   }
   oncancelbuttonClick(){
        this.context.router.push("/");
   }

    render()
    {
      return(
        <div className="frgtPswrd">
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
                    <h5 className="txtwhite">Password Reset.</h5>
                  </div>
                  <div className="col-sm-4"></div>
                </div>
                <div className="col-sm-12 zeroPad">
                <form id="emailForm" >
                  <div className="col-sm-12 mt10px mb10px">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                      <div className="col-sm-12">
                        <div className="txtwhite col-sm-2 zeroPad txtRyt fnt16px">Email : </div>
                        <div className="col-sm-10">
                          <input type="email" placeholder="Enter your email address" ref="email" name="email" className="form-control" id="email"  onKeyDown={this.onSubmit.bind(this)}/>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-4"></div>
                  </div>
                  <div className="col-sm-12 mb1pc mt10px">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                      <div className="col-sm-12">
                        <div className="CancelDiv txtRyt col-sm-6"><input type="button" value="Cancel" className="back-butn" onClick={this.oncancelbuttonClick.bind(this)}/></div>
                        <div className="OTPSendDiv txtLft col-sm-6"><input type="button" value="Submit" className="OTPSend-butn" id="btnSubmit" onClick={this.onOTPsendbuttonClick.bind(this)} ref={input => this.inputElement = input}/></div>
                      </div>
                    </div>
                    <div className="col-sm-4"></div>

                  </div>
                   </form>
                </div>
              </div>
            </div>
          </div>
        </div>

      );
   }
}
EnterValidEmail.contextTypes = {
  router: React.PropTypes.object.isRequired
};
function mapStateToProps(state) {
    return {
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails')))

    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({EnterEmail}, dispatch);
}
export default connect(mapStateToProps, matchDispatchToProps) (EnterValidEmail);
