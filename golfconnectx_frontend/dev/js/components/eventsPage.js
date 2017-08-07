import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import {Link} from 'react-router';
import _ from 'lodash';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {eventDetails, getCurrentEvent, calendarEvents, onDayEvents, getTeaTimes, getPeopleList,  getAllEventsList, allcalendarEvents, allonDayEvents} from '../actions/eventDetailsAction';
import {createEvents, editEvents} from '../actions/createEventAction';
import EventsTab from './child-components/eventsTab';
import CreateEvent from './child-components/createEvent';
import Spinner from 'react-spinner';
import Calendar from './child-components/calendarExample';

import AllEventsTab from './child-components/alleventsTab';
import AllCalendar from './child-components/allcalendarExample';

class EventsPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
                    currentEventList:[],
                    pastEventList:[],
                    dayEvents:[],
                    nextDayEvents:[],
                    upComingeventDetail: {},
                    isCreateOrEdit: "Upcoming",
                    ajaxCallInProgress:false,
                    isSaveInProgress:false,
                    calendar:[],
                    day1:moment().format("MM/DD/YYYY"),
                    day2:moment().add(1,"d").format("MM/DD/YYYY"),
                    dispDay1 : "",
                    dispDay2 : "",
                    highlight:"",
                    selectedDay:moment().format("MM/DD/YYYY"),
                    selectedIndexForTab: 0,
                    teaTimesList: [],
                    people: {},
                    publicEvents:[],
                    publicUpComingeventDetail:{},
                    publicTeaTimesList:[],
                    publicPeople:{},
                    selectedIndexForPublicTab: 0,
                    dispDay1ForPublic: "",
                    dispDay2ForPublic: "",
                    calendatForPublic: [],
                    dayEventsForPublic: [],
                    nextdayEventsForPublic: [],
                    allTeaTimesList: [],
                    selectedDayForPublic: moment().format("MM/DD/YYYY"),
                    highlightForPublic: "",
                    day1ForPublic:moment().format("MM/DD/YYYY"),
                    day2ForPublic:moment().add(1,"d").format("MM/DD/YYYY"),
                    eventId:'',
                    isPastEvent: false
        };
        this.onEventClick=this.onEventClick.bind(this);
        this.onPublicEventClick=this.onPublicEventClick.bind(this);
    }

    getEventsList(){
      this.setState({ajaxCallInProgress:true});
      this.props.eventDetails(this.props.activeUser.token).then(()=>{
          this.setState({currentEventList:this.props.eventList.CurrentEvents,
            pastEventList:this.props.eventList.PastEvents});
           if(this.props.params.id!=undefined){
                this.getEvent(_.toInteger(this.props.params.id));
                let isEventPresentInUpcoming = _.some(this.state.currentEventList, ['id', _.toInteger(this.props.params.id)]);
                if(!isEventPresentInUpcoming){
                  this.setState({selectedIndexForTab:1});
                }
            }
            this.setState({ajaxCallInProgress:false});
          }).catch((error)=>{
              if(error == "Error: Request failed with status code 401"){
              this.context.router.push('/');
          }
          this.setState({ajaxCallInProgress:false});
      });

      /* Public Events */
       this.props.getAllEventsList(this.props.activeUser.token).then(()=>{
          this.setState({publicEvents:this.props.eventList.PublicEvents});
      }).catch((error)=>{
          if(error == "Error: Request failed with status code 401"){
           this.context.router.push('/');
          }
          this.setState({ajaxCallInProgress:false});
      });
    }

    componentWillMount(){
        this.getEventsList();
    }

    componentWillReceiveProps(nextProps){
            if(this.props.eventList.CurrentEvents!=nextProps.eventList.CurrentEvents){
                this.setState({currentEventList:nextProps.eventList.CurrentEvents});
            }
            if(this.props.eventList.PastEvents!=nextProps.eventList.PastEvents){
                this.setState({pastEventList:nextProps.eventList.PastEvents});
            }
            if(_.size(this.state.upComingeventDetail)==0 && _.size(this.state.currentEventList)>0 && this.props.params.id==undefined){
              this.getEvent(this.state.currentEventList[0].id);
            }
            if(this.props.eventList.PublicEvents!=nextProps.eventList.PublicEvents){
                this.setState({publicEvents:nextProps.eventList.PublicEvents});
            }
            if(_.size(this.state.publicUpComingeventDetail)==0 && _.size(this.state.publicEvents)>0 && this.props.params.id==undefined){
                this.getPublicSelectedEvent(this.state.publicEvents[0].id);
            }
      }

    onCalendarEventClick(id){
      this.context.router.push("/events_"+ id);
      location.reload();
    }

    onTabClick(currentTab=1){
      if(currentTab==2){
        this.setState({isPastEvent:true});
      }else{
        this.setState({isPastEvent:false});
      }
      if(currentTab==1 && _.size(this.state.currentEventList)>0){
        this.setState({selectedIndexForTab:0});
        this.getEvent(this.state.currentEventList[0].id);
     }
      else if(currentTab==2 && _.size(this.state.pastEventList)>0){
            this.setState({selectedIndexForTab:1});
            this.getEvent(this.state.pastEventList[0].id);
     }
      else if(currentTab==3){
        this.setState({selectedIndexForTab:2});
        let eventDate1 = moment(this.state.day1).format("MM/DD/YYYY");
         let dispTodayDate = moment(eventDate1).format("MMMM Do");
         let eventDate2 = moment(this.state.day2).format("MM/DD/YYYY");
         let dispTomoDate = moment(eventDate2).format("MMMM Do");
         this.setState({dispDay1 : dispTodayDate, dispDay2 : dispTomoDate});
         this.props.calendarEvents(this.props.activeUser.token).then(()=>{
            this.setState({calendar:this.props.eventList.CalendarEvents});
                this.props.onDayEvents(this.props.activeUser.token,eventDate1).then(()=>{
                    this.setState({dayEvents : this.props.eventList.onDayEventDetails});
                });
                this.props.onDayEvents(this.props.activeUser.token,eventDate2).then(()=>{
                    this.setState({nextDayEvents : this.props.eventList.onDayEventDetails});
                });

          }).catch((error)=>{
      });
    }else if(currentTab==1 && _.size(this.state.currentEventList)==0) {
      this.setState({selectedIndexForTab:0});
      this.setState({upComingeventDetail:{}});
    }else if(currentTab==2 && _.size(this.state.pastEventList)==0){
        this.setState({selectedIndexForTab:1});
        this.setState({upComingeventDetail:{}});
    }
}
     onPublicTabClick(currentTab=1){
      if(currentTab==1 && _.size(this.state.publicEvents)>0){
        this.setState({selectedIndexForPublicTab:0});
        this.getPublicSelectedEvent(this.state.publicEvents[0].id);
     }
      else if(currentTab==3){
        this.setState({selectedIndexForPublicTab:1});
         let eventDate1 = moment(this.state.day1).format("MM/DD/YYYY");
         let dispTodayDate = moment(eventDate1).format("MMMM Do");
         let eventDate2 = moment(this.state.day2).format("MM/DD/YYYY");
         let dispTomoDate = moment(eventDate2).format("MMMM Do");
         this.setState({dispDay1ForPublic : dispTodayDate, dispDay2ForPublic : dispTomoDate});
         this.props.calendarEvents(this.props.activeUser.token, true).then(()=>{
            this.setState({calendatForPublic:this.props.eventList.CalendarDates});
                this.props.onDayEvents(this.props.activeUser.token,eventDate1, true).then(()=>{
                    this.setState({dayEventsForPublic : this.props.eventList.onDayEventDetails});
                });
                this.props.onDayEvents(this.props.activeUser.token,eventDate2, true).then(()=>{
                    this.setState({nextdayEventsForPublic : this.props.eventList.onDayEventDetails});
                });

          }).catch((error)=>{
      });
    }else if(currentTab==1 && _.size(this.state.publicEvents)==0) {
      this.setState({selectedIndexForPublicTab:0});
      this.setState({publicUpComingeventDetail:{}});
    }
}

    getFiles(){
      this.props.getTeaTimes(this.props.selectedEvent.id, this.props.activeUser.token).then((data)=>{
          this.setState({teaTimesList: data});
      }).catch((error)=>{

      });
    }

    getAllFiles(){
      this.props.getTeaTimes(this.props.selectedEventForPublic.id, this.props.activeUser.token).then((data)=>{
          this.setState({allTeaTimesList: data});
      }).catch((error)=>{

      });
    }

    getEvent(eventId){
    
      this.props.getCurrentEvent(eventId, this.props.activeUser.token).then(()=>{
        
        this.setState({upComingeventDetail:this.props.selectedEvent,
          eventId:this.props.selectedEvent.id});
        this.props.getTeaTimes(this.props.selectedEvent.id, this.props.activeUser.token).then((data)=>{
            this.setState({teaTimesList: data});
        }).catch((error)=>{

        });
        this.props.getPeopleList(this.props.selectedEvent.id, this.props.activeUser.token).then((data)=>{
          this.setState({people: data});
        }).catch((error)=>{

        });
      }).catch((error)=>{
      });
    }

    getPublicSelectedEvent(eventId){
      this.props.getCurrentEvent(eventId, this.props.activeUser.token, true).then(()=>{
        this.setState({publicUpComingeventDetail:this.props.selectedEventForPublic, eventId:this.props.selectedEventForPublic.id});
        this.props.getTeaTimes(this.props.selectedEventForPublic.id, this.props.activeUser.token).then((data)=>{
            this.setState({publicTeaTimesList: data});
        }).catch((error)=>{

        });
        this.props.getPeopleList(this.props.selectedEventForPublic.id, this.props.activeUser.token).then((data)=>{
          this.setState({publicPeople: data});
        }).catch((error)=>{

        });
      }).catch((error)=>{
      });
    }

    onEventClick(eventsList, eventId){
        this.getEvent(eventId);
        this.setState({isCreateOrEdit: "Upcoming"});
    }
    onPublicEventClick(eventsList, eventId){
        this.getPublicSelectedEvent(eventId);
        this.setState({isCreateOrEdit: "Upcoming"});
    }

   onSaveClick(formData){
     this.setState({isSaveInProgress:true});
     if(this.state.isCreateOrEdit=="Create"){
      this.props.createEvents(formData, this.props.activeUser.token).then(()=>{
        this.setState({isCreateOrEdit: "Upcoming"});
        this.setState({isSaveInProgress:false});
        this.props.eventDetails(this.props.activeUser.token).then(()=>{
            this.setState({currentEventList:this.props.eventList.CurrentEvents, pastEventList:this.props.eventList.PastEvents});
            this.getEvent(this.props.eventList.CurrentEvents[0].id);
            if(this.state.selectedIndexForTab==2){
              this.setState({selectedIndexForTab:6});
              this.setState({selectedIndexForTab:2});
          }
        }).catch((error)=>{
        });
      }).catch((error)=>{
        this.setState({isSaveInProgress:false});
      });
     }
     else {
       this.props.editEvents(formData,this.state.upComingeventDetail.id, this.props.activeUser.token).then(()=>{
         this.setState({isCreateOrEdit: "Upcoming"});
         this.setState({isSaveInProgress:false});
         this.props.eventDetails(this.props.activeUser.token).then(()=>{
             this.setState({currentEventList:this.props.eventList.CurrentEvents, pastEventList:this.props.eventList.PastEvents});
             this.getEvent(this.props.eventList.CurrentEvents[0].id);
         }).catch((error)=>{
         });
       }).catch((error)=>{
         this.setState({isSaveInProgress:false});
       });
     }
   }

   onSaveAllClick(formData){
     this.setState({isSaveInProgress:true});
     if(this.state.isCreateOrEdit=="Create"){
      this.props.createEvents(formData, this.props.activeUser.token).then(()=>{
        this.setState({isCreateOrEdit: "Upcoming"});
        this.setState({isSaveInProgress:false});
        this.props.eventDetails(this.props.activeUser.token).then(()=>{
            this.setState({publicEvents:this.props.eventList.PublicEvents});
         
            this.onPublicEventClick(this.props.eventList.PublicEvents, this.props.eventList.PublicEvents[0].id);
            if(this.state.selectedIndexForPublicTab==1){
              this.setState({selectedIndexForPublicTab:6});
              this.setState({selectedIndexForPublicTab:1});
          }
        }).catch((error)=>{
        });
      }).catch((error)=>{
        this.setState({isSaveInProgress:false});
      });
     }
     else {
       this.props.editEvents(formData,this.state.publicUpComingeventDetail.id, this.props.activeUser.token).then(()=>{
         this.setState({isCreateOrEdit: "Upcoming"});
         this.setState({isSaveInProgress:false});
         this.props.eventDetails(this.props.activeUser.token).then(()=>{
             this.setState({publicEvents:this.props.eventList.PublicEvents});
             this.onPublicEventClick(this.props.eventList.PublicEvents, this.props.eventList.PublicEvents[0].id);
         }).catch((error)=>{
         });
       }).catch((error)=>{
         this.setState({isSaveInProgress:false});
       });
     }
   }

    onButtonClick(val){
      this.setState({isCreateOrEdit:val});
        $("#MyEvents").trigger('click');
    }

    onPublicEventButtonClick(val){
            this.setState({isCreateOrEdit:val});
            $("#MyAllEvents").trigger('click');
    }

    onRequestInviteClick(){

    }

     selectOne(day){
          let currentDay1 = day.date.format("MM/DD/YYYY");
          this.setState({highlight : currentDay1});
          let displayDay1 =moment(currentDay1).format("MMMM Do");
          let currentDay2 = day.date.add(1,"d").format("MM/DD/YYYY");
          let displayDay2 = moment(currentDay2).format("MMMM Do");
          this.setState({isCreateOrEdit:"Upcoming"});
          this.setState({selectedDay: day.date.add(-1, "d").format("YYYY-MM-DD")});

          this.setState({
            day1 : currentDay1, day2: currentDay2,
            dispDay1: displayDay1, dispDay2: displayDay2
          });
          this.props.onDayEvents(this.props.activeUser.token,currentDay1).then(()=> {
              this.setState({dayEvents : this.props.eventList.onDayEventDetails})
          });
          this.props.onDayEvents(this.props.activeUser.token,currentDay2).then(()=>{
            this.setState({nextDayEvents : this.props.eventList.onDayEventDetails});
         });
     }

     selectOneAll(day){
          let currentDay1 = day.date.format("MM/DD/YYYY");
          this.setState({highlightForPublic : currentDay1});
          let displayDay1 =moment(currentDay1).format("MMMM Do");
          let currentDay2 = day.date.add(1,"d").format("MM/DD/YYYY");
          let displayDay2 = moment(currentDay2).format("MMMM Do");
          this.setState({isCreateOrEdit:"Upcoming"});
          this.setState({selectedDayForPublic: day.date.add(-1, "d").format("YYYY-MM-DD")});

          this.setState({
            day1ForPublic : currentDay1, day2ForPublic : currentDay2,
            dispDay1ForPublic: displayDay1, dispDay2ForPublic: displayDay2
          });
          this.props.onDayEvents(this.props.activeUser.token,currentDay1).then(()=> {
              this.setState({dayEventsForPublic : this.props.eventList.onDayEventDetails})
          });
         this.props.onDayEvents(this.props.activeUser.token,currentDay2).then(()=>{
            this.setState({nextdayEventsForPublic : this.props.eventList.onDayEventDetails});
         });
     }

    componentDidMount() {
        $('.menu').parent().removeClass('active');
        $('#event').parent().addClass('active');
   }

   previousDaysAll(day1, day2){
        let previousDay1 = moment(day1).add(-2,"d").format("MM/DD/YYYY");
        let displayPrevDay1 = moment(previousDay1).format("MMMM Do");

        let previousDay2 = moment(day2).add(-2,"d").format("MM/DD/YYYY");
        let displayPrevDay2 = moment(previousDay2).format("MMMM Do");

        this.setState({selectedDayForPublic: moment(day1).add(-2,"d").format("YYYY-MM-DD")});

        this.setState({
          day1ForPublic : previousDay1, day2ForPublic : previousDay2,
          dispDay1ForPublic: displayPrevDay1, dispDay2ForPublic: displayPrevDay2
        });

          this.props.onDayEvents(this.props.activeUser.token,previousDay1).then(()=> {
              this.setState({dayEventsForPublic : this.props.eventList.onDayEventDetails})
          });

         this.props.onDayEvents(this.props.activeUser.token,previousDay2).then(()=>{
            this.setState({nextdayEventsForPublic : this.props.eventList.onDayEventDetails});
         });
    }

    previousDays(day1, day2){
        let previousDay1 = moment(day1).add(-2,"d").format("MM/DD/YYYY");
        let displayPrevDay1 = moment(previousDay1).format("MMMM Do");

        let previousDay2 = moment(day2).add(-2,"d").format("MM/DD/YYYY");
        let displayPrevDay2 = moment(previousDay2).format("MMMM Do");

        this.setState({selectedDay: moment(day1).add(-2,"d").format("YYYY-MM-DD")});

        this.setState({
          day1 : previousDay1, day2 : previousDay2,
          dispDay1: displayPrevDay1, dispDay2: displayPrevDay2
        });

          this.props.onDayEvents(this.props.activeUser.token,previousDay1).then(()=> {
              this.setState({dayEvents : this.props.eventList.onDayEventDetails})
          });

         this.props.onDayEvents(this.props.activeUser.token,previousDay2).then(()=>{
            this.setState({nextDayEvents : this.props.eventList.onDayEventDetails});
         });
    }

