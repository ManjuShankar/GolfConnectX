import React, {Component} from 'react';
import {render} from 'react-dom';
import {IMG_CONSTANT, APP_CONSTANT} from '../constants/application.constants';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {registerUser, contactUs} from '../actions/registerAction';
import {isValidEmail} from '../utils/Validation';
let serialize = require('form-serialize');
import _ from "lodash";
const Captcha = require('react-captcha');
import toastr from 'toastr';

let imagePath= IMG_CONSTANT.BASE_PATH;
class InviteRegistration extends Component
{
    constructor(props,context)
    {
        super(props,context);
        this.onfieldChange= this.onfieldChange.bind(this);
        this.onfieldBlur= this.onfieldBlur.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
        this.state = {
            Fname: "",
            Lname:"",
            email: "",
            newPass : "",
            rePass : "",
            errPass1 : "",
            errPass2 : "",
            a:"",b:"",
            errEmail:"",errInviteCode:"",inviteCode:"",
            isRobot:true
        }
    }


    onfieldChange(e){
        if(e.target.name == "email"){
            let errors = isValidEmail(e.target.value);

            if(errors == false){
                    this.setState({
                    errEmail : (<span className="err-msg"> Invalid Email</span>),
                    email : ""
               });
            }
            else{
                     this.setState({
                    errEmail : "",
                    email : e.target.value
               });
            }

        }
    }
    onfieldBlur(e){
    }
    onCancelClick(){
          this.context.router.push('/');
    }
    onSubmit()
    {
      if(this.state.isRobot){
        toastr.error("Please select reCaptcha");
      }else{
        let form = document.querySelector('#registration_page');
        let formData = serialize(form, {hash: true });
        if(!(_.has(formData, 'is_private'))){
           _.set(formData, 'is_private', false);
        }else{
           _.set(formData, 'is_private', true);
        }
        this.props.registerUser(formData).then((data)=>{
            if(data.object_id!=null && data.object_type!=null){
              this.context.router.push('/notifications');
           }else{
             this.context.router.push('/home');
           }
        }).catch((error)=>{
            console.log("Error", error);
        });
       }
    }

/* Validation */

onRequired(e) {
    if(e.target.name == "first_name"){
        if(e.target.value == ""){
                    this.setState({
                    a:(<span className="err-msg"> First Name is Required</span> ),
                    Fname:null
                    });
        }
        else{
                    this.setState({
                        a: null,
                        Fname:e.target.value
                    }) ;
            }
    }

        if(e.target.name == "last_name"){

                if(e.target.value == ""){

                 this.setState({
                 b:(<span className="err-msg"> Last Name is Required</span> ),
                 Lname:null
                    });
                }
                else{
                this.setState({
                    b: null,
                    Lname:e.target.value
                    }) ;
                }

        }
        if(e.target.name == "zipcode"){

                if(e.target.value == ""){

                 this.setState({
                 c:(<span className="err-msg"> Please enter valid Zipcode</span> ),
                 zipCode:null
                    });
                }
                else{
                this.setState({
                    c: null,
                    zipCode:e.target.value
                    }) ;
                }

        }
        if(e.target.name == "inviteCode"){

                if(e.target.value == ""){

                 this.setState({
                 errInviteCode:(<span className="err-msg"> Please enter valid invite code</span> ),
                 inviteCode:null
                    });
                }
                else{
                this.setState({
                 errInviteCode: null,
                 inviteCode:e.target.value
                    }) ;
                }

        }

}

