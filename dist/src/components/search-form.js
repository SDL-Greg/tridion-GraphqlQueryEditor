import React from 'react';
import jQuery from 'jquery';
import SearchBox from './search-box'
import Taxonomies from './taxonomies'
import PressReleases from './press-releases'
import SortOrderDropdown from './sort-order-dropdown'
import InfiniteScroll from './InfiniteScroll'
import componentPresentationsQuery from '../queries/componentPresentationsQuery'
import SiteMapSubTree from '../queries/SiteMapSubTree'
import PublicationMapping from '../queries/publicationMapping'
import QueryEditor from './query-editor'

export default class SearchForm extends React.Component {
	constructor() {
		super();
		//templateId on master=9871
		//templateId on aws dev=3844
		this.state = {
			taxonomies: [],
			selectedTaxonomies: [],
			pressReleases: [],
			pressReleasesBackup:[],
			sortOrder: "CREATION_DATE Descending",
			sortStatus:"",
			publicationId:9,
			schemaId: 90,
			templateId: 1555,
			siteUrl:"http://tridion.sdldemo.com",
			dateRange: "",
			start: "2000-01-01T04:36:12+05:30",
			end: moment().format(),
			hasMore: true,
			pageSize: 10,
			startPage: 0,
			loaderText: "Loading...",
			resetInfiniteScroll: false,
			searchTerm: "",
			lastNode:"",
			categoryId:2164,
			keywordId:0, //15269
			defaultKeywordId:0,
			componentPresentationsQuery: componentPresentationsQuery.loc.source.body
		};    

		this._changeHandler = this._changeHandler.bind(this)
		//this._taxonomiesDropdownClickHandler = this._taxonomiesDropdownClickHandler.bind(this);
		this._sortOrderDropdownChangeHandler = this._sortOrderDropdownChangeHandler.bind(this)
		this._searchBoxChangeHandler = this._searchBoxChangeHandler.bind(this)
		this._searchBoxClickHandle = this._searchBoxClickHandle.bind(this)
		this.onScroll = this.onScroll.bind(this)
		this._localStorageUpdated = this._localStorageUpdated.bind(this)
		this._queryHandler = this._queryHandler.bind(this)
	}

	componentWillMount() {
			if(localStorage.getItem('gquery')=="null" || localStorage.getItem('gquery')==null){
				localStorage.setItem("gquery", this.state.componentPresentationsQuery)
			}
			this._fetchPublicationId()
			//this._fetchPressReleases()
			//this._fetchTaxonomies()
	} 

