package com.memo_app

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.SharedPreferences
import android.widget.RemoteViews
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class WidgetUpdaterModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "WidgetUpdater"
    }

    @ReactMethod
    fun saveNoteToWidget(noteText: String) {
        val sharedPref: SharedPreferences =
            reactContext.getSharedPreferences("NotesWidgetPrefs", Context.MODE_PRIVATE)
        sharedPref.edit().putString("last_note", noteText).apply()

        val appWidgetManager = AppWidgetManager.getInstance(reactContext)
        val widgetComponent = ComponentName(reactContext, NoteWidget::class.java)
        val ids = appWidgetManager.getAppWidgetIds(widgetComponent)
        val views = RemoteViews(reactContext.packageName, R.layout.widget_notes)
        views.setTextViewText(R.id.note_text, noteText)

        for (id in ids) {
            appWidgetManager.updateAppWidget(id, views)
        }
    }
}
