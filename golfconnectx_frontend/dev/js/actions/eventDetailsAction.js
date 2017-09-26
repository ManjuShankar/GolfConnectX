import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';

import axios from 'axios';
import _ from "lodash";
import toastr from 'toastr';


let getPeopleAttendeesList = (url, config)  =>{
  return axios.get(url, config);
}


let getNotAttendeesList = (url, config)  =>{
  return axios.get(url, config);
}


let getMayBeAttendeesList = (url, config)  =>{
  return axios.get(url, config);
}

let getPeopleList = (eventId, token) =>{
  const attendeeURL = SERVICE_URLS.EDITEVENT_API + eventId + '/attendees/?format=json';
  const notAttendeeURL = SERVICE_URLS.EDITEVENT_API + eventId + '/not-attendees/?format=json';
  const mayAttendeeURL = SERVICE_URLS.EDITEVENT_API + eventId + '/may-attend/?format=json';
  var config = {
       headers: {'Authorization':'Token '+token}
  };

  const apiEventsPeopleRequest = axios.all([getPeopleAttendeesList(attendeeURL, config), getNotAttendeesList(notAttendeeURL, config), getMayBeAttendeesList(mayAttendeeURL, config)]);
  return(dispatch) => {
          return apiEventsPeopleRequest.then(axios.spread(function (attendeesList, notAttendeesList, mayBeAttendeesList) {
              let  peopleList = {
                attendeesList:attendeesList.data,
                notAttendeesList:notAttendeesList.data,
                mayBeAttendeesList: mayBeAttendeesList.data
              };
              return peopleList;
        }));
      }
}

let getPostsByEventId = (eventId, token, isAllevent=false) =>{
  const url = SERVICE_URLS.EDITEVENT_API + eventId + '/posts/?format=json';
  var config = {
       headers: {'Authorization':'Token '+token}
  };
  const apiEventRequest = axios.get(url, config);
  return(dispatch) => {
       return apiEventRequest.then(({data})=>{
         if(isAllevent){
           dispatch({type:types.EVENT_ALL_POSTS, apiResult:data});
         }else{
         dispatch({type:types.EVENT_POSTS, apiResult:data});
        }
       }).catch((error)=>{
         if(error.response.status == 404){
          toastr.error("Event Doesn\'t Exist");
         }
         else if(error != "Error: Request failed with status code 401"){
         toastr.error(error);
         }
          throw(error);

       });
   }
}
let savePostsByEventId = (eventId, token, title,images) =>{
  const url = SERVICE_URLS.EDITEVENT_API + eventId + '/posts/?format=json';
  var config = {
       headers: {'Authorization':'Token '+token}
  };
  const apiEventRequest = axios.post(url, { title: title,images:images }, config);
  return(dispatch) => {
       return apiEventRequest.then(({data})=>{
        
         ///return data;
         dispatch({type:types.EVENT_POSTS, apiResult:data});
       }).catch((error)=>{
        if(error.response.status == 404){
          toastr.error("Event Doesn\'t Exist");
         }
         else if(error != "Error: Request failed with status code 401"){
         toastr.error(error);
         }
          throw(error);

       });
   }
}
let addEventComment=(id,token,body,images)=>{
  
  const url=SERVICE_URLS.ADD_NEW_COMMENT + id + '/comments/';

   var config = {
    headers: {'Authorization':'Token '+token}
  };
   const apigroupCommentRequest = axios.post(url, { body: body,images:images}, config);
    return(dispatch)=>{
      return apigroupCommentRequest.then(({data})=>{

        toastr.success("Comment added successfully");
      }).catch((error)=>{
        if(error.response.status == 404){
          toastr.error("Event Doesn't Exist");
         }
         else {
          toastr.error(error);
         }
          throw(error);
      });
  }
}
let getGalleryByEventId = (eventId, token, isAllevent=false) =>{
  const url = SERVICE_URLS.EDITEVENT_API + eventId + '/gallery/?format=json';
  var config = {
       headers: {'Authorization':'Token '+token}
  };
  const apiEventRequest = axios.get(url, config);
  return(dispatch) => {
       return apiEventRequest.then(({data})=>{
         if(isAllevent)
         {dispatch({type:types.EVENT_ALL_GALLERY, apiResult:data});}
         else
         {dispatch({type:types.EVENT_GALLERY, apiResult:data});}
       }).catch((error)=>{
        if(error.response.status == 404){
          toastr.error("Event Doesn\'t Exist");
         }
         else if(error != "Error: Request failed with status code 401"){
         toastr.error(error);
         }
          throw(error);

       });
   }
}

