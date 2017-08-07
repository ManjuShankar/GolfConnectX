import * as types from '../constants/actiontypes';

export default function(state = null, action) {
    switch (action.type) {
        case types.GET_GROUPS:
            return Object.assign({}, state, {getgroups: action.apiResult});
            break;
        case types.CREATE_GROUP:
            return Object.assign({}, state, {groups: action.apiResult});
            break;
        case types.EDIT_GROUP_DETAILS:
            return Object.assign({}, state, {editgroups: action.apiResult});
            break;
        case types.GET_GROUP_LIST:
            return Object.assign({},state, {getoldgroups:action.apiResult});
            break;
      
    }
    return state;
}

///GET_HEADER
