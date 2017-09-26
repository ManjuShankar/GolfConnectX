import React, {Component} from 'react';
 
import {connect} from 'react-redux';
 
import {bindActionCreators} from 'redux';
 
import {Link} from 'react-router';
 
import _ from 'lodash';
 
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
 
import {getCurrentEvent} from '../actions/eventDetailsAction';
 
import {IMG_CONSTANT} from '../constants/application.constants';

import {isExistObj} from '../utils/functions';

let imgPath=IMG_CONSTANT.IMAGE_PATH;
 
 
 
class SelctedEventDetails extends Component {
 
  constructor(props, context) {
    super(props, context);
    this.state={
      eventDetails:{}
    };
}
 
componentWillMount(){
 
  this.props.getCurrentEvent(this.props.params.id, this.props.activeUser.token).then((data)=>{
    this.setState({eventDetails:data});
  }).catch((error)=>{
         if(error == "Error: Request failed with status code 401"){
         this.context.router.push('/');
         } 
  });
}
 
render() {
    return (
                        <div>{(_.size(this.state.eventDetails)>0)?(<div className="eventListView col-sm-12">
 
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
 
                                                                                                                                   <span className="eventdate">{this.state.eventDetails.start_date}</span>
 
                                                                                                                       </div>
 
                                                                                                                       <div className="col-sm-12 eventMiddle zeroPad">
 
                                                                                                                        <div className="col-sm-9 zeroPad">
 
                                                                                                                                   <span className="col-sm-12">{this.state.eventDetails.name}</span>
 
                                                                                                                                   <span className="col-sm-12">{this.state.eventDetails.start_time} - {this.state.eventDetails.end_time}</span>
 
                                                                                                                        </div>
 
                                                                                                                       </div>
 
                                                                                                                       <div className="col-sm-12 zeroPad">
 
                                                                                                                                   <span className="eventAttending">{this.state.eventDetails.attendee_stats.attending} friends attending</span>
 
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
 
                                                                                <img src={(this.state.eventDetails.cover_image!=undefined && this.state.eventDetails.cover_image!=null)?("http://" + this.state.eventDetails.cover_image.image):("/assets/img/4th_july.jpg")} className="eventImg"></img>
 
                                                                        </div>
 
                                                                        <div className="col-sm-12 mt1pc evntList">
 
                                                                         <div className="col-sm-9 zeroPad">
 
                                                                                    <div className="col-sm-12 evntName">{this.state.eventDetails.name}</div>
 
                                                                                    <div className="col-sm-12 eventVenue ">
 
                                                                                                <div className="col-sm-12 zeroPad">{this.state.eventDetails.venue}</div>
 
                                                                                                <div className="col-sm-12 zeroPad">{this.state.eventDetails.start_time} - {this.state.eventDetails.end_time}</div>
 
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
                                                                                    {this.state.eventDetails.description}
                                                                                    </div>
 
                                                                        </div>
 
                                                            </div>
 
                                                            <div className="dividerline col-sm-12"></div>
 
                                                            <div className="col-sm-12 frndsAttending txtcenter">
 
                                                                        <div className="col-sm-1"></div>

                                                                        {(isExistObj(this.state.eventDetails.attendee_stats)) && <div className="col-sm-3">{this.state.eventDetails.attendee_stats.attending} Attending</div>}

                                                                        {(isExistObj(this.state.eventDetails.attendee_stats)) && <div className="col-sm-3 brdrLft2px brdrRyt2px">{this.state.eventDetails.attendee_stats.notattending} Rejected</div>}

                                                                        {(isExistObj(this.state.eventDetails.attendee_stats)) && <div className="col-sm-3">{this.state.eventDetails.attendee_stats.maybe} Responding</div>}

                                                            </div>
 
                                                            <div className="btmline col-sm-12"></div>
 
                                                            {_.size(this.state.eventDetails.files)>0?(<div><div className="dividerLine2"></div>
                                                              <button className="downloadbutton">
                                                                <span><img src="/assets/img/downloadimg.png" className="mr15px"></img><a href={'http://' + this.state.eventDetails.files[0].file} target="_blank"> Download/Upload Tee Time/Results</a></span>
                                                              </button></div>):('')}
                                                 </div>
 
                                                </div>
 
                                    </div>
 
                         </div>
 
                        </div>):(<div>Loading...</div>)}</div>
 
         );
 
 
 
    }
 
}
 
 
 
 
SelctedEventDetails.contextTypes = {
  router: React.PropTypes.object.isRequired
};
 
 
function mapStateToProps(state) {
 
    return {
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
 
    };
}
 
function matchDispatchToProps(dispatch){
    return bindActionCreators({getCurrentEvent}, dispatch);
}
 
export default  connect(mapStateToProps, matchDispatchToProps)(SelctedEventDetails);