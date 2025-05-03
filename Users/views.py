from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
# from .serializers import StudentTokenObtainPairSerializer, SubjectSerializer, SchoolClassSerializer, createChapterSerializer, ChapterSerializer, InputSerializer, TopicSerializer
from rest_framework.permissions import IsAuthenticated
import pandas as pd
from django.db import IntegrityError
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from Users.models import  School, Student
from myapp.models import classes
from rest_framework.authtoken import views as v1
from rest_framework.authtoken.models import Token

from django.db import transaction
import json
# Create your views here.

@api_view(['POST'])
@csrf_exempt
def upload_student_list(request):
        
    try:
        if request.method == 'POST':
            with transaction.atomic():
                
                if 'student_list' in request.FILES:
                    file = request.FILES['student_list']
                    df = pd.read_csv(file)

                    school_name = request.POST.get('School_Name')
                    school_code = request.POST.get('School_Code')
                    # print(School.objects.get(name=school_name, code=school_code),"========---------data-----======")
                    # Retrieve or create the school
                    
                    # Iterate over DataFrame rows
                    for _, row in df.iterrows():
                        student_name = row['Student_Name']
                        roll_number = row['Roll_Number']
                        contact = row['Contact']
                        class_name = row['Class']
                        try:
                            all_classes = classes.objects.filter()
                        except:
                            return Response({'status':"failed","description":"classes matching query does't exist"})
                       
                        school, created = School.objects.get_or_create(name=school_name, code=school_code)
                        school.classes.set(all_classes)
                        print(school)  
                        try:
                            class_obj = classes.objects.get(class_name=class_name)
                        except classes.DoesNotExist:
                            class_obj = None   
                        print(class_obj)            
                        if class_obj:
                            student_exists = Student.objects.filter(roll_number=roll_number, school=school, class_name=class_obj ).exists()
                        else:
                            student_exists = False 
                        email=str(class_name) + str(school_code) + str(roll_number) + "@gmail.com"
                        
                        if not student_exists:
                            
                            Student.objects.create_user(
                                fullname=student_name,
                                roll_number=roll_number,
                                phone_number=contact,
                                username=f"{class_name}{school_code}{roll_number}",
                                password=f"{roll_number}{school_code}",
                                email = email,
                                school=school,
                                class_name=class_obj
                            )
                            try:
                                
                                acc=Student.objects.get(email=email)
                                user_token=Token.objects.create(user=acc)
                                print(user_token)
                            except:
                                return Response({"status":"failed","description":"Email address not valid"})
                        else:
                            print(f"Student with roll number {roll_number} already exists in the school.")
                
                    return Response({"status": "Students Registered Successfully from file"})

    except IntegrityError as e:
        return Response({"status": "failed", "error": str(e)}, status=400)
    except Exception as e:
        return Response({"status": "failed", "error": str(e)}, status=400)



from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

from django.contrib.auth import authenticate, login
from django.contrib.sessions.models import Session
from django.utils import timezone

@api_view(['POST'])
@permission_classes([AllowAny])
def logins(request):
    try:
        data = request.data
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            # ✅ Log the user in (crucial for session management)
            login(request, user)

            # 🔎 Get all sessions linked to this user
            user_sessions = []
            all_sessions = Session.objects.filter(expire_date__gte=timezone.now())

            for session in all_sessions:
                session_data = session.get_decoded()
                if str(session_data.get('_auth_user_id')) == str(user.id):
                    user_sessions.append(session)

            # 🧹 If more than 2 sessions, delete the oldest
            if len(user_sessions) >= 2:
                oldest_session = sorted(user_sessions, key=lambda s: s.expire_date)[0]
                oldest_session.delete()
                print(f"Deleted oldest session for user {user.username}")

            # 🔑 Get or create token
            token, created = Token.objects.get_or_create(user=user)

            # 🔐 Ensure session is created
            if not request.session.exists(request.session.session_key):
                request.session.create()

            # Store user info in session
            request.session['user_id'] = user.id
            request.session['username'] = user.username

            # 📤 Build response with token and session info
            response = Response({
                "status": "Success",
                "token": token.key,
                "session_key": request.session.session_key
            }, status=status.HTTP_200_OK)

            # 🍪 Set token and sessionid cookies (customize max_age as needed)
            max_age = 60 * 60 * 24 * 365  # 1 year
            response.set_cookie('token', token.key, max_age=max_age, httponly=True, secure=False, samesite='Lax')
            response.set_cookie('sessionid', request.session.session_key, max_age=max_age, httponly=True, secure=False, samesite='Lax')

            return response

        else:
            return Response({
                "status": "Unauthorized",
                "description": "Invalid credentials"
            }, status=status.HTTP_401_UNAUTHORIZED)

    except Exception as exc:
        return Response({
            "status": "Exception",
            "description": str(exc)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def hello(request):
    return HttpResponse("Hello, world. You're at the polls index.")



