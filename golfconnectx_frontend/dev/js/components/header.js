import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {savePostDetails, getPostList} from '../actions/postAction';
import {getNotificationsCount, invite, searchAll, showHideSearchCriteria} from '../actions/headerAction';
import {getGolfConnectXmembers} from '../actions/friendsAction.js';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import {getMessages} from '../actions/messagesAction';
import {getNotifications} from '../actions/notificationAction';
import _ from 'lodash';
var serialize = require('form-serialize');
import {isExistObj} from '../utils/functions';

import { Link } from 'react-router';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {userSignOut} from '../actions/loginAction';
import {isValidEmail} from '../utils/Validation';
import {contactUs} from '../actions/loginAction';
import InviteModal from './child-components/InviteModal';

class Header extends React.Component {
    constructor(props, context) {
    super(props, context);
        this.state={
          PostData:{},
          PostList : {},
          GroupList: (props.savePost!=undefined && props.savePost!=null && _.size(props.savePost)>0 && _.size(props.savePost.groups)>0)?(props.savePost.groups):([]),
           EventList: (props.savePost!=undefined && props.savePost!=null && _.size(props.savePost)>0 && _.size(props.savePost.events)>0)?(props.savePost.events):([]),
          notificationCount: 0,
          isGroupSelected: true,
          errEmail:"",
          errTitle :"",
          email:"",
          inviteMsg:"",
          titleMsg:"",
          contentMsg:"",
          members: Object.assign([], props.friends),
          buttonDisable1 : true,
          buttonDisable2 : true,
          modalView : false,
          
          headerMenuShow:true,
           profile_image_url: '',
           
           modalViewMobile:false

        };
        this.onFieldChange=this.onFieldChange.bind(this);
  }
GetMessages(){
    this.props.getMessages(this.props.activeUser.token);
  }

  GetNotifications(){
    this.props.getNotifications(this.props.activeUser.token);
  }
  


    getCount(){
       this.props.getNotificationsCount(this.props.activeUser.token).then((notificationLength)=>{
            this.setState({notificationCount:notificationLength});
          }).catch((error)=>{
       });
    }

    getNotificationsCount(){
        var self = this;

           setTimeout(function() {
                       self.getCount(); // do it once and then start it up ...
                       self._timer = setInterval(self.getCount.bind(self), 30000);
             }, 10000);
    }

    componentWillUnmount(){

      if (this._timer) {
          clearInterval(this._timer);
          this._timer = null;
        }


    }

    componentDidMount(){
      if(screen.width<769)
       
      {
      if(location.pathname=="/accountSettings")
      {
        $(".MobileNav").hide();
        $(".sidebar").hide();
         if($(".minGlobalSearch").css('height')==='27px')
      {      
        $(".minGlobalSearch").animate({ height:'0px'});
     }

        
      }
      
      if(window.location.href.indexOf("notifications") > -1){

         $(".MobileNav").hide();
        $(".sidebar").show();
        $(".minGlobalSearch").hide();
         $(".Gsearch").hide();
      $(".searchBtn").hide();

      }
      if(location.pathname=="/notifications" || location.pathname=="/messages" || location.pathname=="/newMessage"||window.location.href.indexOf("forum") > -1||window.location.href.indexOf("viewMessage_")>-1)

      {
        $(".MobileNav").hide();
        $(".sidebar").show();
         $(".minGlobalSearch").hide();
          $(".Gsearch").hide();
          $(".searchBtn").hide();
        
      }
    }
        this.getNotificationsCount();
    }

    componentWillMount(){

      $(window).resize(function(){
          if ($(window).width() > 767)
          {          
           $(".MobileNav").hide();
           $(".sidebar").show();
          }
          if ($(window).width() < 769)
          {
           $(".MobileNav").show();
           $(".sidebar").show();
          }

      });

      $(window).on('popstate', function(event) {
        
          if(screen.width<769)
          {          
           $(".MobileNav").show();
           $(".sidebar").show();

          }
         });

        this.props.getNotificationsCount(this.props.activeUser.token).then((notificationLength)=>{
              this.setState({notificationCount:notificationLength});

            }).catch((error)=>{
         });
        //  this.props.getPostList( this.props.activeUser.token).then(()=>{
        //     this.setState({PostList:this.props.savePost.PostList});
        //  }).catch((error)=>{
        //  });
       
       if(this.props.activeUser!=null){
         this.setState({profile_image_url: this.props.activeUser.profile_image_url});
       }
    }

