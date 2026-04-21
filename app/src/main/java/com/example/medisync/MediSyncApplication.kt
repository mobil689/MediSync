package com.example.medisync

import android.app.Application
import com.clerk.api.Clerk // Correct Android import

class MediSyncApp : Application() {
    override fun onCreate() {
        super.onCreate()
        // Replace with your actual Publishable Key from Clerk Dashboard
        Clerk.initialize(this, "pk_test_Y2xlcmsubWVkaXN5bmMtYWkuYWNjb3VudHMuZGV2JA")
    }
}
