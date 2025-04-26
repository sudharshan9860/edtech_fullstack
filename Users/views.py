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



@csrf_exempt
def logins(request):
    print(request.body)
    try:
        import json
        from django.test import RequestFactory

        data = json.loads(request.body)

        # Create a new HttpRequest object with the parsed data
        factory = RequestFactory()
        new_request = factory.post('/login/', data, content_type='application/json')

        token_response = v1.obtain_auth_token(new_request)
        
        # Create a session if it doesn't exist
        if not request.session.exists(request.session.session_key):
            request.session.create()
            
        session_key = request.session.session_key
        print(f"Session key created: {session_key}")
        
        # Store the user ID in the session
        if token_response.status_code == 200:
            # Get the user from the token
            token = token_response.data.get('token', '')
            user = Token.objects.get(key=token).user
            
            # Store user info in the session
            request.session['user_id'] = user.id
            request.session['username'] = user.username
            
            # You can also add session key to response data
            token_response.data['session_key'] = session_key

        print(token_response.status_code)
        token_response.set_cookie('token', token_response.data.get('token', ''), max_age=31622400)
        
        return token_response
    except Exception as exc:
        return Response({"status": "Exception", "description": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
def hello(request):
    return HttpResponse("Hello, world. You're at the polls index.")