	componentDidMount(){		
		window.addEventListener('storage', this._localStorageUpdated)
		const start = moment().subtract(29, 'days');
		const end = moment();

		$('input[name="daterange"]').daterangepicker({
			"applyClass": "btn-primary",
			"alwaysShowCalendars": true,
			autoUpdateInput: false,
			locale: {
			  cancelLabel: 'Clear'
			},
			startDate: start,
				endDate: end,
				ranges: {
				   'Today': [moment(), moment()],
				   'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
				   'Last 7 Days': [moment().subtract(6, 'days'), moment()],
				   'Last 30 Days': [moment().subtract(29, 'days'), moment()],
				   'This Month': [moment().startOf('month'), moment().endOf('month')],
				   'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
			   
			}
		}, this.cb.bind(this));

		//initialize date picker with e.g. last 30 days
		//cb(start, end);

		$('input[name="daterange"]').on('apply.daterangepicker', function(ev, picker) {
			$(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
		});

		$('input[name="daterange"]').on('cancel.daterangepicker', function() {
			$(this).val('');
		});
		window.addEventListener('scroll', this.onScroll, false);
	}	
	onScroll() {
		if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)) {
			if(this.state.pressReleases.length!==0){
				this.state.lastNode= this.state.pressReleases[this.state.pressReleases.length-1].cursor
			}
		}
	}
	_getRandomKey(){
		return (Math.floor(Math.random() * (5000 - 1)) + 1)
	}

	cb(start, end) {
		$('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
		console.log("daterangepicker callback:" + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
		this.setState({
		  start: moment(start, 'YYYY-MM-DD HH:mm').format(),
		  end: moment(end, 'YYYY-MM-DD HH:mm').format(), 
		  dateRange: start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY')
		});
		console.log(moment(start, 'YYYY-MM-DD HH:mm').format());
		this.setState({ pressReleases: [], resetInfiniteScroll: true })         
		//this._fetchPressReleases(0)
		this._fetchPublicationId()
		this.setState( {resetInfiniteScroll: false, key: this._getRandomKey() } )
	}
	
	_localStorageUpdated(){
			var localVal = localStorage.getItem('gquery')
			if(localStorage.getItem('gquery')=="null" || localStorage.getItem('gquery')==null){
				localStorage.setItem("gquery", this.state.componentPresentationsQuery)				
			} else {
				localStorage.setItem("gquery", localVal)
				this.setState({
					componentPresentationsQuery : localVal
				})
			}
            
			this._fetchPressReleases(0) 
    }
	
	_queryHandler(gqlquery){
		if(gqlquery.length!=0){
			this.setState({
				componentPresentationsQuery: gqlquery
			}, () => { 
				this._fetchPressReleases(0)
			})
			
		}		
	}
	
	_searchBoxClickHandle(searchKeyword){    
		console.log(" _searchBoxClickHandlersearchKeyword=" + searchKeyword)    

		this.setState({ pressReleases: [], resetInfiniteScroll: true, searchTerm: searchKeyword})    
		this._fetchPressReleases(0, searchKeyword)
		this.setState( {resetInfiniteScroll: false, key: this._getRandomKey() } )
	}

	_searchBoxChangeHandler(searchKeyword){
		if(!searchKeyword)
		  {
			 this.setState({ pressReleases: [] })
		   //this.setState({ pressReleases: this.state.pressReleasesBackup})
		   //this._fetchPressReleases(0)
			this._fetchPublicationId()
		  }else{
			const pressReleases = this.state.pressReleases.filter(pressRelease => pressRelease.node.component.title.toLowerCase().indexOf(searchKeyword) > -1)
			this.setState({ pressReleases })
		  }
	}

	/*_taxonomiesDropdownClickHandler(){
      //enable to display new taxonomies on the fly. however it alters performance, since it adds many queries
      //alternatively add a timer to call this every x seconds      
      this._fetchTaxonomies()
	}*/

	_changeHandler(title, taxId, selected){ 
		this.state.lastNode = ""
		const taxonomy= {
			id: taxId,
			title: title
		}

		if(selected){ 
			this.state.selectedTaxonomies.push(taxonomy)
			this.state.keywordId = parseInt(taxId)		
		}else{			      
				const NewTaxonomies = this.state.selectedTaxonomies.filter(taxonomy => taxonomy.id !== taxId);
				this.state.selectedTaxonomies = NewTaxonomies;
				this.state.keywordId = this.state.defaultKeywordId;
		}	  
		this.setState({ pressReleases: [], resetInfiniteScroll: true}) 
		this.state.lastNode = "";
		this.state.hasMore = true;
		//this._fetchPressReleases(0) 
		this._fetchPublicationId()

		this.setState( {resetInfiniteScroll: false, key: this._getRandomKey() } )
	}
	
	_sortOrderDropdownChangeHandler(sortOrder){   
		this.state.sortOrder = sortOrder;
		//if(this.state.sortStatus===""){
		this.state.lastNode = "";
		//}
		//this.state.sortStatus = sortOrder;
		this.state.hasMore = true;
		//this.setState({ pressReleases: [], resetInfiniteScroll: true, hasMore:true}, this._fetchPressReleases(0)) 
		this.setState({ pressReleases: [], resetInfiniteScroll: true, hasMore:true}, this._fetchPublicationId()) 

		this.setState( {resetInfiniteScroll: false, key: this._getRandomKey() } )  
	}
	
	// Added below promise to setState for multilanguage issue
	_setStateAsync(state) {
	  return new Promise((resolve) => {
		this.setState(state, (this._fetchPressReleases))
		this._fetchTaxonomies()
	  });
	}
	
	// Added below method to fix multilanguage issue 
	_fetchPublicationId(){
		//console.log("Site Url: "+ window.location.href)
		
		// fetching query from external js file 		
		const query = "`"+PublicationMapping.loc.source.body+"`";
		
		const siteUrl = "http://sdldemo.com/en" //window.location.href
		//const siteUrl = window.location.href
		/*var query = `query publicationMapping($namespaceId: Int!, $siteUrl: String!) {
					  publicationMapping(namespaceId: $namespaceId, siteUrl: $siteUrl){
						publicationId
					  }
					}`*/
		jQuery.ajax({
			method:'POST',
			data: JSON.stringify({
				query: query,
					variables: {
						"namespaceId": 1,
						"siteUrl": siteUrl
					}
			}),
			url: `${this.state.siteUrl}:8081/cd/api`,
			contentType: "application/json",
			success: (publicationResponse) => {
				console.log("_fetchPublicationId "+publicationResponse.data.publicationMapping.publicationId);
				this.setState({
					publicationId: publicationResponse.data.publicationMapping.publicationId
				})
				return this._setStateAsync({
					publicationId: publicationResponse.data.publicationMapping.publicationId
				})
			}, error:(e) => {
				console.log("error: "+e);
			}
		})
	}
	
	_fetchTaxonomies(){
		var query = "`"+SiteMapSubTree.loc.source.body+"`";
		//const query = "`"+localStorage.getItem('gqquery')+"`";
		//console.log(query);
		jQuery.ajax({
			method: 'POST',			
			data: JSON.stringify({ 
				query:	query, 
						variables:{
							"namespaceId": 1,
							"publicationId": this.state.publicationId,//this.props.pubId,
							"taxonomyNodeId": "t2164" //"t"+this.state.categoryId.toString(),							
						}
					}),

			//url: `${location.origin}:8081/cd/api`,
			url: `${this.state.siteUrl}:8081/cd/api`,
			//url:`http://tridion.sdldemo.com:8081/cd/api`,
			contentType: "application/json",
			success: (taxonomies) => {
				
				this.setState({ taxonomies:taxonomies.data.sitemapSubtree[0].items })
				console.log("retrieved taxonomies ok");
			}, error:(e) => {
				console.log("error: "+e);
			}
		});
	}
	_fetchPressReleases(page = 0, searchKeyword = ""){ 
		const selectedTaxonomyIds = this.state.selectedTaxonomies.map(taxonomy => taxonomy.id)
		console.log("current pagination = " + page);

		//set search term from state for additional pages
		if(page>0 && searchKeyword === "")
		{
			searchKeyword = this.state.searchTerm
		}		
		var query = this.state.componentPresentationsQuery
		//console.log(query)
		jQuery.ajax({
			method: 'POST',
			data: JSON.stringify({ 
				query: 	query// this.state.componentPresentationsQuery,
				}),
			contentType: "application/json",
			//url: `${location.origin}:8081/cd/api`,
			//url: `${this.state.siteUrl}:8081/cd/api`,
			url:`http://tridion.sdldemo.com:8081/cd/api`,
			success: (queryResult) => {				
				//console.log(queryResult);
				if(queryResult.data==null){
					this.setState({
						hasMore:false,
						lastNode: "",
						pressReleases: [],
						pressReleasesBackup:[]
						
					})
					return;				
				} else{					
				
					if(queryResult.data.componentPresentations.edges.length===0){
						this.setState({
							hasMore:false,
							lastNode: "",
							pressReleases: [],
							pressReleasesBackup:[]
							
						})
						return;
					} else {
						console.log(queryResult);
						if(!this.state.hasMore)
						{
							this.setState({loaderText: ""})
							console.log("No more pages to load.")
							this.setState({ hasMore: true }) 
						}
					
						const pressReleases = []
						if(!queryResult.data.componentPresentations.edges || !queryResult.data.componentPresentations.edges.length)
						{
							console.log("empty result from API") 
							//only empty results if first page is empty. Avoids wiping results on last pagination
							if(page==0)
							{  
								this.setState({ pressReleases })               
							}
						}
						else if(queryResult.data.componentPresentations.edges.length > 0)
						{
							this.setState({ 
								//pressReleases: this.state.pressReleases.concat(queryResult.data.componentPresentations.edges), 
								pressReleases: queryResult.data.componentPresentations.edges, 
								publicationId: this.props.pubId, 
								pressReleasesBackup: this.state.pressReleasesBackup.concat(queryResult.data.componentPresentations.edges) 
							})
							console.log("retrieved PRs ok");
						}   
					}
				}
			}
		});
	}
 
	render() {
		
		var filterstyle = {
			left:'112px',
			top:'30%',
			width:'15%',
			paddingTop:'18px',
			paddingBottom:'10px',
			background:'#f5f5f5',
		}
		var seperator = {
			borderBottom:'1px solid #ddd',
			fontSize : '18px'
		}
		
		const loader = <div className="row">
				<div className="form-group col-12">
					<div className="cssLoader"></div>
					<div className="loadingText">{this.state.loaderText}</div>
				</div>
			</div>;
		return(
			<div className="container">				
				<div className="searchform" id="search-form">
					<div className="row">
						<div className="col-12 col-md-6">
							<div className="filters">
								<div className="container">									
									<div className="row">
										<pre>
											<code>
												<QueryEditor query={this.state.componentPresentationsQuery} onChange={this._queryHandler} />
											</code>
										</pre>
									</div>
								</div>
							</div>
						</div>
						<div className="col-12 col-md-6">
							<div className="search-result">
								<div className="row"> 
									<InfiniteScroll
										key={this.state.key}
										pageStart={0}
										loadMore={this._fetchPressReleases.bind(this)}
										hasMore={false}
										loader={loader}
										useWindow={true}
										threshold={300}
										initialLoad={false}
										resetInfiniteScroll={this.state.resetInfiniteScroll}>

											  <PressReleases pressReleases={this.state.pressReleases} pubid = {this.state.publicationId}/>
										  
									</InfiniteScroll>                   
										 
								</div>
							</div>
						</div>
					</div>
				</div>				
			</div>
		);
	}
}
