import gql from 'graphql-tag';

const SiteMapSubTree = gql `query sitemapSubtree($namespaceId: Int!, $publicationId: Int!, $taxonomyNodeId: String){
				  sitemapSubtree(namespaceId: $namespaceId, publicationId: $publicationId, taxonomyNodeId:$taxonomyNodeId) {
					description
					id
					items {
					  ... on SitemapItem {
						originalTitle
						id
						title
					  }
					}
				  }
				}`;

export default SiteMapSubTree;