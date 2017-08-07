import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';

import axios from 'axios';
import toastr from 'toastr';

let likePost = (token, id) =>{
  const url = SERVICE_URLS.LIKE_POST + id + '/like';

  var config = {
    headers: {'Authorization':'Token '+token}
  };

  const apiLikeOrDislikeRequest = axios.get(url, config);
  return(dispatch)=>{
    return apiLikeOrDislikeRequest.then(({data})=>{

      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}

let addOrRemoveAdmin = (token, id, admins) =>{
  const url = SERVICE_URLS.GET_GROUP_POSTS_LIST + id +  '/add-admin/';
  var config = {
    headers: {'Authorization':'Token '+token}
  };

  const apiaddOrRemoveMemebrsRequest = axios.post(url, { admins: admins }, config);
  return(dispatch)=>{
    return apiaddOrRemoveMemebrsRequest.then(({data})=>{
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}

let addOrRemoveGroupMemebrs = (token, id, members,useremails) =>{
  const url = SERVICE_URLS.GET_GROUP_POSTS_LIST + id +  '/add-member/';
  var config = {
    headers: {'Authorization':'Token '+token}
  };
  const apiaddOrRemoveMemebrsRequest =  axios.post(url, { members,useremails }, config);
  return(dispatch)=>{
    return apiaddOrRemoveMemebrsRequest.then(({data})=>{
      toastr.success("Members Request Sent Successfully");
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}


let getGroupMembers = (token, id) =>{
  const url = SERVICE_URLS.GET_GROUP_POSTS_LIST + id +  '/add-member/';
  var config = {
    headers: {'Authorization':'Token '+token}
  };
  const apiaddOrRemoveMemebrsRequest =  axios.get(url, config);
  return(dispatch)=>{
    return apiaddOrRemoveMemebrsRequest.then(({data})=>{
        dispatch({type:types.GET_GOLF_MEMBERS,apiResult:data});
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}



let addOrRemoveMemebrs = (token, id, members) =>{
  const url = SERVICE_URLS.GET_GROUP_POSTS_LIST + id +  '/remove-member/';
  var config = {
    headers: {'Authorization':'Token '+token}
  };
  const apiaddOrRemoveMemebrsRequest =  axios.post(url, { members: members }, config);
  return(dispatch)=>{
    return apiaddOrRemoveMemebrsRequest.then(({data})=>{
               
                  dispatch({type:types.GET_GROUP_ADMINS_LIST,apiResult:data.admins});
                  dispatch({type:types.GET_GROUP_MEMBERS_LIST,apiResult:data.members});
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}


let getGroupAdminsList = (id, token)=>{
    const url=SERVICE_URLS.GET_GROUP_MEMBERS_LIST+id+ '/admins/?format=json'
    var config = {
    headers: {'Authorization':'Token '+token}
  };
  const apigroupMembersListRequest=axios.get(url,config);

  return(dispatch)=>{
      return apigroupMembersListRequest.then(({data})=>{
        
          dispatch({type:types.GET_GROUP_ADMINS_LIST,apiResult:data});
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}



let getGroupMembersList = (id, token)=>{
    const url=SERVICE_URLS.GET_GROUP_MEMBERS_LIST+id+ '/members/?format=json'
    var config = {
    headers: {'Authorization':'Token '+token}
  };
  const apigroupMembersListRequest=axios.get(url,config);

  return(dispatch)=>{
      return apigroupMembersListRequest.then(({data})=>{
          dispatch({type:types.GET_GROUP_MEMBERS_LIST,apiResult:data});
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}

let addNewPost = (id, token, title,images)=>{
  
 
    const url=SERVICE_URLS.ADD_GROUP_NEW_POST+id+ '/posts'
    var config = {
    headers: {'Authorization':'Token '+token}
  };

  const apigroupPostRequest = axios.post(url, { title: title, images:images }, config);

  return(dispatch)=>{
      return apigroupPostRequest.then(({data})=>{
        toastr.success("Post Added Successfully");
        //dispatch({type:types.GET_GROUP_POSTS_LIST,apiResult:data});
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}
let addComment=(id,token,body, images)=>{

  const url=SERVICE_URLS.ADD_NEW_COMMENT + id + '/comments/';
 
   var config = {
    headers: {'Authorization':'Token '+token}
  };
   const apigroupCommentRequest = axios.post(url, { body: body,images:images}, config);
    return(dispatch)=>{
      return apigroupCommentRequest.then(({data})=>{
       
        toastr.success("Comment Added Successfully");
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}
let getGroupPostsList = (id, token)=>{
    const url=SERVICE_URLS.GET_GROUP_POSTS_LIST+id+ '/posts/?format=json'
    var config = {
    headers: {'Authorization':'Token '+token}
  };
  const apigroupMembersListRequest=axios.get(url,config);
  return(dispatch)=>{
      return apigroupMembersListRequest.then(({data})=>{
          dispatch({type:types.GET_GROUP_POSTS_LIST,apiResult:data});
      }).catch((error)=>{
          if(error == "Error: Request failed with status code 401"){
         this.context.router.push('/');
        }  
      });
  }
}

let getGroupFilesList = (id, token)=>{
    const url=SERVICE_URLS.GET_GROUP_POSTS_LIST+id+ '/files/?format=json'
    var config = {
    headers: {'Authorization':'Token '+token}
  };
  const apigroupMembersListRequest=axios.get(url,config);

  return(dispatch)=>{
      return apigroupMembersListRequest.then(({data})=>{
         
          dispatch({type:types.GET_GROUP_FILES_LIST,apiResult:data});
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}


let searchGroupMembers = (token, keyword, groupId) =>{
  const url = SERVICE_URLS.SEARCH_GROUP_MEMBERS + groupId + '/members/search/?format=json' + '&kw=' + keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiFriendsRequest = axios.get(url, config);
return(dispatch) => {
       return apiFriendsRequest.then(({data})=>{
         dispatch({type:types.GET_GROUP_MEMBERS_LIST,apiResult:data});
       }).catch((error)=>{
         toastr.error(error);
           throw(error);
       });
   }
}

let searchaddMembers=(token, keyword, groupId)=>{
   const url = SERVICE_URLS.SEARCH_ADD_MEMBERS + groupId + '/add-search-member/?format=json' + '&kw=' + keyword ;
  var config = {
       headers: {'Authorization':'Token '+token}
  };

const apiFriendsRequest = axios.get(url, config);
return(dispatch) => {
       return apiFriendsRequest.then(({data})=>{
         dispatch({type:types.GET_GOLF_MEMBERS,apiResult:data});
       }).catch((error)=>{
         toastr.error(error);
           throw(error);
       });
   }
}
let groupList=(token)=>{
    const url=SERVICE_URLS.GET_GROUPS_NEW_LIST;
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apigroupDetailsRequest=axios.get(url,config);

    return(dispatch)=>{
        return apigroupDetailsRequest.then(({data})=>{
            dispatch({type:types.GET_GROUPS,apiResult:data});
        }).catch((error)=>{
         if(error != "Error: Request failed with status code 401"){
          toastr.error(error);
          }   
           throw(error);  
     
        });
    }
};
let oldgroupList=(token)=>{
    const url=SERVICE_URLS.GETGROUPS_API;
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apigroupDetailsRequest=axios.get(url,config);

    return(dispatch)=>{
        return apigroupDetailsRequest.then(({data})=>{
           
            return data;
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
};

let groupDetails=(groupId,token)=>{
    const url=SERVICE_URLS.GETGROUP_DETAILS+groupId+'/?format=json';
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apigroupSelectedRequest=axios.get(url,config);

    return(dispatch)=>{
        return apigroupSelectedRequest.then(({data})=>{
            dispatch({type:types.GET_GROUP_DETAILS,apiResult:data});
        }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
            toastr.error(error);
          }   
           throw(error); 
        });
    }
};

let deleteGroup=(groupId,token)=>{
    const url=SERVICE_URLS.GETGROUP_DETAILS+groupId+'/?format=json';
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apigroupDeleteRequest=axios.delete(url,config);

    return(dispatch)=>{
        return apigroupDeleteRequest.then(()=>{
            toastr.success("Group Deleted Successfully");
            return;
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
};


let getGroupsGallery = (token, groupId) =>{
  const url=SERVICE_URLS.GETGROUP_DETAILS+groupId+'/gallery/?format=json';
  var config = {
  headers: {'Authorization':'Token '+token}
  };
  const apigroupGalleryRequest=axios.get(url,config);
  return(dispatch)=>{
      return apigroupGalleryRequest.then(({data})=>{

          dispatch({type:types.GET_GROUP_GALLERY_LIST,apiResult:data});
      }).catch((error)=>{
          throw(error);
      });
  }
}


let  leaveGroup = (token, groupId) =>{
  const url=SERVICE_URLS.GETGROUP_DETAILS+groupId+'/leave-group/?format=json';
  var config = {
  headers: {'Authorization':'Token '+token}
  };
  const apiLeaveGroupRequest=axios.get(url,config);
  return(dispatch)=>{
      return apiLeaveGroupRequest.then(({data})=>{
          toastr.success(data.message);
          return;
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}

let editGroupInfo  = (token, groupId, description) =>{

  const url=SERVICE_URLS.GETGROUP_DETAILS + groupId + '/edit-info/';

  var config = {
  headers: {'Authorization':'Token '+token}
  };

  const apiEditGroupInfoRequest = axios.put(url, { description: description }, config);
  return(dispatch)=>{
      return apiEditGroupInfoRequest.then(({data})=>{
          return;
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}
let getCurrentEventsDetailsList = (token,id) =>{
 
  
    const currentEventListUrl=SERVICE_URLS.EVENTLIST_GROUP + id +'/events/?format=json';
    var config = {
    headers: {'Authorization':'Token '+token}
    };
 
    const apiRequest = axios.get(currentEventListUrl, config);
    return(dispatch)=>{
        return apiRequest.then(({data})=>{
            dispatch({type:types.GET_GROUP_EVENTLIST,apiResult:data});
        }).catch((error)=>{
            if(error != "Error: Request failed with status code 401"){
              toastr.error(error);
                }   
           throw(error);  
     
        });
    }
}

let RequestGroup = (token, groupId) =>{
 
  const url = SERVICE_URLS.REQUEST_FOR_GROUP+groupId+'/request-membership';
  var config = {
       headers: {'Authorization':'Token '+token}
  };

  const apiGroupRequest = axios.get(url, config);
  return(dispatch) => {
          return apiGroupRequest.then(({data})=>{
            if(data.request_status){
            
            toastr.success(data.response_message);
          }
            else{
            toastr.error(data.response_message);
          }
          }).catch((error)=>{
            toastr.error(error);
              throw(error);
          });
      }
    }
let createEvents=(formData, token, id)=>{
  
    const url=SERVICE_URLS.CREATEEVENT_GROUP+id+'/create-event';
     var config = {headers: {'Authorization':'Token '+token}};

    const apiCreateEventRequest = axios.post(url, formData, config);
    return(dispatch)=>{
      return apiCreateEventRequest.then(({data})=>{
       
        toastr.success("Event Created Succefully");
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
  }
};
let inviteViaEmail = (token, groupId, useremails) =>{
    
  const url = SERVICE_URLS.REQUEST_FOR_GROUP + groupId +  '/send-invite-via-mail/';
  var config = {
    headers: {'Authorization':'Token '+token}
  };
  const apieventInvitiesRequest =  axios.post(url, { useremails: useremails }, config);
  return(dispatch)=>{
    return apieventInvitiesRequest.then(({data})=>{
      toastr.success("Invitation Sent Successfully");
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}
let deleteGroupGallery=(imageId,token)=>{
    const url=SERVICE_URLS.DELETE_GROUP_IMAGE+imageId;
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apigroupDeleteRequest=axios.get(url,config);

    return(dispatch)=>{
        return apigroupDeleteRequest.then(()=>{
            toastr.success("Image Deleted Successfully");
            return;
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
};
let deleteGroupFile=(fileId,token)=>{
    const url=SERVICE_URLS.DELETE_GROUP_FILE+fileId;
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apigroupDeleteRequest=axios.get(url,config);

    return(dispatch)=>{
        return apigroupDeleteRequest.then(()=>{
            toastr.success("File Deleted Successfully");
            return;
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
};

let deletePostPhoto=(token, imageId)=>{
    const url=SERVICE_URLS.DELETE_POST_PHOTO+imageId +'/delete-photo';
    var config = {
    headers: {'Authorization':'Token '+token}
};
    const apigroupDeleteRequest=axios.delete(url,config);

    return(dispatch)=>{
        return apigroupDeleteRequest.then(()=>{
            toastr.success("Image Deleted Successfully");
            return;
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
};
export {groupList, groupDetails, oldgroupList, getGroupMembersList, searchGroupMembers , 
  addComment, getGroupPostsList, addNewPost, addOrRemoveMemebrs, getGroupAdminsList, addOrRemoveAdmin, 
  deleteGroup, getGroupsGallery, leaveGroup, editGroupInfo, getGroupFilesList, addOrRemoveGroupMemebrs,
   likePost, getGroupMembers, searchaddMembers, getCurrentEventsDetailsList, RequestGroup, createEvents, 
   inviteViaEmail, deleteGroupGallery, deleteGroupFile, deletePostPhoto};
