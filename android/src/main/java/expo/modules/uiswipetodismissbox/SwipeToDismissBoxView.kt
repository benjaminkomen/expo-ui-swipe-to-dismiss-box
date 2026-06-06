package expo.modules.uiswipetodismissbox

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.LayoutDirection
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.FunctionalComposableScope
import expo.modules.ui.ModifierList
import expo.modules.ui.ModifierRegistry
import expo.modules.ui.findChildSlotView
import expo.modules.ui.isSlotView
import expo.modules.ui.renderSlot
import kotlin.math.abs
import kotlin.math.roundToInt
import kotlinx.coroutines.launch

data class SwipeToDismissBoxProps(
  val enableDismissFromStartToEnd: Boolean = true,
  val enableDismissFromEndToStart: Boolean = true,
  val gesturesEnabled: Boolean = true,
  val positionalThreshold: Float? = null,
  val modifiers: ModifierList = emptyList()
) : ComposeProps

@Composable
fun FunctionalComposableScope.SwipeToDismissBoxContent(
  props: SwipeToDismissBoxProps,
  onStartToEnd: () -> Unit,
  onEndToStart: () -> Unit
) {
  val offsetX = remember { Animatable(0f) }
  var containerWidth by remember { mutableIntStateOf(0) }
  val scope = rememberCoroutineScope()
  val layoutDirection = LocalLayoutDirection.current
  val isLtr = layoutDirection == LayoutDirection.Ltr

  val currentThreshold = rememberUpdatedState(props.positionalThreshold ?: 0.5f)
  val currentOnStartToEnd = rememberUpdatedState(onStartToEnd)
  val currentOnEndToStart = rememberUpdatedState(onEndToStart)
  val currentEnableStartToEnd = rememberUpdatedState(props.enableDismissFromStartToEnd)
  val currentEnableEndToStart = rememberUpdatedState(props.enableDismissFromEndToStart)

  fun isStartToEnd(offset: Float): Boolean =
    if (isLtr) offset > 0 else offset < 0

  val backgroundSlot = findChildSlotView(view, "backgroundContent")
  val backgroundStartToEndSlot = findChildSlotView(view, "backgroundStartToEnd")
  val backgroundEndToStartSlot = findChildSlotView(view, "backgroundEndToStart")

  Box(
    modifier = ModifierRegistry.applyModifiers(props.modifiers, appContext, composableScope, globalEventDispatcher)
      .onSizeChanged { containerWidth = it.width }
  ) {
    val offset = offsetX.value
    val activeSlot = when {
      isStartToEnd(offset) -> backgroundStartToEndSlot ?: backgroundSlot
      !isStartToEnd(offset) && offset != 0f -> backgroundEndToStartSlot ?: backgroundSlot
      else -> backgroundSlot
    }

    if (activeSlot != null && offset != 0f) {
      val widthDp = with(LocalDensity.current) { abs(offset).toDp() }
      val alignment = if (offset < 0) Alignment.CenterEnd else Alignment.CenterStart

      Box(
        modifier = Modifier.matchParentSize(),
        contentAlignment = alignment
      ) {
        Box(
          modifier = Modifier
            .fillMaxHeight()
            .width(widthDp)
        ) {
          activeSlot.renderSlot()
        }
      }
    }

    Box(
      modifier = Modifier
        .offset { IntOffset(offsetX.value.roundToInt(), 0) }
        .pointerInput(props.gesturesEnabled) {
          if (!props.gesturesEnabled) return@pointerInput

          detectHorizontalDragGestures(
            onDragEnd = {
              val width = containerWidth
              val currentOffset = offsetX.value

              scope.launch {
                if (width > 0 && abs(currentOffset) >= width * currentThreshold.value) {
                  val target = if (currentOffset > 0) width.toFloat() else -width.toFloat()
                  offsetX.animateTo(target, tween(200))

                  if (isStartToEnd(currentOffset)) {
                    currentOnStartToEnd.value()
                  } else {
                    currentOnEndToStart.value()
                  }
                } else {
                  offsetX.animateTo(0f, spring(stiffness = Spring.StiffnessMediumLow))
                }
              }
            },
            onDragCancel = {
              scope.launch {
                offsetX.animateTo(0f, spring(stiffness = Spring.StiffnessMediumLow))
              }
            }
          ) { change, dragAmount ->
            change.consume()
            val newValue = offsetX.value + dragAmount

            val enableStart = currentEnableStartToEnd.value
            val enableEnd = currentEnableEndToStart.value
            val clamped = when {
              enableStart && enableEnd -> newValue
              enableStart && !enableEnd -> if (isLtr) newValue.coerceAtLeast(0f) else newValue.coerceAtMost(0f)
              !enableStart && enableEnd -> if (isLtr) newValue.coerceAtMost(0f) else newValue.coerceAtLeast(0f)
              else -> 0f
            }
            scope.launch { offsetX.snapTo(clamped) }
          }
        }
    ) {
      Children(ComposableScope()) { !isSlotView(it) }
    }
  }
}
