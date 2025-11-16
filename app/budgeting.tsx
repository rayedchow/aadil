import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Card } from '../components/Card';
import { ProgressRing } from '../components/ProgressRing';
import { Radii, Spacing, ThemeColors, Fonts } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { api, BudgetAllocation, BudgetSpending, BudgetSuggestion } from '../services/api';

export default function BudgetingScreen() {
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState<BudgetAllocation[]>([]);
  const [spending, setSpending] = useState<BudgetSpending[]>([]);
  const [suggestions, setSuggestions] = useState<BudgetSuggestion[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [budgetsData, spendingData, suggestionsData] = await Promise.all([
        api.getBudgets(),
        api.getBudgetSpending(),
        api.getBudgetSuggestions(),
      ]);
      setBudgets(budgetsData);
      setSpending(spendingData);
      setSuggestions(suggestionsData);
    } catch (error) {
      console.error('Failed to load budget data:', error);
      Alert.alert('Error', 'Failed to load budgets. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const saveBudgets = async () => {
    try {
      setSaving(true);
      await api.updateBudgets(budgets);
      await loadData();
      setEditMode(false);
      Alert.alert('Success', 'Budget allocations updated! AI suggestions have been refreshed.');
    } catch (error) {
      console.error('Failed to save budgets:', error);
      Alert.alert('Error', 'Failed to save budgets.');
    } finally {
      setSaving(false);
    }
  };

  const updateBudgetLimit = (category: string, newLimit: number) => {
    setBudgets((prev) =>
      prev.map((b) =>
        b.category === category ? { ...b, weekly_limit: Math.round(newLimit) } : b
      )
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.secondaryText, { marginTop: 12 }]}>Loading budgets...</Text>
      </SafeAreaView>
    );
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.weekly_limit, 0);
  const totalSpent = spending.reduce((sum, s) => sum + s.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="highlight" style={styles.heroCard}>
          <Text style={styles.eyebrow}>Smart Allocations</Text>
          <Text style={styles.heroTitle}>Budget Control</Text>
          <Text style={styles.heroSubtitle}>Adjust your weekly spending limits</Text>
          <View style={styles.heroMetrics}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Weekly Budget</Text>
              <Text style={styles.metricValue}>${totalBudget}</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Spent This Week</Text>
              <Text style={styles.metricValue}>${totalSpent.toFixed(0)}</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Remaining</Text>
              <Text style={[styles.metricValue, { color: colors.accentGreen }]}>
                ${totalRemaining.toFixed(0)}
              </Text>
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Spending</Text>
            <TouchableOpacity onPress={() => setEditMode(!editMode)}>
              <Text style={styles.linkText}>{editMode ? 'Cancel' : 'Adjust'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.budgetGrid}>
            {spending.map((item) => {
              const percent = Math.round(item.percentage);
              return (
                <View key={item.category} style={styles.budgetTile}>
                  <ProgressRing
                    progress={percent}
                    size={90}
                    strokeWidth={8}
                    color={item.color}
                    amount={`$${item.spent.toFixed(0)}`}
                    label={item.category}
                  />
                  <Text style={styles.budgetMeta}>of ${item.limit}</Text>
                  <Text style={styles.budgetPercent}>{percent}% used</Text>
                </View>
              );
            })}
          </View>

          {editMode && (
            <View style={styles.editSection}>
              <Text style={styles.sectionTitle}>Adjust Weekly Limits</Text>
              {budgets.map((budget) => (
                <View key={budget.category} style={styles.sliderItem}>
                  <View style={styles.sliderHeader}>
                    <View style={[styles.sliderIcon, { backgroundColor: `${budget.color}15` }]}>
                      <Ionicons name={budget.icon as any} size={16} color={budget.color} />
                    </View>
                    <Text style={styles.sliderLabel}>{budget.category}</Text>
                    <Text style={styles.sliderValue}>${budget.weekly_limit}/week</Text>
                  </View>
                  <Slider
                    style={styles.slider}
                    minimumValue={20}
                    maximumValue={300}
                    value={budget.weekly_limit}
                    onValueChange={(value) => updateBudgetLimit(budget.category, value)}
                    minimumTrackTintColor={budget.color}
                    maximumTrackTintColor={colors.border}
                    thumbTintColor={budget.color}
                  />
                </View>
              ))}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveBudgets}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={colors.surface} />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Card>

        {suggestions.length > 0 && (
          <Card variant="muted">
            <View style={styles.aiHeader}>
              <View style={styles.sparkleBadge}>
                <Ionicons name="sparkles" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.aiTitle}>AI Recommendations</Text>
                <Text style={styles.aiSubtitle}>
                  Based on your current allocations and spending
                </Text>
              </View>
            </View>
            {suggestions.map((suggestion, index) => (
              <View key={index} style={styles.suggestionCard}>
                <View style={styles.suggestionHeader}>
                  <View
                    style={[
                      styles.suggestionIcon,
                      {
                        backgroundColor:
                          suggestion.type === 'decrease'
                            ? 'rgba(255, 59, 48, 0.1)'
                            : suggestion.type === 'increase'
                            ? 'rgba(52, 199, 89, 0.1)'
                            : 'rgba(90, 200, 250, 0.1)',
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        suggestion.type === 'decrease'
                          ? 'warning'
                          : suggestion.type === 'increase'
                          ? 'trending-up'
                          : 'checkmark-circle'
                      }
                      size={18}
                      color={
                        suggestion.type === 'decrease'
                          ? '#FF3B30'
                          : suggestion.type === 'increase'
                          ? colors.accentGreen
                          : '#5AC8FA'
                      }
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.suggestionCategory}>{suggestion.category}</Text>
                    <Text style={styles.suggestionText}>{suggestion.suggestion}</Text>
                    <Text style={styles.suggestionImpact}>{suggestion.impact}</Text>
                  </View>
                </View>
              </View>
            ))}
          </Card>
        )}

        <Card>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          {spending.map((item) => {
            const remaining = item.limit - item.spent;
            return (
              <View key={item.category} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryLeft}>
                    <View
                      style={[styles.categoryIcon, { backgroundColor: `${item.color}15` }]}
                    >
                      <Ionicons name={item.icon as any} size={18} color={item.color} />
                    </View>
                    <View>
                      <Text style={styles.categoryName}>{item.category}</Text>
                      <Text style={styles.categorySubtext}>
                        ${item.spent.toFixed(2)} / ${item.limit}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.categoryPercent}>{item.percentage.toFixed(0)}%</Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(item.percentage, 100)}%`,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                </View>
                <Text style={remaining > 0 ? styles.remainingText : styles.overText}>
                  {remaining > 0
                    ? `$${remaining.toFixed(2)} remaining`
                    : `$${Math.abs(remaining).toFixed(2)} over budget`}
                </Text>
              </View>
            );
          })}
        </Card>
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
      marginTop: 8,
      fontFamily: Fonts.regular,
    },
    heroMetrics: {
      flexDirection: 'row',
      marginTop: 20,
    },
    metric: {
      flex: 1,
      alignItems: 'center',
    },
    metricLabel: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 6,
      fontFamily: Fonts.regular,
    },
    metricValue: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    metricDivider: {
      width: 1,
      backgroundColor: colors.border,
      marginHorizontal: 12,
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
    secondaryText: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
    },
    linkText: {
      fontSize: 15,
      color: colors.primary,
      fontWeight: '600',
      fontFamily: Fonts.semiBold,
    },
    budgetGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 20,
    },
    budgetTile: {
      width: '45%',
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderRadius: Radii.md,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    budgetMeta: {
      fontSize: 13,
      color: colors.textMuted,
      marginTop: 6,
      fontFamily: Fonts.regular,
    },
    budgetPercent: {
      fontSize: 13,
      color: colors.text,
      fontWeight: '600',
      marginTop: 4,
      fontFamily: Fonts.semiBold,
    },
    editSection: {
      marginTop: 24,
      paddingTop: 24,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    sliderItem: {
      marginBottom: 24,
    },
    sliderHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    sliderIcon: {
      width: 32,
      height: 32,
      borderRadius: Radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sliderLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
      fontFamily: Fonts.semiBold,
    },
    sliderValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
      fontFamily: Fonts.semiBold,
    },
    slider: {
      width: '100%',
      height: 40,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: Radii.pill,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    saveButtonText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: '600',
      fontFamily: Fonts.semiBold,
    },
    aiHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
    },
    sparkleBadge: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    aiTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    aiSubtitle: {
      fontSize: 14,
      color: colors.textMuted,
      marginTop: 2,
      fontFamily: Fonts.regular,
    },
    suggestionCard: {
      marginBottom: 12,
      padding: 12,
      backgroundColor: colors.surfaceMuted,
      borderRadius: Radii.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    suggestionHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    suggestionIcon: {
      width: 36,
      height: 36,
      borderRadius: Radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    suggestionCategory: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
      fontFamily: Fonts.bold,
    },
    suggestionText: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
      marginBottom: 4,
      fontFamily: Fonts.regular,
    },
    suggestionImpact: {
      fontSize: 13,
      color: colors.textMuted,
      fontStyle: 'italic',
      fontFamily: Fonts.regular,
    },
    categoryItem: {
      marginTop: 18,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: 16,
    },
    categoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    categoryLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    categoryIcon: {
      width: 40,
      height: 40,
      borderRadius: Radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      fontFamily: Fonts.semiBold,
    },
    categorySubtext: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
    },
    categoryPercent: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      fontFamily: Fonts.semiBold,
    },
    progressBarTrack: {
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.border,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
    remainingText: {
      fontSize: 13,
      color: colors.accentGreen,
      marginTop: 6,
      fontFamily: Fonts.regular,
    },
    overText: {
      fontSize: 13,
      color: '#FF3B30',
      marginTop: 6,
      fontFamily: Fonts.regular,
    },
  });
