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
        SwipeToDismissBoxContent(props, { onStartToEnd(Unit) }, { onEndToStart(Unit) })
      }
    }
  }
}
