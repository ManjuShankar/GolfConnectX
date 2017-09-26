import React,{ Component } from 'react';
import _ from 'lodash';
import {EventcourseList, getEventCourseObject, courseList}  from '../../actions/courseListAction';
import {getFormSerializedData} from "../../utils/functions";
import {isValidImage} from "../../utils/Validation";
import {oldgroupList} from '../../actions/groupListAction';
var serialize = require('form-serialize');
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import Select from 'react-select';
import {Cropper} from 'react-image-cropper';
import DatePicker from 'react-datepicker';
import toastr from 'toastr';
import {SERVICE_URLS} from '../../constants/serviceUrl';
import {isExistObj} from '../../utils/functions';
import {getStates} from '../../actions/createEventAction';
class CreateEvent extends React.Component {
     constructor(props) {
       super(props);
       this.state={
           upComingeventDetail: (this.props.isCreateOrEdit=="Edit")?(this.props.upComingeventDetail):({}),
           eventsImage:(this.props.isCreateOrEdit=="Edit")?((this.props.upComingeventDetail.cover_image!=null)?(this.props.upComingeventDetail.cover_image):null):({}),
           getCourseslist:[],
           getGroupList: [],
           eventsImageObj:null,
           editeventImg:(this.props.isCreateOrEdit=="Edit")?((this.props.upComingeventDetail.cover_image!=null)?(this.props.upComingeventDetail.cover_image):null):({}),
           isExistCourseDetails: (this.props.isCreateOrEdit=="Edit")?(this.props.upComingeventDetail.venue_course_id==null?true:false):(false),
           isExistGroupDetails:(this.props.isCreateOrEdit=="Edit")?(this.props.upComingeventDetail.event_group_id!=null?true:false):(false),
           titleName: "", venueName:"", address:"", city:"", zip:"",
           errTitle:"", dateErr:"", dateInvalid1:"",
           buttonDisabled : true,   selectedValue:'', selectedName:'', other:["Other"],
           croppedImage:"",
           teaTimesList: (this.props.isCreateOrEdit=="Edit")?(this.props.teaTimesList):([]),
           cropImageWidth: 725,
           cropImageSrc: "/assets/img/GolfConnectx_EventPhoto_725x150.png",
           src: '',
           file: null,
           isShowCropper: false,
           isCropper : false,
           isImageCropped: false,
           fromDate:moment(), stateList:[], stateSelect:''
       };
        this.onFieldChange=this.onFieldChange.bind(this);
        this.uploadFile=this.uploadFile.bind(this);
        this.uploadTeatTimes=this.uploadTeatTimes.bind(this);
        this.handleCropChange=this.handleCropChange.bind(this);
    }

    onFieldChange(e){
      document.getElementsByName(e.target.name).value=e.target.value;
    }

    getFileExtension(name){
       var found = name.lastIndexOf('.') + 1;
       return (parseInt(found) > 0 ? name.substr(found) : "");
     }

     uploadTeatTimes(e) {
           e.preventDefault();
           let fileName = _.trim(document.getElementById('uploadFileName').value);
           let fileObj = document.getElementById('teatime').files[0];
           let fileExtention = this.getFileExtension(document.getElementById('teatime').files[0].name);
           let fd = new FormData();
           let that = this;
           fd.append('file', fileObj, (fileName + "." + fileExtention));
           let eventId = that.state.upComingeventDetail.id;
           $.ajax({
               url: SERVICE_URLS.URL_USED+'api/events/'+  eventId +'/tee-time-files/',
               data: fd,
               processData: false,
               contentType: false,
               type: 'POST',
               headers:{
               'Authorization':'Token '+ this.props.activeUser.token
              },
               success: function(data){
                 document.getElementById('uploadFileName').value='';
                 $('#teatime').val('');
                 $('#uploadFileModal').modal('hide');
                 that.setState({teetime_file:data.id});
                 that.props.getFiles();
               },
               error: function(){
                 document.getElementById('uploadFileName').value='';
                 $('#teatime').val('');
                 $('#uploadFileModal').modal('hide');

               }
           });

       }
       componentWillMount(){
        this.props.EventcourseList(this.props.activeUser.token).then(()=>{
           this.setState({getCourseslist:this.props.getCourseList});
        }).catch((error)=>{
        });
 this.props.getStates(this.props.activeUser.token).then(()=>{
            this.setState({stateList:this.props.eventList.stateList.states});
             
        }).catch((error)=>{
        });
        this.props.oldgroupList(this.props.activeUser.token).then((data)=>{

              this.setState({getGroupList:data});
        }).catch((error)=>{
        });
        if(this.props.isCreateOrEdit=="Edit"){

               this.setState({selectedValue:this.props.selectedEvent.venue_course_id});
               this.setState({selectedName:this.props.selectedEvent.venue});
        }

    }

