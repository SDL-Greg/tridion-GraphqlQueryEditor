import React from 'react';

export default class QueryEditor extends React.Component { 
	constructor(props) {
		super(props);
		this._queryHandler = this._queryHandler.bind(this);
	  }
	  
	  render() { 
		var teatArea = {
			fontSize: '18px',
			borderRadius:'5px',
			width:'100%'
		}
		var EditorHeading = {
			fontSize: '18px'
		}
    	const { query = [] } = this.props;

	    if (!query.length) {
	    	console.log("No query found!")
	      return null;
	    }
        return (
  				<div className="col-12">
					<div style={EditorHeading}>Component Presentations Graphql Query</div>
					<textarea rows="45" cols="100" style={teatArea} onChange={this._queryHandler} value={this.props.query}>
					</textarea>
				</div>
        );        

    }

    _queryHandler(e) {   	
    	//console.log("The textarea " + e.target.value + " is now ");    		
		if (typeof this.props.onChange === 'function') {
			this.props.onChange(e.target.value);
		}
    }  
}