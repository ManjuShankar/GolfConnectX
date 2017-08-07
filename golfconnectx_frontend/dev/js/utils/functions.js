let getFormSerializedData = (formId) =>{
  return $("#"+ formId).serializeArray();
}

let isExistObj = (field) =>{
  if(field!=undefined && field!=null){
    return true;
  }else{
    return false;
  }
}

export {getFormSerializedData, isExistObj};
