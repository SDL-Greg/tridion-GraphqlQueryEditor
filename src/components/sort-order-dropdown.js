import React from 'react';

export default class SortOrderDropdown extends React.Component { 
constructor(props) {
    super(props);
   
    this._changeHandler = this._changeHandler.bind(this);
  }

    render() {     	
        return (
               <select className="form-control" onChange={this._changeHandler}>
                  <option key="1" value="">Sort results by...</option>
                  <option key="2" value="TITLE Ascending">A-Z</option>                          
                  <option key="3" value="CREATION_DATE Ascending">Latest First</option>  
                  <option key="5" value="CREATION_DATE Descending">Oldest First</option>
                  <option key="6" value="LAST_PUBLISH_DATE Ascending">Latest Published</option>
                  <option key="7" value="LAST_PUBLISH_DATE Descending">Oldest Published</option>
                  <option key="8" value="TITLE Descending">Z-A</option>
              </select>
              )               
    }
    
    _changeHandler(e) {   	
    	//console.log("The sort order " + e.target.name + " is now " + e.target.value);    		
	        if (typeof this.props.onChange === 'function') {
	            this.props.onChange(e.target.value);
	        }
    	}
}