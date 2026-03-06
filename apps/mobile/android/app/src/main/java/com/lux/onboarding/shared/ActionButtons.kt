package com.lux.onboarding.shared

import androidx.annotation.DrawableRes
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.Icon
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.lux.R
import com.lux.theme.LuxTheme

enum class ActionButtonStatus {
  SUCCESS, NEUTRAL
}

/**
 * Button that calls the action when clicked
 */
@Composable
fun ActionButton(
  modifier: Modifier = Modifier,
  action: () -> Unit,
  text: String,
  status: ActionButtonStatus = ActionButtonStatus.NEUTRAL,
  @DrawableRes iconDrawable: Int? = null,
) {
  val iconColor = when (status) {
    ActionButtonStatus.SUCCESS -> LuxTheme.colors.statusSuccess
    ActionButtonStatus.NEUTRAL -> LuxTheme.colors.neutral2
  }
  val textColor = when (status) {
    ActionButtonStatus.SUCCESS -> LuxTheme.colors.statusSuccess
    ActionButtonStatus.NEUTRAL -> LuxTheme.colors.neutral1
  }

  Box(
    modifier = modifier.shadow(
      10.dp,
      spotColor = LuxTheme.colors.black.copy(alpha = 0.04f),
      shape = LuxTheme.shapes.small
    )
  ) {
    Row(
      verticalAlignment = Alignment.CenterVertically,
      horizontalArrangement = Arrangement.spacedBy(LuxTheme.spacing.spacing4),
      modifier = Modifier
        .clip(shape = LuxTheme.shapes.small)
        .border(1.dp, LuxTheme.colors.surface3, LuxTheme.shapes.small)
        .clickable { action() }
        .background(color = LuxTheme.colors.surface1)
        .padding(
          top = LuxTheme.spacing.spacing8,
          end = LuxTheme.spacing.spacing16,
          bottom = LuxTheme.spacing.spacing8,
          start = if (iconDrawable != null) LuxTheme.spacing.spacing8 else LuxTheme.spacing.spacing16
        )) {
      iconDrawable?.let {
        Icon(
          painter = painterResource(id = it),
          contentDescription = null,
          tint = iconColor,
          modifier = Modifier.size(20.dp)
        )
      }
      Text(
        text = text, color = textColor, style = LuxTheme.typography.buttonLabel4
      )
    }
  }
}

@Composable
fun PasteButton(
  modifier: Modifier = Modifier,
  pasteButtonText: String,
  onPaste: (text: String) -> Unit
) {
  val clipboardManager = LocalClipboardManager.current

  fun onClick() {
    clipboardManager.getText()?.toString()?.let {
      onPaste(it)
    }
  }

  ActionButton(
    action = { onClick() },
    text = pasteButtonText,
    iconDrawable = R.drawable.lux_icon_paste,
    modifier = modifier
  )
}
