import React, {Component} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import{IMG_CONSTANT} from '../constants/application.constants';
import {groupList, groupDetails, getGroupMembersList, searchGroupMembers, addComment, getGroupPostsList,
  addNewPost, getGroupsGallery, leaveGroup, editGroupInfo, getGroupFilesList, likePost,
   addOrRemoveGroupMemebrs, getGroupMembers, searchaddMembers, getCurrentEventsDetailsList,
   RequestGroup, createEvents, inviteViaEmail, deleteGroupGallery, deleteGroupFile, deletePostPhoto} from '../actions/groupListAction';
import { getCurrentEvent, eventDetails, deletePost, deleteComment} from '../actions/eventDetailsAction';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {editEvents} from '../actions/createEventAction';
import CreateEvent from './child-components/createEvent';
import {userProfileDetails} from '../actions/profileActions';
import _ from 'lodash';
import Spinner from 'react-spinner';
import EventListDetail from './child-components/eventListDetail';
import UpcomingEventDetails from './child-components/upcomingEventDetails';
import toastr from 'toastr';
import {Link} from 'react-router';
import {SERVICE_URLS} from '../constants/serviceUrl';
import {isValidImage} from "../utils/Validation";
import InviteModal from './child-components/InviteModal';
import {isExistObj} from '../utils/functions';


let imagePath=IMG_CONSTANT.IMAGE_PATH;
let paramId;
class GroupMembers extends Component{
    constructor(props,context)
    {
        super(props,context);
       this.state={
                    groupInfo:{},
                    upComingeventDetail:{},
                    isCreateOrEdit: "Upcoming",
                    selectedGroupDetails:{},
                    membersList: [],
                    postsList: [],
                    profileDetails: {},
                    galleryList: [],
                    editGroupInfoType:'label',
                    filesList:[],
                    tempid:"",
                    friends: [],
                    ajaxCallInProgress:false,
                    postMsg:"",
                     isImageEdited: false,
                     postBtn:"",
                    currentEventList: [],
                    imgArray:'',cimgArray:'',
                    emailList: "",
                    modalView : false,
                    emailList: "",
                    modalView : false,
                    pimgId:'',
                    cimgId:''
                  };
                  this.uploadFile=this.uploadFile.bind(this);
                  this.uploadDocument=this.uploadDocument.bind(this);
    }

    onEditGroupInfo(){
        this.setState({editGroupInfoType:'text'});
    }

    onRequestInviteClick(){


    }

    onLikeClick(id){
        this.props.likePost(this.props.activeUser.token, id).then(()=>{
              this.getGroupPostsDetails();
        }).catch((error)=>{

        });
    }

   getFileExtension(name){
      var found = name.lastIndexOf('.') + 1;
      return (parseInt(found) > 0 ? name.substr(found) : "");
    }

   onUploadFileClick(e){
       let nameBody = document.getElementById("uploadFileName").value;
     if(nameBody == ""){
      $("#uploadFileName").focus();
       }
       else{
          if(_.size(document.getElementById('documents').files)>0){
          $('#uploadButton').prop('disabled', true);
          let fileName = _.trim(document.getElementById('uploadFileName').value);
          let fileObj = document.getElementById('documents').files[0];
          let fileExtention = this.getFileExtension(document.getElementById('documents').files[0].name);
          let fd = new FormData();
          let that = this;
          fd.append('file', fileObj, (fileName + "." + fileExtention));
          $.ajax({
              url: SERVICE_URLS.URL_USED+'api/groups/' + paramId + '/add-group-file/',
              data: fd,
              processData: false,
              contentType: false,
              type: 'POST',
              headers:{
              'Authorization':'Token '+ this.props.activeUser.token
             },
              success: function(data){
                document.getElementById('uploadFileName').value='';
                that.setState({filesList: data});
                $('#documents').val('');
                $('#uploadFileModal').modal('hide');
                that.getFiles();
                 $('#uploadButton').prop('disabled', false);
              },
              error: function(){
                 console.log("Error");
                  $('#documents').val('');
                   $('#uploadFileModal').modal('hide');
                 document.getElementById('uploadFileName').value='';

              }
          });
            e.preventDefault();
  }
   else{
    toastr.error("Please choose the file to upload");
    }
  }
}
closeUploadFile(){
   $('#documents').val('');
                 document.getElementById('uploadFileName').value='';
                   $('#uploadFileModal').modal('hide');
}

    uploadDocument(e) {

           var fd = new FormData();
           var that = this;
           fd.append('file', document.getElementById('documents').files[0]);
           $.ajax({
               url: SERVICE_URLS.URL_USED+'/api/groups/' + paramId + '/add-group-file/',
               data: fd,
               processData: false,
               contentType: false,
               type: 'POST',
               headers:{
               'Authorization':'Token '+ this.props.activeUser.token
              },
               success: function(data){
                 that.setState({filesList: data});
               },
               error: function(){
                  console.log("Error");
               }
           });
           e.preventDefault();
       }

getGroupDetails(){
  this.props.groupDetails(paramId, this.props.activeUser.token).then(()=>{
                  this.setState({selectedGroupDetails:this.props.selectedGroup});
              }).catch((error)=>{
             });
}
    onUpdateGroupInfo(){
      let innerDescValue = document.getElementById("groupInfoDescription").value.replace(new RegExp('\r?\n','g'), '<br />');
        let description;
        this.props.editGroupInfo(this.props.activeUser.token, paramId, innerDescValue).then(()=>{
            this.setState({editGroupInfoType:'label'});
            this.props.groupDetails(paramId, this.props.activeUser.token).then(()=>{
                  this.setState({selectedGroupDetails:this.props.selectedGroup});
              }).catch((error)=>{
             });
        }).catch((error)=>{

        });

    }
    editCancel(){
       this.setState({editGroupInfoType:'label'});
    }

    addPost(){

      let title = _.trim(document.getElementById('txtPostInput').value);
      let imgArray={};
      let imgId=[];
      for(var i=0;i<_.size(this.state.imgArray);i++){
          imgArray=this.state.imgArray[i];
          imgId.push(imgArray.id);
      }

      if(title==""){
          toastr.error("Post can't be empty");
      }else{
          this.setState({
              postBtn : true
          });
          this.props.addNewPost(paramId,this.props.activeUser.token, title, imgId).then(()=>{
            this.getGroupPostsDetails();
            document.getElementById('txtPostInput').value='';
            //$('#addPost').prop('disabled', true);
          }).catch((error)=>{
          });
      }

    }