let getTeaTimes = (eventId, token) =>{
   const url = SERVICE_URLS.EDITEVENT_API + eventId + '/tee-time-files/?format=json';
   var config = {
        headers: {'Authorization':'Token '+token}
   };

const apiEventRequest = axios.get(url, config);
return(dispatch) => {
        return apiEventRequest.then(({data})=>{
          return data;
        }).catch((error)=>{
          if(error.response.status == 404){
            toastr.error("Event Doesn\'t Exist");
           }
           else if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }
           throw(error);

        });
    }
}

let getCurrentEvent = (eventId, token, isAllevent=false) =>{
   const url = SERVICE_URLS.GET_EVENT_OBJECT + eventId + '/?format=json';
   var config = {
        headers: {'Authorization':'Token '+token}
   };

const apiEventRequest = axios.get(url, config);
return(dispatch) => {
        return apiEventRequest.then(({data})=>{
          if(isAllevent){
              dispatch({type:types.GET_ALL_SELECTED_EVENT,apiResult:data});
          }else{
          dispatch({type:types.GET_SELECTED_EVENT,apiResult:data});
         }
        }).catch((error)=>{
          if(error.response.status == 404){
            toastr.error("Event Doesn\'t Exist");
           }
           else if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }
           throw(error);

        });
    }
}

let getAllEventsList = (token) =>{
    const currentEventListUrl=SERVICE_URLS.EVENTLIST_PUBLIC;
    var config = {
    headers: {'Authorization':'Token '+token}
    };

    const apiRequest = axios.get(SERVICE_URLS.EVENTLIST_PUBLIC, config);
    return(dispatch)=>{
        return apiRequest.then(({data})=>{
            dispatch({type:types.GET_PUBLIC_EVENTLIST,apiResult:data});
        }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
              toastr.error(error);
                }
           throw(error);

        });
    }
}

let getCurrentEventDetails = (eventId, token) =>{
 
  let id=_.toInteger(eventId);
   const url = SERVICE_URLS.GET_EVENT_OBJECT + id  + '/?format=json';
   var config = {
        headers: {'Authorization':'Token '+token}
   };

const apiEventRequest = axios.get(url, config);
return(dispatch) => {
        return apiEventRequest.then(({data})=>{
          return data;
        }).catch((error)=>{
          if(error.response.status == 404){
            toastr.error("Event Doesn\'t Exist");
           }
           else if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }
           throw(error);
        });
    }
}

let getpastEventsList = (url, conf) =>{
    return axios.get(url, conf);
}

let getcurrentEventsList = (url, conf) =>{
  return axios.get(url, conf);
}

let eventDetails=(token, id=0, eventsType="")=>{
    let currentEventListUrl, pastEventListUrl;

    if(id!=0){
      if(eventsType=="course"){
         currentEventListUrl= SERVICE_URLS.GET_COURSE_OBJECT + id + '/events/upcoming';
         pastEventListUrl = SERVICE_URLS.GET_COURSE_OBJECT + id + '/events/past';
      }
    }else{
       currentEventListUrl=SERVICE_URLS.EVENTLIST_API;
       pastEventListUrl=SERVICE_URLS.EVENTLISTPAST_API;
    }
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apiRequest = axios.all([getpastEventsList(pastEventListUrl, config), getcurrentEventsList(currentEventListUrl, config)]);
    return(dispatch)=>{
         return apiRequest.then(axios.spread(function (past, current) {
                dispatch({type:types.GET_EVENTLIST,apiResult:current.data});
                dispatch({type:types.GET_EVENTLISTPAST,apiResult:past.data});
          })).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
              toastr.error(error);
             }
            throw(error);

    });
  }
};

