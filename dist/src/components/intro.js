import React from 'react';

export default class Intro extends React.Component {    
    render() { 
        const title="Browse through the archive of Acadian's corporate and regulatory press releases, dating back to 2001."  
        const subtitle="Filter by category, date range and keyword search to find the information and articles you require."   
        return (
            <div className="row">
                <div className="col-md-12">
					<h3>{title}</h3>
                    <p className="lead">{subtitle}</p>
                </div>
            </div>
        );
    }

}