    onFileUploadChangeEvnt(e){
      /*if (e.dataTransfer) {

        files = e.dataTransfer.files;

      } else if (e.target) {

        files = e.target.files;

      }*/
      var that=this;
      let _URL = window.URL || window.webkitURL;
      var file, img;
     
        if(e.target.files.length>0){
        if((file = e.target.files[0])) {
          img = new Image();
          img.onload = function () {
            if(this.height>150 && this.width>725){

            that.setState({cropImageSrc: img.src, isShowCropper:true});
           } 
           else if(this.height>150 && this.width<725 ){
             that.setState({cropImageSrc: img, isCropper :true});
           }
            else if(this.height<150 && this.width<725){

              that.uploadFileAsRealImage(SERVICE_URLS.URL_USED + 'api/events/upload-cover-image/',1,file);
            }else{
             
              that.uploadFileAsRealImage(SERVICE_URLS.URL_USED + 'api/events/upload-cover-image/',2,file);
            }
          };
            
            img.src = _URL.createObjectURL(file);
           
       }
      }
       this.refs.file.value="";
    }

    componentDidMount(){
      
      /*var that=this;
      let _URL = window.URL || window.webkitURL;
        $("#file").change(function (e) {
        var file, img;
        if ((file = this.files[0])) {
          img = new Image();
          img.onload = function () {
            if(this.height>=100 && this.width>=700){
             
              that.setState({cropImageSrc: img.src, isShowCropper:true});
            }else if(this.height<100 && this.width<700){
             
              that.uploadFileAsRealImage(SERVICE_URLS.URL_USED + 'api/events/upload-cover-image/',1);
            }else{
             
              that.uploadFileAsRealImage(SERVICE_URLS.URL_USED + 'api/events/upload-cover-image/',2);
            }
          };
          img.src = _URL.createObjectURL(file);
       }
       this.refs.file.value="";
     });*/
    }

    componentWillReceiveProps(nextProps){
        if(this.props.getCourseList!=nextProps.getCourseList){
            this.setState({getCourseslist:nextProps.getCourseList});
        }
        if(this.props.teaTimesList!=nextProps.teaTimesList){
          this.setState({teaTimesList: nextProps.teaTimesList});
        }
    }

    uploadFileAsRealImage(urlImage,imgtype,file){
      
		          let typeNmbr = imgtype;
              // let file = document.getElementById('file').files[0];
              var fd = new FormData();
              var that = this;
              let fileObj = file;
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
                        'Authorization':'Token '+ that.props.activeUser.token
                      },
                      success: function(data){
                          that.setState({eventsImage: data, eventsImageObj:data, editeventImg:data, cropImageSrc: 'http://' + data.image, isShowCropper:false,isCropper:false,isImageCropped:false});

					    },
                        error: function(){
                        that.setState({isShowCropper:false,isCropper:false});

                      }
              });
         }else{
           toastr.error('Upload a valid Image');
         }
    }

    showCourseDetails(e){
      if(e!=null){
          this.setState({selectedValue:e.id, selectedName:e.name});
           let id=e.id;
           this.props.getEventCourseObject(id, this.props.activeUser.token).then((data)=>{
              let eventDetailsUpdated = this.state.upComingeventDetail;
              eventDetailsUpdated.address1 = data.address1;
              eventDetailsUpdated.city = data.city;
              eventDetailsUpdated.zip_code = data.zip_code;
              eventDetailsUpdated.state =data.state;

              this.setState({upComingeventDetail:eventDetailsUpdated});

           }).catch((error)=>{

          });
     }else{
       let eventDetailsUpdated = this.state.upComingeventDetail;
       eventDetailsUpdated.address1 = '';
       eventDetailsUpdated.city = '';
       eventDetailsUpdated.zip_code = '';
       eventDetailsUpdated.state='';
       this.setState({selectedValue: '', upComingeventDetail:eventDetailsUpdated});
     }
  }

    onImageChange(e){
      /*let files;
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
      this.setState({isShowCropper:true});*/
      /*e.preventDefault();
      let that = this;
      let width, height;
      let _URL = window.URL || window.webkitURL;
        $("#file").change(function (e) {
        let file, img;
        if ((file = this.files[0])) {
          img = new Image();
          img.onload = function () {
            width = this.width;
            height = this.height;
        };
          img.src = _URL.createObjectURL(file);
          if(height>=100 && width>=700){
              that.setState({cropImageSrc: img.src, isShowCropper:true});
          }else{
              toastr.error('Image Height/Width Doesn\'t Match Requirement');
          }
       }
     });*/
    }

    srcToFile(src, fileName, mimeType){
             return (fetch(src)
                 .then(function(res){return res.arrayBuffer();})
                 .then(function(buf){return new File([buf], fileName, {type:mimeType});})
             );
    }

    uploadFile(e) {
              e.preventDefault();
              var that = this;
              let token = that.props.activeUser.token;
              let srcFile = this.refs.cropper.crop();
              this.srcToFile(srcFile, "cropImg.png", 'image/jpg').then(function(file){
                  var fd = new FormData();
                  fd.append('image', file);
                  $.ajax({
                      url: SERVICE_URLS.URL_USED + 'api/events/upload-cover-image/',
                      data: fd,
                      processData: false,
                      contentType: false,
                      type: 'POST',
                      headers:{
                      'Authorization':'Token '+ token
                     },
                      success: function(data){
                        that.setState({eventsImage: data,
                          eventsImageObj:data,
                          editeventImg:data,
                          cropImageSrc: 'http://' + data.image,
                          isShowCropper:false,
                          isCropper:false,
                          isImageCropped:false});
                        $('#addEventImage').modal('hide');
                      },
                      error: function(){
                          that.setState({isShowCropper:false});

                      }
                  });
              });
       }

