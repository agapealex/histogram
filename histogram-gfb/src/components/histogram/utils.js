import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
  query{
    allPosts(count: 50) {
      id
      createdAt
    }
  }
`;