let getCurrentEventsDetailsList = (token) =>{
    const currentEventListUrl=SERVICE_URLS.EVENTLIST_API;
    var config = {
    headers: {'Authorization':'Token '+token}
    };

    const apiRequest = axios.get(SERVICE_URLS.EVENTLIST_API, config);
    return(dispatch)=>{
        return apiRequest.then(({data})=>{
            dispatch({type:types.GET_EVENTLIST,apiResult:data});
        }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
              toastr.error(error);
                }
           throw(error);

        });
    }
}

let getAttendeesList = (token, eventId, isAllevent=false) =>{
   
    const attendeesUrl=SERVICE_URLS.GET_ATTENDEES+eventId+'/attendees/';
    var config = {
    headers: {'Authorization':'Token '+token}
    };
   const apiRequest = axios.get(attendeesUrl, config);
    return(dispatch)=>{
        return apiRequest.then(({data})=>{
         
          if(isAllevent){
            dispatch({type:types.GET_ALL_ATTENDEES,apiResult:data});
          }else{
            dispatch({type:types.GET_ATTENDEES,apiResult:data});
          }

        }).catch((error)=>{
          if(error.response.status == 404){
            toastr.error("Event Doesn\'t Exist");
           }
           else if(error != "Error: Request failed with status code 401"){
              toastr.error(error);
                }
           throw(error);

        });
    }
}
let getMayAttendList = (token, eventId, isAllevent=false) =>{
    const attendeesUrl=SERVICE_URLS.GET_ATTENDEES+eventId+'/may-attend/';
    var config = {
    headers: {'Authorization':'Token '+token}
    };

   const apiRequest = axios.get(attendeesUrl, config);
    return(dispatch)=>{
        return apiRequest.then(({data})=>{
        
          if(isAllevent){
            dispatch({type:types.GET_ALL_MAY_ATTEND,apiResult:data});
          }else{
            dispatch({type:types.GET_MAY_ATTEND,apiResult:data});
          }
        }).catch((error)=>{
          if(error.response.status == 404){
            toastr.error("Event Doesn\'t Exist");
           }
           else if(error != "Error: Request failed with status code 401"){
              toastr.error(error);
                }
           throw(error);

        });
    }
}
let getNotAttendList = (token, eventId, isAllevent=false) =>{
    const attendeesUrl=SERVICE_URLS.GET_ATTENDEES+eventId+'/not-attendees/';
    var config = {
    headers: {'Authorization':'Token '+token}
    };

   const apiRequest = axios.get(attendeesUrl, config);
    return(dispatch)=>{
        return apiRequest.then(({data})=>{
      
          if(isAllevent){
            dispatch({type:types.GET_ALL_NOT_ATTEND,apiResult:data});
          }else{
            dispatch({type:types.GET_NOT_ATTEND,apiResult:data});
          }
        }).catch((error)=>{
          if(error.response.status == 404){
            toastr.error("Event Doesn\'t Exist");
           }
           else if(error != "Error: Request failed with status code 401"){
              toastr.error(error);
                }
           throw(error);

        });
    }
}

let calendarEvents = (token, isAllEvent=false) =>{
  let url;
    if(isAllEvent){
      url = SERVICE_URLS.PUBLIC_CALENDAR_EVENTS;
    }else{
       url = SERVICE_URLS.CALENDAR_EVENTS;
    }

  var config = {
       headers: {'Authorization':'Token '+token}
  };

  const apiCourseRequest = axios.get(url,config);
  return(dispatch) => {
           return apiCourseRequest.then(({data})=>{
            dispatch({type:types.CALENDAR_DATES ,apiResult:data});
         }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
            toastr.error(error);
          }
            throw(error);
         });
     }
}

let allcalendarEvents = (token) =>{
  const url = SERVICE_URLS.PUBLIC_CALENDAR_EVENTS;
  var config = {
       headers: {'Authorization':'Token '+token}
  };
  const apiCourseRequest = axios.get(url,config);
  return(dispatch) => {
           return apiCourseRequest.then(({data})=>{
            dispatch({type:types.PUBLIC_CALENDAR_EVENTS ,apiResult:data});
         }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
            toastr.error(error);
          }
            throw(error);
         });
     }
}

