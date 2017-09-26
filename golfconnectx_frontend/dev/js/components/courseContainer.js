import React, {Component} from 'react';
import {Link} from 'react-router';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import _ from 'lodash';
import {courseList,getCourseObject, searchCourses, unFollowCourse, getCurrentEventsDetailsList,
 getPastEventsDetailsList, groupList} from '../actions/courseListAction';
import {eventDetails} from '../actions/eventDetailsAction';
import EventListDetail from './child-components/eventListDetail';
import NonPremiumCourse from './child-components/nonPremiumCourse';
import GoogleMap from 'google-map-react';
import Marker from './marker.js';

import Spinner from 'react-spinner';
import {isExistObj} from '../utils/functions';
import moment from 'moment';

let next="";
class CourseContainer extends Component{
    constructor(props,context){
        super(props,context);
        this.state={
                    loggedInUser:props.activeUser,
                    getCourseslist: [],
                    currentEventList: [],
                    pastEventList: [],
                    courseDetails:{},
                    following:0, getGroupList: [],
                    pageNumber:1,
                    lastScrollPos:0,
                    prevSearchCriteria: "",
                    ajaxCallInProgress:false, ajaxCall:false,
                    tempCourseId : ""
        };
          this.handleScroll = this.handleScroll.bind(this);
          this.onEventClick = this.onEventClick.bind(this);
    }
     componentWillMount(){
        this.getCourseListData();
        this.setState({ajaxCallInProgress:true});
    }

      getCourseListData(pageNumber=0){
      if(next!=null){
                let keyword =(document.getElementById('keyword')!=undefined && document.getElementById('keyword')!=null)?(_.trim(document.getElementById('keyword').value)):('');
                  this.props.courseList(this.props.activeUser.token, pageNumber, keyword).then((data)=>{
                           console.log("page",pageNumber);

                    next = data;
                    this.setState({getCourseslist:this.props.getCourseList});
                    /*let urlPath = _.split(location.pathname, '_');
                    let paramId= (_.size(urlPath)>0)?(_.toInteger(urlPath[1])):(0);
                    if(paramId!=0){
                      this.showCourseDetails(paramId);
                    }else{
                    this.showCourseDetails(this.props.getCourseList[0].id);
                    }*/
                    this.setState({ajaxCallInProgress:false});
                  }).catch((error)=>{
                  if(error == "Error: Request failed with status code 401"){
                        this.context.router.push('/');
                  }
            });
        }
       else if($("#keyword").val()!=""){
          this.props.courseList(this.props.activeUser.token, pageNumber, $("#keyword").val(), this.state.getCourseslist).then((data)=>{
            next = data;
            this.setState({getCourseslist:this.props.getCourseList});
            this.setState({ajaxCallInProgress:false});
          }).catch((error)=>{
            if(error == "Error: Request failed with status code 401"){
            this.context.router.push('/');
          }
        });
      }
  }

    componentWillReceiveProps(nextProps){
        if(this.props.getCourseList!=nextProps.getCourseList){
            this.setState({getCourseslist:nextProps.getCourseList});
        }
        if(this.props.courseEvent!=nextProps.courseEvent){
                this.setState({currentEventList:nextProps.courseEvent.Upcoming,
                pastEventList:nextProps.courseEvent.Past,
              getGroupList:nextProps.courseEvent.Groups});
        }

        if(this.props.selectedCourse!=nextProps.selectedCourse){
                this.setState({courseDetails:nextProps.selectedCourse});
        }

        if(this.props.getCourseList!=nextProps.getCourseList && _.size(this.state.courseDetails)==0 && _.size(nextProps.getCourseList)>0){
          let urlPath = _.split(location.pathname, '_');
          let paramId= (_.size(urlPath)>0)?(_.toInteger(urlPath[1])):(0);
          if(paramId!=0){
            this.showCourseDetails(paramId);
          }else{
            this.showCourseDetails(nextProps.getCourseList[0].id);
          }
        }
    }

