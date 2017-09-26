import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';

import axios from 'axios';

import toastr from 'toastr';

let getForumCategoryURLByType = (forumType) =>{
  switch(_.toNumber(forumType)){
    case 1: return SERVICE_URLS.WATERCOOLER_GET_CATEGORY;
    case 2: return SERVICE_URLS.GET_EQUIPMENT_LIST;
    case 3: return SERVICE_URLS.GET_INSTRUCTION_LIST;
    case 4: return SERVICE_URLS.GET_RULES_LIST;
    case 5: return SERVICE_URLS.GET_19HOLE_LIST;
    case 6: return SERVICE_URLS.GET_GETLOCAL_LIST;
    case 7: return SERVICE_URLS.GET_GOLFTRAVEL_LIST;
    case 8: return SERVICE_URLS.GET_DISCUSSION_LIST;
    case 9: return SERVICE_URLS.GET_FITNESS_LIST;
  }
}

let getForumCategoryObjectURLByType = (forumType) =>{
  switch(_.toNumber(forumType)){
    case 1: return SERVICE_URLS.WATERCOOLER_CATEGORY_OBJECT;
    case 2: return SERVICE_URLS.EQUIPMENT_CATEGORY_OBJECT;
    case 3: return SERVICE_URLS.INSTRUCTION_CATEGORY_OBJECT;
    case 4: return SERVICE_URLS.RULES_CATEGORY_OBJECT;
    case 5: return SERVICE_URLS.NINETEENTHHOLE_CATEGORY_OBJECT;
    case 6: return SERVICE_URLS.LOCAL_CATEGORY_OBJECT;
    case 7: return SERVICE_URLS.GOLFTRAVEL_CATEGORY_OBJECT;
    case 8: return SERVICE_URLS.DISCUSSION_CATEGORY_OBJECT;
    case 9: return SERVICE_URLS.FITNESS_CATEGORY_OBJECT;
  }
}

let getForumCategoryDetailsURLByType = (forumType) =>{
  switch(_.toNumber(forumType)){
    case 1: return SERVICE_URLS.WATERCOOLER_DETAILS;
    case 2: return SERVICE_URLS.EQUIPMENT_DETAILS;
    case 3: return SERVICE_URLS.INSTRUCTION_DETAILS;
    case 4: return SERVICE_URLS.RULES_DETAILS;
    case 5: return SERVICE_URLS.GET_19HOLE_DETAILS;
    case 6: return SERVICE_URLS.LOCAL_DETAILS;
    case 7: return SERVICE_URLS.GOLFTRAVEL_DETAILS;
    case 8: return SERVICE_URLS.DISCUSSION_DETAILS;
    case 9: return SERVICE_URLS.FITNESS_DETAILS;
  }
}


let addNewForumCategoryURLByType = (forumType) =>{
  switch(_.toNumber(forumType)){
    case 1: return SERVICE_URLS.WATERCOOLER_ADD_CATEGORY;
    case 2: return SERVICE_URLS.EQUIPMENT_ADD_CATEGORY;
    case 3: return SERVICE_URLS.INSTRUCTION_ADD_CATEGORY;
    case 4: return SERVICE_URLS.RULES_ADD_CATEGORY;
    case 5: return SERVICE_URLS.NINETEENTHHOLE_ADD_CATEGORY;
    case 6: return SERVICE_URLS.LOCAL_ADD_CATEGORY;
    case 7: return SERVICE_URLS.GOLFTRAVEL_ADD_CATEGORY;
    case 8: return SERVICE_URLS.DISCUSSION_ADD_CATEGORY;
    case 9: return SERVICE_URLS.FITNESS_ADD_CATEGORY;
  }
}

