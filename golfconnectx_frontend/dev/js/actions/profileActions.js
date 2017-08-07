import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';

import axios from 'axios';
import toastr from 'toastr';

let userProfileDetails = (token) =>{
  var config = {
          headers: {'Authorization':'Token '+token}
      };

  const url = SERVICE_URLS.GET_PROFILE_DETAILS;
  const apiProfileRequest = axios.get(url,config);
  return(dispatch) => {
         return apiProfileRequest.then(({data})=>{
           dispatch({type:types.GET_PROFILE_DETAILS ,apiResult:data});
         }).catch((error)=>{
           if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }
           throw(error);
         });
     }
}


let eventDetails=(token, pId=-1)=>{

  var config = {
          headers: {'Authorization':'Token '+token}
      };

  const url =  SERVICE_URLS.GET_EVENT_OBJECT; ///SERVICE_URLS.DIRECTORY + pId + '/events';

  const apiPostsRequest = axios.get(url,config);
  return(dispatch) => {
         return apiPostsRequest.then(({data})=>{
           dispatch({type:types.GET_EVENTLIST ,apiResult:data});
         }).catch((error)=>{
           toastr.error(error);
             throw(error);
         });
     }
};


let getDirectoryEventDetails=(token, pId=-1)=>{
  var config = {
          headers: {'Authorization':'Token '+token}
      };
  const url = SERVICE_URLS.DIRECTORY + pId + '/events';
  const apiPostsRequest = axios.get(url,config);
  return(dispatch) => {
         return apiPostsRequest.then(({data})=>{
         
           dispatch({type:types.GET_EVENTLIST ,apiResult:data});
         }).catch((error)=>{
           toastr.error(error);
             throw(error);
         });
     }
};


let getMyCourses = (token) =>{
  var config = {
          headers: {'Authorization':'Token '+token}
      };

  const url = SERVICE_URLS.GET_PROFILE_COURSES;

  const apiProfileCourseRequest = axios.get(url,config);
  return(dispatch) => {
         return apiProfileCourseRequest.then(({data})=>{
           dispatch({type:types.GET_PROFILE_COURSES ,apiResult:data});
         }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }
           throw(error);
         });
     }
};