onSubmitClick(){

    var form = document.querySelector('#eventsForm');
    var formData = serialize(form, { hash: true });
    console.log("form data",formData);
    if((this.refs.name.value == "") || (this.refs.name.value == undefined)) {
        this.refs.name.focus();
    }
    else if(this.refs.is_course.checked == true && this.refs.venue_course!=undefined && this.refs.venue_course== "-1"){
          this.refs.venue_course.focus();
    }
    else if( (this.refs.is_course.checked == true) && ((formData['venue'] == "") || (formData['venue'] == undefined)) ){
          this.refs.venue.focus();
     }

    else if( (this.refs.is_course.checked == true) &&((formData['address1'] == "") || (formData['address1'] == undefined)) ) {
        this.refs.address1.focus();
    }
    else if ( (this.refs.is_course.checked == true) && ((formData['city'] == "") || (formData['city'] == undefined))) {
        this.refs.city.focus();
    }
    else if( (this.refs.is_course.checked == true) && ((formData['zip_code'] == "") || (formData['zip_code'] == undefined)) ) {
         this.refs.zip_code.focus();
        }
        /*else if((formData['start_time'] == null) || (formData['start_time'] == undefined)){
          this.refs.start_time.focus();
        }
        else if((formData['end_time'] == null) || (formData['end_time'] == undefined)){
          this.refs.end_time.focus();
        }
        else if((formData['start_date'] == null) || (formData['start_date'] == undefined)){
          this.refs.start_date.focus();
        }
        else if((formData['end_date'] == null) || (formData['end_date'] == undefined) || this.state.dateErr ){
          this.refs.end_date.focus();
        }*/
    else if( (this.refs.is_course.checked == true) && ((formData['state'] == "") || (formData['state'] == undefined)) ) {
         this.refs.state.focus();
        }
        else if((formData['description'] == "") || (formData['description'] == undefined)){
          this.refs.description.focus();
        }
        else{
            let _fromDate = document.getElementById('start_date').value;
            let _endDate = document.getElementById('end_date').value;
            if(this.compare(_fromDate, _endDate)==1){
                toastr.error('Start date can\'t be greater than End date');
            }else{
                let stateValue=this.state.upComingeventDetail.state==null?this.state.stateSelect:this.state.upComingeventDetail.state;
                console.log("stateValue",stateValue,this.state.stateSelect);
            _.set(formData, 'state',this.refs.state.value )
            console.log("form",formData,"state",this.state.stateSelect,this.state.upComingeventDetail.state);
            _.set(formData, 'teetime_file', this.state.teetime_file);
            if(this.state.eventsImageObj!=null)
            {
              _.set(formData, 'cover_image', this.state.eventsImage.id);
            }else{
              _.set(formData, 'cover_image', null);
            }

          if(this.state.isExistCourseDetails){
              _.set(formData, 'venue_course', null);
              _.set(formData, 'is_course', !this.state.isExistCourseDetails);
          }else{
            let selectedCourseId= this.state.selectedValue;
            let selectedCourseName= this.state.selectedName;
            _.set(formData, 'venue_course', selectedCourseId);
            _.set(formData, 'venue', selectedCourseName);
            _.set(formData,'address1',this.state.upComingeventDetail.address1);
            _.set(formData,'city',this.state.upComingeventDetail.city);
            _.set(formData,'state',this.state.upComingeventDetail.state);
            _.set(formData,'zip_code',this.state.upComingeventDetail.zip_code);
            _.set(formData, 'is_course', !this.state.isExistCourseDetails);
          }

          if(this.state.isExistGroupDetails){
              let selectedGroupId=document.getElementById('group_id').value;
              _.set(formData, 'group_id', _.toInteger(selectedGroupId));
          }
          let innerDescValue = document.getElementById("description").value.replace(new RegExp('\r?\n','g'), '<br />');
          _.set(formData, 'description', innerDescValue);
          this.props.onSaveClick(formData);
        }
        
      }
    console.log("formdata",formData);
    }