    addOrRemoveMembers(){
      let members=[];
      $("#addOrRemoveMemebrs input:checkbox:checked").each(function() {
          members.push(_.toInteger(this.id));
      });
      this.props.addOrRemoveGroupMemebrs(this.props.activeUser.token, paramId, members).then(()=>{
        this.forceUpdate();
        this.props.getGroupMembers(this.props.activeUser.token, paramId).then(()=>{
           $('.membersList').attr('checked',false);
           this.setState({friends:this.props.friends.Members});
           this.setState({ajaxCallInProgress:false});
        }).catch((error)=>{
          this.setState({ajaxCallInProgress:false});
        });
        this.getGroupMemebrs();
        $('#groupaddMembers').modal('hide');
      }).catch((error)=>{
        console.log("Error", error);
      });
    }

    getGroupPostsDetails(){
      this.props.getGroupPostsList(paramId, this.props.activeUser.token).then(()=>{
                  this.setState({postsList:this.props.selectedGroup.posts});
                  this.setState({ajaxCallInProgress:false});
              }).catch((error)=>{
                this.setState({ajaxCallInProgress:false});
      });

    }

    focusOnCommentBox(id){
        $('#'+ id + "_txtComment").focus();
    }
setPImgId(id){
this.setState({pimgId:id});
$("#deleteImageModal").modal('show');
}
deletePostImage(){
let id=this.state.pimgId;
  this.props.deletePostPhoto(this.props.activeUser.token, id).then(()=>{
    $("#deleteImageModal").modal('hide');
                this.getGroupPostsDetails();
           }).catch((error)=>{
           });
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
      // let commentTextBox=(postsId + "_txtComment");
      // let body = document.getElementById(commentTextBox).value;
      this.props.addComment(postsId, this.props.activeUser.token, body, imgId).then(()=>{
      this.getGroupPostsDetails();
      $('#'+postsId).prop('disabled', false);
      document.getElementById(commentTextBox).value='';
      }).catch((error)=>{
      });
    }
  }

   getFileExtension(name){
       var found = name.lastIndexOf('.') + 1;
       return (parseInt(found) > 0 ? name.substr(found) : "");
     }


    uploadFile(e) {
           var fd = new FormData();
           var that = this;

            $.each($('#file')[0].files, function(i, file) {
             fd.append('images', file);
           });
           let fileExtention = this.getFileExtension(document.getElementById('file').files[0].name);
            if(isValidImage(fileExtention)){

            $.ajax({
               url: SERVICE_URLS.URL_USED+'api/groups/' + paramId +'/gallery/',
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
                  console.log("Error");
               }
           });
           }else{
                toastr.error('Upload a valid Image');
           }
           e.preventDefault();
       }


    onFriendsSearch(e){
         if(e.which==13)
         {
           this.props.searchGroupMembers(this.props.activeUser.token, e.target.value, paramId).then(()=>{
                this.setState({membersList:this.props.selectedGroup.members});
           }).catch((error)=>{
           });
         }
     }

     onAddmemberSearch(e){
       if(e.which==13)
         {
           this.props.searchaddMembers(this.props.activeUser.token, e.target.value, paramId).then(()=>{
                this.setState({friends:this.props.friends.Members});
           }).catch((error)=>{
           });
         }
     }
    onSaveClick(formData, id){
      if(this.state.isCreateOrEdit=="Create"){
       this.props.createEvents(formData, this.props.activeUser.token, this.props.selectedGroup.id).then(()=>{
         this.props.eventDetails(this.props.activeUser.token).then(()=>{
             this.setState({currentEventList:this.props.selectedGroup.getEventsList, isCreateOrEdit: "Upcoming"});
              this.props.getCurrentEventsDetailsList(this.props.activeUser.token, this.props.selectedGroup.id).then(()=>{
                    this.setState({currentEventList: this.props.selectedGroup.getEventsList});
                    if(_.size(this.state.upComingeventDetail)==0 && _.size(this.selectedGroup.getEventsList)>0){
                            this.getEvent(this.props.selectedGroup.getEventsList[0].id);
                    }

                  }).catch((error)=>{

                  });

         }).catch((error)=>{
         });
       }).catch((error)=>{
       });
      }
      else {
        this.props.editEvents(formData,this.state.upComingeventDetail.id, this.props.activeUser.token).then(()=>{
          this.props.eventDetails(this.props.activeUser.token).then(()=>{
              this.setState({currentEventList:this.props.selectedGroup.getEventsList, isCreateOrEdit: "Upcoming"});
              this.props.getCurrentEventsDetailsList(this.props.activeUser.token, this.props.selectedGroup.id).then(()=>{
                    this.setState({currentEventList: this.props.selectedGroup.getEventsList});
                    if(_.size(this.state.upComingeventDetail)==0 && _.size(this.selectedGroup.getEventsList)>0){
                        this.getEvent(this.props.selectedGroup.getEventsList[0].id);
                      }

                    }).catch((error)=>{

                    });
          }).catch((error)=>{
          });
        }).catch((error)=>{
        });
      }
   }

   navigateToCreate(val){
      this.setState({isCreateOrEdit:val});
    }
 onButtonClick(val){
      this.setState({isCreateOrEdit:val});
    }
    componentDidMount() {
      $('.menu').parent().removeClass('active');
      $('#group').parent().addClass('active');
   }

