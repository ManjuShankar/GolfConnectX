import * as types from '../constants/actiontypes';

export default function(state = null, action) {
    switch (action.type) {

        case types.LOGIN_USER:
                    return action.apiResult;
                    break;


        case types.ENTER_EMAIL_REQUEST:
                    return Object.assign({}, state, {email: action.apiResult});
                    break;

        case types.UPDATE_PROFILE_IMAGE:
                    return action.activeUser;
                    break;
    }
    return state;
}