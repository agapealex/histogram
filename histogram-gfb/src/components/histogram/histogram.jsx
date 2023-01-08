import React from 'react';
import { useQuery} from '@apollo/client';
import { scaleLinear, scaleBand } from '@visx/scale';
import StyledHistogram from './histogram.style';
import { Group } from '@visx/group';
import { Grid } from '@visx/grid';
import { Bar } from '@visx/shape';
import { 
    GET_ALL_USERS,
    convertPosts,
    getPostsPerEachMonth,
    getMaxMonth,
    styles
} from './utils';

const Histogram = () => {

    const {error, data, loading} =  useQuery(GET_ALL_USERS);

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    const allPosts = data.allPosts.map(convertPosts);
    const postsPerEachMonth = getPostsPerEachMonth(allPosts);
    const maxMonth = getMaxMonth(postsPerEachMonth, allPosts);
    
    const xMax = styles.width - styles.margin.left - styles.margin.right;
    const yMax = styles.height - styles.margin.top - styles.margin.bottom;

    const x = d => d.month;
    const y = d => d.posts;
    const c = (post, index) => index+1

    const xScale = scaleBand({
        range: [0, xMax],
        round: true,
        domain: postsPerEachMonth.map(x),
        padding: 0.4,
    });
    
    const dateScale = scaleBand({
        domain: postsPerEachMonth.map(x),
        padding: 0.2,
    });

    const postsScale = scaleLinear({
        range: [yMax, 0],
        domain: [0,maxMonth.length],
        round: true, 
    });

    dateScale.rangeRound([0, xMax]);
    postsScale.rangeRound([yMax, 0]);

    const compose = (scale, accessor) => data => scale(accessor(data));
    const xPoint = compose(xScale, x);
    const yPoint = compose(postsScale, y);

    return (
        <StyledHistogram>
            <svg width={styles.width} height={styles.height} >
                <rect x={0} y={0} width={styles.width} height={styles.height} fill={styles.color.background} rx={14} />
                <Grid
                    left={styles.margin.left}
                    xScale={dateScale}
                    yScale={postsScale}
                    width={xMax}
                    height={yMax}
                    stroke="black"
                    strokeOpacity={0.1}
                />
                {postsPerEachMonth.map((d, i) => {
                        const barHeight = yMax - yPoint(d);

                    return (
                    <Group key={`bar-${i}`}  left={styles.margin.left}  >

                        <Bar
                            x={xPoint(d)}
                            y={yPoint(d)}
                            height={barHeight }
                            width={xScale.bandwidth()}
                            fill="blue"
                        />
                    </Group>
                    );
                })}

            </svg>
        </StyledHistogram>
    )
}

export default Histogram;