let calendarDates = (token, month, year) =>{
 const url = SERVICE_URLS.CALENDAR_EVENTS+'/?format=json'+'&month='+month+'&year='+year;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

 const apiCourseRequest = axios.get(url,config);
  return(dispatch) => {
           return apiCourseRequest.then(({data})=>{
           
             dispatch({type:types.CALENDAR_DATES ,apiResult:data});
         }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
            toastr.error(error);
          }
            throw(error);
        });
     }
}

let onDayEvents = (token, eventdate, isAllEvent=false) =>{
 let url;
 if(isAllEvent){
    url = SERVICE_URLS.PUBLIC_CALENDAR_DAY_EVENTS+'?&date='+eventdate;
 }else{
   url = SERVICE_URLS.CALENDAR_DAY_EVENTS+'?&date='+eventdate;
 }

  var config = {
       headers: {'Authorization':'Token '+token}
  };

 const apiCourseRequest = axios.get(url,config);
  return(dispatch) => {
           return apiCourseRequest.then(({data})=>{
           dispatch({type:types.CALENDAR_DAY_EVENTS ,apiResult:data});

         }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
            toastr.error(error);
          }
            throw(error);
        });
     }
}

let allonDayEvents = (token, eventdate) =>{
 const url = SERVICE_URLS.PUBLIC_CALENDAR_DAY_EVENTS+'?&date='+eventdate;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

 const apiCourseRequest = axios.get(url,config);
  return(dispatch) => {
           return apiCourseRequest.then(({data})=>{
           
           dispatch({type:types.PUBLIC_CALENDAR_DAY_EVENTS ,apiResult:data});
         }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
            toastr.error(error);
          }
            throw(error);
        });
     }
}

let getEventInvities = (token, eventId, isAllevent=false) =>{
 const url = SERVICE_URLS.REQUEST_INVITE+eventId+"/send-invite/";
  var config = {
       headers: {'Authorization':'Token '+token}
  };

 const apieventInvitiesRequest = axios.get(url,config);
  return(dispatch) => {
           return apieventInvitiesRequest.then(({data})=>{
             if(isAllevent){
               dispatch({type:types.INVITIES_ALL_LIST ,apiResult:data});
             }else{
                dispatch({type:types.INVITIES_LIST ,apiResult:data});
             }


         }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
            toastr.error(error);
          }
            throw(error);
        });
     }
}

