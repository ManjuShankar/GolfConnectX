import React, {Component} from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import{IMG_CONSTANT,ICON_PATH} from '../constants/application.constants';
import {getNotificationsCount, showHideSearchCriteria} from '../actions/headerAction';

let imgPath=IMG_CONSTANT.BASE_PATH;
let iconPath=IMG_CONSTANT.ICON_PATH;
class Sidebar extends Component{
    constructor(props,context){
        super(props, context);
        this.state={notificationCount: 0}
    }
TriggerNotification(){

       this.props.getNotificationsCount(this.props.activeUser.token).then((notificationLength)=>{
              this.setState({notificationCount:notificationLength});

            }).catch((error)=>{
         });
        
         if(screen.width<769){
          $(".MobileNav").show();
          $(".minGlobalSearch").animate({ height:'0px'});
        }
    }
    headerMenuShow(){
       
      if(screen.width<769){
      $(".MobileNav").show();
      $(".minGlobalSearch").animate({ height:'0px'});
    }
  }
  
    render(){
        return(
            <div className="sidebar">
                <div className="logo"><img src={imgPath+"Golf_CNX_Logo_02.svg"}/></div>
                <div className="menuBox">
                    <ul>
                        <Link  to="/home"><li id="home" className="menu home" onClick={this.TriggerNotification.bind(this)}>
                                <span className="home icons">
                                    <img src="/assets/img/navagition images/Home_Nav_Icon.png" className="home-icon nrmlIcon" id="initial" />
                                    <img src="/assets/img/navagition images/Home_Nav_Icon1_white.png" className="hover-homeIcon hoverIcon" id="onhover" />
                                </span>Home</li></Link>

                        <Link to="/feed">
                            <li id="feed" className="menu feed" onClick={this.headerMenuShow.bind(this)}>
                                <span className="feed icons">
                                    <img src="/assets/img/navagition images/Feed_Nav_Icon.png" className="feed-icon nrmlIcon" id="initial" />
                                    <img src="/assets/img/navagition images/Feed_Nav_Icon1_white.png" className="hover-feedIcon hoverIcon" id="onhover" />
                                </span>
                                Feed</li>
                        </Link>

                            <Link  to="/groups"><li id="group" className="menu groups"onClick={this.headerMenuShow.bind(this)}>
                                <span className="groups icons">
                                    <img src="/assets/img/navagition images/Groups_Nav_Icon.png" className="group-icon nrmlIcon" id="initial" />
                                    <img src="/assets/img/navagition images/Groups_Nav_Icon1_white.png" className="hover-groupIcon hoverIcon" id="onhover" />
                                </span>
                                Groups</li></Link>

                            <Link  to="/events_"><li id="event" className="menu events"onClick={this.headerMenuShow.bind(this)}>
                                <span className="events icons">
                                    <img src="/assets/img/navagition images/Events_Nav_Icon1.png" className="event-icon nrmlIcon" id="initial" />
                                    <img src="/assets/img/navagition images/Events_Nav_Icon_white.png" className="hover-eventIcon hoverIcon" id="onhover" />
                                </span>Events</li></Link>

                            <Link to="/courses_"><li id="course" className="menu courses"onClick={this.headerMenuShow.bind(this)}>
                                <span className="courses icons">
                                    <img src="/assets/img/navagition images/Courses_Nav_Icon.png" className="course-icon nrmlIcon" id="initial" />
                                    <img src="/assets/img/navagition images/Courses_Nav_Icon1_white.png" className="hover-courseIcon hoverIcon" id="onhover" />
                                </span>
                                Courses
                            </li></Link>
                    </ul>



                </div>
            </div>
        );
    }
}

Sidebar.contextTypes = {
  router: React.PropTypes.object
};
function mapStateToProps(state) {
    return {
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({ getNotificationsCount, showHideSearchCriteria}, dispatch);
}
export default connect(mapStateToProps, matchDispatchToProps)(Sidebar);
