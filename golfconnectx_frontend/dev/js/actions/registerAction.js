import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';

import axios from 'axios';
import toastr from 'toastr';
let registerUser=(data)=>{

    const url=SERVICE_URLS.REGISTER_API;
    const apiSignupRequest= axios.post(url,data);
    return(dispatch)=>{
      return apiSignupRequest.then(({data})=>{
            toastr.success("User Account Created Successfully");
            dispatch({type:types.LOGIN_USER, apiResult:data});
            return data;
        }).catch((error)=>{

          if (error.response) {
            toastr.error(error.response.data.email[0]);
            throw(error);
          }
        });
    }
};




export {registerUser};
