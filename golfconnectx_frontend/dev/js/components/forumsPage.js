import React from 'react';
import { Link } from 'react-router';
import{IMG_CONSTANT} from '../constants/application.constants';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

let imagePath=IMG_CONSTANT.IMAGE_PATH;
class ForumsPage extends React.Component{
  constructor(props) {
    super(props);
  }
  onGroupClick(){
      this.context.router.push('/groups');
      $(".Gsearch").hide();
      $(".searchBtn").hide();
    }
    onCourseClick(){
        this.context.router.push('/forumCourse_');
        if(screen.width<769)
      {
        $(".MobileNav").hide();
        $(".Gsearch").hide();
      $(".searchBtn").hide();
      
       }
    }
    onForumExceptCourseClick(forumType){
      this.context.router.push('/forumExceptCourse_'+ forumType);
      if(screen.width<769)
      {
        $(".MobileNav").hide();
        $(".Gsearch").hide();
      $(".searchBtn").hide();
      
       }
    }
sliderRespons(){
  
    $('.symbols-two, .twos').fadeIn();
    $('.symbols-one, .ones').hide();
    $('.bubbles ul li').removeClass('bubble_active');
    $('#bubble2').addClass('bubble_active');
      
}
sliderRespons1(){
  
    $('.symbols-one, .ones').fadeIn();
    $('.symbols-two, .twos').hide();
    $('#bubble1').addClass('bubble_active');
    $('#bubble2').removeClass('bubble_active');

      
}
   componentDidMount() {
      $('.menu').parent().removeClass('active');
      }
  render() {

    return (
        <div className="forumsPage ">
          <div className="header_group col-sm-12 zeroPad display">                 
            <h3 className="col-sm-11 grpbg">GROUPS</h3>
          </div>
            
             <div className="bgPic"><img src={imagePath+"bg_image.png"} className="bgimage" /></div>
             <div className=" col-sm-12 pdlftryt0px">


                <div className="col-md-4 paneltab">
                    <div className="panel panel-default col-sm-12">
                        <ul className="nav nav-pills panel-body col-sm-12">
                            <li className="grptab text-center col-sm-6" onClick={this.onGroupClick.bind(this)}><a >GROUPS</a></li>
                            <li className="active forumtab text-center col-sm-6"><a >FORUMS</a></li>
                        </ul>
                    </div>
                </div>

             <div className="col-sm-12 mt2pc pdd_5">
             <div className="col-sm-12 zeroPad">
                <div className="col-md-3"></div>
                <div className="icons col-md-9 pdng">
                  <div className="col-sm-12 pdng marglft1pc">
                  <div className="category">
                    <span className="glyphicon glyphicon-chevron-left let_arrow curPntr" onClick={this.sliderRespons1.bind(this)}/>
                    <span className="category_Name">category (<span className="ones">1</span><span className="twos">2</span> of 2)</span>
                    <span className="glyphicon glyphicon-chevron-right right_arrow curPntr" onClick={this.sliderRespons.bind(this)}/>
                  </div>
                  <div className="bubbles">
                    <ul>
                      <li className="bubble bubble_active" id="bubble1"></li>
                      <li className="bubble" id="bubble2"></li>
                    </ul>

                  </div>





                   <div className="symbols-one col-md-6">
                    <div className="icon-one col-sm-12 pdng">
                     <div className="waterImg col-sm-12 pdng curPntr"onClick={this.onForumExceptCourseClick.bind(this, 1)} >
                        <img src={imagePath+"dots_bg-01 (1).png"} className="forumBox" />
                        <span className="xx col-sm-12 pdng">
                            <span className="brdr skyblue pdlft0px col-sm-2"><img src="/assets/img/icons/WaterCooler.png" className="wd30px" /></span>
                            <span className="icon-name skyblue size-a pdng40px col-sm-10">Water Cooler</span>
                        </span>
                     </div>
                     <div className="coursesImg col-sm-12 pdng curPntr" onClick={this.onCourseClick.bind(this)}>
                        <img src={imagePath+"dots_bg-01 (1).png"} className="forumBox" />
                        <span className="xx col-sm-12 pdng">
                            <span className="brdr green pdlft0px col-sm-2"><img src="/assets/img/icons/Courses.png" /></span>
                            <span className="icon-name green size-b col-sm-10 pdng40px" >courses</span>
                        </span>
                     </div>
                     <div className="equipImg col-sm-12 pdng curPntr" onClick={this.onForumExceptCourseClick.bind(this, 2)}>{/*onClick={this.onEquipmentClick.bind(this)}*/}
                        <img src={imagePath+"dots_bg-01 (1).png"} className="forumBox" />
                        <span className="xx col-sm-12 pdng">
                            <span className="brdr  blueviolet pdlft0px col-sm-2"><img src="/assets/img/icons/Equipment.png" /></span>
                            <span className="icon-name blueviolet size-c col-sm-10 pdng40px">equipment</span>
                        </span>
                     </div>
                     <div className="instrImg col-sm-12 pdng curPntr" onClick={this.onForumExceptCourseClick.bind(this, 3)}>
                        <img src={imagePath+"dots_bg-01 (1).png"} className="forumBox" />
                        <span className="xx col-sm-12 pdng">
                            <span className="brdr blue pdlft0px col-sm-2"><img src="/assets/img/icons/Tips.png" /></span>
                            <span className="icon-name blue size-d col-sm-10">instruction & Playing Tips</span>
                        </span>
                     </div>
                     <div className="rulesImg col-sm-12 pdng curPntr" onClick={this.onForumExceptCourseClick.bind(this, 4)}>
                        <img src={imagePath+"dots_bg-01 (1).png"} className="forumBox" />
                        <span className="xx col-sm-12 pdng">
                            <span className="brdr brown pdlft0px col-sm-2"><img src="/assets/img/icons/Rules.png" /></span>
                            <span className="icon-name brown size-e col-sm-10 ">rules & golf etiquette</span>
                        </span>
                     </div>
                    </div>
                   </div>
                   <div className="symbols-two col-md-6">
                    <div className="icon-two col-sm-12 pdlft0px">
                        <div className="holeImg col-sm-12 pdng curPntr dsplyInln" onClick={this.onForumExceptCourseClick.bind(this, 5)}>
                            <img src={imagePath+"dots_bg-01 (1).png"} className="forumBox" />
                            <span className="xx col-sm-12 pdng">
                                <span className="brdr purple pdlft0px col-sm-2"><img src="/assets/img/icons/19thHole.png" /></span>
                                <span className="icon-name purple size-f pdng40px col-sm-10">19th Hole</span>
                            </span>
                        </div>
                        <div className="localImg col-sm-12 pdng curPntr dsplyInln" onClick={this.onForumExceptCourseClick.bind(this, 6)}>
                            <img src={imagePath+"dots_bg-01 (1).png"} className="forumBox" />
                            <span className="xx col-sm-12 pdng">
                                <span className="brdr orange pdlft0px col-sm-2"><img src="/assets/img/icons/GetLocal.png" /></span>
                                <span className="icon-name orange size-g pdng40px col-sm-10">Get Local</span>
                            </span>
                        </div>
                        <div className="travelImg col-sm-12 pdng curPntr dsplyInln" onClick={this.onForumExceptCourseClick.bind(this, 7)}>
                            <img src={imagePath+"dots_bg-01 (1).png"} className="forumBox" />
                            <span className="xx col-sm-12 pdng">
                                <span className="brdr lime pdlft0px col-sm-2"><img src="/assets/img/icons/GolfTravel.png" className="wd30px" /></span>
                                <span className="icon-name lime size-h pdng40px col-sm-10">Golf travel</span>
                            </span>
                        </div>
                        <div className="proImg col-sm-12 pdng curPntr dsplyInln" onClick={this.onForumExceptCourseClick.bind(this, 8)}>
                            <img src={imagePath+"dots_bg-01 (1).png"} className="forumBox" />
                            <span className="xx col-sm-12 pdng">
                                <span className="brdr ashgreen pdlft0px pdtpbt1pc col-sm-2"><img src="/assets/img/icons/Discussion.png" className="ht28px" /></span>
                                <span className="icon-name ashgreen size-i col-sm-10">Pro & am discussion</span>
                            </span>
                        </div>
                        <div className="exercisImg col-sm-12 pdng curPntr dsplyInln" onClick={this.onForumExceptCourseClick.bind(this, 9)}>
                            <img src={imagePath+"dots_bg-01 (1).png"} className="forumBox" />
                            <span className="xx col-sm-12 pdng">
                                <span className="brdr violet pdlft0px col-sm-2"><img src="/assets/img/icons/Fitness.png" className="wd27px" /></span>
                                <span className="icon-name violet size-j col-sm-10">fitness & exercise</span>
                            </span>
                        </div>

                    </div>
                   </div>
                  </div>
                 </div>
                </div>
                <div className="col-sm-12"></div>
                <div className="col-sm-12"></div>
                <div className="col-sm-12"></div>
                
             </div>
            </div>
            <div className="adidasRow col-sm-12 pdlftryt0px nopadding">
                  <div className="col-sm-4"></div>
                    <div className="adsimg col-sm-12 col-md-5">
                        <img src="/assets/img/golfconnectx_ad.png" className="adidas col-sm-12" />
                    </div>
                    <div className="col-sm-3"></div>
                </div>
</div>
         );
   }
}

ForumsPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};
export default ForumsPage;
