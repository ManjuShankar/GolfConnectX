import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';

import axios from 'axios';
import toastr from 'toastr';

let getNotificationsCount = (token) =>{
  const url = SERVICE_URLS.GET_NOTIFICATION_COUNT;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

  const apiNotificationCountRequest = axios.get(url, config);
  return(dispatch) => {
       return apiNotificationCountRequest.then(({data})=>{
         return data.notifications_count;
         //  dispatch({type:types.NOTIFICATION_COUNT,apiResult:data.notifications_count});
       }).catch((error)=>{
         console.log('err', error.response.status);
         /*console.log('error', error.response.status);
         console.log('token', token)
         toastr.error(error);
         throw(error);*/
       });
   }
}

let invite = (data, token) =>{

  const url = SERVICE_URLS.INVITE;
  var config = {
    headers: {'Authorization':'Token '+token}
  };

  const apiInviteRequest = axios.post(url, { data }, config);
  return(dispatch)=>{
    return apiInviteRequest.then(({data})=>{

      toastr.success(data.message);
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}

let searchAll = (token, keyword) =>{
  const url = SERVICE_URLS.SEARCH_ALL + '?format=json' + '&kw=' + keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiSearchRequest = axios.get(url, config);
return(dispatch) => {
       return apiSearchRequest.then(({data})=>{
         dispatch({type:types.SEARCH_ALL,apiResult:data});
       }).catch((error)=>{
         toastr.error(error);
           throw(error);
       });
   }
}

let showHideSearchCriteria = (flag) => {
  return (dispatch) => {
    return dispatch({type: types.SEARCH_CRTERIA_VISIBILITY, payload: flag});
  }
}

export {getNotificationsCount, invite, searchAll, showHideSearchCriteria};
