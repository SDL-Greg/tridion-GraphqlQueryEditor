import React from 'react';

export default class SearchBox extends React.Component {
constructor(props) {
    super(props);
    this.state = {
        searchKeyword: ""
    };

    this._changeHandler = this._changeHandler.bind(this);
    this._clickHandler = this._clickHandler.bind(this);
  }

    render() {
    return (
            <div className="row">
                <form role="form" autoComplete="off">
                    <div className="form-group col-12">
                        <input type="text" size="500" className="form-control" 
                        id="searchKeyword" 
                        placeholder="Filter results or press search to run a query" 
                        onChange={this._changeHandler} 
                        value={this.state.searchKeyword} autoComplete='off'/>
                    </div>
                    <div className="form-group col-12 text-center">
                        <button className="btn btn-outline-secondary btn-lg px-5" onClick={this._clickHandler}>Search</button>
                    </div>
                </form>
            </div>
        );
    }

    _changeHandler(e){                
        this.setState({searchKeyword: e.target.value})
            if (typeof this.props.onChange === 'function') {
                    this.props.onChange(e.target.value);
            }
    }

    _clickHandler(e){
        //prevent default form submit to avoid page reload
        e.preventDefault();               
            if (typeof this.props.onClick === 'function') {
                    this.props.onClick(this.state.searchKeyword);
            }
    }

}
