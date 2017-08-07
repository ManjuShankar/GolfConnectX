import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';




class App extends Component{
    constructor(props, context){
        super(props, context);
    }

    render(){
        return(<div>
               App
               </div>);
    }
}

App.contextTypes = {
  router: React.PropTypes.object
};


function mapStateToProps(state) {
    return {
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(App);
