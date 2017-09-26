import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import {isValidImage} from "../utils/Validation";
import {IMG_CONSTANT} from '../constants/application.constants';
import {editGroupDetails} from '../actions/addGroupAction';
import {courseList,groupCourseList} from '../actions/courseListAction';
import {Cropper} from 'react-image-cropper';
import {groupList, groupDetails, addOrRemoveMemebrs, getGroupAdminsList, addOrRemoveAdmin, deleteGroup} from '../actions/groupListAction';
var serialize = require('form-serialize');
import Select from 'react-select';
import {isExistObj} from '../utils/functions';
import {SERVICE_URLS} from '../constants/serviceUrl';

let imagePath=IMG_CONSTANT.IMAGE_PATH;
let paramId;

var crop = {
    x: 20,
    y: 10,
    minWidth: 725,
    width: 725,
    maxWidth: 725,
    maxHeight: 103,
    height: 103,
    minHeight: 103,
    aspect: 16/9
}

class EditGroup extends Component{
    constructor(props,context)
    {
        super(props,context);
        this.state={
          getCourseslist:Object.assign([],props.getCourseList),
          EditGroup:{},
          groupDetails: Object.assign({},props.selectedGroup),
          groupsImage:'',
          groupImageObject: {},
          isImageEdited: false,
          errName : "",errDesc : "",
          buttonDisabled1 : true, buttonDisabled2 : true,
          file: null,
          isCropper:false,
          isShowCropper: false
        };
    this.onFieldChange=this.onFieldChange.bind(this);
    this.uploadFile=this.uploadFile.bind(this);
  }

  uploadFile(e) {

         var that = this;
         let srcFile = this.refs.cropper.crop();
         let token =  this.props.activeUser.token;
         this.srcToFile(srcFile, "cropImg.png", 'image/jpg').then(function(file){
          var fd = new FormData();
          fd.append('image', file);
         $.ajax({
             url: SERVICE_URLS.URL_USED+'api/groups/upload-cover-image/',
             data: fd,
             processData: false,
             contentType: false,
             type: 'POST',
             headers:{
             'Authorization':'Token '+ token
            },
             success: function(data){

               that.setState({groupImageObject: data});
               that.setState({groupsImage: data.cover_image_thumbnail ,  isShowCropper:false,isCropper:false,buttonDisabled1:false});
               that.refs.file.value="";
               
             },
             error: function(){


             }
         });
         e.preventDefault();
         });
     }

onGroupRemoveClick(id){
  this.props.deleteGroup(id, this.props.activeUser.token).then(()=>{
    this.context.router.push('/groups');
  }).catch((error)=>{

  });
}

addOrRemoveAdmin(){
  let admins=[];
  $("#addOrRemoveAdmin input:checkbox(':checked')").each(function() {
      admins.push(_.toInteger(this.id));
  });

  this.props.addOrRemoveAdmin(this.props.activeUser.token, this.state.groupDetails.id, admins).then(()=>{
    this.props.getGroupAdminsList(paramId, this.props.activeUser.token).then(()=>{
            this.setState({groupDetails:this.props.selectedGroup});
        }).catch((error)=>{
        });
  }).catch((error)=>{

  })
  $("#sec3").click();
}


  addOrRemoveMembers(){
    let members=[];
    $("#addOrRemoveMemebrs input:checkbox:not(:checked)").each(function() {
        members.push(_.toInteger(this.id));
    });
    this.props.addOrRemoveMemebrs(this.props.activeUser.token, this.state.groupDetails.id, members).then(()=>{

       this.props.getGroupAdminsList(paramId, this.props.activeUser.token).then(()=>{
            this.setState({groupDetails:this.props.selectedGroup});
        }).catch((error)=>{
        });
    }).catch((error)=>{

    });
         $("#sec3").click();
  }
    onFieldChange(e){
      this.setState({selectedValue:e.id,
                      buttonDisabled1:false});
    }
    getGroupDetails(){
       this.props.groupDetails(this.props.selectedGroup.id, this.props.activeUser.token).then(()=>{
          if(this.props.selectedGroup.cover_image!=null){
            this.setState({groupImageObject: this.props.selectedGroup.cover_image});
            this.setState({groupsImage:(this.props.selectedGroup.cover_image.image)});

          }

        }).catch((error)=>{
        });
    }
     onGroupEditSave (){

       let form = document.querySelector('#addGroupForm');
       let formData = serialize(form, { hash: true });
       if(formData.course=="-1"){
         _.set(formData, 'course', null);
       }

        if(_.size(this.state.groupImageObject)>0){
       _.set(formData, 'cover_image', this.state.groupImageObject.id);
      }

       this.props.editGroupDetails(formData,  this.props.selectedGroup.id, this.props.activeUser.token).then(()=>{
             this.setState({EditGroup:this.props.getgroupList.editgroups,buttonDisabled1 : true});
         
            this.setState({groupDetails:this.props.getgroupList.editgroups});
         }).catch((error)=>{

         });
         $("#sec2").click();
     }
    componentDidMount() {
      $('.menu').parent().removeClass('active');
      $('#group').parent().addClass('active');
   }

