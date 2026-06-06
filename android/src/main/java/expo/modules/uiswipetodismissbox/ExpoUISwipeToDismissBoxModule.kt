package expo.modules.uiswipetodismissbox

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.ui.ExpoUIView

class ExpoUISwipeToDismissBoxModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoUISwipeToDismissBox")

    ExpoUIView<SwipeToDismissBoxProps>("SwipeToDismissBoxView") {
      val onStartToEnd by Event<Unit>()
      val onEndToStart by Event<Unit>()

      Content { props ->
        // BUG REPRODUCTION: Using the standard Event<Unit>() DSL.
        // Events are silently dropped because ViewEvent validation in
        // expo-modules-core resolves the wrong module holder when multiple
        // modules register Compose views (all share ComposeFunctionHolder class).
        SwipeToDismissBoxContent(props, { onStartToEnd(Unit) }, { onEndToStart(Unit) })
      }
    }
  }
}
