import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';

import axios from 'axios';
import toastr from 'toastr';

let savePostDetails = (formData, token) =>{
  var config = {
      headers: {'Authorization':'Token '+token}
  };
  const url = SERVICE_URLS.CREATE_POST_API;

  const savePostDetails = axios.post(url, formData, config);
  return(dispatch)=>{
    return savePostDetails.then(({data})=>{
        toastr.success("Post saved Successfully");
        dispatch({type:types.CREATE_POST,apiResult: data});
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
 }
}
let getPostList = ( token) =>{
  var config = {
      headers: {'Authorization':'Token '+token}
  };
  const url = SERVICE_URLS.CREATE_POST_API;

  const getPostDetails = axios.get(url,  config);
  return(dispatch)=>{
    return getPostDetails.then(({data})=>{
      
       
        dispatch({type:types.GET_POST,apiResult: data});
      }).catch((error)=>{
        if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }   
           throw(error);  
     
      });
 }
}

let getPostDetails = ( token) =>{
  var config = {
      headers: {'Authorization':'Token '+token}
  };
  const url = SERVICE_URLS.GET_POSTS;

  const getFeedPostDetails = axios.get(url, config);
  return(dispatch)=>{
    return getFeedPostDetails.then(({data})=>{
      
        dispatch({type:types.GET_FEED_POSTS,apiResult: data});
      }).catch((error)=>{
          throw(error);
      });
 }
}
let searchPosts = (token, keyword) =>{
 
  const url = SERVICE_URLS.GET_POSTS + 'search/?format=json' + '&kw=' + keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiPostRequest = axios.get(url, config);
return(dispatch) => {
       return apiPostRequest.then(({data})=>{
        
         dispatch({type:types.GET_POSTSLIST,apiResult:data});
       }).catch((error)=>{
           throw(error);
       });
   }
}

export {savePostDetails, getPostDetails, searchPosts, getPostList}