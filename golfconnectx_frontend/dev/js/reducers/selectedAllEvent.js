import * as types from '../constants/actiontypes';

export default function(state = null, action) {
  switch (action.type) {
    case types.GET_ALL_SELECTED_EVENT:
            return action.apiResult;
            break;
    case types.GET_ALL_ATTENDEES:
            return Object.assign({}, state, {attendeesList: action.apiResult});
            break;
    case types.GET_ALL_NOT_ATTEND:
            return Object.assign({}, state, {notAttendList: action.apiResult});
            break;
     case types.GET_ALL_MAY_ATTEND:
            return Object.assign({}, state, {mayAttendList: action.apiResult});
            break;
      case types.EVENT_ALL_POSTS:
            return Object.assign({}, state, {postsList: action.apiResult});
            break;
            case types.EVENT_ALL_GALLERY:
            return Object.assign({}, state, {gallery: action.apiResult});
            break;
      case types.INVITIES_ALL_LIST:
            return Object.assign({}, state, {invitiesList: action.apiResult});
            break;
      case types.SEARCH_ALL_INVITIES_LIST:
            return Object.assign({}, state, {searchInvitiesList: action.apiResult});
            break;
      case types.GET_ALL_TEEFILES_LIST:
            return Object.assign({}, state, {teeFiles: action.apiResult});
            break;
    }
    return state;
}