    validatePass(e){
        if(e.target.name == "password"){
            if(e.target.value == ""){
              this.setState({
              errPass1 : ( <span className="err-msg"> Please enter your Password </span> ),
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
                errPass2 : (<span className="err-msg">Password Doesnt Match</span>),

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
                    errPass2 : (<span className="err-msg">Password Doesnt Match</span>),
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

    zipCodeEvent(e) {
    const re = /[0-9]+/g;
    if ((!re.test(e.key)) || (e.target.value.length >= 5))
    {
        e.preventDefault();
    }
}
onlyTexts(e){
    const re = /[a-zA-Z]+/g;
    if (!re.test(e.key))
    {
     e.preventDefault();
    }
}
/* validation code over */
onSendClick(){

   let form = document.querySelector('#contactForm');
       let formData = serialize(form, { hash: true });

       this.props.contactUs(formData).then(()=>{

             $("#useremails").val('');
$('#contactMessage').val('');
$("#myModal").modal('hide');
            $('#secondModal').modal('hide');
         }).catch((error)=>{
         });
}
    render()
    {
        return( <div  className="invite_regis">
                <div className="bgLoginReg">
                    <div className="BgadminDashboard"></div>
                </div>
                <div className="invite_login-page">
                    <div className="navigation">
                        <div className="logo_login">
                            <img src={imagePath + "Golf_CNX_Logo.png"}></img>
                        </div>
                        <div className="menu-right">
                          <a data-toggle="modal" data-target="#myModal" className="txtwhite"> Contact Us</a>
                            <div className="modal fade addInvite" id="myModal" role="dialog" data-backdrop="static">
                            <form action="" method="post" id="contactForm" name="contactForm" ref="contactForm">
                            <div className="modal-dialog modal-sm mt15pc">
                               <div className="modal-content">
                                   <div className="modal-header col-sm-12 modalHeader"><h4 className="m0px">CONTACT ADMIN</h4></div>
                                   <div className="modal-body col-sm-12 bgwhite mb0px">
                                   <div className="col-sm-12">
                                     <label>Name:</label><input type="text" placeholder="John Doe" id="name" name="name" className="form-control"/>
                                   </div>
                                   <div className="col-sm-12">
                                      <label>Email:</label><input type="email" placeholder="abc@gmail.com" id="email" name="email" className="form-control"/>
                                   </div>
                                   <div className="col-sm-12">
                                   <label>Message</label>
                                    <textarea className="txtarea form-control invtTxtArea" id="contactMessage" name="message" />
                                   </div>
                                   </div>
                                  <div className="modal-footer col-sm-12 bgwhite">
                                    <button type="button" className="btnSend" id="btnSend" onClick={this.onSendClick.bind(this)} >Send</button>
                                    <button type="button" className="btnCncl" data-dismiss="modal">Cancel</button>
                                 </div>
                                </div>
                            </div>
                            </form>
                          </div>
                        </div>
                    </div>
                    <div className="invite_regisCenterPage">
                    <div className="middlealign">
                        <div className="logoLoginPage">
                            <img src={imagePath + "Golf_login_Logo.png"} className="logogolf" ></img>
                        </div>
                    </div>
                    <div>
                    <form name="registration_page" id="registration_page" ref="registration_page" action="" method="post">
                    <div className="form-group txtwhite">
                        <input  type="text" id="first_name" name="first_name" key="first_name" className="formcontrol"  placeholder="First Name" onChange={this.onRequired.bind(this)} onKeyPress={this.onlyTexts.bind(this)}/>
                  {this.state.a}
                    </div>

                    <div>

                         <input  type="text" id="last_name" key="last_name" name="last_name"   className="formcontrol txtwhite"  placeholder="Last Name" onChange={this.onRequired.bind(this)} onKeyPress={this.onlyTexts.bind(this)}/>
                     {this.state.b}
                    </div>

                    <div>
                         <input  type="email"  name="email" id="email" key="email"  className="formcontrol mt10px txtwhite"  placeholder="Email"  onChange={this.onfieldChange.bind(this)}/>

                    </div>
                    {this.state.errEmail}
                        <div>
                           <input  type="password" id="password" name="password" key="password"  className="formcontrol mt10px txtwhite" value={this.state.newPass}  onChange={this.validatePass.bind(this)} placeholder="Password"/>
                        </div>
                        {this.state.errPass1}
                        <div>
                         <input  type="password" name="confirmPassword" key="confirmPassword" id="confirmPassword"  className="formcontrol mt10px txtwhite" placeholder="Repeat Password" onChange={this.validatePass.bind(this)}/>
                        </div>
                       {this.state.errPass2}
                        <div>
                         <input  type="zipcode" name="zipcode" key="zipcode" id="zipcode"  className="formcontrol mt10px txtwhite"  placeholder="Zip Code"  onChange={this.onRequired.bind(this)} onKeyPress={this.zipCodeEvent.bind(this)}/>
                        </div>
                        {this.state.c}
                        <div className=" mrgtopp10px" >
               <span   className="switchround mrgtop10px">Private Account:</span>
               <label className="switch">
            <input type="checkbox" onChange={this.onfieldChange} name="is_private" key="is_private" id="is_private"/>
            <div className="slider round"></div>
               </label>
           </div>
           <div className="ml40pc captcha">
            <Captcha  sitekey = {APP_CONSTANT.SITE_KEY} lang = 'en' theme = 'light' type = 'image'
                    callback ={(value) => {this.setState({isRobot:false});  } }/>
                    </div>
                    <div>
                        <input  type="text" id="invite_code" name="invite_code" key="invite_code" className="formcontrol txtwhite"  placeholder="Invite Code"  />
                        </div>
                        {this.state.errInviteCode}
                        </form>
                    </div>
                    <div className="col-sm-12">
                         <div className="col-sm-6">
                                 <button className="btn registsign" onClick={this.onSubmit} disabled= {this.state.isRobot ||!this.state.Fname || !this.state.Lname || !this.state.newPass || !this.state.email || !this.state.rePass || !this.state.zipCode || this.state.errEmail || this.state.errPass2} >Sign Up</button>
                         </div>
                         <div className="col-sm-6">

                                <button onClick={this.onCancelClick.bind(this)} className="btn registcancel" > Cancel</button>
                         </div>

                    </div>
                    </div>

                </div>
            </div>
            );
    }
}
InviteRegistration.contextTypes={
    router:React.PropTypes.object.isRequired
};
function mapStateToProps(state){
    return{
        registerDetails:state.registerUser
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({registerUser, contactUs},dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps) (InviteRegistration)
