import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';
import axios from 'axios';
import toastr from 'toastr';


let createEvents=(formData, token)=>{
  
    const url=SERVICE_URLS.CREATEEVENT_API;
     var config = {headers: {'Authorization':'Token '+token}};

    const apiCreateEventRequest = axios.post(url, formData, config);
    return(dispatch)=>{
      return apiCreateEventRequest.then(({data})=>{
        toastr.success("Event created successfully");
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
  }
};
let getStates=(token)=>{
  
    const url=SERVICE_URLS.CREATEEVENT_API;
     var config = {headers: {'Authorization':'Token '+token}};

    const apiCreateEventRequest = axios.get(url,  config);
    return(dispatch)=>{
      return apiCreateEventRequest.then(({data})=>{
        
         ///return data;
         dispatch({type:types.EVENT_STATES, apiResult:data});
       }).catch((error)=>{
          if(error != "Error: Request failed with status code 401"){
         toastr.error(error);
         }
          throw(error);

       });
   }
}


let editEvents=(formData, id, token)=>{
    const url=SERVICE_URLS.EDITEVENT_API + id + '/' ;
     var config = {headers: {'Authorization':'Token '+token}};

    const apiCreateEventRequest = axios.put(url, formData, config);
    return(dispatch)=>{
      return apiCreateEventRequest.then(({data})=>{
        toastr.success("Event updated successfully");
        }).catch((error)=>{
          toastr.error(error);
          if (error.response) {
              
          } else {
             
        }
          throw(error);
        });
  }
};
let RequestInvite = (token, eventId) =>{
 
  const url = SERVICE_URLS.REQUEST_INVITE+eventId+'/request-access';
  var config = {
       headers: {'Authorization':'Token '+token}
  };

  const apiGroupRequest = axios.get(url, config);
  return(dispatch) => {
          return apiGroupRequest.then(({data})=>{
            if(data.request_status){
            toastr.success(data.response_message);
            return data;
          }
            else{
            toastr.error(data.response_message);
            return data;
          }
          }).catch((error)=>{
            toastr.error(error);
              throw(error);
          });
      }
    }

export {createEvents, editEvents, RequestInvite, getStates};
