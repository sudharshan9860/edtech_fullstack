from django.contrib import admin
from django.urls import path
from Users.views import upload_student_list, logins,hello,get_csrf_token,logout_view
urlpatterns = [
    path("upload/",upload_student_list, name='registered-students-api'),
    path("login/",logins, name='login'),    
    path('hello/',hello, name='hello'),
    path('csrf/', get_csrf_token),
    path('logout/', logout_view, name='logout'),
]