import React from 'react';
import { useQuery} from '@apollo/client';
import { scaleLinear, scaleBand } from '@visx/scale';
import StyledHistogram from './histogram.style';
import { Group } from '@visx/group';
import { Grid } from '@visx/grid';
import { Bar } from '@visx/shape';
import { AxisBottom, AxisLeft } from '@visx/axis';
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

    const xMax = styles.width - styles.margin.left - styles.margin.right;
    const yMax = styles.height - styles.margin.top - styles.margin.bottom;

    const getMonthName = month => month.name;

    const xScale = scaleBand({
        range: [0, xMax],
        round: true,
        domain: postsPerEachMonth.map(getMonthName),
        padding: 0.4,
    });

    const yScale = scaleLinear({
        range: [yMax, 0],
        domain: [0, getMaxMonth(postsPerEachMonth, allPosts).length],
        round: true,
    });

    xScale.rangeRound([0, xMax]);
    yScale.rangeRound([yMax, 0]);

    const compose = (scale, accessor) => data => scale(accessor(data));
    const xPoint = compose(xScale, getMonthName);
    const yPoint = compose(yScale, month => month.posts);

    return (
        <StyledHistogram>
            <svg width={styles.width} height={styles.height} >
                <rect x={0} y={0} width={styles.width} height={styles.height} fill={styles.color.background} rx={14} />
                <Grid
                    top={styles.margin.top}
                    left={styles.margin.left}
                    xScale={xScale}
                    yScale={yScale}
                    width={xMax}
                    height={yMax}
                    stroke={styles.color.black}
                    strokeOpacity={0.1}
                />
                {postsPerEachMonth.map((month, index) => {
                    const barHeight = yMax - yPoint(month);

                    return (
                    <Group key={`bar-${index}`}  left={styles.margin.left} top={styles.margin.top}>

                        <Bar
                            x={xPoint(month)}
                            y={yPoint(month)}
                            height={barHeight }
                            width={xScale.bandwidth()}
                            fill={styles.color.midnightBlue}
                        />
                    </Group>
                    );
                })}
                <AxisLeft
                    top={styles.margin.top}
                    left={styles.margin.left}
                    scale={yScale}
                    stroke={styles.purple3}
                    tickStroke={styles.purple3}
                    tickLabelProps={() => ({
                        fill: styles.purple3,
                        fontSize: 11,
                        textAnchor: 'end',
                        dy: '0.33em',
                    })}
                />
                <AxisBottom
                    top={yMax + styles.margin.top/2}
                    left={styles.margin.left + 7 }
                    tickClassName="ceva"
                    hideAxisLine
                    hideTicks
                    scale={xScale}
                    stroke={styles.purple3}
                    tickStroke={styles.purple3}
                    tickLabelProps={() => ({
                        fill: styles.purple3,
                        fontSize: 11,
                        textAnchor: 'end',
                        dy: '0.33em',
                    })}
                />
            </svg>
        </StyledHistogram>
    )
}

export default Histogram;