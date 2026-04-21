package com.example.medisync.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
            // Here you would typically reschedule all active alarms from the database
            // e.g., MedicationRepository.getAllMedications().forEach { scheduleAlarm(it) }
        }
    }
}
