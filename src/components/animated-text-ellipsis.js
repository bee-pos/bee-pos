import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const AnimatedTextEllipsis = ({ text = '', count = 3, delay = 1000, style = {}, textStyle = {} }) => {
    const ellipsisCountRef = useRef(count);
    const [showingEllipsisCount, setShowingEllipsisCount] = useState(ellipsisCountRef.current);

    useEffect(() => {
        const syncEllipsisInterval = setInterval(() => {
            ellipsisCountRef.current = ellipsisCountRef.current < count ? (++ellipsisCountRef.current) : 0
            setShowingEllipsisCount(ellipsisCountRef.current);
        }, delay);

        return () => clearInterval(syncEllipsisInterval);
    }, []);

    return (
        <View style={{ ...style, ...styles.container }}>
            <Text style={{ ...textStyle }}>{`${text}`}</Text>
            {Array(count).fill().map((_, i) =>
                <Text key={i} style={(i + 1) > showingEllipsisCount ? { ...textStyle, opacity: 0 } : { ...textStyle }}>.</Text>)}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
});

export default AnimatedTextEllipsis;