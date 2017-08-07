import React, {Component} from 'react';



class GroupsList extends Component{
    
    
render(){
    
    return(<div className="col-sm-2">
            <div className="carousel-item active">
                <img src={"/assets/img/159265_6529393_1255282_79c13f28_image.png"} alt="" className="panelimg wd75pc m10px brd3black"/>
                <div className="txtcenter"><span className="txtwhite">{this.props.groupListDetails.name}</span></div>
            </div>
        </div>
    
    );
   
    }
}

export default GroupsList;
