import * as types from '../constants/actiontypes';
import _ from 'lodash';

export default function(state = null, action) {
    switch (action.type) {
        case types.GET_ADMIN_COURSELIST:
            return action.apiResult;
            break;
    }
    return state;
}
