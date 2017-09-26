import React, {Component} from 'react';
let tempEventId ="";
class EventListDetail extends Component{
    onEventClick(id){
       
        if(this.props.onEventClick){
            this.props.onEventClick(this.props.eventsList, id);
            //  console.log("eventiD",id);
        }
        if(screen.width<769)
        {
          $(".eventsPage .eventsRytSidePage").css("display","block !important");
        }
    }
    componentWillReceiveProps(){
      tempEventId = this.props.eventId;
      
    }

render(){
    const {eventDetail, onEventClick, eventsList, selectedEventId, eventId}=this.props;
    let tempSelectedEventId = selectedEventId;
    if(eventId){
       tempEventId = eventId;
       tempSelectedEventId = "";
    }
    else{
      tempEventId = tempSelectedEventId;
    }
  
    const is_private=this.props.eventDetail.is_private;
    return(<div className={(_.toInteger(tempEventId)!=undefined &&  (_.toInteger(tempEventId) == eventDetail.id)) ?("selected_element"):("EventsLink cursor-pointer")} >
                  <li onClick={this.onEventClick.bind(this, eventDetail.id)} className="noListStyle">
                      <div className="eventListTop">
                    <div className="eventDate">{eventDetail.start_date}</div>
                   <div className="priImg"><span className="privateTxt">{is_private?'Private':'Public'}</span></div>
                    </div>
                      <div className="eventListMiddle">
                        <div className="eventListName">{eventDetail.name}</div>
                          <div className="ElViewLink">View <span className="glyphicon glyphicon-menu-right"></span></div>
                        <div className="EventListDT">{eventDetail.start_time} - {eventDetail.end_time}</div>
                      </div>
                      <div className="attending">
                        <div className="friendAttend">{eventDetail.attendee_stats.attending} attending</div>
                        <div className="friendThumb"></div>
                      </div>
                  </li>
              </div>
    );
    }
}

export default EventListDetail;