    componentWillReceiveProps(nextProps){
      if(this.props.PostList!=nextProps.savePost){
             this.setState({PostList:this.props.savePost});
      }
      if((JSON.parse(sessionStorage.getItem('userDetails')))!=null){
        let _activeUser = JSON.parse(sessionStorage.getItem('userDetails'));
        this.setState({profile_image_url: _activeUser.profile_image_url});
      }else{
        let _activeUser = this.props.activeUser;
        this.setState({profile_image_url: _activeUser.profile_image_url});
      }
       {/*if(this.props.eventList!=nextProps.eventList){
          this.props.getPostList(this.props.activeUser.token).then(()=>{
                 this.setState({EventList:nextProps.savePost.events});
             }).catch((error)=>{
          });
      }
      this.setState({toggleSearch:this.props.toggleSearch});*/}
    }
    onRadioGroupChange(e, val){
        this.setState({isGroupSelected: e});
    }

    onFieldChange(e){
    }


    savePostInformation(formData){
      this.props.savePostDetails(formData, this.props.activeUser.token).then(()=>{
            this.setState({PostData:this.props.savePost});
            document.getElementById('title').value='';
            document.getElementById('body').value='';
            // $('#firstModal').modal('hide');
           if(screen.width<769){
             document.getElementById('title').value='';
            document.getElementById('body').value='';
            // $('#firstModalMobile').modal('hide');
           }

        }).catch((error)=>{
        });
    }

     onPostDetailsSave (){
       let form = document.querySelector('#postForm');
       let formData = serialize(form, { hash: true });
       if(formData.modal_post=="groups"){
         if(_.has(formData, 'title') && _.has(formData, 'body') && _.has(formData, 'group'))
         {
            $('#firstModal').modal('hide');
              
            this.savePostInformation(formData);
         }
         else{
            if(_.has(formData, 'group')){
                  toastr.error("Fill All The Required Fields");
            }else{
              toastr.warning("You are not yet a part of any group");
            }
         }
       }else if(formData.modal_post=="events"){
         if(_.has(formData, 'title') && _.has(formData, 'body') && _.has(formData, 'event'))
         {
            $('#firstModal').modal('hide');
           this.savePostInformation(formData);
         }
         else{
           if(_.has(formData, 'event')){
                 toastr.error("Fill All The Required Fields");
           }else{
             toastr.warning("You are not yet a part of any event");
           }
         }
       }
     }

onPostDetailsSaveMobile(){
       let form = document.querySelector('#postFormMobile');
       let formData = serialize(form, { hash: true });
       if(formData.modal_post=="groups"){
         if(_.has(formData, 'title') && _.has(formData, 'body') && _.has(formData, 'group'))
         {
           $('#firstModalMobile').modal('hide');    
           this.savePostInformation(formData);
         }
         else{
            if(_.has(formData, 'group')){
                  toastr.error("Fill All The Required Fields");
            }else{
              toastr.warning("You are not yet a part of any group");
            }
         }
       }else if(formData.modal_post=="events"){
         if(_.has(formData, 'title') && _.has(formData, 'body') && _.has(formData, 'event'))
         {
           $('#firstModalMobile').modal('hide');    
           this.savePostInformation(formData);
         }
         else{
           if(_.has(formData, 'event')){
                 toastr.error("Fill All The Required Fields");
           }else{
             toastr.warning("You are not yet a part of any event");
           }
         }
       }
     }

     onInvite(){
       let form = document.querySelector('#inviteForm');
       let formData = serialize(form, { hash: true });
       this.props.invite(formData, this.props.activeUser.token).then(()=>{
            document.getElementById('useremails').value='';
            document.getElementById('messagebody').value='';
            $('#secondModal').modal('hide');
         }).catch((error)=>{
         });
     }
     onInviteMobile(){
       let form = document.querySelector('#inviteFormMobile');
       let formData = serialize(form, { hash: true });
       this.props.invite(formData, this.props.activeUser.token).then(()=>{
            document.getElementById('useremailsMobile').value='';
            document.getElementById('messagebodyMobile').value='';
            $('#secondModalMobile').modal('hide');
         }).catch((error)=>{
         });
     }



  onSignOut(){
    this.props.userSignOut(this.props.activeUser.token).then(()=>{
        this.context.router.push('/');
    }).catch((error)=>{
        this.context.router.push('/');

    });
  }

  onSearchButtonClick(){
      let searchTxtValue =document.getElementById('searchCriteriaText').value;
      if(searchTxtValue != ""){
      this.props.searchAll(this.props.activeUser.token, searchTxtValue).then(()=>{
        this.context.router.push('/globalSearch_' + this.refs.globalsearch.value);
      }).catch((error)=>{
          
      });
      }
  }

