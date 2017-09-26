import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {isValidImage} from "../utils/Validation";
import {IMG_CONSTANT} from '../constants/application.constants';
import {saveGroupDetails} from '../actions/addGroupAction';
import {groupCourseList} from '../actions/courseListAction';
var serialize = require('form-serialize');
import {Cropper} from 'react-image-cropper';
import {SERVICE_URLS} from '../constants/serviceUrl';


import {getGolfConnectXmembers} from '../actions/friendsAction.js';
import {addOrRemoveGroupMemebrs} from '../actions/groupListAction';
import Select from 'react-select';
import Spinner from 'react-spinner';

let imgPath=IMG_CONSTANT.IMAGE_PATH;
class AddGroup extends Component{
    constructor(props,context)
    {
        super(props,context);
        this.state={
              getCourseslist: [],
              SaveGroup:{},
              friends: [],
              newGroup: {},
              groupsImage: imgPath+"coverimg.png",
              groupImageObject:{},
              groupName : "", desc :"",
              errName:"", errDesc: "", buttonDisabled: true,
              selectedValue:'',
              togClass:false,
              isShowCropper:false,
              isCropper:false,
              cropImageSrc:"",
              cropImageWidth: 945, ajaxCallInProgress:false
            };

    this.onFieldChange=this.onFieldChange.bind(this);
    this.uploadFile=this.uploadFile.bind(this);
  }
    onFieldChange(e){
        if(e!=null){
          this.setState({selectedValue:e.id});
       }else{
         this.setState({selectedValue:''});
       }
    }
    srcToFile(src, fileName, mimeType){
             return (fetch(src)
                 .then(function(res){return res.arrayBuffer();})
                 .then(function(buf){return new File([buf], fileName, {type:mimeType});})
             );
    }

    uploadFile(e) {
         var that = this;
         let srcFile = this.refs.cropper.crop();
         let token = this.props.activeUser.token;
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
               
               that.setState({groupImageObject: data,groupsImage: data.image , isShowCropper:false, isCropper:false });
               that.refs.file.value="";
             },
             error: function(){

             }
         });
         e.preventDefault();
        });
     }

     onGroupDetailsSave (e){
       this.setState({
            buttonDisabled:true
       });
       document.getElementsByName(e.target.name).disabled = true;
       let form = document.querySelector('#addGroupForm');
       let formData = serialize(form, { hash: true });

       if(formData.course=="-1"){
         _.set(formData, 'course', null);
       }

       if(_.size(this.state.groupImageObject)>0){
         _.set(formData, 'cover_image', this.state.groupImageObject.id);
       }


             this.props.saveGroupDetails(formData, this.props.activeUser.token).then((data)=>{

             this.setState({SaveGroup:this.props.getgroupList.groups});

        this.context.router.push("/groups");
         }).catch((error)=>{
           document.getElementsByName(e.target.name).disabled = false;
         });
     }
    componentDidMount() {
      $('.menu').parent().removeClass('active');
      $('#group').parent().addClass('active');
   }
   componentWillMount(){
       this.setState({ajaxCallInProgress:true});
        let  other = {city:'', created_by:1, created_on:'', id:"-1", is_premium:true, name:'Other', state:''};
        this.props.groupCourseList(this.props.activeUser.token).then(()=>{
            let courseList = this.props.getCourseList;
            courseList.unshift(other);
            this.setState({getCourseslist:courseList});
            this.setState({ajaxCallInProgress:false});
        }).catch((error)=>{
            this.setState({ajaxCallInProgress:false});
        });
         this.props.getGolfConnectXmembers(this.props.activeUser.token).then(()=>{
                   this.setState({friends:this.props.friends.Members});
         }).catch((error)=>{

      });
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
        $("#sec2").trigger("click");
        $("#headingTwo").trigger("click");
}

     changeIcon2(){
        $('#headingTwoSpan').toggleClass('glyphicon-plus').toggleClass('glyphicon-minus');
        $("#sec2").trigger("click")
     }

     addOrRemoveMembers(){
       let members=[];
       $("#addOrRemoveMemebrs input:checkbox:checked").each(function() {
           members.push(_.toInteger(this.id));
       });

       this.props.addOrRemoveGroupMemebrs(this.props.activeUser.token, this.state.newGroup.id, members).then(()=>{
         this.context.router.push('/groups');
       }).catch((error)=>{

       });
     }
     /****/
     onRequired(e){
         if(e.target.name == "name"){
             if(e.target.value == ""){
                 this.setState({
                        groupName : "",
                        errName : (<span className="err-msg">Please Enter Group Name:</span>),
                        buttonDisabled : true
                 });
             }
                 else{
                    this.setState({
                        groupName : e.target.value,
                        errName : "",
                        buttonDisabled : false
                 });
                 }
         }
         if(e.target.name == "description"){
             if(e.target.value == ""){
                 this.setState({
                        desc : "",
                        errDesc : (<span className="err-msg">Please tell us Something about your Group:</span>),
                        buttonDisabled : true
                 });
             }
                 else{
                    this.setState({
                        desc : e.target.value,
                        errDesc : "",
                        buttonDisabled : false
                 });
                 }
         }

     }

    onCacelCrop(){
    let _img = 'http://' + this.state.groupsImage;
    this.setState({cropImageSrc: _img, isShowCropper: false, isCropper:false});
    this.refs.file.value="";
    }

    onImageChange(e){
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

       var that=this;
       let _URL = window.URL || window.webkitURL;
       var file, img;
     
        if(e.target.files.length>0){
        if((file = e.target.files[0])) {
            img = new Image();
            
            img.onload = function () {
         
            if( (this.height>280 || this.height<300) && this.width>1200){
            
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
         this.refs.file.value = "";
      }
      }
    }

    uploadFileAsRealImage(urlImage,imgtype,file){

		          let typeNmbr = imgtype;
             
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

                            
			    that.setState({groupImageObject: data });
                            that.setState({groupsImage: data.image });
					               },
                        error: function(){
                        that.setState({isShowCropper:false, isCropper:false});

                      }
              });
         }else{
           toastr.error('Upload Valid Image');
         }
    }
    getFileExtension(name){
       var found = name.lastIndexOf('.') + 1;
       return (parseInt(found) > 0 ? name.substr(found) : "");
     }



    handleCropChange(values){
    if(values.width>=945){
        this.setState({cropImageWidth: values.width});
      }else{
          this.setState({cropImageWidth: 945});
      }
  }
