export interface ModifierConfig {
  $type: string;
  [key: string]: any;
  eventListener?: (args: any) => void;
}

type GlobalEventPayload = [eventName: string, params: Record<string, any>];
type GlobalEvent = {
  onGlobalEvent: (event: { nativeEvent: { payload: GlobalEventPayload } }) => void;
};

export function createViewModifierEventListener(modifiers: ModifierConfig[]): GlobalEvent {
  const eventListeners: Record<string, (args: any) => void> = {};
  for (const modifier of modifiers) {
    if (modifier.eventListener) {
      eventListeners[modifier.$type] = modifier.eventListener;
    }
  }

  const onGlobalEvent: GlobalEvent['onGlobalEvent'] = ({ nativeEvent }) => {
    const [eventName, params] = nativeEvent.payload;
    const listener = eventListeners[eventName];
    if (listener) {
      listener(params);
    }
  };

  return { onGlobalEvent };
}
