import * as types from '../constants/actiontypes';

export default function(state=null,action){
    switch(action.type){
        case types.SAVE_USERDETAILS:
            return action.apiResult;
            break;
    }
    return state;
}