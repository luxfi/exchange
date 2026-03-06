package com.lux.theme

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

@Composable
fun LuxComponent(modifier: Modifier = Modifier, content: @Composable () -> Unit) {
  LuxTheme {
    Surface(modifier = modifier, content = content)
  }
}
