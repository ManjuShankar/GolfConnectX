import * as types from '../constants/actiontypes';

export default function(state = null, action) {
    switch (action.type) {
        case types.GET_SELECTED_CATEGORY:
       
             return Object.assign({}, state, {Category: action.apiResult});
            break;

 
          case types.GET_SELECTED_CATEGORY_DETAIL:
          
                 return Object.assign({}, state, {CatDetails: action.apiResult});
                break;
                case types.GET_CATEGORYLIST:
                
                return Object.assign({},state, {CategorySearchList:action.apiResult});
                break;
                
               
            
    }
    return state;
}