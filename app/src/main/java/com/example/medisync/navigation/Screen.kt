package com.example.medisync.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.MedicalServices
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Place
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object Today : Screen("today", "Today", Icons.Outlined.Home)
    object Triage : Screen("triage", "Triage", Icons.Outlined.MedicalServices)
    object Doctors : Screen("doctors", "Doctors", Icons.Outlined.Place)
    object Account : Screen("account", "Account", Icons.Outlined.Person)
}
