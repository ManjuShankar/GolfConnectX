import React, {PropTypes, Component} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Link } from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {React_Boostrap_Carousel} from 'react-boostrap-carousel';

import {getProfileDetails} from '../actions/profileActions';
import {onSendRequest} from '../actions/friendsAction';
import _ from 'lodash';
import {createNewMessage} from '../actions/messagesAction';
import Spinner from 'react-spinner';
import EventListDetail from './child-components/eventListDetail';
import UpcomingEventDetails from './child-components/upcomingEventDetails';
import GroupsList from './child-components/groupsList';

import {getCurrentEvent} from '../actions/eventDetailsAction';
import {getMyCourses, getDirectoryPosts, getDirectoryFriends, searchFriends,
  searchGroups, getDirectoryProfilegroupList, getNewScore, getDirectoryEventDetails} from '../actions/profileActions';
import {getCourseObject} from '../actions/courseListAction';
import {isExistObj} from '../utils/functions';

let paramId;
class profileDetail extends React.Component {
   constructor(props){
       super(props);
       this.state={
         currentEventList: [],
         getGroupList:[],
         profileCoursesList: [],
         postsList:[],
         courseDetails:{},
         Notes:[],
         upComingeventDetail:{},
         isCreateOrEdit: "Upcoming",
         profileDetails: {},
         myFriendsList: [],
         ajaxCallInProgress:false,
         errScore : "",
         getScores:{},
         img:"",
         selectedImage:"",
         slectedImagesList: []
       };
   }

   componentWillMount(){
        this.setState({ajaxCallInProgress:true});
        let urlPath = _.split(location.pathname, '_');
        paramId =  (_.size(urlPath)>0)?(_.toInteger(urlPath[1])):(0);
        this.props.getProfileDetails(this.props.activeUser.token, paramId).then(()=>{
              this.setState({profileDetails: this.props.selectedProfileDetails});
              this.setState({ajaxCallInProgress:false});
        }).catch((error)=>{
          console.log("Error", error);
          if(error == "Error: Request failed with status code 401"){
          this.context.router.push('/');
          }
        });

        if(_.toInteger(paramId)==4){
         this.props.getDirectoryEventDetails(this.props.activeUser.token, this.state.profileDetails.profile.id).then(()=>{
                this.setState({currentEventList:this.props.eventList.CurrentEvents, ajaxCallInProgress:false});
                
                this.getEvent(this.props.eventList.CurrentEvents[0].id);
            }).catch((error)=>{
              this.setState({ajaxCallInProgress:false});
            });
          }

   }


   onSendClick(id){
     let  message=document.getElementById('txtArea');
     this.props.onSendRequest(this.props.activeUser.token, id, message).then(()=>{
         $("#myModal").modal('hide');
     }).catch((error)=>{
    console.log("Error", error);
   });
   }

   onSendMessageClick(email){
     let formData={};
     let participants = email;
     _.set(formData, 'message', _.trim(document.getElementById('messageTxtArea').value));
     _.set(formData, 'participants', email);
       this.props.createNewMessage(this.props.activeUser.token, formData).then(()=>{
         document.getElementById('messageTxtArea').value='';
         $("#sendMessageModal").modal('hide');
       }).catch((error)=>{
       });
   }

