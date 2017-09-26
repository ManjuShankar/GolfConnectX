import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import _ from 'lodash';
import {courseList,getCourseObject, searchCourses, unFollowCourse} from '../actions/courseListAction';
import {eventDetails} from '../actions/eventDetailsAction';
import EventListDetail from './child-components/eventListDetail';
import GoogleMap from 'google-map-react';
import Marker from './marker.js';
import {groupList} from '../actions/groupListAction';
class SelectedCoursePage extends Component{

    constructor(props,context){
        super(props,context);
        }
render(){
        
         return(
         	<div className="selectedCourse">
         	<div className="">
           <div  className="">
           <div className="courseHeader">
           COURSES
           </div>
           <div className="removePadding">

                    <div className="imgGolf"><img src="/assets/img/premuim/golfImg.png"/></div>
                    <div className="col-sm-6">
                    <div className="following">
                    <span><span className="OrangeDot"><img src="/assets/img/icons/eclipse.png"/></span>Following</span>
                    </div>
                    </div>
                    <div className="col-sm-6 mt2pc txtwhite"><div className="played">Played</div></div>
                    <div className="col-sm-12"><div className="coursesTitle">Name</div></div>
            </div>
		<div className="col-sm-12 posAbs">
                       <div className="map col-sm-6 fr">
                   <GoogleMap
       				 center={{lat: 0, lng: 0}}
        			defaultZoom={14}>
               		 <Marker lat={0} lng={0}/>
     				 </GoogleMap>


                    </div>
         </div>
         <div className="col-sm-12 CourseTabs">
        <Tabs  selectedIndex={0}>
                        <TabList>
                          <Tab>Post</Tab>
                          <Tab>Description</Tab>
                          <Tab>Groups</Tab>
                          <Tab>Events</Tab>

                        </TabList>


        <TabPanel>
        <div className="headerEvents">
            <div className="col-sm-9">
              1 Upcoming Event
              </div>
              <div className="col-sm-3">
              <button className="viewEveBtn">View Events</button>
              </div>
            </div>
            <div className ="eventsContainer">
           <div className="postContent"  >
            
              <div className="col-sm-6">
                
                    <div className="inlinePostTittle">
                    <div className="postthumb"><img src="" className="postImg"/></div>
                    <div className="postTittle">title</div>
                    </div>
                    
                </div>
              
   
                
             
                <div className="col-sm-6">
                    <div className="postTime">created<br/>created_since ago</div>
                </div>
                <div className="col-sm-12">
                <div className="postSumary">
                    body
                    </div>
                    </div>
                <div className="col-sm-12">
                    <span className="like"><span className="likeIcon"><img src="/assets/img/icons/like.png" /></span><span className="likeTxt">Like</span></span>|
                    <span className="comment"><span className="commentIcon"><img src="/assets/img/icons/comment.png" /></span><span className="commentTxt">Comment</span></span>|
                    <span className="share"><span className="shareIcon"><img src="/assets/img/icons/share.png" /></span><span className="shareTxt">Share</span></span>

                </div>

            </div>


                </div>
        </TabPanel>

        <TabPanel>
        Description
        </TabPanel>
        <TabPanel>
        
          <div className="groupListData col-sm-12 zeroPad">
          <span>pvt</span>
          <div className="groupData">
            <span className="pl10px">name</span>
             <span className="viewGroup">view ></span>


        </div>
        </div>
          
          
        </TabPanel>
        <TabPanel className="eventsTabs">
        <Tabs>
        <TabList className="eventsTabList">
          <Tab className="eventsHead" >Upcoming</Tab>
          <Tab className="eventsHead" >Past</Tab>
          <Tab className="eventsHead" >Calendar</Tab>
        </TabList>
        <TabPanel className="eventsTabPanel">
            <ul>
            Upcoming
            </ul>
        </TabPanel>
        <TabPanel className="eventsTabPanel">
           <ul>
            Past
            </ul>
        </TabPanel>
        <TabPanel className="eventsTabPanel">
          <h2>Calendar</h2>
        </TabPanel>
      </Tabs>
        </TabPanel>
      </Tabs>
      </div>
   
			</div>
			</div>
			</div>
              );
         }

          
    }

    SelectedCoursePage.contextTypes = {
  router: React.PropTypes.object.isRequired
};


function mapStateToProps(state) {
    return {
        getCourseList: state.getCourses,
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
        selectedCourse: state.selectedCourse,
        eventList: (state.eventReducer!=undefined && state.eventReducer!=null)?state.eventReducer:[],
        getGroupList: (state.getgroupList!=undefined && state.getgroupList!=null)?state.getgroupList:[]
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({courseList,eventDetails, searchCourses, unFollowCourse, getCourseObject, groupList}, dispatch);


}

export default  connect(mapStateToProps, matchDispatchToProps)(SelectedCoursePage);