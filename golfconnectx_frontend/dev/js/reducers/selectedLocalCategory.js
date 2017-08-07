import * as types from '../constants/actiontypes';

export default function(state = null, action) {
    switch (action.type) {
        case types.GET_LOCAL_CATEGORY_OBJECT:
        
             return Object.assign({}, state, {Category: action.apiResult});
            break;

 
          case types.GET_LOCAL_CATEGORY_DETAIL:
            
                 return Object.assign({}, state, {CatDetails: action.apiResult});
                break;
                case types.GET_LOCAL_CATEGORYLIST:
               
                return Object.assign({},state, {CategorySearchList:action.apiResult});
                break;
                 case types.GET_LOCAL_SEARCH:
                
            return Object.assign({},state, {SearchList:action.apiResult});
            break;
               
            
    }
    return state;
}