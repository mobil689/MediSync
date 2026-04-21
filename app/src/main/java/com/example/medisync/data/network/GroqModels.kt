package com.example.medisync.data.network

import com.google.gson.annotations.SerializedName

data class Message(
    @SerializedName("role") val role: String,
    @SerializedName("content") val content: String
)

data class GroqRequest(
    @SerializedName("model") val model: String = "llama-3.1-8b-instant",
    @SerializedName("messages") val messages: List<Message>
)

data class GroqResponse(
    @SerializedName("choices") val choices: List<Choice>
)

data class Choice(
    @SerializedName("message") val message: Message
)
