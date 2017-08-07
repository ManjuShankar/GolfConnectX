import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';

import axios from 'axios';
import toastr from 'toastr';
/*get Discussion category*/
let getDiscussionCategory=(token)=>{
    const url=SERVICE_URLS.GET_DISCUSSION_LIST;
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apicategoryListRequest=axios.get(url,config);

    return(dispatch)=>{
        return apicategoryListRequest.then(({data})=>{
           
            dispatch({type:types.GET_DISCUSSION_CATEGORY,apiResult:data});
        }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
                     toastr.error(error);
                 }   
           throw(error); 
        });
    }
};
let getDiscussionCategoryObject = (categoryId, token) =>{
   const url = SERVICE_URLS.DISCUSSION_CATEGORY_OBJECT + categoryId + '/?format=json';
   var config = {
        headers: {'Authorization':'Token '+token}
   };

const apiCourseRequest = axios.get(url, config);
return(dispatch) => {
        return apiCourseRequest.then(({data})=>{
         
          dispatch({type:types.GET_DISCUSSION_CATEGORY_OBJECT,apiResult:data});
          return data;
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
}
let getDiscussionCategoryDetails = (categoryId, token) =>{

   const url = SERVICE_URLS.DISCUSSION_DETAILS + categoryId + '/details/?format=json';
   var config = {
        headers: {'Authorization':'Token '+token}
   };

const apiCourseRequest = axios.get(url, config);
return(dispatch) => {
        return apiCourseRequest.then(({data})=>{
         
          dispatch({type:types.GET_DISCUSSION_CATEGORY_DETAIL,apiResult:data});
          return data;
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
}
let addNewDiscussionCategory=( token, name)=>{
 
    const url=SERVICE_URLS.DISCUSSION_ADD_CATEGORY;
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apiCategoryRequest=axios.post(url, {name:name}, config);

    return(dispatch)=>{
        return apiCategoryRequest.then(({data})=>{
         
        }).catch((error)=>{
            throw(error);
        });
    }
};
let addNewDiscussionCategoryPost=(id, token, subject_line)=>{
 
    const url=SERVICE_URLS.DISCUSSION_ADD_POST +id+'/?format=json';
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apiCategoryRequest=axios.post(url, {subject_line:subject_line}, config);

    return(dispatch)=>{
        return apiCategoryRequest.then(({data})=>{
     
           // dispatch({type:types.GET_FORUM_COURSES,apiResult:data});
        }).catch((error)=>{
            throw(error);
        });
    }
};
let addDiscussionCategoryComment=(categoryId, id,token,body)=>{
  
  const url=SERVICE_URLS.DISCUSSION_CATEGORY_COMMENT + categoryId +'/'+ id + '/comments/';
  
   var config = {
    headers: {'Authorization':'Token '+token}
  };
   const apiCommentRequest = axios.post(url, { body: body}, config);
  
    return(dispatch)=>{
      return apiCommentRequest.then(({data})=>{
        
        toastr.success("Comment Added Successfully");
     
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}
let searchDiscussionCategoryPosts = (token, cid, keyword) =>{
 
 
  const url = SERVICE_URLS.DISCUSSION_CATEGORY_POST_SEARCH + cid+ '/search' + '/?format=json' + '&kw=' + keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiPostRequest = axios.get(url, config);
return(dispatch) => {
       return apiPostRequest.then(({data})=>{
       
         dispatch({type:types.GET_DISCUSSION_CATEGORYLIST,apiResult:data});
       }).catch((error)=>{
           throw(error);
       });
   }
}
let searchCategory = (token, keyword) =>{
 
  const url = SERVICE_URLS.SEARCH_DISCUSSION_CATEGORY + '?format=json&kw='+keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiCourseRequest = axios.get(url, config);
return(dispatch) => {

       return apiCourseRequest.then(({data})=>{
        
         dispatch({type:types.GET_SEARCH_CATEGORYLIST,apiResult:data});
       }).catch((error)=>{
           throw(error);
       });
   }
}
export {getDiscussionCategory,  getDiscussionCategoryObject, getDiscussionCategoryDetails, addNewDiscussionCategory, addNewDiscussionCategoryPost,
  addDiscussionCategoryComment, searchDiscussionCategoryPosts, searchCategory};
