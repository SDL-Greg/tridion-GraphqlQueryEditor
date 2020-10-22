import gql from 'graphql-tag';

const componentPresentationsQuery = gql `{
  componentPresentations(
    namespaceId: 1, 
    publicationId: 9, 
    filter: {schema: {id: 90}, template: {id: 1555}}, 
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