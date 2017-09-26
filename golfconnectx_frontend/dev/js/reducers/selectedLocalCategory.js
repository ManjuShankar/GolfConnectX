import * as types from '../constants/actiontypes';

export default function(state = null, action) {
    switch (action.type) {
        case types.GET_LOCAL_CATEGORY_OBJECT:
        console.log("apiResult",action.apiResult);
             return Object.assign({}, state, {Category: action.apiResult});
            break;

 
          case types.GET_LOCAL_CATEGORY_DETAIL:
            console.log("detail apiResult",action.apiResult);
                 return Object.assign({}, state, {CatDetails: action.apiResult});
                break;
                case types.GET_LOCAL_CATEGORYLIST:
                console.log("api",action.apiResult);
                return Object.assign({},state, {CategorySearchList:action.apiResult});
                break;
                 case types.GET_LOCAL_SEARCH:
                 console.log("SearchList",action.SearchList);
            return Object.assign({},state, {SearchList:action.apiResult});
            break;
               
            
    }
    return state;
}