package com.memo_app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import org.json.JSONArray
import org.json.JSONException

class NoteWidget : AppWidgetProvider() {
    override fun onUpdate(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    data class Note(val title: String, val content: String, val date: String)

    companion object {
        fun updateAppWidget(
                context: Context,
                appWidgetManager: AppWidgetManager,
                appWidgetId: Int
        ) {
            val views = RemoteViews(context.packageName, R.layout.widget_notes)
            views.removeAllViews(R.id.notes_container)

            val sharedPref = context.getSharedPreferences("NotesWidgetPrefs", Context.MODE_PRIVATE)
            val notesJson = sharedPref.getString("notes_list", "[]")

            val notes = mutableListOf<Note>()
            try {
                val jsonArray = JSONArray(notesJson)
                for (i in 0 until jsonArray.length()) {
                    val noteString = jsonArray.getString(i)
                    val parts = noteString.split("||")
                    if (parts.size == 3) {
                        val note = Note(parts[0], parts[1], parts[2])
                        notes.add(note)
                    }
                }
            } catch (e: JSONException) {
                e.printStackTrace()
            }

            for (note in notes) {
                val noteView = RemoteViews(context.packageName, R.layout.widget_notes_item)
                noteView.setTextViewText(R.id.note_title, note.title)
                noteView.setTextViewText(R.id.note_content, note.content)
                noteView.setTextViewText(R.id.note_date, note.date)
                views.addView(R.id.notes_container, noteView)
            }

            val intent = Intent(context, MainActivity::class.java).apply {
                putExtra("route", "NotePage")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
            
            val pendingIntent = PendingIntent.getActivity(
                context, 0, intent, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
            )
            views.setOnClickPendingIntent(R.id.widget_add_button, pendingIntent)            

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