getGroupMemebrs(){
  this.props.getGroupMembersList(paramId, this.props.activeUser.token).then(()=>{
          this.setState({membersList:this.props.selectedGroup.members});
          this.setState({ajaxCallInProgress:false});
      }).catch((error)=>{
        this.setState({ajaxCallInProgress:false});
  });
}
getFiles(){
   this.props.getGroupFilesList(paramId, this.props.activeUser.token).then(()=>{
                        this.setState({filesList:this.props.selectedGroup.files});

                    }).catch((error)=>{

            });
}
   componentWillMount(){
     let urlPath = _.split(location.pathname, '_');
     paramId =  (_.size(urlPath)>0)?(_.toInteger(urlPath[1])):(0);
    this.setState({ajaxCallInProgress:true});
    if(_.toInteger(this.props.params.tabIndex)==4){
           this.props.eventDetails(this.props.activeUser.token).then(()=>{
                  this.setState({currentEventList:this.props.selectedGroup.getEventsList});
                   $("#catList").trigger('click');
                  if(_.size(this.state.upComingeventDetail)==0 && _.size(this.props.selectedGroup.getEventsList)>0){
                          this.getEvent(this.props.selectedGroup.getEventsList[0].id);
                  }
            }).catch((error)=>{
          });
      }
      this.props.groupDetails(paramId, this.props.activeUser.token).then(()=>{
            this.setState({selectedGroupDetails:this.props.selectedGroup});

            this.getGroupMemebrs();

            this.props.getGroupFilesList(paramId, this.props.activeUser.token).then(()=>{
                        this.setState({filesList:this.props.selectedGroup.files});
                        this.setState({ajaxCallInProgress:false});
                    }).catch((error)=>{
                      this.setState({ajaxCallInProgress:false});
            });
          this.setState({ajaxCallInProgress:false});
        }).catch((error)=>{
           if(error == "Error: Request failed with status code 401"){
           this.context.router.push('/');
          }
          this.setState({ajaxCallInProgress:false});
       });
   }

   componentWillReceiveProps(nextProps){
     if(this.props.eventList.CurrentEvents!=nextProps.eventList.CurrentEvents){
             this.setState({currentEventList:nextProps.eventList.CurrentEvents});
     }


     if(this.props.groupDetails!=nextProps.groupDetails){
       this.setState({selectedGroupDetails:nextProps.selectedGroup});
     }

     if(this.props.selectedGroup!=nextProps.selectedGroup){
       this.setState({membersList:nextProps.selectedGroup.members});
       this.setState({postsList:nextProps.selectedGroup.posts});
       this.setState({filesList:nextProps.selectedGroup.files});
     }

     if(this.props.friends!=nextProps.friends){
       this.setState({friends:nextProps.friends});
     }
   }

   onGroupClick(){
        this.context.router.push('/editGroup_' + paramId);
    }


    onTabClick(tabIndex){
      this.setState({ajaxCallInProgress:true});
      if(tabIndex==0){
        this.props.groupDetails(paramId, this.props.activeUser.token).then(()=>{
                this.setState({selectedGroupDetails:this.props.selectedGroup});
                this.setState({ajaxCallInProgress:false});
                this.getFiles();
            }).catch((error)=>{
              this.setState({ajaxCallInProgress:false});
        });
      }
      else if(tabIndex==1){
          this.getGroupPostsDetails();
      }
      else if(tabIndex==2){
          this.props.getGroupMembers(this.props.activeUser.token, paramId).then(()=>{
             this.setState({friends:this.props.friends.Members});
             this.setState({ajaxCallInProgress:false});
          }).catch((error)=>{
            this.setState({ajaxCallInProgress:false});
          });
      }
      else if(tabIndex==3){
        this.props.getGroupsGallery(this.props.activeUser.token, paramId).then(()=>{
          this.setState({galleryList:this.props.selectedGroup.gallery});
          this.setState({ajaxCallInProgress:false});
        }).catch((error)=>{
          this.setState({ajaxCallInProgress:false});
        });
      }
      else if(tabIndex==4){
                this.props.getCurrentEventsDetailsList(this.props.activeUser.token, this.props.selectedGroup.id).then(()=>{
                    this.setState({currentEventList: this.props.selectedGroup.getEventsList});
                    if(_.size(this.state.upComingeventDetail)==0 && _.size(this.props.selectedGroup.getEventsList)>0){
                            this.getEvent(this.props.selectedGroup.getEventsList[0].id);
                    }
                    this.setState({ajaxCallInProgress:false});
                  }).catch((error)=>{
                      this.setState({ajaxCallInProgress:false});
                  });
       }
    }

    onLeaveGroup(){
      if(this.props.selectedGroup.admins_count==1){

$("#LeaveModal").modal('show');
      }
      else{

      this.props.leaveGroup(this.props.activeUser.token, paramId).then(()=>{
            this.context.router.push('/groups');
      }).catch((error)=>{

      });
      }

    }
