import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Card } from '../components/Card';
import { Radii, Spacing } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function RutgersScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
          <Text style={styles.headerTitle}>Rutgers NetID Account</Text>
          <View style={{ width: 24 }} />
        </View>

        <Card>
          <View style={styles.connectionStatus}>
            <View style={[styles.statusBadge, { backgroundColor: 'rgba(214, 40, 40, 0.1)' }]}>
              <Ionicons name="school-outline" size={32} color="#D62828" />
            </View>
            <Text style={styles.accountName}>Rutgers University</Text>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Connected</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>NetID</Text>
            <Text style={styles.detailValue}>abc123</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Student ID</Text>
            <Text style={styles.detailValue}>123456789</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>School</Text>
            <Text style={styles.detailValue}>School of Arts & Sciences</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={styles.detailValue}>Full-time Student</Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Tuition & Fees</Text>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceAmount}>$12,450.00</Text>
            <Text style={styles.balanceNote}>Due: December 15, 2025</Text>
          </View>
          <View style={styles.feeItem}>
            <View>
              <Text style={styles.feeName}>Tuition (Fall 2025)</Text>
              <Text style={styles.feeDate}>Semester Fee</Text>
            </View>
            <Text style={styles.feeAmount}>$10,500.00</Text>
          </View>
          <View style={styles.feeItem}>
            <View>
              <Text style={styles.feeName}>Student Fees</Text>
              <Text style={styles.feeDate}>Campus, Technology, etc.</Text>
            </View>
            <Text style={styles.feeAmount}>$1,250.00</Text>
          </View>
          <View style={styles.feeItem}>
            <View>
              <Text style={styles.feeName}>Housing</Text>
              <Text style={styles.feeDate}>Residence Hall</Text>
            </View>
            <Text style={styles.feeAmount}>$700.00</Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Meal Plan</Text>
          <View style={styles.mealPlanCard}>
            <View style={styles.mealPlanRow}>
              <Text style={styles.mealPlanLabel}>Balance</Text>
              <Text style={styles.mealPlanValue}>$450.00</Text>
            </View>
            <View style={styles.mealPlanRow}>
              <Text style={styles.mealPlanLabel}>Swipes Remaining</Text>
              <Text style={styles.mealPlanValue}>18 / 25</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Academic Calendar</Text>
          <View style={styles.calendarItem}>
            <View style={styles.calendarDate}>
              <Text style={styles.calendarDay}>23</Text>
              <Text style={styles.calendarMonth}>NOV</Text>
            </View>
            <View style={styles.calendarDetails}>
              <Text style={styles.calendarEvent}>Thanksgiving Break</Text>
              <Text style={styles.calendarTime}>No classes</Text>
            </View>
          </View>
          <View style={styles.calendarItem}>
            <View style={styles.calendarDate}>
              <Text style={styles.calendarDay}>15</Text>
              <Text style={styles.calendarMonth}>DEC</Text>
            </View>
            <View style={styles.calendarDetails}>
              <Text style={styles.calendarEvent}>Finals Week Begins</Text>
              <Text style={styles.calendarTime}>8:00 AM</Text>
            </View>
          </View>
        </Card>

        <Card>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Sync Account Data</Text>
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
    accountName: {
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
    balanceCard: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: Radii.lg,
      alignItems: 'center',
      marginBottom: 16,
    },
    balanceLabel: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 8,
    },
    balanceAmount: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    balanceNote: {
      fontSize: 12,
      color: colors.textMuted,
    },
    feeItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    feeName: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 4,
    },
    feeDate: {
      fontSize: 12,
      color: colors.textMuted,
    },
    feeAmount: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    mealPlanCard: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: Radii.lg,
    },
    mealPlanRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    mealPlanLabel: {
      fontSize: 14,
      color: colors.textMuted,
    },
    mealPlanValue: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    calendarItem: {
      flexDirection: 'row',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    calendarDate: {
      width: 50,
      alignItems: 'center',
      marginRight: 16,
    },
    calendarDay: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    calendarMonth: {
      fontSize: 10,
      fontWeight: '600',
      color: colors.textMuted,
      letterSpacing: 0.5,
    },
    calendarDetails: {
      flex: 1,
      justifyContent: 'center',
    },
    calendarEvent: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 4,
    },
    calendarTime: {
      fontSize: 12,
      color: colors.textMuted,
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

