import gql from 'graphql-tag';

const PublicationMapping = gql `query publicationMapping($namespaceId: Int!, $siteUrl: String!) {
					  publicationMapping(namespaceId: $namespaceId, siteUrl: $siteUrl){
						publicationId
					  }
					}`;

export default PublicationMapping;