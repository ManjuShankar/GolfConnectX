import React, {Component} from 'react';
import {render} from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import{IMG_CONSTANT} from '../constants/application.constants';

let imagePath=IMG_CONSTANT.IMAGE_PATH;
class GroupGallerynonAdmin extends Component{
    constructor(props,context){
        super(props);
    }

    render(){
        return(
            <div className="GroupGalleryAdmin">
        <div className="editgrpimg">
            <img src={imagePath+"coverimg.png"} className="coverimg"></img>
            <div className="captionDiv">
                <span className="imgtag">Friends (12 Members)</span>
                <button type="button" className="btn btn-default btnoptions">. . .</button>
            </div>
         </div>
           <div className="tabsForEvents">
    <Tabs>
        <TabList className="EventsTabHeader">
          <Tab>Post</Tab>
          <Tab>Member</Tab>
          <Tab>Gallery</Tab>
          <Tab>Events</Tab>
         <Tab>Info</Tab>

        </TabList>
        <button className="btnContactAdmin">Contact Admin</button>
    </Tabs>
            </div>
           <div className="row">
                <div className="col-sm-12">
            <div>
                <span>9 Photos</span>
                <button className="btnUploadpics">Add Photos/Videos
                </button>
            </div>
            <div className="dividerLine1"></div>
                </div>
            <div className="col-sm-2">
            <a href="#" className="thumbnail">
                <img src={imagePath+"gallery1.png"}></img>
            </a>
            </div>
               <div className="col-sm-2">
            <a href="#" className="thumbnail">
                <img src={imagePath+"gallery2.png"}></img>
            </a>
            </div>
               <div className="col-sm-2">
            <a href="#" className="thumbnail">
                <img src={imagePath+"gallery3.png"}></img>
            </a>
            </div>
               <div className="col-sm-2">
            <a href="#" className="thumbnail">
                <img src={imagePath+"gallery4.png"}></img>
            </a>
            </div>
               <div className="col-sm-2">
            <a href="#" className="thumbnail">
                <img src={imagePath+"gallery5.png"}></img>
            </a>
            </div>
               <div className="col-sm-2">
            <a href="#" className="thumbnail">
                <img src={imagePath+"gallery6.png"}></img>
            </a>
            </div>
               <div className="col-xs-2">
            <a href="#" className="thumbnail">
                <img src={imagePath+"gallery7.png"}></img>
            </a>
            </div>
               <div className="col-xs-2">
            <a href="#" className="thumbnail">
                <img src={imagePath+"gallery8.png"}></img>
            </a>
            </div>
               <div className="col-xs-2">
            <a href="#" className="thumbnail">
                <img src={imagePath+"gallery9.png"}></img>
            </a>
            </div>
            </div>
        </div>
            );
    }
}
export default GroupGallerynonAdmin;
