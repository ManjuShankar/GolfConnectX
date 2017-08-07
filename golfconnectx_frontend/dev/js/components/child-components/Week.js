import React, {Component} from 'react';

import _ from 'lodash';
import moment from 'moment';

class Week extends Component{
   constructor(props){
        super();
        this.state={
         selectedEventDates:(_.size(props.selected)>0)?(Object.assign([], props.selected)):([]),
         date: props.date,
         selectedDay: moment(props.selectedDay).format("YYYY-MM-DD")
       };
     }

   componentWillMount(){
     this.setState({selectedEventDates:this.props.selected});
   }

   componentWillReceiveProps(nextProps){
      if(this.props.date!=nextProps.date){
        this.setState({date:nextProps.date});
      }
      if(this.props.selected!=nextProps.selected){
           this.setState({selectedEventDates:nextProps.selected});
       }
   }

   returnFlag(calFinalDay){
     return (_.find(this.state.selectedEventDates, function(n) { let isHighLight =  (n == calFinalDay); return isHighLight; }))
   }

   returnHighLighted(calFinalDay){
     let propsSelectedDay = _.trim(this.props.selectedDay);
     let calFinDay = _.trim(calFinalDay);
      if(propsSelectedDay==calFinalDay){
        return true;
      }else{
        return false;
      }
   }

   select(day){
     if(this.props.select){
       this.props.select(day);
     }
   }

   render(){
     let days = [],
     date = this.state.date,
     month = this.props.month;
     for (let i = 0; i < 7; i++) {
      let calDate = (date.date().toString().length==1)?("0" + (date.date()).toString()):(date.date().toString());
      let calMonth = ((month.month()+1).toString().length==1)?("0"+ (month.month()+1).toString()):((month.month()+1).toString());
      let calYear = date.year().toString();
      let calFinalDay = calYear + "-" + calMonth + "-" + calDate;
     let day = {
       number: date.date(),
       isCurrentMonth: date.month() === month.month(),
       isToday: date.isSame(new Date(), "day"),
       isHigh: this.returnFlag(calFinalDay),
       date: date,
       isSelectedDate: this.returnHighLighted(calFinalDay)
     };
     days.push(<span key={day.date.toString()}
                className={"day" + (day.isToday ? " today" : "") + (day.isCurrentMonth ? "" : " different-month") + (day.isHigh? " highlighted selected":"") + (day.isSelectedDate?" bgGreen ":"")}
                onClick={this.select.bind(this,day)}>{day.number}</span>);
                date = date.clone();
                date.add(1, "d");
    }
    
    if(_.size(days)>0){
        return(<div className="week dates" key={days[0].toString()}>{days}</div>);
    }else{
        return;
    }
 }
}

export default Week;
