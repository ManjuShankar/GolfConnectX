import React, {Component} from "react";

import  DayNames from "./DayNames";
import  Week  from "./Week";

import moment from 'moment';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {calendarEvents, calendarDates} from '../../actions/eventDetailsAction';

class Calendar extends Component{
 constructor(props){
     super();
     this.state={
     month: moment(),
     selectedNew : [],
     nextMonthCal :{}
    };
  }

previous(){
    let month = this.state.month;
    let preMonth = month.add(-1, "M");
    preMonth = preMonth._d.getMonth() + 1;
    let year = month._d.getFullYear();
    this.state.nextMonthCal = [{"month" :preMonth,"year":year}];
    this.setState({ month: month });
    this.props.calendarDates(this.props.activeUser.token, preMonth, year).then(()=>{
        this.setState({selectedNew:this.props.eventReducer.CalendarDates});
    }).catch((error)=>{

   });
}

 next() {
    let month = this.state.month;
    let nextMonth =  month.add(1, "M");
    nextMonth = nextMonth._d.getMonth() + 1
    let year = month._d.getFullYear();
    this.state.nextMonthCal = [{"month" :nextMonth,"year":year }];
    this.setState({ month: month  }) ;

    this.props.calendarDates(this.props.activeUser.token,nextMonth, year).then(()=>{
      this.setState({selectedNew:this.props.eventReducer.CalendarDates});
    }).catch((error)=>{

   });
  }

  select(day){
    this.props.selFunc(day);
    this.forceUpdate();
  }

  componentWillMount(){
    this.props.calendarEvents(this.props.activeUser.token).then(()=>{
          this.setState({calendar:this.props.eventReducer.CalendarEvents});
    }).catch((error)=>{

    });
  }

  componentWillReceiveProps(nextProps){
    if(this.props.eventReducer!=nextProps.eventReducer){
      this.setState({selectedNew:nextProps.eventReducer.CalendarDates})
    }
  }

  render() {
    return (
    <div className="calenderEvents">
    <div className="container-fluid">
    <div className="row">
    <div className="col-sm-12">
      <div className="col-sm-12 pd0px brdr2pxcc">
        <div className="header">
        <i className="glyphicon glyphicon-chevron-left" onClick={this.previous.bind(this)}></i>
        {this.renderMonthLabel()}
        <i className="glyphicon glyphicon-chevron-right rytArw" onClick={this.next.bind(this)}></i>
      </div>
      <DayNames />
      {this.renderWeeks()}
    </div>
  </div>
  </div>
  </div>
  </div>
    );
  }

  renderWeeks() {
      let weeks = [],
      done = false,
      date = this.state.month.clone().startOf("month").add("w" -1).day("Sunday"),
      monthIndex = date.month(),
      count = 0;
      let j=0, k=0;
      while (!done) {
          let tempj=0, newdate = date.clone();
          for(let i = 0; i < 7; i++){
              if(newdate.isSame(this.state.selectedNew[k])){
              tempj++;
              k++;
          }
          newdate.add(1,"d");
    }

    weeks.push(<Week key={count} date={date.clone()} month={this.state.month} select={this.select.bind(this)} selected={this.state.selectedNew} selectedDay={this.props.selectedDay} />);
    date.add(1, "w");
    done = count++ > 2 && monthIndex != date.month();
    monthIndex = date.month();
    j=j+tempj;
 }
  return weeks;
}

  renderMonthLabel() {
      return <span>{this.state.month.format("MMMM, YYYY")}</span>;
  }
}

Calendar.contextTypes = {
  router: React.PropTypes.object.isRequired
};


function mapStateToProps(state) {
    return {
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
        eventReducer:state.eventReducer
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({calendarDates, calendarEvents}, dispatch);
}

export default  connect(mapStateToProps, matchDispatchToProps)(Calendar);
