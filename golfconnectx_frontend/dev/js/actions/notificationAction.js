import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';
import axios from 'axios';
import toastr from 'toastr';

let getNotifications = (token) =>{
   const url = SERVICE_URLS.GET_NOTIFICATIONS;
   var config = {
        headers: {'Authorization':'Token '+token}
   };

const apiGetNotificationListRequest = axios.get(url, config);
return(dispatch) => {
        return apiGetNotificationListRequest.then(({data})=>{
          dispatch({type:types.GET_NOTIFICATIONS,apiResult:data});
        }).catch((error)=>{
         if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }   
           throw(error);  
        });
    }
}

let removeNotification = (token, notificationId) =>{
   const url = SERVICE_URLS.GET_NOTIFICATION_OBJECT + notificationId + '/?format=json';
   var config = {
        headers: {'Authorization':'Token '+token}
   };

const apiNotificationRequest = axios.delete(url, config);
return(dispatch) => {
        return apiNotificationRequest.then(({data})=>{
          toastr.success("Notification Removed Successfully");
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
}


let getNotificationById = (token, notificationId) =>{
   const url = SERVICE_URLS.GET_NOTIFICATION_OBJECT + notificationId + '/?format=json';
   var config = {
        headers: {'Authorization':'Token '+token}
   };

const apiNotificationRequest = axios.get(url, config);
return(dispatch) => {
        return apiNotificationRequest.then(({data})=>{
          dispatch({type:types.GET_NOTIFICATION_OBJECT,apiResult:data});
        }).catch((error)=>{
          if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }   
           throw(error);  
        });
    }
}

let onAcceptOrDeclineClick = (token, submitUrl, flag) =>{
  const url = 'http://' + submitUrl + '?format=json&accept=' + flag;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

  const apiNotificationRequest = axios.get(url, config);
  return(dispatch) => {
          return apiNotificationRequest.then(({data})=>{
            if(data.request_status){
             
            toastr.success(data.response_message);
          }
            else{
            toastr.error(data.response_message);
          }
          }).catch((error)=>{
            toastr.error(error);
              throw(error);
          });
      }


}

export {getNotifications, getNotificationById, removeNotification, onAcceptOrDeclineClick};
