import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Card } from '../components/Card';
import { Radii, Spacing } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { api, SimulationState } from '../services/api';

export default function BankScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<SimulationState | null>(null);

  useEffect(() => {
    const loadState = async () => {
      try {
        const stateData = await api.getState();
        setState(stateData);
      } catch (error) {
        console.error('Failed to load state:', error);
      } finally {
        setLoading(false);
      }
    };
    loadState();
  }, []);

  if (loading || !state) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color={colors.primary} />
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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bank Account Integration</Text>
          <View style={{ width: 24 }} />
        </View>

        <Card>
          <View style={styles.connectionStatus}>
            <View style={[styles.statusBadge, { backgroundColor: `${colors.primary}1A` }]}>
              <Ionicons name="card-outline" size={32} color={colors.primary} />
            </View>
            <Text style={styles.bankName}>Chase Bank</Text>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Connected</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Account Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Number</Text>
            <Text style={styles.detailValue}>****1234</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Type</Text>
            <Text style={styles.detailValue}>Checking</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Current Balance</Text>
            <Text style={[styles.detailValue, { fontSize: 18, fontWeight: '700' }]}>
              ${state.current_balance.toFixed(2)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Simulation Date</Text>
            <Text style={styles.detailValue}>
              {new Date(state.current_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <View style={styles.transactionItem}>
            <View>
              <Text style={styles.transactionName}>Starbucks</Text>
              <Text style={styles.transactionDate}>Today, 10:30 AM</Text>
            </View>
            <Text style={styles.transactionAmount}>-$5.47</Text>
          </View>
          <View style={styles.transactionItem}>
            <View>
              <Text style={styles.transactionName}>Target</Text>
              <Text style={styles.transactionDate}>Yesterday, 3:45 PM</Text>
            </View>
            <Text style={styles.transactionAmount}>-$42.19</Text>
          </View>
          <View style={styles.transactionItem}>
            <View>
              <Text style={styles.transactionName}>Direct Deposit</Text>
              <Text style={styles.transactionDate}>Nov 12, 9:00 AM</Text>
            </View>
            <Text style={[styles.transactionAmount, styles.positiveAmount]}>+$1,250.00</Text>
          </View>
        </Card>

        <Card>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Sync Transactions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.dangerButton]}>
            <Text style={[styles.actionButtonText, styles.dangerButtonText]}>Disconnect Account</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: any) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    content: {
      padding: Spacing.screenPadding,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.cardMargin,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    connectionStatus: {
      alignItems: 'center',
      paddingVertical: Spacing.cardPadding,
    },
    statusBadge: {
      width: 80,
      height: 80,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    bankName: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: Radii.full,
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
      fontWeight: '500',
      color: colors.textMuted,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    detailLabel: {
      fontSize: 14,
      color: colors.textMuted,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
    },
    transactionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    transactionName: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 4,
    },
    transactionDate: {
      fontSize: 12,
      color: colors.textMuted,
    },
    transactionAmount: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    positiveAmount: {
      color: colors.accentGreen,
    },
    actionButton: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: Radii.lg,
      alignItems: 'center',
      marginTop: 12,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    dangerButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#FF3B30',
    },
    dangerButtonText: {
      color: '#FF3B30',
    },
  });
}

