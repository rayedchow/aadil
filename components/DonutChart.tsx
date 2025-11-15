import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

interface DonutChartProps {
  data: Array<{ label: string; value: number; color: string }>;
  size?: number;
  strokeWidth?: number;
  showTotalLabel?: boolean;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 200,
  strokeWidth = 40,
  showTotalLabel = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G>
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const segmentLength = (percentage / 100) * circumference;
            const strokeDasharray = `${segmentLength} ${circumference}`;
            const strokeDashoffset = circumference - (cumulativePercentage / 100) * circumference;

            cumulativePercentage += percentage;

            return (
              <Circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${center} ${center})`}
                origin={`${center}, ${center}`}
              />
            );
          })}
        </G>
        {showTotalLabel && (
          <>
            <SvgText
              x={center}
              y={center - 10}
              textAnchor="middle"
              fontSize="24"
              fontWeight="700"
              fill="#000000"
            >
              ${total}
            </SvgText>
            <SvgText
              x={center}
              y={center + 15}
              textAnchor="middle"
              fontSize="14"
              fill="#8E8E93"
            >
              Total
            </SvgText>
          </>
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

