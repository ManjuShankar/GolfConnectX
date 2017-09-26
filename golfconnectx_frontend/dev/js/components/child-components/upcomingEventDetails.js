import React, {Component} from 'react';
import _ from 'lodash';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {isValidEmail,isValidImage} from '../../utils/Validation';
import InviteModal from './InviteModal';

import Spinner from 'react-spinner';
import {getAttendeesList, getPostsByEventId, getGalleryByEventId, savePostsByEventId, addEventComment,
 getMayAttendList, getNotAttendList,getEventInvities,postInvitiesList,searchInvities, inviteViaEmail,
  deleteEventGallery, deletePost, deleteComment, deleteEventFile, getEventFile, CancelRequest, getCurrentEvent, onAttendingOrNotAttending} from '../../actions/eventDetailsAction';
import {SERVICE_URLS} from '../../constants/serviceUrl';
import {RequestInvite} from '../../actions/createEventAction';
import {deletePostPhoto, likePost} from '../../actions/groupListAction';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {isExistObj} from '../../utils/functions';
import moment from 'moment';

let paramId;

class UpcomingEventDetails extends Component{
constructor(props){
  super(props);
  this.state={
        courseId:"",
        attendees:[],
        Disable:'',
        galleryList:[],
        isAttendee: false,
        emailList: "",
        postMsg:"",
        postsList: [],
        mayAttend:[],
        notAttend:[],
        showimg:"",
        invities:[],
        buttonDisabled:"",
        teetime_file:[],
        imgArray:'',
        selectedIndex: 0,
        cimgArray:'',
        pimgId:'',
        cimgId:'',
        modalView: false, postId:'',commentId:'', gImgId:''
       };
       this.uploadTeatTimes=this.uploadTeatTimes.bind(this);
       this.uploadFile=this.uploadFile.bind(this);
}
    componentWillMount(){
        $(".cSpinner").hide();
    }
componentDidMount(){
    $(".cSpinner").hide();
}
componentWillReceiveProps(nextProps){
  if(this.props.upComingeventDetail!=null && nextProps.upComingeventDetail!=null && this.props.upComingeventDetail.id!=nextProps.upComingeventDetail.id){
    this.props.getPostsByEventId(nextProps.upComingeventDetail.id, this.props.activeUser.token, this.props.isFromAllEvents).then(()=>{
      this.setState({postsList: this.props.postsList});
      this.setState({selectedIndex:0});
    }).catch((error)=>{

    });
      this.props.getGalleryByEventId(nextProps.upComingeventDetail.id, this.props.activeUser.token, this.props.isFromAllEvents).then(()=>{
      this.setState({galleryList: this.props.gallery});
    }).catch((error)=>{

    });
    this.props.getEventFile(nextProps.upComingeventDetail.id, this.props.activeUser.token, this.props.isFromAllEvents).then(()=>{
      this.setState({teetime_file: this.props.selectedEvent.files});
    }).catch((error)=>{

    });
  }
}

getPosts(param=2){
 this.props.getPostsByEventId(this.props.selectedEvent.id, this.props.activeUser.token, this.props.isFromAllEvents).then(()=>{
      this.setState({postsList: this.props.postsList, selectedIndex:param});
 $(".cSpinner").hide();
    }).catch((error)=>{

    });
}

cancelRequest(){
 this.props.CancelRequest(this.props.selectedEvent.id, this.props.activeUser.token).then((data)=>{
      this.getEvent();
    }).catch((error)=>{

    });
}

getPeopleList(param=1){
      this.props.getAttendeesList(this.props.activeUser.token, this.props.selectedEvent.id, this.props.isFromAllEvents).then(()=>{
      this.setState({attendees: this.props.selectedEvent.attendeesList, selectedIndex:param});
    }).catch((error)=>{

});

this.props.getMayAttendList(this.props.activeUser.token, this.props.selectedEvent.id, this.props.isFromAllEvents).then(()=>{
      this.setState({mayAttend: this.props.selectedEvent.mayAttendList});
}).catch((error)=>{

});
this.props.getNotAttendList(this.props.activeUser.token, this.props.selectedEvent.id, this.props.isFromAllEvents).then(()=>{
      this.setState({notAttend: this.props.selectedEvent.notAttendList});
    }).catch((error)=>{

    });
    }

onButtonClick(val){
  ///this.setState({courseId:"hello"});
  if(this.props.onButtonClick){
    this.props.onButtonClick(val);
  }
}

 onRequestInviteClick(){
       this.props.RequestInvite(this.props.activeUser.token, this.props.selectedEvent.id).then((data)=>{
          this.setState({Disable:data.request_status});
          this.getEvent();
       }).catch((error)=>{
      });
}


  uploadFile(e) {
           var fd = new FormData();
           var that = this;
           $.each($('#file')[0].files, function(i, file) {
             fd.append('images', file);
           });
           let fileExtention = this.getFileExtension(document.getElementById('file').files[0].name);
           let eventId = this.props.selectedEvent.id;
           if(isValidImage(fileExtention)){
           $.ajax({
               url: SERVICE_URLS.URL_USED+'api/events/'+eventId+'/gallery',
               data: fd,
               processData: false,
               contentType: false,
               type: 'POST',
               headers:{
               'Authorization':'Token '+ this.props.activeUser.token
              },
               success: function(data){
                 that.setState({galleryList:data});
               },
               error: function(){

               }
           });
       }
       else{
               toastr.error('Upload Valid Image');
        }
         e.preventDefault();
     }

       getFileExtension(name){
          var found = name.lastIndexOf('.') + 1;
          return (parseInt(found) > 0 ? name.substr(found) : "");
        }

        uploadTeatTimes(e) {
              e.preventDefault();
              let fileName = _.trim(document.getElementById('uploadFileName').value);
              if(fileName == ""){
                $("#uploadFileName").focus();
              }
              else{
              let fileObj = document.getElementById('teatime').files[0];
                  if(!fileObj){
                          toastr.warning("Please select the file to Upload");
                     }
                   else {
              let fileExtention = this.getFileExtension(document.getElementById('teatime').files[0].name);
              let fd = new FormData();
              let that = this;
              fd.append('file', fileObj, (fileName + "." + fileExtention));
              let eventId = this.props.selectedEvent.id;
              $('#btnUploadFile').prop('disabled', true);
              $.ajax({
                  url: SERVICE_URLS.URL_USED+'api/events/'+  eventId +'/tee-time-files/',
                  data: fd,
                  processData: false,
                  contentType: false,
                  type: 'POST',
                  headers:{
                  'Authorization':'Token '+ this.props.activeUser.token
                 },
                  success: function(data){
                    document.getElementById('uploadFileName').value='';
                    $('#teatime').val('');
                    $('#uploadFileModal').modal('hide');
                    $('#btnUploadFile').prop('disabled', false);
                    that.setState({teetime_file:data.id, selectedIndex:0});
                    that.getFiles();
                  },
                  error: function(){
                    document.getElementById('uploadFileName').value='';
                    $('#teatime').val('');
                    $('#uploadFileModal').modal('hide');
                    $('#btnUploadFile').prop('disabled', false);

                  }
              });
              }
        }
        }
    

