import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import _ from 'lodash';
import Spinner from 'react-spinner';
import toastr from 'toastr';
import {isValidEmail} from '../utils/Validation';
import {isValidImage} from "../utils/Validation";
import {Cropper} from 'react-image-cropper';
import {SERVICE_URLS} from '../constants/serviceUrl';
import {getCourseObject, searchCourses, updateCourseDetails, getAdminCourseList} from '../actions/courseListAction';
var serialize = require('form-serialize');

class EditCourses extends React.Component {
  constructor(props,context){
      super(props,context);
      this.state={
            getCourseslist:[],
            courseDetails:{},
            pageNumber:1,
            lastScrollPos:0,
            ajaxCallInProgress:false,  courseImage:'', ImageObject:'',
            isShowCropper : false,
            isCropper : false,
            cropImageSrc : "",
            present_Id : {},
            courseName : ""
            
      };
      let _paramId = _.toInteger(this.props.params.id);
      $('#course_'+_paramId).addClass(" in");
    }

componentWillMount(){
    this.getCourseListData();
  }


getCourseListData(pageNumber=0){
  this.props.getAdminCourseList(this.props.activeUser.token).then(()=>{
    this.setState({getCourseslist:this.props.getCourseList});
    this.setState({ajaxCallInProgress:false});
  }).catch((error)=>{

  });
  }


      onSubmitForm(id){
       let name=(id+"_name");
       let nameBody = document.getElementById(name).value;

       let email =(id+"_email");
       let emailBody = document.getElementById(email).value;

       let isValidMail = isValidEmail(emailBody);


       let phone =(id+"_phone");
       let phoneBody = document.getElementById(phone).value;

       let address =(id+"_address");
       let addressBody = document.getElementById(address).value;

       let city =(id+"_city");
       let cityBody = document.getElementById(city).value;

       let zipcode =(id+"_zipcode");
       let zipBody = document.getElementById(zipcode).value;

       let cinfo =(id+"_cinfo");
       let infoBody = document.getElementById(cinfo).value;

      if(nameBody == ""){
      $("#"+name).focus();
       }

       else if(emailBody=="" || isValidMail == false ){
         $("#"+email).focus();
       }

       else if(phoneBody==""){
         $("#"+phone).focus();
       }

        else if(addressBody=="" ){
         $("#"+address).focus();
       }

        else if(cityBody==""){
         $("#"+city).focus();
       }

       else if(zipBody==""){
         $("#"+zipcode).focus();
       }

       else if(infoBody==""){
         $("#"+cinfo).focus();
       }
    else{
        let formId=document.querySelector('#editCourseForm_'+id);
        let form = formId;
        let formData = serialize(form, { hash: true });
         let innerDescValue = document.getElementById(cinfo).innerHTML.replace(new RegExp('\r?\n','g'), '<br />');
          _.set(formData, 'description', innerDescValue);
        this.props.updateCourseDetails(this.props.activeUser.token, formData, id).then(()=>{
          toastr.success("Course Details Updated Successfully");
        }).catch((error)=>{

        });
        }
      }

  onCancelForm(id){
      let c_id =  "#accordian" + id;
     $(c_id).trigger("click");
     console.log(c_id);
  }


