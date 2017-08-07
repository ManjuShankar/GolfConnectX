import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';

import axios from 'axios';
import toastr from 'toastr';

let saveGroupDetails = (formData, token) =>{
  var config = {
      headers: {'Authorization':'Token '+token}
  };
  const url =SERVICE_URLS.CREATE_GROUP_API;
  const apiSaveGroupRequest = axios.post(url, formData, config);
  return(dispatch)=>{
    return apiSaveGroupRequest.then(({data})=>{
       
        dispatch({type:types.CREATE_GROUP,apiResult: data});
        toastr.success("Group Details Saved Succefully");
        return data;
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
 }
}


let editGroupDetails = (formData, id, token) =>{
  var config = {
      headers: {'Authorization':'Token '+token}
  };
  const url = SERVICE_URLS.EDIT_GROUP_API + id +'/?format=json';
  const apiEditGroupRequest = axios.post(url, formData, config);
  return(dispatch)=>{
    return apiEditGroupRequest.then(({data})=>{
        toastr.success("Group Details Updated Succefully");
       
        dispatch({type:types.EDIT_GROUP_DETAILS,apiResult: data});
      }).catch((error)=>{
          toastr.error(error);
          throw(error);
      });
 }
}

export {saveGroupDetails, editGroupDetails};