let postInvitiesList = (token, eventId, userids) =>{
  const url = SERVICE_URLS.REQUEST_INVITE + eventId +  '/send-invite/';
  var config = {
    headers: {'Authorization':'Token '+token}
  };
  const apieventInvitiesRequest =  axios.post(url, { userids: userids }, config);
  return(dispatch)=>{
    return apieventInvitiesRequest.then(({data})=>{
      toastr.success("Invitation sent successfully");
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}

let searchInvities=(token, keyword, eventId, isAllevent=false)=>{
   const url = SERVICE_URLS.SEARCH_INVITE + eventId + '/send-invite?format=json' + '&kw=' + keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apieventInvitiesRequest = axios.get(url, config);
return(dispatch) => {
       return apieventInvitiesRequest.then(({data})=>{
         if(isAllevent){
           dispatch({type:types.SEARCH_ALL_INVITIES_LIST,apiResult:data});
         }else{
           dispatch({type:types.SEARCH_INVITIES_LIST,apiResult:data});
         }

       }).catch((error)=>{
         toastr.error(error);
           throw(error);
       });
   }
}

let inviteViaEmail = (token, eventId, useremails) =>{

  const url = SERVICE_URLS.REQUEST_INVITE + eventId +  '/send-invite-via-mail/';
  var config = {
    headers: {'Authorization':'Token '+token}
  };
  const apieventInvitiesRequest =  axios.post(url, { useremails: useremails }, config);
  return(dispatch)=>{
    return apieventInvitiesRequest.then(({data})=>{
      toastr.success("Invitation sent successfully");
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}
let deleteEventGallery=(imageId,token)=>{
    const url=SERVICE_URLS.DELETE_EVENT_IMAGE+imageId;
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apigroupDeleteRequest=axios.get(url,config);

    return(dispatch)=>{
        return apigroupDeleteRequest.then(()=>{
            toastr.success("Image deleted successfully");
            return;
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
};

let deletePost=(postId,token)=>{
    const url=SERVICE_URLS.DELETE_POSTS+postId;
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apigroupDeleteRequest=axios.delete(url,config);

    return(dispatch)=>{
        return apigroupDeleteRequest.then(()=>{
            toastr.success("Post deleted successfully");
            return;
        }).catch((error)=>{
          if(error.response.status == 404){
            toastr.error("Post Doesn\'t Exist");
           }
           else {
            toastr.error(error);}
            throw(error);
        });
    }
};
let deleteComment=(postId, commentId,token)=>{
    const url=SERVICE_URLS.DELETE_COMMENTS+postId+'/comments/'+commentId;
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apigroupDeleteRequest=axios.delete(url,config);

    return(dispatch)=>{
        return apigroupDeleteRequest.then(()=>{
            toastr.success("Comment deleted successfully");
            return;
        }).catch((error)=>{
          if(error.response.status == 404){
            toastr.error("Post Doesn\'t Exist");
           }
           else 
            {
              toastr.error(error);
            }
            throw(error);
        });
    }
};
let deleteEventFile=(fileId,token)=>{
    const url=SERVICE_URLS.DELETE_EVENT_FILE+fileId;
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apigroupDeleteRequest=axios.get(url,config);

    return(dispatch)=>{
        return apigroupDeleteRequest.then(()=>{
            toastr.success("File deleted successfully");
            return;
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
};

let getEventFile=(eventId,token, isAllevent=false)=>{
    const url=SERVICE_URLS.GET_TEETIME_FILES+  eventId +'/tee-time-files/';
   var config = {
       headers: {'Authorization':'Token '+token}
  };

const apieventInvitiesRequest = axios.get(url, config);
return(dispatch) => {
       return apieventInvitiesRequest.then(({data})=>{
         if(isAllevent){
           dispatch({type:types.GET_ALL_TEEFILES_LIST,apiResult:data});
         }else{
            dispatch({type:types.GET_TEEFILES_LIST,apiResult:data});
         }

       }).catch((error)=>{
        if(error.response.status == 404){
          toastr.error("Event Doesn't Exist");
         }
         else 
          {toastr.error(error);}
           throw(error);
       });
   }
}
let CancelRequest = (eventId, token) =>{
   const url = SERVICE_URLS.GET_EVENT_OBJECT + eventId + '/cancel-request';
   var config = {
        headers: {'Authorization':'Token '+token}
   };

const apiEventRequest = axios.get(url, config);
return(dispatch) => {
        return apiEventRequest.then(({data})=>{
         toastr.success(data.response_message);
          return data;
        }).catch((error)=>{
          if(error.response.status == 404){
            toastr.error("Event Doesn't Exist");
           }
           else if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }
           throw(error);

        });
    }
}

let onAttendingOrNotAttending = (status, eventId, token) =>{
   const url = SERVICE_URLS.GET_EVENT_OBJECT + eventId + '/attending-status/?status=' + status;
   var config = {
        headers: {'Authorization':'Token '+token}
   };
   const apiEventRequest = axios.get(url, config);
      return(dispatch) => {
        return apiEventRequest.then(({data})=>{
         
          dispatch({type: types.UPDATE_ATTENDEES_COUNT, eventID: eventId, count:5});
         toastr.success(data.response_message);
          return data;
        }).catch((error)=>{
          if(error.response.status == 404){
            toastr.error("Event Doesn't Exist");
           }
           else if(error != "Error: Request failed with status code 401"){
              toastr.error(error);
          }
           throw(error);
        });
    }
}

export {eventDetails, getCurrentEvent, getCurrentEventsDetailsList, getCurrentEventDetails, getAttendeesList,
  calendarEvents, calendarDates, onDayEvents, getTeaTimes, getPeopleList, getPostsByEventId, getGalleryByEventId,
  savePostsByEventId, addEventComment, getNotAttendList, getMayAttendList,getEventInvities, searchInvities,postInvitiesList,
  getAllEventsList, inviteViaEmail, allcalendarEvents, allonDayEvents, deleteEventGallery,
 deletePost, deleteComment, deleteEventFile, getEventFile, CancelRequest, onAttendingOrNotAttending};
