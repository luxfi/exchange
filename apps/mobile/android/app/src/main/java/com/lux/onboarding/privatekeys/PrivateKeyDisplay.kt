package com.lux.onboarding.privatekeys

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.mutableStateOf
import android.util.Log
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.tooling.preview.Preview
import com.lux.onboarding.shared.CopyButton
import com.lux.onboarding.shared.CopyButtonIcon
import com.lux.theme.CustomTypography
import com.lux.theme.LuxComponent
import com.lux.theme.LuxTheme

@Composable
fun PrivateKeyDisplay(
  viewModel: PrivateKeyDisplayViewModel,
  address: String,
  onHeightMeasured: (height: Float) -> Unit,
) {
  val privateKey by viewModel.privateKey.collectAsState()


  LaunchedEffect(address) {
    viewModel.setup(address)
  }

  PrivateKeyDisplayContent(
    privateKey,
    onHeightMeasured
  )
}

@Composable
fun PrivateKeyDisplayContent(
  privateKey: String,
  onHeightMeasured: (height: Float) -> Unit,
) {
  val density = LocalDensity.current.density

  Box(
    modifier = Modifier
      .fillMaxWidth()
      .wrapContentHeight(unbounded = true)
      .onSizeChanged { size ->
        with(density) {
          val heightInDp = size.height / density
          onHeightMeasured(heightInDp)
        }
      }
  ) {
    Box(
      modifier = Modifier
        .fillMaxWidth()
        .clip(RoundedCornerShape(LuxTheme.spacing.spacing12))
        .background(LuxTheme.colors.surface3)
        .padding(LuxTheme.spacing.spacing12)

    ) {
      Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
        modifier = Modifier
          .fillMaxWidth()
      ) {
        Text(
          text = privateKey,
          style = LuxTheme.typography.monospace.copy(
            color = LuxTheme.colors.neutral1
          ),
          modifier = Modifier.weight(1f),
        )
        Spacer(modifier = Modifier.width(LuxTheme.spacing.spacing8))
        CopyButtonIcon(
          textToCopy = AnnotatedString(privateKey),
          isSensitive = true
        )
      }
    }
  }
}

@Preview()
@Composable
fun PrivateKeyDisplayContentPreview() {
  LuxTheme {
    PrivateKeyDisplayContent(
      privateKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCprc7GUFxQpp27kTdoEhd0VpR1hwPxRsPCK8f4sEC8iVab+WOOFB4WAM0V7942KwLoFmZpi6G01KYmROklO1YhYvCkOYgBgegT8vJeuaYKlmzBuAcdu4AWWHbeSndxdvqfjeyr6thgNIYqsPLi+Djm1VgCWFLGBMN9DEEEgpiIlQIDAQAB",
      onHeightMeasured = {}
    )
  }
}
