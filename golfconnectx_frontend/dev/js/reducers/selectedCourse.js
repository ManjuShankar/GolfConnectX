import * as types from '../constants/actiontypes';

export default function(state = null, action) {
    switch (action.type) {
        case types.GET_SELECTED_COURSE:
            return action.apiResult;
            break;

            case types.FOLLOW_UNFOLLOW_TOGGLE:
              return Object.assign({}, state, {course_user_details: action.apiResult});
            break;
            case types.GET_PROFILE_SCORES:
            return Object.assign({},state,{MyScores:action.apiResult});
            break;
              case types.GET_EDIT_COURSE:
            return Object.assign({},state,{editCourses:action.apiResult});
            break;
    }
    return state;
}
