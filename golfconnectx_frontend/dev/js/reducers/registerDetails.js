import * as types from '../constants/actiontypes';

export default function(state=null,action){
    switch(action.type){
        case types.REGISTER_USER:
            return action.apiResult;
            break;
            
            case types.FACEBOOK_REGISTER:    
                    return action.apiResult;
                    break;

}
    return state;
}