package com.example.medisync.ui

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.view.WindowManager
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.medisync.receiver.AlarmActionReceiver
import com.example.medisync.ui.theme.MediSyncTheme
import java.text.SimpleDateFormat
import java.util.*

class AlarmActivity : ComponentActivity() {

    private var vibrator: Vibrator? = null

    private val finishReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent?.action == "FINISH_ALARM_ACTIVITY") {
                finish()
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Show over lock screen
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
        } else {
            @Suppress("DEPRECATION")
            window.addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                        WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            )
        }
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        val medicineName = intent.getStringExtra("MEDICINE_NAME") ?: "Medicine"
        val dosage = intent.getStringExtra("DOSAGE") ?: ""
        val medicineId = intent.getStringExtra("MEDICINE_ID") ?: ""

        startVibration()

        val filter = IntentFilter("FINISH_ALARM_ACTIVITY")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(finishReceiver, filter, RECEIVER_NOT_EXPORTED)
        } else {
            registerReceiver(finishReceiver, filter)
        }

        setContent {
            MediSyncTheme {
                AlarmScreen(
                    medicineName = medicineName,
                    dosage = dosage,
                    onTookClick = {
                        sendAction("ACTION_TOOK", medicineId)
                    },
                    onSnoozeClick = {
                        sendAction("ACTION_SNOOZE", medicineId, medicineName, dosage)
                    }
                )
            }
        }
    }

    private fun startVibration() {
        vibrator = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        val pattern = longArrayOf(0, 500, 500)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator?.vibrate(VibrationEffect.createWaveform(pattern, 0))
        } else {
            @Suppress("DEPRECATION")
            vibrator?.vibrate(pattern, 0)
        }
    }

    private fun sendAction(action: String, medicineId: String, name: String? = null, dose: String? = null) {
        val intent = Intent(this, AlarmActionReceiver::class.java).apply {
            this.action = action
            putExtra("MEDICINE_ID", medicineId)
            name?.let { putExtra("MEDICINE_NAME", it) }
            dose?.let { putExtra("DOSAGE", it) }
        }
        sendBroadcast(intent)
        finish()
    }

    override fun onDestroy() {
        super.onDestroy()
        vibrator?.cancel()
        unregisterReceiver(finishReceiver)
    }
}

@Composable
fun AlarmScreen(
    medicineName: String,
    dosage: String,
    onTookClick: () -> Unit,
    onSnoozeClick: () -> Unit
) {
    var currentTime by remember { mutableStateOf(SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date())) }
    
    LaunchedEffect(Unit) {
        while(true) {
            currentTime = SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date())
            kotlinx.coroutines.delay(1000)
        }
    }

    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val pulseAlpha by infiniteTransition.animateFloat(
        initialValue = 0.15f,
        targetValue = 0.4f,
        animationSpec = infiniteRepeatable(
            animation = tween(2000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "alpha"
    )

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = Color(0xFF0B0D2E) // Deep Navy
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(80.dp))
            
            Text(
                text = currentTime,
                color = Color.White,
                fontSize = 56.sp,
                fontWeight = FontWeight.Bold
            )
            
            Text(
                text = "Time for your medication",
                color = Color(0xFFB0B3C8),
                fontSize = 16.sp,
                modifier = Modifier.padding(top = 8.dp)
            )

            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                // Outer Glow
                Box(
                    modifier = Modifier
                        .size(320.dp)
                        .background(
                            Brush.radialGradient(
                                colors = listOf(Color(0xFF3A1F8E).copy(alpha = pulseAlpha), Color.Transparent),
                                radius = 480f
                            )
                        )
                )
                
                // Middle Glow
                Box(
                    modifier = Modifier
                        .size(220.dp)
                        .background(
                            Brush.radialGradient(
                                colors = listOf(Color(0xFF5B3FD4).copy(alpha = 0.4f), Color.Transparent),
                                radius = 330f
                            )
                        )
                )
                
                // Inner Ring
                Box(
                    modifier = Modifier
                        .size(140.dp)
                        .border(2.dp, Color.White.copy(alpha = 0.15f), CircleShape)
                )
                
                Text(
                    text = "\uD83D\uDC8A", // Pill Emoji
                    fontSize = 80.sp
                )
            }

            // Medicine Info Card
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp)
                    .clip(RoundedCornerShape(24.dp)),
                color = Color.White.copy(alpha = 0.07f),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.12f))
            ) {
                Column(
                    modifier = Modifier.padding(horizontal = 32.dp, vertical = 24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = medicineName,
                        color = Color.White,
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.Center
                    )
                    Text(
                        text = if (dosage.contains("·")) dosage else "$dosage · with water",
                        color = Color(0xFF9A9DBA),
                        fontSize = 16.sp,
                        modifier = Modifier.padding(top = 4.dp),
                        textAlign = TextAlign.Center
                    )
                }
            }

            Spacer(modifier = Modifier.height(48.dp))

            // Buttons Row
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(start = 24.dp, end = 24.dp, bottom = 48.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(
                    onClick = onSnoozeClick,
                    modifier = Modifier
                        .weight(1f)
                        .height(56.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.White.copy(alpha = 0.06f)),
                    shape = RoundedCornerShape(28.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.15f))
                ) {
                    Text("Remind Me Later", color = Color.White, fontSize = 18.sp)
                }

                Button(
                    onClick = onTookClick,
                    modifier = Modifier
                        .weight(1f)
                        .height(56.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                    contentPadding = PaddingValues(),
                    shape = RoundedCornerShape(28.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(
                                Brush.horizontalGradient(
                                    listOf(Color(0xFF4A6CF7), Color(0xFF9B59F7))
                                ),
                                shape = RoundedCornerShape(28.dp)
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            "I Took It",
                            color = Color.White,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 18.sp
                        )
                    }
                }
            }
        }
    }
}