nextDaysAll(day1, day2){
      let nextDay1 = moment(day1).add(2,"d").format("MM/DD/YYYY");
      let displayNextDay1 = moment(nextDay1).format("MMMM Do");
      this.setState({selectedDayForPublic: moment(day1).add(2,"d").format("YYYY-MM-DD")});
      let nextDay2 = moment(day2).add(2,"d").format("MM/DD/YYYY");
      let displayNextDay2 = moment(nextDay2).format("MMMM Do");
      this.setState({
        day1ForPublic : nextDay1 , day2ForPublic : nextDay2,
        dispDay1ForPublic: displayNextDay1, dispDay2ForPublic: displayNextDay2
      });

      this.props.onDayEvents(this.props.activeUser.token,nextDay1).then(()=> {
          this.setState({dayEventsForPublic : this.props.eventList.onDayEventDetails})
      });

     this.props.onDayEvents(this.props.activeUser.token,nextDay2).then(()=>{
            this.setState({nextdayEventsForPublic : this.props.eventList.onDayEventDetails});
     });
    }

    nextDays(day1, day2){
      let nextDay1 = moment(day1).add(2,"d").format("MM/DD/YYYY");
      let displayNextDay1 = moment(nextDay1).format("MMMM Do");
      this.setState({selectedDay: moment(day1).add(2,"d").format("YYYY-MM-DD")});
      let nextDay2 = moment(day2).add(2,"d").format("MM/DD/YYYY");
      let displayNextDay2 = moment(nextDay2).format("MMMM Do");
      this.setState({
        day1 : nextDay1 , day2 : nextDay2,
        dispDay1: displayNextDay1, dispDay2: displayNextDay2
      });

      this.props.onDayEvents(this.props.activeUser.token,nextDay1).then(()=> {
          this.setState({dayEvents : this.props.eventList.onDayEventDetails})
      });

     this.props.onDayEvents(this.props.activeUser.token,nextDay2).then(()=>{
            this.setState({nextDayEvents : this.props.eventList.onDayEventDetails});
     });
    }

    onMainTabClick(mainTabNum){
      ///this.getEventsList();
      if(mainTabNum==1){
        if(_.size(this.props.eventList.CurrentEvents)>0){
            this.getEvent(this.props.eventList.CurrentEvents[0].id);
            this.setState({selectedIndexForTab:0});
        }else{
          this.setState({upComingeventDetail:null});
          this.setState({selectedIndexForTab:0});
        }
      }else{
            if(_.size(this.props.eventList.PublicEvents)>0){
                this.getPublicSelectedEvent(this.props.eventList.PublicEvents[0].id);
            }else{
              this.setState({publicUpComingeventDetail:null});
              this.setState({selectedIndexForPublicTab:0});
            }
      }
      this.setState({isPastEvent:false});
    }

    render(){
        return(<div className="eventsPage">
                <div className="leftBody">
                  <div className="coursesContainnerEvent">
                    <div className="eventsHeader">
                    <img src="/assets/img/SecondHalf.png" />
                    </div>
                    <Tabs className="mt-43px">
                    <TabList className="m0px tabLayout">
                    <Tab onClick={this.onMainTabClick.bind(this, 1)} className="hgt43px tabStyles" id="MyEvents">My Events</Tab>
                    <Tab onClick={this.onMainTabClick.bind(this, 2)} className="hgt43px tabStyles">All Events</Tab>
                    </TabList>
                      <TabPanel>
                          <div className="coursesContent">
                            <div className="tabsForEvents">
                              <Tabs selectedIndex={this.state.selectedIndexForTab}>
                                <TabList className="EventsTabHeader">
                                  <Tab onClick={this.onTabClick.bind(this, 1)}>Upcoming</Tab>
                                  <Tab onClick={this.onTabClick.bind(this, 2)}>Past</Tab>
                                  <Tab onClick={this.onTabClick.bind(this, 3)}>Calendar</Tab>
                                      {(this.state.isCreateOrEdit=="Edit")?(<span></span>):(<span><button onClick={this.onButtonClick.bind(this, "Create")} className="btn-createEvent">+ Create Event</button></span>)}
                                </TabList>
                                <TabPanel>{(this.state.ajaxCallInProgress)?(<div><Spinner /></div>):(
                                    <EventsTab  isSaveInProgress={this.state.isSaveInProgress}
                                      onButtonClick={this.onButtonClick.bind(this)} isPastEvent={this.state.isPastEvent}
                                      onRequestInviteClick={this.onRequestInviteClick.bind(this)} onSaveClick={this.onSaveClick.bind(this)}
                                      eventsList={this.state.currentEventList} onEventClick={this.onEventClick} upComingeventDetail={this.state.upComingeventDetail}
                                      isCreateOrEdit={this.state.isCreateOrEdit} activeUser={this.props.activeUser} selectedEventId={this.props.params.id}
                                      people={this.state.people} getFiles={this.getFiles.bind(this)} teaTimesList={this.state.teaTimesList} eventId={this.state.eventId}
                                      />
                                )}</TabPanel>
                                <TabPanel>
                                    <EventsTab isSaveInProgress={this.state.isSaveInProgress} isPastEvent={this.state.isPastEvent}
                                    onRequestInviteClick={this.onRequestInviteClick.bind(this)}
                                    onSaveClick={this.onSaveClick.bind(this)}
                                    eventsList={this.state.pastEventList}
                                    onEventClick={this.onEventClick}
                                    upComingeventDetail={this.state.upComingeventDetail}
                                    isCreateOrEdit={this.state.isCreateOrEdit}
                                    activeUser={this.props.activeUser}
                                    selectedEventId={this.props.params.id}
                                    teaTimesList={this.state.teaTimesList}
                                    getFiles={this.getFiles.bind(this)} people={this.state.people} eventId={this.state.eventId}/>
                                </TabPanel>
                                <TabPanel>
                                    <div className="col-sm-12 bgfff zeroPad">
                                      <div className="col-sm-4 pdtb3lr0">
                                          <Calendar selFunc={this.selectOne.bind(this)} highlight = {this.state.highlight}  selectedDay={this.state.selectedDay} />
                                      </div>
                                      {(this.state.isCreateOrEdit=="Create")?<div className="col-sm-8 cal_createEvent"><EventsTab isCreateOrEdit={this.state.isCreateOrEdit} onSaveClick={this.onSaveClick.bind(this)} teaTimesList={this.state.teaTimesList} getFiles={this.getFiles.bind(this)} people={this.state.people} isPastEvent={this.state.isPastEvent} /></div>:(<div className="col-sm-8 pdtb3lr0 bgddd">
                                        <div className="col-sm-12 zeroPad ovrflwhgt">
                                          <div className="col-sm-12 zeroPad">
                                            <ul className="calender_Alignment col-sm-12">
                                              <li className="calender_Date col-sm-6 txtcenter active">
                                                <div className="col-sm-12 brdrbtmActive zeroPad">
                                                  <span className="glyphicon glyphicon-chevron-left leftFloat col-sm-1 zeroPad" onClick={this.previousDays.bind(this, this.state.day1, this.state.day2)}></span>
                                                  <span className="col-sm-11">
                                                      <a href="#calendarcurrentDate">
                                                          {this.state.dispDay1}
                                                      </a>
                                                  </span>
                                                </div>
                                              </li>
                                              <li className="calender_Date col-sm-6 txtcenter">
                                                <div className="col-sm-12 zeroPad brdrbtmGray">
                                                  <span className="col-sm-11 ">
                                                      <a href="#calenderNxtDate">
                                                        {this.state.dispDay2}
                                                      </a>
                                                  </span>
                                                  <span className="glyphicon glyphicon-chevron-right rightFloat col-sm-1 zeroPad" onClick={this.nextDays.bind(this, this.state.day1, this.state.day2)}></span>
                                              </div>
                                            </li>
                                        </ul>
                                      </div>
                                      <div className="col-sm-12">
                                        <div className="col-sm-6 active" id="calendarcurrentDate">
                                          <div className="col-sm-12 calender_content">
                                              {this.state.dayEvents!=undefined && this.state.dayEvents!=null && _.size(this.state.dayEvents)!=0?
                                                this.state.dayEvents.map((item,index)=>{
                                                  return(<div className="thumbnail bgeee" key={index}>
                                                    <div>
                                                    {item.cover_image!=null?(<div className="calendarEventImage">
                                                    <img className="hero__background" />
                                                    <center><img className=" eventImgForCalendar" src={'http://'+item.cover_image.image} /></center>
                                                    </div>):<div></div>}
                                                    <div className="caption">
                                                        <span onClick={this.onCalendarEventClick.bind(this, item.id)} className="eventName cursor-pointer">{item.name}</span><br/>
                                                        <span className="eventVenue">{item.venue}</span><br/>
                                                        <span>{item.address1}</span><br/>
                                                        <span>{item.start_time}-{item.end_time}</span>
                                                    </div>
                                                    {item.selected_group!=null?<div className="col-sm-12">
                                                    <img src={'http://'+item.selected_group.image_url} className="grpImage col-sm-2 zeroPad"/>
                                                    <div className="col-sm-10">
                                                      <Link to={"groupMembers_"+item.selected_group.id}><span className=" col-sm-12 fnt18px">{item.selected_group.name}</span></Link>
                                                          <br/>
                                                      <span className=" col-sm-12 fnt14px">{item.is_private?'Private Event':'Public Event'}</span>
                                                    </div>
                                                </div>:<div></div>}
                                                <div className="ml10px">
                                                  Details
                                                    <p>{item.description}</p>
                                                </div>
                                            </div>
                                        </div>)}):<div className="calenderDate_details">No Events on this Day</div>}
                                      </div>
                                  </div>
                                  <div className="col-sm-6" id="calenderNxtDate">
                                    <div className="col-sm-12 calender_content">
                                      {/*<div className="col-sm-12">No posts displayed</div>*/}
                                        {this.state.nextDayEvents!=undefined && this.state.nextDayEvents!=null && _.size(this.state.nextDayEvents)!=0?
                                            this.state.nextDayEvents.map((item,index)=>{
                                                    return(<div className="thumbnail  bgeee " key={index}>
                                                    <div>
                                                      {item.cover_image!=null?<div className="calendarEventImage">
                                                        <img className="hero__background"  />
                                                        <center><img className="eventImgForCalendar" src={'http://'+item.cover_image.image} /></center>
                                                       </div>:<div></div>}
                                                       <div className="caption">
                                                        <span onClick={this.onCalendarEventClick.bind(this, item.id)} className="eventName cursor-pointer">{item.name}</span><br/>
                                                        <span className="eventVenue">{item.venue}</span><br/>
                                                        <span>{item.address1}</span><br/>
                                                        <span>{item.start_time}-{item.end_time}</span>
                                                      </div>
                                                      {item.selected_group!=null?<div className="col-sm-12">
                                                        <img src={'http://'+item.selected_group.image_url} className="grpImage col-sm-2 zeroPad"/>
                                                        <div className="col-sm-10">
                                                          <Link to={"groupMembers_"+item.selected_group.id}><span className=" col-sm-12 fnt18px">{item.selected_group.name}</span></Link>
                                                          <br/>
                                                          <span className=" col-sm-12 fnt14px">{item.is_private?'Private Event':'Public Event'}</span>
                                                        </div>
                                                      </div>:<div></div>}
                                                    <div>
                                                      Details
                                                      <p>{item.description}</p>
                                                  </div>
                                              </div>
                                          </div>)}):<div className="calenderDate_details">No Events on this Day</div>}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>)} {/* event details of calendar close*/}
                              </div>
                              </TabPanel>
                        </Tabs>
                   </div>
                 </div>
                </TabPanel>
                <TabPanel>
                 <div className="coursesContent">
                  <div className="tabsForEvents">
                    <Tabs selectedIndex={this.state.selectedIndexForPublicTab}>
                     <TabList className="EventsTabHeader">
                        <Tab onClick={this.onPublicTabClick.bind(this, 1)}>Upcoming</Tab>
                        <Tab onClick={this.onPublicTabClick.bind(this, 3)}>Calendar</Tab>
                         {(this.state.isCreateOrEdit=="Edit")?(<span></span>):(<span><button onClick={this.onPublicEventButtonClick.bind(this, "Create")} className="btn-createEvent">+ Create Event</button></span>)}
                     </TabList>
                     <TabPanel>{(this.state.ajaxCallInProgress)?(<div className=""><Spinner /></div>):(
                      <AllEventsTab isCreateOrEdit={this.state.isCreateOrEdit} onRequestInviteClick={this.onRequestInviteClick.bind(this)} onSaveClick={this.onSaveAllClick.bind(this)} onButtonClick={this.onButtonClick} eventsList={this.state.publicEvents} onEventClick={this.onPublicEventClick} upComingeventDetail={this.state.publicUpComingeventDetail}  activeUser={this.props.activeUser} selectedEventId={this.props.params.id}
                        getFiles={this.getAllFiles.bind(this)} teaTimesList={this.state.allTeaTimesList} eventId={this.state.eventId} isFromAllEvents={true}/>
                       )}
                     </TabPanel>
                     <TabPanel>
                      <div className="col-sm-12 bgfff zeroPad">
                       <div className="col-sm-4 pdtb3lr0">
                         <AllCalendar selFunc={this.selectOneAll.bind(this)} highlight = {this.state.highlightForPublic}  selectedDay={this.state.selectedDayForPublic} />
                        </div>
                         {(this.state.isCreateOrEdit=="Create")?<div className="col-sm-8 cal_createEvent"><AllEventsTab isCreateOrEdit={this.state.isCreateOrEdit} onSaveClick={this.onSaveAllClick.bind(this)} teaTimesList={this.state.allTeaTimesList} getFiles={this.getAllFiles.bind(this)} people={this.state.publicPeople} /></div>:(<div className="col-sm-8 pdtb3lr0 bgddd">
                         <div className="col-sm-12 zeroPad ovrflwhgt">
                                          <div className="col-sm-12 zeroPad">
                                            <ul className="calender_Alignment col-sm-12">
                                              <li className="calender_Date col-sm-6 txtcenter active">
                                                <div className="col-sm-12 brdrbtmActive zeroPad">
                                                  <span className="glyphicon glyphicon-chevron-left leftFloat col-sm-1 zeroPad" onClick={this.previousDaysAll.bind(this, this.state.day1ForPublic, this.state.day2ForPublic)}></span>
                                                  <span className="col-sm-11">
                                                      <a href="#calendarcurrentDate">
                                                          {this.state.dispDay1ForPublic}
                                                      </a>
                                                  </span>
                                                </div>
                                              </li>
                                              <li className="calender_Date col-sm-6 txtcenter">
                                                <div className="col-sm-12 zeroPad brdrbtmGray">
                                                  <span className="col-sm-11 ">
                                                      <a href="#calenderNxtDate">
                                                        {this.state.dispDay2ForPublic}
                                                      </a>
                                                  </span>
                                                  <span className="glyphicon glyphicon-chevron-right rightFloat col-sm-1 zeroPad" onClick={this.nextDaysAll.bind(this, this.state.day1ForPublic, this.state.day2ForPublic)}></span>
                                              </div>
                                            </li>
                                        </ul>
                                      </div>
                                      <div className="col-sm-12">
                                        <div className="col-sm-6 active" id="calendarcurrentDate">
                                          <div className="col-sm-12 calender_content">
                                              {this.state.dayEventsForPublic!=undefined && this.state.dayEventsForPublic!=null && _.size(this.state.dayEventsForPublic)!=0?
                                                this.state.dayEventsForPublic.map((item,index)=>{
                                                  return(<div className="thumbnail bgeee" key={index}>
                                                    <div>
                                                    {item.cover_image!=null?(<div className="calendarEventImage">
                                                    <img className="hero__background" />
                                                    <center><img className=" eventImgForCalendar" src={'http://'+item.cover_image.image} /></center>
                                                    </div>):<div></div>}
                                                    <div className="caption">
                                                        <span onClick={this.onCalendarEventClick.bind(this, item.id)} className="eventName cursor-pointer">{item.name}</span><br/>
                                                        <span className="eventVenue">{item.venue}</span><br/>
                                                        <span>{item.address1}</span><br/>
                                                        <span>{item.start_time}-{item.end_time}</span>
                                                    </div>
                                                    {item.selected_group!=null?<div className="col-sm-12">
                                                    <img src={'http://'+item.selected_group.image_url} className="grpImage col-sm-2 zeroPad"/>
                                                    <div className="col-sm-10">
                                                      <Link to={"groupMembers_"+item.selected_group.id}><span className=" col-sm-12 fnt18px">{item.selected_group.name}</span></Link>
                                                      <br/>
                                                      <span className=" col-sm-12 fnt14px">{item.is_private?'Private Event':'Public Event'}</span>
                                                    </div>
                                                </div>:<div></div>}
                                                <div className="ml10px">
                                                  Details
                                                    <p>{item.description}</p>
                                                </div>
                                            </div>
                                        </div>)}):<div className="calenderDate_details">No Events on this Day</div>}
                                      </div>
                                  </div>
                                  <div className="col-sm-6" id="calenderNxtDate">
                                    <div className="col-sm-12 calender_content">
                                        {this.state.nextdayEventsForPublic!=undefined && this.state.nextdayEventsForPublic!=null && _.size(this.state.nextdayEventsForPublic)!=0?
                                            this.state.nextdayEventsForPublic.map((item,index)=>{
                                                    return(<div className="thumbnail  bgeee " key={index}>
                                                    <div>
                                                      {item.cover_image!=null?<div className="calendarEventImage">
                                                        <img className="hero__background"  />
                                                        <center><img className="eventImgForCalendar" src={'http://'+item.cover_image.image} /></center>
                                                       </div>:<div></div>}
                                                       <div className="caption">
                                                        <span onClick={this.onCalendarEventClick.bind(this, item.id)} className="eventName cursor-pointer">{item.name}</span><br/>
                                                        <span className="eventVenue">{item.venue}</span><br/>
                                                        <span>{item.address1}</span><br/>
                                                        <span>{item.start_time}-{item.end_time}</span>
                                                      </div>
                                                      {item.selected_group!=null?<div className="col-sm-12">
                                                        <img src={'http://'+item.selected_group.image_url} className="grpImage col-sm-2 zeroPad"/>
                                                        <div className="col-sm-10">
                                                          <Link to={"groupMembers_"+item.selected_group.id}><span className=" col-sm-12 fnt18px">{item.selected_group.name}</span></Link>
                                                          <br/>
                                                          <span className=" col-sm-12 fnt14px">{item.is_private?'Private Event':'Public Event'}</span>
                                                        </div>
                                                      </div>:<div></div>}
                                                    <div>
                                                      Details
                                                      <p>{item.description}</p>
                                                  </div>
                                              </div>
                                          </div>)}):<div className="calenderDate_details">No Events on this Day</div>}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>)}
                              </div>
                              </TabPanel>
                        </Tabs>
                   </div>
                 </div>
                    </TabPanel>
                 </Tabs>
              </div>
            </div>
          </div>);
    }
}

EventsPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
        eventList: (state.eventReducer!=null)?state.eventReducer:[],
        selectedEvent: state.selectedEvent,
        selectedEventForPublic: state.selectedAllEvent
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({eventDetails, createEvents, editEvents, getCurrentEvent, calendarEvents, onDayEvents, getTeaTimes, getPeopleList,  getAllEventsList, allcalendarEvents, allonDayEvents}, dispatch);
}

export default  connect(mapStateToProps, matchDispatchToProps)(EventsPage);
