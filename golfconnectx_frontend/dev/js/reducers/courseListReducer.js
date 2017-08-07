import * as types from '../constants/actiontypes';
import _ from 'lodash';

export default function(state = null, action) {
    switch (action.type) {
        case types.GET_COURSELIST:
            return action.apiResult;
            break;
        case types.GET_COURSELIST_APPEND:
            let localState = Object.assign([], state);
            let updatedList =  state.concat(action.apiResult);
            return updatedList;
    }
    return state;
}
