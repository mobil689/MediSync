package com.example.medisync.ui.components

import android.graphics.RectF
import android.graphics.Region
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.toSize

sealed class BodyZone(val label: String) {
    object HeadNeck : BodyZone("Head & Neck")
    object UpperChest : BodyZone("Upper Chest")
    object Abdomen : BodyZone("Abdomen")
    object Pelvis : BodyZone("Pelvis")
    object Arms : BodyZone("Arms")
    object Legs : BodyZone("Legs")
}

@Composable
fun TriageMannequinView(
    modifier: Modifier = Modifier,
    selectedZone: BodyZone? = null,
    selectedSide: Boolean? = null, // false = Front, true = Back
    onZoneSelected: (BodyZone, Boolean) -> Unit
) {
    val haptic = LocalHapticFeedback.current
    val strokeColor = Color(0xFFFFFFFF)
    val glowColor = Color(0xFF60A5FA)
    val highlightColor = Color(0xFF60A5FA).copy(alpha = 0.3f)
    val strokeWidth = 2.dp

    var size by remember { mutableStateOf(Size.Zero) }

    // Pre-calculate paths whenever size changes for efficient drawing and hit testing
    val pathsMap = remember(size) {
        if (size == Size.Zero) return@remember emptyMap<Pair<BodyZone, Boolean>, Path>()
        
        val width = size.width
        val height = size.height
        val scale = height / 500f
        
        val map = mutableMapOf<Pair<BodyZone, Boolean>, Path>()
        
        // Front paths (left side of canvas)
        val frontCx = width * 0.3f
        val cy = height * 0.45f
        generateMannequinPaths(frontCx, cy, scale).forEach { (zone, path) ->
            map[zone to false] = path
        }
        
        // Back paths (right side of canvas)
        val backCx = width * 0.7f
        generateMannequinPaths(backCx, cy, scale).forEach { (zone, path) ->
            map[zone to true] = path
        }
        
        map
    }

    Canvas(
        modifier = modifier
            .fillMaxSize()
            .onSizeChanged { size = it.toSize() }
            .pointerInput(size) {
                detectTapGestures { offset ->
                    pathsMap.forEach { (info, path) ->
                        if (isPointInPath(offset, path)) {
                            haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                            onZoneSelected(info.first, info.second)
                            return@detectTapGestures
                        }
                    }
                }
            }
    ) {
        val style = Stroke(width = strokeWidth.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round)

        pathsMap.forEach { (info, path) ->
            val (zone, isBack) = info
            
            // Draw glow/shadow effect
            drawContext.canvas.nativeCanvas.apply {
                val androidPaint = android.graphics.Paint().apply {
                    setShadowLayer(15f, 0f, 0f, glowColor.toArgb())
                    color = android.graphics.Color.TRANSPARENT
                }
                drawPath(path.asAndroidPath(), androidPaint)
            }

            // Check if this specific zone and side is selected
            if (selectedZone == zone && (selectedSide == null || selectedSide == isBack)) {
                drawPath(path, highlightColor)
            }
            drawPath(path, strokeColor, style = style)
        }
    }
}

private fun generateMannequinPaths(cx: Float, cy: Float, scale: Float): Map<BodyZone, Path> {
    val map = mutableMapOf<BodyZone, Path>()

    // 1. Head & Neck
    map[BodyZone.HeadNeck] = Path().apply {
        addOval(Rect(center = Offset(cx, cy - 180f * scale), radius = 22f * scale))
        moveTo(cx - 8f * scale, cy - 158f * scale)
        lineTo(cx - 8f * scale, cy - 145f * scale)
        moveTo(cx + 8f * scale, cy - 158f * scale)
        lineTo(cx + 8f * scale, cy - 145f * scale)
    }

    // 2. Upper Chest (Trapezoid)
    map[BodyZone.UpperChest] = Path().apply {
        moveTo(cx - 45f * scale, cy - 145f * scale)
        lineTo(cx + 45f * scale, cy - 145f * scale)
        lineTo(cx + 40f * scale, cy - 90f * scale)
        lineTo(cx - 40f * scale, cy - 90f * scale)
        close()
    }

    // 3. Abdomen
    map[BodyZone.Abdomen] = Path().apply {
        addRoundRect(
            androidx.compose.ui.geometry.RoundRect(
                rect = Rect(cx - 38f * scale, cy - 85f * scale, cx + 38f * scale, cy - 35f * scale),
                cornerRadius = CornerRadius(4f * scale)
            )
        )
    }

    // 4. Pelvis (Inverted Trapezoid)
    map[BodyZone.Pelvis] = Path().apply {
        moveTo(cx - 38f * scale, cy - 30f * scale)
        lineTo(cx + 38f * scale, cy - 30f * scale)
        lineTo(cx + 42f * scale, cy + 10f * scale)
        lineTo(cx - 42f * scale, cy + 10f * scale)
        close()
    }

    // 5. Arms (Segmented: Upper and Lower)
    map[BodyZone.Arms] = Path().apply {
        // Left Arm
        addRoundRect(androidx.compose.ui.geometry.RoundRect(Rect(cx - 65f * scale, cy - 140f * scale, cx - 50f * scale, cy - 70f * scale), CornerRadius(6f * scale)))
        addRoundRect(androidx.compose.ui.geometry.RoundRect(Rect(cx - 65f * scale, cy - 65f * scale, cx - 50f * scale, cy + 10f * scale), CornerRadius(6f * scale)))
        // Right Arm
        addRoundRect(androidx.compose.ui.geometry.RoundRect(Rect(cx + 50f * scale, cy - 140f * scale, cx + 65f * scale, cy - 70f * scale), CornerRadius(6f * scale)))
        addRoundRect(androidx.compose.ui.geometry.RoundRect(Rect(cx + 50f * scale, cy - 65f * scale, cx + 65f * scale, cy + 10f * scale), CornerRadius(6f * scale)))
    }

    // 6. Legs (Segmented: Thigh and Calf)
    map[BodyZone.Legs] = Path().apply {
        // Left Leg
        addRoundRect(androidx.compose.ui.geometry.RoundRect(Rect(cx - 35f * scale, cy + 15f * scale, cx - 15f * scale, cy + 120f * scale), CornerRadius(8f * scale)))
        addRoundRect(androidx.compose.ui.geometry.RoundRect(Rect(cx - 33f * scale, cy + 125f * scale, cx - 17f * scale, cy + 240f * scale), CornerRadius(8f * scale)))
        // Right Leg
        addRoundRect(androidx.compose.ui.geometry.RoundRect(Rect(cx + 15f * scale, cy + 15f * scale, cx + 35f * scale, cy + 120f * scale), CornerRadius(8f * scale)))
        addRoundRect(androidx.compose.ui.geometry.RoundRect(Rect(cx + 17f * scale, cy + 125f * scale, cx + 33f * scale, cy + 240f * scale), CornerRadius(8f * scale)))
    }

    return map
}

private fun isPointInPath(offset: Offset, path: Path): Boolean {
    val androidPath = path.asAndroidPath()
    val rectF = RectF()
    androidPath.computeBounds(rectF, true)
    val region = Region()
    region.setPath(androidPath, Region(rectF.left.toInt(), rectF.top.toInt(), rectF.right.toInt(), rectF.bottom.toInt()))
    return region.contains(offset.x.toInt(), offset.y.toInt())
}
