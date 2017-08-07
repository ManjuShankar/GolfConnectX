import React, {Component} from 'react';
import {render} from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import{IMG_CONSTANT} from '../constants/application.constants';

let imagePath=IMG_CONSTANT.IMAGE_PATH;
class GroupInfoAdmin extends Component{
    constructor(props,context)
    {
        super(props);

    }
    render()
    {
        return(
            <div className="GroupInfo">
        <div className="editgrpimg">
            <img src={imagePath+"coverimg.png"} className="coverimg"></img>
            <div className="captionDiv">
                <span className="imgtag">12 Members</span>

            </div>
         </div>
           <div className="tabsForEvents">
    <Tabs>
        <TabList className="EventsTabHeader">

          <Tab>Member</Tab>
          <Tab>Gallery</Tab>
          <Tab>Events</Tab>
          <Tab>Info</Tab>

        </TabList>
        <img src={imagePath+"black-male-user-symbol.png"} className="adminicon"></img>
    </Tabs>
            </div>
            <div className="col-sm-12">
            <div>
                <span>Info</span>
                <button className="btnLeaveGroup">Leave Group</button>
            </div>

            <div className="dividerLine1"></div>
                <div className="col-sm-6 mt15">
                <span>Description</span>
                    <div className="dividerLine2"></div>
                    <div className="mt15 ml20px mr15px"><p>This is a test group information.</p></div>
                    <button className="btnEdit">Edit</button>
                </div>
                <div className="col-sm-1 mt15">
                <img src={imagePath+"fileObject.png"}></img>
                    <span className="fileTag">Files</span>
                </div>
                <div className="col-sm-5 mt15">
                    <div className="col-sm-10">
                        <span>LoremIpsum. PDF</span><br/>
                        <span>Jun 23, 2016 by Jerry Simmons</span>
                        <div className="dividerLine3"></div>
                    </div>
                     <div className="col-sm-10">
                        <span>LoremIpsum. PDF</span><br/>
                        <span>Jun 23, 2016 by Jerry Simmons</span>
                        <div className="dividerLine3"></div>
                    </div>
                     <div className="col-sm-10">
                        <span>LoremIpsum. PDF</span><br/>
                        <span>Jun 23, 2016 by Jerry Simmons</span>
                        <div className="dividerLine3"></div>
                    </div>
                     <div className="col-sm-10">
                        <span>LoremIpsum. PDF</span><br/>
                        <span>Jun 23, 2016 by Jerry Simmons</span>
                        <div className="dividerLine3"></div>
                    </div>
                     <div className="col-sm-10">
                        <span>LoremIpsum. PDF</span><br/>
                        <span>Jun 23, 2016 by Jerry Simmons</span>
                        <div className="dividerLine3"></div>
                    </div>
                    <button className="btnUploadFile">Upload File</button>
                </div>
                </div>
        </div>
            );
    }
}
export default GroupInfoAdmin;
