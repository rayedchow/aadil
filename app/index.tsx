import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Card } from '../components/Card';
import { LineChart } from '../components/LineChart';
import { Radii, Spacing, ThemeColors, Fonts } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { api, DashboardData, SimulationState, OptimizationTip, Goal } from '../services/api';

const calendarCells = [
  { day: '', status: 'empty' },
  { day: '', status: 'empty' },
  { day: 1, status: 'under' },
  { day: 2, status: 'over' },
  { day: 3, status: 'under' },
  { day: 4, status: 'under' },
  { day: 5, status: 'over' },
  { day: 6, status: 'under' },
  { day: 7, status: 'under' },
  { day: 8, status: 'under' },
  { day: 9, status: 'over' },
  { day: 10, status: 'under' },
  { day: 11, status: 'under' },
  { day: 12, status: 'over' },
  { day: 13, status: 'under' },
  { day: 14, status: 'under' },
  { day: 15, status: 'over' },
  { day: 16, status: 'under' },
  { day: 17, status: 'under' },
  { day: 18, status: 'over' },
  { day: 19, status: 'under' },
  { day: 20, status: 'under' },
  { day: 21, status: 'under' },
  { day: 22, status: 'over' },
  { day: 23, status: 'under' },
  { day: 24, status: 'under' },
  { day: 25, status: 'over' },
  { day: 26, status: 'under' },
  { day: 27, status: 'under' },
  { day: 28, status: 'under' },
  { day: 29, status: 'over' },
  { day: 30, status: 'under' },
  { day: '', status: 'empty' },
  { day: '', status: 'empty' },
  { day: '', status: 'empty' },
];

