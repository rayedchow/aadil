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

  const quickActions = [
    { name: 'Dining', icon: 'restaurant', color: '#FF9500' },
    { name: 'Clubs', icon: 'people', color: '#AF52DE' },
    { name: 'Events', icon: 'calendar', color: '#007AFF' },
    { name: 'Printing', icon: 'print', color: '#34C759' },
  ];

  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [txns, stateData] = await Promise.all([
        api.getRecentTransactions(10),
        api.getState(),
      ]);
      setTransactions(txns);
      setState(stateData);
    } catch (error) {
      console.error('Failed to load payments data:', error);
      Alert.alert('Error', 'Failed to load payments data. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
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

  if (loading || !state) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.sectionHint, { marginTop: 12 }]}>Loading payments...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="highlight" style={styles.heroCard}>
          <Text style={styles.eyebrow}>Campus Payments Hub</Text>
          <Text style={styles.heroTitle}>Quick Checkout</Text>
          <Text style={styles.heroSubtitle}>Balance syncs with Rutgers NetID wallet</Text>
          <View style={styles.heroFooter}>
            <View>
              <Text style={styles.heroMetaLabel}>Available balance</Text>
              <Text style={styles.heroMetaValue}>${state.current_balance.toFixed(2)}</Text>
            </View>
            <View style={styles.heroChip}>
              <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
              <Text style={styles.heroChipText}>Live Balance</Text>
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Text style={styles.sectionHint}>Tap to pre-fill checkout</Text>
          </View>
          <View style={styles.quickGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity key={action.name} style={styles.quickItem}>
                <View style={[styles.quickIcon, { backgroundColor: `${action.color}15` }]}>
                  <Ionicons name={action.icon as any} size={22} color={action.color} />
                </View>
                <Text style={styles.quickText}>{action.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Campus ID Wallet</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Show QR</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.walletCard}>
            <View style={styles.walletLeft}>
              <View style={styles.walletBadge}>
                <Ionicons name="card" size={26} color={colors.surface} />
              </View>
              <View>
                <Text style={styles.walletLabel}>Rutgers Student ID</Text>
                <Text style={styles.walletSubtext}>Aadil Khan • Class of 2026</Text>
              </View>
            </View>
            <View style={styles.walletBalance}>
              <Text style={styles.walletBalanceLabel}>Balance</Text>
              <Text style={styles.walletBalanceValue}>${state.current_balance.toFixed(2)}</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          {[
            {
              name: 'Dining Hall Meal Plan',
              detail: 'Weekly pass • Valid until 12/15',
              amount: '$45.00',
              icon: 'restaurant',
              color: '#FF9500',
            },
            {
              name: 'Student Club Dues',
              detail: 'Computer Science Club • Fall 2024',
              amount: '$25.00',
              icon: 'people',
              color: '#AF52DE',
            },
          ].map((item) => (
            <View key={item.name} style={styles.checkoutRow}>
              <View style={styles.checkoutLeft}>
                <View style={[styles.checkoutIcon, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                <View>
                  <Text style={styles.checkoutName}>{item.name}</Text>
                  <Text style={styles.checkoutDetail}>{item.detail}</Text>
                </View>
              </View>
              <Text style={styles.checkoutPrice}>{item.amount}</Text>
            </View>
          ))}
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>$70.00</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Processing</Text>
              <Text style={styles.summaryValue}>$0.00</Text>
            </View>
            <View style={styles.summaryRowTotal}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>$70.00</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.payButton}>
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
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
    payButton: {
      marginTop: 16,
      backgroundColor: colors.primary,
      borderRadius: Radii.pill,
      paddingVertical: 16,
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    payButtonText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: '600',
      fontFamily: Fonts.semiBold,
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

