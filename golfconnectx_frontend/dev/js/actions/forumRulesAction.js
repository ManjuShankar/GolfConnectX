import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';

import axios from 'axios';
import toastr from 'toastr';
/*get Rules category*/
let getRulesCategory=(token)=>{
    const url=SERVICE_URLS.GET_RULES_LIST;
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apicategoryListRequest=axios.get(url,config);

    return(dispatch)=>{
        return apicategoryListRequest.then(({data})=>{
           
            dispatch({type:types.GET_RULES_CATEGORY,apiResult:data});
        }).catch((error)=>{
           if(error != "Error: Request failed with status code 401"){
           toastr.error(error);
          }   
           throw(error);  
        });
    }
};
let getRulesCategoryObject = (categoryId, token) =>{
   const url = SERVICE_URLS.RULES_CATEGORY_OBJECT + categoryId + '/?format=json';
   var config = {
        headers: {'Authorization':'Token '+token}
   };

const apiCourseRequest = axios.get(url, config);
return(dispatch) => {
        return apiCourseRequest.then(({data})=>{
         
          dispatch({type:types.GET_RULES_CATEGORY_OBJECT,apiResult:data});
          return data;
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
}
let getRulesCategoryDetails = (categoryId, token) =>{

   const url = SERVICE_URLS.RULES_DETAILS + categoryId + '/details/?format=json';
   var config = {
        headers: {'Authorization':'Token '+token}
   };

const apiCourseRequest = axios.get(url, config);
return(dispatch) => {
        return apiCourseRequest.then(({data})=>{
         
          dispatch({type:types.GET_RULES_CATEGORY_DETAIL,apiResult:data});
          return data;
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
}
let addNewRulesCategory=( token, name)=>{
 
    const url=SERVICE_URLS.RULES_ADD_CATEGORY;
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
let addNewRulesCategoryPost=(id, token, subject_line)=>{
 
    const url=SERVICE_URLS.RULES_ADD_POST +id+'/?format=json';
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
let addRulesCategoryComment=(categoryId, id,token,body)=>{
  
  const url=SERVICE_URLS.RULES_CATEGORY_COMMENT + categoryId +'/'+ id + '/comments/';
 
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
let searchRulesCategoryPosts = (token, cid, keyword) =>{
 
 
  const url = SERVICE_URLS.RULES_CATEGORY_POST_SEARCH + cid+ '/search' + '/?format=json' + '&kw=' + keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiPostRequest = axios.get(url, config);
return(dispatch) => {
       return apiPostRequest.then(({data})=>{
       
         dispatch({type:types.GET_RULES_CATEGORYLIST,apiResult:data});
       }).catch((error)=>{
           throw(error);
       });
   }
}
let searchCategory = (token, keyword) =>{
 
  const url = SERVICE_URLS.SEARCH_RULES_CATEGORY + '?format=json&kw='+keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiCourseRequest = axios.get(url, config);
return(dispatch) => {

       return apiCourseRequest.then(({data})=>{
     
         dispatch({type:types.GET_RULES_SEARCH_CATEGORYLIST,apiResult:data});
       }).catch((error)=>{
           throw(error);
       });
   }
}
export {getRulesCategory,  getRulesCategoryObject, getRulesCategoryDetails, addNewRulesCategory, addNewRulesCategoryPost,
  addRulesCategoryComment, searchRulesCategoryPosts, searchCategory
};
