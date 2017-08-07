import * as types from '../constants/actiontypes';

export default function(state = null, action) {
    switch (action.type) {
        case types.GET_GOLF_MEMBERS:
            return Object.assign([], state, {Members:action.apiResult});
            break;
        case types.GET_GOLF_FRIENDS:
            return Object.assign([], state, {Friends: action.apiResult});
            break;
    }
    return state;
}
