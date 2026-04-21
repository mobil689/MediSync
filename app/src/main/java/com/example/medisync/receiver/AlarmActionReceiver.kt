package com.example.medisync.receiver

import android.app.AlarmManager
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import com.example.medisync.data.repository.MedicationRepository

class AlarmActionReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val medicineId = intent.getStringExtra("MEDICINE_ID") ?: return
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.cancel(medicineId.hashCode())

        when (intent.action) {
            "ACTION_TOOK" -> {
                Log.d("AlarmActionReceiver", "Medication $medicineId marked as taken")
                MedicationRepository.markAsTaken(medicineId)
            }
            "ACTION_SNOOZE" -> {
                val medicineName = intent.getStringExtra("MEDICINE_NAME") ?: "Medicine"
                val dosage = intent.getStringExtra("DOSAGE") ?: ""
                snoozeAlarm(context, medicineId, medicineName, dosage)
            }
        }
        
        // Close the AlarmActivity if it's open
        context.sendBroadcast(Intent("FINISH_ALARM_ACTIVITY"))
    }

    private fun snoozeAlarm(context: Context, medicineId: String, medicineName: String, dosage: String) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(context, AlarmReceiver::class.java).apply {
            putExtra("MEDICINE_ID", medicineId)
            putExtra("MEDICINE_NAME", medicineName)
            putExtra("DOSAGE", dosage)
        }
        
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            medicineId.hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Postpone by 1 hour as requested
        val triggerTime = System.currentTimeMillis() + 60 * 60 * 1000

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (alarmManager.canScheduleExactAlarms()) {
                alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
            } else {
                alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
            }
        } else {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
        }
    }
}
