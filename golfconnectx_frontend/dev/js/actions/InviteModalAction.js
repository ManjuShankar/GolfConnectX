import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';
import toastr from 'toastr';
import axios from 'axios';


let InviteModalAction = (token, users,useremails,flag,paramId,is_friend) =>{
     let url  = "";
     let id = paramId;
     
//   const url = SERVICE_URLS.SEND_REQUESTS;
  if(flag == "1"){
        url = SERVICE_URLS.SEND_REQUESTS;
  }
  if(flag == "2"){
        url = SERVICE_URLS.GET_GROUP_POSTS_LIST + id +  '/add-member/';
  }
  if(flag == "3"){
      url = SERVICE_URLS.REQUEST_INVITE + id +  '/send-invite/';
  }
  
  var config = {
    headers: {'Authorization':'Token '+token}
  };
  const apiaddOrRemoveMemebrsRequest =  axios.post(url, { users,useremails,is_friend}, config);

  return(dispatch)=>{
    return apiaddOrRemoveMemebrsRequest.then(({data})=>{
      toastr.success("Members Request Sent Successfully");
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}

let searchMembers = (token, keyword,flag,paramId) =>{
  let url  = "";
  let id = paramId;
  if(flag == "1"){
        url = SERVICE_URLS.GET_GOLF_MEMBERS  + '/?format=json' + '&kw=' + keyword ;
  }
  if(flag == "2"){
        url = SERVICE_URLS.SEARCH_ADD_MEMBERS + id + '/add-member/?format=json' + '&kw=' + keyword ;
  }
  if(flag == "3"){
        url = SERVICE_URLS.REQUEST_INVITE + id +  '/send-invite/?format=json' + '&kw=' + keyword ;
  }

  //const url = SERVICE_URLS.GET_GOLF_MEMBERS  + '/search/?format=json' + '&kw=' + keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiFriendsRequest = axios.get(url, config);
return(dispatch) => {
       return apiFriendsRequest.then(({data})=>{
         dispatch({type:types.GET_SEARCH_MEMBERS,apiResult:data});
       }).catch((error)=>{
         toastr.error(error);
           throw(error);
       });
   }
}



export {InviteModalAction,searchMembers};
