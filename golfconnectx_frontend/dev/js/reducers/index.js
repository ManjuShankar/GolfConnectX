import {combineReducers} from 'redux';
import ActiveUserReducer from './userDetails';
import RegisterReducer from './registerDetails';
import EventReducer from './eventDetails';
import EventListPast from './eventListPast';
import CreateEvents from './createEventDetails';
import GetGroups from './groupsListReducer';
import accountSettingDetails from './accountsReducer';
import SaveUser from './saveAccountsReducer';
import GetCourses from './courseListReducer';
import PrivateAccount from './privateAccount';
import selectedCourse from './selectedCourse';
import profileReducer from './profileReducer';
import CreatePost from './postReducer';
import selectedEvent from './selectedEvent';
import selectedAllEvent from './selectedAllEvent';
import FriendsReducer from './friendsReducer';
import selectedProfileDetails from './selectedProfileDetails';
import notificationsList from './notificationsList';
import selectedNotification from './selectedNotification';
import messagesList from './messagesList';
import selectedMessage from './selectedMessage';
import selectedGroup from './selectedGroup';
import searchReducer from './searchReducer';
import forumCourse from './forumReducer';
import selectedCategory from './selectedCategory';
import selected19thHoleCategory from './selected19thHoleCategory';
import selectedLocalCategory from './selectedLocalCategory';
import selectedEquipmentCategory from './selectedEquipmentCategory';
import selectedGolfTravelCategory from './selectedGolftravelCategory';
import selectedInstruction from './selectedInstruction';
import selectedDiscussion from './selectedDiscussion';
import selectedRules from './selectedRules';
import selectedFitness from './selectedFitness';
import courseEvent from './courseEvent';
import adminCourseListReducer from './adminCourseListReducer'
import searchForInvites from './searchForInvites'
import searchcriteriavisibility from './searchcriteriavisibility'
/*
 * We combine all reducers into a single object before updated data is dispatched (sent) to store
 * Your entire applications state (store) is just whatever gets returned from all your reducers
 * */

const rootReducer = combineReducers({
    activeUser: ActiveUserReducer,
    registerUser:RegisterReducer,
    eventReducer:EventReducer,
    eventPast:EventListPast,
    createEvents:CreateEvents,
    getgroupList:GetGroups,
    accountDetails:accountSettingDetails,
    saveAccount:SaveUser,
    getCourses:GetCourses,
    pvtAccount:PrivateAccount,
    selectedCourse:selectedCourse,
    savePost:CreatePost,
    myProfile:profileReducer,
    selectedEvent:selectedEvent,
    selectedAllEvent:selectedAllEvent,
    friends:FriendsReducer,
    selectedProfileDetails:selectedProfileDetails,
    notifications: notificationsList,
    selectedNotification:selectedNotification,
    selectedGroup:selectedGroup,
    messages: messagesList,
    messageDetails:selectedMessage,
    forumCourse:forumCourse,
    searchResults: searchReducer,
    selectedCategory:selectedCategory,
    selected19thHoleCategory:selected19thHoleCategory,
    selectedLocalCategory:selectedLocalCategory,
    selectedEquipmentCategory:selectedEquipmentCategory,
    selectedGolfTravelCategory:selectedGolfTravelCategory,
    selectedInstruction:selectedInstruction,
    selectedDiscussion:selectedDiscussion,
    selectedRules:selectedRules,
    selectedFitness:selectedFitness,
    courseEvent:courseEvent,
    adminCourses: adminCourseListReducer,
    searchForInvites : searchForInvites,
    searchcriteriavisibility: searchcriteriavisibility
});

export default rootReducer
