import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';
import toastr from 'toastr';
import axios from 'axios';

let getGolfConnectXmembers = (token) =>{
   const url = SERVICE_URLS.GET_GOLF_MEMBERS;
   var config = {
        headers: {'Authorization':'Token '+token}
   };

const apiEventRequest = axios.get(url, config);
return(dispatch) => {
        return apiEventRequest.then(({data})=>{
          dispatch({type:types.GET_GOLF_MEMBERS,apiResult:data});
        }).catch((error)=>{
           if(error != "Error: Request failed with status code 401"){
            toastr.error(error);
          }   
           throw(error);  
        });
    }
}

let onSendRequest = (token, id, message) =>{
const url = SERVICE_URLS.SEND_FRIEND_NOTIFICATION + id +  '/send-friend-request/?format=json';
var config = {
     headers: {'Authorization':'Token '+token}
};

const apiSendRequest = axios.get(url, config);
return(dispatch) => {
     return apiSendRequest.then(({data})=>{
        if(data.request_status)
        {
          toastr.success(data.response_message);
        }else {
          toastr.error(data.response_message);
        }
     }).catch((error)=>{
       toastr.error(error);
         throw(error);
     });
 }
}
let GetFriends = (token) =>{
const url = SERVICE_URLS.GET_PROFILE_FRIENDS;
var config = {
     headers: {'Authorization':'Token '+token}
};

const apiEventRequest = axios.get(url, config);
return(dispatch) => {
        return apiEventRequest.then(({data})=>{
          dispatch({type:types.GET_GOLF_FRIENDS,apiResult:data});
        }).catch((error)=>{
           if(error != "Error: Request failed with status code 401"){
            toastr.error(error);
          }   
           throw(error);  
        });
    }
}
let FriendRequest = (token, users,useremails) =>{
  
  const url = SERVICE_URLS.SEND_REQUESTS;
  var config = {
    headers: {'Authorization':'Token '+token}
  };
  const apiaddOrRemoveMemebrsRequest =  axios.post(url, { users,useremails}, config);
  return(dispatch)=>{
    return apiaddOrRemoveMemebrsRequest.then(({data})=>{
      toastr.success("Members Request Sent Successfully");
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}
let searchMembers = (token, keyword) =>{
 
  const url = SERVICE_URLS.GET_GOLF_MEMBERS  + '/search/?format=json' + '&kw=' + keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiFriendsRequest = axios.get(url, config);
return(dispatch) => {
       return apiFriendsRequest.then(({data})=>{
         dispatch({type:types.GET_GOLF_MEMBERS,apiResult:data});
       }).catch((error)=>{
         toastr.error(error);
           throw(error);
       });
   }
}
export {getGolfConnectXmembers, onSendRequest, GetFriends, FriendRequest, searchMembers};
