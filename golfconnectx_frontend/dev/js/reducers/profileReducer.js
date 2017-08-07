import * as types from '../constants/actiontypes';

export default function(state=null,action){
    switch(action.type){
            case types.GET_PROFILE_COURSES:
            return Object.assign({}, state, {MyProfileCourseList: action.apiResult});
            break;

            case types.GET_PROFILE_POSTS:
            return Object.assign({}, state, {MyPostsList: action.apiResult});
            break;

            case types.GET_PROFILE_DETAILS:
            return Object.assign({}, state, {MyProfile: action.apiResult});
            break;

            case types.GET_PROFILE_FRIENDS:
            return Object.assign({}, state, {MyFriends: action.apiResult});
            break;

            case types.GET_GROUPS_PROFILE:
            return Object.assign({},state,{MyGroups:action.apiResult});
            break;
             
            case types.EDIT_NOTES:
            return Object.assign({},state,{notes:action.apiResult});
            break;
            case types.GET_SCORE:
            return Object.assign({},state,{getScores:action.apiResult});
            break;
    }
    return state;
}