   modifyParam(index){
         this.setState({ajaxCallInProgress:true});
         this.context.router.push('/profileDetail_'+index);
         paramId = index;
         if(index==0){
           this.props.getMyCourses(this.props.activeUser.token, this.state.profileDetails.profile.id).then(()=>{
                this.setState({profileCoursesList:this.props.myProfile.MyProfileCourseList, ajaxCallInProgress:false});
            }).catch((error)=>{
              this.setState({ajaxCallInProgress:false});
            });


             if(_.size(this.state.courseDetails)==0 && _.size(this.props.myProfile.MyProfileCourseList)>0){
                   this.showCourseDetails(this.props.myProfile.MyProfileCourseList[0].id);
             }
         }
         else if(index==1){
         this.props.getDirectoryPosts(this.props.activeUser.token, this.state.profileDetails.profile.id).then(()=>{
             this.setState({postsList:this.props.myProfile.MyPostsList, ajaxCallInProgress:false});
         }).catch((error)=>{
           this.setState({ajaxCallInProgress:false});
         });
        }
        else if(index==2){
          this.props.getDirectoryProfilegroupList(this.props.activeUser.token, this.state.profileDetails.profile.id).then(()=>{
            this.setState({getGroupList:this.props.myProfile.MyGroups, ajaxCallInProgress:false});
            }).catch((error)=>{
          this.setState({ajaxCallInProgress:false});
          });
        }
        else if(index==3){
          this.props.getDirectoryFriends(this.props.activeUser.token, this.state.profileDetails.profile.id).then(()=>{
             this.setState({myFriendsList:this.props.myProfile.MyFriends, ajaxCallInProgress:false});
           }).catch((error)=>{
             this.setState({ajaxCallInProgress:false});
          });
        }
        else if(index==4){
          this.props.getDirectoryEventDetails(this.props.activeUser.token, this.state.profileDetails.profile.id).then(()=>{
            
                this.setState({currentEventList:this.props.eventList.CurrentEvents, ajaxCallInProgress:false});

                this.getEvent(this.props.eventList.CurrentEvents[0].id);
            }).catch((error)=>{
              this.setState({ajaxCallInProgress:false});
            });
        }
   }

   showCourseDetails(id){
     this.props.getCourseObject(id, this.props.activeUser.token).then((id)=>{
        this.setState({courseDetails:this.props.selectedCourse});
     }).catch((error)=>{
     });
     this.props.getNewScore(this.props.activeUser.token, id).then(()=>{
        this.setState({getScores:this.props.myProfile.getScores, ajaxCallInProgress:false});

    }).catch((error)=>{
      this.setState({ajaxCallInProgress:false});
    });
   }

   openViewAllDialog(id){
       let imageArray = _.find(this.props.myProfile.getScores, ['id',id]).images;
       let _selectedImage;
       if((_.size(imageArray)>0)){
           _selectedImage = imageArray[0];
           this.setState({selectedImage:("http://" + _selectedImage.src)});
           this.setState({slectedImagesList:imageArray});
       }
       $('#viewAllImages').modal('show');
   }

    openImage(childItem, id){
      let imageArray = _.find(this.props.myProfile.getScores, ['id',id]).images;
      let _selectedImage;

      if((_.size(imageArray)>0) && (_.some(imageArray, ['id',childitem]))){
        _selectedImage = _.find(imageArray, ['id',childitem]);
        this.setState({selectedImage:("http://" + _selectedImage.src)});

        this.setState({slectedImagesList:imageArray});
      }
      // $('#selectImage').modal('show');
  }

   openDialog(childitem,id){
     let imageArray = _.find(this.props.myProfile.getScores, ['id',id]).images;
     let _selectedImage;
     if((_.size(imageArray)>0) && (_.some(imageArray, ['id',childitem]))){
         _selectedImage = _.find(imageArray, ['id',childitem]);
         this.setState({selectedImage:("http://" + _selectedImage.src)});
         this.setState({slectedImagesList:imageArray});
     }
     $('#selectImage').modal('show');
   }

   onGroupsSearch(e){
      if(e.which==13){
        this.props.searchGroups(this.props.activeUser.token, e.target.value).then(()=>{
              this.setState({getGroupList:this.props.myProfile.MyGroups});
              this.context.router.push('/profileDetail_2');
        }).catch((error)=>{
        });
      }
   }

  onGroupClick(groupId){
      this.context.router.push('/groupMembers_'+groupId);
  }

  onFriendsSearch(e){
         if(e.which==13){
           this.props.searchFriends(this.props.activeUser.token, e.target.value).then(()=>{
                 this.setState({myFriendsList:this.props.myProfile.MyFriends});
                 this.context.router.push('/profileDetail_3');
           }).catch((error)=>{
           });
         }
   }

