import gql from 'graphql-tag';

const componentPresentationsQuery = gql `{
  componentPresentations(
    namespaceId: 1, 
    publicationId: 7,
    filter: {schema: {id: 115}, template: {id: 742}},
    sort: {sortBy: LAST_PUBLISH_DATE, order: Descending}, 
    first: 10
  ){
    edges {
      cursor
      node {
        itemId
        publicationId
        itemType
        ... on ComponentPresentation {
          itemType
          rawContent {
            data
          }
          component {
            title
            itemId
            lastPublishDate			
            customMetas {
              edges {
                node {
                  key
                  value
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

export default componentPresentationsQuery;