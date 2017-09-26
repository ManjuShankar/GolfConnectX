import React, {Component} from 'react';

import {connect} from 'react-redux';



import {getAccountSettingsDetails, saveProfileDetails, savePrivateDetails, saveNotificationDetails, saveEmailDetails, uploadFile, getSkillset, updateUserProfileImage} from '../actions/accountsSettingsAction';

import _ from 'lodash';

var serialize = require('form-serialize');

import {phoneNumber} from '../utils/Validation';

import Spinner from 'react-spinner';

import {Cropper} from 'react-image-cropper';
import {isExistObj} from '../utils/functions';
import { Link } from 'react-router';

import {bindActionCreators} from 'redux';
import {SERVICE_URLS} from '../constants/serviceUrl';


class AccountSettings extends Component{

    constructor(props,context){

        super(props, context);

        this.state={

          files:[],

          Profile: {},

          PrivateDetails:{},

          NotificatonDetails:{},

          EmailDetails:{},

          Skills:{},

          profileImage:'',

          curPass:"",

          newPass : "",

          rePass : "",

          errM : "",

          a:"",

          buttonDisable1: true,

          buttonDisable2: true,

          buttonDisable3: true,

          buttonDisable4:true,

          ajaxCallInProgress:false,

          privateButtonDisabled:true,

          isSaveInProgress:false,

          handicapError : "",

          isShowCropper : false,

          cropImageSrc : "",

          isResetButton:false,
          type: 0,
            ajaxImg:false

    };


        this.onFieldChange=this.onFieldChange.bind(this);

        this.uploadFile=this.uploadFile.bind(this);

  }

    onFieldChange(e){

    }


    setImage(data){
      this.setState({profileImage:data.image});
    }


srcToFile(src, fileName, mimeType){
             return (fetch(src)

                 .then(function(res){return res.arrayBuffer();})

                 .then(function(buf){return new File([buf], fileName, {type:mimeType});})
             );
    }

    uploadFile(e) {
     

           var that = this;
           let srcFile = this.refs.cropper.crop();
           console.log("Cropper Image",srcFile);
           let token = this.props.activeUser.token;

           this.srcToFile(srcFile, "cropImg.png", 'image/jpg').then(function(file){
            var fd = new FormData();
            fd.append('image', file);
            console.log("Fd.image",fd);
               that.setState({isShowCropper:false, ajaxImg:true});
           $.ajax({

               url: SERVICE_URLS.URL_USED  +'api/account-settings/upload-user-profile-image/',

               data: fd,

               processData: false,

               contentType: false,

               type: 'POST',

               headers:{

               'Authorization':'Token '+ token

              },

               success: function(data){

                 that.setState({profileImage:('http://' +  data.image), isShowCropper:false});

                 that.props.updateUserProfileImage(data.image);
                  
that.setState({ajaxImg:false});
               },

               error: function(){

that.setState({ajaxImg:false});

               }

           });

           e.preventDefault();
           });
       }



     onProfileDetailsSave (e){
      //  alert(event.target.name);
       this.setState({isSaveInProgress:true});

       let form = document.querySelector('#profileForm');

       let formData = serialize(form, { hash: true });

        $("#profileForm :input:checkbox:not(:checked)").each(function() {

         let fieldName = $(this).attr('name');

          _.set(formData, fieldName, false);

      });



       this.props.saveProfileDetails(formData, this.props.activeUser.token).then(()=>{

              this.setState({isSaveInProgress:false});

             this.setState({Profile:this.props.accountDetails.profile,buttonDisable4:true});


            this.changeIcon2();

         }).catch((error)=>{

           this.setState({isSaveInProgress:false});

         });
     }
   
      onChangeType(type){
       {/* this.props.getAccountSettingsDetails(this.props.activeUser.token).then(()=>{

            this.setState({ NotificatonDetails:this.props.accountDetails.notification,

                            buttonDisable2 : true });

        });

        this.refs.notify_like_post.checked = this.state.NotificatonDetails.notify_like_post;
        this.refs.notify_comment_post.checked = this.state.NotificatonDetails.notify_comment_post;
        this.refs.notify_group_updates.checked = this.state.NotificatonDetails.notify_group_updates;
        this.refs.notify_invite_event.checked = this.state.NotificatonDetails.notify_invite_event;
        this.refs.notify_accept_invitation.checked = this.state.NotificatonDetails.notify_accept_invitation;
        this.refs.notify_event_updates.checked = this.state.NotificatonDetails.notify_event_updates;
*/}
        this.setState({type: type});
        

      }
       
   


     onPrivateDetailsSave(){

       let form = document.querySelector('#privateAccountForm');

       let formData = serialize(form, { hash: true });

       this.props.savePrivateDetails(formData, this.props.activeUser.token).then(()=>{
             this.setState({PrivateDetails:this.props.accountDetails.private,buttonDisable1:true});
            this.changeIcon3();
         }).catch((error)=>{
           console.log("error",error);
         });

         this.props.getSkillset(this.props.activeUser.token).then(()=>{

          this.setState({Skills:this.props.accountDetails.skills, buttonDisable1:false});

        }).catch((error)=>{

        });


     }


     onNotificationDetailsSave(){
       let form = document.querySelector('#notificationForm');

       let formData = serialize(form, { hash: true });

       $("#notificationForm :input:checkbox:not(:checked)").each(function() {

         let fieldName = $(this).attr('name');

          _.set(formData, fieldName, false);

      });


       this.props.saveNotificationDetails(formData, this.props.activeUser.token).then(()=>{

            this.setState({NotificatonDetails:this.props.accountDetails.notification,buttonDisable2:true});

              this.changeIcon4();

         }).catch((error)=>{

         });

     }



     onEmailDetailsSave(){

       let form = document.querySelector('#emailForm');

       let formData = serialize(form, { hash: true });

      $("#emailForm :input:checkbox:not(:checked)").each(function() {

                let fieldName = $(this).attr('name');

                 _.set(formData, fieldName, false);

       });

       this.props.saveEmailDetails(formData, this.props.activeUser.token).then(()=>{

            this.setState({EmailDetails:this.props.accountDetails.email,buttonDisable3:true});

            this.changeIcon4();

         }).catch((error)=>{

         });

     }



     componentWillMount(){

      this.setState({ajaxCallInProgress:true})

         this.props.getAccountSettingsDetails(this.props.activeUser.token).then(()=>{

            this.setState({Profile:this.props.accountDetails.profile, PrivateDetails:this.props.accountDetails.private,NotificatonDetails:this.props.accountDetails.notification, EmailDetails:this.props.accountDetails.email});
            this.setState({profileImage:('http://'+this.props.accountDetails.profile.profile_image_url)});
            this.setState({ajaxCallInProgress:false});

        }).catch((error)=>{

          this.setState({ajaxCallInProgress:false});

        });

        this.props.getSkillset(this.props.activeUser.token).then(()=>{

          this.setState({Skills:this.props.accountDetails.skills});

        }).catch((error)=>{

            if(error == "Error: Request failed with status code 401"){
            this.context.router.push('/');
           }

        });


    }



    componentDidMount() {

          $('.menu').parent().removeClass('active');
    }



