import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {IMG_CONSTANT} from '../constants/application.constants';
import {saveGroupDetails} from '../actions/addGroupAction';
import {groupCourseList} from '../actions/courseListAction';
var serialize = require('form-serialize');
import {Cropper} from 'react-image-cropper';
import {SERVICE_URLS} from '../constants/serviceUrl';


import {getGolfConnectXmembers} from '../actions/friendsAction.js';
import {addOrRemoveGroupMemebrs} from '../actions/groupListAction';
import Select from 'react-select';


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
              cropImageSrc:"",
              cropImageWidth: 945
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
               that.setState({groupImageObject: data });
               that.setState({groupsImage: data.image , isShowCropper:false});
             },
             error: function(){
                console.log("Error");
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
        let  other = {city:'', created_by:1, created_on:'', id:"-1", is_premium:true, name:'Other', state:''};
        this.props.groupCourseList(this.props.activeUser.token).then(()=>{
            let courseList = this.props.getCourseList;
            courseList.unshift(other);
            this.setState({getCourseslist:courseList});
        }).catch((error)=>{
        });
         this.props.getGolfConnectXmembers(this.props.activeUser.token).then(()=>{
                   this.setState({friends:this.props.friends.Members});
         }).catch((error)=>{
            console.log("Error", error);
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
         console.log("Error", error);
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
    this.setState({cropImageSrc: _img, isShowCropper: false});
    }

    onImageChange(e){
      let files;
      if (e.dataTransfer) {
        files = e.dataTransfer.files;
      } else if (e.target) {
        files = e.target.files;
      }
      const reader = new FileReader();
      reader.onload = () => {
          this.setState({cropImageSrc: reader.result});
      };
      reader.readAsDataURL(files[0]);
      this.setState({isShowCropper:true});
    }

    handleCropChange(values){
    if(values.width>=945){
        this.setState({cropImageWidth: values.width});
      }else{
          this.setState({cropImageWidth: 945});
      }
  }

    render(){
       if(_.size(this.state.getCourseslist)>0){
         return(<div className="scrollAndHeight">
            <div className="AddGroup">
        <div className="editgrpimg">
            {(_.size(this.state.groupImageObject)>0)?(<span>{(this.state.groupImageObject.height>=240 && this.state.groupImageObject.width>=1152)?(<img src={'http://' + this.state.cropImageSrc} className="coverimg" />):(<div className="">
                  <img className="hero__background"  />
                  <center><img className="hero__image"  src={'http://' + this.state.groupsImage} /></center>
             </div>)}</span>):(<img className="hero__image"  src={imgPath+"coverimg.png"} />)}
            <div className="addgrpimg col-sm-3">

                <button className="btn btn-default addgrp"  >
                <span className="glyphicon glyphicon-pencil glyph1"></span> Add Group Image
                </button>
                <input ref="file" id="file" type="file" name="file" onChange={this.onImageChange.bind(this)} className="upload-file form-control btnUploadPhoto cursor-pointer" accept="image/*" />

            </div>



                <div className="captionDiv">
                <span className="imgtag"></span>

            </div>
         </div>
          {(this.state.isShowCropper) && (<div className="col-sm-12">
                                    <div className="col-sm-6">
                                    <Cropper  src={this.state.cropImageSrc} ref="cropper" width={this.state.cropImageWidth} height={103} fixedRatio={false} allowNewSelection={false}
                                      onChange={values => this.handleCropChange(values)} />
                                    <br/>
                                    <input type="button"  className=" btn btnSecondary" value="Upload" onClick={this.uploadFile.bind(this)}/>
                                    <input type="button" className=" btn btnSecondary" value="Cancel"  onClick={this.onCacelCrop.bind(this)}/>
                     </div> </div>)}
            <div id="accordion" role="tablist" aria-multiselectable="true" className={this.state.isShowCropper?'display-none':'zeroPad col-sm-12 accordionPanel'}>

  <form className="card" id="addGroupForm" method="post" onClick={this.plusminusToggle}>
    <div className="card-header cardDiv cursor-pointer" role="tab" id="headingOne" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne" onClick={this.changeIcon}>
      <h5 className="mb-0 titleclass">
       Add Group
          <span id="headingOneSpan" className={ (this.state.togClass == false?"fr":"glyphicon glyphicon-minus fr")} >
            </span>
      </h5>
    </div>

    <div id="collapseOne" className="collapse in pdng15px" role="tabpanel" aria-labelledby="headingOne">
      <div className="card-block">

       <div>
          <div className="form-group row">
            <label htmlFor="example-text-input" className="col-xs-2 col-form-label">Group Name:<span className="txtRed">*</span></label>
            <div className="col-sm-9">
            <input className="form-control" maxLength="200" type="text" id="example-text-input"  name="name" onChange={this.onRequired.bind(this)}/>
            {this.state.errName}
            </div>
           </div>
           <div className="form-group row">
            <label htmlFor="example-text-input" className="col-xs-2 col-form-label">Home Course:<span className="txtRed">*</span></label>
            <div className="col-sm-9">
                {(_.size(this.state.getCourseslist)>0)?(<Select
                  name="course"
                  value={this.state.selectedValue} labelKey="name" valueKey="id"
                  options={this.state.getCourseslist}
                  onChange={this.onFieldChange} />):(<span></span>)}
            </div>
           </div>
           <div className="form-group row">
            <label htmlFor="example-text-input" className="col-xs-2 col-form-label">Description:<span className="txtRed">*</span></label>
            <div className="col-sm-9">
            <textarea className="form-control" maxLength="500" id="example-text-input" name="description" onChange={this.onRequired.bind(this)}/>
            {this.state.errDesc}
            </div>
           </div>
           <div className="form-group row">
               <label htmlFor="example-text-input" className="col-xs-2 col-form-label">Private Group:</label>
               <label className="switch">
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
