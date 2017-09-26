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
///import ReactCrop from 'react-image-crop';
import DatePicker from 'react-datepicker';
import toastr from 'toastr';

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

class CreateEvent extends React.Component {
     constructor(props) {
       super(props);
       this.state={
           upComingeventDetail: (this.props.isCreateOrEdit=="Edit")?(this.props.upComingeventDetail):({}),
           eventsImage:'',
           getCourseslist:Object.assign([],props.getCourseList),
           getGroupList: [],
           eventsImageObj:{},
           isExistCourseDetails: (this.props.isCreateOrEdit=="Edit")?(this.props.upComingeventDetail.venue_course_id!=null?true:false):(false),
           isExistGroupDetails:(this.props.isCreateOrEdit=="Edit")?(this.props.upComingeventDetail.event_group_id!=null?true:false):(false),
           titleName: "", venueName:"", address:"", city:"", zip:"",
           errTitle:"", dateErr:"", dateInvalid1:"",
           buttonDisabled : true,   selectedValue:'', selectedName:'', other:["Other"],
           croppedImage:"",
           teaTimesList: (this.props.isCreateOrEdit=="Edit")?(this.props.teaTimesList):([]),
           cropImageWidth: 945,
           cropImageSrc: "/assets/img/4th_july.jpg"
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
               url: SERVICE_URLS+'api/events/'+  eventId +'/tee-time-files/',
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
/*this.props.courseList(this.props.activeUser.token).then(()=>{
            this.setState({getCourseslist:this.props.getCourseList});

        }).catch((error)=>{
        });*/
        this.props.oldgroupList(this.props.activeUser.token).then((data)=>{

              this.setState({getGroupList:data});
        }).catch((error)=>{
        });
        if(this.props.isCreateOrEdit=="Edit"){

        this.setState({selectedValue:this.props.selectedEvent.venue_course_id});
        }

    }

componentWillReceiveProps(nextProps){
        if(this.props.getCourseList!=nextProps.getCourseList){
            this.setState({getCourseslist:nextProps.getCourseList});
        }
        if(this.props.teaTimesList!=nextProps.teaTimesList){
          this.setState({teaTimesList: nextProps.teaTimesList});
        }
    }

    showCourseDetails(e){
          this.setState({selectedValue:e.id, selectedName:e.name});
          //if(e.target!=undefined && e.target.value!="-1"){
           let id=e.id;
           this.props.getEventCourseObject(id, this.props.activeUser.token).then((data)=>{
              let eventDetailsUpdated = this.state.upComingeventDetail;
              eventDetailsUpdated.address1 = data.address1;
              eventDetailsUpdated.city = data.city;
              eventDetailsUpdated.zip_code = data.zip_code;
              this.setState({upComingeventDetail:eventDetailsUpdated});
           }).catch((error)=>{

          });
       // }
     }

    uploadFile(e) {
      e.preventDefault();
           var fd = new FormData();
           var that = this;
           let fileObj = document.getElementById('file').files[0];
           let fileExtention = this.getFileExtension(document.getElementById('file').files[0].name);
           if(isValidImage(fileExtention)){
           fd.append('image', document.getElementById('file').files[0]);
           $.ajax({
               url: SERVICE_URLS+'api/events/upload-cover-image/',
               data: fd,
               processData: false,
               contentType: false,
               type: 'POST',
               headers:{
               'Authorization':'Token '+ this.props.activeUser.token
              },
               success: function(data){
                 that.setState({eventsImage: data.image, eventsImageObj:data});

               },
               error: function(){
                  
               }
           });
         }else{
           toastr.error('Upload a valid Image');
         }
       }

onSubmitClick(){
    var form = document.querySelector('#eventsForm');
    var formData = serialize(form, { hash: true });
    
    if((formData['name'] == "") || (formData['name'] == undefined)) {
        this.refs.name.focus();
    }
    else if((this.refs.is_course.checked == true) && (this.refs.coursesList.value == "-1")){
          this.refs.coursesList.focus();
    }
    else if( (this.refs.is_course.checked != true) && ((formData['venue'] == "") || (formData['venue'] == undefined)) ){
          this.refs.venue.focus();
     }

    else if( (this.refs.is_course.checked != true) &&((formData['address1'] == "") || (formData['address1'] == undefined)) ) {
        this.refs.address1.focus();
    }
    else if ( (this.refs.is_course.checked != true) && ((formData['city'] == "") || (formData['city'] == undefined))) {
        this.refs.city.focus();
    }
    else if( (this.refs.is_course.checked != true) && ((formData['zip_code'] == "") || (formData['zip_code'] == undefined)) ) {
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
        else if((formData['description'] == "") || (formData['description'] == undefined)){
          this.refs.description.focus();
        }
        else{
            _.set(formData, 'teetime_file', this.state.teetime_file);
            _.set(formData, 'cover_image', this.state.eventsImageObj.id);
            
            if(this.state.isExistCourseDetails){
                var selectedCourseId= this.state.selectedValue;
                //var test = $(".Select-value-label").text();
                var test2 =document.getElementsByClassName("couresList");
                let selectedCourseName= "venue";
                _.set(formData, 'venue_course', selectedCourseId);
                _.set(formData, 'venue', selectedCourseName);
                _.set(formData,'address1',this.state.upComingeventDetail.address1);
                _.set(formData,'city',this.state.upComingeventDetail.city);
                _.set(formData,'zip_code',this.state.upComingeventDetail.zip_code);
          }
          if(this.state.isExistGroupDetails){
              let selectedGroupId=document.getElementById('group_id').value;
              _.set(formData, 'group_id', _.toInteger(selectedGroupId));
          }
          this.props.onSaveClick(formData);
      }
    }

colpseTgl(e){
    this.setState({isExistCourseDetails:!this.state.isExistCourseDetails});

       this.refs.address1.value = "";this.refs.city.value = "";this.refs.zip_code.value = "";

}

groupcolapseTgl(){
  this.setState({isExistGroupDetails:!this.state.isExistGroupDetails});
}

zipCodeEvent(e) {
    const re = /[0-9]+/g;
    if ((!re.test(e.key)) || (e.target.value.length >= 7))
    {
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

crop(){
    if(this.state.cropImageWidth>=945){
        let imgUrl = this.refs.cropper.crop();
        this.setState({
                    croppedImage : imgUrl
        });
  }else{
      toastr.error('Image Cannot be cropped');
  }
}

handleChange(date, dateType){
  let _localState = this.state.upComingeventDetail;
  if(date=='start_date'){
    _localState.start_date_format = dateType;
    this.setState({upComingeventDetail: _localState});
  }else{
    _localState.end_date_format = dateType;
    this.setState({upComingeventDetail: _localState});
  }
}

  handleCropChange(values){
    if(values.width>=945){
        this.setState({cropImageWidth: values.width});
      }else{
          this.setState({cropImageWidth: 945});
        ///this.setState({cropImageWidth: 945});
      }
  }

    render(){
       
        const {upComingeventDetail, isCreateOrEdit, onSaveClick, activeUser, isSaveInProgress, teaTimesList, people, getFiles} = this.props;
        return(

            <div>
            <form action="" method="post" id="eventsForm" name="eventsForm" ref="eventsForm"  encType="multipart/form-data" >
            <div className="col-sm-8 eventScroll pdtop">

            <div className="coursesContent">
            <div className="eventImage">
            {(isCreateOrEdit=="Create")?((this.state.eventsImage=='')?(<div><img src="/assets/img/4th_july.jpg" className="eventImg" />
                    <span className="span_input col-sm-12" data-target="#addEventImage" data-toggle="modal" >
                    <input type="button" className="btn btn-default editeventImg"value="Add Event Image" />
                    <span className="glyphicon glyphicon-pencil position_Abs top10px"></span>
                    {/*<input ref="file" id="file" type="file" name="file" onChange={this.uploadFile} className="upload-file form-control" accept="image/*" />*/}
                    </span>
                  </div>):((this.state.eventsImageObj!=null)?(((this.state.eventsImageObj.height>=103 && this.state.eventsImageObj.width>=725)?(<img src={'http://' + this.state.eventsImageObj.image} className="eventImg" />):(
                <div className="hero">
                  <img className="hero__background"  />
                  <center><img className="hero__image"  src={'http://' + this.state.eventsImageObj.image} /></center>
                  <span className="span_input col-sm-12" data-target="#addEventImage" data-toggle="modal">
                    <input type="button" className="btn btn-default editeventImg" value="Add Event Image" />
                    <span className="glyphicon glyphicon-pencil position_Abs top10px"></span>
                    {/*<input ref="file" id="file" type="file" name="file" onChange={this.uploadFile} className="upload-file form-control" accept="image/*" />*/}
                  </span>
                </div>
            ))):(<div><img src="/assets/img/4th_july.jpg" className="eventImg raghu" />
                  <span className="span_input col-sm-12" data-target="#addEventImage" data-toggle="modal">
                          <input type="button" className="btn btn-default editeventImg" value="Add Event Image" />
                          <span className="glyphicon glyphicon-pencil position_Abs top10px"></span>
                          {/*<input ref="file" id="file" type="file" name="file" onChange={this.uploadFile} className="upload-file form-control" accept="image/*" />*/}
                        </span>
                        </div>))):((isCreateOrEdit=="Edit")?(((upComingeventDetail.cover_image!=undefined && upComingeventDetail.cover_image!=null)?((upComingeventDetail.cover_image.height>=103 && upComingeventDetail.cover_image.width>=725)?(<img src={'http://' + upComingeventDetail.cover_image.image} className="eventImg" />):(
                      <div className="hero">
                        <img className="hero__background"  />
                        <center><img className="hero__image"  src={'http://' + upComingeventDetail.cover_image.image} /></center>
                          <span className="span_input col-sm-12" data-target="#addEventImage" data-toggle="modal">
                          <input type="button" className="btn btn-default editeventImg" value="Add Event Image" />
                          <span className="glyphicon glyphicon-pencil position_Abs top10px"></span>
                          {/*<input ref="file" id="file" type="file" name="file" onChange={this.uploadFile} className="upload-file form-control" accept="image/*" />*/}
                        </span>
                      </div>
                  )):(<div><img src="/assets/img/4th_july.jpg" className="eventImg" />
                        <span className="span_input col-sm-12" data-target="#addEventImage" data-toggle="modal">
                          <input type="button" className="btn btn-default editeventImg" value="Add Event Image" />
                          <span className="glyphicon glyphicon-pencil position_Abs top10px"></span>
                          {/*<input ref="file" id="file" type="file" name="file" onChange={this.uploadFile} className="upload-file form-control" accept="image/*" />*/}
                        </span>
                        </div>
                    ))):((<div><img src={'http://'+this.state.eventsImage} className="eventImg" />
                        <span className="span_input col-sm-12" data-target="#addEventImage" data-toggle="modal" >
                          <input type="button" className="btn btn-default editeventImg"value="Add Event Image" />
                          <span className="glyphicon glyphicon-pencil position_Abs top10px"></span>
                          {/*<input ref="file" id="file" type="file" name="file" onChange={this.uploadFile} className="upload-file form-control" accept="image/*" />*/}
                        </span>
                        </div>
                    )))}
            </div>
            <div className="modal fade" id="addEventImage" role="dialog" data-backdrop="static">
                        <div className="modal-dialog tp13pc">
                          <div className="modal-content brdrRad0px">
                            <div className="modal-header modalHder">
                              <button type="button" className="close m0px" data-dismiss="modal">&times;</button>
                              <h3 className="modal-title">Add Event Image</h3>
                            </div>
                            <div className="modal-body bgfff col-sm-12">
                              <div>
                                <div className="form-group col-sm-12 m0px">
                                  <form id="imageUploadForm" name="imageUploadForm" ref="imageUploadForm" encType="multipart/form-data">
                                    <input ref="file" id="file" type="file" name="file" className="form-control" accept="image/*" />
                                  </form>
                                </div>
                              <div className="col-sm-12">
                                <Cropper  src={this.state.cropImageSrc} ref="cropper" width={this.state.cropImageWidth} height={103} fixedRatio={false} allowNewSelection={false}
                                  onChange={values => this.handleCropChange(values)}
                                 />
                                <br/>
                                <input type="button" className="prev_butn" value="crop" onClick={this.crop.bind(this)}/>
                                <br/>
                                <img src={this.state.croppedImage} />
                              </div>
                              {/*<div className="col-xs-12 col-sm-12 mt1pc mb1pc txtRyt zeroPad"><button className="prev_butn">Preview</button></div>
                                <div className="col-sm-12 previewImgDiv zeroPad">
                                  <img src="/assets/img/bg_image.png" className="previewImgFor_Upload" />
                                </div>*/}

                                {/*<div className="afterUpload txtcenter">
                                  <img src="/assets/img/bg_image.png" className="croped_sizeImg" />
                                </div>*/}
                              </div>
                            </div>
                            <div className="modal-footer col-sm-12 col-xs-12">
                              <div className="col-sm-12">
                                <button type="button" className="upld_butns" onClick={this.uploadFile.bind(this)} data-dismiss="modal">Upload</button>
                                <button type="button" className="upld_butns" data-dismiss="modal">Close</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                        

                      {/*<ReactCrop src="/assets/img/4th_july.jpg" crop={crop} />*/}


                      <div className="col-sm-12">
                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label">Title:<span className="txtRed">*</span></label>
                            <div className="col-sm-10 pdl0px-1024">
                                <input className="form-control" maxLength="100" type="text" id="example-text-input" ref="name"  name="name" defaultValue={this.state.upComingeventDetail.name} />
                                  {this.state.errTitle}
                            </div>
                        </div>
                        <div className="form-group row">
                          <label  className="col-sm-7 col-form-label">Is your event at a golf course?</label>
                            <div className="col-sm-4">
                              <label  className="switch">
                                  <input type="checkbox" name="is_course" ref="is_course" defaultChecked={this.state.isExistCourseDetails} onChange={this.colpseTgl.bind(this)}/>
                                  <div className="slider round ml30px"></div>
                              </label>
                            </div>
                        </div>
                        {(!(this.state.isExistCourseDetails))?(<div><div className="form-group row" id="VenueDiv">
                            <label  className="col-sm-2 col-form-label">Venue:<span className="txtRed">*</span></label>
                              <div className="col-sm-10 pdl0px-1024">
                                <input className="form-control" maxLength="150" type="text" id="example-text-input" ref="venue" name="venue" defaultValue={this.state.upComingeventDetail.venue}  />
                              </div>
                        </div>
                        <div className="form-group row">
                          <label  className="col-sm-2 col-form-label">Address:<span className="txtRed">*</span></label>
                          <div className="col-sm-10 pdl0px-1024">
                            <input className="form-control" maxLength="500" type="text" id="example-text-input" ref="address1" name="address1" defaultValue={this.state.upComingeventDetail.address1}   />
                          </div>
                      </div>
                      <div className="form-group row">
                        <label  className="col-sm-2 col-form-label">City:<span className="txtRed">*</span></label>
                        <div className="col-sm-2 dateInputDiv">
                          <input className="form-control" maxLength="100" type="text" id="example-text-input" ref="city" name="city" defaultValue={this.state.upComingeventDetail.city}  />
                        </div>
                        <div className="col-sm-2 dateLabelDiv">
                          <label  className="col-sm-12 col-form-label">Zip code:<span className="txtRed">*</span></label>
                        </div>
                        <div className="col-sm-2 dateInputDiv pdngryt0px">
                          <input className="form-control" type="text" id="example-text-input" ref="zip_code" name="zip_code" defaultValue={this.state.upComingeventDetail.zip_code} onKeyPress={this.zipCodeEvent.bind(this)}  />
                        </div>
                    </div>
                  </div>):(<div>
                    <div className="form-group row">
                      <label  className="col-sm-2 col-form-label">Venue:<span className="txtRed">*</span></label>
                      <div className="col-sm-10 pdl0px-1024">
                        <label className="col-sm-12 zeroPad">
                          {/* {(this.props.isCreateOrEdit=="Edit")?<select  className="form-control"
                            defaultValue={(this.state.upComingeventDetail!=null)?(this.state.upComingeventDetail.venue_course_id):("-1")}
                            ref="coursesList" id="coursesList" onChange={this.showCourseDetails.bind(this)} >
                              <option value="-1">Please Select Course...</option>
                              {this.state.getCourseslist!=null && this.state.getCourseslist.map((item, i) => {
                                    return(
                                    <option value={item.id} key={i} className="selection">{item.name}</option >);
                                })}
                            </select>:*/}
                            {(_.size(this.props.getCourseList)>0)?(<Select
                                name="couresList"
                                value={this.state.selectedValue} labelKey="name" valueKey="id"
                                options={this.props.getCourseList}
                                ref="coursesList" id="coursesList" onChange={this.showCourseDetails.bind(this)}
                                />):(<span></span>)}
                        </label>
                  </div>
              </div>
           <div className="form-group row">
             <label  className="col-sm-2 col-form-label">Address:<span className="txtRed">*</span></label>
             <div className="col-sm-10 pdl0px-1024">
               <input className="form-control" maxLength="500" type="text" id="example-text-input" ref="address1" name="address1" value={this.state.upComingeventDetail.address1} disabled/>
             </div>
           </div>
           <div className="form-group row">
               <label  className="col-sm-2 col-form-label">City:<span className="txtRed">*</span></label>
               <div className="col-sm-2 dateInputDiv">
                   <input className="form-control" maxLength="100"type="text" id="example-text-input" ref="city" name="city" value={this.state.upComingeventDetail.city} disabled/>
               </div>
               <div className="col-sm-2 dateLabelDiv">
                       <label  className="col-sm-12 col-form-label">Zip code:<span className="txtRed">*</span></label>
               </div>
               <div className="col-sm-2 dateInputDiv pdngryt0px">
                 <input className="form-control" type="text" id="example-text-input" name="zip_code" ref="zip_code" value={this.state.upComingeventDetail.zip_code} onKeyPress={this.zipCodeEvent.bind(this)} disabled/>
               </div>
            </div></div>)}
           
                <div className="form-group row">
            <label  className="col-sm-2 col-form-label">Start Date:<span className="txtRed">*</span></label>
            <div className="col-sm-2 dateInputDiv">
            <DatePicker id="start_date" ref="start_date" name="start_date" selected={moment(this.state.upComingeventDetail.start_date_format)} onChange={this.handleChange.bind(this, 'start_date')}  minDate={moment()} placeholderText="mm/dd/yyyy" />
            {/*<input className="form-control" type="date" id="start_date" ref="start_date" name="start_date" placeholder="mm/dd/yyyy" defaultValue={moment(this.state.upComingeventDetail.start_date_format, 'MM/DD/YYYY').format('YYYY-MM-DD')} onBlur={this.dateVal.bind(this)}/>*/}
            {this.state.dateInvalid1}
            </div>
                    <div className="col-sm-2 dateLabelDiv ">
                        <label  className="col-sm-12 col-form-label">End Date:<span className="txtRed">*</span></label>
                    </div>
            <div className="col-sm-2 dateInputDiv pdngryt0px">
            <DatePicker id="end_date" ref="end_date" name="end_date" selected={moment(this.state.upComingeventDetail.end_date_format)} onChange={this.handleChange.bind(this, 'end_date')}  minDate={moment()} placeholderText="mm/dd/yyyy" />
            {/*<input className="form-control" type="date" id="end_date" ref="end_date" name="end_date" placeholder="mm/dd/yyyy" defaultValue={moment(this.state.upComingeventDetail.end_date_format, 'MM/DD/YYYY').format('YYYY-MM-DD')} onBlur={this.dateVal.bind(this)}/>*/}
             {this.state.dateInvalid2}
            {this.state.dateErr}
            </div>
           </div>
            <div className="form-group row">
            <label  className="col-sm-2 col-form-label">Time:</label>
            <div className="col-sm-2 dateInputDiv">
            <input className="form-control" type="time" id="example-text-input" ref="start_time" name="start_time" defaultValue={moment(this.state.upComingeventDetail.start_time,'HH:mm a').format("HH:mm")} />
            </div>
                    <div className="col-sm-2 dateLabelDiv">
                        <label  className="col-sm-12 col-form-label">To:</label>
                    </div>
                    <div className="col-sm-2 dateInputDiv pdngryt0px">
            <input className="form-control" type="time" id="example-text-input" ref="end_time" name="end_time" defaultValue={moment(this.state.upComingeventDetail.end_time,'HH:mm a').format("HH:mm")} />
            </div>
           </div>
          {(_.size(this.state.getGroupList)>0)?(<div><div className="form-group row">
            <label  className="col-sm-7 col-form-label">Is this event for a Group?</label>
            <div className="col-sm-4">
              <label  className="switch">
                <input type="checkbox" defaultChecked={this.state.isExistGroupDetails || this.props.id } onChange={this.groupcolapseTgl.bind(this)} disabled={this.props.id} />
                <div className="slider round ml30px"></div>
              </label>
            </div>
           </div>
          {((this.state.isExistGroupDetails || this.props.id))?(<div className="form-group row">
           <label name="group" className="col-sm-2 col-form-label">Group:<span className="txtRed">*</span></label>
           <div className="col-sm-10 pdl0px-1024">
              <label   className="col-sm-12 zeroPad">
                <select className="form-control" id="group_id"  name="group_id" defaultValue={this.props.id?this.props.id:this.state.upComingeventDetail.event_group_id} disabled={this.props.id}>
                  {this.state.getGroupList.map((item, index)=>{
                    return(
                      <option key={index} value={item.id}  data-default className="selection">{item.name}</option>
                  );
               })}
                </select>
              </label>
            </div></div>):(<div></div>)}</div>):(<div></div>)}
              <div className="col-sm-12">
               {this.props.isCreateOrEdit=="Edit"  ? <div className="col-sm-7 zeroPad">
                  <div className="groupIcon col-sm-3">
                     {this.state.upComingeventDetail.selected_group!=null && this.state.upComingeventDetail.selected_group!=undefined?<img src={"http://"+this.state.upComingeventDetail.selected_group.image_url}  className="grpimgdiv" />:<div></div>}
                      </div>
                      <div className="col-sm-8 mt15">
                      {this.state.upComingeventDetail.selected_group!=null && this.state.upComingeventDetail.selected_group!=undefined?<span>{this.state.upComingeventDetail.selected_group.name}</span>:<div></div>}<br/>

                      </div>
                  </div>
                  :<div></div>}
                
                  <div className="form-group row">
                    <label className="col-sm-7 zeroPad">Private Event:</label>
                    <div className="col-sm-4 zeroPad">
                      <label  className="switch">
                        <input type="checkbox" name="is_private"  defaultChecked={this.state.upComingeventDetail.is_private}/>
                        <div className="slider round ml30px"></div>
                      </label>
                    </div>
                  </div>
               
              </div>

              </div>

              <div className="col-sm-12 zeroPad">
                <span className="detailsheadline">Details<span className="txtRed">*</span></span><br/>
                  <div className="mt15 col-sm-12 zeroPad">
                      <textarea className="txtarea form-control" ref="description" name="description" maxLength="500" defaultValue={this.state.upComingeventDetail.description}></textarea>
                      </div>
                </div>
              {/*(isCreateOrEdit=="Edit")?(
                <div>{(_.some(this.props.people.attendeesList, ['id', this.props.activeUser.id]) || this.state.upComingeventDetail.created_by.id==this.props.activeUser.id) && _.size(this.state.teaTimesList)>0 && this.state.teaTimesList.map((item, index)=>{
                  let extension = _.split(item.name, '.');
                  return(<div key={index} className="col-sm-2">
                              <i className={(extension[1]=="pdf")?("fa fa-lg fa-file-pdf-o color-red pad-5px"):((extension[1]=="xls" || extension[1]=="xlsx")?("fa fa-lg fa-file-excel-o color-green pad-5px"):((extension[1]=="doc" || extension[1]=="docx")?("fa fa-lg fa-file-word-o color-blue pad-5px"):("fa fa-lg fa-file-text pad-5px")))} aria-hidden="true"></i><a className="cursor-pointer" target="_blank" href={'http://' + item.file}>{item.name.substr(0, item.name.lastIndexOf('.'))}</a><br/>
                        </div>)
                })}
                <div className="col-sm-10">
                <input type="button" value="Upload a File" className="fr btn-dnloadFile pad-5px" data-toggle="modal" data-target="#uploadFileModal" />
                <div className="modal fade addPost" id="uploadFileModal" role="dialog" data-backdrop="static">
                <div className="modal-dialog tp25pc">
                <form id="groupsForm">
                   <div className="modal-content">
                       <div className="modal-header col-sm-12 bgGreen">Upload File</div>
                       <div className="modal-body col-sm-12 bgwhite mb0px">
                          <input type="text" className="form-control" name="uploadFileName" id="uploadFileName" placeholder="File Name"/><br/>
                          <input ref="teatime" id="teatime" type="file" name="teatime" className="form-control" accept="application/pdf, application/vnd.ms-excel, application/msword" />
                       </div>
                      <div className="modal-footer col-sm-12 bgwhite">
                        <input type="button" className="upload-butn " value="Upload" id="btnSend" onClick={this.uploadTeatTimes} />
                        <input type="button" className="uploadcancel-butn " data-dismiss="modal" value="Cancel" />
                     </div>
                    </div>
                    </form>
                </div>
              </div>
                </div>
              </div>):(<span></span>)*/}
              <div className="col-sm-12 zeroPad">
              <input type="button" value="Save" className="eventSavebtn mt15" onClick={this.onSubmitClick.bind(this)} disabled={this.props.isSaveInProgress} />
         </div>
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
         selectedEvent:state.selectedEvent,
         activeUser:(state.activeUser!=null)?(state.activeUser):(JSON.parse(localStorage.getItem('userDetails'))),
         ///getGroupList: (state.getgroupList!=undefined && state.getgroupList!=null)?state.getgroupList:{}
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({EventcourseList, oldgroupList, getEventCourseObject, courseList}, dispatch);


}

export default  connect(mapStateToProps, matchDispatchToProps)(CreateEvent);