    addPost(){
        let eventId=this.props.selectedEvent.id;
      let title = _.trim(document.getElementById('txtPostInput').value);
       let imgArray={};
      let imgId=[];
      for(var i=0;i<_.size(this.state.imgArray);i++){
imgArray=this.state.imgArray[i];
      imgId.push(imgArray.id);
      }
      if(title==""){
          toastr.error("Please Enter Post");
      }else{
        this.setState({
              postBtn : true
          });
          this.props.savePostsByEventId(eventId,this.props.activeUser.token, title, imgId).then(()=>{
            this.getPosts();
            document.getElementById('txtPostInput').value='';
               $(".cSpinner").hide();
          }).catch((error)=>{
          });
      }
    }

    Comment(postsId){
      let commentTextBox=(postsId + "_txtComment");
      let body = document.getElementById(commentTextBox).value;
       let imgArray={};
      let imgId=[];
      for(var i=0;i<_.size(this.state.cimgArray);i++){
imgArray=this.state.cimgArray[i];
      imgId.push(imgArray.id);
      }
       if(body == ""){
         $("#"+commentTextBox).focus();
      }
      else{
      $('#'+postsId).prop('disabled', true);
      this.props.addEventComment(postsId, this.props.activeUser.token, body, imgId).then(()=>{
        this.getPosts();
        $('#'+postsId).prop('disabled', false);
        document.getElementById(commentTextBox).value='';
          this.setState({cimgArray:''});
          $(".cSpinner").hide();
      }).catch((error)=>{
      });
      }
    }
clickImage(id,src){
      let dispimg = "http://"+src;
       this.setState({
          showimg : dispimg
       });
       $('#viewAllImages').modal('show');
    }
 openImage(id,src){
      let dispimg = "http://"+src;
       this.setState({
          showimg : dispimg
       });
    }

deleteToggle(){
          var checkBoxes = $('.membersList');
          checkBoxes.change(function () {
          $('#deleteButton').prop('disabled', checkBoxes.filter(':checked').length < 1);
        });
      }

sendInvitation(){
        let userids=[];
        let eventId = this.props.selectedEvent.id;
      $("#sendInvitation input:checkbox:checked").each(function() {
          userids.push(_.toInteger(this.id));
      });
      this.props.postInvitiesList(this.props.activeUser.token, eventId, userids).then(()=>{
        this.forceUpdate();
        this.props.getEventInvities(this.props.activeUser.token, eventId, this.props.isFromAllEvents).then(()=>{
           $('.membersList').attr('checked',false);
           this.setState({invities:this.props.selectedEvent.invitiesList});
           this.setState({ajaxCallInProgress:false});
        }).catch((error)=>{
          this.setState({ajaxCallInProgress:false});
        });
        // this.getGroupMemebrs();
        $('#SendInvite').modal('hide');
          $("#searchInvites").val('');
      }).catch((error)=>{

      });
    }

     disableButn(){
      let eventId = this.props.selectedEvent.id;
      this.props.getEventInvities(this.props.activeUser.token, eventId, this.props.isFromAllEvents).then(()=>{
      this.setState({invities: this.props.selectedEvent.invitiesList});
      }).catch((error)=>{

           });
        $("#deleteButton").prop({disabled:true});
        this.setState({modalView : !this.state.modalView});
     }



      onInvitiesSearch(e){
       let eventId = this.props.selectedEvent.id;
       if(e.which==13)
         {
           this.props.searchInvities(this.props.activeUser.token, e.target.value, eventId, this.props.isFromAllEvents).then(()=>{
                this.setState({invities:this.props.selectedEvent.searchInvitiesList});
           }).catch((error)=>{
           });
         }
     }

     onInvite(id){
         if(this.refs.emailList.value == ""){
           this.refs.emailList.focus();
       }
       else{
          $("#btnSendInvite").prop({disabled:true});
            this.state.emailList = this.refs.emailList.value;
            let emails = this.state.emailList.split(',');
            this.props.inviteViaEmail(this.props.activeUser.token, id, emails).then(()=>{
            $('#inviteModal').modal('hide');
            $("#btnSendInvite").prop({disabled:false});
         }).catch((error)=>{
         });
       }
     }

    onCancel(){
        document.getElementById('useremails').value='';
        $('#inviteModal').modal('hide');
        this.refs.emailList.value="";
    }
    mailValidate(e){
      let mails = e.target.value.split(',');
      let errors = isValidEmail(mails[0]);
      if(errors == false){
      }
      if(errors == true){
      }
    }
    deleteImage(){
        let id=this.state.gImgId;
          this.props.deleteEventGallery(id, this.props.activeUser.token).then(()=>{
          this.getGallery();
        }).catch((error)=>{

      });
    }

  getGallery(param=3){
          this.props.getGalleryByEventId(this.props.selectedEvent.id, this.props.activeUser.token, this.props.isFromAllEvents).then(()=>{
          this.setState({galleryList: this.props.gallery, selectedIndex:param});
        }).catch((error)=>{

      });
    }
    delPostModal(id){
        this.setState({postId:id});
        $("#postDelModal").modal('show');

    }
    deletePost(){
        let id=this.state.postId;
      this.props.deletePost(id, this.props.activeUser.token).then(()=>{
      this.getPosts();
      }).catch((error)=>{

      });
    }
delCommModal(id){
    this.setState({commentId:id});
    $("#commentsDelModal").modal('show');
}
     deleteComments(id){
         let commentId=this.state.commentId;
          this.props.deleteComment(id, commentId, this.props.activeUser.token).then(()=>{
          this.getPosts();
                }).catch((error)=>{

              });
      }