const calendarWeeks: Array<typeof calendarCells[number][]> = [];
for (let i = 0; i < calendarCells.length; i += 7) {
  calendarWeeks.push(calendarCells.slice(i, i + 7));
}

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const chartWidth = width - Spacing.screenPadding * 2 - Spacing.cardPadding * 2;
  const { colors, mode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const underBudgetColor = mode === 'dark' ? 'rgba(48,209,88,0.25)' : '#EAFBF0';
  const overBudgetColor = colors.accentOrange;

  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState('');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [simulationState, setSimulationState] = useState<SimulationState | null>(null);
  const [timelineData, setTimelineData] = useState<any>(null);
  const [optimizationTips, setOptimizationTips] = useState<OptimizationTip[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashboard, state, timeline, tips, goalsData] = await Promise.all([
        api.getDashboard(),
        api.getState(),
        api.getTimeline(),
        api.getOptimizationTips(),
        api.getGoals(),
      ]);
      setDashboardData(dashboard);
      setSimulationState(state);
      setTimelineData(timeline);
      setOptimizationTips(tips);
      setGoals(goalsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert('Error', 'Failed to load dashboard data. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSimulateDay = async () => {
    try {
      setSimulating(true);
      
      setSimulationStatus('Analyzing spending patterns...');
      await sleep(600);
      
      setSimulationStatus('Generating transactions...');
      await sleep(500);
      
      const result = await api.simulateDay();
      
      setSimulationStatus('Recalculating projections...');
      await sleep(400);
      
      setSimulationStatus('Updating insights...');
      await sleep(400);
      
      await loadData();
      
      setSimulationStatus('Complete!');
      await sleep(300);
      
      Alert.alert(
        'Day Simulated ✓', 
        `Advanced to ${new Date(result.new_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}\n\nNew balance: $${result.new_balance.toFixed(2)}\n${result.new_transactions.length} transaction(s) added`
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to simulate day');
    } finally {
      setSimulating(false);
      setSimulationStatus('');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !dashboardData || !simulationState || !timelineData) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.statLabel, { marginTop: 12 }]}>Loading dashboard...</Text>
      </SafeAreaView>
    );
  }

  const currentDate = new Date(simulationState.current_date);
  const monthLabel = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const safeBalance = (balance: number) => Math.max(0, balance);

  const onPaceData = timelineData.on_pace.map((point: any, idx: number) => ({
    x: idx,
    y: safeBalance(point.balance),
    isHistorical: point.is_historical,
  }));

  const optimizedData = timelineData.aadil_plan.map((point: any, idx: number) => ({
    x: idx,
    y: safeBalance(point.balance),
    isHistorical: point.is_historical,
  }));

  const getProjectedBalanceForTimeframe = (timeframe: string) => {
    const daysMap: { [key: string]: number } = {
      week: 7,
      month: 30,
      semester: 95,
    };
    const days = daysMap[timeframe] || 14;
    const targetIndex = Math.min(days, timelineData.aadil_plan.length - 1);
    return timelineData.aadil_plan[targetIndex]?.balance || simulationState.current_balance;
  };

  const activeGoals = goals.filter(g => !g.completed);
  const achievableGoal = activeGoals.find(g => {
    const projected = getProjectedBalanceForTimeframe(g.target_timeframe);
    return g.target_amount <= projected;
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
        <Card variant="highlight" style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroTitle}>Aadil</Text>
              <Text style={styles.eyebrow}>
                {currentDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStat}>
              <Text style={styles.statLabel}>Current Balance</Text>
              <Text style={styles.statValue}>
                ${safeBalance(simulationState.current_balance).toLocaleString()}
              </Text>
              <Text style={styles.statDelta}>
                Projected: ${safeBalance(dashboardData.projected_balance).toFixed(0)}
              </Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.statLabel}>AI Plan Savings</Text>
              <Text style={styles.statValue}>
                ${Math.abs(dashboardData.semester_savings).toFixed(0)}
              </Text>
              <Text style={styles.statDeltaPositive}>vs on-pace path</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.simulateButton, simulating && styles.simulateButtonActive]}
            onPress={handleSimulateDay}
            disabled={simulating}
            activeOpacity={0.8}
          >
            {simulating ? (
              <>
                <ActivityIndicator size="small" color={colors.surface} />
                <Text style={styles.simulateButtonText}>{simulationStatus}</Text>
              </>
            ) : (
              <>
                <Ionicons name="play" size={18} color={colors.surface} />
                <Text style={styles.simulateButtonText}>Simulate Next Day</Text>
              </>
            )}
          </TouchableOpacity>
        </Card>

        {achievableGoal && (
          <Card style={styles.goalBanner}>
            <View style={styles.goalBannerContent}>
              <View style={styles.goalBannerIcon}>
                <Ionicons name="flag" size={22} color={colors.surface} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.goalBannerTitle}>
                  You're on track to afford {achievableGoal.name}!
                </Text>
                <Text style={styles.goalBannerSubtext}>
                  ${achievableGoal.target_amount.toFixed(0)} by end of {achievableGoal.target_timeframe}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.goalBannerButton}
                onPress={() => router.push('/plan' as any)}
              >
                <Ionicons name="arrow-forward" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </Card>
        )}

        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Connections</Text>
          </View>
          
          <TouchableOpacity onPress={() => router.push('/bank')}>
            <View style={styles.connectionRow}>
              <View
                style={[
                  styles.connectionIcon,
                  { backgroundColor: `${colors.primary}1A` },
                ]}
              >
                <Ionicons name="card-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.connectionInfo}>
                <Text style={styles.connectionLabel}>Bank Account Integration</Text>
                <View style={styles.statusPill}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Connected</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/rutgers')}>
            <View style={styles.connectionRow}>
              <View
                style={[
                  styles.connectionIcon,
                  { backgroundColor: 'rgba(214, 40, 40, 0.1)' },
                ]}
              >
                <Ionicons name="school-outline" size={20} color="#D62828" />
              </View>
              <View style={styles.connectionInfo}>
                <Text style={styles.connectionLabel}>Rutgers NetID Account</Text>
                <View style={styles.statusPill}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Connected</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </View>
          </TouchableOpacity>
        </Card>

        <Card style={styles.chartCard}>
          <Text style={styles.sectionTitle}>2-Week Projection</Text>
          <Text style={styles.chartSubtitle}>Past 7 days + Next 14 days forecast</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={onPaceData}
              data2={optimizedData}
              height={320}
              width={chartWidth}
              color="#5AC8FA"
              color2={colors.accentGreen}
              gridColor={colors.border}
              axisColor={colors.border}
              strokeWidth={2.5}
              textColor={colors.textMuted}
            />
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#5AC8FA' }]} />
              <Text style={styles.legendLabel}>Current path</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.accentGreen }]} />
              <Text style={styles.legendLabel}>AI optimized</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendLine,
                  { borderColor: colors.textMuted, borderStyle: 'dashed' },
                ]}
              />
              <Text style={styles.legendLabel}>Projected</Text>
            </View>
          </View>
          <View style={styles.projectionFooter}>
            <View style={styles.projectionStat}>
              <Text style={styles.projectionLabel}>In 2 weeks (current path)</Text>
              <Text style={styles.projectionValue}>
                ${safeBalance(timelineData.on_pace[timelineData.on_pace.length - 1]?.balance).toFixed(0)}
              </Text>
            </View>
            <View style={styles.projectionDivider} />
            <View style={styles.projectionStat}>
              <Text style={styles.projectionLabel}>In 2 weeks (AI plan)</Text>
              <Text style={[styles.projectionValue, { color: colors.accentGreen }]}>
                ${safeBalance(timelineData.aadil_plan[timelineData.aadil_plan.length - 1]?.balance).toFixed(0)}
              </Text>
            </View>
          </View>
          <View style={styles.improvementBanner}>
            <Ionicons name="trending-up" size={20} color={colors.accentGreen} />
            <View style={{ flex: 1 }}>
              <Text style={styles.improvementTitle}>
                +${Math.abs(safeBalance(timelineData.aadil_plan[timelineData.aadil_plan.length - 1]?.balance) - safeBalance(timelineData.on_pace[timelineData.on_pace.length - 1]?.balance)).toFixed(0)} better
              </Text>
              <Text style={styles.improvementSubtext}>
                With AI-optimized spending over next 2 weeks
              </Text>
            </View>
          </View>
        </Card>

        {optimizationTips.length > 0 && (
          <Card>
            <View style={styles.tipsHeader}>
              <View style={styles.tipsHeaderLeft}>
                <Ionicons name="bulb" size={22} color={colors.accentOrange} />
                <View>
                  <Text style={styles.tipsTitle}>How to Get There</Text>
                  <Text style={styles.tipsSubtitle}>Actions to reach AI-optimized path</Text>
                </View>
              </View>
            </View>
            {optimizationTips.map((tip, index) => (
              <View key={index} style={styles.tipRow}>
                <View style={styles.tipLeft}>
                  <View style={styles.tipNumber}>
                    <Text style={styles.tipNumberText}>{index + 1}</Text>
                  </View>
                  <View style={[styles.tipIcon, { 
                    backgroundColor: tip.category === 'Dining' ? 'rgba(255, 149, 0, 0.15)' :
                                   tip.category === 'Coffee' ? 'rgba(255, 59, 48, 0.15)' :
                                   tip.category === 'Transportation' ? 'rgba(0, 122, 255, 0.15)' :
                                   'rgba(175, 82, 222, 0.15)'
                  }]}>
                    <Ionicons 
                      name={tip.icon as any} 
                      size={18} 
                      color={
                        tip.category === 'Dining' ? '#FF9500' :
                        tip.category === 'Coffee' ? '#FF3B30' :
                        tip.category === 'Transportation' ? '#007AFF' :
                        '#AF52DE'
                      } 
                    />
                  </View>
                  <View style={styles.tipContent}>
                    <Text style={styles.tipAction}>{tip.action}</Text>
                    {tip.savings_per_week > 0 && (
                      <Text style={styles.tipSavings}>
                        Saves ~${tip.savings_per_week.toFixed(0)}/week
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
            <View style={styles.tipsFooter}>
              <Ionicons name="sparkles" size={16} color={colors.primary} />
              <Text style={styles.tipsFooterText}>
                Follow these tips to stay on the optimized path
              </Text>
            </View>
          </Card>
        )}

        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spending Calendar</Text>
            <Text style={styles.secondaryLabel}>{monthLabel}</Text>
          </View>
          <View style={styles.calendarLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.accentGreen }]} />
              <Text style={styles.legendLabel}>Under budget</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.accentOrange }]} />
              <Text style={styles.legendLabel}>Over budget</Text>
            </View>
          </View>
          <View style={styles.calendarHeaderRow}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <Text key={index} style={styles.calendarHeaderText}>
                {day}
              </Text>
            ))}
          </View>
          {calendarWeeks.map((week, idx) => (
            <View key={idx} style={styles.calendarRow}>
              {week.map((cell, cellIdx) => (
                <View
                  key={`${idx}-${cellIdx}`}
                  style={[
                    styles.calendarCell,
                    cell.status === 'under' && { backgroundColor: underBudgetColor },
                    cell.status === 'over' && { backgroundColor: overBudgetColor },
                  ]}
                >
                  <Text
                    style={[
                      styles.calendarCellText,
                      cell.status === 'over' && { color: colors.surface },
                    ]}
                  >
                    {cell.day}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </Card>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
    },
    scroll: {
      flex: 1,
    },
    content: {
      paddingHorizontal: Spacing.screenPadding,
      paddingTop: 12,
      paddingBottom: 40,
    },
    heroCard: {
      borderWidth: 0,
    },
    heroHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 18,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    eyebrow: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 2,
      letterSpacing: 0.4,
      fontFamily: Fonts.regular,
    },
    heroTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    badge: {
      backgroundColor: colors.surfaceMuted,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: Radii.pill,
      borderWidth: 1,
      borderColor: colors.border,
    },
    badgeText: {
      fontSize: 13,
      color: colors.textMuted,
      fontWeight: '600',
    },
    themeToggle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroStatsRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    heroStat: {
      flex: 1,
    },
    statLabel: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 6,
      fontFamily: Fonts.regular,
    },
    statValue: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    statDelta: {
      fontSize: 14,
      color: colors.textMuted,
      marginTop: 4,
      fontFamily: Fonts.regular,
    },
    statDeltaPositive: {
      fontSize: 14,
      color: colors.accentGreen,
      marginTop: 4,
      fontFamily: Fonts.regular,
    },
    heroDivider: {
      width: 1,
      height: 58,
      backgroundColor: colors.border,
      marginHorizontal: 18,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 18,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    linkText: {
      fontSize: 15,
      color: colors.primary,
      fontWeight: '600',
    },
    connectionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
    },
    connectionIcon: {
      width: 46,
      height: 46,
      borderRadius: Radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    connectionInfo: {
      flex: 1,
    },
    connectionLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
      fontFamily: Fonts.semiBold,
    },
    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primarySoft,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: Radii.pill,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.accentGreen,
      marginRight: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary,
      fontFamily: Fonts.semiBold,
    },
    legendGroup: {
      flexDirection: 'row',
      gap: 12,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    legendDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
    },
    legendLine: {
      width: 20,
      height: 2,
      borderTopWidth: 2,
      marginRight: 8,
    },
    legendLabel: {
      fontSize: 12,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
    },
    projectionFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
    },
    projectionLabel: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
    },
    projectionValue: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    deltaPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: Radii.pill,
      gap: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    deltaText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.accentGreen,
      fontFamily: Fonts.semiBold,
    },
    calendarLegend: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    calendarHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    calendarHeaderText: {
      flex: 1,
      textAlign: 'center',
      fontSize: 12,
      color: colors.textMuted,
      fontWeight: '600',
      fontFamily: Fonts.semiBold,
    },
    calendarRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    calendarCell: {
      flex: 1,
      marginHorizontal: 3,
      aspectRatio: 1,
      borderRadius: Radii.md,
      backgroundColor: colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    calendarCellText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
      fontFamily: Fonts.semiBold,
    },
    secondaryLabel: {
      fontSize: 14,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
    },
    aiNoteHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    sparkleBadge: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    aiNoteTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.primary,
      fontFamily: Fonts.semiBold,
    },
    aiNoteText: {
      fontSize: 15,
      color: colors.text,
      lineHeight: 22,
      fontFamily: Fonts.regular,
    },
    simulateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderRadius: Radii.pill,
      paddingVertical: 14,
      marginTop: 16,
      gap: 10,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    simulateButtonActive: {
      backgroundColor: colors.primary,
      opacity: 0.9,
      transform: [{ scale: 0.98 }],
    },
    simulateButtonText: {
      color: colors.surface,
      fontSize: 15,
      fontWeight: '600',
      fontFamily: Fonts.semiBold,
      minWidth: 140,
      textAlign: 'center',
    },
    chartCard: {
      paddingVertical: 24,
    },
    chartSubtitle: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
      marginTop: 4,
      marginBottom: 8,
    },
    chartContainer: {
      marginVertical: 20,
      marginLeft: 10,
      marginRight: -10,
    },
    chartLegend: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 24,
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    projectionStat: {
      flex: 1,
    },
    projectionDivider: {
      width: 1,
      height: 50,
      backgroundColor: colors.border,
      marginHorizontal: 16,
    },
    improvementBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.surfaceHighlight,
      padding: 16,
      borderRadius: Radii.md,
      marginTop: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    improvementTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
      marginBottom: 2,
    },
    improvementSubtext: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
    },
    tipsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    tipsHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    tipsTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    tipsSubtitle: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
      marginTop: 2,
    },
    tipRow: {
      marginBottom: 16,
    },
    tipLeft: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    tipNumber: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tipNumberText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.surface,
      fontFamily: Fonts.bold,
    },
    tipIcon: {
      width: 36,
      height: 36,
      borderRadius: Radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    tipContent: {
      flex: 1,
      paddingTop: 2,
    },
    tipAction: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      fontFamily: Fonts.semiBold,
      lineHeight: 21,
      marginBottom: 4,
    },
    tipSavings: {
      fontSize: 13,
      color: colors.accentGreen,
      fontFamily: Fonts.medium,
    },
    tipsFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.surfaceHighlight,
      padding: 12,
      borderRadius: Radii.md,
      marginTop: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tipsFooterText: {
      flex: 1,
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
    },
    goalBanner: {
      backgroundColor: 'rgba(48, 209, 88, 0.08)',
      borderWidth: 1,
      borderColor: colors.accentGreen,
    },
    goalBannerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    goalBannerIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.accentGreen,
      alignItems: 'center',
      justifyContent: 'center',
    },
    goalBannerTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      fontFamily: Fonts.semiBold,
      marginBottom: 4,
    },
    goalBannerSubtext: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
    },
    goalBannerButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
  });
