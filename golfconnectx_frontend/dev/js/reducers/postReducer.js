import * as types from '../constants/actiontypes';

export default function(state=null,action){
    switch(action.type){
        
            case types.GET_POST:
            return action.apiResult;
            break;
           
            case types.GET_FEED_POSTS:
            return Object.assign({}, state, {feedPosts: action.apiResult});
            break;
            case types.GET_POSTSLIST:
           
            	 return Object.assign({}, state, {PostList: action.apiResult});
            	break;
    }
    return state;
}