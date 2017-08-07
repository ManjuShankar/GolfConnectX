import * as types from '../constants/actiontypes';

export default function(state=null,action){
    switch(action.type){
        case types.GET_NOTIFICATIONS:
            return action.apiResult;
            break;
           
    }
    return state;
}