    componentWillReceiveProps(nextProps){

        if(this.props.accountDetails!=null && this.props.accountDetails.profile!=nextProps.accountDetails.profile){
            this.setState({Profile:nextProps.accountDetails.profile});
        }

        else if(this.props.accountDetails!=null && this.props.accountDetails.private!=nextProps.accountDetails.private){
            this.setState({PrivateDetails:nextProps.accountDetails.private});
        }

        else if(this.props.accountDetails!=null && this.props.accountDetails.notification!=nextProps.accountDetails.notification){

            this.setState({NotificatonDetails:nextProps.accountDetails.notification});

        }

        else if(this.props.accountDetails!=null && this.props.accountDetails.email!=nextProps.accountDetails.email){

            this.setState({EmailDetails:nextProps.accountDetails.email});

        }

        else if(this.props.accountDetails!=null && this.props.accountDetails.skills!=nextProps.accountDetails.skills){

            this.setState({Skills:nextProps.accountDetails.skills});

        }

    }



    changeCollapseIco(e){

    this.props.getAccountSettingsDetails(this.props.activeUser.token).then(()=>{

            this.setState({ Profile:this.props.accountDetails.profile,

                            a:"",
                            handicapError: "",
                            lnameErr:"",phoneErr:"",zipErr:"",
                            buttonDisable4 : true

                     });
             });
            this.refs.first_name.value = this.state.Profile.first_name;

            this.refs.last_name.value = this.state.Profile.last_name;

            this.refs.phone.value = this.state.Profile.phone;

            this.refs.zipcode.value = this.state.Profile.zipcode;

            this.refs.is_private.checked = this.state.Profile.is_private;

            this.refs.handicap.value = this.state.Skills.details.handicap;

            this.refs.skill.value = this.state.Skills.details.skill_level;

            this.refs.golfer.value = this.state.Skills.details.golfer_type;

      $('#headingOneSpan').toggleClass('glyphicon-plus').toggleClass('glyphicon-minus');

  }



    changeCollapseIco2(e){

            this.props.getAccountSettingsDetails(this.props.activeUser.token).then(()=>{

            this.setState({ PrivateDetails:this.props.accountDetails.private,

                             buttonDisable1 : true,
                             curPass:"",
                             newPass : "",
                             rePass : "",
                             errM : ""
                             });

             });

        $('#headingTwoSpan').toggleClass('glyphicon-minus').toggleClass('glyphicon-plus');

    }


    changeCollapseIco3(e){

        this.props.getAccountSettingsDetails(this.props.activeUser.token).then(()=>{

            this.setState({ NotificatonDetails:this.props.accountDetails.notification,

                            buttonDisable2 : true });

        });

        this.refs.notify_like_post.checked = this.state.NotificatonDetails.notify_like_post;

        this.refs.notify_comment_post.checked = this.state.NotificatonDetails.notify_comment_post;

        this.refs.notify_group_updates.checked = this.state.NotificatonDetails.notify_group_updates;

        this.refs.notify_invite_event.checked = this.state.NotificatonDetails.notify_invite_event;

        this.refs.notify_accept_invitation.checked = this.state.NotificatonDetails.notify_accept_invitation;

        this.refs.notify_event_updates.checked = this.state.NotificatonDetails.notify_event_updates;

        $('#headingThreeSpan').toggleClass('glyphicon-minus').toggleClass('glyphicon-plus');

    }



    changeCollapseIco4(){

        this.props.getAccountSettingsDetails(this.props.activeUser.token).then(()=>{

        this.setState({ EmailDetails:this.props.accountDetails.email,

                            buttonDisable3 : true });

        });

        this.refs.email_invitation.checked = this.state.EmailDetails.email_invitation;

        this.refs.email_messages.checked = this.state.EmailDetails.email_messages;

        this.refs.email_notifications.checked = this.state.EmailDetails.email_notifications;

        this.refs.email_site_messages.checked = this.state.EmailDetails.email_site_messages;

      $('#headingFourSpan').toggleClass('glyphicon-minus').toggleClass('glyphicon-plus');

    }



    changeIcon(){

        $('#headingOneSpan').toggleClass('glyphicon-plus').toggleClass('glyphicon-minus');

        $("#sec1").click();

     }

     changeIcon2(){

        $('#headingTwoSpan').toggleClass('glyphicon-minus').toggleClass('glyphicon-plus');

        $("#sec2").click();

     }

    changeIcon3(){

        $('#headingThreeSpan').toggleClass('glyphicon-minus').toggleClass('glyphicon-plus');

        $("#sec3").click();

     }

    changeIcon4(){

        $('#headingFourSpan').toggleClass('glyphicon-minus').toggleClass('glyphicon-plus');

        $("#sec4").click();

     }



     onCancelchangeIcon(e){

         this.revertFunction(e);

         $('#headingOneSpan').toggleClass('glyphicon-plus').toggleClass('glyphicon-minus');

         $("#sec1").click();

      }



      onCancelchangeIcon2(e){

         this.revertFunction(e);

         $('#headingTwoSpan').toggleClass('glyphicon-minus').toggleClass('glyphicon-plus');

         $("#sec2").click();

      }



     onCancelchangeIcon3(e){

         this.revertFunction(e);

         $('#headingThreeSpan').toggleClass('glyphicon-minus').toggleClass('glyphicon-plus');

         $("#sec3").click();

      }



     onCancelchangeIcon4(e){

         this.revertFunction(e);

         $('#headingFourSpan').toggleClass('glyphicon-minus').toggleClass('glyphicon-plus');

         $("#sec4").click();

      }

