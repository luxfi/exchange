import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'

export default function SwapScreen() {
  const router = useRouter()
  const [inputAmount, setInputAmount] = useState('')
  const [outputAmount, setOutputAmount] = useState('')

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>You pay</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={inputAmount}
            onChangeText={setInputAmount}
            placeholder="0"
            placeholderTextColor="#6b7280"
            keyboardType="decimal-pad"
          />
          <TouchableOpacity
            style={styles.tokenButton}
            onPress={() => router.push('/token-select?type=input')}
          >
            <Text style={styles.tokenText}>LUX</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.swapButton}>
        <Text style={styles.swapIcon}>↓</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.label}>You receive</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={outputAmount}
            onChangeText={setOutputAmount}
            placeholder="0"
            placeholderTextColor="#6b7280"
            keyboardType="decimal-pad"
            editable={false}
          />
          <TouchableOpacity
            style={styles.tokenButton}
            onPress={() => router.push('/token-select?type=output')}
          >
            <Text style={styles.tokenText}>LETH</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>Connect Wallet</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    padding: 16,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  label: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 32,
    fontWeight: '500',
  },
  tokenButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  swapButton: {
    alignSelf: 'center',
    backgroundColor: '#374151',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  swapIcon: {
    color: '#fff',
    fontSize: 20,
  },
  actionButton: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
})
