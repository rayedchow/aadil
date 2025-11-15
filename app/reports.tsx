import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Colors, Radii, Spacing } from '../constants/theme';

export default function ReportsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('Month');

  const periods = ['Day', 'Week', 'Month', 'Semester'];

  const categories = [
    { name: 'Dining', amount: 420, percent: 35, color: '#FF9500' },
    { name: 'Books', amount: 280, percent: 23, color: '#007AFF' },
    { name: 'Transportation', amount: 180, percent: 15, color: '#34C759' },
    { name: 'Entertainment', amount: 150, percent: 13, color: '#AF52DE' },
    { name: 'Other', amount: 170, percent: 14, color: '#8E8E93' },
  ];

  const aiSuggestions = [
    {
      title: 'Set a weekly dining limit of $160',
      category: 'Budgeting',
      tag: 'Dining',
      time: '3 weeks ago',
      icon: 'wallet',
      color: '#FF9500',
    },
    {
      title: 'Shift $15 from entertainment to transportation',
      category: 'Budgeting',
      tag: 'Optimization',
      time: '1 week ago',
      icon: 'swap-horizontal',
      color: '#007AFF',
    },
    {
      title: 'Overrun Alert: Dining budget exceeded',
      category: 'Overrun Alert',
      tag: 'Dining',
      time: '2 days ago',
      icon: 'warning',
      color: '#FF3B30',
    },
    {
      title: 'Weekend dining spikes detected',
      category: 'Analysis',
      tag: 'Trends',
      time: '5 days ago',
      icon: 'trending-up',
      color: '#34C759',
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
          <Text style={styles.eyebrow}>Insights</Text>
          <Text style={styles.heroTitle}>Monthly Reports</Text>
          <Text style={styles.heroSubtitle}>Digestible analytics + AI suggestions</Text>
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

        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Monthly Snapshot</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.accentGreen} />
              <Text style={styles.ratingText}>Good</Text>
            </View>
          </View>
          <View style={styles.snapshotRow}>
            <View>
              <Text style={styles.snapshotLabel}>Total spending</Text>
              <Text style={styles.snapshotValue}>$1,200</Text>
            </View>
            <View style={styles.snapshotDivider} />
            <View>
              <Text style={styles.snapshotLabel}>Variance vs plan</Text>
              <Text style={styles.snapshotValuePositive}>-$85</Text>
            </View>
          </View>
          <View style={styles.categoryBreakdown}>
            {categories.map((category) => (
              <View key={category.name} style={styles.categoryRow}>
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <View style={styles.categoryBar}>
                  <View
                    style={[
                      styles.categoryFill,
                      { width: `${category.percent}%`, backgroundColor: category.color },
                    ]}
                  />
                </View>
                <Text style={styles.categoryAmount}>${category.amount}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="sparkles" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>AI Suggestions</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.linkText}>View all</Text>
            </TouchableOpacity>
          </View>
          {aiSuggestions.map((suggestion) => (
            <View key={suggestion.title} style={styles.suggestionRow}>
              <View style={[styles.suggestionIcon, { backgroundColor: `${suggestion.color}15` }]}>
                <Ionicons name={suggestion.icon as any} size={18} color={suggestion.color} />
              </View>
              <View style={styles.suggestionBody}>
                <View style={styles.suggestionHeader}>
                  <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                  <Text style={styles.suggestionTime}>{suggestion.time}</Text>
                </View>
                <View style={styles.tagRow}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{suggestion.category}</Text>
                  </View>
                  <View style={[styles.tag, { backgroundColor: `${suggestion.color}15` }]}>
                    <Text style={[styles.tagText, { color: suggestion.color }]}>{suggestion.tag}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Analytical Trends</Text>
          {[
            {
              title: 'Weekend Dining Spikes',
              description:
                'Your dining spending increases by 45% on weekends. Consider meal prepping to reduce costs.',
              icon: 'calendar',
              color: Colors.primary,
            },
            {
              title: 'Transportation Savings',
              description:
                "You've saved $45 by using campus shuttles instead of rideshares. Keep it going!",
              icon: 'trending-down',
              color: Colors.accentGreen,
            },
            {
              title: 'Optimization Opportunity',
              description: 'Reducing entertainment spending by 20% could save $30/month.',
              icon: 'bulb',
              color: Colors.accentOrange,
            },
          ].map((trend, index) => (
            <View key={trend.title}>
              <View style={styles.trendRow}>
                <View style={[styles.trendIcon, { backgroundColor: `${trend.color}15` }]}>
                  <Ionicons name={trend.icon as any} size={18} color={trend.color} />
                </View>
                <View style={styles.trendCopy}>
                  <Text style={styles.trendTitle}>{trend.title}</Text>
                  <Text style={styles.trendDescription}>{trend.description}</Text>
                </View>
              </View>
              {index < 2 && <View style={styles.trendDivider} />}
            </View>
          ))}
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
  eyebrow: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  heroSubtitle: {
    fontSize: 15,
    color: Colors.textMuted,
    marginTop: 6,
  },
  heroToggle: {
    flexDirection: 'row',
    marginTop: 18,
    backgroundColor: Colors.surface,
    borderRadius: Radii.pill,
    padding: 4,
  },
  periodChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: Radii.pill,
  },
  periodChipActive: {
    backgroundColor: Colors.primary,
  },
  periodChipText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  periodChipTextActive: {
    color: Colors.surface,
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
    color: Colors.text,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8EF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    gap: 6,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.accentGreen,
  },
  snapshotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  snapshotLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  snapshotValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  snapshotValuePositive: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.accentGreen,
  },
  snapshotDivider: {
    width: 1,
    height: 48,
    backgroundColor: Colors.border,
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
    color: Colors.text,
    fontWeight: '500',
  },
  categoryBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
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
    color: Colors.text,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  linkText: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '600',
  },
  suggestionRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  suggestionIcon: {
    width: 42,
    height: 42,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: Colors.text,
  },
  suggestionTime: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.surfaceMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
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
  },
  trendCopy: {
    flex: 1,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  trendDescription: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
    marginTop: 4,
  },
  trendDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginTop: 16,
  },
});

