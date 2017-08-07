 
import * as types from '../constants/actiontypes';

export default function(state = null, action) {
    switch (action.type) {
       		 case types.GET_SELECTED_19thHOLECATEGORY:
       
             return Object.assign({}, state, {Category: action.apiResult});
            break;

 
          case types.GET_SELECTED_19thHoleCATEGORY_DETAIL:
           
                 return Object.assign({}, state, {CatDetails: action.apiResult});
                break;
                case types.GET_19CATEGORYLIST:
                
                return Object.assign({},state, {CategorySearchList:action.apiResult});
                break;
                 case types.GET19HOLE_CATEGORYLIST:
                
            return Object.assign({},state, {SearchList:action.apiResult});
            break;
               
            
    }
    return state;
}