let addNewForumCategoryPostURLByType = (forumType) =>{
  switch(_.toNumber(forumType)){
    case 1: return SERVICE_URLS.WATERCOOLER_ADD_POST;
    case 2: return SERVICE_URLS.EQUIPMENT_ADD_POST;
    case 3: return SERVICE_URLS.INSTRUCTION_ADD_POST;
    case 4: return SERVICE_URLS.RULES_ADD_POST;
    case 5: return SERVICE_URLS.ADD_19thHOLE_POST;
    case 6: return SERVICE_URLS.LOCAL_ADD_POST;
    case 7: return SERVICE_URLS.GOLFTRAVEL_ADD_POST;
    case 8: return SERVICE_URLS.DISCUSSION_ADD_POST;
    case 9: return SERVICE_URLS.FITNESS_ADD_POST;
  }
}

let addNewForumCategoryCommentURLByType = (forumType) =>{
  switch(_.toNumber(forumType)){
    case 1: return SERVICE_URLS.CATEGORY_COMMENT;
    case 2: return SERVICE_URLS.EQUIPMENT_CATEGORY_COMMENT;
    case 3: return SERVICE_URLS.INSTRUCTION_CATEGORY_COMMENT;
    case 4: return SERVICE_URLS.RULES_CATEGORY_COMMENT;
    case 5: return SERVICE_URLS.CATEGORY19_COMMENT;
    case 6: return SERVICE_URLS.LOCAL_CATEGORY_COMMENT;
    case 7: return SERVICE_URLS.GOLFTRAVEL_CATEGORY_COMMENT;
    case 8: return SERVICE_URLS.DISCUSSION_CATEGORY_COMMENT;
    case 9: return SERVICE_URLS.FITNESS_CATEGORY_COMMENT;
  }
}

let searchForumCategoryPostsURLByType = (forumType) =>{
  switch(_.toNumber(forumType)){
    case 1: return SERVICE_URLS.CATEGORY_POST_SEARCH;
    case 2: return SERVICE_URLS.EQUIPMENT_CATEGORY_POST_SEARCH;
    case 3: return SERVICE_URLS.INSTRUCTION_CATEGORY_POST_SEARCH;
    case 4: return SERVICE_URLS.RULES_CATEGORY_POST_SEARCH;
    case 5: return SERVICE_URLS.CATEGORY19_POST_SEARCH;
    case 6: return SERVICE_URLS.LOCAL_CATEGORY_POST_SEARCH;
    case 7: return SERVICE_URLS.GOLFTRAVEL_CATEGORY_POST_SEARCH;
    case 8: return SERVICE_URLS.DISCUSSION_CATEGORY_POST_SEARCH;
    case 9: return SERVICE_URLS.FITNESS_CATEGORY_POST_SEARCH;
  }
}


let searchForumCategoryURLByType = (forumType) =>{
  switch(_.toNumber(forumType)){
    case 1: return SERVICE_URLS.SEARCH_WATERCOOLER_CATEGORY;
    case 2: return SERVICE_URLS.SEARCH_EQUIPMENT_CATEGORY;
    case 3: return SERVICE_URLS.SEARCH_INSTRUCTION_CATEGORY;
    case 4: return SERVICE_URLS.SEARCH_RULES_CATEGORY;
    case 5: return SERVICE_URLS.SEARCH_19HOLE_CATEGORY;
    case 6: return SERVICE_URLS.SEARCH_LOCAL_CATEGORY;
    case 7: return SERVICE_URLS.SEARCH_GOLF_CATEGORY;
    case 8: return SERVICE_URLS.SEARCH_DISCUSSION_CATEGORY;
    case 9: return SERVICE_URLS.SEARCH_FITNESS_CATEGORY;
  }
}



let dispatchForumCategoryURLByType = (forumType) =>{
  return types.GET_FORUM_CATEGORY;
}

let dispatchForumCategoryObjectURLByType = (forumType) =>{
  return types.GET_SELECTED_CATEGORY;
  /*
  switch(_.toNumber(forumType)){
    case 1: return types.GET_SELECTED_CATEGORY;
    case 2: return types.GET_SELECTED_CATEGORY;
    case 3: return types.GET_INSTRUCTION_CATEGORY_OBJECT;
    case 4: return types.GET_RULES_CATEGORY_OBJECT;
    case 5: return types.GET_SELECTED_19thHOLECATEGORY;
    case 6: return types.GET_LOCAL_CATEGORY_OBJECT;
    case 7: return types.GET_GOLFTRAVEL_CATEGORY_OBJECT;
    case 8: return types.GET_DISCUSSION_CATEGORY_OBJECT;
    case 9: return types.GET_FITNESS_CATEGORY_OBJECT;
  }*/
}


