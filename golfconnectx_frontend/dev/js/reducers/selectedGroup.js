import * as types from '../constants/actiontypes';

export default function(state = null, action) {
    switch (action.type) {
        case types.GET_GROUP_DETAILS:
            return action.apiResult;
            break;

            case types.GET_GROUP_MEMBERS_LIST:
                      return Object.assign({}, state, Object.assign([], state.members, {members: action.apiResult}));
                      break;

                      case types.GET_GROUP_ADMINS_LIST:
                                return Object.assign({}, state, Object.assign([], state.admins, {admins: action.apiResult}));
                                break;

                      case types.GET_GROUP_POSTS_LIST:
                                return Object.assign({}, state, Object.assign([], state.posts, {posts: action.apiResult}));
                                break;

                      case types.GET_GROUP_GALLERY_LIST:
                                  return Object.assign({}, state, Object.assign([], state.gallery, {gallery: action.apiResult}));
                                  break;

                      case types.GET_GROUP_FILES_LIST:
                                  return Object.assign({}, state, Object.assign([], state.files, {files: action.apiResult}));
                                  break;
                                  case types.GET_GOLF_MEMBERS:
                                  return Object.assign([],state,{memberList:action.apiResult});
                                    break;
                      case types.GET_GROUP_EVENTLIST:
                               return Object.assign([],state,{getEventsList:action.apiResult});
                                break;
                    /*case types.UPDATE_GROUP_INFO:console.log("Reducer", action.apiResult);
                      ///return Object.assign({}, state, Object.assign({}, state, {state.description: action.apiResult}));
                      ///return Object.assign({}, state.description, action.apiResult);
                    break;*/
    }
    return state;
}