hideCropper(){
  this.setState({
    isShowCropper : false, isCropper:false
  });
}
    render(){
       return(<div className="scrollAndHeight">
           {this.state.ajaxCallInProgress?(<div className="mt25pc"><Spinner /></div>):(<div className="AddGroup">
        <div className="editgrpimg col-sm-12 zeroPad">
            
              {(_.size(this.state.groupImageObject)>0)?(<div>
                  
                  <center>  <img className="hero__image"  src={'http://' + this.state.groupsImage} />  </center>
                  </div>) : (<img className="hero__image"  src={imgPath+"GolfConnectx_GroupPhoto_1200x280.png"} />) }
                <div className="addgrpimg col-sm-12 col-xs-12 col-md-12 col-lg-12">
                     <img src="/assets/img/GolfConnectx_EditPhoto_Button.png" className="addgrp" />              
                <input ref="file" id="file" type="file" name="file" onClick={this.hideCropper.bind(this)} onChange={this.onImageChange.bind(this)} className="upload-file form-control btnUploadPhoto cursor-pointer hgt50px" accept="image/*" />

            </div>



                <div className="captionDiv dsplyNone">
                <span className="imgtag"></span>

            </div>
         </div>
          {(this.state.isShowCropper) && ( <div> <div className="col-sm-12 overflowCropper">
                                    <div className="cropperImg">
                                    <Cropper  src={this.state.cropImageSrc} ref="cropper" width={1200} height={280} fixedRatio={false} allowNewSelection={false}
                                      onChange={values => this.handleCropChange(values)} />
                                    </div>
                                    </div>
                                    <input type="button"  className=" btn btnSecondary" value="Upload" onClick={this.uploadFile.bind(this)}/>
                                    <input type="button" className=" btn btnSecondary" value="Cancel"  onClick={this.onCacelCrop.bind(this)}/>
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
            <div id="accordion" role="tablist" aria-multiselectable="true" className={(this.state.isShowCropper || this.state.isCropper)?'display-none':'zeroPad col-sm-12 accordionPanel'}>

  <form className="card" id="addGroupForm" method="post" onClick={this.plusminusToggle}>
    <div className="card-header cardDiv cursor-pointer" role="tab" id="headingOne" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne" onClick={this.changeIcon}>
      <h5 className="mb-0 titleclass dsplyNone">
       Add Group
          <span id="headingOneSpan" className={ (this.state.togClass == false?"fr":"glyphicon glyphicon-minus fr")} >
            </span>
      </h5>
    </div>

    <div id="collapseOne" className="collapse in pdng15px" role="tabpanel" aria-labelledby="headingOne">
      <div className="card-block">

       <div>
          <div className="form-group row">
            <label htmlFor="example-text-input" className="col-xs-12 col-sm-2 col-form-label">Group Name:<span className="txtRed">*</span></label>
            <div className="col-sm-9 col-xs-12">
            <input className="form-control" maxLength="200" type="text" id="example-text-input"  name="name" onChange={this.onRequired.bind(this)}/>
            {this.state.errName}
            </div>
           </div>
           <div className="form-group row">
            <label htmlFor="example-text-input" className="col-xs-12 col-sm-2 col-form-label">Home Course:<span className="txtRed">*</span></label>
            <div className="col-sm-9 col-xs-12">
                {(_.size(this.state.getCourseslist)>0)?(<Select
                  name="course"
                  value={this.state.selectedValue} labelKey="name" valueKey="id"
                  options={this.state.getCourseslist}
                  onChange={this.onFieldChange} />):(<span></span>)}
            </div>
           </div>
           <div className="form-group row">
            <label htmlFor="example-text-input" className="col-xs-12 col-sm-2 col-form-label">Description:<span className="txtRed">*</span></label>
            <div className="col-sm-9 col-xs-12">
            <textarea className="form-control" maxLength="500" id="example-text-input" name="description" onChange={this.onRequired.bind(this)}/>
            {this.state.errDesc}
            </div>
           </div>
           <div className="form-group row">
               <label htmlFor="example-text-input" className="col-xs-7 col-sm-2 col-form-label">Private Group:</label>
               <label className="switch col-xs-5">
            <input type="checkbox" name="is_private"/>
            <div className="slider round"></div>
               </label>
           </div>


           <div className="form-group row">
                    <input name="btnSave" id="btnSave" ref="btnSave" type="button" className=" btn Savebtn" value="Save" onClick={this.onGroupDetailsSave.bind(this)} disabled={this.state.buttonDisabled || !this.state.groupName || !this.state.desc || !this.state.selectedValue}/>
            </div>
        </div>
      </div>
    </div>

  </form>
  {/*{(this.state.newGroup!=undefined && this.state.newGroup!=null && _.size(this.state.newGroup)>0 && this.state.newGroup.id!=0)?(<div className="card">
    <div className="card-header cardDiv cursor-pointer" role="tab" id="headingTwo" onClick={this.changeIcon2}>
      <h5 className="mb-0 titleclass collapsed" id="sec2" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo" >

          Add Members
       <span id="headingTwoSpan" className="glyphicon glyphicon-minus fr" >
            </span>
      </h5>
    </div>
    <div id="collapseTwo" className="collapse in" role="tabpanel" aria-labelledby="headingTwo">
    <form id="addOrRemoveMemebrs" className="card-block" onClick={this.plusminusToggle}>
        <div className="form-group row">
            <div className="col-sm-3">
               <span className="spanclass"> Add/Remove Member:</span>
            <input type="button" onClick={this.addOrRemoveMembers.bind(this)} className=" Savebtn adminSave" value="Save"/>
            </div>
            <div className="col-sm-9">
            {_.size(this.state.friends)>0  && this.state.friends.map((item, i) => {
            return <div key={i}>
                    <div className="col-sm-1 sliderswitch">
                      <label className="switch">
                          <input id={item.id} type="checkbox" defaultChecked={false} disabled={(this.props.activeUser!=undefined && this.props.activeUser!=null && this.props.activeUser.id==item.id)?true:false}/>
                            <div className="slider round"></div>
                      </label>
                    </div>
                    <div className="col-sm-3">
                        <img src={'http://'+item.profile_image_url} className="adminimg"></img>
                        <span className="ml5px">{item.last_name + ' ' + item.first_name}</span>
                    </div>
                </div>
            })}
            </div>
          </div>
    </form>
    </div>

  </div>):(<div></div>)}*/}
</div>
        </div>)}
           </div>
            );
         
    }
}

AddGroup.contextTypes = {
  router: React.PropTypes.object.isRequired
};


function mapStateToProps(state) {
    return {
        getCourseList: state.getCourses,
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
        getgroupList:state.getgroupList,
        friends: state.friends
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({groupCourseList, saveGroupDetails, getGolfConnectXmembers,
      addOrRemoveGroupMemebrs}, dispatch);


}

export default  connect(mapStateToProps, matchDispatchToProps)(AddGroup);
