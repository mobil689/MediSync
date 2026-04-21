package com.example.medisync.data.network

import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST

interface GroqService {
    @POST("v1/chat/completions")
    suspend fun getTriageQuestions(
        @Header("Authorization") apiKey: String,
        @Body request: GroqRequest
    ): GroqResponse
}
