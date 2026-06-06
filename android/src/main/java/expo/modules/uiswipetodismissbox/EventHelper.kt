package expo.modules.uiswipetodismissbox

import android.util.Log
import android.view.View
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event

private class SimpleUIEvent(
  surfaceId: Int,
  viewId: Int,
  private val name: String
) : Event<SimpleUIEvent>(surfaceId, viewId) {
  override fun getEventName(): String = name
  override fun getCoalescingKey(): Short = 0
}

/**
 * Dispatches a view event directly via React Native's event dispatcher, bypassing
 * expo-modules-core's ViewEvent validation which has a bug when multiple modules
 * register Compose views (it resolves the wrong module holder for ComposeFunctionHolder).
 */
fun emitViewEvent(view: View, eventName: String) {
  val context = view.context as? ReactContext
  if (context == null) {
    Log.w("SwipeToDismiss", "Cannot emit event $eventName: view context is not a ReactContext")
    return
  }

  val surfaceId = UIManagerHelper.getSurfaceId(view)
  val viewId = view.id
  val event = SimpleUIEvent(surfaceId, viewId, eventName)

  @Suppress("DEPRECATION")
  val dispatcher = UIManagerHelper.getEventDispatcherForReactTag(context, viewId)
  if (dispatcher == null) {
    Log.w("SwipeToDismiss", "Cannot emit event $eventName: no event dispatcher for view $viewId")
    return
  }

  dispatcher.dispatchEvent(event)
  Log.d("SwipeToDismiss", "Emitted event $eventName for view $viewId (surface $surfaceId)")
}