   getCourseList(){
     let  other = {city:'', created_by:1, created_on:'', id:"-1", is_premium:true, name:'Other', state:''};
     this.props.groupCourseList(this.props.activeUser.token).then(()=>{
       let courseList = this.props.getCourseList;
       courseList.unshift(other);
       this.setState({getCourseslist:courseList});
     }).catch((error)=>{

     });
   }

   getGroupDetailsAPI(paramId){
     this.props.groupDetails(paramId, this.props.activeUser.token).then(()=>{
       if(this.props.selectedGroup.cover_image!=null){
         this.setState({groupImageObject: this.props.selectedGroup.cover_image});
         this.setState({groupsImage:(this.props.selectedGroup.cover_image.image)});

       }
         this.setState({groupDetails:this.props.selectedGroup});
     }).catch((error)=>{
     });
   }

    getGroupAdminsListAPI(paramId){
      this.props.getGroupAdminsList(paramId, this.props.activeUser.token).then(()=>{
          this.setState({groupDetails:this.props.selectedGroup});
      }).catch((error)=>{
      });
    }

   componentWillMount(){
        let urlPath = _.split(location.pathname, '_');
        paramId =  (_.size(urlPath)>0)?(_.toInteger(urlPath[1])):(0);
        this.getCourseList();
        this.getGroupDetailsAPI(paramId);
        this.getGroupAdminsListAPI(paramId);
        if(this.props.selectedGroup==null){
          this.setState({selectedValue:"-1"});
        }else{
          this.setState({selectedValue:this.props.selectedGroup.course.id});
       }
      }

      componentWillReceiveProps(nextProps){
        if(this.props.getCourseList!=nextProps.getCourseList)
        {
            this.setState({getCourseslist:nextProps.getCourseList});
        }
        if(this.props.selectedGroup!=nextProps.selectedGroup){
          this.setState({groupDetails:nextProps.selectedGroup});
        }
      }


