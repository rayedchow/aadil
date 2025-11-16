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
import { api, Transaction, SimulationState } from '../services/api';

export default function PaymentsScreen() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [state, setState] = useState<SimulationState | null>(null);
  const [timeline, setTimeline] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const upcomingPayments = [
    { 
      name: 'Dining Hall Pass', 
      amount: 45.00, 
      icon: 'restaurant', 
      color: '#FF9500',
      category: 'Dining',
      description: 'Weekly meal plan',
      dueIn: '2 days'
    },
    { 
      name: 'Gym Membership', 
      amount: 25.00, 
      icon: 'fitness', 
      color: '#30D158',
      category: 'Entertainment',
      description: 'Monthly fitness center access',
      dueIn: '5 days'
    },
    { 
      name: 'Club Dues', 
      amount: 30.00, 
      icon: 'people', 
      color: '#AF52DE',
      category: 'Entertainment',
      description: 'Computer Science Club',
      dueIn: '1 week'
    },
  ];

  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [txns, stateData, timelineData] = await Promise.all([
        api.getRecentTransactions(15),
        api.getState(),
        api.getTimeline(),
      ]);
      setTransactions(txns);
      setState(stateData);
      setTimeline(timelineData);
    } catch (error) {
      console.error('Failed to load payments data:', error);
      Alert.alert('Error', 'Failed to load payments data. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentPress = (payment: any) => {
    const projectedBalance = state ? state.current_balance - payment.amount : 0;
    const impactText = projectedBalance >= 0 
      ? `After this payment, your balance will be $${projectedBalance.toFixed(2)}`
      : `⚠️ This payment would put you $${Math.abs(projectedBalance).toFixed(2)} in the red`;

    Alert.alert(
      `Pay ${payment.name}?`,
      `Amount: $${payment.amount.toFixed(2)}\n${payment.description}\n\n${impactText}\n\nThis will update your projections.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Simulate Payment',
          style: projectedBalance >= 0 ? 'default' : 'destructive',
          onPress: () => simulatePayment(payment),
        },
      ]
    );
  };

  const simulatePayment = async (payment: any) => {
    Alert.alert('Payment Simulated', `$${payment.amount.toFixed(2)} payment for ${payment.name} has been processed.\n\nNote: This is a simulation. Connect your real payment provider for actual transactions.`);
    await loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCategoryIcon = (category: string): string => {
    const iconMap: { [key: string]: string } = {
      'Dining': 'restaurant',
      'Off-Campus Food': 'fast-food',
      'Coffee': 'cafe',
      'Groceries': 'basket',
      'Transportation': 'car',
      'Ride Share': 'car',
      'Entertainment': 'game-controller',
      'Textbooks': 'book',
      'School Supplies': 'pencil',
      'Clothing': 'shirt',
      'Phone Bill': 'phone-portrait',
      'Utilities': 'flash',
    };
    return iconMap[category] || 'card';
  };

  const getCategoryColor = (category: string): string => {
    const colorMap: { [key: string]: string } = {
      'Dining': '#FF9500',
      'Off-Campus Food': '#FF9500',
      'Coffee': '#FF3B30',
      'Groceries': '#34C759',
      'Transportation': '#007AFF',
      'Ride Share': '#007AFF',
      'Entertainment': '#AF52DE',
      'Textbooks': '#5856D6',
      'School Supplies': '#5AC8FA',
      'Clothing': '#FF2D55',
    };
    return colorMap[category] || colors.textMuted;
  };

  const getRelativeDate = (dateStr: string): string => {
    if (!state) return dateStr;
    const current = new Date(state.current_date);
    const txnDate = new Date(dateStr);
    const diffDays = Math.floor((current.getTime() - txnDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return txnDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading || !state || !timeline) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.sectionHint, { marginTop: 12 }]}>Loading payments...</Text>
      </SafeAreaView>
    );
  }

  const totalUpcoming = upcomingPayments.reduce((sum, p) => sum + p.amount, 0);
  const balanceAfterUpcoming = state.current_balance - totalUpcoming;
  const projectedIn2Weeks = timeline.on_pace[timeline.on_pace.length - 1]?.balance || 0;
  
  const weekSpending = transactions
    .filter(t => t.type === 'expense')
    .slice(0, 7)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="highlight" style={styles.heroCard}>
          <Text style={styles.eyebrow}>Financial Overview</Text>
          <Text style={styles.heroTitle}>Payment Impact</Text>
          <View style={styles.balanceGrid}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Current</Text>
              <Text style={styles.balanceValue}>${state.current_balance.toFixed(0)}</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={colors.textMuted} />
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>After Upcoming</Text>
              <Text style={[styles.balanceValue, { 
                color: balanceAfterUpcoming < 500 ? colors.accentOrange : colors.text 
              }]}>
                ${balanceAfterUpcoming.toFixed(0)}
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={colors.textMuted} />
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>In 2 Weeks</Text>
              <Text style={[styles.balanceValue, { 
                color: projectedIn2Weeks < 500 ? colors.accentOrange : colors.accentGreen 
              }]}>
                ${projectedIn2Weeks.toFixed(0)}
              </Text>
            </View>
          </View>
          <View style={styles.insightRow}>
            <Ionicons name="information-circle" size={16} color={colors.textMuted} />
            <Text style={styles.insightText}>
              {balanceAfterUpcoming >= 500 
                ? 'Your upcoming payments are manageable'
                : '⚠️ Upcoming payments may strain your budget'}
            </Text>
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Payments</Text>
            <View style={styles.totalBadge}>
              <Text style={styles.totalText}>${totalUpcoming.toFixed(0)} due</Text>
            </View>
          </View>
          {upcomingPayments.map((payment) => (
            <TouchableOpacity 
              key={payment.name} 
              style={styles.paymentRow}
              onPress={() => handlePaymentPress(payment)}
            >
              <View style={[styles.paymentIcon, { backgroundColor: `${payment.color}15` }]}>
                <Ionicons name={payment.icon as any} size={22} color={payment.color} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>{payment.name}</Text>
                <Text style={styles.paymentDescription}>{payment.description}</Text>
                <View style={styles.dueBadge}>
                  <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                  <Text style={styles.dueText}>Due in {payment.dueIn}</Text>
                </View>
              </View>
              <View style={styles.paymentRight}>
                <Text style={styles.paymentAmount}>${payment.amount.toFixed(2)}</Text>
                <TouchableOpacity 
                  style={styles.payButton}
                  onPress={() => handlePaymentPress(payment)}
                >
                  <Text style={styles.payButtonText}>Pay</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
          <View style={styles.impactCard}>
            <Ionicons name="analytics-outline" size={18} color={colors.primary} />
            <Text style={styles.impactText}>
              Paying all upcoming: ${balanceAfterUpcoming.toFixed(0)} remaining
            </Text>
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>This Week's Spending</Text>
            <View style={styles.weekBadge}>
              <Text style={styles.weekText}>${weekSpending.toFixed(0)}</Text>
            </View>
          </View>
          <View style={styles.spendingBreakdown}>
            {['Dining', 'Transportation', 'Entertainment', 'Coffee'].map((category) => {
              const catSpending = transactions
                .filter(t => 
                  (t.category === category || 
                   (category === 'Dining' && t.category === 'Off-Campus Food') ||
                   (category === 'Transportation' && t.category === 'Ride Share')) 
                  && t.type === 'expense'
                )
                .slice(0, 7)
                .reduce((sum, t) => sum + t.amount, 0);
              
              const percentage = weekSpending > 0 ? (catSpending / weekSpending * 100) : 0;
              
              if (catSpending === 0) return null;
              
              return (
                <View key={category} style={styles.breakdownRow}>
                  <View style={styles.breakdownLeft}>
                    <View style={[styles.breakdownDot, { 
                      backgroundColor: category === 'Dining' ? '#FF9500' :
                                     category === 'Transportation' ? '#007AFF' :
                                     category === 'Entertainment' ? '#AF52DE' : '#FF3B30'
                    }]} />
                    <Text style={styles.breakdownLabel}>{category}</Text>
                  </View>
                  <Text style={styles.breakdownValue}>${catSpending.toFixed(0)}</Text>
                  <Text style={styles.breakdownPercent}>{percentage.toFixed(0)}%</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.weeklyInsight}>
            <Ionicons name="bulb-outline" size={16} color={colors.accentOrange} />
            <Text style={styles.weeklyInsightText}>
              {weekSpending > 100 
                ? `Spending ${((weekSpending - 100) / 100 * 100).toFixed(0)}% above typical weekly average`
                : 'Spending is on track this week'}
            </Text>
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <Text style={styles.sectionHint}>{transactions.length} recent</Text>
          </View>
          {transactions.map((transaction) => {
            const icon = getCategoryIcon(transaction.category);
            const color = getCategoryColor(transaction.category);
            const relativeDate = getRelativeDate(transaction.date);
            const isIncome = transaction.type === 'income';
            
            return (
              <View key={transaction.id} style={styles.transactionRow}>
                <View style={[styles.transactionIcon, { backgroundColor: `${color}15` }]}>
                  <Ionicons name={icon as any} size={20} color={color} />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionName}>{transaction.description}</Text>
                  <Text style={styles.transactionDate}>
                    {relativeDate} • {transaction.category}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    isIncome && { color: colors.accentGreen },
                  ]}
                >
                  {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
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
      paddingVertical: 24,
    },
    balanceGrid: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 16,
      marginBottom: 12,
    },
    balanceItem: {
      alignItems: 'center',
      flex: 1,
    },
    balanceLabel: {
      fontSize: 11,
      color: colors.textMuted,
      marginBottom: 6,
      fontFamily: Fonts.medium,
      textAlign: 'center',
    },
    balanceValue: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    insightRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.surfaceMuted,
      padding: 12,
      borderRadius: Radii.md,
      marginTop: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    insightText: {
      flex: 1,
      fontSize: 13,
      color: colors.text,
      fontFamily: Fonts.regular,
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
    heroFooter: {
      marginTop: 18,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    heroMetaLabel: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
    },
    heroMetaValue: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    heroChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: Radii.pill,
      gap: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    heroChipText: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '600',
      fontFamily: Fonts.semiBold,
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
    sectionHint: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
    },
    totalBadge: {
      backgroundColor: colors.surfaceMuted,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: Radii.pill,
      borderWidth: 1,
      borderColor: colors.border,
    },
    totalText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.accentOrange,
      fontFamily: Fonts.semiBold,
    },
    paymentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    paymentIcon: {
      width: 48,
      height: 48,
      borderRadius: Radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    paymentInfo: {
      flex: 1,
    },
    paymentName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
      fontFamily: Fonts.semiBold,
    },
    paymentDescription: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 6,
      fontFamily: Fonts.regular,
    },
    dueBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    dueText: {
      fontSize: 11,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
    },
    paymentRight: {
      alignItems: 'flex-end',
      gap: 8,
    },
    paymentAmount: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    payButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: Radii.pill,
    },
    payButtonText: {
      color: colors.surface,
      fontSize: 13,
      fontWeight: '600',
      fontFamily: Fonts.semiBold,
    },
    impactCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: colors.surfaceHighlight,
      padding: 14,
      borderRadius: Radii.md,
      marginTop: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    impactText: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      fontFamily: Fonts.medium,
    },
    weekBadge: {
      backgroundColor: colors.surfaceMuted,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: Radii.pill,
      borderWidth: 1,
      borderColor: colors.border,
    },
    weekText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    spendingBreakdown: {
      marginTop: 8,
    },
    breakdownRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      gap: 12,
    },
    breakdownLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    breakdownDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    breakdownLabel: {
      fontSize: 14,
      color: colors.text,
      fontFamily: Fonts.medium,
    },
    breakdownValue: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      fontFamily: Fonts.semiBold,
      marginRight: 12,
    },
    breakdownPercent: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
      width: 40,
      textAlign: 'right',
    },
    weeklyInsight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.surfaceMuted,
      padding: 12,
      borderRadius: Radii.md,
      marginTop: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    weeklyInsightText: {
      flex: 1,
      fontSize: 13,
      color: colors.text,
      fontFamily: Fonts.regular,
    },
    quickGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
    quickItem: {
      width: '46%',
      backgroundColor: colors.surfaceMuted,
      borderRadius: Radii.md,
      paddingVertical: 18,
      alignItems: 'center',
      gap: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickIcon: {
      width: 48,
      height: 48,
      borderRadius: Radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickText: {
      fontSize: 15,
      color: colors.text,
      fontWeight: '600',
      fontFamily: Fonts.semiBold,
    },
    walletCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    walletLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    walletBadge: {
      width: 50,
      height: 50,
      borderRadius: 14,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 3,
    },
    walletLabel: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    walletSubtext: {
      fontSize: 13,
      color: colors.surface,
      opacity: 0.7,
      fontFamily: Fonts.regular,
    },
    walletBalance: {
      alignItems: 'flex-end',
    },
    walletBalanceLabel: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
    },
    walletBalanceValue: {
      fontSize: 26,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    linkText: {
      fontSize: 15,
      color: colors.primary,
      fontWeight: '600',
      fontFamily: Fonts.semiBold,
    },
    checkoutRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    checkoutLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    checkoutIcon: {
      width: 42,
      height: 42,
      borderRadius: Radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    checkoutName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      fontFamily: Fonts.semiBold,
    },
    checkoutDetail: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
    },
    checkoutPrice: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      fontFamily: Fonts.semiBold,
    },
    summaryBox: {
      marginTop: 16,
      backgroundColor: colors.surfaceMuted,
      borderRadius: Radii.md,
      padding: 16,
      gap: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    summaryLabel: {
      fontSize: 14,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
    },
    summaryValue: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      fontFamily: Fonts.semiBold,
    },
    summaryRowTotal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    summaryTotalLabel: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    summaryTotalValue: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    transactionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    transactionIcon: {
      width: 42,
      height: 42,
      borderRadius: Radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    transactionInfo: {
      flex: 1,
    },
    transactionName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      fontFamily: Fonts.semiBold,
    },
    transactionDate: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
    },
    transactionAmount: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      fontFamily: Fonts.semiBold,
    },
  });

