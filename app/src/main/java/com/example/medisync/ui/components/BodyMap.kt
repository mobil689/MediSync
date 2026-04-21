package com.example.medisync.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.dp

@Composable
fun BodyMap(
    onZoneSelect: (String) -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(300.dp)
            .padding(16.dp)
    ) {
        Canvas(modifier = Modifier.fillMaxSize().pointerInput(Unit) {
            detectTapGestures { offset ->
                // Simplified hit detection logic based on SVG coordinates mapped to canvas size
                // In a production app, we would use proper path hit testing.
                // For now, we'll map general regions.
                val x = offset.x / size.width * 340
                val y = offset.y / size.height * 410
                
                when {
                    y in 22.0..74.0 && (x in 54.0..106.0 || x in 224.0..276.0) -> onZoneSelect("Head")
                    y in 92.0..142.0 && x in 40.0..120.0 -> onZoneSelect("Chest")
                    y in 92.0..142.0 && x in 210.0..290.0 -> onZoneSelect("Upper Back")
                    y in 146.0..188.0 && x in 44.0..116.0 -> onZoneSelect("Abdomen")
                    y in 146.0..188.0 && x in 214.0..286.0 -> onZoneSelect("Lower Back")
                    y in 192.0..230.0 && (x in 48.0..112.0 || x in 218.0..282.0) -> onZoneSelect("Pelvis")
                    y in 96.0..146.0 && x in 20.0..40.0 -> onZoneSelect("Right Arm")
                    y in 96.0..146.0 && x in 120.0..140.0 -> onZoneSelect("Left Arm")
                    y in 234.0..380.0 && x in 54.0..106.0 -> onZoneSelect("Legs")
                }
            }
        }) {
            drawFigure(0f, "FRONT")
            drawFigure(170f, "BACK")
        }
    }
}

fun DrawScope.drawFigure(xOffset: Float, label: String) {
    val strokeColor = Color(0xFF5C6BC0)
    val strokeWidth = 2.dp.toPx()

    // Scale coordinates to fit canvas
    val scaleX = size.width / 340f
    val scaleY = size.height / 410f

    fun x(n: Float) = (n + xOffset) * scaleX
    fun y(n: Float) = n * scaleY

    // Head
    drawCircle(
        color = strokeColor,
        radius = 26f * scaleX,
        center = Offset(x(80f), y(48f)),
        style = Stroke(width = strokeWidth)
    )

    // Torso (Simplified as a rounded rect for now)
    drawRoundRect(
        color = strokeColor,
        topLeft = Offset(x(40f), y(92f)),
        size = Size(80f * scaleX, 100f * scaleY),
        cornerRadius = CornerRadius(10f * scaleX),
        style = Stroke(width = strokeWidth)
    )

    // Arms
    drawLine(strokeColor, Offset(x(40f), y(96f)), Offset(x(20f), y(148f)), strokeWidth)
    drawLine(strokeColor, Offset(x(120f), y(96f)), Offset(x(140f), y(148f)), strokeWidth)

    // Legs
    drawLine(strokeColor, Offset(x(60f), y(234f)), Offset(x(60f), y(380f)), strokeWidth)
    drawLine(strokeColor, Offset(x(100f), y(234f)), Offset(x(100f), y(380f)), strokeWidth)
}