      plusminusToggle(){

       $('.collapse').on('shown.bs.collapse', function(){

$(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");

}).on('hidden.bs.collapse', function(){

$(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");

});

     }

     saveToggle(){

$(".openpanel").on("click", function() {

    $("#panel3").collapse('show');

});

}





/* Validation */

onRequired(e) {


if(e.target.name == "first_name"){
    if(e.target.value == ""){
                this.setState({
                           a:(<span className="color-red"> Please enter your First Name</span> ),
                           tbox:e.target.value,
                           buttonDisable4 : true
                            });
                           }

    else{
        this.setState({ a: "",buttonDisable4 : false
    }) ;

        }
    }
    if(e.target.name == "last_name"){
    if(e.target.value == ""){
                this.setState({
                           lnameErr :  (<p> Please enter your last name</p> ),
                           tbox:e.target.value,
                           buttonDisable4 : true
                            });
                           }

    else{
                this.setState({ lnameErr : "",buttonDisable4 : false
                                    });

        }
    }
    if(e.target.name == "phone"){
    if(e.target.value == "" || e.target.value.length < 10){
                this.setState({
                           phoneErr :  (<p> Please enter your phone Number</p> ),
                           tbox:e.target.value,
                           buttonDisable4 : true
                            });
                           }

    else{
                this.setState({ phoneErr : "",buttonDisable4 : false
                                    });

        }
    }
     if(e.target.name == "zipcode"){
    if(e.target.value == "" || e.target.value.length < 5){
                this.setState({
                           zipErr :  (<p> Please enter valid Zipcode</p> ),
                           tbox:e.target.value,
                           buttonDisable4 : true
                            });
                           }

    else{
                this.setState({ zipErr : "",buttonDisable4 : false
                                    });

        }
    }
}



chkboxUnable(e){

         if((e.target.name == "is_private")||(e.target.name == "handicap" )||(e.target.name == "skill_level")||(e.target.name == "golfer_type" )) {

         this.setState({

         buttonDisable4: false

        });

       }



       if((e.target.name == "notify_like_post") || (e.target.name == "notify_comment_post") || (e.target.name == "notify_group_updates" ) || (e.target.name == "notify_comment_discussion") || (e.target.name == "notify_invite_event") || (e.target.name == "notify_accept_invitation") || (e.target.name =="notify_event_updates" )) {

        this.setState({

         buttonDisable2: false

        });

       }

       if(e.target.name == "email_invitation" || (e.target.name == "email_messages") || (e.target.name == "email_notifications") || (e.target.name == "email_group_updates" )||(e.target.name == "email_site_messages" )|| (e.target.name == "email_email_updates")){

         this.setState({

         buttonDisable3: false

        });

       }

    }


validatePass(e){

    if(e.target.name == "password"){
        if(e.target.value == ""){
        this.setState({
             curPass : "",
             buttonDisable1:true

               });
        }
        else{
        this.setState({
               curPass : e.target.value,
               buttonDisable1 : false
               });
            }
        }

    if(e.target.name == "new_password"){
            if(e.target.value == ""){
                this.setState({
                        newPass : "",
                        buttonDisable1:true
                });
            }
            else{
            this.setState({
              newPass : e.target.value,
              buttonDisable1 : false
            });
            }
            if((this.state.rePass != "") && (this.state.rePass != e.target.value)){
                this.setState({
                errM : (<span className="passwd-err" >Password Doesn't Match</span>)

            });
        }
        else{
            this.setState({
                errM : ""
            });
        }
        }

    if(e.target.name == "confirm_password"){
        if(e.target.value == ""){
            this.setState({
                 rePass : "",
                 buttonDisable1 : true
            });
        }
        else{
            this.setState({
                 rePass : e.target.value,
                 buttonDisable1 : false
            });
        }

        if(this.state.newPass != e.target.value){
            this.setState({

                errM : (<span>Password Doesn't Match</span>)

            });



        }

        else{

            this.setState({
                errM : "",
                buttonDisable1: false
            });

        }

        }

    }



    minLenghtFun(e) {

    if(e.target.name == "phone"){

    const re = /[0-9]+/g;

    if ((!re.test(e.key)) || (e.target.value.length >= 10)){

        e.preventDefault();

        }

     }

     else{

          this.setState({

                 buttonDisable1 : false

             });

         const re = /[0-9]+/g;
         if (!re.test(e.key) || (e.target.value.length >= 2)){
               e.preventDefault();
             }
         else{
                 this.setState({
                 buttonDisable1 : false
             });
            }
         }
     }
 minLenghtZipCodeFun(e) {

    if(e.target.name == "zipcode"){

    const re = /[0-9]+/g;

    if ((!re.test(e.key)) || (e.target.value.length >= 5)){

        e.preventDefault();

        }

     }

     else{

          this.setState({

                 buttonDisable1 : false

             });

         const re = /[0-9]+/g;
         if (!re.test(e.key) || (e.target.value.length >= 2)){
               e.preventDefault();
             }
         else{
                 this.setState({
                 buttonDisable1 : false
             });
            }
         }
     }



 handicapErrMsg(e){

      if(e.target.value == "") {
         this.setState({
            handicapError : (<span>Min value should be 0*</span>)
         });

        }
      else if(e.target.value > 40){
            this.setState({
            handicapError : (<span>Max value should be 40*</span>)
         });
        }
      else {
            this.setState({
            handicapError : "",
            buttonDisable4: false
         });
        }
     }

 handicapControl(e){

       if(e.target.value == "") {
         this.refs.handicap.value = 0;
         this.setState({
            buttonDisable4 : false,
         });

        }
      if(e.target.value > 40){
          this.refs.handicap.value = 40;
        }
     }


revertFunction(e){

    if(e.target.name == "cancel1"){

    this.props.getAccountSettingsDetails(this.props.activeUser.token).then(()=>{

            this.setState({ Profile:this.props.accountDetails.profile,
                            // buttonDisable4 : true,
                            // curPass:"",
                            // newPass : "",
                            // rePass : "",
                           a:"",
                            handicapError: "",
                            lnameErr:"",phoneErr:"",zipErr:"",
                            buttonDisable4 : true

                            });
             });
            this.refs.first_name.value = this.state.Profile.first_name;

            this.refs.last_name.value = this.state.Profile.last_name;

            this.refs.phone.value = this.state.Profile.phone;

            this.refs.zipcode.value = this.state.Profile.zipcode;

            this.refs.is_private.checked = this.state.Profile.is_private;

             this.refs.handicap.value = this.state.Skills.details.handicap;

            this.refs.skill.value = this.state.Skills.details.skill_level;

            this.refs.golfer.value = this.state.Skills.details.golfer_type;

    }

 else if(e.target.name == "cancel2"){

         this.props.getAccountSettingsDetails(this.props.activeUser.token).then(()=>{

            this.setState({ PrivateDetails:this.props.accountDetails.private,

                            buttonDisable1 : true,
                            curPass:"",
                             newPass : "",
                             rePass : "",
                             errM : ""
                         });

             });

            // this.refs.is_private.checked = this.state.PrivateDetails.is_private;

            // this.refs.handicap.value = this.state.Skills.details.handicap;

            // this.refs.skill.value = this.state.Skills.details.skill_level;

            // this.refs.golfer.value = this.state.Skills.details.golfer_type;

     }



  else if(e.target.name == "cancel3"){

    this.props.getAccountSettingsDetails(this.props.activeUser.token).then(()=>{

            this.setState({ NotificatonDetails:this.props.accountDetails.notification,

                            buttonDisable2 : true });

        });

        this.refs.notify_like_post.checked = this.state.NotificatonDetails.notify_like_post;

        this.refs.notify_comment_post.checked = this.state.NotificatonDetails.notify_comment_post;

        this.refs.notify_group_updates.checked = this.state.NotificatonDetails.notify_group_updates;

        this.refs.notify_invite_event.checked = this.state.NotificatonDetails.notify_invite_event;

        this.refs.notify_accept_invitation.checked = this.state.NotificatonDetails.notify_accept_invitation;

        this.refs.notify_event_updates.checked = this.state.NotificatonDetails.notify_event_updates;

      }

      else{

           this.props.getAccountSettingsDetails(this.props.activeUser.token).then(()=>{

            this.setState({ EmailDetails:this.props.accountDetails.email,

                            buttonDisable3 : true });

        });

        this.refs.email_invitation.checked = this.state.EmailDetails.email_invitation;

        this.refs.email_messages.checked = this.state.EmailDetails.email_messages;

        this.refs.email_notifications.checked = this.state.EmailDetails.email_notifications;

        this.refs.email_site_messages.checked = this.state.EmailDetails.email_site_messages;

      }



 }

onlyTexts(e){

    const re = /[a-zA-Z]+/g;

    if (!re.test(e.key))

    {

     e.preventDefault();
}

}


 handleCropChange(values){
    if(values.width>=945){
        this.setState({cropImageWidth: values.width});
      }else{
          this.setState({cropImageWidth: 945});

      }
  }

  onCacelCrop(){
    let _img = 'http://' + this.state.profileImage;
    this.setState({cropImageSrc: _img, isShowCropper: false});
    this.refs.file.value="";
}
onImageChange(e){
      let files;
      if (e.dataTransfer) {
        files = e.dataTransfer.files;
      } else if (e.target) {
        files = e.target.files;
      }
      const reader = new FileReader();
      reader.onload = () => {
          this.setState({cropImageSrc: reader.result});
      };
      reader.readAsDataURL(files[0]);
      this.setState({isShowCropper:true});
    }
    
    
    onSliderRangeChange(e){
        let _handicapValue = _.toInteger(_.trim(e.target.value));
        let _profile = this.state.Profile;
        _profile.handicap = _handicapValue;
        this.setState({Profile: _profile,buttonDisable4 :false});
    }
    
    closeAccountSeeting(){
     
      $(".MobileNav").show();
      $(".sidebar").show();
    }

    render()
    {
        if((_.size(this.state.Profile))>0){

        return(
          <div>
          {(this.state.ajaxCallInProgress)?(<div className="mt25pc"><Spinner /></div>):(<div className="Profile">
            <div className="accountSetting alignment ">
             {(this.state.type==0)?(<div className="col-sm-12 min-display ">
               <div className="notify-header">
                 <Link to="/home"><span onClick={this.closeAccountSeeting.bind(this)} className=" glyphicon glyphicon-remove cursor-pointer clrwhite"></span></Link> <span className="paddingLeft">ACCOUNT SETTINGS</span>
                   {/*<button className="saveButton ">SAVE</button>*/}
                    
                      </div>
                      <div>
                      <div className="col-sm-12 form-group accountForm ">
                      <button onClick={this.onChangeType.bind(this, 1)} className=" anchor  formcontrol btn-block btn-link">My Club House<span className="pull-right glyphicon glyphicon-chevron-right"></span></button>
                      </div>
                      <div className="col-sm-12 form-group accountForm ">
                      <button onClick={this.onChangeType.bind(this, 2)} className=" anchor  formcontrol btn-block btn-link">Change Password<span className="pull-right glyphicon glyphicon-chevron-right"></span></button>
                      </div>
                       <div className="col-sm-12 form-group accountForm ">
                      <button onClick={this.onChangeType.bind(this, 3)} className=" anchor  formcontrol btn-block btn-link">Push Notification<span className="pull-right glyphicon glyphicon-chevron-right"></span></button>
                      </div>
                      <div className="col-sm-12 form-group accountForm ">
                      <button onClick={this.onChangeType.bind(this, 4)} className=" anchor  formcontrol btn-block btn-link">Email<span className="pull-right glyphicon glyphicon-chevron-right"></span></button>
                      </div>
                      </div>
                      </div>):
               ((this.state.type==1)?(<div className="col-sm-12 min-display ">
                  
                  {/*{(this.state.isShowCropper) && (<div className="col-sm-6">
                                
                                    <input type="button"  className=" btn btnSecondary" value="Upload" onClick={this.uploadFile.bind(this)}/>
                                    <input type="button" className=" btn btnSecondary" value="Cancel" onClick={this.onCacelCrop.bind(this)}/>
                                    <br/>
                                  <div className="cropperImg">
                                      <Cropper  src={this.state.cropImageSrc} ref="cropper" width={300} height={300} fixedRatio={false} allowNewSelection={false}
                                      onChange={values => this.handleCropChange(values)} />
                                    </div>
                                    

                      </div>)}*/}
                  <div className={this.state.isShowCropper?"display-none":""}>
                   <form ref="profileForm" id="profileForm" className="panel panel-default"  encType="multipart/form-data" onClick={this.plusminusToggle}>
                     {/*<input type="button"  className="btn Savebtn" value="Save" disabled={ this.state.a || this.state.lnameErr || this.state.phoneErr ||this.state.zipErr ||this.state.isSaveInProgress || this.state.buttonDisable4 } onClick={this.onProfileDetailsSave.bind(this)}/>*/}
                      <div>
                         <div className="notify-header"> <span onClick={this.onChangeType.bind(this,0)} className=" glyphicon glyphicon-chevron-left cursor-pointer clrwhite"></span><span className="paddingLeft">My Club House</span>
                            <input type="button"  className="btn Savebtn" value="Save" disabled={ this.state.a || this.state.lnameErr || this.state.phoneErr ||this.state.zipErr ||this.state.isSaveInProgress || this.state.buttonDisable4 } onClick={this.onProfileDetailsSave.bind(this)}/>
                         </div>
                               {(this.state.ajaxImg)?(<div className="mt25pc"><Spinner /></div>):(<img src={this.state.profileImage} className="brdrRad50pc accountImg mb1pc" />)}
                               <input ref="file" id="file" type="file" name="file" className="upload-file form-control" onChange={this.onImageChange.bind(this)} accept="image/*" className=" btn ImgUpload"/>
                               <span className="glyphicon glyphicon-pencil editImg"></span>
                           </div>
                         
                    <div className="col-sm-12 form-group">
                          <input type="text" className="formcontrol accountForm " name="first_name" placeholder="First Name" id="firstName" defaultValue={this.state.Profile.first_name} onChange={this.onRequired.bind(this)} onKeyPress={this.onlyTexts.bind(this)}/>
                    </div>
                    <div className="col-sm-12 form-group">
                      <input type="text" className="formcontrol accountForm " name="last_name" placeholder="Last Name" id="lastName" defaultValue={this.state.Profile.last_name} onChange={this.onRequired.bind(this)} onKeyPress={this.onlyTexts.bind(this)}/>
                      </div>
                    <div  className="col-sm-12 form-group">
                      <input type="email" className="formcontrol  accountForm "   name="email" id="Email" placeholder="Email" defaultValue={this.state.Profile.email} onChange={this.onRequired.bind(this)} onKeyPress={this.onlyTexts.bind(this)} readOnly/>
                    </div>

                    <div className="col-sm-12 form-group">
                      <input  type="text"className="formcontrol accountForm " placeholder="Phone" name="phone" id="phone" onKeyPress={this.minLenghtFun.bind(this)} minlength="10" maxlength="10"/>
                    </div>
                  
                     <div className="col-sm-12 form-group">
                        <input name="zipcode" className="formcontrol accountForm" placeholder="Zip_code" type="text" ref="zipcode"  id="example-url-input" defaultValue={this.state.Profile.zipcode} onChange={this.onRequired.bind(this)} onKeyPress={this.minLenghtZipCodeFun.bind(this)} />
                     </div>

                     <select className="form-control" ref="skill" defaultValue={this.state.Profile.skill_level} id="skillLevel" name="skill_level"  onChange={this.chkboxUnable.bind(this)} >
                           {isExistObj(this.state.Skills) && isExistObj(this.state.Skills.skill_levels) && _.size(this.state.Skills)>0 && this.state.Skills.skill_levels.map((item, i) => {
                          return(
                          <option  key={i} >{item.name}</option >);
                              })}
                     </select>
                                
                     <span className="lblHndicp lbls"><label for="handiCap">Handicap: {this.state.Profile.handicap}</label></span>

                     <div className="col-sm-12 form-group">
                               <input name="handicap" ref="handicap" type="range" min="-40" max="40" value={this.state.Profile.handicap} step="1" onChange={this.onSliderRangeChange.bind(this)} />
                     </div>

                    <select className="form-control" id="golfType" name="golfer_type" ref="golfer" defaultValue={this.state.Profile.golfer_type} onChange={this.chkboxUnable.bind(this)}>
                        { isExistObj(this.state.Skills) && isExistObj(this.state.Skills.golfer_types) && _.size(this.state.Skills)>0 && this.state.Skills.golfer_types.map((item, i) => {
                          return(
                          <option key={i} >{item.name} </option >);
                      })}
                    </select>


                    <div className="col-sm-12 formcontrol form-group ">
                        <label className="privateAccountAlign">Private Account:</label>
                          <label className="switch">
                            <input type="checkbox" name="is_private" ref="is_private" onChange={this.chkboxUnable.bind(this)} defaultChecked={this.state.Profile.is_private} />
                            <div className="slider sliderTop round"></div>
                          </label>
                    </div>

                   
                    {/*<input type="button" className="btn Savebtn" value="Save Changes" disabled={ this.state.a || this.state.lnameErr || this.state.phoneErr ||this.state.zipErr ||this.state.isSaveInProgress || this.state.buttonDisable4 } onClick={this.onProfileDetailsSave.bind(this)}/>*/}
      
                       {/*<div className="col-sm-12 form-group">
                            <button className="btn-success btn-block" onClick={this.onChangeType.bind(this,2)}> Reset Password</button>
                      </div>*/}
                      
                     </form>
                     </div>
                  </div>):
                  ((this.state.type==2)?(<div className="min-display">
                  <div className="header">
                    <span onClick={this.onChangeType.bind(this, 0)} className=" glyphicon glyphicon-chevron-left cursor-pointer clrwhite"></span><span className="paddingLeft">CHANGE PASSWORD</span></div>
                  <div>
                      <img src="/assets/img/Golf_login_Logo.png"className="img-prop"/>
                      <span className="glyphicon glyphicon-pencil clr-green"></span>
                    </div>
                    <div className="col-sm-12 form-group">
                           <input name="password" value={this.state.curPass} placeholder="Curent Password" ref="cur_password" onChange={this.validatePass.bind(this)} className="form-control accountForm" type="password"  id="example-tel-input" />
                     </div>
                     <div className="col-sm-12 form-group">
                           <input name="new_password" value={this.state.newPass} placeholder="New Password" ref="new_password"  onChange={this.validatePass.bind(this)} className="form-control" type="password"  id="example-password-input" />
                       </div>
                       <span className="color-red"> {this.state.errM} </span>
                     <div  className="col-sm-12 form-group">
                           <input name="confirm_password" value={this.state.rePass} placeholder="Confirm Password" ref="confirm_password" onChange={this.validatePass.bind(this)} className="form-control" type="password"  id="example-number-input" />
                     </div>
                     <div className="col-sm-12 form-group">
                        {/*<button className="btn-warning btn-block"> CHANGE PASSWORD</button>*/}
                       <input onClick={this.onPrivateDetailsSave.bind(this)} type="button" id="btnpvtSave" className="btn-warning btn-block" value="CHANGE PASSWORD" disabled = {!this.state.curPass||!this.state.newPass||this.state.errM||!this.state.rePass ||this.state.buttonDisable1}/>
                     </div>
                  </div>):
                  ((this.state.type==3)?(<div className="col-sm-12 min-display">
                      <form id="notificationForm" className="panel panel-default" onClick={this.plusminusToggle}>

                    <div className="notify-header"><span onClick={this.onChangeType.bind(this, 0)} className=" glyphicon glyphicon-chevron-left cursor-pointer clrwhite"></span><span className="paddingLeft">PUSH NOTIFICATION</span>
                     <input onClick={this.onNotificationDetailsSave.bind(this)} type="button" className="btn Savebtn" value="Save" disabled = {this.state.buttonDisable2}/>
                    </div>
                    <h4>Notify me when someone:</h4><br/>

                   <div className="col-sm-12 form-group push-notify-form">
                     <span >Likes Your Post</span>
                     <label className="push-noti-switch ">
                     <input name="notify_like_post" ref="notify_like_post" type="checkbox" defaultChecked={this.state.NotificatonDetails.notify_like_post} onChange={this.chkboxUnable.bind(this)}/>
                         <div className="slider round"></div>
                     </label>
                    </div>
                    <div className="col-sm-12 form-group push-notify-form">
                      <span>Comment On Your Post </span>
                      <label className="push-noti-switch ">
                        {/*<input name="notify_comment_post" ref="notify_comment_post" type="checkbox" defaultChecked={this.state.NotificatonDetails.notify_like_post} onChange={this.chkboxUnable.bind(this)}/>*/}
                           <input name="notify_comment_post" ref="notify_comment_post" type="checkbox" defaultChecked={this.state.NotificatonDetails.notify_comment_post} onChange={this.chkboxUnable.bind(this)}/>
                          <div className="slider round"></div>
                      </label>
                     </div>
                     
                        <div className="col-sm-12 form-group push-notify-form">
                          <span>Invites you</span>
                          <label className="push-noti-switch ">
                          {/*<input name="notify_invite_event" ref="notify_invite_event" type="checkbox" defaultChecked={this.state.NotificatonDetails.notify_like_post} onChange={this.chkboxUnable.bind(this)}/>*/}
                             <input name="notify_invite_event" type="checkbox" ref="notify_invite_event" defaultChecked={this.state.NotificatonDetails.notify_invite_event} onChange={this.chkboxUnable.bind(this)} />
                             <div className="slider round"></div>
                          </label>
                         </div>
                         <div className="col-sm-12 form-group push-notify-form">
                           <span>Accepts yout invitation </span>
                           <label className="push-noti-switch ">
                           {/*<input name="notify_accept_invitation" ref="notify_accept_invitation" type="checkbox" defaultChecked={this.state.NotificatonDetails.notify_like_post} onChange={this.chkboxUnable.bind(this)}/>*/}
                              <input name="notify_accept_invitation" type="checkbox" ref="notify_accept_invitation" defaultChecked={this.state.NotificatonDetails.notify_accept_invitation} onChange={this.chkboxUnable.bind(this)} />
                               <div className="slider round"></div>
                           </label>
                          </div>
                         <div className="col-sm-12 form-group push-notify-form">
                         <span>Updates an event</span>
                         <label className="push-noti-switch ">
                         {/*<input name="notify_event_updates" ref="notify_event_updates" type="checkbox" defaultChecked={this.state.NotificatonDetails.notify_like_post} onChange={this.chkboxUnable.bind(this)}/>*/}
                            <input name="notify_event_updates" type="checkbox" ref="notify_event_updates" defaultChecked={this.state.NotificatonDetails.notify_event_updates} onChange={this.chkboxUnable.bind(this)}/>
                             <div className="slider round"></div>
                         </label>
                        </div>
                        <div className="col-sm-12 form-group push-notify-form">
                          <span>Updates a group</span>
                          <label className="push-noti-switch ">
                          {/*<input name="notify_group_updates" ref="notify_group_updates" type="checkbox" defaultChecked={this.state.NotificatonDetails.notify_like_post} onChange={this.chkboxUnable.bind(this)}/>*/}
                             <input name="notify_group_updates" type="checkbox" ref="notify_group_updates" defaultChecked={this.state.NotificatonDetails.notify_group_updates} onChange={this.chkboxUnable.bind(this)} />
                              <div className="slider round"></div>
                          </label>
                         </div>
                          </form>
                  </div>):(<div className="min-display">
                      <form id="emailForm" className="panel panel-default" onClick={this.plusminusToggle}>

                    <div className="header"> <span onClick={this.onChangeType.bind(this,0)} className=" glyphicon glyphicon-chevron-left cursor-pointer clrwhite"></span><span className="paddingLeft">EMAILS</span>
                      <input onClick={this.onEmailDetailsSave.bind(this)} type="button" className="btn Savebtn" value="Save" disabled = {this.state.buttonDisable3}/>
                    </div>
                    <h4>Which emails do you want to recieve?</h4><br/>
                    <div className="col-sm-12 form-group push-notify-form">
                      <span>Invitation</span>
                      <label className="email-switch ">
                      {/*<input name="notify_like_post" ref="notify_like_post" type="checkbox" defaultChecked={this.state.NotificatonDetails.notify_like_post} onChange={this.chkboxUnable.bind(this)}/>*/}
                         <input type="checkbox" name="email_invitation" ref="email_invitation"  defaultChecked={this.state.EmailDetails.email_invitation} onChange={this.chkboxUnable.bind(this)}/>
                          <div className="slider round"></div>
                      </label>
                     </div>
                     <div className="col-sm-12 form-group push-notify-form">
                       <span>Messages </span>
                       <label className="email-switch ">
                       {/*<input name="notify_like_post" ref="notify_like_post" type="checkbox" defaultChecked={this.state.NotificatonDetails.notify_like_post} onChange={this.chkboxUnable.bind(this)}/>*/}
                          <input type="checkbox" name="email_messages" ref="email_messages" defaultChecked={this.state.EmailDetails.email_messages} onChange={this.chkboxUnable.bind(this)}/>
                           <div className="slider round"></div>
                       </label>
                      </div>
                      <div className="col-sm-12 form-group push-notify-form">
                        <span>Notifications </span>
                        <label className="email-switch ">
                        {/*<input name="notify_like_post" ref="notify_like_post" type="checkbox" defaultChecked={this.state.NotificatonDetails.notify_like_post} onChange={this.chkboxUnable.bind(this)}/>*/}
                           <input type="checkbox" name="email_notifications" ref="email_notifications" defaultChecked={this.state.EmailDetails.email_notifications} onChange={this.chkboxUnable.bind(this)}/>
                            <div className="slider round"></div>
                        </label>
                       </div>
                       
                         <div className="col-sm-12 form-group push-notify-form">
                           <span>Golf connectx message</span>
                           <label className="email-switch ">
                           {/*<input name="notify_like_post" ref="notify_like_post" type="checkbox" defaultChecked={this.state.NotificatonDetails.notify_like_post} onChange={this.chkboxUnable.bind(this)}/>*/}
                              <input type="checkbox" name="email_site_messages" ref="email_site_messages" defaultChecked={this.state.EmailDetails.email_site_messages} onChange={this.chkboxUnable.bind(this)}/>
                               <div className="slider round"></div>
                           </label>
                          </div>
                          </form>
                    </div>
                  ))))}
        </div>
        <div className="container display">
          {(this.state.ajaxCallInProgress)?(<div className="mt25pc"><Spinner /></div>):(<div className="">
            <div className="Headerdiv">ACCOUNT SETTINGS</div>
            {/*{(this.state.isShowCropper) && (<div className="col-sm-6">
                                
                                    <input type="button"  className=" btn btnSecondary" value="Upload" onClick={this.uploadFile.bind(this)}/>
                                    <input type="button" className=" btn btnSecondary" value="Cancel" onClick={this.onCacelCrop.bind(this)}/>
                                    <br/>
                                  <div className="cropperImg">
                                      <Cropper  src={this.state.cropImageSrc} ref="cropper" width={300} height={300} fixedRatio={false} allowNewSelection={false}
                                      onChange={values => this.handleCropChange(values)} />
                                    </div>
                                    

                      </div>)}*/}
              <div id="accordion" role="tablist" aria-multiselectable="true" className={this.state.isShowCropper?'display-none':''}>
                <form ref="profileForm" id="profileForm" className="panel panel-default"  encType="multipart/form-data" onClick={this.plusminusToggle}>
                  <div className="header cursor-pointer" role="tab" id="headingOne" onClick={this.changeCollapseIco.bind(this)}>
                    <h5 className="mb-0 Titles" id="sec1"  data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      My Clubhouse
                      <span id="headingOneSpan" className="glyphicon glyphicon-minus fr" ></span>
                    </h5>
                  </div>
                  <div id="collapseOne" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                    <div className="alignForm">
                      <div className="formdiv">
                        <div className="form-group row">
                          <label htmlFor="example-text-input" className="col-xs-2 col-form-label">First Name:</label>
                          <div className="col-xs-4">
                            <input name="first_name" className="form-control" ref="first_name" type="text" id="example-text-input" defaultValue={this.state.Profile.first_name} onChange={this.onRequired.bind(this)} onKeyPress={this.onlyTexts.bind(this)} />
                          </div>
                          {this.state.a}
                        </div>
                        <div className="form-group row">
                          <label htmlFor="example-search-input" className="col-xs-2 col-form-label">Last Name:</label>
                          <div className="col-xs-4">
                            <input name="last_name" className="form-control" type="text" ref="last_name" id="example-search-input"  defaultValue={this.state.Profile.last_name} onChange={this.onRequired.bind(this)} onKeyPress={this.onlyTexts.bind(this)}/>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label htmlFor="example-email-input" className="col-xs-2 col-form-label">Email:</label>
                          <div className="col-xs-4">
                            <input name="email" className="form-control" type="email"  id="example-email-input" defaultValue={this.state.Profile.email} readOnly/>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label htmlFor="example-url-input" className="col-xs-2 col-form-label">Phone:</label>
                          <div className="col-xs-4">
                            <input name="phone" className="form-control" type="text" ref="phone"  id="example-url-input"  defaultValue={this.state.Profile.phone} onChange={this.onRequired.bind(this)} onKeyPress={this.minLenghtFun.bind(this)} />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label htmlFor="example-url-input" className="col-xs-2 col-form-label">Zip Code:</label>
                          <div className="col-xs-4">
                            <input name="zipcode" className="form-control" type="text" ref="zipcode"  id="example-url-input" defaultValue={this.state.Profile.zipcode} onChange={this.onRequired.bind(this)} onKeyPress={this.minLenghtZipCodeFun.bind(this)} />
                          </div>
                        </div>
                        <div>
                           <span className="PvtLabel">Would you like to have a private account?</span>
                        </div>
                        <div className="pvtdiv">
                          <div className="col-sm-12 zeroPad">
                            <div className="form-group row ">
                              <div className="col-xs-2 pdlft0px">
                                <span className="lblPvtAcc">Private Account:</span>
                              </div>
                              <div className="col-xs-4 pdlft0px">
                                <label className="switch">
                                  <input name="is_private" type="checkbox" ref="is_private" defaultChecked={this.state.Profile.is_private} onChange={this.chkboxUnable.bind(this)}/>
                                  <div className="slider round"></div>
                                </label>
                              </div>
                            </div>
                            <div className="form-group row mt25px">
                              <div className="col-xs-2 pdlft0px">
                                <span className="lblSkillLvl lbls"><label for="skillLevel">Skill Level:</label></span>
                              </div>
                              <div className="col-xs-4 pdlft0px">
                                <select className="form-control" ref="skill" defaultValue={this.state.Profile.skill_level} id="skillLevel" name="skill_level"  onChange={this.chkboxUnable.bind(this)} >
 {isExistObj(this.state.Skills) && isExistObj(this.state.Skills.skill_levels) && _.size(this.state.Skills)>0 && this.state.Skills.skill_levels.map((item, i) => {
                                              return(
                                              <option  key={i} >{item.name}</option >);
                                          })}
                                </select>
                              </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-xs-2 pdlft0px">
                                <span className="lblHndicp lbls"><label for="handiCap">Handicap:{this.state.Profile.handicap}</label></span>
                              </div>
                              <div className="col-xs-4 pdlft0px">

 
            <input name="handicap" ref="handicap" type="range" min="-40" max="40"  value={this.state.Profile.handicap} step="1" onChange={this.onSliderRangeChange.bind(this)} />

            {/*<input type="text" defaultValue={this.state.Profile.handicap} min="0" max="40" name="handicap" ref="handicap" className="form-control txtaria" placeholder="handicap value" onKeyPress={this.minLenghtFun.bind(this)} onBlur={this.handicapControl.bind(this)} onChange={this.handicapErrMsg.bind(this)}/>*/}

            {this.state.handicapError}

            </div>
                            </div>
                            <div className="form-group row">
                              <div className="col-xs-2 pdlft0px">
                                <span className="lblTypGolf lbls"><label for="golfType">Type of Golfer:</label></span>
                              </div>
                              <div className="col-xs-4 pdlft0px">
                                <select className="form-control" id="golfType" name="golfer_type" ref="golfer" defaultValue={this.state.Profile.golfer_type} onChange={this.chkboxUnable.bind(this)}>
                               { isExistObj(this.state.Skills) && isExistObj(this.state.Skills.golfer_types) && _.size(this.state.Skills)>0 && this.state.Skills.golfer_types.map((item, i) => {
                                              return(
                                              <option key={i} >{item.name} </option >);
                                          })}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-group row">
                          <input type="button"  className="btn Savebtn" value="Save Changes" disabled={ this.state.a || this.state.lnameErr || this.state.phoneErr ||this.state.zipErr ||this.state.isSaveInProgress || this.state.buttonDisable4 } onClick={this.onProfileDetailsSave.bind(this)}/>
                          {/*<input type="button" className="btn Savebtn" value="Save Changes" disabled={ !this.state.newPass ||!this.state.rePass || !this.state.curPass || this.state.a ||this.state.errM || this.state.isSaveInProgress || this.state.buttonDisable4 } onClick={this.onProfileDetailsSave.bind(this)}/>*/}
                          <input type="button" className=" Savebtn" value="Cancel" name="cancel1" onClick={this.onCancelchangeIcon.bind(this)}/>
                        </div>
                      </div>
                      <div className="NameInitials">
                        <img src={this.state.profileImage} className="brdrRad50pc wdht85px mb1pc" />
                        <input ref="file" id="file" type="file" name="file" className="upload-file form-control" onChange={this.onImageChange.bind(this)} accept="image/*" className=" btn ImgUpload"/>
                        <div className="btnPhoto">
                          <input type="button" className=" btnUploadPhoto1" value="Upload a Photo" />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                <form id="privateAccountForm" className="panel panel-default cursor-pointer" onClick={this.plusminusToggle}>
                  <div className="card-header" role="tab" ref="col2" id="headingTwo" onClick={this.changeCollapseIco2.bind(this)}>
                    <h5 className="mb-0 Titles collapsed" id="sec2" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                        Change Password
                      <span id="headingTwoSpan" className="glyphicon glyphicon-plus fr"></span>
                    </h5>
                  </div>
                  <div id="collapseTwo" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                    <div className="card-block pdleft20px mt25px">
                      <div className="form-group row">
                        <span htmlFor="example-tel-input" className="col-xs-2 col-form-label fnt16px">Current Password:</span>
                        <div className="col-xs-4">
                          <input name="password" value={this.state.curPass} ref="cur_password" onChange={this.validatePass.bind(this)} className="form-control" type="password"  id="example-tel-input" />
                        </div>
                      </div>
                      <div className="form-group row">
                        <span htmlFor="example-password-input" className="col-xs-2 col-form-label fnt16px">New Password:</span>
                        <div className="col-xs-4">
                          <input name="new_password" value={this.state.newPass} ref="new_password"  onChange={this.validatePass.bind(this)} className="form-control" type="password"  id="example-password-input" />
                        </div>
                      </div>
                      <div className="form-group row">
                        <span htmlFor="example-number-input" className="col-xs-2 col-form-label fnt16px">Confirm New Password:</span>
                        <div className="col-xs-4">
                           <input name="confirm_password" value={this.state.rePass} ref="confirm_password" onChange={this.validatePass.bind(this)} className="form-control" type="password"  id="example-number-input" />
                        </div>
                        {this.state.errM}
                      </div>
                      <div className="form-group row buttonsdiv">
                        <input onClick={this.onPrivateDetailsSave.bind(this)} type="button" id="btnpvtSave" className="btn Savebtn" value="Save Changes" disabled = {!this.state.curPass||!this.state.newPass||this.state.errM||!this.state.rePass ||this.state.buttonDisable1}/>
                        <input type="button" className=" Savebtn" value="Cancel" name = "cancel2" onClick={this.onCancelchangeIcon2.bind(this)}/>
                      </div>
                    </div>
                  </div>
                </form>
                <form id="notificationForm" className="panel panel-default" onClick={this.plusminusToggle}>
                  <div className="card-header cursor-pointer" role="tab" id="headingThree" onClick={this.changeCollapseIco3.bind(this)}>
                    <h5 className="mb-0 Titles collapsed" id="sec3" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                         Notifications
                     <span id="headingThreeSpan" className="glyphicon glyphicon-plus fr" ></span>
                    </h5>
                  </div>
                  <div id="collapseThree" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                    <div className="card-block">
                      <div>
                        <span className="PvtLabel">Notify me when someone:</span>
                      </div>
                <div className="row">
                    <div className="col-sm-6">
                          <div className="notify">
                            <div className="col-sm-8">
                              <span className="notifyLabel">Likes your post</span>
                            </div>
                            <div className="col-sm-4">
                              <label className="switch rightAlign">
                                <input name="notify_like_post" ref="notify_like_post" type="checkbox" defaultChecked={this.state.NotificatonDetails.notify_like_post} onChange={this.chkboxUnable.bind(this)}/>
                                <div className="slider round"></div>
                              </label>
                            </div>
                          </div>
                          <div className="notify">
                            <div className="col-sm-8">
                              <span className="notifyLabel">Comments on your post</span>
                            </div>
                            <div className="col-sm-4">
                              <label className="switch rightAlign">
                                <input name="notify_comment_post" ref="notify_comment_post" type="checkbox" defaultChecked={this.state.NotificatonDetails.notify_comment_post} onChange={this.chkboxUnable.bind(this)}/>
                                <div className="slider round"></div>
                              </label>
                            </div>
                          </div>
                        <div className="notify">
                          <div className="col-sm-8">
                            <span className="notifyLabel">Updates a group</span>
                          </div>
                          <div className="col-sm-4 pdbtm20px">
                            <label className="switch rightAlign">
                              <input name="notify_group_updates" type="checkbox" ref="notify_group_updates" defaultChecked={this.state.NotificatonDetails.notify_group_updates} onChange={this.chkboxUnable.bind(this)} />
                              <div className="slider round"></div>
                            </label>
                         </div>
                       </div>
                 </div>


                 <div className="col-sm-6">
                      <div className="notify">
                         <div className="col-sm-8">
                            <span className="notifyLabel">Invites you</span>
                         </div>
                         <div className="col-sm-4">
                              <label className="switch ">
                                <input name="notify_invite_event" type="checkbox" ref="notify_invite_event" defaultChecked={this.state.NotificatonDetails.notify_invite_event} onChange={this.chkboxUnable.bind(this)} />
                                <div className="slider round"></div>
                              </label>
                            </div>
                          </div>
                          <div className="notify">
                            <div className="col-sm-8">
                              <span className="notifyLabel">Accepts your invitation</span>
                            </div>
                            <div className="col-sm-4">
                              <label className="switch rightAlign">
                                <input name="notify_accept_invitation" type="checkbox" ref="notify_accept_invitation" defaultChecked={this.state.NotificatonDetails.notify_accept_invitation} onChange={this.chkboxUnable.bind(this)} />
                                <div className="slider round"></div>
                              </label>
                            </div>
                          </div>
                    <div className="notify">
                      <div className="col-sm-8">
                          <span className="notifyLabel">Updates an event</span>
                      </div>
                      <div className="col-sm-4 pdbtm20px" >
                        <label className="switch rightAlign">
                          <input name="notify_event_updates" type="checkbox" ref="notify_event_updates" defaultChecked={this.state.NotificatonDetails.notify_event_updates} onChange={this.chkboxUnable.bind(this)}/>
                            <div className="slider round"></div>
                        </label>
                      </div>
                    </div>
                      {/*<div className="notify">
                      <div className="col-sm-8">
                       <span className="notifyLabel">Joins an event you are attending</span>
                      </div>
                      <div className="col-sm-4">
                      <label className="switch rightAlign">
                      <input name="notify_event_join" type="checkbox" ref="notify_event_join" defaultChecked={this.state.NotificatonDetails.notify_event_join} onChange={this.chkboxUnable.bind(this)}/>
                          <div className="slider round"></div>
                      </label>
                           </div>
                      </div>*/}
                          <br/>
                        </div>
                      </div>
                      <div className="form-group row buttonsdiv">
                        <input onClick={this.onNotificationDetailsSave.bind(this)} type="button" className="btn Savebtn" value="Save Changes" disabled = {this.state.buttonDisable2}/>
                        <input type="button" className=" Savebtn" value="Cancel" name="cancel3" onClick={this.onCancelchangeIcon3.bind(this)}/>
                      </div>
                    </div>
                  </div>
                </form>
                <form id="emailForm" className="panel panel-default" onClick={this.plusminusToggle}>
                  <div className="card-header cursor-pointer" role="tab" id="headingFour" onClick={this.changeCollapseIco4.bind(this)}>
                    <h5 className="mb-0 Titles collapsed" id="sec4" data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                        Emails
                     <span id="headingFourSpan" className="glyphicon glyphicon-plus fr" ></span>
                    </h5>
                  </div>
                  <div id="collapseFour" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFour">
                    <div className="card-block">
                      <div>
                        <span className="PvtLabel">I would like to recieve emails when the following occurs:</span>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="notify">
                            <div className="col-sm-6">
                              <span className="notifyLabel">Invitations</span>
                            </div>
                            <div className="col-sm-4">
                              <label className="switch rightAlign">
                                <input type="checkbox" name="email_invitation" ref="email_invitation"  defaultChecked={this.state.EmailDetails.email_invitation} onChange={this.chkboxUnable.bind(this)}/>
                                <div className="slider round"></div>
                              </label>
                            </div>
                            <div className="col-sm-offset-2" ></div>
                          </div>
                          <div className="notify">
                            <div className="col-sm-6">
                              <span className="notifyLabel">Messages</span>
                            </div>
                            <div className="col-sm-4">
                              <label className="switch rightAlign">
                                <input type="checkbox" name="email_messages" ref="email_messages" defaultChecked={this.state.EmailDetails.email_messages} onChange={this.chkboxUnable.bind(this)}/>
                                <div className="slider round"></div>
                              </label>
                            </div>
                            <div className="col-sm-offset-2" ></div>
                          </div>
                          {/*<div className="notify">
                            <div className="col-sm-6">
                              <span className="notifyLabel">Notifications</span>
                            </div>
                            <div className="col-sm-4">
                              <label className="switch rightAlign">
                                <input type="checkbox" name="email_notifications" ref="email_notifications" defaultChecked={this.state.EmailDetails.email_notifications} onChange={this.chkboxUnable.bind(this)}/>
                                <div className="slider round"></div>
                              </label>
                            </div>
                            <div className="col-sm-offset-2" ></div>
                          </div>*/}
                          </div>
                          <div className="col-sm-6 emaildiv">
                            {/*<div className="notify">
                              <div className="col-sm-6">
                               <span className="notifyLabel">Event Updates</span>
                              </div>
                              <div className="col-sm-4">
                                <label className="switch ">
                                  <input type="checkbox" name="email_email_updates" ref="email_email_updates" defaultChecked={this.state.EmailDetails.email_email_updates} onChange={this.chkboxUnable.bind(this)}/>
                                  <div className="slider round"></div>
                                </label>
                              </div>
                              <div className="col-sm-offset-2" ></div>
                            </div>*/}
                            
                            {/*<div className="notify">
                              <div className="col-sm-6">
                                <span className="notifyLabel">Group Updates</span>
                              </div>
                              <div className="col-sm-4">
                                <label className="switch rightAlign">
                                  <input type="checkbox" name="email_group_updates" ref="email_group_updates" defaultChecked={this.state.EmailDetails.email_group_updates} onChange={this.chkboxUnable.bind(this)}/>
                                  <div className="slider round"></div>
                                </label>
                              </div>
                              <div className="col-sm-offset-2" ></div>
                            </div>*/}
                            <div className="notify">
                              <div className="col-sm-6">
                                 <span className="notifyLabel">Notifications</span>
                              </div>
                              <div className="col-sm-4 pdbtm20px">
                                  <label className="switch rightAlign">
                                      <input type="checkbox" name="email_notifications" ref="email_notifications" defaultChecked={this.state.EmailDetails.email_notifications} onChange={this.chkboxUnable.bind(this)}/>
                                      <div className="slider round"></div>
                                  </label>
                             </div>
                             <div className="col-sm-offset-2" ></div>
                           </div>
                           <div className="notify">
                              <div className="col-sm-6">
                                <span className="notifyLabel">Golf Connectx Messages</span>
                              </div>
                              <div className="col-sm-4">
                                <label className="switch rightAlign">
                                  <input type="checkbox" name="email_site_messages" ref="email_site_messages" defaultChecked={this.state.EmailDetails.email_site_messages} onChange={this.chkboxUnable.bind(this)}/>
                                  <div className="slider round"></div>
                                </label>
                              </div>
                              <div className="col-sm-offset-2" ></div>
                            </div>
                            <br/>
                          </div>
                        </div>
                        <div className="form-group row buttonsdiv">
                          <input onClick={this.onEmailDetailsSave.bind(this)} type="button" className="btn Savebtn" value="Save Changes" disabled = {this.state.buttonDisable3}/>
                          <input type="button" className="Savebtn" value="Cancel" name="cancel4" onClick={this.onCancelchangeIcon4.bind(this)}/>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                
              </div>)}
            </div>

{(this.state.isShowCropper) && 
        (<div className="container mqMarginLeft"><div className="col-sm-8">
                                
                                    <input type="button"  className=" btn btnSecondary mb3pc" value="Upload" onClick={this.uploadFile.bind(this)}/>
                                    <input type="button" className=" btn btnSecondary mb3pc" value="Cancel" onClick={this.onCacelCrop.bind(this)}/>
                                    <br/>
                                  <div className="cropperImg">
                                      <Cropper  src={this.state.cropImageSrc} ref="cropper" width={300} height={300} fixedRatio={false} allowNewSelection={false}
                                      onChange={values => this.handleCropChange(values)} />
                                    </div>
                                    

                      </div></div>)}

          </div>)}
        </div>
        );
        }

        else

        {

            return(<div></div>);

        }

    }

}

AccountSettings.contextTypes = {

  router: React.PropTypes.object.isRequired,



};





function mapStateToProps(state) {

    return {

        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),

        accountDetails:state.accountDetails

    };

}



function matchDispatchToProps(dispatch){



    return bindActionCreators({getAccountSettingsDetails,saveProfileDetails, savePrivateDetails, saveNotificationDetails, saveEmailDetails, uploadFile, getSkillset, updateUserProfileImage}, dispatch);

}



export default  connect(mapStateToProps, matchDispatchToProps)(AccountSettings);