  onGlobalSearch(e){
      if(e.target.value== "" && e.which == 13){
              e.preventDefault();
      }
      else{
           if(e.which==13)
         {
               this.props.searchAll(this.props.activeUser.token, e.target.value).then(()=>{
               this.context.router.push('/globalSearch_' + this.refs.globalsearch.value);

        }).catch((error)=>{
            
                  });
         }
      }
  }
  onPostClick(){
    if(screen.width<769){
      $('#firstModalMobile').modal('show');
     this.props.getPostList( this.props.activeUser.token).then(()=>{
            this.setState({PostList:this.props.savePost.PostList});
        }).catch((error)=>{

       });
    }

    $('#firstModal').modal('show');
     this.props.getPostList( this.props.activeUser.token).then(()=>{
            this.setState({PostList:this.props.savePost.PostList});
        }).catch((error)=>{

       });

  }
    onSendClick(){
             $("#contactUsbtnSend").prop({disabled:true});
           let form = document.querySelector('#contactForm');
           let formData = serialize(form, { hash: true });

           this.props.contactUs(formData).then(()=>{
                 $('#name').val('');
                 $("#email").val('');
                 $('#message').val('');
                 $('#contactMessage').val('');
                 $("#contactModal").modal('hide');
                 this.setState({
                    name:"",
                    email:"",
                    msg:""

                 });
             }).catch((error)=>{
             });
             if(screen.width<769){
               $("#contactUsbtnSendMobile").prop({disabled:true});
           let form = document.querySelector('#contactFormMobile');
           let formData = serialize(form, { hash: true });

           this.props.contactUs(formData).then(()=>{
                 $('#nameMobile').val('');
                 $("#emailMobile").val('');
                 $('#messageMobile').val('');
                 $('#contactMessageMobile').val('');
                 $("#contactModalMobile").modal('hide');
                 this.setState({
                    name:"",
                    email:"",
                    msg:""

                 });
             }).catch((error)=>{
             });

             }
    }