let dispatchForumCategoryDetailsURLByType = (forumType) =>{
  return types.GET_SELECTED_CATEGORY_DETAIL;
  /*switch(_.toNumber(forumType)){
    case 1: return types.GET_SELECTED_CATEGORY_DETAIL;
    case 2: return types.GET_SELECTED_CATEGORY_DETAIL;
    case 3: return types.GET_INSTRUCTION_CATEGORY_DETAIL;
    case 4: return types.GET_RULES_CATEGORY_DETAIL;
    case 5: return types.GET_SELECTED_19thHoleCATEGORY_DETAIL;
    case 6: return types.GET_LOCAL_CATEGORY_DETAIL;
    case 7: return types.GET_GOLFTRAVEL_CATEGORY_DETAIL;
    case 8: return types.GET_DISCUSSION_CATEGORY_DETAIL;
    case 9: return types.GET_FITNESS_CATEGORY_DETAIL;
  }*/
}

let searchDispatchForumCategoryPostsURLByType = (forumType) =>{
  return types.GET_CATEGORYLIST;
  /*switch(_.toNumber(forumType)){
    case 1: return types.GET_CATEGORYLIST;
    case 2: return types.GET_CATEGORYLIST;
    case 3: return types.GET_INSTRUCTION_CATEGORYLIST;
    case 4: return types.GET_RULES_CATEGORYLIST;
    case 5: return types.GET_19CATEGORYLIST;
    case 6: return types.GET_LOCAL_CATEGORYLIST;
    case 7: return types.GET_GOLFTRAVEL_CATEGORYLIST;
    case 8: return types.GET_DISCUSSION_CATEGORYLIST;
    case 9: return types.GET_FITNESS_CATEGORYLIST;
  }*/
}


let searchDispatchForumCategoryURLByType = (forumType) =>{
  return types.GET_SEARCH_LIST;
  /*switch(_.toNumber(forumType)){
    case 1: return types.GET_SEARCH_LIST;
    case 2: return types.GET_SEARCH_LIST;
    case 3: return types.GET_INSTRUCTION_SEARCH_CATEGORYLIST;
    case 4: return types.GET_RULES_SEARCH_CATEGORYLIST;
    case 5: return types.GET19HOLE_CATEGORYLIST;
    case 6: return types.GET_LOCAL_SEARCH;
    case 7: return types.GET_GOLF_SEARCH_CATEGORYLIST;
    case 8: return types.GET_SEARCH_CATEGORYLIST;
    case 9: return types.GET_FITNESS_SEARCH_CATEGORYLIST;
  }*/
}

let getForumCategory=(token, forumType)=>{
    let url= getForumCategoryURLByType(forumType);
    let dispatchItem = dispatchForumCategoryURLByType(forumType);
    var config = {
        headers: {'Authorization':'Token '+token}
    };
    const apicategoryListRequest=axios.get(url,config);
    return(dispatch)=>{
        return apicategoryListRequest.then(({data})=>{
            dispatch({type:dispatchItem ,apiResult:data});
        }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
                toastr.error(error);
             }
             throw(error);
        });
    }
};

let getForumCategoryObject = (categoryId, token, forumType) =>{
   let forumCategoryObjectURL= getForumCategoryObjectURLByType(forumType);
   let url = forumCategoryObjectURL + categoryId + '/?format=json';
   let dispatchItem = dispatchForumCategoryObjectURLByType(forumType);

   var config = {
        headers: {'Authorization':'Token '+token}
   };

   const apiCourseRequest = axios.get(url, config);
    return(dispatch) => {
        return apiCourseRequest.then(({data})=>{
          
          dispatch({type:dispatchItem, apiResult:data});
          return data;
        }).catch((error)=>{
            toastr.error(error);
            throw(error);
        });
    }
}

