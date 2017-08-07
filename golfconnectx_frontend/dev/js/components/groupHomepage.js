import React, {Component} from 'react';
import {render} from 'react-dom';
import{IMG_CONSTANT} from '../constants/application.constants';
import {groupList} from '../actions/groupListAction';
import GroupsList from './child-components/groupsList';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import {Link} from 'react-router';
import {React_Boostrap_Carousel} from 'react-boostrap-carousel';
import Spinner from 'react-spinner';


let imagePath=IMG_CONSTANT.IMAGE_PATH;
class GroupHomepage extends Component{
    constructor(props,context)
    {
        super(props);
        this.state={getGroupList:[], ajaxCallInProgress:false
        };
    }
     componentWillMount(){
       this.setState({ajaxCallInProgress:true});
        this.props.groupList(this.props.activeUser.token).then(()=>{
            this.setState({getGroupList:this.props.getGroupList.getgroups});
             this.setState({ajaxCallInProgress:false});
        }).catch((error)=>{
                 if(error == "Error: Request failed with status code 401"){
                 this.context.router.push('/');
            }
        });

    }
     componentDidMount() {
      $('.menu').parent().removeClass('active');
      $('#group').parent().addClass('active');
   }
   onForumClick(){
      this.context.router.push('/forumsPage');
    }
    componentWillReceiveProps(nextProps){
            if(this.props.getGroupList!=nextProps.getGroupList)
            {
                this.setState({getGroupList:nextProps.getGroupList.getgroups});
            }
    }

    onGroupClick(groupId){
          this.context.router.push('/groupMembers_'+groupId);
    }

    render(){
        return(<div className="groupHomepage">
             <div className="bgPic col-sm-12"><img src={imagePath+"bg_image.png"} className="bgimage"></img></div>
            <div className="col-sm-12">
            <div className="col-sm-4 paneltab">
                    <div className="panel panel-default col-sm-12">
                        <ul className="nav nav-pills panel-body col-sm-12">
                            <li className="active grptab text-center col-sm-6"><a className="pb1px">GROUPS</a></li>
                            <li className=" forumtab text-center col-sm-6" onClick={this.onForumClick.bind(this)}><a className="pb1px">FORUMS</a></li>
                        </ul>
                    </div>
                </div>
                </div>

            {(_.size(this.state.getGroupList)>0)?(<div className="row">
          <div>
          {(this.state.ajaxCallInProgress)?(<div className="mt25pc"><Spinner /></div>):(<div className="row">
          <div className="col-md-12">
          <React_Boostrap_Carousel indicators={(_.size(this.state.getGroupList)>0 && _.size(this.state.getGroupList[0])>=11)?true:false} animation={true} className="carousel-fade brdrs txtcenter">
          {this.state.getGroupList.map((parent, index)=>{
              return(<div key={index}>
                <div>{(index==0)?(
                   <Link to="/addgroup" className="col-md-3 txtdecNon">
                                <img src={"/assets/img/plus_icon-01.png"} alt="" className="panelimg  "/>
                                <br/><span className=" txtcenter m0px txtdecNon">Add Group</span>
                 </Link>):('')}</div>
                {parent.map((groupListDetails, childIndex)=>{
                return(

                   <div className="col-md-3" key={childIndex}>
                   <div onClick={this.onGroupClick.bind(this,groupListDetails.id)}>
                    <div className="cursor-pointer">
                      <img src={'http://'+groupListDetails.cover_image} className="panelimg"/>
                      <br/><span className="txtwhite txtcenter">{_.truncate(_.trim(groupListDetails.name), {
                        'length': 24,
                        'separator': ' '
                      })}</span>
                    </div>
                </div>
                </div>);
              })}</div>)
            })}

            </React_Boostrap_Carousel>
            </div></div>)}
          </div>
          </div>):(
            <div className="row">
            <div>
            <div className="row">
            <div className="col-md-12">
            <div><Link to="/addgroup" className="col-md-3 txtdecNon">
                                <img src={"/assets/img/plus_icon-01.png"} alt="" className="panelimg bgccc "/>
                                <br/><span className=" txtcenter ml13pc txtdecNon">Add Group</span>
                 </Link></div></div></div></div></div>)}
</div>);
    }
}

GroupHomepage.contextTypes = {
  router: React.PropTypes.object.isRequired
};


function mapStateToProps(state) {
    return {
        getGroupList: (state.getgroupList!=undefined && state.getgroupList!=null)?state.getgroupList:[],
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
        selectedGroup:state.selectedGroup
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({groupList}, dispatch);
}

export default  connect(mapStateToProps, matchDispatchToProps)(GroupHomepage);
