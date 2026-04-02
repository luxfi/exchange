import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'

const POOLS = [
  { id: 1, name: 'LUX/LETH', tvl: '$2.4M', apr: '12.5%' },
  { id: 2, name: 'LUX/LUSD', tvl: '$1.8M', apr: '8.2%' },
  { id: 3, name: 'LETH/LUSD', tvl: '$890K', apr: '6.8%' },
  { id: 4, name: 'LUX/LBTC', tvl: '$560K', apr: '15.3%' },
]

export default function PoolScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Liquidity</Text>
      </TouchableOpacity>

      <ScrollView style={styles.poolList}>
        {POOLS.map((pool) => (
          <TouchableOpacity key={pool.id} style={styles.poolCard}>
            <View style={styles.poolInfo}>
              <Text style={styles.poolName}>{pool.name}</Text>
              <Text style={styles.poolTvl}>TVL: {pool.tvl}</Text>
            </View>
            <View style={styles.aprBadge}>
              <Text style={styles.aprText}>{pool.apr} APR</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    padding: 16,
  },
  addButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  poolList: {
    flex: 1,
  },
  poolCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  poolInfo: {
    flex: 1,
  },
  poolName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  poolTvl: {
    color: '#9ca3af',
    fontSize: 14,
  },
  aprBadge: {
    backgroundColor: '#22c55e20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  aprText: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '600',
  },
})
