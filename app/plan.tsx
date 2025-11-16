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
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Card } from '../components/Card';
import { ProgressRing } from '../components/ProgressRing';
import { Radii, Spacing, ThemeColors, Fonts } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { api, Goal, SimulationState } from '../services/api';

export default function PlanScreen() {
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [state, setState] = useState<SimulationState | null>(null);
  const [timeline, setTimeline] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [manageMode, setManageMode] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    target_amount: '',
    target_timeframe: 'semester',
  });

  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [goalsData, stateData, timelineData] = await Promise.all([
        api.getGoals(),
        api.getState(),
        api.getTimeline(),
      ]);
      setGoals(goalsData);
      setState(stateData);
      setTimeline(timelineData);
    } catch (error) {
      console.error('Failed to load goals:', error);
      Alert.alert('Error', 'Failed to load goals. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.name.trim() || !newGoal.target_amount) {
      Alert.alert('Missing Info', 'Please fill in goal name and amount');
      return;
    }

    const amount = parseFloat(newGoal.target_amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    try {
      const goal: Goal = {
        id: Date.now().toString(),
        name: newGoal.name,
        target_amount: amount,
        target_timeframe: newGoal.target_timeframe,
        current_amount: 0,
        percentage: 0,
        completed: false,
      };

      await api.createGoal(goal);
      setModalVisible(false);
      setNewGoal({ name: '', target_amount: '', target_timeframe: 'semester' });
      await loadData();
      Alert.alert('Goal Created! 🎯', `Your goal "${newGoal.name}" has been added.`);
    } catch (error) {
      console.error('Failed to create goal:', error);
      Alert.alert('Error', 'Failed to create goal');
    }
  };

  const handleMarkComplete = async (goal: Goal) => {
    try {
      await api.markGoalComplete(goal.id);
      Alert.alert('Goal Complete! 🎉', `Congrats on reaching "${goal.name}"!`);
      await loadData();
    } catch (error) {
      console.error('Failed to mark goal complete:', error);
      Alert.alert('Error', 'Failed to mark goal as complete');
    }
  };

  const handleDeleteGoal = async (goal: Goal) => {
    Alert.alert(
      'Delete Goal?',
      `Are you sure you want to remove "${goal.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteGoal(goal.id);
              await loadData();
            } catch (error) {
              console.error('Failed to delete goal:', error);
              Alert.alert('Error', 'Failed to delete goal');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !state || !timeline) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.secondaryText, { marginTop: 12 }]}>Loading goals...</Text>
      </SafeAreaView>
    );
  }

  const getProjectedBalanceForTimeframe = (timeframe: string) => {
    const daysMap: { [key: string]: number } = {
      week: 7,
      month: 30,
      semester: 95,
    };
    const days = daysMap[timeframe] || 14;
    const targetIndex = Math.min(days, timeline.aadil_plan.length - 1);
    return timeline.aadil_plan[targetIndex]?.balance || state.current_balance;
  };

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);
  const totalGoalAmount = activeGoals.reduce((sum, g) => sum + g.target_amount, 0);
  const affordableGoals = activeGoals.filter(g => {
    const projected = getProjectedBalanceForTimeframe(g.target_timeframe);
    return g.target_amount <= projected;
  }).length;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
        <Card variant="highlight" style={styles.heroCard}>
          <Text style={styles.eyebrow}>Financial Goals</Text>
          <Text style={styles.heroTitle}>Your Plan</Text>
          <Text style={styles.heroSubtitle}>Track what you're saving for</Text>
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>{activeGoals.length}</Text>
              <Text style={styles.heroStatText}>Active Goals</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>${totalGoalAmount.toFixed(0)}</Text>
              <Text style={styles.heroStatText}>Target Total</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={[styles.heroStatLabel, { color: colors.accentGreen }]}>
                {affordableGoals}
              </Text>
              <Text style={styles.heroStatText}>On Track</Text>
            </View>
          </View>
        </Card>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle" size={24} color={colors.surface} />
          <Text style={styles.addButtonText}>Add New Goal</Text>
        </TouchableOpacity>

        {activeGoals.length === 0 ? (
          <Card>
            <View style={styles.emptyState}>
              <Ionicons name="flag-outline" size={64} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No Goals Yet</Text>
              <Text style={styles.emptyText}>
                Create your first financial goal to start planning your semester spending
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.emptyButtonText}>Create Goal</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ) : (
          activeGoals.map((goal) => {
            const projectedWithAI = getProjectedBalanceForTimeframe(goal.target_timeframe);
            const daysMap: { [key: string]: number } = {
              week: 7,
              month: 30,
              semester: 95,
            };
            const daysAhead = daysMap[goal.target_timeframe] || 14;
            const targetIndex = Math.min(daysAhead, timeline.on_pace.length - 1);
            const projectedCurrentPath = timeline.on_pace[targetIndex]?.balance || state.current_balance;
            
            const willAffordWithAI = goal.target_amount <= projectedWithAI;
            const willAffordCurrentPath = goal.target_amount <= projectedCurrentPath;
            const savingsNeeded = Math.max(0, goal.target_amount - projectedWithAI);
            const currentPathShortfall = Math.max(0, goal.target_amount - projectedCurrentPath);

            const renderLeftActions = () => (
              <View style={styles.swipeLeftAction}>
                <Ionicons name="checkmark-circle" size={28} color={colors.surface} />
                <Text style={styles.swipeActionText}>Complete</Text>
              </View>
            );

            const renderRightActions = () => (
              <View style={styles.swipeRightAction}>
                <Ionicons name="trash" size={28} color={colors.surface} />
                <Text style={styles.swipeActionText}>Delete</Text>
              </View>
            );

            const goalCard = (
              <Card key={goal.id}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalHeaderLeft}>
                    <View style={styles.goalIconBadge}>
                      <Ionicons name="flag" size={20} color={colors.primary} />
                    </View>
                    <View>
                      <Text style={styles.goalName}>{goal.name}</Text>
                      <Text style={styles.goalTimeframe}>
                        By end of {goal.target_timeframe}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.manageButton}
                    onPress={() => setManageMode(!manageMode)}
                  >
                    <Ionicons name="ellipsis-horizontal" size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>

                <View style={styles.goalAmount}>
                  <Text style={styles.goalAmountLabel}>Target Amount</Text>
                  <Text style={styles.goalAmountValue}>${goal.target_amount.toFixed(0)}</Text>
                </View>

                <View style={styles.pathComparison}>
                  <View style={styles.pathItem}>
                    <Text style={styles.pathLabel}>Current Path</Text>
                    <Text style={[
                      styles.pathValue,
                      { color: willAffordCurrentPath ? colors.accentGreen : colors.accentOrange }
                    ]}>
                      ${projectedCurrentPath.toFixed(0)}
                    </Text>
                    {!willAffordCurrentPath && (
                      <Text style={styles.pathShortfall}>
                        ${currentPathShortfall.toFixed(0)} short
                      </Text>
                    )}
                  </View>
                  <Ionicons name="arrow-forward" size={20} color={colors.textMuted} />
                  <View style={styles.pathItem}>
                    <Text style={styles.pathLabel}>With AI Plan</Text>
                    <Text style={[
                      styles.pathValue,
                      { color: willAffordWithAI ? colors.accentGreen : colors.primary }
                    ]}>
                      ${projectedWithAI.toFixed(0)}
                    </Text>
                    {willAffordWithAI && (
                      <Text style={styles.pathSuccess}>✓ Achievable</Text>
                    )}
                  </View>
                </View>

                <View style={styles.progressSection}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min((projectedWithAI / goal.target_amount * 100), 100)}%`,
                          backgroundColor: willAffordWithAI ? colors.accentGreen : colors.primary,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    Projected: ${projectedWithAI.toFixed(0)} / ${goal.target_amount.toFixed(0)}
                  </Text>
                </View>

                {!willAffordWithAI && savingsNeeded > 0 && (
                  <View style={styles.warningCard}>
                    <Ionicons name="alert-circle" size={20} color={colors.accentOrange} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.warningText}>
                        Even with AI plan, you'd be ${savingsNeeded.toFixed(0)} short
                      </Text>
                      <Text style={styles.warningSubtext}>
                        Consider extending timeframe or reducing target
                      </Text>
                    </View>
                  </View>
                )}

                {willAffordWithAI && !willAffordCurrentPath && (
                  <View style={styles.successCard}>
                    <Ionicons name="sparkles" size={20} color={colors.accentGreen} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.successText}>
                        Following AI tips makes this goal possible!
                      </Text>
                      <Text style={styles.successSubtext}>
                        You'd save +${(projectedWithAI - projectedCurrentPath).toFixed(0)} more
                      </Text>
                    </View>
                  </View>
                )}

                {willAffordWithAI && willAffordCurrentPath && (
                  <View style={styles.successCard}>
                    <Ionicons name="trophy" size={20} color={colors.accentGreen} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.successText}>
                        You're on track to reach this goal! Keep it up.
                      </Text>
                    </View>
                  </View>
                )}

                {manageMode && (
                  <View style={styles.swipeHint}>
                    <Ionicons name="swap-horizontal" size={16} color={colors.textMuted} />
                    <Text style={styles.swipeHintText}>
                      Swipe left to complete, swipe right to delete
                    </Text>
                  </View>
                )}
              </Card>
            );

            return manageMode ? (
              <Swipeable
                key={goal.id}
                renderLeftActions={renderLeftActions}
                renderRightActions={renderRightActions}
                onSwipeableLeftOpen={() => handleMarkComplete(goal)}
                onSwipeableRightOpen={() => handleDeleteGoal(goal)}
                overshootLeft={false}
                overshootRight={false}
                friction={2}
                leftThreshold={80}
                rightThreshold={80}
              >
                {goalCard}
              </Swipeable>
            ) : (
              goalCard
            );
          })
        )}

        {completedGoals.length > 0 && (
          <Card variant="muted">
            <View style={styles.completedHeader}>
              <Ionicons name="trophy" size={20} color={colors.accentGreen} />
              <Text style={styles.completedTitle}>Completed Goals ({completedGoals.length})</Text>
            </View>
            {completedGoals.map((goal) => (
              <View key={goal.id} style={styles.completedGoalRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.completedGoalName}>{goal.name}</Text>
                  <Text style={styles.completedGoalAmount}>${goal.target_amount.toFixed(0)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeCompletedButton}
                  onPress={() => handleDeleteGoal(goal)}
                >
                  <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalKeyboardView}
              >
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Create New Goal</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Ionicons name="close" size={28} color={colors.text} />
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>What are you saving for?</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="e.g., Concert tickets, Spring break, New laptop"
                        placeholderTextColor={colors.textMuted}
                        value={newGoal.name}
                        onChangeText={(text) => setNewGoal({ ...newGoal, name: text })}
                        returnKeyType="next"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Target Amount</Text>
                      <View style={styles.amountInput}>
                        <Text style={styles.dollarSign}>$</Text>
                        <TextInput
                          style={styles.amountTextInput}
                          placeholder="0.00"
                          placeholderTextColor={colors.textMuted}
                          keyboardType="decimal-pad"
                          value={newGoal.target_amount}
                          onChangeText={(text) => setNewGoal({ ...newGoal, target_amount: text })}
                          returnKeyType="done"
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Timeframe</Text>
                      <View style={styles.timeframeButtons}>
                        {['week', 'month', 'semester'].map((timeframe) => (
                          <TouchableOpacity
                            key={timeframe}
                            style={[
                              styles.timeframeButton,
                              newGoal.target_timeframe === timeframe &&
                                styles.timeframeButtonActive,
                            ]}
                            onPress={() =>
                              setNewGoal({ ...newGoal, target_timeframe: timeframe })
                            }
                          >
                            <Text
                              style={[
                                styles.timeframeButtonText,
                                newGoal.target_timeframe === timeframe &&
                                  styles.timeframeButtonTextActive,
                              ]}
                            >
                              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <TouchableOpacity style={styles.createButton} onPress={handleAddGoal}>
                      <Ionicons name="checkmark-circle" size={20} color={colors.surface} />
                      <Text style={styles.createButtonText}>Create Goal</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
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
    heroStats: {
      flexDirection: 'row',
      marginTop: 20,
    },
    heroStat: {
      flex: 1,
      alignItems: 'center',
    },
    heroStatLabel: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    heroStatText: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 4,
      fontFamily: Fonts.regular,
    },
    heroStatDivider: {
      width: 1,
      backgroundColor: colors.border,
      marginHorizontal: 12,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderRadius: Radii.pill,
      paddingVertical: 16,
      marginBottom: 20,
      gap: 10,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    addButtonText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: '600',
      fontFamily: Fonts.semiBold,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginTop: 20,
      fontFamily: Fonts.bold,
    },
    emptyText: {
      fontSize: 15,
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: 12,
      marginHorizontal: 40,
      lineHeight: 22,
      fontFamily: Fonts.regular,
    },
    emptyButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 32,
      paddingVertical: 14,
      borderRadius: Radii.pill,
      marginTop: 24,
    },
    emptyButtonText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: '600',
      fontFamily: Fonts.semiBold,
    },
    goalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    goalHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    goalIconBadge: {
      width: 44,
      height: 44,
      borderRadius: Radii.md,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    goalName: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    goalTimeframe: {
      fontSize: 13,
      color: colors.textMuted,
      marginTop: 2,
      fontFamily: Fonts.regular,
    },
    manageButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    goalAmount: {
      backgroundColor: colors.surfaceMuted,
      padding: 16,
      borderRadius: Radii.md,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    goalAmountLabel: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 6,
      fontFamily: Fonts.regular,
    },
    goalAmountValue: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    progressSection: {
      marginBottom: 16,
    },
    progressBar: {
      height: 12,
      backgroundColor: colors.border,
      borderRadius: 6,
      overflow: 'hidden',
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      borderRadius: 6,
    },
    progressText: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: Fonts.medium,
    },
    pathComparison: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: colors.surfaceMuted,
      padding: 16,
      borderRadius: Radii.md,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    pathItem: {
      flex: 1,
      alignItems: 'center',
    },
    pathLabel: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 6,
      fontFamily: Fonts.regular,
    },
    pathValue: {
      fontSize: 22,
      fontWeight: '700',
      fontFamily: Fonts.bold,
    },
    pathShortfall: {
      fontSize: 11,
      color: colors.accentOrange,
      marginTop: 4,
      fontFamily: Fonts.medium,
    },
    pathSuccess: {
      fontSize: 11,
      color: colors.accentGreen,
      marginTop: 4,
      fontFamily: Fonts.medium,
    },
    warningCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      backgroundColor: 'rgba(255, 138, 52, 0.12)',
      padding: 16,
      borderRadius: Radii.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    warningText: {
      fontSize: 14,
      color: colors.accentOrange,
      fontFamily: Fonts.semiBold,
      marginBottom: 4,
    },
    warningSubtext: {
      fontSize: 12,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
    },
    successCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      backgroundColor: 'rgba(48, 209, 88, 0.12)',
      padding: 16,
      borderRadius: Radii.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    successText: {
      fontSize: 14,
      color: colors.accentGreen,
      fontFamily: Fonts.semiBold,
      marginBottom: 4,
    },
    successSubtext: {
      fontSize: 12,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
    },
    swipeHint: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.surfaceMuted,
      padding: 12,
      borderRadius: Radii.md,
      marginTop: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    swipeHintText: {
      fontSize: 12,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
    },
    swipeLeftAction: {
      backgroundColor: colors.accentGreen,
      justifyContent: 'center',
      alignItems: 'center',
      width: 100,
      borderRadius: Radii.lg,
      marginBottom: Spacing.sectionGap,
      marginLeft: Spacing.screenPadding,
    },
    swipeRightAction: {
      backgroundColor: '#FF3B30',
      justifyContent: 'center',
      alignItems: 'center',
      width: 100,
      borderRadius: Radii.lg,
      marginBottom: Spacing.sectionGap,
      marginRight: Spacing.screenPadding,
    },
    swipeActionText: {
      color: colors.surface,
      fontSize: 13,
      fontWeight: '600',
      fontFamily: Fonts.semiBold,
      marginTop: 4,
    },
    completedHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 16,
    },
    completedTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    completedGoalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    completedGoalName: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      fontFamily: Fonts.semiBold,
      textDecorationLine: 'line-through',
      opacity: 0.6,
    },
    completedGoalAmount: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
      marginTop: 2,
    },
    removeCompletedButton: {
      padding: 8,
    },
    secondaryText: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: Fonts.regular,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalKeyboardView: {
      width: '100%',
      maxHeight: '90%',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: Radii.xl,
      borderTopRightRadius: Radii.xl,
      padding: 24,
      paddingBottom: 40,
      maxHeight: '100%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      fontFamily: Fonts.bold,
    },
    inputGroup: {
      marginBottom: 24,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 10,
      fontFamily: Fonts.semiBold,
    },
    textInput: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: Radii.md,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      fontFamily: Fonts.regular,
    },
    amountInput: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderRadius: Radii.md,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dollarSign: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.textMuted,
      marginRight: 8,
      fontFamily: Fonts.bold,
    },
    amountTextInput: {
      flex: 1,
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      paddingVertical: 16,
      fontFamily: Fonts.bold,
    },
    timeframeButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    timeframeButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: Radii.md,
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderWidth: 1,
      borderColor: colors.border,
    },
    timeframeButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    timeframeButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      fontFamily: Fonts.semiBold,
    },
    timeframeButtonTextActive: {
      color: colors.surface,
    },
    createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderRadius: Radii.pill,
      paddingVertical: 16,
      marginTop: 8,
      gap: 10,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    createButtonText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: '600',
      fontFamily: Fonts.semiBold,
    },
  });

