import React from 'react';
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

export default function PaymentsScreen() {
  const quickActions = [
    { name: 'Dining', icon: 'restaurant', color: '#FF9500' },
    { name: 'Clubs', icon: 'people', color: '#AF52DE' },
    { name: 'Events', icon: 'calendar', color: '#007AFF' },
    { name: 'Printing', icon: 'print', color: '#34C759' },
  ];
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
              <Text style={styles.heroMetaValue}>$1,230</Text>
            </View>
            <View style={styles.heroChip}>
              <Ionicons name="shield-checkmark" size={16} color={Colors.primary} />
              <Text style={styles.heroChipText}>Secure Tap-to-Pay</Text>
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
                <Ionicons name="card" size={26} color={Colors.surface} />
              </View>
              <View>
                <Text style={styles.walletLabel}>Rutgers Student ID</Text>
                <Text style={styles.walletSubtext}>Aadil Khan • Class of 2026</Text>
              </View>
            </View>
            <View style={styles.walletBalance}>
              <Text style={styles.walletBalanceLabel}>Balance</Text>
              <Text style={styles.walletBalanceValue}>$1,230</Text>
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
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {[
            { name: 'Dining Hall', amount: '$12.50', date: 'Today', icon: 'restaurant', color: '#FF9500' },
            { name: 'Printing Services', amount: '$3.25', date: 'Yesterday', icon: 'print', color: Colors.accentGreen },
            { name: 'Event Ticket', amount: '$15.00', date: '2 days ago', icon: 'calendar', color: Colors.primary },
          ].map((transaction) => (
            <View key={transaction.name} style={styles.transactionRow}>
              <View style={[styles.transactionIcon, { backgroundColor: `${transaction.color}15` }]}>
                <Ionicons name={transaction.icon as any} size={20} color={transaction.color} />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionName}>{transaction.name}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <Text style={styles.transactionAmount}>{transaction.amount}</Text>
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
  heroFooter: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroMetaLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  heroMetaValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionHint: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  quickItem: {
    width: '46%',
    backgroundColor: Colors.surfaceMuted,
    borderRadius: Radii.md,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 8,
  },
  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
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
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  walletSubtext: {
    fontSize: 13,
    color: Colors.surface,
    opacity: 0.7,
  },
  walletBalance: {
    alignItems: 'flex-end',
  },
  walletBalanceLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  walletBalanceValue: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
  },
  linkText: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '600',
  },
  checkoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  },
  checkoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  checkoutDetail: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  checkoutPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  summaryBox: {
    marginTop: 16,
    backgroundColor: Colors.surfaceMuted,
    borderRadius: Radii.md,
    padding: 16,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  summaryRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  payButton: {
    marginTop: 16,
    backgroundColor: Colors.primary,
    borderRadius: Radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  payButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  transactionIcon: {
    width: 42,
    height: 42,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  transactionDate: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
});

