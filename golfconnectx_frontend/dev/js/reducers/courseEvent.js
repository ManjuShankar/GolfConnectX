import * as types from '../constants/actiontypes';

export default function(state = null, action) {
    switch (action.type) {
        
             case types.GET_COURSE_UEVENTLIST:
            return Object.assign([], state, {Upcoming: action.apiResult});
            break;
            
        case types.GET_COURSE_PEVENTLIST: 
            return Object.assign([], state, {Past: action.apiResult});
            break;
            
            case types.GET_COURSE_GROUPS: 
            return Object.assign([], state, {Groups: action.apiResult});
            break;
    }
    return state;
}