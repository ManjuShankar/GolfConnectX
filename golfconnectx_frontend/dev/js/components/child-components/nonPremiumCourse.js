import React, {Component} from 'react';
import GoogleMap from 'google-map-react';
import Marker from '../marker';
import {isExistObj} from '../../utils/functions';
let c = 0;
class NonPremiumCourse extends Component{
    constructor(props,context){
        super(props,context);
        this.state={classname:""
                   }

    }

    OnUnfollow(){
      if(this.props.OnUnfollow){
        this.props.OnUnfollow();
      }
    }
    componentDidMount(){
         $('#nonPremium').show();     
    }
    
    
  //   leftViewToggle(){
  //     alert("from nonPremium");
  //     let width = window.innerWidth;
  //     if(width<992){   
  //     $('.lftPart').fadeIn();
  //     $('#nonPremium').hide();
  //       this.state.classname="nonPremium";
  //       if(this.props.append){
  //           //alert(this.state.classname);
  //           this.props.append(this.state.classname);
  //            //$('.nonPremium').show();
  //       }

  //   }
  // }

render(){
    return(
      <div>{
       ((_.size(this.props.courseDetails)>0)?(<div id="nonPremium"><div  className="col-sm-12 col-md-8 nonPremium bgfff  pdlftryt0px col-xs-12">
          { /* <span className="glyphicon glyphicon-chevron-left float-left"  ></span>
          <div className="col-sm-12 pdlftryt0px col-xs-12 courseSelRspns">
          </div>*/ }
        <div className="col-sm-12 zeroPad">
        <div className="col-sm-12 zeroPad hgt180px">
        <div className="imgGolf col-sm-12 zeroPad"><img src="/assets/img/nonPremBanner.jpg" className="col-sm-12"/></div>
          <div className="col-sm-12">
                <div className="following nonPrefollowing">
        {((_.size(this.props.courseDetails)>0 && isExistObj(this.props.courseDetails.course_user_details) && this.props.courseDetails.course_user_details.is_following)?(<span><span className="OrangeDot"><img src="/assets/img/icons/eclipse.png"/></span>Following</span>):(<span className="clrTrnsparnt">following</span>))}</div>
                  <div className="NonPremiumPlayed">{((_.size(this.props.courseDetails)>0 && isExistObj(this.props.courseDetails.course_user_details) && this.props.courseDetails.course_user_details.is_played)?(<span>Played</span>):(<span className="clrTrnsparnt">following</span>))}
                  </div>
          </div>
          {isExistObj(this.props.courseDetails.course) && <div className="col-sm-12 top35pc"><div className="coursesTitle">{this.props.courseDetails.course.name}</div></div>}
           {isExistObj(this.props.courseDetails.course) && <div className="courseAdd">{this.props.courseDetails.course.address1}</div>}

            <div className="col-sm-6 mt5pc txtcenter mt1pc">

            </div>
            <div className="col-sm-6 mt1pc zeroPad courseMobileNum">
                {isExistObj(this.props.courseDetails.course) && <span className="coursePhone  col-sm-12 txtRyt">{this.props.courseDetails.course.phone}</span>}
            </div>
            </div>
            <div className="col-sm-12">
              <div className="col-sm-3 zeroPad">
                <button onClick={this.OnUnfollow.bind(this)} className="btn_followCourse">
                {(_.size(this.props.courseDetails)>0 && isExistObj(this.props.courseDetails.course_user_details) && this.props.courseDetails.course_user_details.is_following)?'Unfollow Course':'Follow Course'}</button>
              </div>
            </div>
            <div className="col-sm-12 map  NonPremiumMap">
      <GoogleMap
        center={{lat: (_.size(this.props.courseDetails)>0 && isExistObj(this.props.courseDetails.course))?this.props.courseDetails.course.lat:0, lng: (_.size(this.props.courseDetails)>0)?this.props.courseDetails.course.lon:0}}
         defaultZoom={14}>
        <Marker lat={(_.size(this.props.courseDetails)>0 && isExistObj(this.props.courseDetails.course))?this.props.courseDetails.course.lat:0} lng={(_.size(this.props.courseDetails)>0)?this.props.courseDetails.course.lon:0}/>
      </GoogleMap>
      </div>
      <div className="col-sm-12 nonPremiumModal">
      <button className="upgradeToPremium" data-toggle="modal" data-target="#myModal">Upgrade to Premium</button>
       <div className="modal fade" id="myModal" role="dialog">
    <div className="modal-dialog wd100pc ">
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal">&times;</button>
          <span className="modal-title nonPrem">Have your course upgrade and become a premium course</span>
        </div>
        <div className="modal-body">
          {isExistObj(this.props.courseDetails.course) && <p className="fnt17px">Have your course contact Golf Connectx by sending an email to <a href={"mailto:" + this.props.courseDetails.course.email}>{this.props.courseDetails.course.email}</a> to get more information.</p>}
          <center className="FtrBnfit">Features and Benefits</center>
          <ul className="featureList">
          <li className="fnt20px clr44b54a"><span className="fnt15px clrBlack">Ability to customize your content and photos.</span></li>
          <li className="fnt20px clr44b54a"><span className="fnt15px clrBlack">Ability to organize and manage groups that play outof your course  + Men's, Women's, Jr's Sr's, etc ALL ON ONE PAGE.</span></li>
          <li className="fnt20px clr44b54a"><span className="fnt15px clrBlack">Ability to organize and manage course events includingcharity, corporate, member member, member guest, etc ALL ON ONE PAGE.</span></li>
          <li className="fnt20px clr44b54a"><span className="fnt15px clrBlack">Premier page Ads to generate income.</span></li>
          <li className="fnt20px clr44b54a"><span className="fnt15px clrBlack">See GolfConnectx users and get reports for users who follow your course and have your course as a favorite.</span></li>
          <li className="fnt20px clr44b54a"><span className="fnt15px clrBlack">Have access to View all the groups and events that select your course as home course or event course.</span></li>
          </ul>
        </div>
        <div className="modal-footer">
          <button type="button" className="ModalClose" data-dismiss="modal">CLOSE</button>
        </div>
      </div>
    </div>
  </div></div>
  </div>
        </div> </div>):(<div></div>))}</div>
    
    );
    }
}

export default NonPremiumCourse;
