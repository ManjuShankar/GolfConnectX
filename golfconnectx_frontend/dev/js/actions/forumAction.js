import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';

import axios from 'axios';
import toastr from 'toastr';



/*let courseList=(token, pageNumber=0,  keyword="")=>{
      var config = {
        headers: {'Authorization':'Token '+token}
      };
      let url, dispatchType;
      if(pageNumber==0){
         url=SERVICE_URLS.GETCOURSE_API;
         dispatchType = types.GET_COURSELIST;
      }
      else{
         url= SERVICE_URLS.URL_USED+'api/courses/old?format=json&page=' +  _.toNumber(pageNumber)+'&kw='+keyword;
          dispatchType = types.GET_COURSELIST_APPEND;
      }
    const apicourseListRequest=axios.get(url,config);
    return(dispatch)=>{
        return apicourseListRequest.then(({data})=>{
            dispatch({type:dispatchType, apiResult: data.results});
            return data.next;
        }).catch((error)=>{
          if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
        }
           throw(error);
        });
    }
};*/

let getcourseList=(token, pageNumber=0,  keyword="")=>{
    var config = {
      headers: {'Authorization':'Token '+token}
    };
    let url, dispatchType;
    if(pageNumber==0){
       url=SERVICE_URLS.GETCOURSE_API;
       dispatchType = types.GET_FORUM_COURSES;
    }
    else{
       url= SERVICE_URLS.URL_USED+'api/courses/old?format=json&page=' +  _.toNumber(pageNumber)+'&kw='+keyword;
        dispatchType = types.GET_FORUM_COURSES_APPEND;
    }

   

    const apicourseListRequest=axios.get(url,config);

    return(dispatch)=>{
        return apicourseListRequest.then(({data})=>{
            dispatch({type:dispatchType, apiResult: data.results});
            return data.next;
        }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
                 toastr.error(error);
                }   
             throw(error); 
        });
    }
};
let searchCourses = (token, keyword) =>{
  const url = SERVICE_URLS.SEARCH_COURSES + '?format=json' + '&kw=' + keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiCourseRequest = axios.get(url, config);
return(dispatch) => {
       return apiCourseRequest.then(({data})=>{
     
         dispatch({type:types.GET_COURSELIST,apiResult:data.results});
       }).catch((error)=>{
           throw(error);
       });
   }
}

let getconversation=(id, token)=>{
  
    const url=SERVICE_URLS.FORUM_CONVERSATIONS +id+'/posts';
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apiconvoListRequest=axios.get(url,config);

    return(dispatch)=>{
        return apiconvoListRequest.then(({data})=>{
         
            dispatch({type:types.GET_FORUM_CONVERSATIONS,apiResult:data});
        }).catch((error)=>{
            throw(error);
        });
    }
};
let addNewPost = (id, token, title)=>{
    const url=SERVICE_URLS.FORUM_POST+id+ '/posts'
    var config = {
    headers: {'Authorization':'Token '+token}
  };

  const apigroupPostRequest = axios.post(url, { title: title }, config);

  return(dispatch)=>{
      return apigroupPostRequest.then(({data})=>{
        toastr.success("Post added successfully");
        dispatch({type:types.GET_FORUM_POSTS_LIST,apiResult:data});
      }).catch((error)=>{
        if(error.response.status == 404){
            toastr.error("Post Doesn't Exist");
           }
           else 
            {
                toastr.error(error);
            }
          throw(error);
      });
  }
}