  onRequired(e){
       if(e.target.name == "useremails"|| e.target.name == "useremailsMobile"){
            let errors = isValidEmail(e.target.value);
             if(errors == false){
                    this.setState({
                    errEmail : (<span className="err-msg"> Invalid Email</span>),
                    email : "",
                    buttonDisable2: true
               });
            }
            else{
                     this.setState({
                    errEmail : "",
                    email : e.target.value,
                    buttonDisable2 : false
               });
            }
          }
  if(e.target.name == "messagebody" || e.target.name == "messagebodyMobile"){
            if(e.target.value == ""){
              this.setState({
                 inviteMsg : "",
                 buttonDisable2 : true
              });
            }
            else{
              this.setState({
                inviteMsg: e.target.value,
                buttonDisable2 : false
              });
            }
          }
       if(e.target.name == "title" ||e.target.name == "titleMobile"){
          if(e.target.value == ""){
              this.setState({
                    titleMsg : "",
                    errTitle : (<span className="err-msg"> Please enter the Title</span>),
                    buttonDisable1 : true
              });
            }
            else{
               this.setState({
                    errTitle : "",
                    titleMsg : e.target.value,
                    buttonDisable1 : false
              });
            }
          }
      if(e.target.name == "body"||e.target.name == "bodyMobile"){
            if(e.target.value == ""){
              this.setState({
                    contentMsg : "",
                    buttonDisable1 : true
              });
            }
            else{
               this.setState({
                    contentMsg : e.target.value,
                    buttonDisable1 : false
              });
            }
          }
        if(e.target.name == "name" ||e.target.name == "nameMobile"){
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
        if(e.target.name == "email"||e.target.name == "emailMobile"){
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
         if(e.target.name == "message"||e.target.name == "messageMobile"){
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
onCancelPost(){
  this.refs.title.value='';
   this.refs.body.value='';
  $('#firstModal').modal('hide');
  if(screen.width<769){
    $('#firstModalMobile').modal('hide');
    this.refs.titleMobile.value='';
   this.refs.bodyMobile.value='';
  }
}
onCancelInvite(){
  this.refs.useremails.value='';
   this.refs.messagebody.value='';
   this.state.errEmail='';
  $('#secondModal').modal('hide');
  if(screen.width<769)
  {
    this.refs.useremailsMobile.value='';
   this.refs.messagebodyMobile.value='';
   this.state.errEmail='';
  $('#secondModalMobile').modal('hide');
  }
}

   closeClick(status) {
    // $('.membersList').attr('checked', false); $('#friendsModal').modal('hide');
    this.setState({modalView: status});
  }

  callModal(){
    this.props.getGolfConnectXmembers(this.props.activeUser.token).then(() => {
       this.setState({members: this.props.friends.Members});
       this.setState({ajaxCallInProgress: false});
     }).catch((error) => {
       
       if (error == "Error: Request failed with status code 401") {
         this.context.router.push('/');
       }
     });
      this.setState({modalView : !this.state.modalView});
      if(screen.width<769){
        this.setState({modalViewMobile : !this.state.modalViewMobile});

      }
  }




  showMenuLabel(){
      switch(location.pathname){
        case '/home':return 'Home';
        case '/feed':   return 'Feed';
        case '/groups': return 'Groups';
        case '/forumsPage': return 'Groups';
        case '/events_': return 'Events';
        case '/courses_':return 'courses';
        case '/friends':return 'Friends';
        case '/profile_0':return 'Profile';
        case '/profile_1':return 'Profile';
        case '/profile_2':return 'Profile';
        case '/profile_3':return 'Profile';
        case '/profile_4':return 'Profile';
        case '/profileDetail_0':return 'Profile';
        case '/profileDetail_1':return 'Profile';
        case '/profileDetail_2':return 'Profile';
        case '/profileDetail_3':return 'Profile';
        case '/profileDetail_4':return 'Profile';
            }

  }
  hideMobileNav(){
    
   $(".MobileNav").hide();
   if(screen.width<769){
      
      $(".Gsearch").hide();
      $(".searchBtn").hide();
       if($(".minGlobalSearch").css('height')==='27px')
    {
      
      $(".minGlobalSearch").animate({ height:'0px'});
    }
    }
    {/*this.setState({toggleSearch:false});*/}

 }
 hideMobileNavSidebar(){
   $(".MobileNav").hide();
   $(".sidebar").hide();
    $('#toggleMenu').animate({right: '-769px'});

   {/* this.setState({toggleSearch:false});*/}
  }
  searchButton(){
    {/*let _search = !this.state.toggleSearch;
    this.setState({toggleSearch:_search});
    this.props.showHideSearchCriteria(_search);*/}

    $(".minGlobalSearch").animate({ height:'27px'});
    
    if($(".minGlobalSearch").css('height')==='27px')
    {
      
      $(".minGlobalSearch").animate({ height:'0px'});
    }
    $(".Gsearch").show();
      $(".searchBtn").show();
  
  }
  resetSearchCriteria(){
  {/*this.props.showHideSearchCriteria(flag);*/}
  }
  
  toggleMenu(){
    if(screen.width<992)
      {
      $('#toggleMenu').animate({right: '0px'});
     
    }
  }
    hideToggleMenu(){
      if(screen.width<992)
      {
      $('#toggleMenu').animate({right: '-769px'});

    }

  }

  


   render() {

      return (
         <div className="leftBody">
              <div className="MobileNav">
            <div className="NameOfScreen">
                  <span>{this.showMenuLabel()}</span>
            </div>
            {/*Mobile view part*/}

            <div className="geaderIconScreen ">
                 
                    <div className="inline-flex">

                    <button className="glyphicon glyphicon-search globalSearchIcon" onClick={this.searchButton.bind(this)}></button>
                    
                    <button className="postIcon"  data-toggle="modal" data-target="#" onClick={this.onPostClick.bind(this)}><img src="/assets/img/icons/POSTicon.png" className="postImgIcon"/></button>
                          <div className="modal fade addPost" id="firstModalMobile" role="dialog" data-backdrop="static">
                            <div className="modal-dialog">
                            <form id="postFormMobile">
                               <div className="modal-content">
                                   <div className="modal-header col-sm-12 bgGreen">Add Post</div>
                                   <div className="modal-body col-sm-12 bgwhite mb0px">

                                       <div className="chckbx radio">
                                              <span className="grp1 ttt"><label onClick={this.onRadioGroupChange.bind(this, true)} className="grp2 sss"><input defaultChecked={this.state.isGroupSelected} type="radio" value="groups" name="modal_post" onChange={this.onRadioGroupChange.bind(this, true)} id="grp3" className="inpt" />Group</label></span>
                                              <span className="evnt1 ttt"><label onClick={this.onRadioGroupChange.bind(this, false)} className="evnt2 sss"><input defaultChecked={!this.state.isGroupSelected} type="radio"  value="events" name="modal_post"  onChange={this.onRadioGroupChange.bind(this, false)} id="evnt3"  className="inpt"  />Event</label></span>
                                       </div>

                                       <div className="tab-content mtpbtm">
                                       <div id="groups"  className="tab-pane active yyy">
                                                {(this.state.isGroupSelected)?(<select className="form-control" onChange={this.onFieldChange} id="selection" name="group">
                                                  {isExistObj(this.props.savePost) && _.size(this.props.savePost)>0 && isExistObj(this.props.savePost.groups) && this.props.savePost.groups.map((item,i)=>{
                                                      return(<option key={i} value={item.id} id="grpList" className="selection">{item.name}</option>)
                                                    })}
                                                </select>):(
                                                <select className="form-control" id="selection" name="event" onChange={this.onFieldChange}>
                                                     {isExistObj(this.props.savePost) && isExistObj(this.props.savePost.events) && _.size(this.props.savePost)>0 && this.props.savePost.events.map((item,i)=>{
                                                      return(<option key={i} value={item.id} id="eventList" className="selection">{item.name}</option>);
                                                    })}
                                                </select>)}

                                      </div>
                                       </div>
                                       <div className="txtarea1 mtpbtm">
                                            <textarea className="txt-Title form-control" maxLength="100" placeholder= "Title*" id="titleMobile" name="title" ref="title" onChange={this.onRequired.bind(this)}></textarea></div>
                                            {this.state.errTitle}
                                       <div className="txtarea2 mtpbtm">
                                            <textarea className="txt-Body form-control" maxLength="1000" placeholder= "Content*" id="bodyMobile" name="body" ref="body" onChange={this.onRequired.bind(this)}></textarea>
                                       </div>

                                   </div>
                                  <div className="modal-footer col-sm-12 bgwhite">
                                    <input type="button" className=" btn btnPrimary " value="Post" id="btnSendMobile" onClick={this.onPostDetailsSaveMobile.bind(this)} disabled={this.state.buttonDisable1 || !this.state.titleMsg || !this.state.contentMsg }/>
                                    <input type="button" className=" btn btnSecondary " onClick={this.onCancelPost.bind(this)} value="Cancel" />
                                 </div>
                                </div>
                                </form>
                            </div>
                          </div>
                      {/*add friend dailog box start*/}
                    <button className="addFriendIcon"  onClick={this.callModal.bind(this)}><img src="/assets/img/icons/FriendIcon.png" className="headerInviteFriend"/></button>
                     {(this.state.modalViewMobile)
                                ? (
                                  <div>
                                    <InviteModal
                                    nameProp="Add Friends"
                         invite_type="Friend"
                                      membersForFriends={this.state.members}
                                      closeModal={this
                                      .closeClick
                                      .bind(this)}
                                      isFrom="1"/>
                                  </div>
                                )
                                : (
                                  <div></div>
                                )}

                            <div className="modal fade addInvite" id="secondModalMobile" role="dialog" data-backdrop="static">
                            <form action="" method="post" id="inviteFormMobile" name="inviteFormMobile" ref="inviteFormMobile">
                            <div className="modal-dialog  tpmdl">
                               <div className="modal-content">
                                   <div className="modal-header col-sm-12 bgGreen"><h4 className="m0px">INVITE NEW USER TO GOLF CONNECTX</h4></div>
                                   <div className="modal-body col-sm-12 bgwhite mb0px">
                                   <div className="col-sm-12">
                                      To:<input type="email" placeholder="abc@gmail.com" id="useremailsMobile" name="useremailsMobile" ref="useremailsMobile" className="invtSearch" onChange={this.onRequired.bind(this)}/>
                                   </div>
                                   {this.state.errEmail}
                                   <div className="col-sm-12">
                                    <textarea className="txtarea form-control invtTxtArea" id="messagebodyMobile" name="messagebodyMobile" ref="messagebodyMobile" maxLength="500" placeholder="Write Something..." onChange={this.onRequired.bind(this)} />
                                   </div>
                                   </div>
                                  <div className="modal-footer col-sm-12 bgwhite">
                                    <button type="button" className="btn butnSend" id="btnSend"  onClick={this.onInviteMobile.bind(this)} disabled={this.state.errEmail || !this.state.email || !this.state.inviteMsg}>Send</button>
                                    <button type="button" className="btn butnCncl" onClick={this.onCancelInvite.bind(this)}>Cancel</button>
                                 </div>
                                </div>
                            </div>
                            </form>
                          </div>

                        {/*  of add friend dailog box*/}
                    <Link to="/notifications">{(this.state.notificationCount>0)?(<span className="badge notifyCount"onClick={this.hideMobileNav.bind(this)}>{this.state.notificationCount}</span>):(<span></span>)}
                    <button className="notiButton m0px glyphicon glyphicon-bell notificationsIcon" onClick={this.hideMobileNav.bind(this)}></button></Link>
                  <Link to="/messages"><button className="chatbtn" onClick={this.hideMobileNav.bind(this)}> <span className="chatButton"><img src="/assets/img/icons/Chat_icon.png" className="mrgn9px"/></span></button></Link>
                  <button  className="settingicon" aria-expanded="true" onClick={this.toggleMenu.bind(this)}>
                  <span className="glyphicon glyphicon-cog">
                  </span></button>
                  </div>

                  

                 <div className=" right-side-menu" id="toggleMenu" >
                  <div> <ul id="rightsidebar" className="  list-group nav nav-navbar navbar-nav container-fluided   ">
                         <li className="img-background toggleImage"> 
                          <button   className="glyphicon glyphicon-chevron-right cursor-pointer settingicon clrwhite" onClick={this.hideToggleMenu.bind(this)}></button>
                          <img src="/assets/img/Golf_login_Logo.png" className="img-property" />

                                                </li>
                        <div className="clr-white right-nav  ">
                          <li onClick={this.hideMobileNavSidebar.bind(this)}><Link to="/accountSettings" className="list-group-item">Account Settings</Link></li>
                          <li><Link to="/profile_0" onClick={this.hideToggleMenu.bind(this)} className="list-group-item">My Club House</Link></li>
                          <li className="list-group-item clickable" type="button" onClick={this.hideToggleMenu.bind(this)} data-toggle="modal" data-target="#contactModalMobile">Contact Us</li>
                          <li className="list-group-item"  type="button" onClick={this.onSignOut.bind(this)}><span className="glyphicon glyphicon-log-out"></span> Sign-Out</li>
                          </div>
                  </ul> </div>
                  {/*cotact us model mobile*/}
                      <div className="modal fade addInvite conctactModalClass" id="contactModalMobile" role="dialog" data-backdrop="static">
                   
                           <form action="" method="post" id="contactFormMobile" name="contactFormMobile" ref="contactFormMobile">
                           <div className="modal-dialog modal-sm mt15pc">
                              <div className="modal-content">
                                  <div className="modal-header col-sm-12 modalHeader"><h4 className="m0px">Contact Admin</h4></div>
                                  <div className="modal-body col-sm-12 bgwhite mb0px">
                                  <div className="col-sm-12">
                                     <label>Name:</label><input type="text" placeholder="John Doe" id="nameMobile" name="nameMobile" className="form-control" onChange={this.onRequired.bind(this)}/>
                                     {this.state.errName}
                                  </div>
                                  <div className="col-sm-12">
                                     <label>Email:</label><input type="email" placeholder="abc@gmail.com" id="emailMobile" name="emailMobile" className="form-control" onChange={this.onRequired.bind(this)}/>
                                     {this.state.errEmail}
                                  </div>
                                  <div className="col-sm-12">
                                  <label>Message</label>
                                   <textarea className="txtarea form-control invtTxtArea" id="contactMessageMobile" name="messageMobile" onChange={this.onRequired.bind(this)}/>
                                  {this.state.errMsg}
                                  </div>
                                  </div>
                                 <div className="modal-footer col-sm-12 bgwhite">
                                   <button type="button" className="btn btnSend" id="contactUsbtnSendMobile" onClick={this.onSendClick.bind(this)} disabled={ !this.state.name || !this.state.email || !this.state.msg}>Send</button>
                                   <button type="button" className="btnCncl" data-dismiss="modal">Cancel</button>
                                </div>
                               </div>
                           </div>
                           </form>
                         </div>
               
               

                    {/*conctat us model mobile*/}
                         </div>

                 
            </div>

        </div>


    <div className="minGlobalSearch min-display col-sm-12 zeroPad">
      <div className="col-sm-12 pdlft0px">
        <input type="text" placeholder="Search for Groups, Posts, Events, Courses, People " className="Gsearch" onKeyPress={this.onGlobalSearch.bind(this)} ref="globalsearch"/>
        <button className="search-btn col-sm-1 searchBtn" onClick={this.onSearchButtonClick.bind(this)}>
          <span className="glyphicon glyphicon-search searchbtn-img"></span>
        </button>
      </div>
    </div>

{/*End of  mobileresposive*/}

          <nav>
            <div className="row col-sm-12 col-md-12 col-xs-12 zeroPad">
                <div className="col-sm-5 col-md-5 pdngryt0px mtp2pc">
                    <div className="col-sm-12 pdngryt0px">
                        <div className="searchBox col-sm-12 col-md-12 col-xs-12">
                          <div className="col-sm-11  col-md-11 col-xs-12 zeroPad">
                            <input id="searchCriteriaText" onKeyPress={this.onGlobalSearch.bind(this)}  type="text" placeholder="Search for Groups, Posts, Events, Courses, People" ref="globalsearch" />
                          </div>
                          <div className="col-sm-1 zeroPad">
                            <button className="search-btn"><span className="searchbtn-img"><img onClick={this.onSearchButtonClick.bind(this)} src="/assets/img/icons/Search_Icon.png"/></span></button>
                          </div>
                        </div>
                    </div>

                </div>
                <div className="col-sm-7 col-md-7 mt2pc">
                    <div className="col-sm-12 col-md-12">
                        <div className="navHeader">
                            <button className="pstbtn btnPost" data-toggle="modal" data-target="#" onClick={this.onPostClick.bind(this)}><img src="/assets/img/icons/POSTicon.png" className="postImgIcon"/>
                            <span  className="hideText">POST </span>


                            </button>
                            <div className="modal fade addPost" id="firstModal" role="dialog" data-backdrop="static">
                            <div className="modal-dialog">
                            <form id="postForm">
                               <div className="modal-content">
                                   <div className="modal-header col-sm-12 bgGreen">Add Post</div>
                                   <div className="modal-body col-sm-12 bgwhite mb0px">

                                       <div className="chckbx radio">
                                              <span className="grp1 ttt"><label onClick={this.onRadioGroupChange.bind(this, true)} className="grp2 sss"><input defaultChecked={this.state.isGroupSelected} type="radio" value="groups" name="modal_post" onChange={this.onRadioGroupChange.bind(this, true)} id="grp3" className="inpt" />Group</label></span>
                                              <span className="evnt1 ttt"><label onClick={this.onRadioGroupChange.bind(this, false)} className="evnt2 sss"><input defaultChecked={!this.state.isGroupSelected} type="radio"  value="events" name="modal_post"  onChange={this.onRadioGroupChange.bind(this, false)} id="evnt3"  className="inpt"  />Event</label></span>
                                       </div>

                                       <div className="tab-content mtpbtm">
                                       <div id="groups"  className="tab-pane active yyy">
                                                {(this.state.isGroupSelected)?(<select className="form-control" onChange={this.onFieldChange} id="selection" name="group">
                                                  {isExistObj(this.props.savePost) && _.size(this.props.savePost)>0 && isExistObj(this.props.savePost.groups) && this.props.savePost.groups.map((item,i)=>{
                                                      return(<option key={i} value={item.id} id="grpList" className="selection">{item.name}</option>)
                                                    })}
                                                </select>):(
                                                <select className="form-control" id="selection" name="event" onChange={this.onFieldChange}>
                                                     {isExistObj(this.props.savePost) && isExistObj(this.props.savePost.events) && _.size(this.props.savePost)>0 && this.props.savePost.events.map((item,i)=>{
                                                      return(<option key={i} value={item.id} id="eventList" className="selection">{item.name}</option>);
                                                    })}
                                                </select>)}

                                      </div>
                                       </div>
                                       <div className="txtarea1 mtpbtm">
                                            <textarea className="txt-Title form-control" maxLength="100" placeholder= "Title*" id="title" name="title" ref="title" onChange={this.onRequired.bind(this)}></textarea></div>
                                            {this.state.errTitle}
                                       <div className="txtarea2 mtpbtm">
                                            <textarea className="txt-Body form-control" maxLength="1000" placeholder= "Content*" id="body" name="body" ref="body" onChange={this.onRequired.bind(this)}></textarea>
                                       </div>

                                   </div>
                                  <div className="modal-footer col-sm-12 bgwhite">
                                    <input type="button" className=" btn btnPrimary " value="Post" id="btnSend" onClick={this.onPostDetailsSave.bind(this)} disabled={this.state.buttonDisable1 || !this.state.titleMsg || !this.state.contentMsg }/>
                                    <input type="button" className=" btn btnSecondary " onClick={this.onCancelPost.bind(this)} value="Cancel" />
                                 </div>
                                </div>
                                </form>
                            </div>
                          </div>
                        {/* desktop model*/}
                            <button className="btnfrndInvit"  onClick={this.callModal.bind(this)}><img src="/assets/img/icons/FriendIcon.png" className="headerInviteFriend"/>
                            <span  className="hideText"> Add Friends</span>
                            
                            </button>

                             {(this.state.modalView)
                                ? (
                                  <div>
                                    <InviteModal
                                    nameProp="Add Friends"
                  invite_type="Friend"
                                      membersForFriends={this.state.members}
                                      closeModal={this
                                      .closeClick
                                      .bind(this)}
                                      isFrom="1"/>
                                  </div>
                                )
                                : (
                                  <div></div>
                                )}

                            <div className="modal fade addInvite" id="secondModal" role="dialog" data-backdrop="static">
                            <form action="" method="post" id="inviteForm" name="inviteForm" ref="inviteForm">
                            <div className="modal-dialog  tpmdl">

                               <div className="modal-content">
                                   <div className="modal-header col-sm-12 bgGreen"><h4 className="m0px">INVITE NEW USER TO GOLF CONNECTX</h4></div>
                                   <div className="modal-body col-sm-12 bgwhite mb0px">
                                   <div className="col-sm-12">
                                      To:<input type="email" placeholder="abc@gmail.com" id="useremails" name="useremails" ref="useremails" className="invtSearch" onChange={this.onRequired.bind(this)}/>
                                   </div>
                                   {this.state.errEmail}
                                   <div className="col-sm-12">
                                    <textarea className="txtarea form-control invtTxtArea" id="messagebody" name="messagebody" ref="messagebody" maxLength="500" placeholder="Write Something..." onChange={this.onRequired.bind(this)} />
                                   </div>
                                   </div>
                                  <div className="modal-footer col-sm-12 bgwhite">
                                    <button type="button" className="btn butnSend" id="btnSend"  onClick={this.onInvite.bind(this)} disabled={this.state.errEmail || !this.state.email || !this.state.inviteMsg}>Send</button>
                                    <button type="button" className="btn butnCncl" onClick={this.onCancelInvite.bind(this)}>Cancel</button>
                                 </div>
                                </div>
                            </div>
                            </form>
                          </div>


                           <Link to="/notifications" onClick={this.GetNotifications.bind(this)} className="notifyLine">{(this.state.notificationCount>0)?(<span className="badge notifyCount">{this.state.notificationCount}</span>):(<span></span>)}<button className="notiButton m0px glyphicon glyphicon-bell notificationsIcon"></button></Link>
                           <Link to="/messages" onClick={this.GetMessages.bind(this)}><button className="chatbtn"> <span className="chatButton"><img src="/assets/img/icons/Chat_icon.png" className="mrgn9px"/></span></button></Link>

                                 {isExistObj(this.props.activeUser) && <button className="nzbtn"> <span className="accButton"><img src={'http://'+this.state.profile_image_url} className="profileImage"/></span></button>}

                        <div className="dropdown mt10px">
                                 <button className="dropdown-toggle " type="button" id="dd1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <span className="arrowButton"><img src="/assets/img/icons/Arrow_Icon.png" className="arwbtn"/></span></button>
                            <ul className="dropdown-menu dropdownContent" aria-labelledby="dd1">
                               <Link to="/profile_0"><li className="dropdown-item" type="button">My Clubhouse</li></Link>
                               <Link to="/accountSettings"> <li className="dropdown-item" type="button">Account Settings</li></Link>
                                    <li className="dropdown-item" type="button" data-toggle="modal" data-target="#contactModal">Contact Us</li>
                                   <li className="dropdown-item signout-chngs" type="button" onClick={this.onSignOut.bind(this)}><img src="/assets/img/icons/signout_icon.png" className="signout-icon" id="initial"/><img src="/assets/img/icons/signout_hover.png" className="hover-signout" id="onhover" />Sign Out</li>
                               </ul>
                            </div>
                              <div className="modal fade addInvite" id="contactModal" role="dialog" data-backdrop="static">
                           <form action="" method="post" id="contactForm" name="contactForm" ref="contactForm">
                           <div className="modal-dialog modal-sm mt15pc">
                              <div className="modal-content">
                                  <div className="modal-header col-sm-12 modalHeader"><h4 className="m0px">Contact Admin</h4></div>
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
                                   <button type="button" className="btn btnSend" id="contactUsbtnSend" onClick={this.onSendClick.bind(this)} disabled={ !this.state.name || !this.state.email || !this.state.msg}>Send</button>
                                   <button type="button" className="btnCncl" data-dismiss="modal">Cancel</button>
                                </div>
                               </div>
                           </div>
                           </form>
                         </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </div>

      );
   }
}

Header.contextTypes = {
  router: React.PropTypes.object.isRequired
};


function mapStateToProps(state) {

    return {
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
        savePost:state.savePost,
        friends: state.friends,
        getGroupList: (state.getgroupList!=undefined && state.getgroupList!=null)?state.getgroupList:[],
        eventList: (state.eventReducer!=null)?state.eventReducer:[],
        searchcriteriavisibility: state.searchcriteriavisibility? state.searchcriteriavisibility: false
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({userSignOut, savePostDetails, getNotificationsCount, invite, getPostList, searchAll, contactUs,getGolfConnectXmembers, getMessages, getNotifications, showHideSearchCriteria}, dispatch);
}

export default  connect(mapStateToProps, matchDispatchToProps)(Header);