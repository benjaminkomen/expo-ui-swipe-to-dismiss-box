import { Host, LazyColumn, ListItem, Box, Text as ComposeText } from '@expo/ui/jetpack-compose';
import { fillMaxWidth, fillMaxSize, background, paddingAll } from '@expo/ui/jetpack-compose/modifiers';
import { SwipeToDismissBox } from 'expo-ui-swipe-to-dismiss-box';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Item = { id: string; title: string; dismissed: boolean };

export default function App() {
  const [items, setItems] = useState<Item[]>([
    { id: '1', title: 'Swipe left to delete', dismissed: false },
    { id: '2', title: 'Swipe right to archive', dismissed: false },
    { id: '3', title: 'Another item', dismissed: false },
  ]);

  const dismiss = (id: string) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, dismissed: true } : i)));

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SwipeToDismissBox Example</Text>

      <Host style={{ flex: 1 }}>
        <LazyColumn modifiers={[fillMaxWidth()]}>
          {items
            .filter((item) => !item.dismissed)
            .map((item) => (
              <SwipeToDismissBox
                key={item.id}
                positionalThreshold={0.3}
                onEndToStart={() => dismiss(item.id)}
                onStartToEnd={() => dismiss(item.id)}>
                <SwipeToDismissBox.BackgroundStartToEnd>
                  <Box
                    contentAlignment="center"
                    modifiers={[fillMaxSize(), background('#4CAF50'), paddingAll(16)]}>
                    <ComposeText>Archive</ComposeText>
                  </Box>
                </SwipeToDismissBox.BackgroundStartToEnd>
                <SwipeToDismissBox.BackgroundEndToStart>
                  <Box
                    contentAlignment="center"
                    modifiers={[fillMaxSize(), background('#EF5350'), paddingAll(16)]}>
                    <ComposeText>Delete</ComposeText>
                  </Box>
                </SwipeToDismissBox.BackgroundEndToStart>
                <ListItem headlineContent={item.title} />
              </SwipeToDismissBox>
            ))}
        </LazyColumn>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 48 },
  header: { fontSize: 20, fontWeight: 'bold', padding: 16 },
});
