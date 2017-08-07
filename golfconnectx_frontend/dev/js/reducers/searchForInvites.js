import * as types from '../constants/actiontypes';

export default function(state=null,action){
    switch(action.type){
           
            case types.GET_SEARCH_MEMBERS:
            return Object.assign([], state, {Members:action.apiResult});
            break;
    }
    return state;
}