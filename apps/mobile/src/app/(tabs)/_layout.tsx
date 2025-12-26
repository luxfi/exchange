import { Tabs } from 'expo-router'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopColor: '#374151',
        },
        headerStyle: {
          backgroundColor: '#1a1a2e',
        },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Swap',
          headerTitle: 'Lux Exchange',
        }}
      />
      <Tabs.Screen
        name="pool"
        options={{
          title: 'Pool',
          headerTitle: 'Liquidity Pools',
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          headerTitle: 'Your Portfolio',
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          headerTitle: 'Transaction History',
        }}
      />
    </Tabs>
  )
}