      uploadFile(ids,e) {
           e.preventDefault();
           let id = this.state.present_Id;
           var that = this;
           let srcFile = this.refs.cropper.crop();
           let token = this.props.activeUser.token;
           let file = 'file_'+id ;
                this.srcToFile(srcFile, "cropImg.png", 'image/jpg').then(function(file){
                var fd = new FormData();
                fd.append('image', file);


         $.ajax({
             url: SERVICE_URLS.URL_USED+'api/courses/'+id+'/upload-course-cover-image/',
             data: fd,
             processData: false,
             contentType: false,
             type: 'POST',
             headers:{
             'Authorization':'Token '+ token
            },
             success: function(data){
               that.setState({ImageObject: data});
               that.setState({courseImage: ('http://' +  data.image),isShowCropper:false,isCropper:false});
                   that.getCourseListData();
             },
             error: function(error){
             }
         });

                });
       }

plusminusToggle(cId){
      $('.collapse').not('#course_'+ cId).removeClass("in");
      $('#course_'+ cId).toggleClass(" in");
      $(".temp").removeClass("glyphicon-minus").addClass("glyphicon-plus");

      if($('#course_'+ cId).hasClass("in")){
        $("#toggle_"+ cId).removeClass("glyphicon-plus").addClass("glyphicon-minus");
      }else{
        $("#toggle_"+ cId).removeClass("glyphicon-minus").addClass("glyphicon-plus");
      }
}

onRequired(id){


}
   getFileExtension(name){
       var found = name.lastIndexOf('.') + 1;
       return (parseInt(found) > 0 ? name.substr(found) : "");
     }

onImageChange(c_name,e){

      // let files;
      // if (e.dataTransfer) {
      //   files = e.dataTransfer.files[0];
      // } else if (e.target) {
      //   files = e.target.files[0];
      // }
      // const reader = new FileReader();
      // reader.onload = () => {
      //     this.setState({cropImageSrc: reader.result});
      // };
      // reader.readAsDataURL(files);
      // this.setState({isShowCropper:true});
       console.log("Name",c_name);
       var that=this;
       let _URL = window.URL || window.webkitURL;
       var file, img;
       let id = this.state.present_Id;
     
        if(e.target.files.length>0){
        if((file = e.target.files[0])) {
            img = new Image();
            img.onload = function () {
           
            if((this.height>180 && this.width>680)){
              that.setState({cropImageSrc: img.src, isShowCropper:true,courseName : c_name});
            }
      
           else if(this.height>180 && this.width<680){
            that.setState({cropImageSrc:img, isCropper:true,courseName : c_name});    
          }
          
           else{
              that.uploadFileAsRealImage(SERVICE_URLS.URL_USED + 'api/courses/'+id+'/upload-course-cover-image/',1,file);
              }
         };
         img.src = _URL.createObjectURL(file);
        }
      }

    }
uploadFileAsRealImage(urlImage,imgtype,file){
      
		          let typeNmbr = imgtype;
              // let file = document.getElementById('file').files[0];
              var fd = new FormData();
              var that = this;
              let fileObj = file;
              let token = that.props.activeUser.token;
              let fileExtention = this.getFileExtension(fileObj.name);
                 if(isValidImage(fileExtention)){
                  fd.append('image', fileObj);
                  $.ajax({
                      url: urlImage,
                      data: fd,
                      processData: false,
                      contentType: false,
                      type: 'POST',
                      headers:{
                        'Authorization':'Token '+ token
                      },
                      success: function(data){
                            //that.setState({eventsImage: data, eventsImageObj:(typeNmbr != null && typeNmbr == 1?data.image:data.thumbnail), editeventImg:(typeNmbr != null && typeNmbr == 1?data.image:data.thumbnail), cropImageSrc: 'http://' + data.image, isShowCropper:false, isImageCropped:false});
					              	  // that.setState({groupImageObject: data });
                            // that.setState({groupsImage: data.cover_image_thumbnail});
                            that.setState({ImageObject: data});
                            that.setState({courseImage: ('http://' +  data.image),isShowCropper:false,isCropper:false});
                            that.getCourseListData();
					               },
                        error: function(){
                        that.setState({isShowCropper:false,isCropper:false});

                      }
              });
         }else{
           toastr.error('Upload a valid Image');
         }
    }
  onCacelCrop(){
    let _img = 'http://' + this.state.profileImage;
    this.setState({cropImageSrc: _img, isShowCropper: false,isCropper:false});
}
handleCropChange(values){
    if(values.width>=945){
        this.setState({cropImageWidth: values.width});
      }else{
          this.setState({cropImageWidth: 945});
      }
  }

srcToFile(src, fileName, mimeType){
             return (fetch(src)
                 .then(function(res){return res.arrayBuffer();})
                 .then(function(buf){return new File([buf], fileName, {type:mimeType});})
             );
    }

