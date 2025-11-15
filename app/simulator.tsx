import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Card } from '../components/Card';
import { LineChart } from '../components/LineChart';
import { Colors, Radii, Spacing } from '../constants/theme';

export default function SimulatorScreen() {
  const [dining, setDining] = useState(142);
  const [groceries, setGroceries] = useState(89);
  const [clubs, setClubs] = useState(56);
  const [transportation, setTransportation] = useState(45);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { width } = useWindowDimensions();
  const chartWidth = width - Spacing.screenPadding * 2 - Spacing.cardPadding * 2;

  // Calculate projections based on slider values
  const currentPath = [
    { x: 1, y: 2000 },
    { x: 2, y: 1850 },
    { x: 3, y: 1700 },
    { x: 4, y: 1550 },
    { x: 5, y: 1400 },
    { x: 6, y: 1250 },
    { x: 7, y: 1100 },
    { x: 8, y: 950 },
    { x: 9, y: 800 },
    { x: 10, y: 650 },
    { x: 11, y: 500 },
    { x: 12, y: 350 },
    { x: 13, y: 200 },
    { x: 14, y: 50 },
  ];

  const optimizedPath = [
    { x: 1, y: 2000 },
    { x: 2, y: 1920 },
    { x: 3, y: 1840 },
    { x: 4, y: 1760 },
    { x: 5, y: 1680 },
    { x: 6, y: 1600 },
    { x: 7, y: 1520 },
    { x: 8, y: 1440 },
    { x: 9, y: 1360 },
    { x: 10, y: 1280 },
    { x: 11, y: 1200 },
    { x: 12, y: 1120 },
    { x: 13, y: 1040 },
    { x: 14, y: 960 },
  ];

  const predictedBalance = 1630;
  const potentialSavings = Math.round((dining + groceries + clubs + transportation) * 0.3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="highlight" style={styles.heroCard}>
          <Text style={styles.eyebrow}>Behavior Model</Text>
          <Text style={styles.heroTitle}>AI Spending Simulator</Text>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Current Simulation Date</Text>
            <Text style={styles.dateValue}>
              {currentDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
          <View style={styles.heroChipRow}>
            <View style={styles.heroChip}>
              <Ionicons name="pulse" size={16} color={Colors.primary} />
              <Text style={styles.heroChipText}>Adaptive model v2.1</Text>
            </View>
            <View style={styles.heroChip}>
              <Ionicons name="time-outline" size={16} color={Colors.primary} />
              <Text style={styles.heroChipText}>Next refresh: 4h</Text>
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>End-of-Semester Projection</Text>
            <Text style={styles.secondaryText}>Confidence 87%</Text>
          </View>
          <LineChart
            data={currentPath}
            height={240}
            width={chartWidth}
            color={Colors.primary}
          />
          <View style={styles.balanceInfo}>
            <View>
              <Text style={styles.balanceLabel}>Predicted Balance</Text>
              <Text style={styles.balanceValue}>${predictedBalance.toLocaleString()}</Text>
            </View>
            <View style={styles.deltaPill}>
              <Ionicons name="trending-up" size={16} color={Colors.accentGreen} />
              <Text style={styles.deltaText}>$312 opportunity</Text>
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>What-If Simulator</Text>
            <Text style={styles.secondaryText}>Live preview</Text>
          </View>
          <TouchableOpacity
            style={styles.simulateButton}
            onPress={() =>
              setCurrentDate((prev) => new Date(prev.getTime() + 24 * 60 * 60 * 1000))
            }
          >
            <Ionicons name="play" size={18} color={Colors.surface} />
            <Text style={styles.simulateButtonText}>Simulate Next Day</Text>
          </TouchableOpacity>
          <View style={styles.comparisonCharts}>
            <View style={styles.miniChart}>
              <Text style={styles.miniChartTitle}>Your Current Path</Text>
              <LineChart data={currentPath} height={120} width={chartWidth / 2 - 16} color={Colors.primary} strokeWidth={2} />
            </View>
            <View style={styles.miniChart}>
              <Text style={styles.miniChartTitle}>AI Recommended</Text>
              <LineChart data={optimizedPath} height={120} width={chartWidth / 2 - 16} color={Colors.accentGreen} strokeWidth={2} />
            </View>
          </View>
          <View style={styles.savingsCard}>
            <Text style={styles.savingsLabel}>Potential savings</Text>
            <Text style={styles.savingsAmount}>+${potentialSavings}</Text>
            <Text style={styles.savingsSubtext}>By semester end with adjustments</Text>
          </View>

          <View style={styles.slidersContainer}>
            {[
              {
                label: 'Dining',
                value: dining,
                setValue: (v: number) => setDining(Math.round(v * 100) / 100),
                min: 50,
                max: 250,
                icon: 'restaurant',
                color: Colors.accentOrange,
              },
              {
                label: 'Groceries',
                value: groceries,
                setValue: (v: number) => setGroceries(Math.round(v * 100) / 100),
                min: 30,
                max: 150,
                icon: 'basket',
                color: Colors.accentGreen,
              },
              {
                label: 'Clubs',
                value: clubs,
                setValue: (v: number) => setClubs(Math.round(v * 100) / 100),
                min: 20,
                max: 100,
                icon: 'people',
                color: Colors.accentPurple,
              },
              {
                label: 'Transportation',
                value: transportation,
                setValue: (v: number) => setTransportation(Math.round(v * 100) / 100),
                min: 20,
                max: 100,
                icon: 'car',
                color: Colors.primary,
              },
            ].map((item) => (
              <View key={item.label} style={styles.sliderItem}>
                <View style={styles.sliderHeader}>
                  <View style={[styles.sliderIcon, { backgroundColor: `${item.color}15` }]}>
                    <Ionicons name={item.icon as any} size={16} color={item.color} />
                  </View>
                  <Text style={styles.sliderLabel}>{item.label}</Text>
                  <Text style={styles.sliderValue}>${item.value.toFixed(2)}/week</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={item.min}
                  maximumValue={item.max}
                  value={item.value}
                  onValueChange={item.setValue}
                  minimumTrackTintColor={item.color}
                  maximumTrackTintColor={Colors.border}
                  thumbTintColor={item.color}
                />
              </View>
            ))}
          </View>
        </Card>

        <Card variant="muted">
          <View style={styles.recommendationHeader}>
            <View style={styles.sparkleBadge}>
              <Ionicons name="bulb-outline" size={18} color={Colors.accentOrange} />
            </View>
            <Text style={styles.recommendationTitle}>AI Recommendation</Text>
          </View>
          <Text style={styles.recommendationText}>
            Reducing dining spending by $13/week will save $312 by semester end. Shift $15 from
            entertainment to transportation for smoother cashflow.
          </Text>
          <View style={styles.recommendationActions}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Apply plan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Adjust</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 12,
    paddingBottom: 32,
  },
  heroCard: {
    borderWidth: 0,
  },
  eyebrow: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  heroChipRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  heroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    gap: 6,
  },
  heroChipText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  secondaryText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  simulateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radii.pill,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },
  simulateButtonText: {
    color: Colors.surface,
    fontSize: 15,
    fontWeight: '600',
  },
  balanceInfo: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.text,
  },
  deltaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAFBF0',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    gap: 6,
  },
  deltaText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.accentGreen,
  },
  comparisonCharts: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 20,
  },
  miniChart: {
    flex: 1,
    backgroundColor: Colors.surfaceMuted,
    borderRadius: Radii.md,
    padding: 12,
  },
  miniChartTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 8,
  },
  savingsCard: {
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: Radii.md,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  savingsLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  savingsAmount: {
    fontSize: 34,
    fontWeight: '700',
    color: Colors.accentGreen,
    marginVertical: 6,
  },
  savingsSubtext: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  slidersContainer: {
    marginTop: 8,
    gap: 18,
  },
  sliderItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 12,
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderIcon: {
    width: 32,
    height: 32,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  slider: {
    width: '100%',
    height: 38,
    marginTop: 8,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  sparkleBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFEFE1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendationTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  recommendationText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  recommendationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Radii.pill,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Radii.pill,
    alignItems: 'center',
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