 plusminusToggle(){

       $('.collapse').on('shown.bs.collapse', function(){

$(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");

}).on('hidden.bs.collapse', function(){

$(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");

});

     }



    changeIcon(){
        $('#headingOneSpan').toggleClass('glyphicon-plus').toggleClass('glyphicon-minus');
     }
     changeIcon2(){
        $('#headingTwoSpan').toggleClass('glyphicon-minus').toggleClass('glyphicon-plus');
     }
    changeIcon3(){
        $('#headingThreeSpan').toggleClass('glyphicon-minus').toggleClass('glyphicon-plus');
     }
     /*****/
     chkboxUnable(e){
        this.onRequired(e);
        if((e.target.name == "name") || (e.target.name == "course") || (e.target.name =="description") || (e.target.name == "is_private")) {

           this.setState({
           buttonDisabled1: false
          });

        }

         if(e.target.name == "addMember") {
         this.setState({
           buttonDisabled2: false
           });
         }
     }

     onRequired(e){
       if(e.target.name=="name"){
         if(e.target.value == ""){
           this.setState({
              errName : (<span className="err-msgEditGrp">Please Enter Group Name:</span>),
              buttonDisabled1 : true
           });
         }
         else{
           this.setState({
              errName : "",
              buttonDisabled1 : false
           });
         }
       }
       if(e.target.name=="description"){
         if(e.target.value == ""){
           this.setState({
              errDesc : (<span className="err-msgEditGrp">Please tell something about your Group</span>),
              buttonDisabled1 : true
           });
         }
         else{
           this.setState({
              errDesc : "",
              buttonDisabled1 : false
           });
         }
       }
     }
     /*****/
onImageChange(e){
      // let files;
      // if (e.dataTransfer) {
      //   files = e.dataTransfer.files;
      // } else if (e.target) {
      //   files = e.target.files;
      // }
      // const reader = new FileReader();
      // reader.onload = () => {
      //     this.setState({cropImageSrc: reader.result});
      // };
      // reader.readAsDataURL(files[0]);
      // this.setState({isShowCropper:true});
      var that=this;
       let _URL = window.URL || window.webkitURL;
       var file, img;
     
        if(e.target.files.length>0){
        if((file = e.target.files[0])) {
            img = new Image();
            img.onload = function () {
           
            if((this.height>280 && this.width>1200)){
              that.setState({cropImageSrc: img.src, isShowCropper:true});
            }
           else if(this.height>300 && this.width<1200){
            that.setState({cropImageSrc:img, isCropper:true});
            
          }
          
           else{
              that.uploadFileAsRealImage(SERVICE_URLS.URL_USED + 'api/groups/upload-cover-image/',1,file);
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
					              	  that.setState({groupImageObject: data });
                            that.setState({groupsImage: data.cover_image_thumbnail,buttonDisabled1:false});
					               },
                        error: function(){
                        that.setState({isShowCropper:false,isCropper:false});

                      }
              });
         }else{
           toastr.error('Upload a valid Image');
         }
    }

getFileExtension(name){
       var found = name.lastIndexOf('.') + 1;
       return (parseInt(found) > 0 ? name.substr(found) : "");
     }

onCacelCrop(){
    let _img = 'http://' + this.state.groupsImage;
    this.setState({cropImageSrc: _img, isShowCropper: false,isCropper:false});
    this.refs.file.value="";
  }

  handleCropChange(values){
    if(values.width>=945){
        this.setState({cropImageWidth: values.width});
      }else{
          this.setState({cropImageWidth: 945});
        ///this.setState({cropImageWidth: 945});
      }
  }
srcToFile(src, fileName, mimeType){
             return (fetch(src)
                 .then(function(res){return res.arrayBuffer();})
                 .then(function(buf){return new File([buf], fileName, {type:mimeType});})
             );
    }
hideCropper(){
  this.setState({
    isShowCropper : false, isCropper:false
  });
}
    render()
    {

        let imgPath=IMG_CONSTANT.IMAGE_PATH;
       
       if(_.size(this.state.getCourseslist)>0){
         return(<div className="EditGroupDiv">
            <div className="AddGroup">
        <div className="editgrpimg">
            {(this.state.groupDetails.cover_image!=undefined && this.state.groupDetails.cover_image!=null && this.state.isImageEdited==false && _.size(this.state.groupDetails.cover_image)>0)?(<div> <img src={(this.state.groupsImage != null && this.state.groupsImage != undefined)?('http://' + this.state.groupsImage):('http://'+ this.state.groupDetails.cover_image.image)} className="coverimg"/></div>):(<div><img  src={imgPath+"GolfConnectx_GroupPhoto_1200x280.png"} className="coverimg" /></div>)}
            <div className="addgrpimg col-sm-12 col-xs-12 col-md-12 col-lg-12">

                {/*<div className="editeventImg addgrp"  >
                <span className="glyphicon glyphicon-pencil glyph1"></span> Edit Group Image
                </div>*/}
                        <img src="/assets/img/GolfConnectx_EditPhoto_Button.png" className="addgrp" />
                        <input ref="file" id="file" type="file" name="file" onChange={this.onImageChange.bind(this)} onClick={this.hideCropper.bind(this)} className="cursor-pointer upload-file form-control btnUploadPhoto wd56pc hgt50px" accept="image/*" />
              </div>
   



                <div className="captionDiv">
                <span className="imgtag">{_.size(this.state.groupDetails.members)} Members</span>

            </div>
         </div>
         {/*<input type="button" onClick={this.testFun.bind(this)} value="test" />*/}
{(this.state.isShowCropper) && (<div> <div className="col-sm-12 overflowCropper">
                                    <div className="cropperImg">
                                         <Cropper  src={this.state.cropImageSrc} ref="cropper" width={1200} height={280} fixedRatio={false} allowNewSelection={false}
                                         onChange={values => this.handleCropChange(values)} />
                                    </div>
                                    </div>
                                    <input type="button"  className="fleft btn btnSecondary" value="Upload" onClick={this.uploadFile.bind(this)}/>
                                    <input type="button" className="fleft btn btnSecondary" value="Cancel"  onClick={this.onCacelCrop.bind(this)}/>
                        </div>)}
  {(this.state.isCropper) && ( <div className="overflowCropper"> <div className="col-sm-12">
                                    <div className="cropperImgVertical">
                                    <Cropper  src={this.state.cropImageSrc.src} ref="cropper" width={this.state.cropImageSrc.width} height={280}   fixedRatio={false} allowNewSelection={false}
                                      onChange={values => this.handleCropChange(values)} />
                                    <input type="button"  className=" btn btnSecondary" value="Upload" onClick={this.uploadFile.bind(this)}/>
                                    <input type="button" className=" btn btnSecondary" value="Cancel"  onClick={this.onCacelCrop.bind(this)}/>
                                    </div>
                                    </div>
                                    
                                    
                      </div>)}                      
            <div className={(this.state.isShowCropper ||  this.state.isCropper)?'display-none':''}>
            <div id="accordion" role="tablist" aria-multiselectable="true" className="zeroPad col-sm-12 accordionPanel" onClick={this.plusminusToggle}>

  <form className="panel panel-default" id="addGroupForm" method="post" >
    <div className="header cardDiv" role="tab" id="headingOne" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne" onClick={this.changeIcon}>
      <h5 className="mb-0 titleclass">
       Edit Group
          <span id="headingOneSpan" className="glyphicon glyphicon-minus fr" >
            </span>
      </h5>
    </div>

    <div id="collapseOne" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
      <div className="card-block pl1pc">
       <div>
          <div className="form-group row">
            <label htmlFor="example-text-input" maxLength="200" className="col-xs-2 col-form-label nameInGroup">Group Name:<span className="txtRed">*</span></label>
            <div className="col-sm-9">
            <input className="form-control" type="text" id="example-text-input" onChange={this.chkboxUnable.bind(this)} ref="name" name="name" defaultValue={this.props.selectedGroup.name}/>
            {this.state.errName}
            </div>
           </div>
           <div className="form-group row">
            <label htmlFor="example-text-input" className="col-xs-2 col-form-label nameInGroup">Home Course:<span className="txtRed">*</span></label>
            <div className="col-sm-9">

             
                {(_.size(this.state.getCourseslist)>0)?(<Select
                  name="course"
                  value={this.state.selectedValue} labelKey="name" valueKey="id"
                  options={this.state.getCourseslist}
                  onChange={this.onFieldChange} defaultValue={(this.props.selectedGroup.course!=null)?(this.props.selectedGroup.course.id):("-1")} /> ):(<span></span>)}

            </div>
           </div>
           <div className="form-group row">
            <label htmlFor="example-text-input" maxLength="500" className="col-xs-2 col-form-label">Description:<span className="txtRed">*</span></label>
            <div className="col-sm-9">
            <textarea className="form-control" id="example-text-input" ref="description"  name="description" defaultValue={this.props.selectedGroup.description} onChange={this.chkboxUnable.bind(this)}/>
            {this.state.errDesc}
            </div>
           </div>
           <div className="form-group row">
               <label htmlFor="example-text-input" className="col-xs-3 col-form-label nameInGroup">Private Group:</label>
               <label className="switch">
            <input type="checkbox" name="is_private"  defaultChecked={this.props.selectedGroup.is_private} onChange={this.chkboxUnable.bind(this)}/>
            <div className="slider round"></div>
               </label>
           </div>


           <div className="form-group row">
                    <input type="button" className="btn Savebtn" value="Save" onClick={this.onGroupEditSave.bind(this)} disabled={this.state.buttonDisabled1 || this.state.errDesc || this.state.errName}/>
            </div>
        </div>
      </div>
    </div>

  </form>
  <div className="panel panel-default">
    <div className="header cardDiv" role="tab" id="headingTwo" onClick={this.changeIcon2}>
      <h5 className="mb-0 titleclass collapsed" id="sec2" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo" >

          Edit/Remove Members
       <span id="headingTwoSpan" className="glyphicon glyphicon-plus fr" >
            </span>
      </h5>
    </div>
    <div id="collapseTwo" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
      <form id="addOrRemoveMemebrs" className="card-block">
          <div className="form-group row">
                  <div className="col-sm-12 col-md-12 ">
                 <span className="spanclass"> Add/Remove Member:</span>
              <input type="button" onClick={this.addOrRemoveMembers.bind(this)} className="btn Savebtn adminSave" value="Save" disabled={this.state.buttonDisabled2} />
              </div>
                  <div className="col-sm-4 col-xs-6 col-md-4 col-lg-3">
             {isExistObj(this.state.groupDetails) && isExistObj(this.state.groupDetails.members)  && _.size(this.state.groupDetails.members)>0  && this.state.groupDetails.members.map((item, i) => {
              return <div key={i}>
                      <div className="col-sm-4 col-xs-2 col-md-3 col-lg-3 sliderswitch">
                        <label className="switch mt16pc">
                            <input id={item.id} type="checkbox" name="addMember" defaultChecked={true} disabled={(this.props.activeUser.id==item.id)?true:false} onChange={this.chkboxUnable.bind(this)}/>
                              <div className="slider round"></div>
                        </label>
                      </div>
                      <div className="col-sm-6 col-xs-2 col-md-6 col-lg-6 wdthAuto ">
                          <img src={'http://'+item.profile_image_url} className="adminimg"></img>
                          <span className="ml5px">{_.truncate(_.trim(item.last_name + ', ' + item.first_name),{
                            'length': 8,
                        'separator': ' '})}</span>
                      </div>
                  </div>
              })}
              </div>
            </div>
      </form>
    </div>
  </div>
 <div className="panel panel-default">
    <div className="header cardDiv" role="tab" id="headingThree" onClick={this.changeIcon3}>
      <h5 className="mb-0 titleclass collapsed" id="sec3" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">

          Add Admin
       <span id="headingThreeSpan" className="glyphicon glyphicon-plus fr" >
            </span>
      </h5>
    </div>
    <div id="collapseThree" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
      <form id="addOrRemoveAdmin" className="card-block">
          <div className="form-group row">
              <div className="col-sm-12 col-xs-12">
                 <span className="spanclass"> Add/Remove Admin:</span>
              <input type="button" onClick={this.addOrRemoveAdmin.bind(this)} className=" Savebtn adminSave" value="Save"/>

              </div>
              <div className="col-sm-4 col-md-4 col-lg-3 col-xs-6">
              { isExistObj(this.state.groupDetails) && _.has(this.state.groupDetails, 'admins') && isExistObj(this.state.groupDetails.admins) &&  _.size(this.state.groupDetails.admins)>0  && this.state.groupDetails.admins.map((item, i) => {

              return <div key={i}>
                      <div className="col-sm-4 col-md-3 col-lg-3 sliderswitch">
                        <label className="switch mt16pc">{/*Check for one Count*/}
                            <input id={item.id} type="checkbox" defaultChecked={item.is_admin} disabled={(this.props.activeUser.id==item.id)?true:false} />{/*disabled={(this.state.groupDetails.admins_count==1)?true:false}*/}
                              <div className="slider round"></div>
                        </label>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-6 wdthAuto dsplyFlwRoot pdlftryt0px">
                          <img src={'http://'+item.profile_image_url} className="adminimg"></img>
                          <span className="ml5px">{_.truncate(_.trim(item.last_name + ', ' + item.first_name),{
                            'length': 8,
                        'separator': ' '})}</span>
                      </div>
                  </div>
              })}
              </div>
            </div>
      </form>
    </div></div>
    <input type="button" className="btnDelete" onClick={this.onGroupRemoveClick.bind(this, this.state.groupDetails.id)} value="Delete Group" />
  </div>
</div>
        </div>
           </div>
            );
         }

          else {

            return(
              <div>no data</div>
          );
         }
    }
}

EditGroup.contextTypes = {
  router: React.PropTypes.object.isRequired
};


function mapStateToProps(state) {
    return {
        getCourseList: state.getCourses,
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
        selectedGroup:state.selectedGroup,
        getgroupList:state.getgroupList
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({groupCourseList,courseList, editGroupDetails, groupDetails, addOrRemoveMemebrs, getGroupAdminsList, addOrRemoveAdmin, deleteGroup}, dispatch);


}

export default  connect(mapStateToProps, matchDispatchToProps)(EditGroup);