    clickFun(id){
      this.setState({
            present_Id : id
        });

    }
   render() {
          let _paramId = _.toInteger(this.props.params.id);
          $('#course_'+_paramId).addClass(" in");
          $("#toggle_"+ _paramId).removeClass("glyphicon-plus").addClass("glyphicon-minus");

       return(
         <div className="edit_Courses">
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <div className="editHeader col-sm-12 zeroPad">
                    <h3>Edit Courses</h3>
                  </div>
                  {(this.state.isShowCropper || this.state.isCropper)?<div>{this.state.courseName}</div>:""}
                   {(this.state.isShowCropper) && (<div><div className="col-sm-12 overflowCropper">
                                   <div className="cropperImg">
                                    <Cropper  src={this.state.cropImageSrc} ref="cropper" width={680} height={180} fixedRatio={false} allowNewSelection={false}
                                      onChange={values => this.handleCropChange(values)} />
                                    </div>
                                    </div>
                                    <input type="button"  className=" btn btnSecondary" value="Upload" onClick={this.uploadFile.bind(this,this.state.pres_id)}/>
                                    <input type="button" className=" btn btnSecondary" value="Cancel" onClick={this.onCacelCrop.bind(this)}/>
                      </div>)}
                    {(this.state.isCropper) && ( <div className="overflowCropper"> <div className="col-sm-12">
                                    <div className="cropperImgVertical">
                                    <Cropper  src={this.state.cropImageSrc.src} ref="cropper" width={this.state.cropImageSrc.width} height={180}   fixedRatio={false} allowNewSelection={false}
                                      onChange={values => this.handleCropChange(values)} />
                                    <input type="button"  className=" btn btnSecondary" value="Upload" onClick={this.uploadFile.bind(this,event)}/>
                                    <input type="button" className=" btn btnSecondary" value="Cancel"  onClick={this.onCacelCrop.bind(this)}/>
                                    </div>
                                    </div>
                                    
                                    
                      </div>)} 
                  
                  
                  <div className={(this.state.isShowCropper || this.state.isCropper)?'display-none':''}>
                  <div className="toggle_classes mt2pc col-sm-12 zeroPad">


                    {_.size(this.state.getCourseslist)>0 && this.state.getCourseslist.map((course, index)=>{
                          return(<div key={index}>

                          <form id={"editCourseForm_"+course.id} name="editCourseForm" ref="editCourseForm" action=""   method="post" encType="multipart/form-data">
                          <div className="panel-group">
                         <div className="toggle_one panel">
                           <div className="courseName"  id={'accordian'+course.id} onClick={this.plusminusToggle.bind(this, course.id)}>

                            <h4 className="panel-title m0px ">
                                <a>{course.name}</a>
                                <span id={"toggle_"+ course.id} className="glyphicon glyphicon-plus fr temp"></span>
                            </h4>
                          </div>
                            <div id={"course_"+ course.id} className="panel-collapse collapse ">
                              <div className="course_content-one">
                                <div className="col-sm-12 mt4pc zeroPad">

                                  <div className="col-sm-6 zeroPad">
                                    <div className="form-group col-sm-12 zeroPad">
                                      <div className="col-sm-3">
                                        <label htmlFor="name">Course Name</label>
                                      </div>
                                      <div className="col-sm-9">
                                        <input type="text" id={course.id+"_name"}  defaultValue={course.name} onChange={this.onRequired.bind(this,"name"+course.id)} placeholder="enter course name" className="form-control" name="name"/>
                                      </div>
                                    </div>
                                    <div className="form-group col-sm-12 zeroPad">
                                      <div className="col-sm-3">
                                        <label htmlFor="course_name">Contact Email</label>
                                      </div>
                                      <div className="col-sm-9">
                                        <input type="email" id={course.id+"_email"} defaultValue={course.email} placeholder="enter email id" className="form-control" ref={course.id+"_email"} name="email" />
                                      </div>
                                  </div>
                                  <div className="form-group col-sm-12 zeroPad">
                                    <div className="col-sm-3">
                                      <label htmlFor="course_name">Contact Phone</label>
                                    </div>
                                    <div className="col-sm-9">
                                      <input type="text" id={course.id+"_phone"} defaultValue={course.phone} placeholder="enter phone no." className="form-control" name="phone"/>
                                    </div>
                                  </div>
                                  <div className="form-group col-sm-12 zeroPad">
                                    <div className="col-sm-3">
                                      <label htmlFor="course_name">Address</label>
                                    </div>
                                    <div className="col-sm-9">
                                      <input type="text" id={course.id+"_address"} defaultValue={course.address1} placeholder="enter address" className="form-control" name="address1"/>
                                    </div>
                                </div>
                                  <div className="form-group col-sm-12 zeroPad">
                                    <div className="col-sm-3">
                                      <label htmlFor="course_name">City</label>
                                    </div>
                                    <div className="col-sm-9">
                                      <input type="text" id={course.id+"_city"} defaultValue={course.city} placeholder="enter address" className="form-control" name="city"/>
                                    </div>
                                </div>
                                  <div className="form-group col-sm-12 zeroPad">
                                    <div className="col-sm-3">
                                      <label htmlFor="course_name">Zip Code</label>
                                    </div>
                                    <div className="col-sm-9">
                                      <input type="text" id={course.id+"_zipcode"} defaultValue={course.zip_code} placeholder="enter address" className="form-control" minLength="5" maxLength="5" name="zip_code" />
                                    </div>
                                </div>
                                <div className="form-group col-sm-12 zeroPad">
                                    <div className="col-sm-3">
                                      <label htmlFor="course_name">Course Info</label>
                                    </div>
                                    <div className="col-sm-9">
                                       <p id={course.id+"_cinfo"} dangerouslySetInnerHTML={{__html: course.description}} placeholder="enter course information" className="form-control hgtauto" contentEditable={true} name="description"></p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="col-sm-12 zeroPad">
                                  <div className="col-sm-12 zeroPad">
                        <img src={course.cover_image!=null?('http://'+course.cover_image.image):"/assets/img/nonPremBanner.jpg"} className={course.cover_image!=null?'hgt180px col-sm-12 zeroPad':"edit_courseImg"} />

                                  </div>
                                  <div className="col-sm-12 mt2pc">
                                      <button className="changeImg-butn"><span className="glyphicon glyphicon-pencil" />Edit Course Image</button>
                                      <input ref={"file_"+ course.id} id={"file_"+ course.id} type="file" name={"file_"+ course.id}  onClick={this.clickFun.bind(this,course.id)}  onChange={this.onImageChange.bind(this,course.name)} className="cursor-pointer form-control btnUploadPhoto mt-4pc" accept="image/*" />
                                      {/*<input ref={"file_"+ course.id} id={"file_"+ course.id} type="file" name={"file_"+ course.id}  onClick={this.clickFun.bind(this,course.id)}  onChange={this.testF.bind(this,course.name)} className="cursor-pointer form-control btnUploadPhoto mt-4pc" accept="image/*" />                                  */}
                                  </div>
                                </div>
                              </div>
                          </div>
                          <div className="buttons">
                            <input type="button" id={course.id} value="Save Changes" onClick={this.onSubmitForm.bind(this,course.id)} className="save_edit-course course_butn" />
                            <input type="button" value="Cancel" onClick={this.onCancelForm.bind(this,course.id)} className="cancel_edit-course course_butn" />
                          </div>
                        </div>
                      </div>
                      </div>
                       </div>
                       </form>


                          </div>);
                    }

                    )
                    }


              </div>
                 </div>
            </div>
         </div>
         </div>
         </div>
         );
   }
}


EditCourses.contextTypes = {
  router: React.PropTypes.object.isRequired
};


function mapStateToProps(state) {
    return {
        getCourseList: (state.adminCourses!=undefined && state.adminCourses!=null)?(state.adminCourses):([]),
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
        selectedCourse: state.selectedCourse
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({getCourseObject, searchCourses, updateCourseDetails,getAdminCourseList}, dispatch);
}

export default  connect(mapStateToProps, matchDispatchToProps)(EditCourses);
