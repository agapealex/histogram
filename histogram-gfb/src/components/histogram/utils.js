import { gql } from '@apollo/client';
import moment from 'moment';

export const GET_ALL_USERS = gql`
  query{
    allPosts(count: 100) {
      id
      createdAt
    }
  }
`;

const year = 2019;

export const initializedPostsPerEachMonth = moment
            .monthsShort()
            .map( month => Object.freeze({
                name: month,
                posts: 0
            }))

export const convertPosts = (post) => {
    const formatedDate = new Date(post.createdAt * 1);

    return {
        id: post.id,
        monthCreated: initializedPostsPerEachMonth[formatedDate.getMonth()].name,
        yearCreated: formatedDate.getFullYear()
    }
}

const updatePostsPerEachMonth = (postsPerEachMonth, post) => {
    post.yearCreated === year &&
    (postsPerEachMonth.find(month => month.name === post.monthCreated))
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

    return  allPosts.filter( post => post.yearCreated === year && post.monthCreated === maxMonth.name); 
}
export const styles ={
    width: 500,
    height: 500,
    margin: { top: 20, bottom: 20, left: 20, right: 20 },
    smallSize: 7,
    color:{
        purple3: '#a44afe',
        background : '#eaedff',
        midnightBlue : "#191970",
        black: 'black'
    }
}

