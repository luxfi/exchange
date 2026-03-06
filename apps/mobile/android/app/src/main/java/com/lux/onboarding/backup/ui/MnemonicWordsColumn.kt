package com.lux.onboarding.backup.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.lux.onboarding.backup.ui.model.MnemonicWordUiState
import com.lux.theme.LuxTheme

/**
 * Component used to display a numbered column of words as part of an overall seed phrase
 */
@Composable
fun MnemonicWordsColumn(
  modifier: Modifier = Modifier,
  words: List<MnemonicWordUiState>,
  shouldShowSmallText: Boolean = false,
) {
  Column(
    modifier = modifier,
    verticalArrangement = Arrangement.spacedBy(LuxTheme.spacing.spacing8),
  ) {
    words.forEach { word ->
      MnemonicWordCell(
        word = word,
        shouldShowSmallText = shouldShowSmallText,
      )
    }
  }
}