getGroupGallery()
{
   this.props.getGroupsGallery(this.props.activeUser.token, paramId).then(()=>{
          this.setState({galleryList:this.props.selectedGroup.gallery});
          this.setState({ajaxCallInProgress:false});
        }).catch((error)=>{
          this.setState({ajaxCallInProgress:false});
        });
}
    onEventClick(eventsList, eventId){

      this.getEvent(eventId);
      this.setState({isCreateOrEdit: "Upcoming"});
    }
    getEvent(eventId){
      this.props.getCurrentEvent(eventId, this.props.activeUser.token).then(()=>{
        this.setState({upComingeventDetail:this.props.selectedEvent});
      }).catch((error)=>{
      });
  }

    enterCapture(e){
      if(e.target.value == ""){
          if(e.keyCode == 13){
            e.preventDefault();
          }
      }
      if((e.target.value != "") && (e.keyCode == 13)){
         $("#addPost").trigger("click");
     }
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

      deleteToggle(){
          var checkBoxes = $('.membersList');
          checkBoxes.change(function () {
          $('#deleteButton').prop('disabled', checkBoxes.filter(':checked').length < 1);
        });
      }

      disableButn(){
        this.props.getGroupMembers(this.props.activeUser.token, paramId).then(()=>{
            $('.membersList').attr('checked',false);
            this.setState({friends:this.props.friends.Members});
            this.setState({ajaxCallInProgress:false});
        }).catch((error)=>{
          this.setState({ajaxCallInProgress:false});
        });
        this.setState({modalView : !this.state.modalView});
        $("#deleteButton").prop({disabled:true});
      }

      onJoinGroup(){
         $("#JoinGrp").modal('show');
      }
      onYesClick(){

     this.props.RequestGroup(this.props.activeUser.token, this.props.selectedGroup.id).then(()=>{
     $("#JoinGrp").modal('hide');

      }).catch((error)=>{

      });
    }
    clickImage(id,src){
      let dispimg = "http://"+src;
       this.setState({
          tempid : dispimg
       });
       $('#viewAllImages').modal('show');
    }
    openImage(id,src){
      let dispimg = "http://"+src;
       this.setState({
          tempid : dispimg
       });
    }

    onInvite(id){


       if(this.refs.emailList.value == ""){
         this.refs.emailList.focus();
       }
       else{
             $("#btnSendInvite").prop({disabled:true});
             let emails=[];
             this.state.emailList = this.refs.emailList.value;

            let emailsSplit = this.state.emailList.split(',');
            emails.push(emailsSplit);

            this.props.inviteViaEmail(this.props.activeUser.token, id, emails).then(()=>{
            document.getElementById('useremails').value='';
            this.refs.emailList.value == "";
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
    onCloseMember(){
       $('.membersList').attr('checked',false);
       $('#groupaddMembers').modal('hide');
    }

       deleteImage(id){
             this.props.deleteGroupGallery(id, this.props.activeUser.token).then(()=>{
             this.getGroupGallery();
             }).catch((error)=>{
            console.log("Error", error);
         });
     }
deleteCommtenImage(){
  let id=this.state.cimgId;
  this.props.deletePostPhoto(this.props.activeUser.token, id).then(()=>{
                $("#deletecImageModal").modal('hide');
                this.getGroupPostsDetails();
           }).catch((error)=>{
           });
}
setcimgId(id){
  this.setState({cimgId:id});
  $("#deletecImageModal").modal('show');
}

     deleteFile(id){

       this.props.deleteGroupFile(id, this.props.activeUser.token).then(()=>{
       this.getFiles();
         }).catch((error)=>{
       console.log("Error", error);
    });

    }
    deletePost(id){
      this.props.deletePost(id, this.props.activeUser.token).then(()=>{
    this.getGroupPostsDetails();
  }).catch((error)=>{
    console.log("Error", error);
  });
    }
     deleteComments(id, commentId){
         this.props.deleteComment(id, commentId, this.props.activeUser.token).then(()=>{
         this.getGroupPostsDetails();
             }).catch((error)=>{
         console.log("Error", error);
              });
          }

       openModal(){
            $('#imageDelModal').modal('show');
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
               },
               error: function(){
                  that.setState({selectedScoreId:null});
               }
           });
          }
          else{

              toastr.error('Upload a valid Image');
          }
    }
    commentImage(){

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
               },
               error: function(){
               }
           });
          }
          else{

              toastr.error('Upload a valid Image');
          }
    }
   closeClick(status) {
    this.setState({modalView: status});
  }
        render(){
           return(
                <div className="gpadminmembers">

       <div className="Groupmember">
       <div className="groupGallery col-sm-12">
        <div className="editgrpimg">
          {isExistObj(this.state.selectedGroupDetails) && isExistObj(this.state.selectedGroupDetails.cover_image)?<img src={'http://'+ this.state.selectedGroupDetails.cover_image.image} className="coverimg"/>:<img className="coverimg" src={imagePath+ "coverimg.png"} />}

            {isExistObj(this.state.selectedGroupDetails) && (<div className="captionDiv">
                <span className="imgtag">{this.state.selectedGroupDetails.name} ({this.props.selectedGroup!=undefined && this.props.selectedGroup!=null?this.props.selectedGroup.members_count:0} {_.size(this.state.membersList)>1?'Members':'Member'})</span>
                <span  className="pvtGrptxt">{this.state.selectedGroupDetails.is_private?'Private Group':'Public Group'}</span>
            </div>)}
    </div>

    <div className="tabsForEvents mt40px">
    {(this.state.selectedGroupDetails!=undefined && this.state.selectedGroupDetails!=null && this.state.selectedGroupDetails.is_admin)?(<input type="button" value="Edit Group" onClick={this.onGroupClick.bind(this)} className="editEventButton"/>):(<div></div>)}
    {(this.state.selectedGroupDetails!=undefined && this.state.selectedGroupDetails!=null && this.state.selectedGroupDetails.is_admin)?(<img src={imagePath+"black-male-user-symbol.png"} className="adminicon"></img>):(<div></div>)}
    <Tabs >
        <TabList className="EventsTabHeader">
            <Tab onClick={this.onTabClick.bind(this, 0)}>Info</Tab>
            <Tab onClick={this.onTabClick.bind(this, 1)}>Post</Tab>
            <Tab onClick={this.onTabClick.bind(this, 2)}>Members</Tab>
            <Tab onClick={this.onTabClick.bind(this, 3)}>Gallery</Tab>
            <Tab onClick={this.onTabClick.bind(this, 4)}>Events</Tab>
        </TabList>

      <TabPanel>
            {(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(<div className="bgwhite pdtop2pc pdlft4pc pdbtm3pc col-sm-12 posAbs wd974pc">
            <div className="col-sm-12 zeroPad">
      <div>
                <span>Info</span>
                {isExistObj(this.state.selectedGroupDetails) && this.state.selectedGroupDetails.is_member?<button onClick={this.onLeaveGroup.bind(this)} className="btnLeaveGroup">Leave Group</button>:this.state.selectedGroupDetails.is_private?'':<button onClick={this.onJoinGroup.bind(this)} className="btnLeaveGroup" data-toggle="modal" >Join Group</button>}

                </div>
                <div className="modal fade" id="JoinGrp" role="dialog">
    <div className="modal-dialog modal-sm mt20pc">
      <div className="modal-content">
        <div className="modal-header bgGreen">

          <h4 className="modal-title">Request Access for Group</h4>
        </div>
        <div className="modal-body">
          <p className="fnt20px">Hello Administrator.<br/>
          I would like to join this group. Please approve my request.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btnPrimary" data-dismiss="modal">Cancel</button>
           <button type="button" className="btnPrimary" onClick={this.onYesClick.bind(this)}>Ok</button>
        </div>
      </div>
    </div>
  </div>
    <div className="modal fade" id="LeaveModal" role="dialog">
    <div className="modal-dialog modal-sm mt20pc">
      <div className="modal-content">
        <div className="modal-header bgdgreen txtwhite">

          <h4 className="modal-title">Leave Group</h4>
        </div>
        <div className="modal-body">
          <p>You are the only admin of the group. Please add another admin to leave this group.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default Closebtn" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
            </div>

            <div className="dividerLine1"></div>
                <div className="col-sm-6 mt15 pl0px pdng">
                <span>Description</span>
                    <div className="dividerLine2"></div>
                    <div className="mt15 ml20px mr15px">
                    {_.size(this.props.selectedGroup)>0?((this.state.editGroupInfoType=="text")?(<textarea id="groupInfoDescription" maxLength="500" type="text" className="form-control" defaultValue={(this.props.selectedGroup.description!=undefined)?this.props.selectedGroup.description:''} />):(<p dangerouslySetInnerHTML={{__html: this.props.selectedGroup.description}}></p>)):('')}</div>
                   <div>
                    {_.size(this.props.selectedGroup)>0?this.props.activeUser.id==this.state.selectedGroupDetails.created_by?((this.state.editGroupInfoType=="label")?(<button onClick={this.onEditGroupInfo.bind(this)} className="btnEdit">Edit</button>):(<div><button onClick={this.onUpdateGroupInfo.bind(this)} className="btnEdit">Update</button><button className="btnCancel" onClick={this.editCancel.bind(this)}>Cancel</button></div>)):(<div></div>):('')}</div>
                </div>
                <div className="col-sm-1 mt15">
                <img src={imagePath+"fileObject.png"} className="pdlft2px"></img>
                    <span className="fileTag">Files</span>
                </div>
                <div className="col-sm-5 mt15 ">
                <div className="col-sm-12 zeroPad">
                {_.size(this.state.filesList)>0 &&  this.state.filesList.map((item, index)=>{
                    return(  <div key={index} className="col-sm-10">
                    {isExistObj(this.props.selectedGroup) && this.props.selectedGroup.is_admin?<span className="glyphicon glyphicon-trash fr cursor-pointer" data-toggle="modal" data-target="#fileDelModal"></span>:''}

                     {/* Delete File PopUp*/}
                        <div className="modal fade" id="fileDelModal" role="dialog" data-dropback="static">
                                  <div className="modal-dialog">
                                         <div className="modal-content">
                                         <div className="modal-header">
                                         <h4>Delete File</h4>
                                         </div>
                                           <div className="modal-body">Are you sure you want to delete?</div>
                                             <div className="modal-footer">
                                                   <button type="button" className="cnfrmbtn checkng" data-dismiss="modal"  onClick={this.deleteFile.bind(this,item.id)} >Yes</button>
                                                   <button type="button" className="cancelbtn checkng" data-dismiss="modal">No</button>
                                              </div>
                                          </div>
                                       </div>
                                  </div>
                      {/*PopupOver*/}

                          <a className="cursor-pointer" target="_blank" href={'http://' + item.file}>{item.name.substr(0, item.name.lastIndexOf('.'))}</a><br/>
                          <span>{item.uploaded_on + ' by ' + item.uploaded_by}</span>
                          <div className="dividerLine3"></div>
                      </div>)
               })}
                </div>
                    {isExistObj(this.props.selectedGroup) && this.props.selectedGroup.is_member?<button data-toggle="modal" data-target="#uploadFileModal" className="btnFileUpload">Upload a file</button>:''}
                    <div className="modal fade addPost" id="uploadFileModal" role="dialog" data-backdrop="static">
                    <div className="modal-dialog tp25pc">
                    <form id="groupsForm">
                       <div className="modal-content">
                           <div className="modal-header col-sm-12 bgGreen">Upload File</div>
                           <div className="modal-body col-sm-12 bgwhite mb0px">
                              <input type="text" className="form-control" name="uploadFileName" id="uploadFileName" placeholder="Title"/>
                              <input ref="documents" id="documents" type="file" name="file" className="form-control" />

                           </div>
                          <div className="modal-footer col-sm-12 bgwhite">
                            <input type="button" className="upload-butn " value="Upload" id="uploadButton" onClick={this.onUploadFileClick.bind(this)} />
                            <input type="button" className="uploadcancel-butn " onClick={this.closeUploadFile.bind(this)} value="Cancel" />
                         </div>
                        </div>
                        </form>
                    </div>
                  </div>
                </div>
                </div>)}
            </TabPanel>
            <TabPanel>
{(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(
            <div className="pdng  col-sm-12">
              <div className="pdng col-sm-12">
               <div className="pdtop pdng pdbtm17px col-sm-12">
               {isExistObj(this.props.selectedGroup) && this.props.selectedGroup.is_member?<div className=" bgwhite groupPostPadng col-sm-12 mb0px">
                  <div className="rosie">
                    <div className="pdng col-sm-12">
                      <div className="pdng col-sm-1">
                        {isExistObj(this.props.activeUser) && <img src={'http://'+this.props.activeUser.profile_image_url} className="rosieImg" />}
                      </div>
                      <div className="pdng col-sm-11">

                        <input type="text" id="txtPostInput" placeholder=" Write Something..." className="inptxt" onKeyDown={this.enterCapture.bind(this)} onChange={this.onRequired.bind(this)} />

                      </div>
                    </div>
                    <div className="pdng col-sm-12">
                      <div className="pdng dividerLine1 col-sm-12"></div>
                    </div>
                    <div className="attach pdng  col-sm-12">
                    {isExistObj(this.props.selectedGroup) && this.props.selectedGroup.is_admin && this.props.selectedGroup.is_member?<div><input type="file" id="file" name="file" className="postCamera" onChange={this.postImage.bind(this)} multiple/>
                    <img src="/assets/img/Camera Icon.png" className="fleft"/></div>:''}
                      <div className="pdng col-sm-3">

                      </div>
                      <div className="col-sm-8"></div>
                      <div className="pdng col-sm-1 fr">
                       <input type="button" id="addPost" value="Post" ref="addPost" onClick={this.addPost.bind(this)} className="btn pstBtn col-sm-12"   disabled={this.state.postBtn||!this.state.postMsg} />
                      </div>
                    </div>
                  </div>
                </div>:''}
                <div className="col-sm-12 zeroPad mt1pc groupScroll">
                {_.size(this.state.postsList)>0  && this.state.postsList.map((item, i) => {
                return (<div key={i}>
                           <div className="brdpx bradpx padngall mb1pc bgwhite col-sm-12 ">
                  <div className="brad">
                    <div className="col-sm-12 pdng">

                      <div className="pdng col-sm-12">
                      {isExistObj(this.props.activeUser) && item.author.id==this.props.activeUser.id?<span className="glyphicon glyphicon-trash fr cursor-pointer mt1pc" data-toggle="modal" data-target="#postDelModal"></span>:''}

                          <div className="modal fade" id="postDelModal" role="dialog" data-dropback="static">
                                  <div className="modal-dialog">
                                         <div className="modal-content">
                                          <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <h4 className="modal-title">Delete Post</h4>
                          </div>
                                           <div className="modal-body">Are you sure you want to delete?</div>
                                             <div className="modal-footer">
                                                   <button type="button" className="cnfrmbtn checkng" data-dismiss="modal"  onClick={this.deletePost.bind(this,item.id)} >Yes</button>
                                                   <button type="button" className="cancelbtn checkng" data-dismiss="modal">No</button>
                                              </div>
                                          </div>
                                       </div>
                                  </div>

                        <div className="pdng col-sm-1 txtcenter">
                          <img src={'http://'+item.author.profile_image_url} className="bradImg" />
                        </div>
                        <div className="pdng col-sm-11">
                          <div className="col-sm-12 zeroPad">
                            <div className="prsnName">{item.author.first_name}</div>
                            <div className="prsnSeen">{item.created}</div>
                          </div>
                        </div>
                      </div>
                      <div className="msgRply col-sm-12">{item.title}
                       <div>

                    </div>
                    </div>
                    <div className="col-sm-12">
                      {_.size(item.images)>0? item.images.map((imgItem,i)=>{
                        return(
                 <div className="col-sm-2 postImgDiv">
                        <img src={"http://"+imgItem.image} className="img-thumbnail wd120px hgt120px"/>
                    {isExistObj(this.props.activeUser) && isExistObj(this.props.selectedGroup) && this.props.activeUser.id==item.author.id && this.props.selectedGroup.is_admin?<i className="glyphicon glyphicon-remove top-55px cursor-pointer" data-toggle="modal" onClick={this.setPImgId.bind(this,imgItem.id)} data-dropback="false"></i>:''}
                    <div className="modal fade" id="deleteImageModal" role="dialog">
                  <div className="modal-dialog modal-sm">
                  <div className="modal-content">
                   <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <h4 className="modal-title">Delete Photo</h4>
                          </div>
                          <div className="modal-body">
                            <p>Are you sure you want to delete this photo?</p>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="checkng" data-dismiss="modal">No</button>
                            <button type="button" className="checkng" onClick={this.deletePostImage.bind(this)}>Yes</button>
                          </div>
                        </div>
                      </div>
                    </div>
               </div>
                        );
                      }):''}
                    </div>
                    </div>
                    <div className="col-sm-12 rspnsng">
                      <div className="col-sm-8"></div>
                      <div className="col-sm-4 pdng">
                        <div className="col-sm-12 pdng">
                          <span onClick={this.onLikeClick.bind(this, item.id)} className={(item.has_like)?"like color-green cursor-pointer":"like cursor-pointer"}><span className={(item.has_like)?("rspnsImg glyphicon glyphicon-heart color-green"):("rspnsImg glyphicon glyphicon-heart ")}></span>Like (<span className="likingNumber">{item.likes_count}</span>)</span>
                          <span className="cursor-pointer" onClick={this.focusOnCommentBox.bind(this, item.id)} className="comment cursor-pointer"><img src="/assets/img/icons/comment.png"  className="rspnsImg"/>Comment</span>
                        </div>
                      </div>
                    </div>
                    <div id="likeModal" className="modal fade" role="dialog">
                        <div className="modal-dialog modal-sm">
                          <div className="modal-content">
                            <div className="modal-header">
                              <button type="button" className="close" data-dismiss="modal">&times;</button>
                              <h4 className="modal-title">4 Likes <img src="/assets/img/icons/like.png"/></h4>
                            </div>
                            <div className="modal-body">
                                <p>Nick Zinos</p>
                                <p>Rosie Perez</p>
                                <p>Steve Harvey</p>
                                <p>Tim Carson</p>
                            </div>
      <div className="modal-footer">
        <button type="button" className="clsBtn btnGeneral" data-dismiss="modal">Close</button>
      </div>
    </div>

  </div>
</div>
            {_.size(item.comments)>0 && item.comments.map((childItem, childIndex)=>{
              return(<div key={childIndex} className="ml5pc"><div className="rosieRply col-sm-12 pdng">
                      <div className="pdng col-sm-1">
                        <img src={'http://'+childItem.author.profile_image_url} className="rosieImg" />
                      </div>
                      <div className="col-sm-11 pdng">
                        <div className="col-sm-12 pdng">

                          <div className="pdng col-sm-12">
                            <div className="col-sm-3 pdng prsnName">{childItem.author.first_name} {childItem.author.last_name}</div>
                            {isExistObj(this.props.activeUser) && childItem.author.id==this.props.activeUser.id?<span className="glyphicon glyphicon-trash fr cursor-pointer mt1pc" data-toggle="modal" data-target="#commentsDelModal"></span>:''}
                          </div>

                          <div className="modal fade" id="commentsDelModal" role="dialog" data-dropback="static">
                                  <div className="modal-dialog">
                                         <div className="modal-content">
                                          <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <h4 className="modal-title">Delete Comment</h4>
                          </div>
                                           <div className="modal-body">Are you sure you want to delete?</div>
                                             <div className="modal-footer">
                                                   <button type="button" className="cnfrmbtn checkng" data-dismiss="modal" onClick={this.deleteComments.bind(this,item.id, childItem.id)} >Yes</button>
                                                   <button type="button" className="cancelbtn checkng" data-dismiss="modal">No</button>
                                              </div>
                                          </div>
                                       </div>
                                  </div>

                          <div className="col-sm-12 pdng prsnSeen">{childItem.created}</div>
                          <div className="col-sm-6 pdng prsnMsg">{childItem.body}</div>

                           <div className="col-sm-12">
                      {_.size(childItem.images)>0? childItem.images.map((cimgItem,i)=>{
                        return(
                        <div className="col-sm-2 postImgDiv">
                           <img src={"http://"+cimgItem.image} className="img-thumbnail wd120px hgt120px"/>
                    {isExistObj(this.props.activeUser) && isExistObj(this.props.selectedGroup) && childItem.author.id==this.props.activeUser.id && this.props.selectedGroup.is_admin?<i className="glyphicon glyphicon-remove top-55px cursor-pointer" data-toggle="modal" onClick={this.setcimgId.bind(this,cimgItem.id)} ></i>:''}
                    <div className="modal fade" id="deletecImageModal" role="dialog">
                  <div className="modal-dialog modal-sm">
                  <div className="modal-content">
                   <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <h4 className="modal-title">Delete Photo</h4>
                          </div>
                          <div className="modal-body">
                            <p>Are you sure you want to delete this photo?</p>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="checkng" data-dismiss="modal">No</button>
                            <button type="button" className="checkng" onClick={this.deleteCommtenImage.bind(this)}>Yes</button>
                          </div>
                        </div>
                      </div>
                    </div>

                   </div>
                        );
                      }):''}
                    </div>
                        </div>
                      </div>
                    </div>
                    </div>)
            })}
                  {isExistObj(this.props.selectedGroup) && this.props.selectedGroup.is_member && this.props.selectedGroup.is_admin?<div className="steveRply col-sm-12 pdng ml5pc">
                      <div className="pdng col-sm-1">
                        <img src={'http://'+item.author.profile_image_url} className="SteveImg"/>
                      </div>
                      <div className="pdng brdrpx col-sm-11">
                        <div className="col-sm-12 pdng">
                       {isExistObj(this.props.selectedGroup) && isExistObj(this.props.activeUser) && this.props.selectedGroup.is_admin && this.props.selectedGroup.is_member && this.props.activeUser.id==item.author.id?<div><img src="/assets/img/Camera Icon.png" className="fr"/>
                           <input type="file" id="commentFile" name="commentFile" className="commentCameraPost" onChange={this.commentImage.bind(this)} multiple/></div>:''}
                          <div className="col-sm-11 pdng">
                            <textarea className="txtar" id={item.id+ "_txtComment"}></textarea>
                          </div>
                          <div className="col-sm-1 pdng">

                          </div>
                        </div>
                      </div>
                      </div>:''}
                      </div>

                    {isExistObj(this.props.selectedGroup) && this.props.selectedGroup.is_member && this.props.selectedGroup.is_admin?<div>
                  <input type="button" id={item.id} value="Add Comment" onClick={this.Comment.bind(this, item.id)}  className="btnAddComment" />
                    </div>:''}
                    </div>

                  </div>)
                  })}
                </div>
              </div>
            </div></div>)}
            </TabPanel>
            <TabPanel>
            {(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(
            <div className="bgwhite pdtop2pc pdbtm3pc col-sm-12">
                 <div className="tophead col-sm-12">
                  <div className="col-sm-4 mt1pc">
                  <span className="fontclr">{_.size(this.state.membersList)} Members
                  </span>
                  </div>
                  <div className=" col-sm-3 addMembDropdown">
                    {isExistObj(this.props.selectedGroup) && this.props.selectedGroup.is_member?<button type="button" className="membersbtn col-sm-12 zeroPad cursor-pointer" onClick={this.disableButn.bind(this)}>+ Add Member</button>:''}
                      {(this.state.modalView == true)
                              ? (
                                <div>
                                  <InviteModal
                                  nameProp="Add Members"
                                    membersForFriends={this.state.friends}
                                    closeModal={this
                                    .closeClick
                                    .bind(this)}
                                    paramId = {paramId}
                                    isFrom="2"/>
                                </div>
                              )
                              : (
                                <div></div>
                              )}
                  <div className="modal fade groupModalPopup" id="groupaddMembers" role="dialog" data-backdrop="static">
                    <div className="modal-dialog tpdialog">
                      <div className="modal-content">
                          <div className="modal-header col-sm-12 bgGreen">
                          <button type="button" className="close" onClick={this.onCloseMember.bind(this)}>&times;</button>
                          <div className="modal-title">
                            ADD MEMBER
                          </div>
                         </div>
                        <div className="modal-body col-sm-12 bgwhite mb0px">
                        <div className="col-sm-12 txtRyt">
                          <input type="text" className="searchForAddMembers" placeholder="Search Users" onKeyPress={this.onAddmemberSearch.bind(this)}/>
                          <span className="glyphicon glyphicon-search addSearchglyph" />
                          </div>
                        <form id="addOrRemoveMemebrs" className="card-block">
                          <div className="col-sm-12">

                              {_.size(this.state.friends)>0  ? this.state.friends.map((item, i) => {return(<div  key={i}>
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
                          <input type="button"onClick={this.addOrRemoveMembers.bind(this)} className=" btn sve-butn" id="deleteButton" value="Save" disabled={this.state.buttonDisabled}/>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
              <div className="searchbox col-sm-3">
               <span className="glyphicon glyphicon-search glyphiconforSearch"></span> <input onKeyPress={this.onFriendsSearch.bind(this)} type="text" className="searchbr" placeholder=" Find a Member"/>
               </div>
               <div className="col-sm-2">
                   <div className="modal fade addInvite" id="inviteModal" role="dialog" data-backdrop="static">

                            <div className="modal-dialog  tpmdl">
                               <div className="modal-content">
                                   {isExistObj(this.props.selectedGroup) && <div className="modal-header col-sm-12 bgGreen"><h4 className="m0px">INVITE NEW USER TO {this.props.selectedGroup.name}</h4></div>}
                                   <div className="modal-body col-sm-12 bgwhite mb0px">
                                   <div className="col-sm-12">
                                      To:<input type="email"  ref = "emailList" placeholder="abc@gmail.com" id="useremails" name="useremails" className="invtEmailInput" />
                                   </div>
                                   {this.state.errEmail}

                                   </div>
                                  <div className="modal-footer col-sm-12 bgwhite">
                                    <button type="button" className="btn groupbutnSend" id="btnSendInvite"  onClick={this.onInvite.bind(this,this.props.selectedGroup.id)}>Send</button>
                                    <button type="button" className="btn groupbutnCncl" onClick={this.onCancel.bind(this)}>Cancel</button>
                                 </div>
                                </div>
                            </div>


              </div>
                   </div>

                    <div className="dividertag"></div>
                  </div>
                  <div className="col-sm-12">
                  {_.size(this.state.membersList)>0  && this.state.membersList.map((item, i) => {
                  return <div key={i} className="col-sm-6">
                  {isExistObj(this.props.activeUser) && (<Link to={this.props.activeUser.id==item.id?"/profile_0":"/profileDetail_"+item.id}><div className="col-sm-12 zeroPad">
                          <div className="col-sm-4">
                              <img src={'http://'+item.profile_image_url} className="moealdo"></img>
                          </div>
                          <div  className="col-sm-8">
                            <h2 className="fnt41px">{item.last_name + ", " + item.first_name}</h2>
                            <p></p>
                          </div>
                      </div></Link>)}
                      </div>
                  })}
              </div>
              </div>)}
            </TabPanel>
            <TabPanel>
{(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(
            <div className="galleryDetails bgwhite pdtop2pc pdbtm3pc col-sm-12">
                     <div className="col-sm-12">
                     <div className="photos col-sm-6">
                         <h3 className="m0px fnt18px">{_.size(this.state.galleryList)} Photos</h3>
                     </div>
                     {isExistObj(this.props.selectedGroup) && this.props.selectedGroup.is_admin?<div className="adbtn col-sm-6 pdng">
                         <button className="photobtn cursor-pointer">Add Photos</button>
                         <input ref="file" id="file" type="file" name="file" onChange={this.uploadFile} className="upload-file form-control" accept="image/*" multiple />
                     </div>:''}
                     </div>
                     <div className="col-sm-12 dividertag mb3pc mt1pc"></div>
                     <div className=" col-sm-12">
                       <div className="firstrow pdryt0px col-sm-12">
                            {_.size(this.state.galleryList)>0 && this.state.galleryList.map((item, index)=>{
                                return(<div key={index} className="galleryImg col-sm-3">
                                <img src={'http://'+item.image} className="imgg" data-toggle="modal" onClick={this.clickImage.bind(this,item.id,item.image)}></img>
                                {isExistObj(this.props.selectedGroup) && this.props.selectedGroup.is_admin?<div className="edit"><a  className="cursor-pointer"   onClick={this.openModal.bind(this,item.id)}><i className="glyphicon glyphicon-remove"  ></i></a></div>:''}

                                <div className="modal fade" id="imageDelModal" role="dialog" data-dropback="static">
                                  <div className="modal-dialog">
                                         <div className="modal-content">
                                         <div className="modal-header">
                                         <h4>Delete Photo</h4>
                                         </div>
                                           <div className="modal-body">Are you sure you want to delete?</div>
                                             <div className="modal-footer">
                                                   <button type="button" className="cnfrmbtn checkng" data-dismiss="modal" onClick={this.deleteImage.bind(this,item.id)} >Yes</button>
                                                   <button type="button" className="cancelbtn checkng" data-dismiss="modal">No</button>
                                              </div>
                                          </div>
                                       </div>
                                  </div>


                                </div>  );
                                          })}
  <div className="modal fade" id="viewAllImages" role="dialog">
                  <div className="modal-dialog tp13pc">
                    <div className="modal-content brdrRad0px">
                    <div className="modal-header bgfff">
                     <button className="close color-black" data-dismiss="modal">&times; </button>
                    </div>
                      <div className="modal-body">
                        <div className="round_close">

                          <div className="opened_Image txtcenter">
                            <span className="thumbnail m0px">
                              <img src={this.state.tempid} alt="selectedImage" className="sliderImges" />
                              {/*{this.state.tempid}*/}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                            <div id="content" className="modalinlineAlign col-sm-12">

                           {isExistObj(this.state.galleryList) ? this.state.galleryList.map((item,index)=>{
                             return(
                            <img src={"http://"+ item.image} alt={"http://"+ item.image} className=" modalinlnImgs" onClick={this.openImage.bind(this,item.id,item.image)} />)
                                  }):<div></div>}
                            </div>
                      </div>
                    </div>
                 </div>
   </div>

                       </div>
                    </div>
                </div>)}
            </TabPanel>
            <TabPanel>
            {(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(
            <div className="bgwhite pdtop2pc pdbtm3pc col-sm-12 group_Events">
            <div className="col-sm-12">

            <div>
                <span>Events</span>
                {isExistObj(this.props.selectedGroup) && this.props.selectedGroup.is_member && <button onClick={this.onButtonClick.bind(this, "Create")}  className="btnCreateEvent">Create Event</button>}
                <div className="col-sm-12 pdl0px-1024 mt10px"><div className="col-sm-3 pdtop"><ul className="groupEventScroll">
               {_.size(this.state.currentEventList)>0 && this.state.currentEventList.map((eventDetail, index)=>{
                     return(<div key={index}><EventListDetail id="catList" eventsList={this.state.currentEventList} eventDetail={eventDetail} onEventClick={this.onEventClick.bind(this)} /></div>);
               })}
               </ul></div>
                {(this.state.isCreateOrEdit=="Create" || this.state.isCreateOrEdit=="Edit")?(<CreateEvent onSaveClick={this.onSaveClick.bind(this)} id={this.props.selectedGroup.id} isCreateOrEdit={this.state.isCreateOrEdit} upComingeventDetail={this.state.upComingeventDetail} />):((this.state.upComingeventDetail!=undefined && _.size(this.state.upComingeventDetail)>0)?(<UpcomingEventDetails onButtonClick={this.onButtonClick.bind(this)} onRequestInviteClick={this.onRequestInviteClick.bind(this)} upComingeventDetail={this.state.upComingeventDetail} activeUser={this.props.activeUser} isFromAllEvents={false} isPastEvent={false} />):(<div className="mt2pc"></div>))}

               </div>
            </div>

            <div className="dividerLine1"></div>

            <div className="col-sm-5">

            </div>
            </div>

             </div>)}
            </TabPanel>

            </Tabs>

    </div>
    </div>
              </div>



               </div>
            );
    }
}
GroupMembers.contextTypes= {
     router: React.PropTypes.object.isRequired
}
function mapStateToProps(state) {
    return {
        activeUser: (state.activeUser!=null && state.activeUser!=undefined)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
        selectedGroup:state.selectedGroup,
        myProfile: (state.myProfile!=undefined&& state.myProfile!=null)?state.myProfile:[],
        friends: state.friends,
        eventList: (state.eventReducer!=undefined && state.eventReducer!=null)?state.eventReducer:[],
        selectedEvent: state.selectedEvent,
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({createEvents, groupDetails, getGroupMembersList, searchGroupMembers,
      addComment,  getGroupPostsList, addNewPost, userProfileDetails, getGroupsGallery, leaveGroup,
       editGroupInfo, getGroupFilesList, getGroupMembers, getCurrentEventsDetailsList, likePost,
       addOrRemoveGroupMemebrs, getCurrentEvent, eventDetails, searchaddMembers, editEvents,
        RequestGroup, inviteViaEmail, deleteGroupGallery, deletePost, deleteComment, deleteGroupFile, deletePostPhoto}, dispatch);
}
export default connect(mapStateToProps, matchDispatchToProps) (GroupMembers);
