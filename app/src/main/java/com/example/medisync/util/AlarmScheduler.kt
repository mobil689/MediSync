package com.example.medisync.util

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import com.example.medisync.data.model.Medication
import com.example.medisync.receiver.AlarmReceiver
import java.util.*

object AlarmScheduler {
    fun scheduleAlarm(context: Context, medication: Medication) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(context, AlarmReceiver::class.java).apply {
            putExtra("MEDICINE_ID", medication.id)
            putExtra("MEDICINE_NAME", medication.name)
            putExtra("DOSAGE", medication.dosage)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            medication.id.hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val calendar = Calendar.getInstance()
        val timeParts = medication.time.split(":")
        if (timeParts.size == 2) {
            val hour = timeParts[0].toInt()
            val minute = timeParts[1].substringBefore(" ").toInt()
            val isPM = medication.time.contains("PM", ignoreCase = true)
            
            calendar.set(Calendar.HOUR_OF_DAY, if (isPM && hour < 12) hour + 12 else if (!isPM && hour == 12) 0 else hour)
            calendar.set(Calendar.MINUTE, minute)
            calendar.set(Calendar.SECOND, 0)

            if (calendar.before(Calendar.getInstance())) {
                calendar.add(Calendar.DAY_OF_YEAR, 1)
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                if (alarmManager.canScheduleExactAlarms()) {
                    alarmManager.setExactAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP,
                        calendar.timeInMillis,
                        pendingIntent
                    )
                } else {
                    alarmManager.setAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP,
                        calendar.timeInMillis,
                        pendingIntent
                    )
                }
            } else {
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    calendar.timeInMillis,
                    pendingIntent
                )
            }
        }
    }

    fun cancelAlarm(context: Context, medication: Medication) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(context, AlarmReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            medication.id.hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        alarmManager.cancel(pendingIntent)
    }
}
