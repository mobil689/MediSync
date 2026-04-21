package com.example.medisync.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.medisync.data.model.Medication
import com.example.medisync.data.repository.MedicationRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn

class MedicationViewModel : ViewModel() {
    private val repository = MedicationRepository() // Normally injected via Hilt

    val medications: StateFlow<List<Medication>> = repository.medications
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    fun addMedication(name: String, dosage: String, times: List<String>) {
        times.forEach { timeStr ->
            val medication = Medication(
                name = name,
                dosage = dosage,
                time = when(timeStr) {
                    "morning" -> "8:00 AM"
                    "afternoon" -> "1:00 PM"
                    "evening" -> "6:00 PM"
                    "night" -> "10:00 PM"
                    else -> "8:00 AM"
                },
                timeOfDay = timeStr
            )
            repository.addMedication(medication)
        }
    }

    fun deleteMedications(ids: Set<String>) {
        repository.deleteMedications(ids)
    }

    fun toggleMedication(id: String) {
        repository.toggleMedication(id)
    }
}
