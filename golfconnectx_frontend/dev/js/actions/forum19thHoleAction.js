import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';

import axios from 'axios';
import toastr from 'toastr';
/*19th hole category*/
let get19HoleCategory=(token)=>{
    const url=SERVICE_URLS.GET_19HOLE_LIST;
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apicategoryListRequest=axios.get(url,config);

    return(dispatch)=>{
        return apicategoryListRequest.then(({data})=>{
          
            dispatch({type:types.GET_19HOLE_CATEGORY,apiResult:data});
        }).catch((error)=>{
             if(error != "Error: Request failed with status code 401") {
                 toastr.error(error);
               }   
           throw(error);  
        });
    }
};
let addNew19HoleCategory=( token, name)=>{
 
    const url=SERVICE_URLS.NINETEENTHHOLE_ADD_CATEGORY;
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apiCategoryRequest=axios.post(url, {name:name}, config);

    return(dispatch)=>{
        return apiCategoryRequest.then(({data})=>{
          
           // dispatch({type:types.GET_FORUM_COURSES,apiResult:data});
        }).catch((error)=>{
            throw(error);
        });
    }
};

let get19HoleCategoryObject = (categoryId, token) =>{

   const url = SERVICE_URLS.NINETEENTHHOLE_CATEGORY_OBJECT + categoryId + '/?format=json';
   var config = {
        headers: {'Authorization':'Token '+token}
   };

const apiCourseRequest = axios.get(url, config);
return(dispatch) => {
        return apiCourseRequest.then(({data})=>{
          
          dispatch({type:types.GET_SELECTED_19thHOLECATEGORY,apiResult:data});
          return data;
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
}
let get19HoleCategoryDetails = (categoryId, token) =>{

   const url = SERVICE_URLS.GET_19HOLE_DETAILS + categoryId + '/details/?format=json';
   var config = {
        headers: {'Authorization':'Token '+token}
   };

const apiCourseRequest = axios.get(url, config);
return(dispatch) => {
        return apiCourseRequest.then(({data})=>{
        
          dispatch({type:types.GET_SELECTED_19thHoleCATEGORY_DETAIL,apiResult:data});
          return data;
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
}
let addNew19HoleCategoryPost=(id, token, subject_line)=>{
 
    const url=SERVICE_URLS.ADD_19thHOLE_POST +id+'/?format=json';
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
let add19HoleCategoryComment=(categoryId, id,token,body)=>{
  
  const url=SERVICE_URLS.CATEGORY19_COMMENT + categoryId +'/'+ id + '/comments/';

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
let search19HoleCategoryPosts = (token, cid, keyword) =>{
 
 
  const url = SERVICE_URLS.CATEGORY19_POST_SEARCH + cid+ '/search' + '/?format=json' + '&kw=' + keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiPostRequest = axios.get(url, config);
return(dispatch) => {
       return apiPostRequest.then(({data})=>{
      
         dispatch({type:types.GET_19CATEGORYLIST,apiResult:data});
       }).catch((error)=>{
           throw(error);
       });
   }
}
let searchCategory = (token, keyword) =>{
 
  const url = SERVICE_URLS.SEARCH_19HOLE_CATEGORY + '?format=json&kw='+keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiCourseRequest = axios.get(url, config);
return(dispatch) => {

       return apiCourseRequest.then(({data})=>{

         dispatch({type:types.GET19HOLE_CATEGORYLIST,apiResult:data});
       }).catch((error)=>{
           throw(error);
       });
   }
}

export {get19HoleCategory,  search19HoleCategoryPosts, add19HoleCategoryComment, addNew19HoleCategoryPost, addNew19HoleCategory, get19HoleCategoryObject, 
  get19HoleCategoryDetails, searchCategory};