    getFiles(){
      this.props.getEventFile(this.props.selectedEvent.id, this.props.activeUser.token, this.props.isFromAllEvents).then(()=>{
      this.setState({teetime_file: this.props.selectedEvent.teeFiles});
    }).catch((error)=>{

    });
}
    deleteFile(id){
       this.props.deleteEventFile(id, this.props.activeUser.token).then(()=>{
       this.getFiles();
        }).catch((error)=>{

        });
      }

dataClear(){
  this.refs.emailList.value="";
}

onRequired(e){
      if(e.target.value == ""){
        this.setState({
            postMsg:""
        });
      }
      else{
        this.setState({
            postMsg : e.target.value,
            postBtn : false
        });
      }
    }

    enterCapture(e){
     if(e.target.name == "post_msg"){
         if((e.target.value != "") && (e.keyCode == 13)){
            $("#postBtn").trigger("click");
         }
     }
 }
openModal(id){
   $('#testModal').modal('show');
    this.setState({gImgId:id});
}

getEvent(){
      this.props.getCurrentEvent(this.props.selectedEvent.id, this.props.activeUser.token, this.props.isFromAllEvents).then(()=>{
        this.setState({selectedIndex: 0, upComingeventDetail:this.props.selectedEvent});
      }).catch((error)=>{
      });
}

postImage(){

          var that = this;
          var imagesArray = new FormData();
           $.each($('#file')[0].files, function(i, file) {
             imagesArray.append('images', file);
           });
           let fileExtention = this.getFileExtension(document.getElementById('file').files[0].name);

           if(isValidImage(fileExtention)){

           $.ajax({
               url: SERVICE_URLS.URL_USED+'api/posts/post-upload-images/',
               data: imagesArray,
               processData: false,
               contentType: false,
               type: 'POST',
               headers:{
               'Authorization':'Token '+ this.props.activeUser.token
              },
               success: function(data){
                that.setState({imgArray:data});
               //that.getPosts();
                /*
                let arr=data.id;
                that.state.imgArray.push(arr);

                */


               },
               error: function(){
                  //that.setState({selectedScoreId:null});
               }
           });
          }
          else{

              toastr.error('Upload Valid Image');
          }
          /// e.preventDefault();
    }
commentImage(id){
    $("#"+id+"_commentSpinnner").show();
     $("#"+id+"_txtComment").hide();
 var that = this;
          var imagesArray = new FormData();
           $.each($('#commentFile')[0].files, function(i, file) {
             imagesArray.append('images', file);
           });
           let fileExtention = this.getFileExtension(document.getElementById('commentFile').files[0].name);

           if(isValidImage(fileExtention)){

           $.ajax({
               url: SERVICE_URLS.URL_USED+'api/posts/comment-upload-images/',
               data: imagesArray,
               processData: false,
               contentType: false,
               type: 'POST',
               headers:{
               'Authorization':'Token '+ this.props.activeUser.token
              },
               success: function(data){
                that.setState({cimgArray:data});
               //that.getPosts();
                /*console.log(data,data.id);
                let arr=data.id;
                that.state.imgArray.push(arr);

                console.log("imgArray",that.state.imgArray);*/
 $("#"+id+"_commentSpinnner").hide();
     $("#"+id+"_txtComment").show();

               },
               error: function(){
                  //that.setState({selectedScoreId:null});
                    $("#"+id+"_commentSpinnner").hide();
     $("#"+id+"_txtComment").show();
               }
           });
          }
          else{
$("#"+id+"_commentSpinnner").hide();
     $("#"+id+"_txtComment").show();
              toastr.error('Upload Valid Image');
          }
}

deletePostImage(){
  let id=this.state.pimgId;
  this.props.deletePostPhoto(this.props.activeUser.token, id).then(()=>{
                this.getPosts();
                $("#postImgDelModal").modal('hide');
           }).catch((error)=>{
           });
}
deleteCommentImage(){
  let id=this.state.cimgId;
  this.props.deletePostPhoto(this.props.activeUser.token, id).then(()=>{
                this.getPosts();
                $("#cImgDelModal").modal('hide');
           }).catch((error)=>{
           });
}
setcimgId(id){
  this.setState({cimgId:id});
   $("#cImgDelModal").modal('show');
}
setpImgId(id){
  this.setState({pimgId:id});
  $("#postImgDelModal").modal('show');
}
  onAttendingOrNotAttendingClick(attendingFlag, eventId){
    this.props.onAttendingOrNotAttending(attendingFlag, eventId, this.props.activeUser.token).then((data)=>{
      this.props.getCurrentEvent(this.props.selectedEvent.id, this.props.activeUser.token, this.props.isFromAllEvents).then(()=>{
        this.setState({upComingeventDetail:this.props.selectedEvent});
          this.getPeopleList();
      }).catch((error)=>{
      });
    }).catch((error)=>{
    });
  }

  closeClick(status) {
    //  $('.membersList').attr('checked', false); $('#friendsModal').modal('hide');
    this.setState({modalView: status});
  }
 onLikeClick(id){

        this.props.likePost(this.props.activeUser.token, id).then(()=>{
              this.getPosts();
        }).catch((error)=>{

        });
    }
    focusOnCommentBox(id){

        $('#'+ id + "_txtComment").focus();
    }

    navigateToPeopleTab(){
        this.setState({selectedIndex:1});
        this.getPeopleList(1);
    }

