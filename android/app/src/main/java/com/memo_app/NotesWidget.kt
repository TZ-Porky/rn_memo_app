package com.memo_app

import android.appwidget.AppWidgetProvider
import android.appwidget.AppWidgetManager
import android.content.Context
import android.widget.RemoteViews
import android.content.Intent
import android.content.SharedPreferences

class NoteWidget : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        val sharedPreferences: SharedPreferences = context.getSharedPreferences("NotesWidgetPrefs", Context.MODE_PRIVATE)
        val noteContent = sharedPreferences.getString("last_note", "Aucune note trouvée")

        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.widget_notes)
            views.setTextViewText(R.id.note_text, noteContent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