     showCourseDetails(id){
           this.setState({tempCourseId:id});
           this.setState({ajaxCall:true});
           this.props.getCourseObject(id, this.props.activeUser.token).then((id)=>{
           this.setState({courseDetails:this.props.selectedCourse});
               console.log("this.state.courseDetails",this.state.courseDetails);
           this.modifyParam();
           this.getGroups();
           this.setState({ajaxCall:false});
       }).catch((error)=>{
       });

     }

     handlefollowChange(e){
        this.setState({following:e.target.value});
    }

    OnUnfollow(){
      this.props.unFollowCourse(this.props.activeUser.token, this.state.courseDetails.course.id).then((data)=>{
      }).catch((error)=>{
    });
   }

      onCourseSearch(e){
          if(e.which==13){
            if(this.state.prevSearchCriteria!=_.trim(e.target.value)){
            if(_.trim(e.target.value)!=""){
            this.state.pageNumber = 1;
            this.state.prevSearchCriteria = _.trim(e.target.value);
            this.props.searchCourses(this.props.activeUser.token, _.trim(e.target.value), _.toInteger(this.state.pageNumber)).then((data)=>{
                  next = data;
                  this.setState({getCourseslist:this.props.getCourseList});
                  this.showCourseDetails(this.props.getCourseList[0].id);
            }).catch((error)=>{

            });
          }
          else{
            next='';
            this.getCourseListData();

          }
        }
      }
    }

  componentWillUnmount(){
        window.removeEventListener('scroll', this.handleScroll);
  }

  componentDidMount() {
      $('.menu').parent().removeClass('active');
      $('#course').parent().addClass('active');
      window.addEventListener('scroll', this.handleScroll);
   }


   handleScroll(event) {
     let el = document.getElementById('golfCourseList');
     if(el.scrollHeight - el.scrollTop - el.clientHeight < 1){
         event.currentTarget.scrollTop=event.currentTarget.scrollHeight;
              this.state.lastScrollPos = event.currentTarget.scrollTop,
              this.state.pageNumber = this.state.pageNumber + 1;
              if(next!=null){
                this.getCourseListData(this.state.pageNumber);
            }else{
              this.state.pageNumber=1;
            }
      }
  }

 modifyParam(){
        this.props.getCurrentEventsDetailsList(this.props.activeUser.token,this.state.courseDetails.course.id).then(()=>{
            this.setState({currentEventList:this.props.courseEvent.Upcoming});
        }).catch((error)=>{

        });
        this.props.getPastEventsDetailsList(this.props.activeUser.token,this.props.selectedCourse.course.id).then(()=>{
        this.setState({pastEventList:this.props.courseEvent.Past});
        }).catch((error)=>{

        });
}

getGroups(){
   this.props.groupList(this.props.activeUser.token, this.state.courseDetails.course.id).then(()=>{
            this.setState({getGroupList:this.props.courseEvent.Groups});
        }).catch((error)=>{

        });
}

viewForum(){
  this.context.router.push("/forumCourse_"+ this.state.courseDetails.course.id);
 // location.reload();
}

onEventClick(eventsList, eventId){
  this.context.router.push("/events_"+ eventId);
}
  rightViewToggle(){
    let width = window.innerWidth;
      
    if(width<992){
      
      $('.premium').fadeIn();
      $('.lftPart').hide();
      $('.nonPrem').show();
    }
    else{
      $('.premium').fadeIn();
      $('.lftPart').show();

    }
  }
  leftViewToggle(){
    let width = window.innerWidth;
    if(width<992){
      
      $('.lftPart').fadeIn();
      $('.premium').hide();
      $('.nonPrem').hide();
    // this.append();
    }
    else{
      $('.lftPart').fadeIn();
      $('.premium').show();

    }
  }
    append(classname){
        if(classname == "nonPremium"){
        $(".nonPrem").hide();
        }
    
    }

