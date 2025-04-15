
from django.contrib import admin
from .models import classes,Subject, Topics, SubTopics, Question_Answers,QuestionWithImage
admin.site.register(classes)
admin.site.register(Subject)
admin.site.register(Topics)
admin.site.register(SubTopics)
admin.site.register(Question_Answers)
admin.site.register(QuestionWithImage)