handleStateChange(e){
  this.state.stateSelect=e.target.value;
    console.log("state",this.state.stateSelect,e.target.value);
}
colpseTgl(e){
    //  this.state.isExistCourseDetails = !this.state.isExistCourseDetails;
    this.setState({isExistCourseDetails:!this.state.isExistCourseDetails});
    //  if( this.refs.is_course.checked == true){
    //    let _localState=this.state.upComingeventDetail;
    //    _localState.venue='';
    //    _localState.address1='';
    //    _localState.city='';
    //    _localState.zip_code='';
    //    _localState.state='';
    //    this.refs.address1.value = "";
    //    this.refs.city.value = "";
    //    this.refs.zip_code.value = "";
    //    this.refs.state.value = "";
    //    this.setState({upComingeventDetail: _localState});
    //    console.log(this.state.upComingeventDetail);
    //  }
    //  else{
    //    this.setState({upComingeventDetail: this.props.upComingeventDetail});
    //  }
       this.state.selectedValue ="";     //selected Venue
       this.refs.address1.value = "";
       this.refs.city.value = "";
       this.refs.zip_code.value = "";
       this.state.upComingeventDetail.state = "";
     
      /*To clear data of auto load Deatails*/
       this.state.upComingeventDetail.address1 = "";
       this.state.upComingeventDetail.city ="";
       this.state.upComingeventDetail.zip_code = "";
       this.state.upComingeventDetail.state = "";
      // if(this.refs.is_course.checked == true){
      //     //let venue = document.getElementById('venue').value;
      //     //alert(venue);   
      //     this.refs.venue.value = "";
      //  }
}

groupcolapseTgl(){
  this.setState({isExistGroupDetails:!this.state.isExistGroupDetails});
}

zipCodeEvent(e) {
    const re = /[0-9]+/g;
    if ((!re.test(e.key)) || (e.target.value.length >= 7)){
        e.preventDefault();
    }
}

 dateVal(e){

     var from = $("#start_date").val();
     var to = $("#end_date").val();


    if(e.target.name== "start_date"){
        if(from != ""){
        this.setState({dateInvalid1 : ""});
    }
    else if(from < to){
      this.setState({dateInvalid1:(<span>className="color-red">Please enter a valid date</span>)});
    }
    else{
    this.setState({
            dateInvalid1 : (<span className="color-red">Please enter valid date</span>)
        });
    }
    }
    if(e.target.name == "end_date"){
    if(to != ""){
    this.setState({
            dateInvalid2 : ""
    });
    }
    else{
    this.setState({
            dateInvalid2 : (<span className="color-red">Please enter valid date</span>)
    });
    }
    }

    if((Date.parse(from) > Date.parse(to)) || this.refs.end_date.value == undefined){
     this.setState({
        dateErr : (<span className="color-red">End date should be greater than Start Date</span>)
    });
}
else{
    this.setState({
        dateErr : ""
    });
}

}

onCacelCrop(){
    let _img = (this.props.isCreateOrEdit=="Create")?("assets/img/GolfConnectx_EventPhoto_725x150.png"):('http://' + this.state.eventsImageObj.image)
    this.setState({cropImageSrc: _img, isShowCropper: false,isCropper:false});
    this.refs.file.value="";
}

compare(frmDate, toDate) {
    if (frmDate > toDate) return 1;
    else if (frmDate < toDate) return -1;
    else return 0;
}

