import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Polyline, Line, G, Defs, LinearGradient, Stop, Path } from 'react-native-svg';

interface LineChartProps {
  data: Array<{ x: number; y: number; isHistorical?: boolean }>;
  data2?: Array<{ x: number; y: number; isHistorical?: boolean }>;
  height?: number;
  width?: number;
  color?: string;
  color2?: string;
  strokeWidth?: number;
  showGrid?: boolean;
  gridColor?: string;
  axisColor?: string;
  textColor?: string;
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
  gridColor = '#F2F2F7',
  axisColor = '#E5E5EA',
  textColor = '#6B7280',
}) => {
  const padding = { top: 20, right: 10, bottom: 20, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const allData = data2 ? [...data, ...data2] : data;
  const xValues = allData.map((d) => d.x);
  const yValues = allData.map((d) => d.y);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  const yPadding = (maxY - minY) * 0.1;

  const scaleX = (x: number) => {
    return padding.left + ((x - minX) / (maxX - minX)) * chartWidth;
  };

  const scaleY = (y: number) => {
    return padding.top + chartHeight - ((y - (minY - yPadding)) / (maxY - minY + 2 * yPadding)) * chartHeight;
  };

  const createSmoothPath = (points: Array<{ x: number; y: number; isHistorical?: boolean }>) => {
    if (points.length < 2) return '';
    
    let path = `M ${scaleX(points[0].x)} ${scaleY(points[0].y)}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const x1 = scaleX(current.x);
      const y1 = scaleY(current.y);
      const x2 = scaleX(next.x);
      const y2 = scaleY(next.y);
      
      const cx1 = x1 + (x2 - x1) * 0.5;
      const cy1 = y1;
      const cx2 = x1 + (x2 - x1) * 0.5;
      const cy2 = y2;
      
      path += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
    }
    
    return path;
  };

  const splitDataByHistorical = (points: Array<{ x: number; y: number; isHistorical?: boolean }>) => {
    const historical = [];
    const future = [];
    let splitIndex = -1;
    
    for (let i = 0; i < points.length; i++) {
      if (points[i].isHistorical) {
        historical.push(points[i]);
        splitIndex = i;
      } else {
        if (splitIndex >= 0 && future.length === 0) {
          future.push(points[splitIndex]);
        }
        future.push(points[i]);
      }
    }
    
    return { historical, future };
  };

  const data1Split = splitDataByHistorical(data);
  const path1Historical = data1Split.historical.length > 1 ? createSmoothPath(data1Split.historical) : '';
  const path1Future = data1Split.future.length > 1 ? createSmoothPath(data1Split.future) : '';

  const data2Split = data2 ? splitDataByHistorical(data2) : null;
  const path2Historical = data2Split && data2Split.historical.length > 1 ? createSmoothPath(data2Split.historical) : '';
  const path2Future = data2Split && data2Split.future.length > 1 ? createSmoothPath(data2Split.future) : '';

  const gridLines = [];
  const yLabels = [];
  
  if (showGrid) {
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      const value = maxY + yPadding - ((maxY - minY + 2 * yPadding) / 5) * i;
      
      gridLines.push(
        <Line
          key={`grid-${i}`}
          x1={padding.left}
          y1={y}
          x2={width - padding.right}
          y2={y}
          stroke={gridColor}
          strokeWidth="1"
          strokeDasharray="4,4"
          opacity={0.5}
        />
      );
    }
  }

  const yAxisLabels = [];
  for (let i = 0; i <= 5; i++) {
    const value = maxY + yPadding - ((maxY - minY + 2 * yPadding) / 5) * i;
    const y = padding.top + (chartHeight / 5) * i;
    yAxisLabels.push({ value: Math.round(value), y });
  }

  return (
    <View style={styles.container}>
      <View style={styles.yAxisLabels}>
        {yAxisLabels.map((label, idx) => (
          <View
            key={idx}
            style={[styles.yLabel, { top: label.y - 10 }]}
          >
            <Text style={[styles.yLabelText, { color: textColor }]}>
              ${label.value}
            </Text>
          </View>
        ))}
      </View>
      <Svg height={height} width={width}>
        <Defs>
          <LinearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.2" />
            <Stop offset="1" stopColor={color} stopOpacity="0.0" />
          </LinearGradient>
          {color2 && (
            <LinearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color2} stopOpacity="0.2" />
              <Stop offset="1" stopColor={color2} stopOpacity="0.0" />
            </LinearGradient>
          )}
        </Defs>
        <G>
          {gridLines}
          
          {/* Data2 (AI Plan) - Historical solid, Future dotted */}
          {data2Split && color2 && (
            <>
              {path2Historical && (
                <Path
                  d={path2Historical}
                  fill="none"
                  stroke={color2}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {path2Future && (
                <Path
                  d={path2Future}
                  fill="none"
                  stroke={color2}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="8,6"
                />
              )}
            </>
          )}
          
          {/* Data1 (Current Path) - Historical solid, Future dotted */}
          {path1Historical && (
            <Path
              d={path1Historical}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {path1Future && (
            <Path
              d={path1Future}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8,6"
            />
          )}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yAxisLabels: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    justifyContent: 'space-between',
  },
  yLabel: {
    position: 'absolute',
    left: 0,
    height: 20,
  },
  yLabelText: {
    fontSize: 11,
    fontFamily: 'Raleway_500Medium',
  },
});

