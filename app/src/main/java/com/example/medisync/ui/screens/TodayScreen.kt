package com.example.medisync.ui.screens

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.LocalIndication
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import com.example.medisync.data.model.Medication
import com.example.medisync.viewmodel.MedicationViewModel
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun TodayScreen(viewModel: MedicationViewModel = viewModel()) {
    val today = LocalDate.now().format(DateTimeFormatter.ofPattern("EEEE, MMMM d"))
    var showAddDrawer by remember { mutableStateOf(false) }
    var showDeleteConfirm by remember { mutableStateOf(false) }
    
    val medications by viewModel.medications.collectAsState()
    val selectedIds = remember { mutableStateListOf<String>() }
    val isSelectionMode = selectedIds.isNotEmpty()

    val takenCount = medications.count { it.isTaken }
    val totalCount = medications.size

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFFF8FAFC),
                        Color(0xFFE0E7FF)
                    )
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp)
        ) {
            Spacer(modifier = Modifier.height(40.dp))
            
            // Header Row with Delete Icon if in Selection Mode
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column {
                    Text(
                        text = today,
                        color = Color(0xFF64748B),
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium
                    )
                    Text(
                        text = "Good morning, Alex",
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1E293B),
                        modifier = Modifier.padding(top = 4.dp)
                    )
                }
                
                if (isSelectionMode) {
                    IconButton(
                        onClick = { showDeleteConfirm = true },
                        modifier = Modifier
                            .size(48.dp)
                            .clip(CircleShape)
                            .background(Color(0xFFEF5350))
                    ) {
                        Icon(
                            Icons.Default.Delete,
                            contentDescription = "Delete selected",
                            tint = Color.White
                        )
                    }
                }
            }
            
            if (isSelectionMode) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "${selectedIds.size} SELECTED · HOLD TO SELECT MORE",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF64748B)
                    )
                    TextButton(onClick = { selectedIds.clear() }) {
                        Text("Cancel", color = Color(0xFF5C6BC0), fontWeight = FontWeight.Bold)
                    }
                }
            } else {
                Text(
                    text = buildAnnotatedString {
                        withStyle(style = SpanStyle(fontWeight = FontWeight.Bold, color = Color(0xFF1E293B))) {
                            append(takenCount.toString())
                        }
                        append(" of ")
                        withStyle(style = SpanStyle(fontWeight = FontWeight.Bold, color = Color(0xFF1E293B))) {
                            append(totalCount.toString())
                        }
                        append(" doses logged today")
                    },
                    color = Color(0xFF64748B),
                    fontSize = 14.sp,
                    modifier = Modifier.padding(top = 8.dp)
                )
            }

            Spacer(modifier = Modifier.height(28.dp))

            Text(
                text = "TODAY'S SCHEDULE",
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF64748B),
                letterSpacing = 1.sp
            )

            Spacer(modifier = Modifier.height(12.dp))

            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(16.dp),
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(bottom = 100.dp, top = 8.dp)
            ) {
                items(medications, key = { it.id }) { medication ->
                    val isSelected = selectedIds.contains(medication.id)
                    Box(modifier = Modifier.animateItemPlacement()) {
                        MedicationCard(
                            medication = medication,
                            isSelectionMode = isSelectionMode,
                            isSelected = isSelected,
                            onToggle = { 
                                if (isSelectionMode) {
                                    if (isSelected) selectedIds.remove(medication.id) else selectedIds.add(medication.id)
                                } else {
                                    viewModel.toggleMedication(medication.id)
                                }
                            },
                            onLongPress = {
                                if (!isSelectionMode) {
                                    selectedIds.add(medication.id)
                                }
                            }
                        )
                    }
                }
                
                item {
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "Tip: hold a card for 2 seconds to select & delete.",
                        modifier = Modifier.fillMaxWidth(),
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                        color = Color(0xFF64748B),
                        fontSize = 13.sp
                    )
                }
            }
        }

        // Add FAB
        if (!isSelectionMode) {
            val fabInteractionSource = remember { MutableInteractionSource() }
            val fabPressed by fabInteractionSource.collectIsPressedAsState()
            val fabScale by animateFloatAsState(
                targetValue = if (fabPressed) 0.92f else 1f,
                animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessLow),
                label = "fabScale"
            )

            FloatingActionButton(
                onClick = { showAddDrawer = true },
                interactionSource = fabInteractionSource,
                containerColor = Color.Transparent,
                contentColor = Color.White,
                shape = CircleShape,
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(bottom = 24.dp, end = 20.dp)
                    .size(56.dp)
                    .scale(fabScale)
                    .background(
                        Brush.linearGradient(
                            colors = listOf(Color(0xFF5C6BC0), Color(0xFF7E57C2))
                        ),
                        shape = CircleShape
                    ),
                elevation = FloatingActionButtonDefaults.elevation(defaultElevation = 8.dp, pressedElevation = 12.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add medication", modifier = Modifier.size(24.dp))
            }
        }

        if (showAddDrawer) {
            AddMedicationDrawer(
                onDismiss = { showAddDrawer = false },
                onSave = { name, dosage, times ->
                    viewModel.addMedication(name, dosage, times)
                    showAddDrawer = false
                }
            )
        }
        
        if (showDeleteConfirm) {
            DeleteMedicationDrawer(
                count = selectedIds.size,
                onDismiss = { showDeleteConfirm = false },
                onConfirm = {
                    viewModel.deleteMedications(selectedIds.toSet())
                    selectedIds.clear()
                    showDeleteConfirm = false
                }
            )
        }
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun MedicationCard(
    medication: Medication, 
    isSelectionMode: Boolean,
    isSelected: Boolean,
    onToggle: () -> Unit,
    onLongPress: () -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.97f else 1f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessLow
        ),
        label = "scale"
    )

    val elevation by animateDpAsState(
        targetValue = if (isPressed) 8.dp else 2.dp,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessLow
        ),
        label = "elevation"
    )

    Card(
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        modifier = Modifier
            .fillMaxWidth()
            .scale(scale)
            .shadow(elevation, RoundedCornerShape(24.dp))
            .combinedClickable(
                interactionSource = interactionSource,
                indication = androidx.compose.foundation.LocalIndication.current,
                onClick = onToggle,
                onLongClick = onLongPress
            ),
        border = if (isSelected) androidx.compose.foundation.BorderStroke(2.dp, Color(0xFF5C6BC0)) else null
    ) {
        Row(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            if (isSelectionMode) {
                RadioButton(
                    selected = isSelected,
                    onClick = onToggle,
                    colors = RadioButtonDefaults.colors(selectedColor = Color(0xFF5C6BC0))
                )
                Spacer(modifier = Modifier.width(8.dp))
            }
            
            val (icon, tint, iconColor) = when (medication.timeOfDay) {
                "morning" -> Triple(Icons.Default.WbSunny, Color(0xFFFFF3E0), Color(0xFFFFA726))
                "afternoon" -> Triple(Icons.Default.WbCloudy, Color(0xFFE3F2FD), Color(0xFF2196F3))
                "evening" -> Triple(Icons.Default.WbTwilight, Color(0xFFFFEBEE), Color(0xFFEF5350))
                else -> Triple(Icons.Default.NightsStay, Color(0xFFEDE7F6), Color(0xFF9575CD))
            }

            Box(
                modifier = Modifier
                    .size(56.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(tint),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = iconColor,
                    modifier = Modifier.size(28.dp)
                )
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = medication.name,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = Color(0xFF1E293B)
                    )
                    Text(
                        text = medication.dosage,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color(0xFF64748B)
                    )
                }
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(top = 4.dp)) {
                    Icon(
                        imageVector = Icons.Default.Schedule,
                        contentDescription = null,
                        modifier = Modifier.size(14.dp),
                        tint = Color(0xFF64748B)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = medication.time,
                        fontSize = 14.sp,
                        color = Color(0xFF64748B)
                    )
                    
                    AnimatedVisibility(
                        visible = medication.isTaken,
                        enter = fadeIn() + slideInHorizontally(),
                        exit = fadeOut() + slideOutHorizontally()
                    ) {
                        if (medication.loggedTime != null) {
                            Text(
                                text = buildAnnotatedString {
                                    append(" · ")
                                    withStyle(style = SpanStyle(color = Color(0xFF4CAF50))) {
                                        append("logged ${medication.loggedTime}")
                                    }
                                },
                                fontSize = 14.sp
                            )
                        }
                    }
                }
            }

            if (!isSelectionMode) {
                Box(contentAlignment = Alignment.Center) {
                    AnimatedContent(
                        targetState = medication.isTaken,
                        transitionSpec = {
                            (fadeIn(animationSpec = tween(220, delayMillis = 90)) + 
                             scaleIn(initialScale = 0.92f, animationSpec = tween(220, delayMillis = 90)))
                            .togetherWith(fadeOut(animationSpec = tween(90)))
                        },
                        label = "status_badge"
                    ) { isTaken ->
                        if (isTaken) {
                            Box(
                                modifier = Modifier
                                    .size(44.dp)
                                    .clip(RoundedCornerShape(16.dp))
                                    .background(Color(0xFF4CAF50))
                                    .clickable { onToggle() },
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Check,
                                    contentDescription = "Taken",
                                    tint = Color.White,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        } else {
                            Button(
                                onClick = onToggle,
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFFA726)),
                                shape = RoundedCornerShape(16.dp),
                                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                                modifier = Modifier.height(44.dp)
                            ) {
                                Text("Take", color = Color.White, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DeleteMedicationDrawer(count: Int, onDismiss: () -> Unit, onConfirm: () -> Unit) {
    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = rememberModalBottomSheetState(),
        containerColor = Color.White,
        shape = RoundedCornerShape(topStart = 32.dp, topEnd = 32.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp)
                .padding(bottom = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .background(Color(0xFFFFEBEE)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Default.Delete,
                    contentDescription = null,
                    tint = Color(0xFFEF5350),
                    modifier = Modifier.size(32.dp)
                )
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Text(
                text = "Delete selected schedules?",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1E293B)
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = "This medication schedule will be permanently removed. You can always add them back later.",
                fontSize = 14.sp,
                color = Color(0xFF64748B),
                textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                lineHeight = 20.sp
            )
            
            Spacer(modifier = Modifier.height(32.dp))
            
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedButton(
                    onClick = onDismiss,
                    modifier = Modifier.weight(1f).height(56.dp),
                    shape = RoundedCornerShape(16.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2E8F0))
                ) {
                    Icon(Icons.Default.Close, contentDescription = null, modifier = Modifier.size(18.dp), tint = Color(0xFF1E293B))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Cancel", color = Color(0xFF1E293B), fontWeight = FontWeight.Bold)
                }
                
                Button(
                    onClick = onConfirm,
                    modifier = Modifier.weight(1f).height(56.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEF5350))
                ) {
                    Icon(Icons.Default.Delete, contentDescription = null, modifier = Modifier.size(18.dp), tint = Color.White)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Delete", color = Color.White, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddMedicationDrawer(onDismiss: () -> Unit, onSave: (String, String, List<String>) -> Unit) {
    val context = LocalContext.current
    var name by remember { mutableStateOf("") }
    var dosage by remember { mutableStateOf("") }
    val selectedTimes = remember { mutableStateListOf<String>() }
    var selectedImageUri by remember { mutableStateOf<android.net.Uri?>(null) }

    val photoLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia(),
        onResult = { uri -> 
            if (uri != null) {
                // Take persistent permission for the URI if possible, or just use it
                try {
                    context.contentResolver.takePersistableUriPermission(
                        uri,
                        android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION
                    )
                } catch (e: Exception) {
                    // Ignore if not possible
                }
                selectedImageUri = uri 
            }
        }
    )

    val timePills = listOf(
        "morning" to "AM",
        "midday" to "PM",
        "evening" to "PM",
        "night" to "PM"
    )

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true),
        containerColor = Color.White,
        shape = RoundedCornerShape(topStart = 32.dp, topEnd = 32.dp),
        dragHandle = { BottomSheetDefaults.DragHandle() }
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp)
                .padding(bottom = 32.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Add medication",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1E293B)
                    )
                    Text(
                        text = "We'll add it to today's schedule.",
                        fontSize = 14.sp,
                        color = Color(0xFF64748B),
                        modifier = Modifier.padding(top = 4.dp)
                    )
                }
                IconButton(
                    onClick = onDismiss,
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(Color(0xFFF1F5F9))
                ) {
                    Icon(Icons.Default.Close, contentDescription = "Close", tint = Color(0xFF64748B), modifier = Modifier.size(18.dp))
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Text("NAME", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF64748B), letterSpacing = 1.sp)
            Spacer(modifier = Modifier.height(6.dp))
            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                placeholder = { Text("e.g. Lisinopril") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    unfocusedBorderColor = Color(0xFFE2E8F0),
                    focusedBorderColor = Color(0xFF5C6BC0)
                )
            )
            
            Spacer(modifier = Modifier.height(20.dp))
            
            Text("DOSE", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF64748B), letterSpacing = 1.sp)
            Spacer(modifier = Modifier.height(6.dp))
            OutlinedTextField(
                value = dosage,
                onValueChange = { dosage = it },
                placeholder = { Text("e.g. 10 mg") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    unfocusedBorderColor = Color(0xFFE2E8F0),
                    focusedBorderColor = Color(0xFF5C6BC0)
                )
            )
            
            Spacer(modifier = Modifier.height(20.dp))

            Text("PHOTO (OPTIONAL)", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF64748B), letterSpacing = 1.sp)
            Spacer(modifier = Modifier.height(6.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(100.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(Color.White)
                    .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(16.dp))
                    .clickable { 
                        photoLauncher.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
                    },
                contentAlignment = Alignment.Center
            ) {
                if (selectedImageUri != null) {
                    AsyncImage(
                        model = selectedImageUri,
                        contentDescription = "Selected pill photo",
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                    // Close button to remove photo
                    IconButton(
                        onClick = { selectedImageUri = null },
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(4.dp)
                            .size(24.dp)
                            .background(Color.Black.copy(alpha = 0.5f), CircleShape)
                    ) {
                        Icon(Icons.Default.Close, contentDescription = "Remove photo", tint = Color.White, modifier = Modifier.size(14.dp))
                    }
                } else {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.AddAPhoto, contentDescription = null, tint = Color(0xFF64748B), modifier = Modifier.size(20.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Tap to upload pill photo", color = Color(0xFF64748B), fontSize = 14.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))
            
            Text("WHEN", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF64748B), letterSpacing = 1.sp)
            Spacer(modifier = Modifier.height(6.dp))
            
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                timePills.chunked(2).forEach { row ->
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                        row.forEach { (time, label) ->
                            val isSelected = selectedTimes.contains(time)
                            Surface(
                                onClick = { 
                                    if (isSelected) selectedTimes.remove(time) else selectedTimes.add(time)
                                },
                                modifier = Modifier.weight(1f).height(56.dp),
                                shape = RoundedCornerShape(16.dp),
                                color = if (isSelected) Color(0xFF5C6BC0).copy(alpha = 0.1f) else Color.White,
                                border = androidx.compose.foundation.BorderStroke(
                                    1.dp, 
                                    if (isSelected) Color(0xFF5C6BC0) else Color(0xFFE2E8F0)
                                )
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 16.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = time.replaceFirstChar { it.uppercase() },
                                        color = if (isSelected) Color(0xFF5C6BC0) else Color(0xFF1E293B),
                                        fontWeight = FontWeight.SemiBold,
                                        fontSize = 14.sp
                                    )
                                    Text(
                                        text = label,
                                        color = if (isSelected) Color(0xFF5C6BC0) else Color(0xFF64748B),
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(32.dp))
            
            val canSubmit = name.isNotBlank() && dosage.isNotBlank() && selectedTimes.isNotEmpty()
            Button(
                onClick = { onSave(name, dosage, selectedTimes.toList()) },
                enabled = canSubmit,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFFD1C4E9),
                    contentColor = Color(0xFF5C6BC0),
                    disabledContainerColor = Color(0xFFE2E8F0)
                )
            ) {
                Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Save medication", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}