handleChange(date, dateType){

  let _localState = this.state.upComingeventDetail;
  if(date=='start_date'){
    let _fromDate = moment(dateType._d).format("MM/DD/YYYY");
    let _endDate = document.getElementById('end_date').value;
    if(this.props.isCreateOrEdit=="Edit"){
      if(this.compare(_fromDate, _endDate)!==1){
        _localState.start_date_format = dateType;
        this.setState({upComingeventDetail: _localState});
        this.setState({fromDate:_localState.start_date_format._d});
      }else{
        toastr.error('Start date can\'t be greater than End date');
      }
    }else{
        _localState.start_date_format = dateType;
        this.setState({upComingeventDetail: _localState});
        this.setState({fromDate:_localState.start_date_format._d});
      }
    }
  else{
    let _fromDate = document.getElementById('start_date').value;
    let _endDate = moment(dateType._d).format("MM/DD/YYYY");
    if(this.props.isCreateOrEdit=="Edit"){
      if(this.compare(_fromDate, _endDate)!==1){
        _localState.end_date_format = dateType;
        this.setState({upComingeventDetail: _localState});
      }else{
        toastr.error('End date can\'t be lesser than Start date');
      }
   }else{
     _localState.end_date_format = dateType;
     this.setState({upComingeventDetail: _localState});
   }
  }
}

  handleCropChange(values){
    if(values.width>=725){
        this.setState({cropImageWidth: values.width});
      }else{
          this.setState({cropImageWidth: 725});
      }
  }

    render(){
        const {upComingeventDetail, isCreateOrEdit, onSaveClick, activeUser, isSaveInProgress, teaTimesList, people, getFiles} = this.props;
        return(
            <div>
            <form action="" method="post" id="eventsForm" name="eventsForm" ref="eventsForm"  encType="multipart/form-data" >
            <div className="col-md-9  col-sm-12 eventScroll pdtop">
            <div className="coursesContent">
            <div className="eventImage">
            {(isCreateOrEdit=="Create")?((this.state.eventsImage=='')?(<div>
              <center><img src={this.state.cropImageSrc} className="eventImg" /></center>
                    <span className={this.state.eventsImageObj.width<75?"span-btn":""}>
                      <button className="btn btn-default editeventImg"><span className="glyphicon glyphicon-pencil"></span> {this.props.isCreateOrEdit} Event Image </button>
                      <input ref="file" id="file" onChange={this.onFileUploadChangeEvnt.bind(this)}  type="file" name="file"  className="upload-file form-control" accept="image/*" />
                  </span>
                </div>):((this.state.eventsImageObj!=undefined && this.state.eventsImageObj!=null)?(
                  <div>
                  <img src={'http://' + this.state.eventsImageObj.image} className="eventImg" />
                    <span>
                    <button className="btn btn-default editeventImg"><span className="glyphicon glyphicon-pencil"></span> {this.props.isCreateOrEdit} Event Image </button>
                    <input ref="file" id="file" onChange={this.onFileUploadChangeEvnt.bind(this)}  type="file" name="file"  className="upload-file form-control" accept="image/*" />
                    </span>
                </div>
                  
            
            ):(<div><img src="/assets/img/GolfConnectx_EventPhoto_725x150.png" className="eventImg raghu" />
            <span>
                          <button className="btn btn-default editeventImg"><span className="glyphicon glyphicon-pencil"></span> {this.props.isCreateOrEdit} Event Image </button>
                          <input ref="file" id="file" onChange={this.onFileUploadChangeEvnt.bind(this)}  type="file" name="file"  className="upload-file form-control" accept="image/*" />
                       </span>
                        </div>))):((isCreateOrEdit=="Edit")?(((this.state.editeventImg!=undefined && this.state.editeventImg!=null)?(
                        <div>
                          <img className="eventImg"  src={'http://'+ this.state.editeventImg.image} />
                          <span><input className="btn btn-default editeventImg" type="button" value={this.props.isCreateOrEdit+ ' Event Image'} />
                           
                          <input ref="file" id="file" onChange={this.onFileUploadChangeEvnt.bind(this)}  type="file" name="file"  className="upload-file form-control" accept="image/*" /></span>
                          </div>
                       
                       
                  ):(<div><img src={(this.state.editeventImg!=undefined && this.state.editeventImg!=null)?(this.state.editeventImg.image):("/assets/img/GolfConnectx_EventPhoto_725x150.png")} className="eventImg" />
                        <span><input className="btn btn-default editeventImg" type="button" value={this.props.isCreateOrEdit+ ' Event Image'} />
                          
                        <input ref="file" id="file" onChange={this.onFileUploadChangeEvnt.bind(this)}  type="file" name="file"  className="upload-file form-control" accept="image/*" /></span>
                        </div>
                    ))):((<div><img src={'http://'+this.state.eventsImage} className="eventImg" />
                    <span><input className="btn btn-default editeventImg" type="button" value={this.props.isCreateOrEdit+ ' Event Image'} />
                    <span className="glyphicon glyphicon-pencil"></span>
                    <input ref="file" id="file" onChange={this.onFileUploadChangeEvnt.bind(this)}  type="file" name="file"  className="upload-file form-control" accept="image/*" /></span>
                          
                        </div>
                    )))}
            </div>
                    {(this.state.isShowCropper && <div> <div className="col-sm-12 overflowCropper">
                                     <div className="cropperImg">
                                    <Cropper  src={this.state.cropImageSrc} ref="cropper" width={this.state.cropImageWidth} height={150} fixedRatio={false} allowNewSelection={false}
                                      onChange={values => this.handleCropChange(values)} />
                                    </div>
                                    </div>
                                    <input type="button"  className=" btn btnSecondary" value="Upload" onClick={this.uploadFile.bind(this)}/>
                                    <input type="button" className=" btn btnSecondary" value="Cancel" onClick={this.onCacelCrop.bind(this)}/>
                      </div>)}
                      {(this.state.isCropper) && ( <div className="overflowCropper"> <div className="col-sm-12">
                                    <div className="cropperImgVertical">
                                    <Cropper  src={this.state.cropImageSrc.src} ref="cropper" width={this.state.cropImageSrc.width} height={150}   fixedRatio={false} allowNewSelection={false}
                                      onChange={values => this.handleCropChange(values)} />
                                    <input type="button"  className=" btn btnSecondary" value="Upload" onClick={this.uploadFile.bind(this)}/>
                                    <input type="button" className=" btn btnSecondary" value="Cancel"  onClick={this.onCacelCrop.bind(this)}/>
                                    </div>
                                    </div>
                                    
                                    
                      </div>)}

                      <div className={(this.state.isShowCropper ||  this.state.isCropper)?'display-none':''}>
                      <div className="col-sm-12">
                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label">Title:<span className="txtRed">*</span></label>
                            <div className="col-sm-10 ">
                                <input className="form-control" maxLength="100" type="text" id="example-text-input1" ref="name"  name="name" defaultValue={this.state.upComingeventDetail.name} />
                                  {this.state.errTitle}
                            </div>
                        </div>

                        {(this.state.isExistCourseDetails)?(<div><div className="form-group row mb15pcc" id="VenueDiv">
                            <label  className="col-sm-2 col-form-label">Venue:<span className="txtRed">*</span></label>
                              <div className="col-sm-10 pdl0px-1024 ">
                                <input className="form-control" maxLength="150" type="text" id="venue" ref="venue" name="venue" defaultValue={this.state.upComingeventDetail.venue}  />
                              </div>
                        </div>
						               <div className="form-group row">
                          <label  className="col-sm-3  col-xs-3 col-form-label">Location not found</label>
                            <div className="col-sm-5 col-xs-5">
                              <label  className="switch">
                                  <input type="checkbox" name="is_course" ref="is_course" defaultChecked={this.state.isExistCourseDetails} onChange={this.colpseTgl.bind(this)}/>
                                  <div className="slider round "></div>
                              </label>
                            </div>
                        </div>
                        <div className="form-group row">
                          <label  className="col-sm-2 col-form-label">Address:<span className="txtRed">*</span></label>
                          <div className="col-sm-10 pdl0px-1024">
                            <input className="form-control" maxLength="500" type="text" id="example-text-input2" ref="address1" name="address1" defaultValue={this.state.upComingeventDetail.address1}   />
                          </div>
                      </div>
                      <div className="form-group row">
                        <label  className="col-sm-2 col-form-label">City:<span className="txtRed">*</span></label>
                        <div className="col-sm-2 dateInputDiv">
                          <input className="form-control" maxLength="100" type="text" id="example-text-input3" ref="city" name="city" defaultValue={this.state.upComingeventDetail.city}  />
                        </div>
                        <div className="col-sm-2  dateLabelDiv textevent">
                          <label  className="col-sm-12 col-form-label whiteSpace">Zip code:<span className="txtRed">*</span></label>
                        </div>
                        <div className="col-sm-2  dateInputDiv ">
                          <input className="form-control" type="text" id="example-text-input4" ref="zip_code" name="zip_code" defaultValue={this.state.upComingeventDetail.zip_code} onKeyPress={this.zipCodeEvent.bind(this)}  />
                        </div>
                         <div className="col-sm-2 stateLabel">
                          <label  className="col-sm-12 col-form-label  ">State:<span className="txtRed">*</span></label>
                        </div>
                              {/*<option defaultValue={this.state.upComingeventDetail.state} value={item.value} >{this.state.upComingeventDetail.state==null?item.value:this.state.upComingeventDetail.state}</option>*/}
                        
                        <div className="col-sm-2 stateDiv ">
                          <select className="form-control" name="state" ref="state"  onChange={this.handleStateChange.bind(this)} defaultValue={this.state.upComingeventDetail.state}>
                            {isExistObj(this.state.stateList) && _.size(this.state.stateList)>0 && this.state.stateList.map((item,i)=>{
                              return(
    
                              <option defaultValue={this.state.upComingeventDetail.state} value={item.value} >{item.value}</option>

                              )
                            })}

                        </select>
                        </div>
                    </div>
                  </div>):(<div className="col-sm-12 zeroPad">
                    <div className="form-group row m0px">
                      <label  className="col-sm-2 col-form-label zeroPad">Venue:<span className="txtRed">*</span></label>
                      <div className="col-sm-10 pdl0px-1024 pl1pc">
                        <label className="col-sm-12 zeroPad mb17pcc hgt34px">

                            {(_.size(this.props.getCourseList)>0)?(<Select
                                name="venue_course"
                                value={this.state.selectedValue} labelKey="name" valueKey="id"
                                options={this.props.getCourseList}
                                ref="venue_course" id="venue_course" onChange={this.showCourseDetails.bind(this)}
                                 />):(<span></span>)}
                        </label>
                  </div>
              </div>
			  <div className="form-group row">
                          <label  className="col-sm-3  col-xs-3 col-form-label">Location not found</label>
                            <div className="col-sm-5 col-xs-5">
                              <label  className="switch">
                                  <input type="checkbox" name="is_course" ref="is_course" defaultChecked={this.state.isExistCourseDetails} onChange={this.colpseTgl.bind(this)}/>
                                  <div className="slider round "></div>
                              </label>
                            </div>
                        </div>
           <div className="form-group row">
             <label  className="col-sm-2 col-form-label">Address:<span className="txtRed">*</span></label>
             <div className="col-sm-10 ">
               <input className="form-control" maxLength="500" type="text" id="example-text-input5" ref="address1" name="address1" value={this.state.upComingeventDetail.address1} disabled/>
             </div>
           </div>
           <div className="form-group row">
               <label  className="col-sm-2 col-form-label">City:<span className="txtRed">*</span></label>
               <div className="col-sm-2 dateInputDiv">
                   <input className="form-control" maxLength="100"type="text" id="example-text-input5" ref="city" name="city" value={this.state.upComingeventDetail.city} disabled/>
               </div>
               <div className="col-sm-2  dateLabelDiv textevent">
                       <label  className="col-sm-12 col-form-label whiteSpace ">Zip code:<span className="txtRed">*</span></label>
               </div>
               <div className="col-sm-2  dateInputDiv ">
                 <input className="form-control" type="text" id="example-text-input6" name="zip_code" ref="zip_code" value={this.state.upComingeventDetail.zip_code} onKeyPress={this.zipCodeEvent.bind(this)} disabled/>
               </div>
               <div className="col-sm-2 stateLabel">
                          <label  className="col-sm-12 col-form-label">State:<span className="txtRed">*</span></label>
                        </div>
                        <div className="col-sm-2 stateDiv ">
                          <select className="form-control" name="state" ref="state" disabled >
                           {isExistObj(this.state.stateList) && _.size(this.state.stateList)>0 && this.state.stateList.map((item,i)=>{

                              return(
                              <option defaultValue={this.state.upComingeventDetail.state} value={item.value} >{this.state.upComingeventDetail.state}</option>
                              )
                            })}
                        </select>
                        </div>
            </div></div>)}

                <div className="form-group row">
            <label  className="col-sm-2 col-form-label whiteSpace">Start Date:<span className="txtRed">*</span></label>
            <div className="col-sm-2 dateInputDiv">
              <DatePicker id="start_date" ref="start_date" className="form-control" name="start_date"
                selected={moment(this.state.upComingeventDetail.start_date_format)}
                onChange={this.handleChange.bind(this, 'start_date')}  minDate={moment()} placeholderText="mm/dd/yyyy" />
            {this.state.dateInvalid1}
            </div>
                    <div className="col-sm-2 dateLabelDiv  whiteSpace">
                        <label  className="col-sm-12 col-form-label">End Date:<span className="txtRed">*</span></label>
                    </div>
            <div className="col-sm-2 dateInputDiv ">
                <DatePicker id="end_date" ref="end_date" className="form-control" name="end_date"
                  selected={moment(this.state.upComingeventDetail.end_date_format)}
                  onChange={this.handleChange.bind(this, 'end_date')}  minDate={this.state.fromDate} placeholderText="mm/dd/yyyy" />
             {this.state.dateInvalid1}
            {this.state.dateErr}
            </div>
           </div>
            <div className="form-group row ">
            <label  className="col-sm-2 col-form-label">Time:</label>
            <div className="col-sm-2 dateInputDiv ">
            <input className="form-control" type="time" id="example-text-input7" ref="start_time" name="start_time" defaultValue={moment(this.state.upComingeventDetail.start_time,'HH:mm a').format("HH:mm")} />
            </div>
                    <div className="col-sm-2 dateLabelDiv ">
                        <label  className="col-sm-12 col-form-label">To:</label>
                    </div>
                    <div className="col-sm-2 dateInputDiv  ">
            <input className="form-control" type="time" id="example-text-input8" ref="end_time" name="end_time" defaultValue={moment(this.state.upComingeventDetail.end_time,'HH:mm a').format("HH:mm")} />
            </div>
           </div>
          {(_.size(this.state.getGroupList)>0)?(<div><div className="form-group row">
            <label  className="col-sm-3 col-xs-3 col-form-label">Is this event for a Group?</label>
            <div className="col-sm-5 col-xs-5">
              <label  className="switch">
                <input type="checkbox" defaultChecked={this.state.isExistGroupDetails || this.props.id } onChange={this.groupcolapseTgl.bind(this)} disabled={this.props.id} />
                <div className="slider round"></div>
              </label>
            </div>
           </div>
          {((this.state.isExistGroupDetails || this.props.id))?(<div className="form-group row">
           <label name="group" className="col-sm-2 col-form-label">Group:<span className="txtRed">*</span></label>
           <div className="col-sm-10 pdl0px-1024">
              <label   className="col-sm-12 zeroPad">
                <select className="form-control" id="group_id"  name="group_id" defaultValue={this.props.id?this.props.id:this.state.upComingeventDetail.event_group_id} disabled={this.props.id}>
                  {_.size(this.state.getGroupList)>0 && this.state.getGroupList.map((item, index)=>{
                   
                    return(
                      <option key={index} value={item.id}  data-default className="selection">{item.name}</option>
                  );
               })}
                </select>
              </label>
            </div></div>):(<div></div>)}</div>):(<div></div>)}
              <div className="row">
               {this.props.isCreateOrEdit=="Edit"  ? <div className="col-sm-12 zeroPad">
                  <div className="groupIcon col-sm-3">
                     {isExistObj(this.state.upComingeventDetail.selected_group)?<img src={"http://"+this.state.upComingeventDetail.selected_group.image_url}  className="grpimgdiv" />:<div></div>}
                      </div>
                      <div className="col-sm-8 mt15">
                      {isExistObj(this.state.upComingeventDetail.selected_group)?<span>{this.state.upComingeventDetail.selected_group.name}</span>:<div></div>}<br/>

                      </div>
                  </div>
                  :<div></div>}

                  <div className="form-group">
                    <label  className="col-sm-3 col-xs-3">Private Event:</label>
                    <div className="col-sm-5  col-xs-5">
                      <label  className="switch ">
                        <input type="checkbox" name="is_private"  defaultChecked={this.state.upComingeventDetail.is_private}/>
                        <div className="slider round"></div>
                      </label>
                    </div>
                  </div>
                </div>


              </div>

              <div className="col-sm-12 zeroPad">
                <span className="detailsheadline">Details<span className="txtRed">*</span></span><br/>
                  <div className="mt15 col-sm-12 zeroPad">
                      <textarea className="txtarea form-control" id="description" ref="description" name="description" maxLength="500" defaultValue={(this.state.upComingeventDetail.description!=undefined)?this.state.upComingeventDetail.description.replace(/<br *\/?>/gi, '\n'):''}></textarea>
                      </div>
                </div>

              <div className="col-sm-12 zeroPad">
                <input type="button" value="Save" className="eventSavebtn mt15" onClick={this.onSubmitClick.bind(this)} disabled={this.props.isSaveInProgress} />
              </div></div>
            </div>

            </div>
            </form>
                       </div>
            );

    }
}
CreateEvent.contextTypes = {
  router: React.PropTypes.object.isRequired
};


function mapStateToProps(state) {
    return {
         getCourseList: state.getCourses,
         selectedCourse: state.selectedCourse,
          eventList: (state.eventReducer!=null)?state.eventReducer:[],
         selectedEvent:state.selectedEvent,
         activeUser:(state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({EventcourseList, oldgroupList, getEventCourseObject, courseList, getStates}, dispatch);


}

export default  connect(mapStateToProps, matchDispatchToProps)(CreateEvent);
