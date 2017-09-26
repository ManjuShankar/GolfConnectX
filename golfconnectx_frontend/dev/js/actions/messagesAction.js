import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';
import axios from 'axios';
import toastr from 'toastr';

let getMessages = (token) =>{
   const url = SERVICE_URLS.GET_MESSAGES;
   var config = {
        headers: {'Authorization':'Token '+token}
   };

const apiGetMessagesRequest = axios.get(url, config);
return(dispatch) => {
        return apiGetMessagesRequest.then(({data})=>{
          dispatch({type:types.GET_MESSAGES,apiResult:data});
        }).catch((error)=>{
          if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }   
           throw(error);  
        });
    }
}

let getMessageDetails = (token, messageId) =>{
  const url = SERVICE_URLS.GET_MESSAGES + messageId;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

  const apiGetMessageDetailsRequest = axios.get(url, config);
  return(dispatch) => {
       return apiGetMessageDetailsRequest.then(({data})=>{
         dispatch({type:types.GET_MESSAGE_DETAILS,apiResult:data});

       }).catch((error)=>{
        if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }   
           throw(error); 
       });
   }
}

let removeMessage = (token, messageId) =>{
  const url = SERVICE_URLS.GET_MESSAGES + messageId;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

  const apiGetMessageDetailsRequest = axios.delete(url, config);
  return(dispatch) => {
       return apiGetMessageDetailsRequest.then(({data})=>{
          toastr.success("Message removed successfully");
       }).catch((error)=>{
         toastr.error(error);
           throw(error);
       });
   }
}



let createNewMessage = (token, formData) => {
  const url = SERVICE_URLS.GET_MESSAGES + 'new-conversation';
  var config = {
       headers: {'Authorization':'Token '+token}
  };

  const apiPostMessageDetailsRequest = axios.post(url, formData, config);
  return(dispatch) => {
       return apiPostMessageDetailsRequest.then(({data})=>{
         toastr.success("Conversation initiated successfully");
       }).catch((error)=>{
         toastr.error(error);
           throw(error);
       });
   }
}


let sendNewMessageDetails = (token, messageId, message) =>{
  const url = SERVICE_URLS.GET_MESSAGES + messageId +'/new-message/';
  var config = {
       headers: {'Authorization':'Token '+token}
  };

  const apiPostMessageDetailsRequest = axios.post(url, {message:message}, config);
  return(dispatch) => {
       return apiPostMessageDetailsRequest.then(({data})=>{
          toastr.success("Message sent successfully");
          dispatch({type:types.POST_MESSAGE_DETAILS,apiResult:data});
       }).catch((error)=>{
         toastr.error(error);
           throw(error);
       });
   }
}
let deleteConversation = (token, ids, deleteMessage) =>{
  const url = SERVICE_URLS.DELETE_MULTIPLE_MESSAGES;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

  const apiRemoveConversation = axios.post(url, {ids:ids}, config);
  return(dispatch) => {
       return apiRemoveConversation.then(({data})=>{

          toastr.success("Conversation deleted successfully");
         dispatch({type:types.DELETE_CONVERSATION,apiResult:data});
       }).catch((error)=>{
         toastr.error(error);
           throw(error);
       });
   }
}

let getUsers = (token) =>{
  const url = SERVICE_URLS.GET_MESSAGES + 'new-conversation';
  var config = {
       headers: {'Authorization':'Token '+token}
  };

  const apiPostMessageDetailsRequest = axios.get(url, config);
  return(dispatch) => {
       return apiPostMessageDetailsRequest.then(({data})=>{

         return data;

       }).catch((error)=>{
         toastr.error(error);
           throw(error);
       });
   }
}

export {getMessages, getMessageDetails, removeMessage, createNewMessage, deleteConversation, sendNewMessageDetails, getUsers};
