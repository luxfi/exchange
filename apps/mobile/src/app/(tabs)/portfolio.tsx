import { View, Text, StyleSheet, ScrollView } from 'react-native'

export default function PortfolioScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>$0.00</Text>
        <Text style={styles.balanceChange}>Connect wallet to view</Text>
      </View>

      <Text style={styles.sectionTitle}>Your Tokens</Text>
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>No tokens found</Text>
        <Text style={styles.emptyStateSubtext}>Connect your wallet to see your tokens</Text>
      </View>

      <Text style={styles.sectionTitle}>Your Positions</Text>
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>No positions</Text>
        <Text style={styles.emptyStateSubtext}>Add liquidity to earn fees</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    padding: 16,
  },
  balanceCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  balanceLabel: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 4,
  },
  balanceChange: {
    color: '#9ca3af',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyState: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateText: {
    color: '#9ca3af',
    fontSize: 16,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    color: '#6b7280',
    fontSize: 14,
  },
})
