import {
  AnimatedVisibility,
  Box,
  ExitTransition,
  HorizontalDivider,
  Host,
  Icon,
  LazyColumn,
  ListItem,
  Text as ComposeText,
} from '@expo/ui/jetpack-compose';
import {
  background,
  clip,
  fillMaxSize,
  fillMaxWidth,
  paddingAll,
  Shapes,
} from '@expo/ui/jetpack-compose/modifiers';
import { SwipeToDismissBox } from 'expo-ui-swipe-to-dismiss-box';
import * as React from 'react';
import { View, Text, Pressable, StyleSheet, StatusBar, Platform } from 'react-native';

import deleteIcon from '@expo/material-symbols/delete.xml';
import archiveIcon from '@expo/material-symbols/archive.xml';

export default function App() {
  const [deleteItems, setDeleteItems] = React.useState([
    {
      id: 'del1',
      title: 'Swipe left to delete',
      subtitle: 'End-to-start only, at least 30%',
      dismissed: false,
    },
  ]);
  const [archiveItems, setArchiveItems] = React.useState([
    {
      id: 'arc1',
      title: 'Swipe right to archive',
      subtitle: 'Start-to-end only, at least 80%',
      dismissed: false,
    },
  ]);
  const [biItems, setBiItems] = React.useState([
    {
      id: 'bi1',
      title: 'Swipe either way',
      subtitle: 'Left to delete, right to archive',
      dismissed: false,
    },
  ]);
  const [resetKey, setResetKey] = React.useState(0);

  const reset = () => {
    setDeleteItems((prev) => prev.map((i) => ({ ...i, dismissed: false })));
    setArchiveItems((prev) => prev.map((i) => ({ ...i, dismissed: false })));
    setBiItems((prev) => prev.map((i) => ({ ...i, dismissed: false })));
    setResetKey((k) => k + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SwipeToDismissBox</Text>
        <Pressable onPress={reset} style={styles.resetButton}>
          <Text style={styles.resetText}>Reset</Text>
        </Pressable>
      </View>

      <Host key={resetKey} style={{ flex: 1 }}>
        <LazyColumn modifiers={[fillMaxWidth()]}>

          {deleteItems.map((item) => (
            <AnimatedVisibility
              key={item.id}
              visible={!item.dismissed}
              exitTransition={ExitTransition.shrinkVertically()}>
              <SwipeToDismissBox
                positionalThreshold={0.3}
                enableDismissFromStartToEnd={false}
                onEndToStart={() =>
                  setDeleteItems((prev) =>
                    prev.map((i) => (i.id === item.id ? { ...i, dismissed: true } : i))
                  )
                }>
                <SwipeToDismissBox.BackgroundContent>
                  <Box
                    contentAlignment="center"
                    modifiers={[
                      fillMaxSize(),
                      clip(Shapes.RoundedCorner(24)),
                      background('#EF5350'),
                      paddingAll(16),
                    ]}>
                    <Icon source={deleteIcon} size={24} tint="#FFFFFF" />
                  </Box>
                </SwipeToDismissBox.BackgroundContent>
                <ListItem
                  modifiers={[fillMaxWidth()]}
                  colors={{ containerColor: '#FFFFFF' }}>
                  <ListItem.HeadlineContent>
                    <ComposeText>{item.title}</ComposeText>
                  </ListItem.HeadlineContent>
                  <ListItem.SupportingContent>
                    <ComposeText>{item.subtitle}</ComposeText>
                  </ListItem.SupportingContent>
                </ListItem>
              </SwipeToDismissBox>
            </AnimatedVisibility>
          ))}

          <HorizontalDivider />

          {archiveItems.map((item) => (
            <AnimatedVisibility
              key={item.id}
              visible={!item.dismissed}
              exitTransition={ExitTransition.shrinkVertically()}>
              <SwipeToDismissBox
                positionalThreshold={0.8}
                enableDismissFromEndToStart={false}
                onStartToEnd={() =>
                  setArchiveItems((prev) =>
                    prev.map((i) => (i.id === item.id ? { ...i, dismissed: true } : i))
                  )
                }>
                <SwipeToDismissBox.BackgroundContent>
                  <Box
                    contentAlignment="center"
                    modifiers={[
                      fillMaxSize(),
                      clip(Shapes.RoundedCorner(24)),
                      background('#4CAF50'),
                      paddingAll(16),
                    ]}>
                    <Icon source={archiveIcon} size={24} tint="#FFFFFF" />
                  </Box>
                </SwipeToDismissBox.BackgroundContent>
                <ListItem
                  modifiers={[fillMaxWidth()]}
                  colors={{ containerColor: '#FFFFFF' }}>
                  <ListItem.HeadlineContent>
                    <ComposeText>{item.title}</ComposeText>
                  </ListItem.HeadlineContent>
                  <ListItem.SupportingContent>
                    <ComposeText>{item.subtitle}</ComposeText>
                  </ListItem.SupportingContent>
                </ListItem>
              </SwipeToDismissBox>
            </AnimatedVisibility>
          ))}

          <HorizontalDivider />

          {biItems.map((item) => (
            <AnimatedVisibility
              key={item.id}
              visible={!item.dismissed}
              exitTransition={ExitTransition.shrinkVertically()}>
              <SwipeToDismissBox
                onStartToEnd={() =>
                  setBiItems((prev) =>
                    prev.map((i) => (i.id === item.id ? { ...i, dismissed: true } : i))
                  )
                }
                onEndToStart={() =>
                  setBiItems((prev) =>
                    prev.map((i) => (i.id === item.id ? { ...i, dismissed: true } : i))
                  )
                }>
                <SwipeToDismissBox.BackgroundStartToEnd>
                  <Box
                    contentAlignment="center"
                    modifiers={[
                      fillMaxSize(),
                      clip(Shapes.RoundedCorner(24)),
                      background('#4CAF50'),
                      paddingAll(16),
                    ]}>
                    <Icon source={archiveIcon} size={24} tint="#FFFFFF" />
                  </Box>
                </SwipeToDismissBox.BackgroundStartToEnd>
                <SwipeToDismissBox.BackgroundEndToStart>
                  <Box
                    contentAlignment="center"
                    modifiers={[
                      fillMaxSize(),
                      clip(Shapes.RoundedCorner(24)),
                      background('#EF5350'),
                      paddingAll(16),
                    ]}>
                    <Icon source={deleteIcon} size={24} tint="#FFFFFF" />
                  </Box>
                </SwipeToDismissBox.BackgroundEndToStart>
                <ListItem
                  modifiers={[fillMaxWidth()]}
                  colors={{ containerColor: '#FFFFFF' }}>
                  <ListItem.HeadlineContent>
                    <ComposeText>{item.title}</ComposeText>
                  </ListItem.HeadlineContent>
                  <ListItem.SupportingContent>
                    <ComposeText>{item.subtitle}</ComposeText>
                  </ListItem.SupportingContent>
                </ListItem>
              </SwipeToDismissBox>
            </AnimatedVisibility>
          ))}
        </LazyColumn>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 22, fontWeight: 'bold' },
  resetButton: { backgroundColor: '#6750A4', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  resetText: { color: '#FFFFFF', fontWeight: '600' },
});
