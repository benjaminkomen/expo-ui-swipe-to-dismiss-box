import { Host, LazyColumn, ListItem, Box, Text as ComposeText } from '@expo/ui/jetpack-compose';
import { fillMaxWidth, fillMaxSize, background, paddingAll } from '@expo/ui/jetpack-compose/modifiers';
import { SwipeToDismissBox } from 'expo-ui-swipe-to-dismiss-box';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Item = {
  id: string;
  title: string;
  subtitle: string;
  threshold: number;
  dismissed: boolean;
  enableStartToEnd: boolean;
  enableEndToStart: boolean;
};

const INITIAL_ITEMS: Item[] = [
  {
    id: '1',
    title: 'Swipe left to delete (30%)',
    subtitle: 'End-to-start only, threshold: 0.3',
    threshold: 0.3,
    dismissed: false,
    enableStartToEnd: false,
    enableEndToStart: true,
  },
  {
    id: '2',
    title: 'Swipe right to archive (80%)',
    subtitle: 'Start-to-end only, threshold: 0.8 — must swipe far!',
    threshold: 0.8,
    dismissed: false,
    enableStartToEnd: true,
    enableEndToStart: false,
  },
  {
    id: '3',
    title: 'Bidirectional (50%)',
    subtitle: 'Left to delete, right to archive',
    threshold: 0.5,
    dismissed: false,
    enableStartToEnd: true,
    enableEndToStart: true,
  },
  {
    id: '4',
    title: 'Very easy dismiss (10%)',
    subtitle: 'Barely swipe and it dismisses',
    threshold: 0.1,
    dismissed: false,
    enableStartToEnd: true,
    enableEndToStart: true,
  },
];

export default function App() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);

  const dismiss = (id: string) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, dismissed: true } : i)));

  const reset = () => setItems(INITIAL_ITEMS);

  const visibleItems = items.filter((item) => !item.dismissed);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>SwipeToDismissBox</Text>
        <Text style={styles.resetButton} onPress={reset}>
          Reset
        </Text>
      </View>
      <Text style={styles.subtitle}>
        {visibleItems.length} items remaining
      </Text>

      <Host style={{ flex: 1 }}>
        <LazyColumn modifiers={[fillMaxWidth()]}>
          {visibleItems.map((item) => (
            <SwipeToDismissBox
              key={item.id}
              positionalThreshold={item.threshold}
              enableDismissFromStartToEnd={item.enableStartToEnd}
              enableDismissFromEndToStart={item.enableEndToStart}
              onEndToStart={() => dismiss(item.id)}
              onStartToEnd={() => dismiss(item.id)}>
              <SwipeToDismissBox.BackgroundStartToEnd>
                <Box
                  contentAlignment="center"
                  modifiers={[fillMaxSize(), background('#4CAF50'), paddingAll(16)]}>
                  <ComposeText style={{ color: '#FFFFFF' }}>Archive</ComposeText>
                </Box>
              </SwipeToDismissBox.BackgroundStartToEnd>
              <SwipeToDismissBox.BackgroundEndToStart>
                <Box
                  contentAlignment="center"
                  modifiers={[fillMaxSize(), background('#EF5350'), paddingAll(16)]}>
                  <ComposeText style={{ color: '#FFFFFF' }}>Delete</ComposeText>
                </Box>
              </SwipeToDismissBox.BackgroundEndToStart>
              <ListItem
                headlineContent={item.title}
                supportingContent={item.subtitle}
              />
            </SwipeToDismissBox>
          ))}
        </LazyColumn>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 48, backgroundColor: '#FAFAFA' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 },
  header: { fontSize: 20, fontWeight: 'bold' },
  resetButton: { fontSize: 16, color: '#1976D2' },
  subtitle: { fontSize: 14, color: '#666', paddingHorizontal: 16, paddingBottom: 8 },
});
