from django.contrib import admin
from django.urls import path
from Users.views import upload_student_list, logins,hello
urlpatterns = [
    path("upload/",upload_student_list, name='registered-students-api'),
    path("login/",logins, name='login'),    
    path('hello/',hello, name='hello'),
]