import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'

const TOKENS = [
  { symbol: 'LUX', name: 'Lux', balance: '0.00' },
  { symbol: 'LETH', name: 'Lux ETH', balance: '0.00' },
  { symbol: 'LBTC', name: 'Lux BTC', balance: '0.00' },
  { symbol: 'LUSD', name: 'Lux USD', balance: '0.00' },
  { symbol: 'ZOO', name: 'Zoo', balance: '0.00' },
]

export default function TokenSelectScreen() {
  const router = useRouter()
  const { type } = useLocalSearchParams()
  const [search, setSearch] = useState('')

  const filteredTokens = TOKENS.filter(
    (t) =>
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectToken = (token: typeof TOKENS[0]) => {
    // In a real app, you'd pass this back to the parent
    router.back()
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or paste address"
        placeholderTextColor="#6b7280"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredTokens}
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.tokenRow} onPress={() => selectToken(item)}>
            <View style={styles.tokenIcon}>
              <Text style={styles.tokenIconText}>{item.symbol[0]}</Text>
            </View>
            <View style={styles.tokenInfo}>
              <Text style={styles.tokenSymbol}>{item.symbol}</Text>
              <Text style={styles.tokenName}>{item.name}</Text>
            </View>
            <Text style={styles.tokenBalance}>{item.balance}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  searchInput: {
    backgroundColor: '#1a1a2e',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    color: '#fff',
    fontSize: 16,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  tokenIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tokenIconText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  tokenInfo: {
    flex: 1,
  },
  tokenSymbol: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tokenName: {
    color: '#9ca3af',
    fontSize: 14,
  },
  tokenBalance: {
    color: '#9ca3af',
    fontSize: 14,
  },
})
