package com.ashl7.designtokens

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.ashl7.designtokens.ui.theme.DesignTokensTheme
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContent {
      var isDarkTheme by rememberSaveable { mutableStateOf(false) }

      DesignTokensTheme(darkTheme = isDarkTheme) {
        LoginScreen(
          isDarkTheme = isDarkTheme,
          onToggleTheme = { isDarkTheme = it }
        )
      }
    }
  }
}

@Composable
fun LoginScreen(
  isDarkTheme: Boolean,
  onToggleTheme: (Boolean) -> Unit
) {
  Surface(
    modifier = Modifier.fillMaxSize(),
    color = MaterialTheme.colorScheme.background
  ) {
    Box(modifier = Modifier.fillMaxSize()) {
      Switch(
        checked = isDarkTheme,
        onCheckedChange = onToggleTheme,
        modifier = Modifier
          .align(Alignment.TopEnd)
          .padding(16.dp)
      )

      Column(
        modifier = Modifier
          .align(Alignment.Center)
          .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
      ) {
        var username by rememberSaveable { mutableStateOf("") }
        var password by rememberSaveable { mutableStateOf("") }
        var isPasswordWrong by rememberSaveable { mutableStateOf(false) }

        Icon(
          painter = painterResource(R.drawable.ic_bank),
          contentDescription = "bank",
          tint = MaterialTheme.colorScheme.primary,
          modifier = Modifier
            .width(150.dp)
            .height(150.dp)
            .align(Alignment.CenterHorizontally)
        )

        Text(
          text = "Log in",
          style = MaterialTheme.typography.titleLarge,
        )

        OutlinedTextField(
          value = username,
          onValueChange = { username = it },
          label = { Text("Username") },
          singleLine = true,
          modifier = Modifier.fillMaxWidth()
        )

        OutlinedTextField(
          value = password,
          onValueChange = { password = it },
          label = { Text("Password") },
          singleLine = true,
          visualTransformation = PasswordVisualTransformation(),
          modifier = Modifier.fillMaxWidth(),
          isError = isPasswordWrong,
        )

        Button(
          onClick = { isPasswordWrong = !isPasswordWrong },
          modifier = Modifier.fillMaxWidth()
        ) {
          Text("Log In")
        }
      }

      Text(
        text = "Droidcon NYC 2025",
        color = MaterialTheme.colorScheme.secondary,
        style = MaterialTheme.typography.labelMedium,
        modifier = Modifier
          .align(Alignment.BottomCenter)
          .padding(16.dp)
      )
    }
  }
}
