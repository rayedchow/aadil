import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polyline, Line, G } from 'react-native-svg';

interface LineChartProps {
  data: Array<{ x: number; y: number }>;
  data2?: Array<{ x: number; y: number }>;
  height?: number;
  width?: number;
  color?: string;
  color2?: string;
  strokeWidth?: number;
  showGrid?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  data2,
  height = 200,
  width = 350,
  color = '#007AFF',
  color2,
  strokeWidth = 3,
  showGrid = true,
}) => {
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Combine all data points to find min/max
  const allData = data2 ? [...data, ...data2] : data;
  const xValues = allData.map((d) => d.x);
  const yValues = allData.map((d) => d.y);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  // Scale function
  const scaleX = (x: number) => {
    return padding.left + ((x - minX) / (maxX - minX)) * chartWidth;
  };

  const scaleY = (y: number) => {
    return padding.top + chartHeight - ((y - minY) / (maxY - minY)) * chartHeight;
  };

  // Create points array for first line
  const points1 = data.map((point) => `${scaleX(point.x)},${scaleY(point.y)}`).join(' ');

  // Create points array for second line if provided
  const points2 = data2 ? data2.map((point) => `${scaleX(point.x)},${scaleY(point.y)}`).join(' ') : null;

  // Grid lines
  const gridLines = [];
  if (showGrid) {
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      gridLines.push(
        <Line
          key={`grid-${i}`}
          x1={padding.left}
          y1={y}
          x2={width - padding.right}
          y2={y}
          stroke="#F2F2F7"
          strokeWidth="1"
        />
      );
    }
  }

  return (
    <View style={styles.container}>
      <Svg height={height} width={width}>
        <G>
          {gridLines}
          {/* Axes */}
          <Line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="#E5E5EA"
            strokeWidth="1"
          />
          <Line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#E5E5EA"
            strokeWidth="1"
          />
          {/* First Line */}
          <Polyline
            points={points1}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Second Line */}
          {points2 && color2 && (
            <Polyline
              points={points2}
              fill="none"
              stroke={color2}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </G>
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

