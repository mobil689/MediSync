package com.example.medisync.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.HealthAndSafety
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object Today : Screen("today", "Today", Icons.Default.Home)
    object Triage : Screen("triage", "Triage", Icons.Default.HealthAndSafety)
    object Doctors : Screen("doctors", "Doctors", Icons.Default.LocalHospital)
    object Account : Screen("account", "Account", Icons.Default.AccountCircle)
}
