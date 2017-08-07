import React, {Component} from 'react';
import {render} from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import{IMG_CONSTANT} from '../constants/application.constants';

let imagePath=IMG_CONSTANT.IMAGE_PATH;
class GroupEventsAdmin extends Component{
    constructor(props,context){
        super(props, context);
    }

    render()
    {
        return(
            <div className="GroupEvents">
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
                <span>Events</span>
                <button className="btnCreateEvent">Create Event</button>
            </div>

            <div className="dividerLine1"></div>
                </div>
            <div className="col-sm-5">
            Calendar
            </div>
            <div className="col-sm-7">
            <span>09.23.2016</span>
                <div className="dividerLine2"></div>
                <span className="fntbold">Friday Get Together</span><br/>
               <div>
                   <span className="fnt12px">Friday Jul 29, 2016</span><br/>
                   <span className="fnt12px">2459 U.S. 280, Cordele,GA 31015</span><br/>
                   <span className="fnt12px">10:30 AM-2:00PM</span><br/><br/>
                   <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud
exercitation ullamco laboris nisi ut aliquip ex ea commodo.</span><br/>
                   <button className="viewevntPage">View EventPage</button>
               </div>
            </div>
        </div>
            );
    }
}
export default GroupEventsAdmin;
