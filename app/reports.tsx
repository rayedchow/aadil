import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Radii, Spacing, ThemeColors, Fonts } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { api, InsightItem } from '../services/api';

export default function ReportsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'Week' | 'Semester'>('Week');
  const [loading, setLoading] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState<any[]>([]);
  const [semesterReport, setSemesterReport] = useState<any>(null);
  const [insights, setInsights] = useState<InsightItem[]>([]);

  const periods: Array<'Week' | 'Semester'> = ['Week', 'Semester'];

  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const [weekly, semester, insightsData] = await Promise.all([
        api.getWeeklyReports(),
        api.getSemesterReport(),
        api.getInsights(),
      ]);
      setWeeklyReports(weekly);
      setSemesterReport(semester);
      setInsights(insightsData);
    } catch (error) {
      console.error('Failed to load reports:', error);
      Alert.alert('Error', 'Failed to load reports. Make sure the backend is running and insights are generated.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.snapshotLabel, { marginTop: 12 }]}>Loading reports...</Text>
      </SafeAreaView>
    );
  }

  const getIconForInsightType = (type: string) => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'tip':
        return 'bulb';
      case 'achievement':
        return 'checkmark-circle';
      default:
        return 'information-circle';
    }
  };

  const getColorForInsightType = (type: string) => {
    switch (type) {
      case 'warning':
        return '#FF3B30';
      case 'tip':
        return colors.primary;
      case 'achievement':
        return colors.accentGreen;
      default:
        return colors.textMuted;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="highlight" style={styles.heroCard}>
          <Text style={styles.eyebrow}>Insights</Text>
          <Text style={styles.heroTitle}>Financial Reports</Text>
          <Text style={styles.heroSubtitle}>AI-generated insights and analytics</Text>
          <View style={styles.heroToggle}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodChip,
                  selectedPeriod === period && styles.periodChipActive,
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  style={[
                    styles.periodChipText,
                    selectedPeriod === period && styles.periodChipTextActive,
                  ]}
                >
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {selectedPeriod === 'Week' && weeklyReports.length > 0 && (
          <>
            {weeklyReports.map((report, index) => (
              <Card key={report.week}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Week {report.week}</Text>
                  <View
                    style={[
                      styles.ratingBadge,
                      {
                        backgroundColor:
                          report.net >= 0
                            ? '#E8F8EF'
                            : 'rgba(255, 59, 48, 0.1)',
                      },
                    ]}
                  >
                    <Ionicons
                      name={report.net >= 0 ? 'trending-up' : 'trending-down'}
                      size={16}
                      color={report.net >= 0 ? colors.accentGreen : '#FF3B30'}
                    />
                    <Text
                      style={[
                        styles.ratingText,
                        { color: report.net >= 0 ? colors.accentGreen : '#FF3B30' },
                      ]}
                    >
                      {report.net >= 0 ? 'Surplus' : 'Deficit'}
                    </Text>
                  </View>
                </View>
                <View style={styles.snapshotRow}>
                  <View>
                    <Text style={styles.snapshotLabel}>Spending</Text>
                    <Text style={styles.snapshotValue}>${report.spending.toFixed(0)}</Text>
                  </View>
                  <View style={styles.snapshotDivider} />
                  <View>
                    <Text style={styles.snapshotLabel}>Income</Text>
                    <Text style={styles.snapshotValue}>${report.income.toFixed(0)}</Text>
                  </View>
                  <View style={styles.snapshotDivider} />
                  <View>
                    <Text style={styles.snapshotLabel}>Net</Text>
                    <Text
                      style={
                        report.net >= 0
                          ? styles.snapshotValuePositive
                          : [styles.snapshotValuePositive, { color: '#FF3B30' }]
                      }
                    >
                      ${report.net.toFixed(0)}
                    </Text>
                  </View>
                </View>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryText}>{report.summary}</Text>
                </View>
              </Card>
            ))}
          </>
        )}

        {selectedPeriod === 'Semester' && semesterReport && (
          <Card>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Semester Overview</Text>
              <View style={styles.ratingBadge}>
                <Ionicons
                  name={semesterReport.net >= 0 ? 'checkmark-circle' : 'alert-circle'}
                  size={16}
                  color={semesterReport.net >= 0 ? colors.accentGreen : '#FF3B30'}
                />
                <Text
                  style={[
                    styles.ratingText,
                    { color: semesterReport.net >= 0 ? colors.accentGreen : '#FF3B30' },
                  ]}
                >
                  {semesterReport.net >= 0 ? 'Positive' : 'Negative'}
                </Text>
              </View>
            </View>
            <View style={styles.snapshotRow}>
              <View>
                <Text style={styles.snapshotLabel}>Total Spending</Text>
                <Text style={styles.snapshotValue}>
                  ${semesterReport.total_spending.toFixed(0)}
                </Text>
              </View>
              <View style={styles.snapshotDivider} />
              <View>
                <Text style={styles.snapshotLabel}>Total Income</Text>
                <Text style={styles.snapshotValue}>
                  ${semesterReport.total_income.toFixed(0)}
                </Text>
              </View>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <Text style={styles.summaryText}>{semesterReport.overview}</Text>
            </View>
            {semesterReport.strengths && semesterReport.strengths.length > 0 && (
              <View style={styles.listSection}>
                <Text style={styles.listTitle}>Strengths</Text>
                {semesterReport.strengths.map((strength: string, idx: number) => (
                  <View key={idx} style={styles.listItem}>
                    <Ionicons name="checkmark-circle" size={18} color={colors.accentGreen} />
                    <Text style={styles.listText}>{strength}</Text>
                  </View>
                ))}
              </View>
            )}
            {semesterReport.improvements && semesterReport.improvements.length > 0 && (
              <View style={styles.listSection}>
                <Text style={styles.listTitle}>Areas for Improvement</Text>
                {semesterReport.improvements.map((improvement: string, idx: number) => (
                  <View key={idx} style={styles.listItem}>
                    <Ionicons name="bulb-outline" size={18} color={colors.accentOrange} />
                    <Text style={styles.listText}>{improvement}</Text>
                  </View>
                ))}
              </View>
            )}
          </Card>
        )}

        {insights.length > 0 && (
          <Card>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="sparkles" size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>AI Insights</Text>
              </View>
            </View>
            {insights.slice(0, 5).map((insight) => {
              const iconName = getIconForInsightType(insight.type);
              const iconColor = getColorForInsightType(insight.type);
              return (
                <View key={insight.id} style={styles.suggestionRow}>
                  <View style={[styles.suggestionIcon, { backgroundColor: `${iconColor}15` }]}>
                    <Ionicons name={iconName as any} size={18} color={iconColor} />
                  </View>
                  <View style={styles.suggestionBody}>
                    <View style={styles.suggestionHeader}>
                      <Text style={styles.suggestionTitle}>{insight.title}</Text>
                    </View>
                    <Text style={styles.trendDescription}>{insight.content}</Text>
                    <View style={styles.tagRow}>
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>{insight.type}</Text>
                      </View>
                      <View style={[styles.tag, { backgroundColor: `${iconColor}15` }]}>
                        <Text style={[styles.tagText, { color: iconColor }]}>
                          {insight.category}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
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
    eyebrow: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 4,
      fontFamily: Fonts.regular,
    },
    heroTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    heroSubtitle: {
      fontSize: 15,
      color: colors.textMuted,
      marginTop: 6,
      fontFamily: Fonts.regular,
    },
    heroToggle: {
      flexDirection: 'row',
      marginTop: 18,
      backgroundColor: colors.surfaceMuted,
      borderRadius: Radii.pill,
      padding: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    periodChip: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 8,
      borderRadius: Radii.pill,
    },
    periodChipActive: {
      backgroundColor: colors.primary,
    },
    periodChipText: {
      fontSize: 13,
      color: colors.textMuted,
      fontWeight: '600',
      fontFamily: Fonts.semiBold,
    },
    periodChipTextActive: {
      color: colors.surface,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    ratingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#E8F8EF',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: Radii.pill,
      gap: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    ratingText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.accentGreen,
      fontFamily: Fonts.semiBold,
    },
    snapshotRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
    },
    snapshotLabel: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
    },
    snapshotValue: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    snapshotValuePositive: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.accentGreen,
      fontFamily: Fonts.bold,
    },
    snapshotDivider: {
      width: 1,
      height: 48,
      backgroundColor: colors.border,
    },
    categoryBreakdown: {
      marginTop: 16,
      gap: 14,
    },
    categoryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    categoryLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      width: 120,
      gap: 8,
    },
    categoryDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    categoryName: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '500',
    },
    categoryBar: {
      flex: 1,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.border,
      overflow: 'hidden',
    },
    categoryFill: {
      height: '100%',
    },
    categoryAmount: {
      width: 60,
      textAlign: 'right',
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    linkText: {
      fontSize: 15,
      color: colors.primary,
      fontWeight: '600',
      fontFamily: Fonts.semiBold,
    },
    suggestionRow: {
      flexDirection: 'row',
      gap: 12,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    suggestionIcon: {
      width: 42,
      height: 42,
      borderRadius: Radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    suggestionBody: {
      flex: 1,
    },
    suggestionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    suggestionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      fontFamily: Fonts.semiBold,
    },
    suggestionTime: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
    },
    tagRow: {
      flexDirection: 'row',
      gap: 8,
    },
    tag: {
      backgroundColor: colors.surfaceMuted,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: Radii.pill,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tagText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textMuted,
      fontFamily: Fonts.semiBold,
    },
    trendRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 16,
    },
    trendIcon: {
      width: 38,
      height: 38,
      borderRadius: Radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    trendCopy: {
      flex: 1,
    },
    trendTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      fontFamily: Fonts.semiBold,
    },
    trendDescription: {
      fontSize: 14,
      color: colors.textMuted,
      lineHeight: 20,
      marginTop: 4,
      fontFamily: Fonts.regular,
    },
    trendDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginTop: 16,
    },
    summaryCard: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: Radii.md,
      padding: 16,
      marginTop: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    summaryText: {
      fontSize: 15,
      color: colors.text,
      lineHeight: 22,
      fontFamily: Fonts.regular,
    },
    listSection: {
      marginTop: 16,
    },
    listTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 12,
      fontFamily: Fonts.bold,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      marginBottom: 10,
    },
    listText: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
      fontFamily: Fonts.regular,
    },
  });

