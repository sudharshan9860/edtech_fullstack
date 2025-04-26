
from django.contrib import admin
from .models import classes,Subject, Topics, SubTopics, Question_Answers,QuestionWithImage,GapAnalysis
admin.site.register(classes)
admin.site.register(Subject)
admin.site.register(Topics)
admin.site.register(SubTopics)
admin.site.register(Question_Answers)
admin.site.register(QuestionWithImage)
admin.site.register(GapAnalysis)
from django.contrib.sessions.models import Session
from django.contrib import admin
class SessionAdmin(admin.ModelAdmin):
    list_display = ['session_key', 'expire_date', 'get_decoded']

    def get_decoded(self, obj):
        return obj.get_decoded()
    get_decoded.short_description = 'Session Data'
admin.site.register(Session, SessionAdmin)