     render(){
         /*if(_.size(this.state.getCourseslist)>0){*/
         return(<div>
           {(this.state.ajaxCallInProgress)?(<div className="mt25pc"><Spinner /></div>):(<div id="courseSearch" className=" courses_Mainpage">
            <div   className=" coursing pdlftryt0px col-sm-12 pdryt0px scroll_cntrl">
            <div  id="courseScroll" className="coursesContainner col-sm-12 pdlftryt0px">
              <div className="col-sm-12 pdlftryt0px display">

                <div className="coursesHeader ">  <span className="glyphicon glyphicon-chevron-left glyphiconShow " onClick={this.leftViewToggle.bind(this)}></span>Courses</div>
              </div>
              <div className="col-sm-12 pdlftryt0px">
                <div className="coursesContent col-sm-12 zeroPad">
                  <div className="col-sm-12 col-md-4 pdlftryt0px lftPart">
                      <div className="searchResult" id="scroll">
                          <div className="CoursesSearchBox" > <span className="CoursessearchIcon"><img src="/assets/img/icons/Search_Icon.png" /></span>
                              <input onKeyPress={this.onCourseSearch.bind(this)} type="text" placeholder="Search Courses" id="keyword"/> </div>
                              <ul id="golfCourseList" onScroll={this.handleScroll}>
                                {_.size(this.state.getCourseslist)>0 ? this.state.getCourseslist.map((item, index)=>{
                                return(<div key={index} onClick={this.showCourseDetails.bind(this,item.id)}>
<li className={(this.state.tempCourseId==item.id)?("selected_element"):("")}>
                                        <div onClick={this.rightViewToggle.bind(this)}>
                                          {(item.is_premium)?(<span className="glyphicon glyphicon-star starImg"></span>):(<span className="glyphicon glyphicon-star txtTrans float-left"></span>)}
                                          <span className="fieldName col-sm-10 col-xs-10">{item.name}</span>
                                          <span className="col-sm-1 glyphicon glyphicon-menu-right"></span>
                                          </div>
                                        </li>
                                       </div>);
                                }):<div>Course with that name doesn't exist</div>}
                              </ul>
                      </div>
                  </div>
                  {(_.size(this.state.courseDetails)>0 && isExistObj(this.state.courseDetails.course) && this.state.courseDetails.course.is_premium)?((this.state.ajaxCall)?(<div className="mt25pc"><Spinner /></div>):(<div className="premium bgfff pdlftryt0px col-sm-12 col-md-8 col-xs-12 mt1_5pc">
                    <div className="col-sm-12 pdlftryt0px col-xs-12 courseSelRspns">
                      <span className="glyphicon glyphicon-chevron-left float-left" onClick={this.leftViewToggle.bind(this)} />
                    </div>
                  <div className="col-sm-12 removePadding col-xs-12 hgt180px">
                    {/*<div className="imgGolf col-sm-12 zeroPad"><img src={_.size(this.state.courseDetails.course.cover_image)>0?"http://"+this.state.courseDetails.course.cover_image.image:"/assets/img/premuim/golfImg.png"} className="col-sm-12"/></div>*/}
 {(_.size(this.state.courseDetails.course.cover_image)>0  && this.state.courseDetails.course.cover_image.height>=240 && this.state.courseDetails.course.cover_image.width>=1152)?(<img src={'http://' + this.state.courseDetails.course.cover_image} className="edit_courseImg" />):(<div className="hero col-sm-12 zeroPad">
                  <img className="hero__background" />
                  <center><img className="hero__image"  src={'http://'+this.state.courseDetails.course.cover_image} /></center>
             </div>)}

                    <div className="col-sm-6"><div className="following"><div><img className="wd15pc" src="/assets/img/premiumBadge.png" /><span className="txtwhite">Premium Course</span></div><br/>{((_.size(this.state.courseDetails)>0 && this.state.courseDetails.course_user_details.is_following)?(<span><span className="OrangeDot"><img src="/assets/img/icons/eclipse.png"/></span>Following</span>):(<span className="clrTrnsparnt">following</span>))}</div></div>
                    <div className="col-sm-6"><div className="played">{(_.size(this.state.courseDetails)>0 && this.state.courseDetails.course_user_details.is_played)?'Played':''}</div></div>
                    {/*<div className="col-sm-12"><div>{(_.size(this.state.courseDetails)>0)?(<div className="coursesTitle">{this.state.courseDetails.course.name}</div>):''}</div></div>*/}
                    <div className="col-sm-12 top12pc"><div>{(_.size(this.state.courseDetails)>0)?(<div className="coursesTitle">{this.state.courseDetails.course.name}</div>):''}</div></div>

                    </div>

                <div className="coursesScrollRight col-xs-12 pdlftryt0px">
                  <div className="unfollowCourses col-xs-12"><button type="button" className="unfllw-butn"  onClick={this.OnUnfollow.bind(this)}>{(_.size(this.state.courseDetails)>0 && this.state.courseDetails.course_user_details.is_following)?'Unfollow Course':'Follow Course'}</button></div>
                    <div className="col-sm-6 removePadding col-xs-6">                      
                        <div className="coursesAddress col-xs-12 pdlftryt0px">{(_.size(this.state.courseDetails)>0)?this.state.courseDetails.course.address1:''} <br/>{(_.size(this.state.courseDetails)>0)?this.state.courseDetails.course.address2:''}</div>
                        <div className="coursescontact col-xs-12 pdlftryt0px">{(_.size(this.state.courseDetails)>0)?this.state.courseDetails.course.phone:''}<br/>{(_.size(this.state.courseDetails)>0)?this.state.courseDetails.course.email:''}</div>

                    </div>
                    <div className="col-sm-6 removePadding mt1pc col-xs-6">
                       <div className="map">
                   <GoogleMap
        center={{lat: (_.size(this.state.courseDetails)>0&& isExistObj(this.state.courseDetails.course))?this.state.courseDetails.course.lat:0, lng: (_.size(this.state.courseDetails)>0)?this.state.courseDetails.course.lon:0}}
        defaultZoom={14}>
                <Marker lat={(_.size(this.state.courseDetails)>0 && isExistObj(this.state.courseDetails.course))?this.state.courseDetails.course.lat:0} lng={(_.size(this.state.courseDetails)>0)?this.state.courseDetails.course.lon:0}/>
      </GoogleMap>


                    </div>
                    </div>
                        <div className="col-sm-12 col-xs-12 removePadding pb2pc">
                        <Tabs  selectedIndex={0}>
                        <TabList>

                          <Tab>Course Info</Tab>
                          <Tab>Forum</Tab>
                          <Tab >Groups</Tab>
                          <Tab >Events</Tab>
                        </TabList>




        <TabPanel>
        {(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(

          <div className="description">
         {isExistObj(this.props.selectedCourse) && isExistObj(this.props.selectedCourse.course) && isExistObj(this.props.selectedCourse.course.admin) && isExistObj(this.props.activeUser) && this.props.selectedCourse.course.admin.id==this.props.activeUser.id?(<Link to={"/editCourses_"+ this.state.courseDetails.course.id}><button className="btnEditCourse">Edit Course</button></Link>):(<span></span>)}
          {(_.size(this.state.courseDetails)>0 && isExistObj(this.state.courseDetails.course))?  <p dangerouslySetInnerHTML={{__html: this.state.courseDetails.course.description}}></p>:''}
            </div>)}
        </TabPanel>
                         <TabPanel>
                              {/* <div className="headerEvents">
            <div className="col-sm-9">
              {_.size(this.state.currentEventList)} {_.size(this.state.currentEventList)>1?'Upcoming Events':'Upcoming Event'}
              </div>
              <div className="col-sm-3">
              <Link to="/events"><button className="viewEveBtn">View Events</button></Link>
              </div>
            </div>
            <div className ="eventsContainer">
            {(this.state.courseDetails.course!=undefined && this.state.courseDetails.course!=null)?this.state.courseDetails.course.posts.map((item,i)=>{
              return(<div className="postContent"  key={i}>

              <div className="col-sm-6">

                    <div className="inlinePostTittle">
                    <div className="postthumb"><img src={'http://'+item.author.profile_image_url} className="postImg"/></div>
                    <div className="postTittle">{item.title}</div>
                    </div>

                </div>




                <div className="col-sm-6">
                    <div className="postTime">{item.created}<br/>{item.created_since} ago</div>
                </div>
                <div className="col-sm-12">
                <div className="postSumary">
                    {item.body}
                    </div>
                    </div>
                <div className="col-sm-12">
                    <span className="like"><span className="likeIcon"><img src="/assets/img/icons/like.png" /></span><span className="likeTxt">Like</span></span>|
                    <span className="comment"><span className="commentIcon"><img src="/assets/img/icons/comment.png" /></span><span className="commentTxt">Comment</span></span>|
                    <span className="share"><span className="shareIcon"><img src="/assets/img/icons/share.png" /></span><span className="shareTxt">Share</span></span>

                </div>

            </div>



)
            }):(<div></div>)}

                </div>*/}
            
                              <div className="txtcenter">
                              <button className="btnForum" onClick={this.viewForum.bind(this)}>View Forum</button>
                              </div>
                              

        </TabPanel>
        <TabPanel>

          {_.size(this.state.getGroupList)>0 && this.state.getGroupList.map((item, index)=>{

            return(<div key={index} >
              <div className="groupListData col-sm-12 zeroPad">
          <span>{item.is_private?'Private Group':'Public Group'}</span>
          <div className="groupData">
          <img src={'http://'+item.cover_image} className="grpImg" />
            <span className="pl10px txtUnderline"><Link to={"groupMembers_" + item.id}>{item.name}</Link></span>
             <Link to={"groupMembers_" + item.id}><span className="viewGroup">view ></span></Link>



        </div>
        </div>

          </div>);
            })}

        </TabPanel>
        <TabPanel className="eventsTabs">
        <Tabs>
        <TabList className="eventsTabList">
          <Tab className="eventsHead" >Upcoming</Tab>
          <Tab className="eventsHead" >Past</Tab>

        </TabList>
        <TabPanel className="eventsTabPanel">
            <ul className="eventTabScroll">
            {_.size(this.state.currentEventList)>0 ? this.state.currentEventList.map((eventDetail, index)=>{
                  return(<div key={index}><EventListDetail eventsList={this.state.currentEventList} eventDetail={eventDetail} onEventClick={this.onEventClick} /></div>);
            }):<label className="ml10px">No events to show</label>}
            </ul>
        </TabPanel>
        <TabPanel className="eventsTabPanel">
           <ul className="eventTabScroll">
           {_.size(this.state.pastEventList)>0 ? this.state.pastEventList.map((eventDetail, index)=>{
                  return(<div key={index}><EventListDetail eventsList={this.state.pastEventList} eventDetail={eventDetail} /></div>);
            }):<label className="ml10px">No events to show</label>}
            </ul>
        </TabPanel>

      </Tabs>
        </TabPanel>
      </Tabs>
    </div>
 </div>
</div>)
):
(<div className="nonPrem">
  <div className="col-sm-12 pdlftryt0px col-xs-12 courseSelRspns">
    <span className="glyphicon glyphicon-chevron-left float-left" onClick={this.leftViewToggle.bind(this)} />
  </div>
  <NonPremiumCourse OnUnfollow={this.OnUnfollow.bind(this)} courseDetails={this.state.courseDetails} append={this.append.bind(this)}/></div>)}
</div>
</div>
            <div className="ads txtcenter col-xs-12 pdlftryt0px"><img src="/assets/img/golfconnectx_ad.png"/></div>
            </div>
</div>
</div>)}
            </div>
              );
         /*}*/

         /* else {

            return(
              <div></div>
          );
         }*/
    }
}
CourseContainer.contextTypes = {
  router: React.PropTypes.object.isRequired
};


function mapStateToProps(state) {
    return {
        getCourseList: state.getCourses,
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
        selectedCourse: state.selectedCourse,


        courseEvent:(state.courseEvent!=undefined && state.courseEvent!=null)?state.courseEvent:{}
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({courseList,eventDetails, searchCourses, unFollowCourse, getCourseObject,
     groupList, getCurrentEventsDetailsList, getPastEventsDetailsList}, dispatch);


}

export default  connect(mapStateToProps, matchDispatchToProps)(CourseContainer);