import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

import * as routeConstants from '../constants/applicationUrl';

import CourseContainer from '../components/courseContainer';
import Main from '../containers/Main';
import Login from '../components/login';
import Home from '../components/homepage';
import EventsPage from '../components/eventsPage';
import GroupHomepage from '../components/groupHomepage';
import GroupMembers from '../components/groupMembers';
import AddGroup from '../components/addGroup';
import AccountSettings from '../components/accountSettings';
import Profile from '../components/Profile';
import Registration from '../components/registration';
import FriendsPage from '../components/friendsPage';
import Messages from '../components/messages';
import Notifications from '../components/notification';
import ProfileDetail from '../components/ProfileDetail';
import ViewNotification from '../components/viewNotification';
import EditGroup from '../components/editGroup';
import ForumsPage from '../components/forumsPage';
import NewMessage from '../components/newMessage';
import ViewMessage from '../components/viewMessage';
import FeedPage from '../components/feedPage';
import ForumCourse from '../components/forumCourse';
import GlobalSearch from '../components/globalSearch';
import SelectedCoursePage from '../components/selectedCoursePage';
import EnterValidEmail from '../components/enterValidEmail';
import EnterCorrectOTP from '../components/enterOTP';
import EnterNewPassword from '../components/enterNewPassword';
import SelctedEventDetails from '../components/SelctedEventDetails';
import ForumExceptCourse from '../components/forumExceptCourse';
import ViewAllImages from '../components/child-components/viewAllImages';
import EditCourses from '../components/editCourses';
import InviteRegistration from '../components/inviteRegistration';
export default(

  <Route path="/" component={Main}>
    <IndexRoute component={Login} />
    <Route path="/register" component={Registration} />
    <Route path="/invite" component={InviteRegistration} />
    <Route path="/home" component={Home} />
    <Route path="/events_(:id)" component={EventsPage} />
    <Route path="/courses_(:courseId)" component={CourseContainer} />
    <Route path="/groups" component={GroupHomepage} />
    <Route path="/groupMembers_(:groupId)" component={GroupMembers} />
    <Route path="/addGroup" component={AddGroup} />
    <Route path="/accountSettings" component={AccountSettings} />
    <Route path="/profile_(:selectedIndex)" component={Profile} />
    <Route path="/friends" component={FriendsPage} />
    <Route path="/messages" component={Messages} />
    <Route path="/notifications" component={Notifications} />
    <Route path="/profileDetail_(:id)" component={ProfileDetail} />
    <Route path="/viewNotification_(:id)" component={ViewNotification} />
    <Route path="/editGroup_(:id)" component={EditGroup} />
    <Route path="/forumsPage" component={ForumsPage}/>
    <Route path="/newMessage" component={NewMessage}/>
    <Route path="/viewMessage_(:id)" component={ViewMessage}/>
    <Route path="/feed" component={FeedPage}/>
    <Route path="/forumCourse_(:id)" component={ForumCourse}/>
    {/*<Route path="/globalSearch" component={GlobalSearch}/>*/}
    <Route path="/selectedCoursePage" component={SelectedCoursePage} />
    <Route path="/enterEmail" component={EnterValidEmail} />
    <Route path="/enterOTP" component={EnterCorrectOTP} />
    <Route path="/enterNewPassword" component={EnterNewPassword} />
    <Route path="/viewAllImages" component={ViewAllImages} />
    <Route path="/selectedEvent/:id" component={SelctedEventDetails}/>
    <Route path="/forumExceptCourse_(:forumType)" component={ForumExceptCourse} />
    <Route path="/editCourses_(:id)" component={EditCourses} />
    <Route path="/globalSearch_(:text)" component={GlobalSearch}/>
  </Route>

);
