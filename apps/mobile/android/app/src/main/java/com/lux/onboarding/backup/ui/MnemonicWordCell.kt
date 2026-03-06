package com.lux.onboarding.backup.ui

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.relocation.BringIntoViewRequester
import androidx.compose.foundation.relocation.bringIntoViewRequester
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.text.style.TextOverflow
import com.lux.onboarding.backup.ui.model.MnemonicInputStatus
import com.lux.onboarding.backup.ui.model.MnemonicWordUiState
import com.lux.theme.LuxTheme

/**
 * Component used to display a single word as part of an overall seed phrase
 */
@OptIn(ExperimentalFoundationApi::class)
@Composable
fun MnemonicWordCell(
  word: MnemonicWordUiState,
  shouldShowSmallText: Boolean = false,
) {
  val bringIntoViewRequester = remember { BringIntoViewRequester() }

  LaunchedEffect(word.isActive) {
    // When a cell status changes, request to bring it into view in the parent scroll container
    if (word.isActive){
      bringIntoViewRequester.bringIntoView()
    }
  }

  val textStyle =
    if (shouldShowSmallText) LuxTheme.typography.body3 else LuxTheme.typography.body2

  val textColor = when (word.status) {
    MnemonicInputStatus.NO_INPUT -> LuxTheme.colors.neutral3
    MnemonicInputStatus.CORRECT_INPUT -> LuxTheme.colors.neutral1
    MnemonicInputStatus.WRONG_INPUT -> LuxTheme.colors.statusCritical
  }

  Row(modifier = Modifier.bringIntoViewRequester(bringIntoViewRequester)) {
    Text(
      text = "${word.num}",
      color = LuxTheme.colors.neutral2,
      modifier = Modifier.defaultMinSize(minWidth = if (shouldShowSmallText) 14.dp else 16.dp),
      style = textStyle,
    )
    Spacer(modifier = Modifier.width(LuxTheme.spacing.spacing16))
    Text(
      text = word.text,
      style = textStyle,
      color = textColor,
      maxLines = 1,
      overflow = TextOverflow.Ellipsis
    )
  }
}
