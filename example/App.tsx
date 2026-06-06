import {
  AnimatedVisibility,
  Box,
  ExitTransition,
  Host,
  Icon,
  LazyColumn,
  ListItem,
  Text as ComposeText,
} from '@expo/ui/jetpack-compose';
import {
  background,
  fillMaxSize,
  fillMaxWidth,
  paddingAll,
} from '@expo/ui/jetpack-compose/modifiers';
import { SwipeToDismissBox } from 'expo-ui-swipe-to-dismiss-box';
import * as React from 'react';
import { View, Text, Pressable, StyleSheet, StatusBar, Platform } from 'react-native';

import deleteIcon from '@expo/material-symbols/delete.xml';
import archiveIcon from '@expo/material-symbols/archive.xml';

type Item = { id: string; title: string; subtitle: string; dismissed: boolean };

const INITIAL_ITEMS: Item[] = [
  { id: 'del1', title: 'Swipe left to delete', subtitle: 'End-to-start only, at least 30%', dismissed: false },
  { id: 'arc1', title: 'Swipe right to archive', subtitle: 'Start-to-end only, at least 80%', dismissed: false },
  { id: 'bi1', title: 'Swipe either way', subtitle: 'Left to delete, right to archive', dismissed: false },
];

export default function App() {
  const [items, setItems] = React.useState<Item[]>(INITIAL_ITEMS);
  const [resetKey, setResetKey] = React.useState(0);

  const dismiss = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, dismissed: true } : i)));
  };

  const reset = () => {
    setItems(INITIAL_ITEMS);
    setResetKey((k) => k + 1);
  };

  return (
    <View style={styles.container}>
      <Host key={resetKey} style={{ flex: 1 }}>
        <LazyColumn modifiers={[fillMaxWidth(), paddingAll(16)]}>
          <Box modifiers={[fillMaxWidth(), paddingAll(8)]}>
            <ComposeText style={{ typography: 'headlineMedium' }}>SwipeToDismissBox</ComposeText>
          </Box>

          <Button onClick={reset}><ComposeText>Reset</ComposeText></Button>

          {/* Swipe right-to-left to delete (30% threshold) */}
          <AnimatedVisibility
            visible={!items.find((i) => i.id === 'del1')?.dismissed}
            exitTransition={ExitTransition.shrinkVertically()}>
            <SwipeToDismissBox
              positionalThreshold={0.3}
              enableDismissFromStartToEnd={false}
              onEndToStart={() => dismiss('del1')}>
              <SwipeToDismissBox.BackgroundContent>
                <Box
                  contentAlignment="center"
                  modifiers={[fillMaxSize(), background('#EF5350'), paddingAll(16)]}>
                  <Icon source={deleteIcon} size={24} tint="#FFFFFF" />
                </Box>
              </SwipeToDismissBox.BackgroundContent>
              <ListItem modifiers={[fillMaxWidth()]}>
                <ListItem.HeadlineContent>
                  <ComposeText>Swipe left to delete</ComposeText>
                </ListItem.HeadlineContent>
                <ListItem.SupportingContent>
                  <ComposeText>End-to-start only, at least 30%</ComposeText>
                </ListItem.SupportingContent>
              </ListItem>
            </SwipeToDismissBox>
          </AnimatedVisibility>

          {/* Swipe left-to-right to archive (80% threshold) */}
          <AnimatedVisibility
            visible={!items.find((i) => i.id === 'arc1')?.dismissed}
            exitTransition={ExitTransition.shrinkVertically()}>
            <SwipeToDismissBox
              positionalThreshold={0.8}
              enableDismissFromEndToStart={false}
              onStartToEnd={() => dismiss('arc1')}>
              <SwipeToDismissBox.BackgroundContent>
                <Box
                  contentAlignment="center"
                  modifiers={[fillMaxSize(), background('#4CAF50'), paddingAll(16)]}>
                  <Icon source={archiveIcon} size={24} tint="#FFFFFF" />
                </Box>
              </SwipeToDismissBox.BackgroundContent>
              <ListItem modifiers={[fillMaxWidth()]}>
                <ListItem.HeadlineContent>
                  <ComposeText>Swipe right to archive</ComposeText>
                </ListItem.HeadlineContent>
                <ListItem.SupportingContent>
                  <ComposeText>Start-to-end only, at least 80%</ComposeText>
                </ListItem.SupportingContent>
              </ListItem>
            </SwipeToDismissBox>
          </AnimatedVisibility>

          {/* Bidirectional swipe */}
          <AnimatedVisibility
            visible={!items.find((i) => i.id === 'bi1')?.dismissed}
            exitTransition={ExitTransition.shrinkVertically()}>
            <SwipeToDismissBox
              onStartToEnd={() => dismiss('bi1')}
              onEndToStart={() => dismiss('bi1')}>
              <SwipeToDismissBox.BackgroundStartToEnd>
                <Box
                  contentAlignment="center"
                  modifiers={[fillMaxSize(), background('#4CAF50'), paddingAll(16)]}>
                  <Icon source={archiveIcon} size={24} tint="#FFFFFF" />
                </Box>
              </SwipeToDismissBox.BackgroundStartToEnd>
              <SwipeToDismissBox.BackgroundEndToStart>
                <Box
                  contentAlignment="center"
                  modifiers={[fillMaxSize(), background('#EF5350'), paddingAll(16)]}>
                  <Icon source={deleteIcon} size={24} tint="#FFFFFF" />
                </Box>
              </SwipeToDismissBox.BackgroundEndToStart>
              <ListItem modifiers={[fillMaxWidth()]}>
                <ListItem.HeadlineContent>
                  <ComposeText>Swipe either way</ComposeText>
                </ListItem.HeadlineContent>
                <ListItem.SupportingContent>
                  <ComposeText>Left to delete, right to archive</ComposeText>
                </ListItem.SupportingContent>
              </ListItem>
            </SwipeToDismissBox>
          </AnimatedVisibility>
        </LazyColumn>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
});