   onButtonClick(val){
     ///this.setState({isCreateOrEdit:val});
   }

   getEvent(eventId){
   
     this.props.getCurrentEvent(eventId, this.props.activeUser.token).then(()=>{
       this.setState({upComingeventDetail:this.props.selectedEvent});
     }).catch((error)=>{
     });
   }

   onEventClick(eventsList, eventId){
     this.getEvent(eventId);
     this.setState({isCreateOrEdit: "Upcoming"});
     ///this.context.router.push('/profile_4');
   }

    render() {
      if(_.size(this.state.profileDetails)>0){
      return (
          <div className="Profile_Page col-sm-12">
              <div className="prflBasicPage">
                  <div className="imgPart col-sm-12">

                      <div className="profileImg pdng col-sm-12">
                          <img src="/assets/img/background.png" className="coverimg pdng col-sm-12" />
                      </div>
                      <div className="ovrImg col-sm-12">
                      <div className="modal fade" id="sendMessageModal" role="dialog" data-backdrop="static">
                      <div className="modal-dialog">
                         <div className="modal-content">
                             <div className="modal-header">
                               <button className="close" data-dismiss="modal">&times; </button>
                               <h3 className="m0px">Message</h3>
                             </div>
                            <div className="modal-body"><textarea id="messageTxtArea" maxLength="1000" className="txtarea form-control" placeholder="write something.." name="messageTxtArea"></textarea></div>
                            <div className="modal-footer">
                              <button onClick={this.onSendMessageClick.bind(this, this.state.profileDetails.profile.email)} type="button" className="Send-butn" id="btnSend">Send</button>
                              <button type="button" className="Cancel-butn" data-dismiss="modal">Cancel</button>
                           </div>
                          </div>
                      </div>
                      </div>

                      <div className="modal fade" id="myModal" role="dialog" data-backdrop="static">
                      <div className="modal-dialog">
                         <div className="modal-content">
                             <div className="modal-header">INVITE</div>
                            <div className="modal-body"><textarea id="txtArea" maxLength="500" className="txtarea form-control" placeholder="write something.." name="txtArea"></textarea></div>
                            <div className="modal-footer">
                              <button onClick={this.onSendClick.bind(this, this.state.profileDetails.profile.id)} type="button" className="Send-butn" id="btnSend">Send</button>
                              <button type="button" className="Cancel-butn" data-dismiss="modal">Cancel</button>
                           </div>
                          </div>
                      </div>
                      </div>
                          <div className="col-sm-6"></div>
                          <div className="btn-cntnt col-sm-6">
                              <div className="col-sm-12">
                                  <div className="col-sm-4"></div>
                                  <div className="col-sm-4">
                                        {isExistObj(this.state.profileDetails.profile) &&  this.state.profileDetails.profile.is_friend?'':<button type="button" className="reqBtn snd col-sm-12"  data-toggle="modal" data-target="#myModal">Send Friend Request</button>}
                                  </div>
                                  <div className="col-sm-4">
                                        <button type="button" className="msgBtn snd col-sm-12"  data-toggle="modal" data-target="#sendMessageModal">Send Message</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="detailsPart col-sm-12">

                       <div className="namePart col-sm-12">
                        <div className="col-sm-2 ">
                          {isExistObj(this.state.profileDetails.profile) && <img src={'http://'+ this.state.profileDetails.profile.profile_image_url} className="nameImg" />}
                        </div>
                        <div className="col-sm-3 pdng">
                          {isExistObj(this.state.profileDetails.profile) && (<div className="personDetails pdng col-sm-12">
                              <div className="personName">{this.state.profileDetails.profile.first_name}</div>
                              <div className="personJoined">Joined {this.state.profileDetails.profile.joined} ago</div>
                          </div>)}
                        </div>
                         {isExistObj(this.state.profileDetails.skills) &&  (<div className="margtp col-sm-3">
                             <div className="col-sm-12">
                                 <div className="pdng fntbld col-sm-6">Skill Level</div>
                                 <div className="pdng fntlyt col-sm-6">{this.state.profileDetails.skills.skill_level}</div>
                             </div>
                             <div className="col-sm-12">
                                 <div className="pdng fntbld col-sm-6">Type of Golfer</div>
                                 <div className="pdng fntlyt col-sm-6">{this.state.profileDetails.skills.golfer_type}</div>
                             </div>
                          </div>)}
                          {isExistObj(this.state.profileDetails.profile) && isExistObj(this.state.profileDetails.skills) &&  (<div className="margtp col-sm-3">
                             <div className="col-sm-12">
                                 <div className="pdng fntbld col-sm-6">Profile Type</div>
                                 <div className="pdng fntlyt col-sm-6">{this.state.profileDetails.profile.is_private?'Private':'Public'}</div>
                             </div>
                             <div className="col-sm-12">
                                 <div className="pdng fntbld col-sm-6">Handicap</div>
                                 <div className="pdng fntlyt col-sm-6">{this.state.profileDetails.skills.handicap}</div>
                             </div>
                          </div>)}
                      </div>
                  </div>
                  <div className="tabsForEvents">
                  <Tabs selectedIndex={(_.toInteger(paramId)<=4)?(_.toInteger(paramId)):(0)} className="col-sm-12">
                    <TabList className="EventsTabHeader col-sm-12">
                      <Tab onClick={this.modifyParam.bind(this, 0)}>Courses</Tab>
                      <Tab onClick={this.modifyParam.bind(this, 1)}>Posts</Tab>
                      <Tab onClick={this.modifyParam.bind(this, 2)}>Groups</Tab>
                      <Tab onClick={this.modifyParam.bind(this, 3)}>Friends</Tab>
                      <Tab onClick={this.modifyParam.bind(this, 4)}>Events</Tab>
                    </TabList>
                    <TabPanel>
                      {(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):((_.size(this.state.profileCoursesList)>0)?(<div className="images visitedDetails zeroPad col-sm-12">
                      <div className="leftsideimgs col-sm-4 zeroPad profilescroll">
                      {this.state.profileCoursesList.map((item, i) => {
                      return (<div key={i} className="col-sm-12 profileimg_bg"><div className="leftimg1" onClick={this.showCourseDetails.bind(this,item.id)}>
                      <div className="nameoverimg">
                         <img src="/assets/img/golf-shadow-creek-03.png" className="img1"></img>
                           <div className="following">
                             <span className="OrangeDot">
                                <img src="/assets/img/icons/eclipse.png"/></span>Following</div>
                                  <center>  <span className="center">{item.name}</span></center>
                          </div>
                          <p className="left col-sm-6">{item.city}</p>
                          <p className="ryt col-sm-6">{item.created_on}</p></div>
                      </div>)
                      })}
                      </div>

                      {(isExistObj(this.state.courseDetails) &&  isExistObj(this.state.courseDetails.course_user_details) && isExistObj(this.props.myProfile) && _.size(this.props.myProfile.MyProfileCourseList)>0)?(
                        <div className="rightsideimgs col-sm-8">
                          <div className="rytsideimg1">
                              <div className="nameoverimg"><img src="/assets/img/golf-shadow-creek-04.png" className="img4"></img>
                               {(this.state.courseDetails.course_user_details.is_following)?(<div className="following col-sm-10">
                                  <span className="OrangeDot">
                                          <img src="/assets/img/icons/eclipse.png"/>
                                   </span>Following
                                </div>):(<div></div>)}
                               {(this.state.courseDetails.course_user_details.is_played)?(<div className="top-ryt col-sm-2"><span className="topryt">Played</span></div>):(<div></div>)}
                               {isExistObj(this.state.courseDetails.course) && (<Link to={"/courses_"+ this.state.courseDetails.course.id}>
                                <div className="cursor-pointer">
                                  <center>
                                   <span className="center">{this.state.courseDetails.course.name}</span>
                                  </center>
                                </div>
                              </Link>)}
                            </div>
                           {/* <div className="scores col-sm-12">
                                <div className="score1 col-sm-6">
                                  <ul className="scre col-sm-12">
                                    <li className="name">My Best Score</li>
                                    <li className="date fr">{this.state.courseDetails.course_user_details.top_score_date}</li>
                                  </ul>
                                  <p className="score col-sm-12">{this.state.courseDetails.course_user_details.top_score}</p>
                              </div>
                              <div className="score2 col-sm-6 cursor-pointer" data-toggle="modal" data-target="#myModal1">
                                <ul className="scre col-sm-12">
                                    <li className="name">My Last Score</li>
                                    <li className="date fr">{this.state.courseDetails.course_user_details.latest_score_date}</li>
                                </ul>
                                <p className="score col-sm-12">{this.state.courseDetails.course_user_details.latest_score!=null?this.state.courseDetails.course_user_details.latest_score:'Click to add new score'}</p>
                                <span>{this.state.courseDetails.course_user_details.latest_score!=null?'Click to add new score':''}</span>
                              </div>
                          </div>*/}
                       </div>
                 {isExistObj(this.props.myProfile) && isExistObj(this.props.myProfile.getScores) ? this.props.myProfile.getScores.map((item,index)=>{
                  return(<div className="col-sm-12 mtb2pc" key={index}>
                            <div className="col-sm-12 zeroPad">
                              <span className="col-sm-6 txtLft zeroPad">{item.played_on}</span>
                              <span className="col-sm-6 txtRyt zeroPad">score:{item.score}</span>

                            </div>
                            <div>
                              <div className="col-sm-12 zeroPad mt1pc mb2pc">
                                  {(_.size(item.images)>0)?(<div className="col-sm-12 txtRyt zeroPad cursor-pointer"><span className="curPntr" onClick={this.openViewAllDialog.bind(this, item.id)}>View All &gt;</span></div>):('')}
                              </div>
                              <div className="modal fade" id="viewAllImages" role="dialog">
                                <div className="modal-dialog tp13pc">
                                  <div className="modal-content brdrRad0px">
                                    <div className="modal-body">
                                      <div className="round_close">
                                        <button className="close" data-dismiss="modal">&times; </button>
                                          <div className="opened_Image txtcenter">
                                            <span className="thumbnail m0px">
                                                <img src={this.state.selectedImage} alt="selectedImage" className="sliderImges" />
                                            </span>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="modal-footer">
                                    <div id="content" className="modalinlineAlign col-sm-12">
                                        {(_.size(this.state.slectedImagesList)>0 && this.state.slectedImagesList.map((childItem, index)=>{
                                            return(<img src={"http://" + childItem.thumbnail} alt={"http://" + childItem.src} className="modalinlnImgs" onClick={this.openImage.bind(this, childItem.id, item.id)} />)
                                        }))}
                                    </div>
                              </div>
                         </div>
                            <div className="notes mt1pc mb1pc">
                              <p>Notes<span className="glyphicon glyphicon-pencil"></span></p>
                              <p className="xx" maxLength="250">{item.notes?(item.notes):("")}</p>
                            </div>

                       </div>
                     </div>
                     <div id="content" className="inlineAlign col-sm-12">
                         {(_.size(item.images)>0 && item.images.map((childItem, index)=>{
                           return(<img src={"http://" + childItem.thumbnail} alt="upload_one" className="inlnImgs" onClick={this.openDialog.bind(this, childItem.id, item.id)} />)
                         }))}
                     </div>
                   </div>
                   <div className="modal fade" id="selectImage" role="dialog">
                       <div className="modal-dialog tp13pc">
                           <div className="modal-content brdrRad0px">
                               <div className="modal-body">
                                   <div className="round_close">
                                     <button className="close" data-dismiss="modal">&times; </button>
                                       <div className="opened_Image txtcenter">
                                           <span className="thumbnail m0px">
                                             <img src={this.state.selectedImage} alt="selectedImage" className="sliderImges" />
                                           </span>
                                         </div>
                                       </div>
                                     </div>
                                 <div className="modal-footer">
                                     <div id="content" className="modalinlineAlign col-sm-12">
                                     {(_.size(this.state.slectedImagesList)>0 && this.state.slectedImagesList.map((childItem, index)=>{
                                       return(<img src={"http://" + childItem.thumbnail} alt={"http://" + childItem.src} className="modalinlnImgs" onClick={this.openImage.bind(this, childItem.id, item.id)} />)
                                     }))}
                                  </div>
                               </div>
                             </div>
                           </div>
                         </div>
                      </div>)}):<label></label>}
             </div>):(<div></div>)}
           </div>):(<div><label>Courses are not displayed due to privacy settings.</label></div>))}
           </TabPanel>
           <TabPanel>
               {(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite "><Spinner /></div>):(<div className="col-sm-12 bgwhite hAuto">
                   <div className=" col-sm-12">
                     <h3>Post</h3>
                       <div className="pdright">
                         {_.size(this.state.postsList)>0 && isExistObj(this.state.profileDetails) && isExistObj(this.state.profileDetails.profile) && _.size(this.state.postsList)>0 ? this.state.postsList.map((item, i) => {
                            return (<div key={i}>
                                      <div className="post1 col-sm-12">
                                        <div className="subpost col-sm-12">
                                          <span className="col-sm-1 zeroPad">
                                            <img src={'http://'+ item.author.profile_image_url} className="post-img"></img>
                                          </span>
                                          <div className="post-name col-sm-7">
                                            <h3>{item.author.first_name} {item.author.last_name}</h3>
                                            <h4>{item.created}</h4>
                                          </div>
                                          <div className="col-sm-4 txtRyt mt1pc zeroPad">
                                            <p>{item.created_since}</p>
                                          </div>
                                        </div>
                                        <div className="subpost-cntnt mt1pc col-sm-12">
                                          <span>{item.title}</span>
                                        </div>
                                        {_.size(this.state.postsList.comments)>0  && this.state.postsList.comments.map((item, i) => {
                                            return(<div key={i}><div className="cmnt">
                                                    <span className="like"><img src="/assets/img/icons/like.png"/>Like</span>
                                                    <span className="comment"><img src="/assets/img/icons/comment.png"/>Comment</span>
                                                   </div>
                                                   <div className="Rosie-rply">
                                                    <img src="/assets/img/Rosie Perez.png" className="Rosie-img"></img>
                                                    <div className="Rosie-name">
                                                      <h3>Rosie Perez</h3>
                                                      <p>Same here! I can’t wait!!!</p>
                                                      <h4>June 10 @ 9:33pm</h4>
                                                    </div>
                                                  </div></div>)})}
                                                </div>
                                              </div>)
                                          }):<div><label></label></div>}
                                        </div>
                                      </div>
                                  </div>)}
                              </TabPanel>
                              <TabPanel>
                                {(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(<div className="profilegrpDetails col-sm-12">
                                  <div className="row m0px heightAndScrollForGroup">
                                    <div className="search-icon col-sm-12">
                                        <span className="postrelative left3pc"><img src="/assets/img/icons/Search_Icon.png"/></span>
                                        <input onKeyPress={this.onGroupsSearch.bind(this)} type="text" placeholder="Search for a group" className="profGroupSearch"></input>
                                    </div>
                                    {(_.size(this.state.getGroupList)>0)?(<div className="row">
                                      <div>
                                        <div className="row">
                                          <div className="col-md-12 profiDetilGroup">
                                            <div className="col-sm-12">
                                              <React_Boostrap_Carousel  className="carousel-fade" indicators={(_.size(this.state.getGroupList)>0 && _.size(this.state.getGroupList[0])>=7)?true:false}>
                                                {_.size(this.state.getGroupList)>0 && this.state.getGroupList.map((parent, index)=>{
                                                    return(<div className="col-sm-12 pdpcgroups" key={index}>
                                                           {_.size(parent)>0 && parent.map((groupListDetails, childIndex)=>{
                                                              return(
                                                                  <div key={childIndex}>
                                                                    <div onClick={this.onGroupClick.bind(this,groupListDetails.id)}>
                                                                      <div className="col-md-3 cursor-pointer">
                                                                        <div className="col-sm-12 txtcenter">
                                                                          <img src={'http://'+groupListDetails.cover_image} className="panelimg"/>
                                                                        </div>
                                                                        <div className="col-sm-12 txtcenter">
                                                                          <span className=" txtcenter ">{_.truncate(_.trim(groupListDetails.name), {
                                                                            'length': 24,
                                                                            'separator': ' '
                                                                          })}</span>
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                </div>);
                                                            })}</div>)})}
                                                          </React_Boostrap_Carousel>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>):(<span></span>)}
                                          </div>
                                        </div>)}
                                    </TabPanel>
                                    <TabPanel>
                                      {(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(<div className="profilefrndDetails col-sm-12">
                                        <div className="search-icon col-sm-12">
                                          <span className="postrelative left3pc"><img src="/assets/img/icons/Search_Icon.png"/></span>
                                          <input onKeyPress={this.onFriendsSearch.bind(this)} type="text" placeholder="Search for a friend" className="profFrndSearch"></input>
                                        </div>
                                        <div className="friendlist col-sm-12">
                                          <div className="col-sm-12">
                                            {_.size(this.state.myFriendsList)>0?(<div>
                                                {this.state.myFriendsList.map((item, i) => {
                                                    return <Link to={'/profileDetail_'+item.id}><div key={i} className="col-sm-6">
                                                        <span className="frndlist1 col-sm-12 zeroPad">
                                                          <span className="col-sm-4"><img src={'http://'+ item.profile_image_url} /></span>
                                                          <div className="frnd-name col-sm-8">
                                                            <h3>{item.first_name}</h3>
                                                            <p>{item.email}</p>
                                                            <p><label>Joined: {item.joined} ago</label></p>
                                                          </div>
                                                        </span>
                                                        </div></Link>
                                           })}</div>):(<div><label></label></div>)}
                                        </div>
                                      </div>
                                  </div>)}
                              </TabPanel>
                              <TabPanel>
                                {(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(<div className="col-sm-12 bgwhite pdtop">
                                  <div className="col-sm-3 eventScroll">
                                      {_.size(this.state.currentEventList)>0  && this.state.currentEventList.map((eventDetail, index)=>{
                                          return(<div key={index}><EventListDetail eventsList={this.state.currentEventList} eventDetail={eventDetail} onEventClick={this.onEventClick.bind(this)} /></div>);
                                      })}
                                  </div>
                                  {(this.state.upComingeventDetail!=undefined && _.size(this.state.upComingeventDetail)>0)?(<UpcomingEventDetails isFromProfileDetails={true} onButtonClick={this.onButtonClick.bind(this)} upComingeventDetail={this.state.upComingeventDetail} activeUser={this.props.activeUser} isFromAllEvents={false} isPastEvent={false} />):(<div></div>)}
                                 </div>)}
                           </TabPanel>
                        </Tabs>
                     </div>
              </div>
          </div>
              );
            }else {
              return(<div></div>);
            }
   }
}

profileDetail.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
       activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
       selectedProfileDetails: state.selectedProfileDetails,
       eventList:   (state.eventReducer!=undefined && state.eventReducer!=null)?state.eventReducer:[],
       myProfile:   (state.myProfile!=undefined && state.myProfile!=null)?state.myProfile:[],
       selectedCourse: state.selectedCourse,
       selectedEvent: state.selectedEvent,
       selectedGroup:state.selectedGroup
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({getProfileDetails, onSendRequest, createNewMessage,
      getDirectoryEventDetails,
      getMyCourses,
      getDirectoryPosts,
      getCourseObject,
      getCurrentEvent,
      getDirectoryFriends,
      searchFriends,
      searchGroups,
      getDirectoryProfilegroupList,
      getNewScore
    }, dispatch);


}
export default connect(mapStateToProps,matchDispatchToProps) (profileDetail);