    render(){
    let {upComingeventDetail, onRequestInviteClick, activeUser, onButtonClick, teaTimesList,  getFiles, isFromProfileDetails}= this.props;
    return(
      (upComingeventDetail!=undefined && upComingeventDetail!=null && _.size(this.props.upComingeventDetail)>0)?(<div className="col-sm-12 col-md-9 mt20px eventsRytSidePage"><center>
      {(upComingeventDetail.cover_image!=undefined && upComingeventDetail.cover_image!=null)?(<img src={'http://' + upComingeventDetail.cover_image.thumbnail} className="eventImgStatic"/>):(<img src="/assets/img/GolfConnectx_EventPhoto_725x150.png" className="eventImgStatic" />)}</center>


        {this.props.upComingeventDetail!=undefined && this.props.upComingeventDetail!=null && this.props.activeUser!=undefined && this.props.activeUser!=null && this.props.activeUser.id!=this.props.selectedEvent.created_by.id && this.props.selectedEvent.has_access==false && this.props.selectedEvent.request_status==false && (this.props.upComingeventDetail.end_date_format >= moment().format('MM/DD/YYYY')) && (<div>
          <input type="button"  onClick={this.onRequestInviteClick.bind(this)} className="requestinvite" value="Request an Invite" />
         </div>)}
         {isExistObj(this.props.activeUser) && isExistObj(this.props.selectedEvent) && isExistObj(this.props.selectedEvent.created_by) && this.props.activeUser.id!=this.props.selectedEvent.created_by.id && this.props.selectedEvent.has_access==false && this.props.selectedEvent.request_status==true ?<button onClick={this.cancelRequest.bind(this)} className="requestinvite">Cancel Request</button>:''}

        {isExistObj(this.props.activeUser) && isExistObj(this.props.upComingeventDetail) && isExistObj(this.props.upComingeventDetail.created_by) && this.props.upComingeventDetail.has_access==true && this.props.activeUser.id==this.props.upComingeventDetail.created_by.id && this.props.isPastEvent==false && (<div>
          {/*<input type="button"  data-target="#SendInvite" data-toggle="modal" onClick={this.disableButn.bind(this)} className="btn-SendInvite" value="Send Invite" />*/}
          <input type="button" onClick={this.disableButn.bind(this)} className="btn-SendInvite" value="Send Invite" />
          </div>)}

            {isExistObj(this.props.activeUser) && isExistObj(this.props.selectedEvent) && isExistObj(this.props.selectedEvent.created_by) && isExistObj(this.props.upComingeventDetail) && isExistObj(this.props.upComingeventDetail.created_by) && this.props.activeUser.id!=this.props.selectedEvent.created_by.id && this.props.upComingeventDetail.has_access==true && this.props.selectedEvent.request_status==false && this.props.activeUser.id!=this.props.upComingeventDetail.created_by.id && this.props.selectedEvent.attendee_status=='Y' && (<input type="button" value="I am Not Attending" onClick={this.onAttendingOrNotAttendingClick.bind(this, 'N', this.props.selectedEvent.id)} className="requestinvite" />)}
            {isExistObj(this.props.activeUser) && isExistObj(this.props.selectedEvent) && isExistObj(this.props.selectedEvent.created_by) && isExistObj(this.props.upComingeventDetail) && isExistObj(this.props.upComingeventDetail.created_by) && this.props.activeUser.id!=this.props.selectedEvent.created_by.id && this.props.upComingeventDetail.has_access==true && this.props.selectedEvent.request_status==false && this.props.activeUser.id!=this.props.upComingeventDetail.created_by.id && this.props.selectedEvent.attendee_status=='N' && (<input type="button" value="I am Attending" onClick={this.onAttendingOrNotAttendingClick.bind(this, 'Y', this.props.selectedEvent.id)} className="requestinvite" />)}
            {isExistObj(this.props.activeUser) && isExistObj(this.props.selectedEvent) && isExistObj(this.props.selectedEvent.created_by) &&  this.props.activeUser.id==this.props.selectedEvent.created_by.id && this.props.isPastEvent==false && (<input type="button" onClick={this.onButtonClick.bind(this, "Edit")} className="btn-EditEvent" value="Edit Event" />)}


             {(this.state.modalView)
            ? (
              <div>
                <InviteModal
                nameProp="Add Members"
        invite_type="Event"
                  membersForFriends={this.state.invities}
                  closeModal={this
                  .closeClick
                  .bind(this)}
                  paramId = {this.props.selectedEvent.id}
                  isFrom="3"/>
              </div>
            )
            : (
              <div></div>
            )}


             {/*Modal begin Here*/}
              <div className="modal fade groupModalPopup" id="SendInvite" role="dialog" data-backdrop="static">
                    <div className="modal-dialog tpdialog">
                      <div className="modal-content">
                          <div className="modal-header col-sm-12 bgGreen">
                          <button type="button" className="close" data-dismiss="modal">&times;</button>
                          <h3 className="modal-title">
                            Send Invititation
                          </h3>
                         </div>
                        <div className="modal-body col-sm-12 bgwhite mb0px indraHgt">
                        <div className="col-sm-12 txtRyt">
                          <input type="text" className="search_Event" id="searchInvites" placeholder="Search Users" onKeyPress={this.onInvitiesSearch.bind(this)}/>
                          <span className="glyphicon glyphicon-search SearchEventglyph" />
                          </div>
                        <form id="sendInvitation" className="card-block">
                          <div className="col-sm-12">

                              {_.size(this.state.invities)>0  ? this.state.invities.map((item, i) => {return(<div  key={i} className="col-sm-12 mt1pc mb1pc zeroPad">
                              <div className="col-sm-2 mt1pc">
                              <label className="switch">
                                <input id={item.id} type="checkbox" className="membersList" name="is_private" defaultChecked={false} disabled={(this.props.activeUser.id==item.id)?true:false} onChange={this.deleteToggle.bind(this)}/>
                                <div className="slider round"></div>
                              </label>
                            </div>
                            <div className="col-sm-10 zeroPad">
                              <div className="col-sm-12 zeroPad">
                                <div className="col-sm-2 ">
                                  <img src={'http://'+item.profile_image_url} className="memberImg" />
                                </div>
                                <div className="col-sm-9 zeroPad mt15pcc">
                                  <div className="memberName">{item.last_name + ' ' + item.first_name}</div>
                                </div>
                              </div>
                            </div>
                            </div>)}):(<div>No members to show yet</div>)}
                          </div>
                          </form>

                       </div>
                        <div className="col-sm-12 bgwhite modal-footer">
                          <input type="button" className="btn sve-butn" onClick={this.sendInvitation.bind(this)} id="deleteButton" value="Save" />
                        </div>
                      </div>
                    </div>
                </div>
                <Tabs selectedIndex={this.state.selectedIndex}>
                  <TabList className="bgccc nextTabLayout">
                    <Tab className="ml15px" onClick={this.getEvent.bind(this)}>Info</Tab>
                    <Tab className="ml15px" id="pplTab" onClick={this.getPeopleList.bind(this, 1)}>Golfers</Tab>
                    <Tab className="ml15px" onClick={this.getPosts.bind(this, 2)}>Post</Tab>
                    <Tab className="ml15px" onClick={this.getGallery.bind(this, 3)}>Gallery</Tab>
                  </TabList>
              <TabPanel>
              <div className="eventPost">
                <div className="col-sm-6 col-xs-6">
                  <div className="inlinedisplay">
                    <div className="eventbody">
                      <span className="fnt20px">{upComingeventDetail.name}</span>
                      <br/>
                      <span className="addspan">{upComingeventDetail.venue}</span>
                      <br/>
                      <span className="addspan">{upComingeventDetail.address1}</span>
                      <br/>
                      <span className="addspan">{upComingeventDetail.city}, {upComingeventDetail.state}, {upComingeventDetail.zip_code}</span>
                      {/*<br/>
                      <span className="addspan">{upComingeventDetail.zip_code}</span>*/}
                      <br/>
                      <span className="addspan">{upComingeventDetail.start_time} - {upComingeventDetail.end_time}</span>

                          <div className="modal fade addInvite" id="inviteModal" role="dialog" data-backdrop="static">
                            <div className="modal-dialog  tpmdl">
                               <div className="modal-content">
                                   <div className="modal-header col-sm-12 bgGreen"><h4 className="m0px">INVITE NEW USER TO {upComingeventDetail.name}</h4></div>
                                   <div className="modal-body col-sm-12 bgwhite mb0px">
                                   <div className="col-sm-12">
                                      To:<input type="email"  ref = "emailList" placeholder="abc@gmail.com" id="useremails" name="useremails" className="invtSearch" onChange={this.mailValidate.bind(this)}/>
                                   </div>
                                   {this.state.errEmail}

                                   </div>
                                  <div className="modal-footer col-sm-12 bgwhite">
                                    <button type="button" className="btn butnSend" id="btnSendInvite"  onClick={this.onInvite.bind(this, upComingeventDetail.id)} >Send</button>
                                    <button type="button" className="btn butnCncl" onClick={this.onCancel.bind(this)}>Cancel</button>
                                 </div>
                                </div>
                            </div>

                          </div>
                      </div>
                  </div>
                  <div className="dividerLine"></div>
                  {upComingeventDetail.selected_group!=undefined && upComingeventDetail.selected_group!=null && (<div className="inlinediv col-sm-12 ">
                   <span className="col-sm-2 zeroPad">
                    <img className="eventGroup" src={"http://"+upComingeventDetail.selected_group.image_url} />
                  </span>
                  <span className="eventgrptxt col-sm-10 zeroPad">
                    <Link to={"groupMembers_"+upComingeventDetail.selected_group.id}><h3 className="m0px fnt20px col-sm-12">{upComingeventDetail.selected_group.name}</h3></Link>
                    <span className="pvtevnt col-sm-12">{upComingeventDetail.is_private?"Private Event":"Public Event"}</span>

                  </span>
                </div>)}
                <div className="detailsheader">Details
                <div className="eventDetails word-break">
                  <div className="col-sm-12 mt1pc zeroPad">
                    <p dangerouslySetInnerHTML={{__html: this.props.upComingeventDetail.description}}></p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-xs-6 mt10px">
              <div className="col-sm-10">
                <div className="modal fade addPost" id="uploadFileModal" role="dialog" data-backdrop="static">
                  <div className="modal-dialog tp25pc">
                    <form id="groupsForm">
                      <div className="modal-content">
                        <div className="modal-header col-sm-12 bgGreen txt-transform">Upload Teetime</div>
                          <div className="modal-body col-sm-12 bgwhite mb0px">
                            <input type="text" className="form-control" name="uploadFileName" id="uploadFileName" placeholder="File Name"/><br/>
                            <input ref="teatime" id="teatime" type="file" name="teatime" className="form-control" accept="application/pdf, .xls, .xlsx, .doc, .docx, application/msword" />
                          </div>
                          <div className="modal-footer col-sm-12 bgwhite">
                            <input type="button" className="upload-butn " value="Upload Teetime File" id="btnUploadFile" onClick={this.uploadTeatTimes} />
                            <input type="button" className="uploadcancel-butn " data-dismiss="modal" value="Cancel" />
                          </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div className="col-sm-12 mb10px filediv">
                {_.size(this.state.teetime_file)>0 && this.state.teetime_file.map((item, index)=>{
                  let extension = _.split(item.name, '.');
                  return(<div key={"teetime_"+index} className="row pad-5px">
                            <div className="col-sm-2 cls_blc">
                              <i className={(extension[1]=="pdf")?("fa fa-lg fa-file-pdf-o color-red pad-5px"):((extension[1]=="xls" || extension[1]=="xlsx")?("fa fa-lg fa-file-excel-o color-green pad-5px"):((extension[1]=="doc" || extension[1]=="docx")?("fa fa-lg fa-file-word-o color-blue pad-5px"):("fa fa-lg fa-file-text pad-5px")))} aria-hidden="true"></i>
                            </div>
                            <div className="col-sm-12 zeroPad">
                              <div className="col-sm-4 col-xs-4 padd_cls ">
                              {isExistObj(this.props.upComingeventDetail.created_by) && item.uploaded_by==this.props.upComingeventDetail.created_by.first_name && (<span className="glyphicon glyphicon-trash fr cursor-pointer" data-toggle="modal" data-target="#modalFileDlt"></span>)}
                                  <div className="modal fade" id="modalFileDlt" role="dialog" data-dropback="static">
                                    <div className="modal-dialog">
                                         <div className="modal-content">
                                         
                                           <div className="modal-body">Are you sure you want to delete?</div>
                                             <div className="modal-footer">
                                                  <input type="button" className="cnfrmbtn checkng" data-dismiss="modal" value="Yes" onClick={this.deleteFile.bind(this,item.id)} />
                                                  <input type="button" className="cnfrmbtn checkng" data-dismiss="modal" value="No" />
                                            </div>
                                          </div>
                                       </div>
                                  </div>
                              <label>{item.name.substr(0, item.name.lastIndexOf('.'))}</label>
                              <br/>
                            </div>
                              {isExistObj(this.props.selectedEvent) && this.props.selectedEvent.has_access && (<div className="col-sm-8 col-xs-8"><a className="btn-dnloadFile pad-5px cursor-pointer color-white display" target="_blank" href={'http://' + item.file} >Download File</a>

                                <a className="glyphicon glyphicon-save min-display" target="_blank" href={'http://' + item.file} ></a>
                                </div>)}
                          </div>
                            <span className="fnt14px col-sm-12 zeroPad mb5px">{item.uploaded_on} by {item.uploaded_by}</span>
                                <div className="dividerLineforDoc col-sm-12"></div>
                    </div>)
                })}
            </div>
        </div>
              <div className="dividerLine1Event"></div>
              <div className="col-sm-12 inline-flex ">
                <div  className="modaldiv">
                 <div onClick={this.navigateToPeopleTab.bind(this)}  className="eventFriends col-sm-4 cursor-pointer" >
                    {isExistObj(this.props.selectedEvent) && isExistObj(this.props.selectedEvent.attendee_stats) && <span className="fr atndfrnd mt3px mr15px">{this.props.selectedEvent.attendee_stats.attending} Attending</span>}
                  </div>
                </div>
                {isExistObj(this.props.selectedEvent) && isExistObj(this.props.selectedEvent.attendee_stats) && <div onClick={this.navigateToPeopleTab.bind(this)} className="col-sm-3 brdright brdrleft mt3px txtAlignCentre cursor-pointer"><span>{this.props.selectedEvent.attendee_stats.notattending} Not Attending</span></div>}
                {isExistObj(this.props.selectedEvent) && isExistObj(this.props.selectedEvent.attendee_stats) && <div onClick={this.navigateToPeopleTab.bind(this)} className="col-sm-3 mt3px pdryt0px cursor-pointer"><span>{this.props.selectedEvent.attendee_stats.maybe} Not Replied</span></div>}
                </div>
                <div className="greenBrdr col-sm-12"></div>
                   {isExistObj(this.props.activeUser) && isExistObj(this.props.selectedEvent) && isExistObj(this.props.selectedEvent.created_by) && this.props.activeUser.id==this.props.selectedEvent.created_by.id && this.props.isPastEvent==false && (<button className="downloadbutton" data-toggle="modal" data-target="#uploadFileModal">
                    <span><img src="/assets/img/downloadimg.png" className="mr15px"></img>Upload Tee Time/Results</span>
                  </button>)}
                  </div>
                </TabPanel>
                <TabPanel>
                    <div className="m10px pd10px">
                        <span>Attending</span>
                    </div>
                    <div className="col-sm-12 mb10px">
                        {isExistObj(this.props.selectedEvent) && isExistObj(this.props.activeUser) && isExistObj(this.props.selectedEvent) && isExistObj(this.props.selectedEvent.attendeesList) && _.size(this.props.selectedEvent.attendeesList)>0 && this.props.selectedEvent.attendeesList.map((item, index)=>{
                          return(<div className="col-sm-4 mb10px"><Link to={this.props.activeUser.id==item.id?"profile_0":"/profileDetail_"+item.id}><img key={index} src={'http://'+ item.profile_image_url} className="col-sm-3 zeroPad brdrRad50pc wd10pc" /><span className="col-sm-9">{item.first_name} {item.last_name}</span></Link></div>);
                        })}
                    </div>
                        <div className="col-sm-12 brdr1pxccc"></div>
                          <div className="col-sm-12">
                          <div className="m10px ">
                            <span className="col-sm-6">Not Attending</span>
                            <span className="col-sm-5">Awaiting Response</span>
                          </div>
                          <div className="col-sm-6 ntAtdngDiv">
                            <div className="col-sm-12 zeroPad">
                              {isExistObj(this.props.selectedEvent) && isExistObj(this.props.activeUser) && isExistObj(this.props.selectedEvent.notAttendList) && _.size(this.props.selectedEvent.notAttendList)>0 && this.props.selectedEvent.notAttendList.map((item, index)=>{
                                return(<div className="col-sm-6"><Link to={this.props.activeUser.id==item.id?"profile_0":"/profileDetail_"+item.id}><img key={index} src={'http://'+ item.profile_image_url} className="ntAttendImg zeroPad mt10px brdrRad50pc" /><span className="col-sm-9 zeroPad ntAttendDiv">{item.first_name} {item.last_name}</span></Link></div>);
                              })}
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <div className="col-sm-12 zeroPad">
                            {isExistObj(this.props.selectedEvent) && isExistObj(this.props.activeUser) && isExistObj(this.props.selectedEvent.mayAttendList) && _.size(this.props.selectedEvent.mayAttendList)>0 && this.props.selectedEvent.mayAttendList.map((item, index)=>{
                              return(<div className="col-sm-6"><Link to={this.props.activeUser.id==item.id?"profile_0":"/profileDetail_"+item.id}><img key={index} src={'http://'+ item.profile_image_url} className="awaitingImg zeroPad mt10px" /><span className="col-sm-9 zeroPad awaitingDiv">{item.first_name} {item.last_name}</span></Link></div>);
                            })}
                            </div>
                          </div>
                        </div>
                </TabPanel>
                <TabPanel>
                    <div className="eventPostDiv">
                          <div className="">
                             {isExistObj(this.props.activeUser) && this.props.isFromProfileDetails == false || this.props.isFromAllEvents == true || this.props.isPastEvent==true && this.props.selectedEvent.has_access==true?(<span></span>):(<div>
                                <div className="col-sm-12">
                                  <img src={"http://"+this.props.activeUser.profile_image_url} className="brdrRad50pc wd8pc"/>
                                  <input placeholder="Write something..."  name = "post_msg" ref="postValue" className="eventPostInput" id="txtPostInput" onChange={this.onRequired.bind(this)} onKeyDown={this.enterCapture.bind(this)}/>
                                </div>
                                <div className="col-sm-12 col-xs-12 divLinePost"></div>
                                <div className="col-sm-12 col-xs-12">
                                     {isExistObj(this.props.activeUser) && isExistObj(this.props.selectedEvent) && isExistObj(this.props.selectedEvent.created_by) && this.props.selectedEvent.created_by.id==this.props.activeUser.id?<div><img src="/assets/img/Camera Icon.png"/>
                                    <input type="file" name="file" id="file" className="eventPostImg" onChange={this.postImage.bind(this)} /></div>:''}
                                    <input type="button" id="postBtn" className="btn btnPostEvent" onClick={this.addPost.bind(this)} disabled={!this.state.postMsg || this.state.postBtn} value="Post" />
                                </div>
                              </div>)}
                              <div>
                                {isExistObj(this.state.postsList)?this.state.postsList.map((item,index)=>{
                                    return(<div className="col-sm-12 col-xs-12"  key={index}>
                                              <span className="col-sm-1  col-xs-2 zeroPad">
                                                  <img src={"http://"+item.author.profile_image_url} className="brdrRad50pc wd90pc"/>
                                              </span>
                                              {isExistObj(this.props.selectedEvent) && isExistObj(this.props.selectedEvent.created_by) && isExistObj(this.props.activeUser) && this.props.isFromAllEvents == false || this.props.isPastEvent==false && this.props.activeUser.id==this.props.selectedEvent.created_by.id || this.props.activeUser.id==item.author.id?<span className="glyphicon glyphicon-trash fr cursor-pointer mt1pc" data-toggle="modal" onClick={this.delPostModal.bind(this,item.id)}></span>:null}
                                                <div className="modal fade" id="postDelModal" role="dialog" data-dropback="static">
                                                  <div className="modal-dialog">
                                                    <div className="modal-content">
                                                        <div className=" modal-header modalHder"><h4>Delete Post</h4></div>
                                                      <div className="modal-body">Are you sure you want to delete?</div>
                                                      <div className="modal-footer">
                                                        <input type="button" className="cancelbtn checkng" data-dismiss="modal" value="Yes" onClick={this.deletePost.bind(this)} />
                                                        <input type="button" className="cancelbtn checkng" data-dismiss="modal" value="No" />
                                                      </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <span className="col-sm-8">
                                                <span className="postLine col-sm-12 zeroPad">{item.author.first_name} {item.author.last_name}</span>
                                                <span className="col-sm-12 zeroPad color-ddd">{item.created}</span>
                                              </span>
                                              <span className="dispBlock col-sm-12 col-xs-12  mb1pc">{item.title}
                                                  {this.props.isFromAllEvents == false || this.props.isPastEvent==false?(<span></span>):(null)}
                                              </span>
                                                <div className="col-sm-12 col-xs-12">
                      {isExistObj(item) && isExistObj(item.images)  && _.size(item.images)>0? item.images.map((imgItem,i)=>{
                        return(

                      <div className="col-sm-2  postImgDiv">
                        <img src={"http://"+imgItem.image} className="img-thumbnail wd120px hgt120px"/>
                    {isExistObj(this.props.activeUser) && item.author.id==this.props.activeUser.id?<i className="glyphicon glyphicon-remove top-55px cursor-pointer positionAbs"  onClick={this.setpImgId.bind(this,imgItem.id)}></i>:''}

                          <div className="modal fade" id="postImgDelModal" role="dialog" data-dropback="static">
                                  <div className="modal-dialog">
                                         <div className="modal-content">
                                          <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <h4 className="modal-title">Delete Image</h4>
                          </div>
                                           <div className="modal-body">Are you sure you want to delete?</div>
                                             <div className="modal-footer">
                                                   <button type="button" className="cnfrmbtn checkng"   onClick={this.deletePostImage.bind(this)} >Yes</button>
                                                   <button type="button" className="cancelbtn checkng" data-dismiss="modal">No</button>
                                              </div>
                                          </div>
                                       </div>
                                  </div>

                   </div>

                        );
                      }):''}
                    </div>
                                              <div className="col-sm-12 col-xs-12 likeCommentDiv">
                                                {this.props.isFromAllEvents == false || this.props.isPastEvent==false && (<span className="glyphicon glyphicon-comment fr ml10px color-ddd">
                                                    <span className="ml10px cursor-pointer" onClick={this.focusOnCommentBox.bind(this, item.id)}>Comment</span>
                                                </span>)}
                                                <span className="glyphicon glyphicon-heart fr LikePost">
                                                    <span className={(item.has_like)?"like color-green cursor-pointer ml10px":"like cursor-pointer ml10px"} onClick={this.onLikeClick.bind(this, item.id)}>Like</span>
                                                </span>
                                              </div>
                                              {isExistObj(item) && isExistObj(item.comments) && _.size(item.comments)>0 && item.comments.map((childItem, childIndex)=>{
                                                    return(<div key={childIndex}>
                                                            <div className="mt10px col-sm-12 zeroPad">
                                                              <span className="col-sm-1  col-xs-2 zeroPad">
                                                                <img src={"http://"+childItem.author.profile_image_url} className="brdrRad50pc wd90pc"/>
                                                              </span>
                                                              {isExistObj(this.props.activeUser) && this.props.isFromAllEvents == false || this.props.isPastEvent==false && this.props.activeUser.id==item.author.id || this.props.activeUser.id==childItem.author.id?<div><span className="glyphicon glyphicon-trash fr cursor-pointer mt1pc" data-toggle="modal" onClick={this.delCommModal.bind(this,childItem.id)}></span>

                                                                  <div className="modal fade" id="commentsDelModal" role="dialog" data-dropback="static">
                                                                    <div className="modal-dialog">
                                                                      <div className="modal-content">
                                                                          <div className=" modal-header modalHder"><h4>Delete Comment</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                                                                                                </div>
                                                                        <div className="modal-body">Are you sure you want to delete?</div>
                                                                        <div className="modal-footer">
                                                                          <input type="button" className="cancelbtn checkng" data-dismiss="modal" value="Yes" onClick={this.deleteComments.bind(this,item.id)} />
                                                                          <input type="button" className="cancelbtn checkng" data-dismiss="modal" value="No" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div></div>:null}
                                                            <span className="col-sm-10">
                                                              <span className=" col-sm-12">
                                                                <span className="commentLine">{childItem.author.first_name} {childItem.author.last_name}</span>
                                                                <span className="ml10px">{childItem.body}</span>
                                                              </span>
                                                              <span className="col-sm-12 color-ddd">{childItem.created}</span>
                                                              <div className="col-sm-12">
                                                                { isExistObj(childItem) && isExistObj(childItem.images) && _.size(childItem.images)>0? childItem.images.map((cimgItem,i)=>{
                        return(

                     <div className="col-sm-2 postImgDiv">
                        <img src={"http://"+cimgItem.image} className="img-thumbnail wd120px hgt120px"/>
                    {isExistObj(this.props.activeUser) && this.props.activeUser.id==item.author.id || this.props.activeUser.id==childItem.author.id?<i className="glyphicon glyphicon-remove top-55px cursor-pointer positionAbs"  onClick={this.setcimgId.bind(this,cimgItem.id)}></i>:''}
                     <div className="modal fade" id="cImgDelModal" role="dialog" data-dropback="static">
                                  <div className="modal-dialog">
                                         <div className="modal-content">
                                          <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <h4 className="modal-title">Delete Image</h4>
                          </div>
                                           <div className="modal-body">Are you sure you want to delete?</div>
                                             <div className="modal-footer">
                                                   <button type="button" className="cnfrmbtn checkng"   onClick={this.deleteCommentImage.bind(this)} >Yes</button>
                                                   <button type="button" className="cancelbtn checkng" data-dismiss="modal">No</button>
                                              </div>
                                          </div>
                                       </div>
                                  </div>
                   </div>

                        );
                      }):''}
                                                            </div>
                                                        </span>
                                                      </div>
                                                </div>)
                                              })}
                                              {this.props.isFromAllEvents == false || this.props.isPastEvent==false?(<div><div className="mt10px col-sm-12 zeroPad">
                                                <span className="col-sm-1 col-xs-2 zeroPad">
                                                  <img src={"http://"+item.author.profile_image_url} className="brdrRad50pc wd90pc"/>
                                                </span>
                                                     <div id={item.id+"_commentSpinnner"} className="cSpinner"><Spinner />  </div>                                                                 
                                                <span className="col-sm-11 col-xs-10">
                                                  <input className="CommentInput" id={item.id+ "_txtComment"}/>
                                                 {isExistObj(this.props.activeUser) && this.props.activeUser.id==item.author.id?<div className="fr"> <img src="/assets/img/Camera Icon.png" className="fr cameraImgComment"/>
                                                <input type="file" id="commentFile" name="commentFile" className="commentCamera" onChange={this.commentImage.bind(this,item.id)}/></div>:''}
                                                </span>
                                              </div>
                                              <div className="col-sm-12">
                                                <input type="button" className="btnCommentEvent" id={item.id}  onClick={this.Comment.bind(this, item.id)} value="Comment" />
                                              </div></div>):null}
                                            </div>)
                                          }):'No posts yet'}
                                      </div>
                                </div>
                              </div>
                      </TabPanel>
                      <TabPanel>
                        <div className="col-sm-12">
                          <div className="col-sm-6">
                              <span>{_.size(this.state.galleryList)} Photos</span>
                          </div>
                          {isExistObj(this.props.activeUser) && isExistObj(this.props.selectedEvent) && isExistObj(this.props.selectedEvent.created_by) && this.props.activeUser.id==this.props.selectedEvent.created_by.id && this.props.isPastEvent==false?(<div className="col-sm-6">
                                <button className="btnAddPhotos">Add Photos</button>
                                <input ref="file" id="file" type="file" name="file" onChange={this.uploadFile} className="ImageUploadEvent" accept="image/*" multiple />
                            </div>):(null)}
                        <div className="col-sm-12 dividerForPhotos"></div>
                        <div className="col-sm-12">
                            {isExistObj(this.state.galleryList) && this.state.galleryList.map((item,index)=>{
                             return(<div className="col-sm-2 mt10px  pdng galleryImg" key={index}>
                                       <img src={"http://"+item.image} className="img-thumbnail wd120px hgt120px" onClick={this.clickImage.bind(this,item.id,item.image)}/>
                                   <div className="edit"><a onClick={this.openModal.bind(this,item.id)} className="cursor-pointer"><i className="glyphicon glyphicon-remove top-15px"></i></a></div>

                                     <div className="modal fade" id="testModal" role="dialog" >
                                          <div className="modal-dialog">
                                              <div className="modal-content">
                              <div className="modal-header modalHder">
                              <h4>Delete Photo</h4>
                               <button className="close" data-dismiss="modal">&times; </button>
                          </div>
                                                   <div className="modal-body">Are you sure you want to delete?</div>
                                                   <div className="modal-footer">
                                                       <button type="button" className="cnfrmbtn checkng" data-dismiss="modal" onClick={this.deleteImage.bind(this)} >Yes</button>
                                                       <button type="button" className="cancelbtn checkng" data-dismiss="modal">No</button>
                                                  </div>
                                              </div>
                                          </div>
                                       </div>
                                    </div>);
                              })}
                              <div className="modal fade" id="viewAllImages" role="dialog">
                                <div className="modal-dialog tp13pc">
                                  <div className="modal-content brdrRad0px">
                                    <div className="modal-header modalGder">
                                        <button className="close" data-dismiss="modal">Close </button>
                                    </div>
                                    <div className="modal-body">
                                      <div className="round_close">
                                        
                                        
                                        <div className="opened_Image txtcenter">
                                          <span className="thumbnail m0px">
                                            <img src={this.state.showimg} alt="selectedImage" className="sliderImges" />
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="modal-footer">
                                      <div id="content" className="modalinlineAlign col-sm-12">
                           {isExistObj(this.state.galleryList) && this.state.galleryList.map((item,index)=>{
                             return(<img src={"http://"+ item.image} alt={"http://"+ item.image} className=" modalinlnImgs" onClick={this.openImage.bind(this,item.id,item.image)} />)})}
                            </div>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
      </TabPanel>
    </Tabs></div>):(<div></div>));
  }
}
 UpcomingEventDetails.contextTypes = {
  router: React.PropTypes.object.isRequired
};


