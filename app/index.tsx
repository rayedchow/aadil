import React from 'react';
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
import { Card } from '../components/Card';
import { LineChart } from '../components/LineChart';
import { Colors, Radii, Spacing } from '../constants/theme';

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const chartWidth = width - Spacing.screenPadding * 2 - Spacing.cardPadding * 2;
  const today = new Date();
  const monthLabel = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const onPaceData = [
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

  const optimizedData = [
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
  ];

  const calendarWeeks: Array<typeof calendarCells[number][]> = [];
  for (let i = 0; i < calendarCells.length; i += 7) {
    calendarWeeks.push(calendarCells.slice(i, i + 7));
  }

  const connections = [
    {
      label: 'Bank Account Integration',
      status: 'Connected',
      icon: 'card-outline',
      accent: Colors.primary,
    },
    {
      label: 'Rutgers NetID Account',
      status: 'Connected',
      icon: 'school-outline',
      accent: '#D62828',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="highlight" style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.eyebrow}>Smart Campus Wallet+</Text>
              <Text style={styles.heroTitle}>Dashboard</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Synced 2m ago</Text>
            </View>
          </View>
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStat}>
              <Text style={styles.statLabel}>Projected Balance</Text>
              <Text style={styles.statValue}>$3,420</Text>
              <Text style={styles.statDelta}>On track +$260</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.statLabel}>Semester Savings</Text>
              <Text style={styles.statValue}>$980</Text>
              <Text style={styles.statDeltaPositive}>+18% vs goal</Text>
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Connections</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Manage</Text>
            </TouchableOpacity>
          </View>
          {connections.map((item) => (
            <View key={item.label} style={styles.connectionRow}>
              <View style={[styles.connectionIcon, { backgroundColor: `${item.accent}15` }]}>
                <Ionicons name={item.icon as any} size={20} color={item.accent} />
              </View>
              <View style={styles.connectionInfo}>
                <Text style={styles.connectionLabel}>{item.label}</Text>
                <View style={styles.statusPill}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
            </View>
          ))}
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Balance Projections</Text>
            <View style={styles.legendGroup}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#5AC8FA' }]} />
                <Text style={styles.legendLabel}>On pace</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.accentGreen }]} />
                <Text style={styles.legendLabel}>Optimized</Text>
              </View>
            </View>
          </View>
          <LineChart
            data={onPaceData}
            data2={optimizedData}
            height={220}
            width={chartWidth}
            color="#5AC8FA"
            color2={Colors.accentGreen}
          />
          <View style={styles.projectionFooter}>
            <View>
              <Text style={styles.projectionLabel}>Semester-end difference</Text>
              <Text style={styles.projectionValue}>+$600</Text>
            </View>
            <View style={styles.deltaPill}>
              <Ionicons name="trending-up" size={16} color={Colors.accentGreen} />
              <Text style={styles.deltaText}>AI optimized</Text>
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spending Calendar</Text>
            <Text style={styles.secondaryLabel}>{monthLabel}</Text>
          </View>
          <View style={styles.calendarLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.accentGreen }]} />
              <Text style={styles.legendLabel}>Under budget</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.accentOrange }]} />
              <Text style={styles.legendLabel}>Over budget</Text>
            </View>
          </View>
          <View style={styles.calendarHeaderRow}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
              <Text key={day} style={styles.calendarHeaderText}>
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
                    cell.status === 'under' && styles.calendarCellUnder,
                    cell.status === 'over' && styles.calendarCellOver,
                  ]}
                >
                  <Text
                    style={[
                      styles.calendarCellText,
                      cell.status === 'over' && { color: Colors.surface },
                    ]}
                  >
                    {cell.day}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </Card>

        <Card variant="muted">
          <View style={styles.aiNoteHeader}>
            <View style={styles.sparkleBadge}>
              <Ionicons name="sparkles" size={16} color={Colors.primary} />
            </View>
            <Text style={styles.aiNoteTitle}>AI Notes</Text>
          </View>
          <Text style={styles.aiNoteText}>
            You spent 30% more on dining this week than typical. Consider shifting $25 from
            entertainment.
          </Text>
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
  eyebrow: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 2,
    letterSpacing: 0.4,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  badge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radii.pill,
  },
  badgeText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600',
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
    color: Colors.textMuted,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  statDelta: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  statDeltaPositive: {
    fontSize: 14,
    color: Colors.accentGreen,
    marginTop: 4,
  },
  heroDivider: {
    width: 1,
    height: 58,
    backgroundColor: Colors.border,
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
    color: Colors.text,
  },
  linkText: {
    fontSize: 15,
    color: Colors.primary,
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
  },
  connectionInfo: {
    flex: 1,
  },
  connectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accentGreen,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
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
  legendLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  projectionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  projectionLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  projectionValue: {
    fontSize: 28,
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
    color: Colors.textMuted,
    fontWeight: '600',
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
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarCellUnder: {
    backgroundColor: '#EAFBF0',
  },
  calendarCellOver: {
    backgroundColor: Colors.accentOrange,
  },
  calendarCellText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  secondaryLabel: {
    fontSize: 14,
    color: Colors.textMuted,
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
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  aiNoteTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
  aiNoteText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
});
