import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card } from "../components/Card";
import { ProgressRing } from "../components/ProgressRing";
import { Radii, Spacing, ThemeColors } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";

export default function BudgetingScreen() {
  const budgets = [
    {
      category: "Dining",
      used: 142,
      limit: 175,
      color: "#FF9500",
      icon: "restaurant",
    },
    { category: "Books", used: 89, limit: 180, color: "#007AFF", icon: "book" },
    {
      category: "Transportation",
      used: 56,
      limit: 240,
      color: "#34C759",
      icon: "car",
    },
    {
      category: "Entertainment",
      used: 45,
      limit: 100,
      color: "#AF52DE",
      icon: "musical-notes",
    },
    {
      category: "Clubs",
      used: 78,
      limit: 120,
      color: "#FF3B30",
      icon: "people",
    },
  ];

  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const heroAnim = useRef(new Animated.Value(0)).current;
  const budgetAnimations = useRef(
    budgets.map(() => new Animated.Value(0))
  ).current;
  const monthlyAnim = useRef(new Animated.Value(0)).current;
  const aiAnim = useRef(new Animated.Value(0)).current;
  const categoriesAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    heroAnim.setValue(0);
    budgetAnimations.forEach((anim) => anim.setValue(0));
    monthlyAnim.setValue(0);
    aiAnim.setValue(0);
    categoriesAnim.setValue(0);

    const timing = (value: Animated.Value, delay = 0) =>
      Animated.timing(value, {
        toValue: 1,
        duration: 520,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });

    Animated.sequence([
      timing(heroAnim),
      Animated.stagger(
        110,
        budgetAnimations.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 520,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          })
        )
      ),
      Animated.parallel([timing(monthlyAnim), timing(aiAnim, 80)]),
      timing(categoriesAnim),
    ]).start();
  }, [heroAnim, budgetAnimations, monthlyAnim, aiAnim, categoriesAnim]);

  const fadeUp = (value: Animated.Value) => ({
    opacity: value,
    transform: [
      {
        translateY: value.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={fadeUp(heroAnim)}>
          <Card variant="highlight" style={styles.heroCard}>
            <Text style={styles.eyebrow}>Smart Allocations</Text>
            <Text style={styles.heroTitle}>Budgeting Control</Text>
            <Text style={styles.heroSubtitle}>
              Auto-adjusted across week & month
            </Text>
            <View style={styles.heroMetrics}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Weekly Remaining</Text>
                <Text style={styles.metricValue}>$248</Text>
                <Text style={styles.metricDelta}>+12% efficiency</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Monthly Remaining</Text>
                <Text style={styles.metricValue}>$405</Text>
                <Text style={styles.metricDeltaPositive}>
                  Tracking under budget
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Budget</Text>
            <Text style={styles.secondaryText}>Auto-sync enabled</Text>
          </View>
          <View style={styles.budgetGrid}>
            {budgets.map((budget, index) => {
              const percent = Math.round((budget.used / budget.limit) * 100);
              return (
                <Animated.View
                  key={budget.category}
                  style={[styles.budgetTile, fadeUp(budgetAnimations[index])]}
                >
                  <ProgressRing
                    progress={percent}
                    size={90}
                    strokeWidth={8}
                    color={budget.color}
                    amount={`$${budget.used}`}
                    label={budget.category}
                  />
                  <Text style={styles.budgetMeta}>of ${budget.limit}</Text>
                  <Text style={styles.budgetPercent}>{percent}% utilized</Text>
                </Animated.View>
              );
            })}
          </View>
        </Card>

        <Animated.View style={fadeUp(monthlyAnim)}>
          <Card>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Monthly Overview</Text>
              <TouchableOpacity>
                <Text style={styles.linkText}>Export</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.monthlyStats}>
              <View style={styles.statBlock}>
                <Text style={styles.statLabel}>Total Budget</Text>
                <Text style={styles.statValue}>$815</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBlock}>
                <Text style={styles.statLabel}>Spent</Text>
                <Text style={styles.statValue}>$410</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBlock}>
                <Text style={styles.statLabel}>Remaining</Text>
                <Text style={[styles.statValue, { color: colors.accentGreen }]}>
                  $405
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Animated.View style={fadeUp(aiAnim)}>
          <Card variant="muted">
            <View style={styles.aiHeader}>
              <View style={styles.sparkleBadge}>
                <Ionicons name="sparkles" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.aiTitle}>AI Recommendation</Text>
                <Text style={styles.aiSubtitle}>
                  Overspent in transportation — shift $15?
                </Text>
              </View>
            </View>
            <View style={styles.aiActions}>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Adjust</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </Animated.View>

        <Animated.View style={fadeUp(categoriesAnim)}>
          <Card>
            <Text style={styles.sectionTitle}>Category Breakdown</Text>
            {budgets.map((budget) => {
              const percent = Math.round((budget.used / budget.limit) * 100);
              const remaining = budget.limit - budget.used;
              return (
                <View key={budget.category} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryLeft}>
                      <View
                        style={[
                          styles.categoryIcon,
                          { backgroundColor: `${budget.color}15` },
                        ]}
                      >
                        <Ionicons
                          name={budget.icon as any}
                          size={18}
                          color={budget.color}
                        />
                      </View>
                      <View>
                        <Text style={styles.categoryName}>
                          {budget.category}
                        </Text>
                        <Text style={styles.categorySubtext}>
                          ${budget.used} / ${budget.limit}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.categoryPercent}>{percent}%</Text>
                  </View>
                  <View style={styles.progressBarTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(percent, 100)}%`,
                          backgroundColor: budget.color,
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={
                      remaining > 0 ? styles.remainingText : styles.overText
                    }
                  >
                    {remaining > 0
                      ? `$${remaining} remaining`
                      : `$${Math.abs(remaining)} over budget`}
                  </Text>
                </View>
              );
            })}
          </Card>
        </Animated.View>
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
    },
    heroTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text,
    },
    heroSubtitle: {
      fontSize: 15,
      color: colors.textMuted,
      marginTop: 8,
    },
    heroMetrics: {
      flexDirection: "row",
      marginTop: 20,
    },
    metric: {
      flex: 1,
    },
    metricLabel: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 6,
    },
    metricValue: {
      fontSize: 26,
      fontWeight: "700",
      color: colors.text,
    },
    metricDelta: {
      fontSize: 13,
      color: colors.textMuted,
      marginTop: 4,
    },
    metricDeltaPositive: {
      fontSize: 13,
      color: colors.accentGreen,
      marginTop: 4,
    },
    metricDivider: {
      width: 1,
      backgroundColor: colors.border,
      marginHorizontal: 18,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 18,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    secondaryText: {
      fontSize: 13,
      color: colors.textMuted,
    },
    budgetGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 20,
    },
    budgetTile: {
      width: "45%",
      alignItems: "center",
      backgroundColor: colors.surfaceMuted,
      borderRadius: Radii.md,
      paddingVertical: 16,
    },
    budgetMeta: {
      fontSize: 13,
      color: colors.textMuted,
      marginTop: 6,
    },
    budgetPercent: {
      fontSize: 13,
      color: colors.text,
      fontWeight: "600",
      marginTop: 4,
    },
    linkText: {
      fontSize: 15,
      color: colors.primary,
      fontWeight: "600",
    },
    monthlyStats: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: Radii.lg,
      overflow: "hidden",
    },
    statBlock: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 16,
    },
    statLabel: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 4,
    },
    statValue: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
    },
    statDivider: {
      width: 1,
      backgroundColor: colors.border,
    },
    aiHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 16,
    },
    sparkleBadge: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.primarySoft,
      alignItems: "center",
      justifyContent: "center",
    },
    aiTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    aiSubtitle: {
      fontSize: 14,
      color: colors.textMuted,
      marginTop: 2,
    },
    aiActions: {
      flexDirection: "row",
      gap: 12,
    },
    primaryButton: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: Radii.pill,
      paddingVertical: 12,
      alignItems: "center",
    },
    primaryButtonText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: "600",
    },
    secondaryButton: {
      flex: 1,
      borderRadius: Radii.pill,
      borderWidth: 1,
      borderColor: colors.primary,
      paddingVertical: 12,
      alignItems: "center",
    },
    secondaryButtonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "600",
    },
    categoryItem: {
      marginTop: 18,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: 16,
    },
    categoryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    categoryLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    categoryIcon: {
      width: 40,
      height: 40,
      borderRadius: Radii.md,
      alignItems: "center",
      justifyContent: "center",
    },
    categoryName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    categorySubtext: {
      fontSize: 13,
      color: colors.textMuted,
    },
    categoryPercent: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    progressBarTrack: {
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.border,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: 4,
    },
    remainingText: {
      fontSize: 13,
      color: colors.accentGreen,
      marginTop: 6,
    },
    overText: {
      fontSize: 13,
      color: "#FF3B30",
      marginTop: 6,
    },
  });
