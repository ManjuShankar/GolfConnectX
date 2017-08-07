import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';

import axios from 'axios';
import toastr from 'toastr';
import _ from 'lodash';

let unFollowCourse = (token, courseId) =>{
  const url = SERVICE_URLS.COURSE_UNFOLLOW + courseId + '/follow';
  var config = {
       headers: {'Authorization':'Token '+token}
  };

  const apiCourseRequest = axios.get(url,config);
  return(dispatch) => {
         return apiCourseRequest.then(({data})=>{
           dispatch({type:types.FOLLOW_UNFOLLOW_TOGGLE ,apiResult:data});
         }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
            toastr.error(error);
          }
           throw(error);

         });
     }
}



let searchCourses = (token, keyword, pageNumber) =>{
 let url, dispatchType;
 if(keyword){
          url= 'http://52.45.249.118:8080/api/courses/old?format=json&page=' +  _.toNumber(pageNumber) + '&kw='+keyword;
         dispatchType = types.GET_COURSELIST_APPEND;
      }
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiCourseRequest = axios.get(url, config);
return(dispatch) => {
       return apiCourseRequest.then(({data})=>{
         dispatch({type:types.GET_COURSELIST,apiResult:data.results});
         return data.next;
       }).catch((error)=>{
         if(error != "Error: Request failed with status code 401"){
         toastr.error(error);
          }
           throw(error);

       });
   }
}

let courseList=(token, pageNumber=0,  keyword="")=>{
      var config = {
        headers: {'Authorization':'Token '+token}
      };
      let url, dispatchType;
      if(pageNumber==0){
         url=SERVICE_URLS.GETCOURSE_API;
         dispatchType = types.GET_COURSELIST;
      }
      else{
         url= 'http://52.45.249.118:8080/api/courses/old?format=json&page=' +  _.toNumber(pageNumber)+'&kw='+keyword;
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
};
let groupCourseList=(token)=>{

    const url=SERVICE_URLS.GET_COURSE_OBJECT;
    var config = {
    headers: {'Authorization':'Token '+token}
};
   const apiCourseRequest = axios.get(url,config);
  return(dispatch) => {
         return apiCourseRequest.then(({data})=>{
           dispatch({type:types.GET_COURSELIST ,apiResult:data});

         }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
            toastr.error(error);
          }
           throw(error);

         });
     }
}

let getAdminCourseList=(token)=>{
      var config = {
        headers: {'Authorization':'Token '+token}
      };
      let  url= SERVICE_URLS.GET_COURSE_OBJECT+'admin-courses';
      let  dispatchType = types.GET_ADMIN_COURSELIST;

    const apicourseListRequest=axios.get(url,config);
    return(dispatch)=>{
        return apicourseListRequest.then(({data})=>{
            dispatch({type:dispatchType, apiResult: data});
        }).catch((error)=>{
          if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }
           throw(error);
        });
    }
};

let EventcourseList=(token)=>{
    const url=SERVICE_URLS.GET_COURSE_OBJECT;
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apiCourseRequest = axios.get(url,config);
  return(dispatch) => {
         return apiCourseRequest.then(({data})=>{
           dispatch({type:types.GET_COURSELIST ,apiResult:data});

         }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
            toastr.error(error);
          }
           throw(error);

         });
     }
}
let getCourseObject = (courseId, token) =>{
   const url = SERVICE_URLS.GET_COURSE_OBJECT + courseId + '/?format=json';
   var config = {
        headers: {'Authorization':'Token '+token}
   };
const apiCourseRequest = axios.get(url, config);
return(dispatch) => {
        return apiCourseRequest.then(({data})=>{
          
          dispatch({type:types.GET_SELECTED_COURSE,apiResult:data});
          return data;
        }).catch((error)=>{
          if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }
            throw(error);
        });
    }
}



let getEventCourseObject = (courseId, token) =>{
   const url = SERVICE_URLS.GET_COURSE_OBJECT + courseId + '/?format=json';
   var config = {
        headers: {'Authorization':'Token '+token}
   };
const apiCourseRequest = axios.get(url, config);
return(dispatch) => {
        return apiCourseRequest.then(({data})=>{
          return data.course;
        }).catch((error)=>{
           if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }
           throw(error);

        });
    }
}
let getCurrentEventsDetailsList = (token,id) =>{

    const currentEventListUrl=SERVICE_URLS.EVENTLIST_COURSE + id +'/events/upcoming?format=json';
    var config = {
    headers: {'Authorization':'Token '+token}
    };

    const apiRequest = axios.get(currentEventListUrl, config);
    return(dispatch)=>{
        return apiRequest.then(({data})=>{
          
            dispatch({type:types.GET_COURSE_UEVENTLIST,apiResult:data});
        }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
              toastr.error(error);
                }
           throw(error);

        });
    }
}
let getPastEventsDetailsList = (token,id) =>{

    const currentEventListUrl=SERVICE_URLS.EVENTLIST_COURSE_PAST + id +'/events/past?format=json';
    var config = {
    headers: {'Authorization':'Token '+token}
    };

    const apiRequest = axios.get(currentEventListUrl, config);
    return(dispatch)=>{
        return apiRequest.then(({data})=>{
            dispatch({type:types.GET_COURSE_PEVENTLIST,apiResult:data});
        }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
              toastr.error(error);
                }
           throw(error);

        });
    }
}
let groupList=(token, id)=>{

    const url=SERVICE_URLS.GET_COURSE_GROUPS_LIST+ id +'/groups/?format=json';
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apigroupDetailsRequest=axios.get(url,config);

    return(dispatch)=>{
        return apigroupDetailsRequest.then(({data})=>{
            dispatch({type:types.GET_COURSE_GROUPS,apiResult:data});
        }).catch((error)=>{
         if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }
           throw(error);

        });
    }
};

let updateCourseDetails = (token, formData, id) =>{
  const url = SERVICE_URLS.GET_COURSE_GROUPS_LIST + id + "/edit";
  var config = {
    headers: {'Authorization':'Token '+token}
  };

  const apiUpdateCourseRequest =  axios.post(url, formData, config);
    return(dispatch)=>{
    return apiUpdateCourseRequest.then(({data})=>{
   
      }).catch((error)=>{
          throw(error);
      });
  }
};

let editCourseList=(token)=>{
    const url=SERVICE_URLS.GET_COURSE_OBJECT+'admin-courses';
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apicourseListRequest=axios.get(url,config);

    return(dispatch)=>{
        return apicourseListRequest.then(({data})=>{
           dispatch({type:types.GET_EDIT_COURSE,apiResult:data});
        }).catch((error)=>{
          if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }
           throw(error);

        });
    }
};

export {courseList, getCourseObject, searchCourses, unFollowCourse, EventcourseList,
 getEventCourseObject, getCurrentEventsDetailsList, getPastEventsDetailsList, groupList,
 updateCourseDetails, editCourseList, getAdminCourseList, groupCourseList};
