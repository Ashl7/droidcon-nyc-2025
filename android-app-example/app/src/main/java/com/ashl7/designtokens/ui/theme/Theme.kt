package com.ashl7.designtokens.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
  primary = StyleDictionaryColor.colorPrimaryLight,
  secondary = StyleDictionaryColor.colorSecondaryLight,
  tertiary = StyleDictionaryColor.colorTertiaryLight
)

private val DarkColorScheme = darkColorScheme(
  primary = StyleDictionaryColor.colorPrimaryDark,
  secondary = StyleDictionaryColor.colorSecondaryDark,
  tertiary = StyleDictionaryColor.colorTertiaryDark
)

@Composable
fun DesignTokensTheme(
  darkTheme: Boolean = isSystemInDarkTheme(),
  content: @Composable () -> Unit
) {
  val colorScheme = when {
    darkTheme -> DarkColorScheme
    else -> LightColorScheme
  }

  // Color the status bar.
  val view = LocalView.current
  SideEffect {
    val window = (view.context as Activity).window
    window.statusBarColor = colorScheme.primary.toArgb()
    WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = darkTheme
  }

  MaterialTheme(
    colorScheme = colorScheme,
    content = content
  )
}