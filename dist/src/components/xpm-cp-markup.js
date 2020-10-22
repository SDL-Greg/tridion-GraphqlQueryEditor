import React from 'react';

export default class XpmCPMarkup extends React.Component {	

    render() { 
    	const pressRelease = this.props.pressRelease
        return (
        	<div dangerouslySetInnerHTML={{__html: `<!-- Start Component Presentation: {\"ComponentID\" : \"${pressRelease.id}\", \"ComponentModified\" : \"${pressRelease.componentModifiedDate}\", \"ComponentTemplateID\" : \"${pressRelease.templateUri}\", \"ComponentTemplateModified\" : \"${pressRelease.templateModifiedDate}\", \"IsRepositoryPublished\" : true} -->`}}>
        	</div>    
        );    	
    }

   /*_createXpmCpMarkup(pressRelease) {	
  //return {__html: `<!-- Start Component Presentation: {\"ComponentID\" : \"${pressRelease.id}\", \"ComponentModified\" : \"${pressRelease.componentModifiedDate}\", \"ComponentTemplateID\" : \"${pressRelease.templateUri}\", \"ComponentTemplateModified\" : \"${pressRelease.templateModifiedDate}\", \"IsRepositoryPublished\" : true} -->`};
  //return {__html: `<!-- Start Component Presentation ${pressRelease.id} -->`}
}*/

}