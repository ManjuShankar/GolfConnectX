import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';

import axios from 'axios';
import toastr from 'toastr';

let uploadFile = (token, acceptedFiles) =>{
  const url = SERVICE_URLS.ACCOUNT_SETTINGS;
  var config = {
    headers: {'Authorization':'Token '+token}
  };
  const apiuploadImageRequest =  axios.post(url, { image: acceptedFiles[0] }, config);

    return(dispatch)=>{
    return apiuploadImageRequest.then(({data})=>{
        toastr.success("File Uploaded Successfully");
      }).catch((error)=>{
          throw(error);
      });
  }
}

let getAccountProfileDetails = (token) =>{
    return axios.get(SERVICE_URLS.ACCOUNTS_SETTING_PROFILE, token);
}

let getAccountPrivateSettingsDetails = (token) =>{
  return axios.get(SERVICE_URLS.ACCOUNTS_SETTING_PRIVATE, token);
}


let getAccountNotificationsDetails = (token) =>{
  return axios.get(SERVICE_URLS.ACCOUNTS_SETTING_NOTIFICATION, token);
}

let getEmailSettingsDetails = (token) =>{
  return axios.get(SERVICE_URLS.ACCOUNTS_SETTING_EMAIL, token);
}


let getAccountSettingsDetails = (token) =>{
  var config = {
  headers: {'Authorization':'Token '+token}
 };

 const apiRequest = axios.all([getAccountProfileDetails(config), getAccountPrivateSettingsDetails(config), getAccountNotificationsDetails(config),getEmailSettingsDetails(config)]);
     return(dispatch)=>{
          return apiRequest.then(axios.spread(function (profileDetails, privateDetails, notificationDetails, emailDetails) {
                 dispatch({type:types.GET_ACCOUNT_PROFILE_DETAILS,apiResult:profileDetails.data});
                 dispatch({type:types.GET_ACCOUNT_PRIVATE_DETAILS,apiResult:privateDetails.data});
                 dispatch({type:types.GET_ACCOUNT_NOTIFICATIONS_DETAILS,apiResult:notificationDetails.data});
                 dispatch({type:types.GET_ACCOUNT_EMAIL_DETAILS,apiResult:emailDetails.data});
           })).catch((error)=>{
                     throw(error);
     });
    }
}

let saveProfileDetails = (formData, token) =>{
  var config = {
      headers: {'Authorization':'Token '+token}
  };
  const url = SERVICE_URLS.ACCOUNTS_SETTING_PROFILE;
  const apiSaveProfileRequest = axios.post(url, formData, config);
  return(dispatch)=>{
    return apiSaveProfileRequest.then(({data})=>{
      toastr.success("Profile Details Saved Successfully");
        dispatch({type:types.GET_ACCOUNT_PROFILE_DETAILS,apiResult: data});
      }).catch((error)=>{
          toastr.error(error);
          throw(error);
      });
 }
}

let savePrivateDetails = (formData, token) =>{
  var config = {
      headers: {'Authorization':'Token '+token}
  };
  const url = SERVICE_URLS.ACCOUNTS_SETTING_PRIVATE;
  const apiSaveProfileRequest = axios.post(url, formData, config);
  return(dispatch)=>{
    return apiSaveProfileRequest.then(({data})=>{
        toastr.success("Private Details Saved Successfully");
      
        dispatch({type:types.GET_ACCOUNT_PRIVATE_DETAILS,apiResult: data});
      }).catch((error)=>{
          toastr.error(error);
          throw(error);
      });
 }
}

let saveNotificationDetails = (formData, token) =>{
  var config = {
      headers: {'Authorization':'Token '+token}
  };
  const url = SERVICE_URLS.ACCOUNTS_SETTING_NOTIFICATION;
  const apiSaveProfileRequest = axios.post(url, formData, config);
  return(dispatch)=>{
    return apiSaveProfileRequest.then(({data})=>{
        toastr.success("Notifications Saved Successfully");
        dispatch({type:types.GET_ACCOUNT_NOTIFICATIONS_DETAILS,apiResult: data});
      }).catch((error)=>{
          toastr.error(error);
          throw(error);
      });
 }
}

let saveEmailDetails = (formData, token) =>{
  var config = {
      headers: {'Authorization':'Token '+token}
  };
  const url = SERVICE_URLS.ACCOUNTS_SETTING_EMAIL;
  const apiSaveProfileRequest = axios.post(url, formData, config);
  return(dispatch)=>{
    return apiSaveProfileRequest.then(({data})=>{
        toastr.success("Email Details Saved Successfully");
        dispatch({type:types.GET_ACCOUNT_EMAIL_DETAILS,apiResult: data});
      }).catch((error)=>{
          toastr.error(error);
          throw(error);
      });
 }
}

let getSkillset = (token) =>{

  const url = SERVICE_URLS.GOLFER_SKILLS;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

  const apiSkillRequest = axios.get(url,config);
  return(dispatch) => {
         return apiSkillRequest.then(({data})=>{

           dispatch({type:types.GET_SKILLS ,apiResult:data});
         }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
              toastr.error(error);
             }
             throw(error);
         });
     }
}
let updateUserProfileImage = (image) => {
  
  return(dispatch) => {
    let _activeUser = JSON.parse(sessionStorage.getItem('userDetails'));
    _activeUser.profile_image_url = image;
    sessionStorage.setItem('userDetails', JSON.stringify(_activeUser));
    return dispatch({type: types.UPDATE_PROFILE_IMAGE, activeUser: _activeUser});
  }
}
export {getAccountSettingsDetails, saveProfileDetails, savePrivateDetails, saveNotificationDetails, saveEmailDetails, uploadFile, getSkillset, updateUserProfileImage};
