import React,{Component} from 'react';
import EventListDetail from './eventListDetail';
import UpcomingEventDetails from './upcomingEventDetails';
import CreateEvent from './createEvent';
import _ from 'lodash';
class AllEventsTab extends Component{
  constructor(props){
    super(props);
  }

  onSaveClick(formData){
    if(this.props.onSaveClick){
        this.props.onSaveClick(formData);
    }
  }

  render(){
    const {eventsList, onEventClick, upComingeventDetail, isCreateOrEdit, onSaveClick, onRequestInviteClick, activeUser, onButtonClick, isSaveInProgress, selectedEventId, teaTimesList, people, getFiles, eventId} = this.props;
    return(<div className="eventsPageDetail col-sm-12 bgwhite">
      <div className="col-sm-12 col-md-3 eventScrollTab brdr2pxddd">
        <div className="eventListLeft">
          <ul className="noListStyle">
            {_.size(eventsList)>0 && eventsList.map((eventDetail, index)=>{
                return(<div key={index}><EventListDetail onEventClick={onEventClick}  eventsList={eventsList} eventId={eventId} eventDetail={eventDetail} selectedEventId={selectedEventId} /></div>);
            })}
          </ul>
        </div>
     </div>
          {(isCreateOrEdit=="Create" || isCreateOrEdit=="Edit")?
          (<div id="createForResponsive" className={this.props.isCreateOrEdit == "Create" || this.props.isCreateOrEdit == "Edit" ?"":"display-none"}><CreateEvent isSaveInProgress={isSaveInProgress} activeUser={activeUser} onSaveClick={this.onSaveClick.bind(this)} isCreateOrEdit={isCreateOrEdit} upComingeventDetail={upComingeventDetail} teaTimesList={teaTimesList} getFiles={getFiles} people={people} /></div>):
          
          (<div id="upComingForResponsive" className={screen.width>769 || this.props.eventDisplay?"":"display-none"}><UpcomingEventDetails activeUser={activeUser} onRequestInviteClick={onRequestInviteClick} upComingeventDetail={upComingeventDetail} activeUser={activeUser} onButtonClick={onButtonClick} teaTimesList={teaTimesList} getFiles={getFiles} people={people}
                                          isFromAllEvents={this.props.isFromAllEvents}/></div>)}
    </div>);
  }
}

export default AllEventsTab;
