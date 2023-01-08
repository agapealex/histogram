import { gql } from '@apollo/client';
import moment from 'moment';

export const GET_ALL_USERS = gql`
  query{
    allPosts(count: 50) {
      id
      createdAt
    }
  }
`;

export const initializedPostsPerEachMonth = moment
            .monthsShort()
            .map( month => Object.freeze({
                month,
                posts: 0
            }))

export const convertPosts = (post) => {
    const formatedDate = new Date(post.createdAt * 1);

    return {
        id: post.id,
        monthCreated: initializedPostsPerEachMonth[formatedDate.getMonth()].month,
        yearCreated: formatedDate.getFullYear()
    }
}

const updatePostsPerEachMonth = (postsPerEachMonth, post) => {
    post.yearCreated === 2019 &&
    (postsPerEachMonth.find(p => p.month === post.monthCreated))
    .posts++;
    
    return postsPerEachMonth;
}

export const getPostsPerEachMonth = (allPosts) =>{
    return allPosts.reduce(updatePostsPerEachMonth, structuredClone(initializedPostsPerEachMonth));
}

export const getMaxMonth = (postsPerEachMonth, allPosts) => {
    const maxMonth = postsPerEachMonth.reduce(function(prevPost, currentPost) {
        return (prevPost.posts > currentPost.posts) ? prevPost : currentPost;
    });

    return  allPosts.filter( post => post.yearCreated === 2019 && post.monthCreated === maxMonth.month); 
}
export const styles ={
    width: 500,
    height: 500,
    margin: { top: 20, bottom: 20, left: 20, right: 20 },
    color:{
        purple3: '#a44afe',
        background : '#eaedff',
    }
}

