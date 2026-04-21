package com.example.medisync.viewmodel

import androidx.compose.runtime.mutableStateListOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.medisync.ui.screens.ChatMessage
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class TriageViewModel : ViewModel() {
    private val _messages = mutableStateListOf(
        ChatMessage("intro", "ai", "Hi, I'm your Triage assistant. Tap any area on the body, or type below to describe what's going on.")
    )
    val messages: List<ChatMessage> get() = _messages

    private val _isTyping = MutableStateFlow(false)
    val isTyping = _isTyping.asStateFlow()

    fun sendMessage(text: String) {
        if (text.isBlank()) return
        _messages.add(ChatMessage("u-${System.currentTimeMillis()}", "user", text))
        generateAiResponse(text)
    }

    fun selectZone(zone: String) {
        val userText = "I am experiencing discomfort in my $zone."
        _messages.add(ChatMessage("u-${System.currentTimeMillis()}", "user", userText))
        generateAiResponse(userText)
    }

    private fun generateAiResponse(query: String) {
        viewModelScope.launch {
            _isTyping.value = true
            delay(1500)
            
            // Logic for AI Response (Mock for now, ready for Groq API integration)
            val response = when {
                query.contains("Chest", ignoreCase = true) -> 
                    "I understand you are having chest discomfort. Is the pain sharp, or does it feel like heavy pressure? Please remember I am an AI, and for severe symptoms, seek immediate emergency care."
                query.contains("Head", ignoreCase = true) -> 
                    "I hear you're having head discomfort. Is it a dull ache, a sharp pain, or pressure behind the eyes? If it's sudden and severe, please seek urgent care."
                else -> "I've noted that discomfort. Can you tell me when this started and how severe it feels on a scale of 1–10?"
            }
            
            _messages.add(ChatMessage("ai-${System.currentTimeMillis()}", "ai", response))
            _isTyping.value = false
        }
    }
}
