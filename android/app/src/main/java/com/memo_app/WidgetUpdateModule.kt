package com.memo_app

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.SharedPreferences
import android.widget.RemoteViews
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import org.json.JSONArray
import org.json.JSONException

class WidgetUpdaterModule(private val reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "WidgetUpdater"
    }

    @ReactMethod
    fun saveNotesToWidget(notesJson: String) {
        val sharedPref = reactContext.getSharedPreferences("NotesWidgetPrefs", Context.MODE_PRIVATE)
        sharedPref.edit().putString("notes_list", notesJson).apply()

        val appWidgetManager = AppWidgetManager.getInstance(reactContext)
        val widgetComponent = ComponentName(reactContext, NoteWidget::class.java)
        val ids = appWidgetManager.getAppWidgetIds(widgetComponent)

        for (id in ids) {
            NoteWidget.updateAppWidget(reactContext, appWidgetManager, id)
        }
    }
}
