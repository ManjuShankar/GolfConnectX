import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import _ from 'lodash';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
 
import {IMG_CONSTANT} from '../constants/application.constants';
let imgPath=IMG_CONSTANT.IMAGE_PATH;
 
class EventDetailList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state={};
  
}
render() {
   
    return (
                        <div className="eventListView col-sm-12">
                         <div className="col-sm-12 zeroPad bgwhite publicEventList">
                                    <div className="publicEventImg col-sm-12 zeroPad">
                                                <img src="/assets/img/eventsImg.png" className="col-sm-12 zeroPad" />
                                                <div className="img-event col-sm-12">Public Events</div>
                                    </div>
                                    <div className="col-sm-12 zeroPad">
                                                <div className="upcmngHeader col-sm-12">
                                                            <div className="header">Upcoming</div>
                                                </div>
                                                 <div className="col-sm-12">
                                                 <div className="col-sm-4">
                                                           <div className="col-sm-12 zeroPad">
                                                                       <div className="col-sm-12 zeroPad">
                                                                                   <ul className="latesteventsList col-sm-12 zeroPad">
                                                                                               <li className="listofevent col-sm-12">
                                                                                                           <div className="col-sm-12 zeroPad">
                                                                                                                       <div className="col-sm-12 zeroPad">
                                                                                                                                   <span className="eventdate">Monday July 4,2017</span>
                                                                                                                       </div>
                                                                                                                       <div className="col-sm-12 eventMiddle zeroPad">
                                                                                                                        <div className="col-sm-9 zeroPad">
                                                                                                                                   <span className="col-sm-12">4th of July Tournament</span>
                                                                                                                                   <span className="col-sm-12">10:30am - 4:00pm</span>
                                                                                                                        </div>                                                                                                          
                                                                                                                       </div>
                                                                                                                       <div className="col-sm-12 zeroPad">
                                                                                                                                   <span className="eventAttending">0 friends attending</span>
                                                                                                                       </div>
                                                                                                           </div>
                                                                                               </li>
                                                                                   </ul>
                                                                       </div>
                                                           </div>
                                                 </div>
                                                 <div className="col-sm-8 brdrLft2px">
                                                            <div className="eventImgPart col-sm-12 zeroPad">
                                                                        <div className="col-sm-12 zeroPad">
                                                                                    <img src="/assets/img/4th july.PNG" className="eventImg" />
                                                                        </div>
                                                                        <div className="col-sm-12 mt1pc evntList">
                                                                         <div className="col-sm-9 zeroPad">
                                                                                    <div className="col-sm-12 evntName">4th of July Tournament</div>
                                                                                    <div className="col-sm-12 eventVenue ">
                                                                                                <div className="col-sm-12 zeroPad">2459 U.S. 280, Cordele, GA 31015</div>
                                                                                                <div className="col-sm-12 zeroPad">10:30am - 4:00pm</div>
                                                                                    </div>  
                                                                         </div>
                                                                         <div className="col-sm-3 zeroPad txtRyt">
                                                                                   <button type="button" className="req-butn">Request an Invite</button>          
                                                                         </div>                                                                      
                                                                        </div>
                                                            </div>
                                                            <div className="invitationDetails zeroPad mt2pc col-sm-12">
                                                                        <div className="invitationFrom zeroPad col-sm-12 ">
                                                                                    <div className="col-sm-1 zeroPad">
                                                                                                <img src="/assets/img/bradPitt.png" className="invitorImg" />
                                                                                    </div>
                                                                                    <div className="col-sm-9 zeroPad invitorDetails">
                                                                                                <div className="col-sm-12 invitorName zeroPad">Brad Pitt</div>
                                                                                                <div className="col-sm-12 privateEvent zeroPad">Private Event</div>
                                                                                    </div>
                                                                        </div>
                                                                        <div className="descrip col-sm-12 zeroPad mt1pc">
                                                                                    <div className="col-sm-12 mt1pc zeroPad">Details</div>
                                                                                    <div className="col-sm-12 mt1pc zeroPad">
                                                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                                                                                    ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercition ullamco
                                                                                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                                                                                    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                                                                                    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                                                                    </div>
                                                                        </div>
                                                            </div>
                                                            <div className="dividerline col-sm-12"></div>
                                                            <div className="col-sm-12 frndsAttending txtcenter">
                                                                        <div className="col-sm-1"></div>
                                                                        <div className="col-sm-3">0 Attending</div>
                                                                        <div className="col-sm-3 brdrLft2px brdrRyt2px">0 Rejected</div>
                                                                        <div className="col-sm-3">0 Responding</div>
                                                            </div>
                                                            <div className="btmline col-sm-12"></div>
                                                            <div className="dwnld-butn col-sm-12 zeroPad">
                                                                        <input type="button" className="dwnldResults col-sm-12" value="Download Tea Time/Results" />
                                                            </div>
                                                 </div>
                                                </div>
                                    </div>
                         </div>
                        </div>
         );
 
    }
}
export default (EventDetailList);