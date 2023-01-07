import React from 'react';
import { useQuery} from '@apollo/client';
import StyledHistogram from './histogram.style';
import { 
    GET_ALL_USERS,

} from './utils';

const Histogram = () => {

    const {error, data, loading} =  useQuery(GET_ALL_USERS);

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
        <StyledHistogram>
            <p>txt</p>
        </StyledHistogram>
    )
}

export default Histogram;