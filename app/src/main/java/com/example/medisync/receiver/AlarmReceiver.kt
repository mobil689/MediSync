package com.example.medisync.receiver

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import com.example.medisync.MainActivity
import com.example.medisync.R
import com.example.medisync.ui.AlarmActivity

class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val medicineName = intent.getStringExtra("MEDICINE_NAME") ?: "Medicine"
        val dosage = intent.getStringExtra("DOSAGE") ?: ""
        val medicineId = intent.getStringExtra("MEDICINE_ID") ?: ""

        showNotification(context, medicineName, dosage, medicineId)
    }

    private fun showNotification(context: Context, medicineName: String, dosage: String, medicineId: String) {
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channelId = "medication_reminder"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Medication Reminders",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notifications for medication reminders"
                setBypassDnd(true)
                enableVibration(true)
            }
            notificationManager.createNotificationChannel(channel)
        }

        val fullScreenIntent = Intent(context, AlarmActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("MEDICINE_NAME", medicineName)
            putExtra("DOSAGE", dosage)
            putExtra("MEDICINE_ID", medicineId)
        }
        val fullScreenPendingIntent = PendingIntent.getActivity(
            context,
            medicineId.hashCode(),
            fullScreenIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val tookIntent = Intent(context, AlarmActionReceiver::class.java).apply {
            action = "ACTION_TOOK"
            putExtra("MEDICINE_ID", medicineId)
        }
        val tookPendingIntent = PendingIntent.getBroadcast(
            context,
            medicineId.hashCode() + 1,
            tookIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val laterIntent = Intent(context, AlarmActionReceiver::class.java).apply {
            action = "ACTION_SNOOZE"
            putExtra("MEDICINE_ID", medicineId)
            putExtra("MEDICINE_NAME", medicineName)
            putExtra("DOSAGE", dosage)
        }
        val laterPendingIntent = PendingIntent.getBroadcast(
            context,
            medicineId.hashCode() + 2,
            laterIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle("Medicine Reminder")
            .setContentText("Time to take $medicineName ($dosage)")
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setFullScreenIntent(fullScreenPendingIntent, true)
            .setAutoCancel(true)
            .addAction(0, "Took", tookPendingIntent)
            .addAction(0, "Later", laterPendingIntent)
            .build()

        notificationManager.notify(medicineId.hashCode(), notification)
    }
}
