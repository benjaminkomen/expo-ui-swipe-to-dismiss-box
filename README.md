# expo-ui-swipe-to-dismiss-box

A swipe-to-dismiss component for [Expo UI](https://docs.expo.dev/versions/latest/sdk/ui/) (Jetpack Compose) with reliable threshold control.

This is a community-built extension that provides a `SwipeToDismissBox` component matching the [Jetpack Compose SwipeToDismissBox](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/swipe-to-dismiss) API. It uses a custom gesture implementation instead of Material 3's `SwipeToDismissBox` to work around [a bug](https://issuetracker.google.com/issues/471021165) where `positionalThreshold` is silently ignored.

## Platform Support

**Android only.** This component uses Jetpack Compose and has no iOS equivalent.

## Installation

```bash
npx expo install expo-ui-swipe-to-dismiss-box @expo/ui
```

A native rebuild is required after installation:

```bash
npx expo run:android
```

## Usage

```tsx
import { Host, LazyColumn, ListItem, Box, Text } from '@expo/ui/jetpack-compose';
import { fillMaxSize, background, paddingAll } from '@expo/ui/jetpack-compose/modifiers';
import { SwipeToDismissBox } from 'expo-ui-swipe-to-dismiss-box';

function MyList() {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);

  return (
    <Host style={{ flex: 1 }}>
      <LazyColumn>
        {items.map((item, index) => (
          <SwipeToDismissBox
            key={item}
            positionalThreshold={0.3}
            enableDismissFromStartToEnd={false}
            onEndToStart={() => setItems((prev) => prev.filter((_, i) => i !== index))}>
            <SwipeToDismissBox.BackgroundContent>
              <Box
                contentAlignment="center"
                modifiers={[fillMaxSize(), background('#EF5350'), paddingAll(16)]}>
                <Text>Delete</Text>
              </Box>
            </SwipeToDismissBox.BackgroundContent>
            <ListItem headlineContent={item} />
          </SwipeToDismissBox>
        ))}
      </LazyColumn>
    </Host>
  );
}
```

## API

### `SwipeToDismissBox`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableDismissFromStartToEnd` | `boolean` | `true` | Allow swiping from start to end (left-to-right in LTR) |
| `enableDismissFromEndToStart` | `boolean` | `true` | Allow swiping from end to start (right-to-left in LTR) |
| `gesturesEnabled` | `boolean` | `true` | Whether swipe gestures are enabled |
| `positionalThreshold` | `number` | `0.5` | Fraction (0.0–1.0) of swipe distance required to trigger dismiss |
| `onStartToEnd` | `() => void` | — | Called when item is swiped start-to-end |
| `onEndToStart` | `() => void` | — | Called when item is swiped end-to-start |
| `modifiers` | `ModifierConfig[]` | — | Compose modifiers |

### Sub-components (Slots)

- **`SwipeToDismissBox.BackgroundContent`** — Fallback background shown in either direction
- **`SwipeToDismissBox.BackgroundStartToEnd`** — Background for start-to-end swipe (overrides `BackgroundContent`)
- **`SwipeToDismissBox.BackgroundEndToStart`** — Background for end-to-start swipe (overrides `BackgroundContent`)

## Why a custom implementation?

Material 3's `SwipeToDismissBox` has a [known bug](https://issuetracker.google.com/issues/471021165) where `positionalThreshold` is silently ignored (never forwarded to the underlying `AnchoredDraggableState`). This package uses lower-level Compose primitives (`detectHorizontalDragGestures` + `Animatable`) for reliable threshold control.

## Related

- [Original expo PR](https://github.com/expo/expo/pull/44136) — Context and design rationale
- [Expo UI Extending Guide](https://docs.expo.dev/guides/expo-ui-jetpack-compose/extending/) — How this package is built
- [Google Issue Tracker](https://issuetracker.google.com/issues/471021165) — The Material 3 bug

## License

MIT
