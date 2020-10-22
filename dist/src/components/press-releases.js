import React from 'react';
import moment from 'moment';

export default class PressReleases extends React.Component {	
	constructor() {
		super();
		this.state = {
			pageLink : "#",
			addClass : false
		}
		
		this._getDetailsPressReleases = this._getDetailsPressReleases.bind(this)
		this._showMore = this._showMore.bind(this)
		this._toggle = this._toggle.bind(this)
		this._changeHandler = this._changeHandler.bind(this)
	}
	
	_getDetailsPressReleases(event){
		event.preventDefault();
		console.log(this.props.pubid);
		const compId = event.target.dataset.componentid;
		var queryy = `query componentLink($namespaceId: Int!, $publicationId: Int!, $sourcePageId: Int, $targetComponentId: Int!, $excludeComponentTemplateId: Int, $renderRelativeLink: Boolean){
			componentLink(namespaceId: $namespaceId, publicationId: $publicationId, sourcePageId: $sourcePageId, targetComponentId: $targetComponentId, excludeComponentTemplateId: $excludeComponentTemplateId, renderRelativeLink: $renderRelativeLink) 
			{
				url
			}
		}`
		jQuery.ajax({
			method:"POST",
			data : JSON.stringify({ query: queryy, variables: {"namespaceId":1, "publicationId": this.props.pubid, "targetComponentId": compId, "renderRelativeLink": false }}),
			contentType: "application/json",
			url: `${location.origin}:8081/cd/api`,
			//url: `${location.origin}:8081/cd/api`,
			success: (responseData) => {
				console.log("Page Link: "+responseData.data.componentLink.url);
				this.setState({
					pageLink: responseData.data.componentLink.url
				})
				window.location = responseData.data.componentLink.url;
			}
		})		
	}
	
	_showMore(event){
		event.preventDefault();
		this.setState({ addClass:event.target.dataset.componentid })
	}
	_toggle(event){
		console.log(event);
		event.preventDefault();
		let targetStyle = event.target.parentElement.nextElementSibling.nextElementSibling.style.display;
		if(targetStyle == "none"){
			targetStyle = "block"
			this.setState({ addClass:event.target.dataset.componentid })
		} else {
			targetStyle = "none"
			this.setState({ addClass:'' })
		}	
	}
	_changeHandler(e) {
	   if (typeof this.props.onChange === 'function') {
		   this.props.onChange(e.target.name, e.target.id, e.target.checked);
	  }
	}
    render() {
		const categorystyle = {
			marginTop: '15px',
			display: 'inline-block',
			color:"#337ab7"
		},readmore = {
			display:'block',
			minHeight:'100%'
		},readless = {
			display:'none',
			transition: 'all 5s ease-in-out'
		},hideButton = {	
			display:'none'
		},showButton = {	
			display:'block'
		},cardBg = {
			backgroundColor: '#f5f5f5',
			border: '1px solid #e3e3e3',
			margin:'20px 0px',
			padding:'0',
			boxShadow: '#0c0602 3px 6px 6px -4px'
			
		},titlePadding = {
			padding:'10px 0'
		},titleFontColor = {
			color:'#337ab7'
		},categories = {
			background: '#dee2e6',
			padding: '2px',
			color: '#333',
			borderRadius: '2px',
			margin:'2px'
		}
    	const { pressReleases = [] } = this.props;   
	    if (!pressReleases.length) {
	    	//console.log("empty PR list!");
	      	return (<div className="col-md-12" id="searchResults">
	      				<h3 style={{paddingBottom:10}}>No results</h3>
	      		  </div>
	      	);	      		
	    }		 
	    
        return (
        	<div className="col-12" id="searchResults">      		
        		{pressReleases.map((pressRelease, i) => (  
        			<div className="col-12 card"style={cardBg} key={i}>
						<div className="card-body">
							{
								pressRelease.node.rawContent!==undefined ? 
									<span>
										<i className="fa fa-calendar" aria-hidden="true"></i>
										{
											moment(pressRelease.node.rawContent.data.Metadata.standardMeta.dateCreated).format('MMMM Do YYYY')
										}
									</span>
								: ''
							}
							
							{
								pressRelease.node.component!==undefined && pressRelease.node.component.title!==undefined ?
									<h2 style={titlePadding}>
										<a style={titleFontColor} 
											href={'#'} 
											data-componentid = {pressRelease.node.component.itemId} 
											onClick={this._toggle}>
											{
												pressRelease.node.component.title!==undefined ? pressRelease.node.component.title : ''
											}<br/>							
										</a>
									</h2>
								: ""
							}
							
							<p>
							{
								pressRelease.node.rawContent!==undefined ?
									pressRelease.node.rawContent.data.Content.articleBody.subheading : ''
							}
							</p>
							{
								pressRelease.node.component!==undefined ?							
									<div className='lead' 
										style = {this.state.addClass == pressRelease.node.component.itemId ? readmore : readless } 
										data-componentid = {pressRelease.node.component.itemId}
										dangerouslySetInnerHTML = {{__html: pressRelease.node.rawContent!==undefined ? pressRelease.node.rawContent.data.Content.articleBody.content.Fragments[0] : ''}}>
									</div>
									: ""
							}
							{
								pressRelease.node.component!==undefined && pressRelease.node.component.lastPublishDate!==undefined ? 
									<span> 
										<span style={titleFontColor}>Last Publish Date: </span>
										{moment(pressRelease.node.component.lastPublishDate).format('MMMM Do YYYY')} 
									</span>
								: ''
							}
							<br/>
							{
								pressRelease.node.component!==undefined && pressRelease.node.component.customMetas!==undefined ? 
									<div style={categorystyle} onClick={this._changeHandler}>
										{
											pressRelease.node.component.customMetas.edges[0].node.key == "classification" ? "Topics: " : ""
										}
										
										{	
											pressRelease.node.component.customMetas!==undefined ? 
												pressRelease.node.component.customMetas.edges.map((categoryTit, j) => 
													(categoryTit.node.key=="classification" ? 
														<span style={categories} key={j}>
															{
																categoryTit.node.value!==undefined ? categoryTit.node.value+" " : ''
															}
														</span> 
													: ''
													)
												)
											: ''
										}
									</div>
								: ''
							}
							
							{
								pressRelease.node.component!==undefined && pressRelease.node.component.itemId!==undefined ? 
									<a href="javascript:;" className="float-right btn btn btn-outline-primary" 
									style = {this.state.addClass == pressRelease.node.component.itemId ? hideButton : showButton } data-componentid = { pressRelease.node.component.itemId } onClick={this._showMore}>Read More</a>
								: ''
							}
							
						</div>
		            </div>	            
	            ))} 
            </div>
        );    	
    }
}