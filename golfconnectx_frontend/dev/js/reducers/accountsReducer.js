import * as types from '../constants/actiontypes';

export default function(state=null,action){
    switch(action.type){

            case types.GET_ACCOUNT_PROFILE_DETAILS:
            return Object.assign({}, state, {profile: action.apiResult});
            break;

        case types.GET_ACCOUNT_PRIVATE_DETAILS:
            return Object.assign({}, state, {private: action.apiResult});
            break;

            case types.GET_ACCOUNT_NOTIFICATIONS_DETAILS:
                return Object.assign({}, state, {notification: action.apiResult});
                break;


                case types.GET_ACCOUNT_EMAIL_DETAILS:
                    return Object.assign({}, state, {email: action.apiResult});
                    break;
                case types.GET_SKILLS:
               
                    return Object.assign({}, state, {skills: action.apiResult});
                    break;
    }
    return state;
}