let addComment=( id,token,body)=>{
  
  const url=SERVICE_URLS.ADD_NEW_COMMENT +  id + '/comments/';
 
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

let searchPosts = (token, cid, keyword) =>{
  

  const url = SERVICE_URLS.FORUM_SEARCH + cid+ '/posts/search' + '/?format=json' + '&kw=' + keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiPostRequest = axios.get(url, config);
return(dispatch) => {
       return apiPostRequest.then(({data})=>{
      
         dispatch({type:types.GET_FORUMLIST,apiResult:data});
       }).catch((error)=>{
           throw(error);
       });
   }
}
/*Water cooler category*/
let getCategory=(token)=>{
    const url=SERVICE_URLS.WATERCOOLER_GET_CATEGORY;
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apicategoryListRequest=axios.get(url,config);

    return(dispatch)=>{
        return apicategoryListRequest.then(({data})=>{
           
            dispatch({type:types.GET_FORUM_CATEGORY,apiResult:data});
        }).catch((error)=>{
          if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }   
           throw(error);  
        });
    }
};
let getCategoryObject = (categoryId, token) =>{
   const url = SERVICE_URLS.WATERCOOLER_CATEGORY_OBJECT + categoryId + '/?format=json';
   var config = {
      headers: {'Authorization':'Token '+token}
    };
    const apiCourseRequest = axios.get(url, config);
    return(dispatch) => {
        return apiCourseRequest.then(({data})=>{
            dispatch({type:types.GET_SELECTED_CATEGORY,apiResult:data});
        return data;
      }).catch((error)=>{
          toastr.error(error);
          throw(error);
      });
   }
 }

 let getCategoryDetails = (categoryId, token) =>{
    const url = SERVICE_URLS.WATERCOOLER_DETAILS + categoryId + '/details/?format=json';
    var config = {
      headers: {'Authorization':'Token '+token}
    };
    const apiCourseRequest = axios.get(url, config);
    return(dispatch) => {
      return apiCourseRequest.then(({data})=>{
          dispatch({type:types.GET_SELECTED_CATEGORY_DETAIL,apiResult:data});
          return data;
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
}

let addNewCategory=( token, name)=>{
    const url=SERVICE_URLS.WATERCOOLER_ADD_CATEGORY;
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



let addNewCategoryPost=(id, token, subject_line)=>{
 
    const url=SERVICE_URLS.WATERCOOLER_ADD_POST +id+'/?format=json';
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
let addCategoryComment=(categoryId, id,token,body)=>{
  
  const url=SERVICE_URLS.CATEGORY_COMMENT + categoryId +'/'+ id + '/comments/';
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
let searchCategoryPosts = (token, cid, keyword) =>{
const url = SERVICE_URLS.CATEGORY_POST_SEARCH + cid+ '/search' + '/?format=json' + '&kw=' + keyword ;
var config = {
     headers: {'Authorization':'Token '+token}
};

const apiPostRequest = axios.get(url, config);
return(dispatch) => {
     return apiPostRequest.then(({data})=>{
       dispatch({type:types.GET_CATEGORYLIST,apiResult:data});
     }).catch((error)=>{
         throw(error);
     });
 }
}
let searchWaterCoolerCategory = (token, keyword) =>{
const url = SERVICE_URLS.SEARCH_WATERCOOLER_CATEGORY + '?format=json&kw=' + keyword ;
var config = {
     headers: {'Authorization':'Token '+token}
};

const apiCourseRequest = axios.get(url, config);
return(dispatch) => {
     return apiCourseRequest.then(({data})=>{
       dispatch({type:types.GET_SEARCH_LIST,apiResult:data});
     }).catch((error)=>{
         throw(error);
     });
 }
}

/*get local category*/
let getLocalCategory=(token)=>{
    const url=SERVICE_URLS.GET_GETLOCAL_LIST;
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apicategoryListRequest=axios.get(url,config);

    return(dispatch)=>{
        return apicategoryListRequest.then(({data})=>{
          
            dispatch({type:types.GET_LOCAL_CATEGORY,apiResult:data});
        }).catch((error)=>{
             if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }   
           throw(error); 
        });
    }
};
let getLocalCategoryObject = (categoryId, token) =>{
   const url = SERVICE_URLS.LOCAL_CATEGORY_OBJECT + categoryId + '/?format=json';
   var config = {
        headers: {'Authorization':'Token '+token}
   };

const apiCourseRequest = axios.get(url, config);
return(dispatch) => {
        return apiCourseRequest.then(({data})=>{
         
          dispatch({type:types.GET_LOCAL_CATEGORY_OBJECT,apiResult:data});
          return data;
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
}
let getLocalCategoryDetails = (categoryId, token) =>{

   const url = SERVICE_URLS.LOCAL_DETAILS + categoryId + '/details/?format=json';
   var config = {
        headers: {'Authorization':'Token '+token}
   };

const apiCourseRequest = axios.get(url, config);
return(dispatch) => {
        return apiCourseRequest.then(({data})=>{
         
          dispatch({type:types.GET_LOCAL_CATEGORY_DETAIL,apiResult:data});
          return data;
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
}
let addNewLocalCategory=( token, name)=>{
 
    const url=SERVICE_URLS.LOCAL_ADD_CATEGORY;
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
let addNewLocalCategoryPost=(id, token, subject_line)=>{
 
    const url=SERVICE_URLS.LOCAL_ADD_POST +id+'/?format=json';
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
let addLocalCategoryComment=(categoryId, id,token,body)=>{
  
  const url=SERVICE_URLS.LOCAL_CATEGORY_COMMENT + categoryId +'/'+ id + '/comments/';
 
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
let searchLocalCategoryPosts = (token, cid, keyword) =>{
 
  
  const url = SERVICE_URLS.LOCAL_CATEGORY_POST_SEARCH + cid+ '/search' + '/?format=json' + '&kw=' + keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiPostRequest = axios.get(url, config);
return(dispatch) => {
       return apiPostRequest.then(({data})=>{
     
         dispatch({type:types.GET_LOCAL_CATEGORYLIST,apiResult:data});
       }).catch((error)=>{
           throw(error);
       });
   }
}
let searchLocalCategory = (token, keyword) =>{
 
  const url = SERVICE_URLS.SEARCH_LOCAL_CATEGORY + '?format=json' + '&kw=' + keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiCourseRequest = axios.get(url, config);
return(dispatch) => {
       return apiCourseRequest.then(({data})=>{
         dispatch({type:types.GET_LOCAL_SEARCH,apiResult:data});
       }).catch((error)=>{
           throw(error);
       });
   }
}


export {getcourseList, searchCourses, getconversation, addNewPost, addComment, searchPosts, 
  addNewCategory, getCategory, getCategoryObject, addNewCategoryPost, getCategoryDetails, 
  addCategoryComment, searchCategoryPosts, getLocalCategory, getLocalCategoryObject, getLocalCategoryDetails, addNewLocalCategory,
  addNewLocalCategoryPost, addLocalCategoryComment, searchLocalCategoryPosts, searchLocalCategory, searchWaterCoolerCategory
};