let getForumCategoryDetails = (categoryId, token, forumType) =>{
  let forumCategoryDetailsURL = getForumCategoryDetailsURLByType(forumType);
  let url = forumCategoryDetailsURL + categoryId + '/details/?format=json';


  let dispatchItem = dispatchForumCategoryDetailsURLByType(forumType);


   var config = {
        headers: {'Authorization':'Token '+token}
   };

    const apiCourseRequest = axios.get(url, config);
    return(dispatch) => {
        return apiCourseRequest.then(({data})=>{
          
          dispatch({type:dispatchItem, apiResult:data});
          return data;
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
}

let addNewForumCategory=(token, name, forumType)=>{
    let url=addNewForumCategoryURLByType(forumType);
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

let addNewForumCategoryPost=(id, token, subject_line, forumType)=>{
    let  newForumCategoryPostURL= addNewForumCategoryPostURLByType(forumType);
    let url=  newForumCategoryPostURL+id+'/?format=json';
    var config = {
      headers: {'Authorization':'Token '+token}
    };
    const apiCategoryRequest=axios.post(url, {subject_line:subject_line}, config);
    return(dispatch)=>{
        return apiCategoryRequest.then(({data})=>{
        }).catch((error)=>{
            throw(error);
        });
    }
 };

 let addForumCategoryComment=(categoryId, id, token, body, forumType)=>{
   let forumCategoryCommentURL = addNewForumCategoryCommentURLByType(forumType);
   let url= forumCategoryCommentURL + categoryId +'/'+ id + '/comments/';
   var config = {
    headers: {'Authorization':'Token '+token}
  };
   const apiCommentRequest = axios.post(url, { body: body}, config);
    return(dispatch)=>{
      return apiCommentRequest.then(({data})=>{
          toastr.success("Comment added successfully");
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}

let searchForumCategoryPosts = (token, cid, keyword, forumType) =>{
  let  forumCategoryPostsSURL= searchForumCategoryPostsURLByType(forumType);
  const url = forumCategoryPostsSURL  + cid + '/search' + '/?format=json' + '&kw=' + keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };
  const apiPostRequest = axios.get(url, config);
  return(dispatch) => {
       return apiPostRequest.then(({data})=>{
         dispatch({type:searchDispatchForumCategoryPostsURLByType(forumType),apiResult:data});
       }).catch((error)=>{
           throw(error);
       });
   }
}

let searchCategory = (token, keyword, forumType) =>{
  let searchCategorysURL = searchForumCategoryURLByType(forumType);
  const url = searchCategorysURL  + '?format=json&kw='+keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };
  const apiCourseRequest = axios.get(url, config);
  return(dispatch) => {
       return apiCourseRequest.then(({data})=>{
         dispatch({type:searchDispatchForumCategoryURLByType(forumType),apiResult:data});
       }).catch((error)=>{
           throw(error);
       });
   }
}

let deletePost=(categoryId, conversationId, token, forumType)=>{

  let deleteCategorysURL = getForumCategoryURLByType(forumType);
    const url=deleteCategorysURL+'category/'+categoryId+'/'+conversationId;
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apigroupDeleteRequest=axios.delete(url,config);

    return(dispatch)=>{
        return apigroupDeleteRequest.then(()=>{
            toastr.success("Conversation deleted successfully");
            return;
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
};

let deleteComment=(categoryId, conversationId,commentId, token, forumType)=>{

  let deleteCategorysURL = getForumCategoryURLByType(forumType);
    const url=deleteCategorysURL+'category/'+categoryId+'/'+conversationId+'/comments/'+commentId;
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apigroupDeleteRequest=axios.delete(url,config);

    return(dispatch)=>{
        return apigroupDeleteRequest.then(()=>{
            toastr.success("Comment deleted successfully");
            return;
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
};

export {
  getForumCategory,
  getForumCategoryObject,
  getForumCategoryDetails,
  addNewForumCategory,
  addNewForumCategoryPost,
  addForumCategoryComment,
  searchForumCategoryPosts,
  searchCategory, deletePost, deleteComment
};