let editCourseNotes  = (  notes,courseId,scoreId, token) =>{

 const url=SERVICE_URLS.EDIT_NOTES + courseId + '/scores/'+scoreId;

 var config = {
  headers: {'Authorization':'Token '+token}
  };

 const apiEditNotesRequest = axios.post(url, {notes:notes}, config);

  return(dispatch)=>{
      return apiEditNotesRequest.then(({data})=>{
          dispatch({type:types.EDIT_NOTES ,apiResult:data});
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}

let getMyPosts = (token, pId=-1) =>{
  var config = {
          headers: {'Authorization':'Token '+token}
      };
  const url = SERVICE_URLS.GET_PROFILE_POSTS; ///SERVICE_URLS.DIRECTORY + pId + '/posts';
  const apiPostsRequest = axios.get(url,config);
  return(dispatch) => {
         return apiPostsRequest.then(({data})=>{
           dispatch({type:types.GET_PROFILE_POSTS ,apiResult:data});
         }).catch((error)=>{
           toastr.error(error);
             throw(error);
         });
     }
};

let getDirectoryPosts = (token, pId=-1) =>{
  var config = {
          headers: {'Authorization':'Token '+token}
      };
  const url = SERVICE_URLS.DIRECTORY + pId + '/posts';
  const apiPostsRequest = axios.get(url,config);
  return(dispatch) => {
         return apiPostsRequest.then(({data})=>{
           dispatch({type:types.GET_PROFILE_POSTS ,apiResult:data});
         }).catch((error)=>{
           toastr.error(error);
             throw(error);
         });
     }
};

let getFriends = (token, pId=-1) =>{
  var config = {
          headers: {'Authorization':'Token '+token}
      };

  const url = SERVICE_URLS.GET_PROFILE_FRIENDS; ///SERVICE_URLS.DIRECTORY + pId + '/friends';
  const apiGetFriendsRequest = axios.get(url,config);
  return(dispatch) => {
         return apiGetFriendsRequest.then(({data})=>{
           dispatch({type:types.GET_PROFILE_FRIENDS ,apiResult:data});
         }).catch((error)=>{
           toastr.error(error);
             throw(error);
         });
     }
}


let getDirectoryFriends = (token, pId=-1) =>{
  var config = {
          headers: {'Authorization':'Token '+token}
      };

  const url = SERVICE_URLS.DIRECTORY + pId + '/friends';
  const apiGetFriendsRequest = axios.get(url,config);
  return(dispatch) => {
         return apiGetFriendsRequest.then(({data})=>{
           dispatch({type:types.GET_PROFILE_FRIENDS ,apiResult:data});
         }).catch((error)=>{
           toastr.error(error);
             throw(error);
         });
     }
}


let searchFriends = (token, keyword) =>{
  const url = SERVICE_URLS.SEARCH_FRIENDS + '?format=json' + '&kw=' + keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiFriendsRequest = axios.get(url, config);
return(dispatch) => {
       return apiFriendsRequest.then(({data})=>{
         dispatch({type:types.GET_PROFILE_FRIENDS,apiResult:data});
       }).catch((error)=>{
         toastr.error(error);
           throw(error);
       });
   }
}


let getProfileDetails = (token, id) =>{
  var config = {
          headers: {'Authorization':'Token '+token}
      };

  const url = SERVICE_URLS.GET_SELECTED_PROFILE + id + '/?format=json';;
  const apiGetFriendDetailsRequest = axios.get(url,config);
  return(dispatch) => {
         return apiGetFriendDetailsRequest.then(({data})=>{
           dispatch({type:types.GET_SELECTED_PROFILE ,apiResult:data});
         }).catch((error)=>{
           if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }
           throw(error);
         });
     }

}


let searchGroups = (token, keyword) =>{

  const url = SERVICE_URLS.SEARCH_GROUPS + '?format=json' + '&kw=' + keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiGroupsRequest = axios.get(url, config);
return(dispatch) => {
       return apiGroupsRequest.then(({data})=>{
         dispatch({type:types.GET_GROUPS_PROFILE,apiResult:data});
       }).catch((error)=>{
         toastr.error(error);
           throw(error);
       });
   }
}

let getMyGroups = (token) =>{
  var config = {
          headers: {'Authorization':'Token '+token}
      };

  const url = SERVICE_URLS.PROFILE_GROUPS;

  const apiProfileGroupRequest = axios.get(url,config);
  return(dispatch) => {
         return apiProfileGroupRequest.then(({data})=>{
           dispatch({type:types.GET_PROFILE_GROUPS ,apiResult:data});
         }).catch((error)=>{
           toastr.error(error);
             throw(error);
         });
     }
};

let addNewScore=( token, id, score, played_on)=>{

    const url=SERVICE_URLS.ADD_SCORE + id +'/scores';
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apiScoreRequest=axios.post(url, {score:score, played_on:played_on},  config);

    return(dispatch)=>{
        return apiScoreRequest.then(({data})=>{
           dispatch({type:types.FOLLOW_UNFOLLOW_TOGGLE ,apiResult:data});
        }).catch((error)=>{
            throw(error);
        });
    }
};
let getNewScore=( token, id)=>{

    const url=SERVICE_URLS.ADD_SCORE + id +'/scores';
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apiScoreRequest=axios.get(url, config);

    return(dispatch)=>{
        return apiScoreRequest.then(({data})=>{
           dispatch({type:types.GET_SCORE ,apiResult:data});
        }).catch((error)=>{
            throw(error);
        });
    }
};

let profilegroupList=(token, pId=-1)=>{
    const url =  SERVICE_URLS.GET_PROFILE_GROUPS; ///SERVICE_URLS.DIRECTORY + pId + '/groups';
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apigroupDetailsRequest=axios.get(url,config);

    return(dispatch)=>{
        return apigroupDetailsRequest.then(({data})=>{
            dispatch({type:types.GET_GROUPS_PROFILE,apiResult:data});
        }).catch((error)=>{
         if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }
           throw(error);
        });
    }
};


let getDirectoryProfilegroupList=(token, pId=-1)=>{
    const url =  SERVICE_URLS.DIRECTORY + pId + '/groups';
    var config = {
      headers: {'Authorization':'Token '+token}
    };
    const apigroupDetailsRequest=axios.get(url,config);
    return(dispatch)=>{
        return apigroupDetailsRequest.then(({data})=>{
            dispatch({type:types.GET_GROUPS_PROFILE,apiResult:data});
        }).catch((error)=>{
         if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }
           throw(error);
        });
    }
};

let deleteScores=(token,courseId, scoreId)=>{
    const url =  SERVICE_URLS.DELETE_SCORES + courseId + '/scores/' + scoreId;
    var config = {
      headers: {'Authorization':'Token '+token}
    };
    const apigroupDetailsRequest=axios.delete(url,config);
    return(dispatch)=>{
        return apigroupDetailsRequest.then(({data})=>{
            //dispatch({type:types.GET_GROUPS_PROFILE,apiResult:data});
            toastr.success("Score deleted successfully!");
        }).catch((error)=>{
         if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }
           throw(error);
        });
    }
};

let deleteScoresImage=(token,courseId, scoreId, imageId)=>{
    const url =  SERVICE_URLS.DELETE_SCORES + courseId + '/gallery/' + scoreId +'/'+imageId;
    var config = {
      headers: {'Authorization':'Token '+token}
    };
    const apigroupDetailsRequest=axios.delete(url,config);
    return(dispatch)=>{
        return apigroupDetailsRequest.then(({data})=>{
            //dispatch({type:types.GET_GROUPS_PROFILE,apiResult:data});
            toastr.success("Score Image deleted successfully!");
        }).catch((error)=>{
         if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }
           throw(error);
        });
    }
};
export {getMyCourses, getMyPosts, userProfileDetails, getFriends, searchFriends, getProfileDetails,
 searchGroups, getMyGroups, editCourseNotes, addNewScore, profilegroupList, getNewScore, 
 eventDetails, getDirectoryEventDetails, getDirectoryPosts, getDirectoryFriends, 
 getDirectoryProfilegroupList, deleteScores, deleteScoresImage};
