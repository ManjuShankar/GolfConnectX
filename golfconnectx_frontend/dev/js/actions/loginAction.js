import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';

import axios from 'axios';
import toastr from 'toastr';



let userSignIn = (data) =>{
    const url=SERVICE_URLS.LOGIN_API;
    let email=data[0].value;
    let password= data[1].value;
    const apiLoginRequest = axios.post(url,{
    email,
    password
  });
    return(dispatch) => {
        return apiLoginRequest.then(({data})=>{
                sessionStorage.setItem('userDetails', JSON.stringify(data));
                dispatch({type:types.LOGIN_USER, apiResult:data});
        }).catch((error)=>{
            throw(error);
        });
    }
};


let userSignOut = (token)=>{
  const url=SERVICE_URLS.LOGOUT_API;
  var config = {
  headers: {'Authorization':'Token '+token}
 };
  const apiLogoutRequest = axios.get(url,config);

  return(dispatch) => {
    return apiLogoutRequest.then(({data})=>{
      sessionStorage.clear();
      dispatch({type:types.LOGIN_USER, apiResult:null});
    }).catch((error)=>{
        //toastr.error(error);
        throw(error);
    });
  }
}


let contactUs = (formData) =>{

  const url = SERVICE_URLS.CONTACT_US;


  const apiInviteRequest = axios.post(url, formData);
  return(dispatch)=>{

    return apiInviteRequest.then(({data})=>{

      toastr.success("Request Sent Successfully!");
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}

let EnterEmail = (formData) =>{

  const url = SERVICE_URLS.FORGOT_PASSWORD;


  const apiForgotPassword = axios.post(url, formData);
  return(dispatch)=>{

    return apiForgotPassword.then(({data})=>{
              
      
       dispatch({type:types.ENTER_EMAIL_REQUEST, apiResult:data});
      toastr.success("Request Sent Successfully!");
      }).catch((error)=>{
       
        if(error=="Error: Request failed with status code 400"){
           toastr.error("Email address does not exist!");

        }else{

        toastr.error(error);
          
        }
        throw(error);

      });
  }
}

let EnterOTP = (formData) =>{

  const url = SERVICE_URLS.ENTER_OTP;


  const apiForgotPassword = axios.post(url, formData);
  return(dispatch)=>{

    return apiForgotPassword.then(({data})=>{
       dispatch({type:types.ENTER_OTP_REQUEST, apiResult:data});
      toastr.success("Request Sent Successfully!");
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}
let ChangePassword = (formData) =>{

  const url = SERVICE_URLS.ENTER_PASSWORD;


  const apiForgotPassword = axios.post(url, formData);
  return(dispatch)=>{

    return apiForgotPassword.then(({data})=>{
       dispatch({type:types.CHANGE_PASSWORD_REQUEST, apiResult:data});
      toastr.success("Request Sent Successfully!");
      }).catch((error)=>{
        toastr.error(error);
          throw(error);
      });
  }
}

let fbSignIn = (data) =>{
   
    const url=SERVICE_URLS.FB_LOGIN;
    let email=data.email;
    let name= data.name;
    let picture=data.picture;
    let id = data.id;
    const apiLoginRequest = axios.post(url,{email, name, picture,id});
    return(dispatch) => {
        return apiLoginRequest.then(({data})=>{
        
              // /  sessionStorage.setItem('userDetails', JSON.stringify(data));
                dispatch({type:types.LOGIN_USER, apiResult:data});
        }).catch((error)=>{
            throw(error);
        });
    }
};

let facebookRegister=(data)=>{
  
    const url=SERVICE_URLS.FB_LOGIN_WITH_ZIPCODE;
    let first_name=data.first_name;
    let last_name= data.last_name;
    let email=data.email;
    let zipcode = data.zipcode;
    let fb_id = data.fb_id;  
    const api_FB_SignupRequest= axios.post(url,{first_name,last_name,email,zipcode,fb_id});
    return(dispatch)=>{
      return api_FB_SignupRequest.then(({data})=>{
           
            toastr.success("User Account using Facebook Created Succefully");
            sessionStorage.setItem('userDetails', JSON.stringify(data));
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


export {userSignIn, userSignOut, contactUs, EnterEmail, EnterOTP, ChangePassword, fbSignIn, facebookRegister};