function mapStateToProps(state, ownProps) {
    return {
         activeUser:(state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
         selectedEvent:(ownProps.isFromAllEvents)?(state.selectedAllEvent):(state.selectedEvent),
         postsList:(ownProps.isFromAllEvents)?((state.selectedAllEvent!=undefined && state.selectedAllEvent!=null)?(state.selectedAllEvent.postsList):([])):((state.selectedEvent!=undefined && state.selectedEvent!=null)?(state.selectedEvent.postsList):([])),
         gallery:(ownProps.isFromAllEvents)?((state.selectedAllEvent!=undefined && state.selectedAllEvent!=null)?(state.selectedAllEvent.gallery):([])):((state.selectedEvent!=undefined && state.selectedEvent!=null)?(state.selectedEvent.gallery):([])),
         attendeesList:(ownProps.isFromAllEvents)?((state.selectedAllEvent!=undefined && state.selectedAllEvent!=null)?(state.selectedAllEvent.attendeesList):([])):((state.selectedEvent!=undefined && state.selectedEvent!=null)?(state.selectedEvent.attendeesList):([])),
         notAttendList:(ownProps.isFromAllEvents)?((state.selectedAllEvent!=undefined && state.selectedAllEvent!=null)?(state.selectedAllEvent.notAttendList):([])):((state.selectedEvent!=undefined && state.selectedEvent!=null)?(state.selectedEvent.notAttendList):([])),
         mayAttendList:(ownProps.isFromAllEvents)?((state.selectedAllEvent!=undefined && state.selectedAllEvent!=null)?(state.selectedAllEvent.mayAttendList):([])):((state.selectedEvent!=undefined && state.selectedEvent!=null)?(state.selectedEvent.mayAttendList):([]))
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({getAttendeesList, RequestInvite, getPostsByEventId, getGalleryByEventId,
      savePostsByEventId, addEventComment, getMayAttendList, getNotAttendList,getEventInvities,
      postInvitiesList,searchInvities, inviteViaEmail, deleteEventGallery, deletePost, deleteComment,
      deleteEventFile , getEventFile, CancelRequest, getCurrentEvent, onAttendingOrNotAttending,
      deletePostPhoto, likePost}, dispatch);
}

export default  connect(mapStateToProps, matchDispatchToProps)(UpcomingEventDetails);