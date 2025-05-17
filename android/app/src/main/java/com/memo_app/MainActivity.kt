package com.memo_app

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "memo_app"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
          DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    val route = intent?.getStringExtra("route")
    if (route != null) {
      val params = Bundle()
      params.putString("screen", route)

      // Transmet les props initiales à React Native
      launchReactApp(params)
    }
  }

  private fun launchReactApp(initialProps: Bundle) {
    // Si tu veux passer des initialProps, tu devrais utiliser ReactActivityDelegate
    // Donc ici c’est un placeholder — la navigation doit plutôt être déclenchée côté JS
  }
}
