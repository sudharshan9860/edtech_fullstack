import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, Sector, LineChart, Line, Area, AreaChart, ReferenceLine
} from 'recharts';

import './EnhancedTeacherDash.css';
import axiosInstance from '../api/axiosInstance';
import TeacherDashboard from './TeacherDashboard';
import StudentDash from './StudentDash';
import QuickExerciseComponent from './QuickExerciseComponent';
// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const ERROR_COLORS = {
  Conceptual: '#ef4444',
  Computational: '#f97316', 
  Careless: '#eab308',
  'No Error': '#22c55e'
};

// Mock data for different classes (6th to 12th)
const classesData = {
  1: {
    id: 1,
    name: "Class 12th",
    students: [
      { id: 1, name: "Vikram Singh", class: "12th", efficiency: 88 },
      { id: 2, name: "Meera Patel", class: "12th", efficiency: 92 },
      { id: 3, name: "Sanjay Kumar", class: "12th", efficiency: 78 },
      { id: 4, name: "Priya Sharma", class: "12th", efficiency: 73 },
      { id: 5, name: "Ahmed Khan", class: "12th", efficiency: 85 },
      { id: 6, name: "Rahul Verma", class: "12th", efficiency: 55 }
    ],
    analytics: {
      weeklyEfficiency: [
        { week: 'May 01 - May 01', date: 'May 01', efficiency: 76, tasksCompleted: 45, avgTime: 2.1 },
        { week: 'May 08 - May 08', date: 'May 08', efficiency: 82, tasksCompleted: 52, avgTime: 1.8 },
        { week: 'May 15 - May 15', date: 'May 15', efficiency: 84, tasksCompleted: 58, avgTime: 1.7 },
        { week: 'May 22 - May 22', date: 'May 22', efficiency: 78, tasksCompleted: 48, avgTime: 2.2 },
        { week: 'May 29 - May 29', date: 'May 29', efficiency: 74, tasksCompleted: 42, avgTime: 2.5 }
      ],
      studentProgressComparison: [
        { student: 'Rahul Verma', efficiencyImprovement: 10.7, regularScoreImprovement: -13.5, currentEfficiency: 82 },
        { student: 'Ahmed Khan', efficiencyImprovement: 14.5, regularScoreImprovement: 0, currentEfficiency: 85 },
        { student: 'Sanjay Kumar', efficiencyImprovement: 13.5, regularScoreImprovement: -0.5, currentEfficiency: 78 },
        { student: 'Priya Sharma', efficiencyImprovement: 7.8, regularScoreImprovement: -1.6, currentEfficiency: 73 },
        { student: 'Meera Patel', efficiencyImprovement: 9.2, regularScoreImprovement: -1.8, currentEfficiency: 71 },
        { student: 'Vikram Singh', efficiencyImprovement: 16.0, regularScoreImprovement: 0, currentEfficiency: 88 }
      ],
      learningGapAnalysis: [
        { topic: '3D Geometry', 'Students with High Gap': 15, 'Students with Medium Gap': 25, 'Students with Low Gap': 30, 'Students with No Gap': 30, totalStudents: 50 },
        { topic: 'Applications of Derivatives', 'Students with High Gap': 20, 'Students with Medium Gap': 30, 'Students with Low Gap': 25, 'Students with No Gap': 25, totalStudents: 50 },
        { topic: 'Calculus', 'Students with High Gap': 35, 'Students with Medium Gap': 25, 'Students with Low Gap': 20, 'Students with No Gap': 20, totalStudents: 50 },
        { topic: 'Determinants', 'Students with High Gap': 12, 'Students with Medium Gap': 28, 'Students with Low Gap': 30, 'Students with No Gap': 30, totalStudents: 50 },
        { topic: 'Differential Equations', 'Students with High Gap': 18, 'Students with Medium Gap': 22, 'Students with Low Gap': 25, 'Students with No Gap': 35, totalStudents: 50 },
        { topic: 'Integrals', 'Students with High Gap': 25, 'Students with Medium Gap': 25, 'Students with Low Gap': 25, 'Students with No Gap': 25, totalStudents: 50 },
        { topic: 'Limits', 'Students with High Gap': 8, 'Students with Medium Gap': 15, 'Students with Low Gap': 27, 'Students with No Gap': 50, totalStudents: 50 }
      ]
    }
  },
  2: {
    id: 2,
    name: "Class 11th",
    students: [
      { id: 7, name: "Arjun Reddy", class: "11th", efficiency: 82 },
      { id: 8, name: "Kavya Singh", class: "11th", efficiency: 88 },
      { id: 9, name: "Rohan Gupta", class: "11th", efficiency: 75 },
      { id: 10, name: "Ananya Sharma", class: "11th", efficiency: 90 },
      { id: 11, name: "Karan Joshi", class: "11th", efficiency: 68 },
      { id: 12, name: "Neha Agarwal", class: "11th", efficiency: 85 }
    ],
    analytics: {
      weeklyEfficiency: [
        { week: 'May 01 - May 01', date: 'May 01', efficiency: 72, tasksCompleted: 38, avgTime: 2.3 },
        { week: 'May 08 - May 08', date: 'May 08', efficiency: 78, tasksCompleted: 44, avgTime: 2.0 },
        { week: 'May 15 - May 15', date: 'May 15', efficiency: 80, tasksCompleted: 48, avgTime: 1.9 },
        { week: 'May 22 - May 22', date: 'May 22', efficiency: 75, tasksCompleted: 42, avgTime: 2.1 },
        { week: 'May 29 - May 29', date: 'May 29', efficiency: 79, tasksCompleted: 46, avgTime: 2.0 }
      ],
      studentProgressComparison: [
        { student: 'Arjun Reddy', efficiencyImprovement: 12.5, regularScoreImprovement: -8.2, currentEfficiency: 82 },
        { student: 'Kavya Singh', efficiencyImprovement: 18.3, regularScoreImprovement: 2.1, currentEfficiency: 88 },
        { student: 'Rohan Gupta', efficiencyImprovement: 8.7, regularScoreImprovement: -5.3, currentEfficiency: 75 },
        { student: 'Ananya Sharma', efficiencyImprovement: 15.2, regularScoreImprovement: 3.8, currentEfficiency: 90 },
        { student: 'Karan Joshi', efficiencyImprovement: 6.9, regularScoreImprovement: -12.1, currentEfficiency: 68 },
        { student: 'Neha Agarwal', efficiencyImprovement: 11.4, regularScoreImprovement: 1.5, currentEfficiency: 85 }
      ],
      learningGapAnalysis: [
        { topic: 'Trigonometry', 'Students with High Gap': 20, 'Students with Medium Gap': 30, 'Students with Low Gap': 25, 'Students with No Gap': 25, totalStudents: 45 },
        { topic: 'Sets and Functions', 'Students with High Gap': 15, 'Students with Medium Gap': 25, 'Students with Low Gap': 30, 'Students with No Gap': 30, totalStudents: 45 },
        { topic: 'Coordinate Geometry', 'Students with High Gap': 25, 'Students with Medium Gap': 25, 'Students with Low Gap': 25, 'Students with No Gap': 25, totalStudents: 45 },
        { topic: 'Limits and Derivatives', 'Students with High Gap': 30, 'Students with Medium Gap': 25, 'Students with Low Gap': 25, 'Students with No Gap': 20, totalStudents: 45 }
      ]
    }
  },
  3: {
    id: 3,
    name: "Class 10th",
    students: [
      { id: 13, name: "Aarav Kumar", class: "10th", efficiency: 79 },
      { id: 14, name: "Ishita Patel", class: "10th", efficiency: 86 },
      { id: 15, name: "Dev Sharma", class: "10th", efficiency: 72 },
      { id: 16, name: "Riya Singh", class: "10th", efficiency: 83 },
      { id: 17, name: "Aditya Jain", class: "10th", efficiency: 77 },
      { id: 18, name: "Sneha Reddy", class: "10th", efficiency: 81 }
    ],
    analytics: {
      weeklyEfficiency: [
        { week: 'May 01 - May 01', date: 'May 01', efficiency: 74, tasksCompleted: 40, avgTime: 2.2 },
        { week: 'May 08 - May 08', date: 'May 08', efficiency: 79, tasksCompleted: 45, avgTime: 1.9 },
        { week: 'May 15 - May 15', date: 'May 15', efficiency: 82, tasksCompleted: 50, avgTime: 1.8 },
        { week: 'May 22 - May 22', date: 'May 22', efficiency: 77, tasksCompleted: 43, avgTime: 2.0 },
        { week: 'May 29 - May 29', date: 'May 29', efficiency: 80, tasksCompleted: 47, avgTime: 1.9 }
      ],
      studentProgressComparison: [
        { student: 'Aarav Kumar', efficiencyImprovement: 9.8, regularScoreImprovement: -6.7, currentEfficiency: 79 },
        { student: 'Ishita Patel', efficiencyImprovement: 14.2, regularScoreImprovement: 1.8, currentEfficiency: 86 },
        { student: 'Dev Sharma', efficiencyImprovement: 7.5, regularScoreImprovement: -9.3, currentEfficiency: 72 },
        { student: 'Riya Singh', efficiencyImprovement: 12.1, regularScoreImprovement: 0.5, currentEfficiency: 83 },
        { student: 'Aditya Jain', efficiencyImprovement: 8.9, regularScoreImprovement: -4.2, currentEfficiency: 77 },
        { student: 'Sneha Reddy', efficiencyImprovement: 11.3, regularScoreImprovement: 2.1, currentEfficiency: 81 }
      ],
      learningGapAnalysis: [
        { topic: 'Real Numbers', 'Students with High Gap': 18, 'Students with Medium Gap': 27, 'Students with Low Gap': 25, 'Students with No Gap': 30, totalStudents: 40 },
        { topic: 'Polynomials', 'Students with High Gap': 22, 'Students with Medium Gap': 23, 'Students with Low Gap': 25, 'Students with No Gap': 30, totalStudents: 40 },
        { topic: 'Coordinate Geometry', 'Students with High Gap': 25, 'Students with Medium Gap': 25, 'Students with Low Gap': 25, 'Students with No Gap': 25, totalStudents: 40 },
        { topic: 'Triangles', 'Students with High Gap': 20, 'Students with Medium Gap': 30, 'Students with Low Gap': 25, 'Students with No Gap': 25, totalStudents: 40 }
      ]
    }
  },
  4: {
    id: 4,
    name: "Class 9th",
    students: [
      { id: 19, name: "Harsh Patel", class: "9th", efficiency: 74 },
      { id: 20, name: "Pooja Sharma", class: "9th", efficiency: 81 },
      { id: 21, name: "Raj Kumar", class: "9th", efficiency: 68 },
      { id: 22, name: "Swati Singh", class: "9th", efficiency: 85 },
      { id: 23, name: "Varun Gupta", class: "9th", efficiency: 72 },
      { id: 24, name: "Priya Joshi", class: "9th", efficiency: 78 }
    ],
    analytics: {
      weeklyEfficiency: [
        { week: 'May 01 - May 01', date: 'May 01', efficiency: 70, tasksCompleted: 35, avgTime: 2.4 },
        { week: 'May 08 - May 08', date: 'May 08', efficiency: 75, tasksCompleted: 40, avgTime: 2.1 },
        { week: 'May 15 - May 15', date: 'May 15', efficiency: 78, tasksCompleted: 43, avgTime: 2.0 },
        { week: 'May 22 - May 22', date: 'May 22', efficiency: 73, tasksCompleted: 38, avgTime: 2.2 },
        { week: 'May 29 - May 29', date: 'May 29', efficiency: 76, tasksCompleted: 41, avgTime: 2.1 }
      ],
      studentProgressComparison: [
        { student: 'Harsh Patel', efficiencyImprovement: 8.5, regularScoreImprovement: -7.8, currentEfficiency: 74 },
        { student: 'Pooja Sharma', efficiencyImprovement: 12.3, regularScoreImprovement: 1.2, currentEfficiency: 81 },
        { student: 'Raj Kumar', efficiencyImprovement: 6.7, regularScoreImprovement: -11.5, currentEfficiency: 68 },
        { student: 'Swati Singh', efficiencyImprovement: 15.8, regularScoreImprovement: 3.2, currentEfficiency: 85 },
        { student: 'Varun Gupta', efficiencyImprovement: 7.9, regularScoreImprovement: -5.1, currentEfficiency: 72 },
        { student: 'Priya Joshi', efficiencyImprovement: 10.1, regularScoreImprovement: 0.8, currentEfficiency: 78 }
      ],
      learningGapAnalysis: [
        { topic: 'Number Systems', 'Students with High Gap': 20, 'Students with Medium Gap': 25, 'Students with Low Gap': 25, 'Students with No Gap': 30, totalStudents: 35 },
        { topic: 'Polynomials', 'Students with High Gap': 25, 'Students with Medium Gap': 25, 'Students with Low Gap': 25, 'Students with No Gap': 25, totalStudents: 35 },
        { topic: 'Coordinate Geometry', 'Students with High Gap': 30, 'Students with Medium Gap': 25, 'Students with Low Gap': 25, 'Students with No Gap': 20, totalStudents: 35 },
        { topic: 'Linear Equations', 'Students with High Gap': 22, 'Students with Medium Gap': 28, 'Students with Low Gap': 25, 'Students with No Gap': 25, totalStudents: 35 }
      ]
    }
  },
  5: {
    id: 5,
    name: "Class 8th",
    students: [
      { id: 25, name: "Aryan Singh", class: "8th", efficiency: 71 },
      { id: 26, name: "Diya Patel", class: "8th", efficiency: 83 },
      { id: 27, name: "Kiran Kumar", class: "8th", efficiency: 66 },
      { id: 28, name: "Sakshi Sharma", class: "8th", efficiency: 79 },
      { id: 29, name: "Rohit Gupta", class: "8th", efficiency: 74 },
      { id: 30, name: "Tanvi Joshi", class: "8th", efficiency: 80 }
    ],
    analytics: {
      weeklyEfficiency: [
        { week: 'May 01 - May 01', date: 'May 01', efficiency: 68, tasksCompleted: 32, avgTime: 2.5 },
        { week: 'May 08 - May 08', date: 'May 08', efficiency: 73, tasksCompleted: 37, avgTime: 2.2 },
        { week: 'May 15 - May 15', date: 'May 15', efficiency: 76, tasksCompleted: 40, avgTime: 2.1 },
        { week: 'May 22 - May 22', date: 'May 22', efficiency: 71, tasksCompleted: 35, avgTime: 2.3 },
        { week: 'May 29 - May 29', date: 'May 29', efficiency: 74, tasksCompleted: 38, avgTime: 2.2 }
      ],
      studentProgressComparison: [
        { student: 'Aryan Singh', efficiencyImprovement: 7.8, regularScoreImprovement: -8.9, currentEfficiency: 71 },
        { student: 'Diya Patel', efficiencyImprovement: 13.5, regularScoreImprovement: 2.3, currentEfficiency: 83 },
        { student: 'Kiran Kumar', efficiencyImprovement: 5.2, regularScoreImprovement: -13.2, currentEfficiency: 66 },
        { student: 'Sakshi Sharma', efficiencyImprovement: 11.8, regularScoreImprovement: 1.5, currentEfficiency: 79 },
        { student: 'Rohit Gupta', efficiencyImprovement: 8.9, regularScoreImprovement: -6.1, currentEfficiency: 74 },
        { student: 'Tanvi Joshi', efficiencyImprovement: 12.1, regularScoreImprovement: 2.8, currentEfficiency: 80 }
      ],
      learningGapAnalysis: [
        { topic: 'Rational Numbers', 'Students with High Gap': 25, 'Students with Medium Gap': 25, 'Students with Low Gap': 25, 'Students with No Gap': 25, totalStudents: 32 },
        { topic: 'Linear Equations', 'Students with High Gap': 20, 'Students with Medium Gap': 30, 'Students with Low Gap': 25, 'Students with No Gap': 25, totalStudents: 32 },
        { topic: 'Quadrilaterals', 'Students with High Gap': 15, 'Students with Medium Gap': 25, 'Students with Low Gap': 30, 'Students with No Gap': 30, totalStudents: 32 },
        { topic: 'Data Handling', 'Students with High Gap': 28, 'Students with Medium Gap': 22, 'Students with Low Gap': 25, 'Students with No Gap': 25, totalStudents: 32 }
      ]
    }
  },
  6: {
    id: 6,
    name: "Class 7th",
    students: [
      { id: 31, name: "Vivek Sharma", class: "7th", efficiency: 69 },
      { id: 32, name: "Nisha Patel", class: "7th", efficiency: 76 },
      { id: 33, name: "Gaurav Singh", class: "7th", efficiency: 63 },
      { id: 34, name: "Kavita Kumar", class: "7th", efficiency: 82 },
      { id: 35, name: "Saurabh Gupta", class: "7th", efficiency: 71 },
      { id: 36, name: "Megha Joshi", class: "7th", efficiency: 78 }
    ],
    analytics: {
      weeklyEfficiency: [
        { week: 'May 01 - May 01', date: 'May 01', efficiency: 65, tasksCompleted: 28, avgTime: 2.7 },
        { week: 'May 08 - May 08', date: 'May 08', efficiency: 70, tasksCompleted: 33, avgTime: 2.4 },
        { week: 'May 15 - May 15', date: 'May 15', efficiency: 73, tasksCompleted: 36, avgTime: 2.3 },
        { week: 'May 22 - May 22', date: 'May 22', efficiency: 68, tasksCompleted: 31, avgTime: 2.5 },
        { week: 'May 29 - May 29', date: 'May 29', efficiency: 71, tasksCompleted: 34, avgTime: 2.4 }
      ],
      studentProgressComparison: [
        { student: 'Vivek Sharma', efficiencyImprovement: 6.9, regularScoreImprovement: -9.8, currentEfficiency: 69 },
        { student: 'Nisha Patel', efficiencyImprovement: 11.2, regularScoreImprovement: 0.8, currentEfficiency: 76 },
        { student: 'Gaurav Singh', efficiencyImprovement: 4.5, regularScoreImprovement: -14.2, currentEfficiency: 63 },
        { student: 'Kavita Kumar', efficiencyImprovement: 14.8, regularScoreImprovement: 3.5, currentEfficiency: 82 },
        { student: 'Saurabh Gupta', efficiencyImprovement: 7.1, regularScoreImprovement: -7.2, currentEfficiency: 71 },
        { student: 'Megha Joshi', efficiencyImprovement: 9.8, regularScoreImprovement: 1.2, currentEfficiency: 78 }
      ],
      learningGapAnalysis: [
        { topic: 'Integers', 'Students with High Gap': 22, 'Students with Medium Gap': 28, 'Students with Low Gap': 25, 'Students with No Gap': 25, totalStudents: 28 },
        { topic: 'Fractions and Decimals', 'Students with High Gap': 25, 'Students with Medium Gap': 25, 'Students with Low Gap': 25, 'Students with No Gap': 25, totalStudents: 28 },
        { topic: 'Data Handling', 'Students with High Gap': 18, 'Students with Medium Gap': 27, 'Students with Low Gap': 25, 'Students with No Gap': 30, totalStudents: 28 },
        { topic: 'Simple Equations', 'Students with High Gap': 30, 'Students with Medium Gap': 25, 'Students with Low Gap': 25, 'Students with No Gap': 20, totalStudents: 28 }
      ]
    }
  },
  7: {
    id: 7,
    name: "Class 6th",
    students: [
      { id: 37, name: "Ravi Mehta", class: "6th", efficiency: 65 },
      { id: 38, name: "Sita Agarwal", class: "6th", efficiency: 72 },
      { id: 39, name: "Akash Yadav", class: "6th", efficiency: 58 },
      { id: 40, name: "Priyanka Das", class: "6th", efficiency: 78 },
      { id: 41, name: "Nikhil Jain", class: "6th", efficiency: 67 },
      { id: 42, name: "Deepika Roy", class: "6th", efficiency: 74 }
    ],
    analytics: {
      weeklyEfficiency: [
        { week: 'May 01 - May 01', date: 'May 01', efficiency: 62, tasksCompleted: 25, avgTime: 2.8 },
        { week: 'May 08 - May 08', date: 'May 08', efficiency: 67, tasksCompleted: 30, avgTime: 2.5 },
        { week: 'May 15 - May 15', date: 'May 15', efficiency: 70, tasksCompleted: 33, avgTime: 2.4 },
        { week: 'May 22 - May 22', date: 'May 22', efficiency: 65, tasksCompleted: 28, avgTime: 2.6 },
        { week: 'May 29 - May 29', date: 'May 29', efficiency: 68, tasksCompleted: 31, avgTime: 2.5 }
      ],
      studentProgressComparison: [
        { student: 'Ravi Mehta', efficiencyImprovement: 5.8, regularScoreImprovement: -10.5, currentEfficiency: 65 },
        { student: 'Sita Agarwal', efficiencyImprovement: 9.2, regularScoreImprovement: 0.5, currentEfficiency: 72 },
        { student: 'Akash Yadav', efficiencyImprovement: 3.5, regularScoreImprovement: -15.8, currentEfficiency: 58 },
        { student: 'Priyanka Das', efficiencyImprovement: 12.8, regularScoreImprovement: 2.8, currentEfficiency: 78 },
        { student: 'Nikhil Jain', efficiencyImprovement: 6.1, regularScoreImprovement: -8.2, currentEfficiency: 67 },
        { student: 'Deepika Roy', efficiencyImprovement: 8.8, regularScoreImprovement: 0.8, currentEfficiency: 74 }
      ],
      learningGapAnalysis: [
        { topic: 'Whole Numbers', 'Students with High Gap': 20, 'Students with Medium Gap': 25, 'Students with Low Gap': 25, 'Students with No Gap': 30, totalStudents: 25 },
        { topic: 'Playing with Numbers', 'Students with High Gap': 25, 'Students with Medium Gap': 25, 'Students with Low Gap': 25, 'Students with No Gap': 25, totalStudents: 25 },
        { topic: 'Basic Geometrical Ideas', 'Students with High Gap': 18, 'Students with Medium Gap': 27, 'Students with Low Gap': 25, 'Students with No Gap': 30, totalStudents: 25 },
        { topic: 'Integers', 'Students with High Gap': 30, 'Students with Medium Gap': 25, 'Students with Low Gap': 25, 'Students with No Gap': 20, totalStudents: 25 }
      ]
    }
  }
};

// Individual student performance data generator
const generateStudentData = (studentName, classId) => {
  const baseEfficiency = Math.floor(Math.random() * 30) + 60; // 60-90%
  
  return {
    // Weekly Efficiency Progress
    weeklyEfficiency: [
      { week: 'May 01 - May 01', efficiency: baseEfficiency - 5 + Math.random() * 10 },
      { week: 'May 08 - May 08', efficiency: baseEfficiency - 3 + Math.random() * 10 },
      { week: 'May 15 - May 15', efficiency: baseEfficiency + Math.random() * 10 },
      { week: 'May 22 - May 22', efficiency: baseEfficiency - 2 + Math.random() * 10 },
      { week: 'May 29 - May 29', efficiency: baseEfficiency + 2 + Math.random() * 8 }
    ],
    
    // Error Type Analysis
    errorAnalysis: [
      { week: 'May 01 - May 01', Conceptual: 80, Computational: 15, Careless: 5, 'No Error': 20 },
      { week: 'May 08 - May 08', Conceptual: 75, Computational: 18, Careless: 7, 'No Error': 25 },
      { week: 'May 15 - May 15', Conceptual: 60, Computational: 20, Careless: 5, 'No Error': 40 },
      { week: 'May 22 - May 22', Conceptual: 85, Computational: 10, Careless: 5, 'No Error': 18 },
      { week: 'May 29 - May 29', Conceptual: 70, Computational: 15, Careless: 8, 'No Error': 38 }
    ],
    
    // Chapter-wise Performance Over Time
    chapterPerformance: [
      { week: 'Week 1', 'Chapter 1': 90, 'Chapter 2': 67, 'Chapter 3': 70, 'Chapter 4': 85, 'Chapter 5': 88, 'Chapter 6': 93, 'Chapter 7': 80, 'Chapter 8': 75, 'Chapter 9': 70, overallAverage: 78 },
      { week: 'Week 2', 'Chapter 1': 92, 'Chapter 2': 70, 'Chapter 3': 72, 'Chapter 4': 87, 'Chapter 5': 90, 'Chapter 6': 95, 'Chapter 7': 82, 'Chapter 8': 77, 'Chapter 9': 72, overallAverage: 80 },
      { week: 'Week 3', 'Chapter 1': 94, 'Chapter 2': 68, 'Chapter 3': 74, 'Chapter 4': 89, 'Chapter 5': 92, 'Chapter 6': 96, 'Chapter 7': 84, 'Chapter 8': 79, 'Chapter 9': 74, overallAverage: 82 },
      { week: 'Week 4', 'Chapter 1': 96, 'Chapter 2': 65, 'Chapter 3': 76, 'Chapter 4': 91, 'Chapter 5': 94, 'Chapter 6': 98, 'Chapter 7': 86, 'Chapter 8': 81, 'Chapter 9': 76, overallAverage: 84 },
      { week: 'Week 5', 'Chapter 1': 98, 'Chapter 2': 62, 'Chapter 3': 78, 'Chapter 4': 93, 'Chapter 5': 96, 'Chapter 6': 100, 'Chapter 7': 88, 'Chapter 8': 83, 'Chapter 9': 78, overallAverage: 86 }
    ]
  };
};

const EnhancedTeacherDash = () => {
  const [selectedClass, setSelectedClass] = useState(classesData[1]);
  const [activeTab, setActiveTab] = useState('class');
  const [showAIReport, setShowAIReport] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState('Matrices');
  const [studentData, setStudentData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassForStudents, setSelectedClassForStudents] = useState(1);
  const [studentDetails, setStudentDetails] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // useEffect(async () => {
  //   const response = await axiosInstance.get('/teacher-dashboard/');
  //   console.log('teacher-data',response.data)
  // }, []);

  // Get analytics data for selected class
  const getAnalyticsData = () => {
    return selectedClass.analytics;
  };

  // Handle student selection and generate their data
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    const data = generateStudentData(student.name, selectedClass.id);
    setStudentData(data);
  };

  const handleAssignmentSubmit = async (assignment, mode) => {
    try {
      // Choose endpoint based on mode
      const endpoint = mode === "classwork" ? '/add-classwork/' : '/add-homework/';
      
      const response = await axiosInstance.post(endpoint, assignment);
      // console.log('Assignment created:', response.data);
      
      setAssignments(prev => [...prev, response.data]);
    } catch (error) {
      console.error(`Error creating ${mode || 'homework'}:`, error);
    }
  };
  

  // Custom tooltip for student progress comparison
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const efficiencyValue = payload.find(p => p.dataKey === 'efficiencyImprovement')?.value;
      const regularValue = payload.find(p => p.dataKey === 'regularScoreImprovement')?.value;
      
      return (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          <p style={{ margin: '4px 0', color: '#22c55e' }}>
            Efficiency Improvement: {efficiencyValue}%
          </p>
          <p style={{ margin: '4px 0', color: '#ef4444' }}>
            Regular Score Improvement: {regularValue}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Render class sidebar
  const renderClassSidebar = () => {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        height: 'fit-content',
        minHeight: '400px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
          📚 Classes
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.values(classesData).map((classItem) => (
            <div
              key={classItem.id}
              onClick={() => {
                setSelectedClass(classItem);
                setSelectedStudent(null);
                setStudentData(null);
              }}
              style={{
                padding: '16px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: selectedClass.id === classItem.id ? '#e0f2fe' : '#f8fafc',
                border: selectedClass.id === classItem.id ? '2px solid #0277bd' : '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                transform: selectedClass.id === classItem.id ? 'translateY(-2px)' : 'none',
                boxShadow: selectedClass.id === classItem.id ? '0 4px 8px rgba(2,119,189,0.2)' : '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937' }}>
                {classItem.name}
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                {classItem.students.length} students
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render student progress comparison chart
  const renderStudentProgressComparison = () => {
    const analyticsData = getAnalyticsData();
    
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📊 Student Progress Comparison
          </h3>
          <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
            Efficiency and Regular Score Improvement by Student - {selectedClass.name}
          </p>
        </div>
        <div style={{height: '450px'}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={analyticsData.studentProgressComparison}
              margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="student" 
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                fontSize={12}
              />
              <YAxis 
                domain={[-20, 20]}
                label={{ value: 'Improvement (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="efficiencyImprovement" fill="#22c55e" name="Efficiency Improvement" radius={[4, 4, 0, 0]} />
              <Bar dataKey="regularScoreImprovement" fill="#ef4444" name="Regular Score Improvement" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Render learning gap analysis
  const renderLearningGapAnalysis = () => {
    const analyticsData = getAnalyticsData();
    
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🎯 Class-wide Learning Gap Analysis
          </h3>
          <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
            Percentage of Students with Learning Gaps by Topic - {selectedClass.name}
          </p>
        </div>
        <div style={{height: '600px'}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={analyticsData.learningGapAnalysis}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="topic" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                fontSize={12}
              />
              <YAxis 
                label={{ value: 'Percentage of Students (%)', angle: -90, position: 'insideLeft' }}
                domain={[0, 100]}
              />
              <Tooltip 
                formatter={(value, name) => [`${value}%`, name]}
                labelFormatter={(label) => `Topic: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="Students with High Gap" 
                stackId="a" 
                fill="#dc2626" 
                name="High Gap (Critical)"
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="Students with Medium Gap" 
                stackId="a" 
                fill="#f59e0b" 
                name="Medium Gap (Moderate)"
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="Students with Low Gap" 
                stackId="a" 
                fill="#eab308" 
                name="Low Gap (Minor)"
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="Students with No Gap" 
                stackId="a" 
                fill="#22c55e" 
                name="No Gap (Proficient)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Learning Gap Analysis Legend */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          fontSize: '13px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '14px', height: '14px', backgroundColor: '#dc2626', borderRadius: '2px' }}></div>
              <span><strong>High Gap (Critical)</strong> - Needs immediate attention</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '14px', height: '14px', backgroundColor: '#f59e0b', borderRadius: '2px' }}></div>
              <span><strong>Medium Gap (Moderate)</strong> - Requires support</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '14px', height: '14px', backgroundColor: '#eab308', borderRadius: '2px' }}></div>
              <span><strong>Low Gap (Minor)</strong> - Monitor progress</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '14px', height: '14px', backgroundColor: '#22c55e', borderRadius: '2px' }}></div>
              <span><strong>No Gap (Proficient)</strong> - On track</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render chapter-wise performance analysis
  const renderChapterPerformance = () => {
    // Generate chapter performance data for the selected class
    const chapterPerformanceData = [
      { term: 'Term 1', 'Vikram Singh': 78, 'Meera Patel': 85, 'Sanjay Kumar': 62, 'Priya Sharma': 55, 'Ahmed Khan': 68, 'Rahul Verma': 76, 'Class Average': 71 },
      { term: 'Term 2', 'Vikram Singh': 75, 'Meera Patel': 88, 'Sanjay Kumar': 65, 'Priya Sharma': 60, 'Ahmed Khan': 72, 'Rahul Verma': 74, 'Class Average': 73 },
      { term: 'Term 3', 'Vikram Singh': 82, 'Meera Patel': 92, 'Sanjay Kumar': 68, 'Priya Sharma': 67, 'Ahmed Khan': 75, 'Rahul Verma': 78, 'Class Average': 76 },
      { term: 'Term 4', 'Vikram Singh': 85, 'Meera Patel': 95, 'Sanjay Kumar': 55, 'Priya Sharma': 72, 'Ahmed Khan': 73, 'Rahul Verma': 85, 'Class Average': 77 }
    ];

    const currentChapterData = [
      { student: 'Meera Patel', performance: 78, color: '#f59e0b' },
      { student: 'Priya Sharma', performance: 76, color: '#22c55e' },
      { student: 'Vikram Singh', performance: 76, color: '#22c55e' },
      { student: 'Sanjay Kumar', performance: 74, color: '#0891b2' },
      { student: 'Ahmed Khan', performance: 72, color: '#0891b2' },
      { student: 'Rahul Verma', performance: 53, color: '#8b5cf6' }
    ];

    const classAverage = 73;

    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📚 Chapter-wise Performance Analysis
          </h3>
          <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
            Select Chapter for {selectedClass.name}
          </p>
          <select 
            value={selectedChapter} 
            onChange={(e) => setSelectedChapter(e.target.value)}
            style={{
              marginTop: '12px',
              padding: '10px 14px',
              borderRadius: '6px',
              border: '2px solid #e5e7eb',
              fontSize: '14px',
              minWidth: '200px',
              backgroundColor: 'white'
            }}
          >
            <option value="Matrices">Matrices</option>
            <option value="Determinants">Determinants</option>
            <option value="Continuity and Differentiability">Continuity and Differentiability</option>
            <option value="Applications of Derivatives">Applications of Derivatives</option>
            <option value="Integrals">Integrals</option>
            <option value="Applications of Integrals">Applications of Integrals</option>
            <option value="Differential Equations">Differential Equations</option>
            <option value="Vector Algebra">Vector Algebra</option>
            <option value="Three Dimensional Geometry">Three Dimensional Geometry</option>
            <option value="Linear Programming">Linear Programming</option>
            <option value="Probability">Probability</option>
          </select>
        </div>

        <h4 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#374151' }}>Performance in {selectedChapter}</h4>
        
        {/* Student Performance Over Time Chart */}
        <div style={{ marginBottom: '40px' }}>
          <h5 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#4b5563' }}>Student Performance in {selectedChapter} Over Time</h5>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chapterPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="term" />
                <YAxis domain={[40, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Vikram Singh" stroke="#0ea5e9" strokeWidth={3} />
                <Line type="monotone" dataKey="Meera Patel" stroke="#10b981" strokeWidth={3} />
                <Line type="monotone" dataKey="Sanjay Kumar" stroke="#f59e0b" strokeWidth={3} />
                <Line type="monotone" dataKey="Priya Sharma" stroke="#ef4444" strokeWidth={3} />
                <Line type="monotone" dataKey="Ahmed Khan" stroke="#8b5cf6" strokeWidth={3} />
                <Line type="monotone" dataKey="Rahul Verma" stroke="#06b6d4" strokeWidth={3} />
                <Line 
                  type="monotone" 
                  dataKey="Class Average" 
                  stroke="#000000" 
                  strokeWidth={4} 
                  strokeDasharray="8 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Current Chapter Performance by Student */}
        <div>
          <h5 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#4b5563' }}>Current Chapter Performance by Student</h5>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentChapterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="student" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Performance']} />
                <ReferenceLine y={classAverage} stroke="#ef4444" strokeDasharray="8 4" strokeWidth={3} />
                <Bar 
                  dataKey="performance" 
                  fill={(entry, index) => entry.color}
                  name="Performance (%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            backgroundColor: '#fef2f2',
            border: '2px dashed #ef4444',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#991b1b',
            textAlign: 'center'
          }}>
            🔴 Red Dashed Line: Chapter Average = {classAverage}%
          </div>
        </div>

        {/* Generate AI Report Button */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button
            onClick={() => setShowAIReport(true)}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '14px 28px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: '0 auto',
              boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 12px rgba(59, 130, 246, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 6px rgba(59, 130, 246, 0.3)';
            }}
          >
            📊 Generate AI Report
          </button>
        </div>
      </div>
    );
  };

  // Render AI Report Modal
  const renderAIReportModal = () => {
    if (!showAIReport) return null;

    // Check if this is for a student or class
    const isStudentReport = selectedStudent && studentData;
    const reportTitle = isStudentReport 
      ? `AI-Powered Report for ${selectedStudent.name} - ${selectedClass.name}`
      : `AI-Powered Report for ${selectedChapter} - ${selectedClass.name}`;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ marginRight: '12px', fontSize: '24px' }}>📊</div>
            <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              {reportTitle}
            </h3>
            <button
              onClick={() => setShowAIReport(false)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                color: '#666'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ lineHeight: '1.7', color: '#374151' }}>
            {isStudentReport ? (
              // Student-specific report
              <div>
                <div style={{ marginBottom: '28px' }}>
                  <h4 style={{ color: '#1f2937', borderLeft: '5px solid #3b82f6', paddingLeft: '16px', margin: '0 0 16px 0', fontSize: '18px' }}>
                    Weekly Efficiency and Performance Report
                  </h4>
                  <div style={{ backgroundColor: '#f0f9ff', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #3b82f6' }}>
                    <p><strong>Introduction:</strong></p>
                    <p>This report provides an in-depth analysis of {selectedStudent.name}'s weekly efficiency data, chapter-wise performance, and error type distribution. The data spans five weeks, from May 01 to May 29, and offers valuable insights into strengths, trends, and areas for improvement.</p>
                  </div>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <h4 style={{ color: '#1f2937', borderLeft: '5px solid #3b82f6', paddingLeft: '16px', margin: '0 0 16px 0', fontSize: '18px' }}>
                    Weekly Efficiency Analysis:
                  </h4>
                  <div style={{ backgroundColor: '#f0f9ff', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #3b82f6' }}>
                    <p>The weekly efficiency data reveals consistent performance with room for improvement. The average efficiency score over the five weeks is {((studentData.weeklyEfficiency.reduce((sum, week) => sum + week.efficiency, 0) / studentData.weeklyEfficiency.length)).toFixed(1)}%.</p>
                    <p>The data shows that:</p>
                    <ul style={{ marginLeft: '20px', paddingLeft: '0' }}>
                      <li style={{ marginBottom: '8px' }}>Week 3 had the highest efficiency score, indicating a peak in performance.</li>
                      <li style={{ marginBottom: '8px' }}>Performance remained relatively consistent throughout the tracking period.</li>
                      <li>Time taken to complete tasks has remained within the allocated time frame.</li>
                    </ul>
                  </div>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <h4 style={{ color: '#1f2937', borderLeft: '5px solid #3b82f6', paddingLeft: '16px', margin: '0 0 16px 0', fontSize: '18px' }}>
                    Chapter-wise Performance Analysis:
                  </h4>
                  <div style={{ backgroundColor: '#f0f9ff', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #3b82f6' }}>
                    <p>The chapter-wise performance data provides a more detailed understanding of {selectedStudent.name}'s strengths and weaknesses in specific areas. The average efficiency scores for each chapter are:</p>
                    <ul style={{ marginLeft: '20px', paddingLeft: '0' }}>
                      <li style={{ marginBottom: '8px' }}><strong>Chapter 1:</strong> 95.0% (highest)</li>
                      <li style={{ marginBottom: '8px' }}><strong>Chapter 6:</strong> 96.4% (highest)</li>
                      <li style={{ marginBottom: '8px' }}><strong>Chapter 2:</strong> 66.4% (lowest)</li>
                      <li style={{ marginBottom: '8px' }}><strong>Chapter 3:</strong> 74.0% (needs improvement)</li>
                      <li>Other chapters show steady improvement over time</li>
                    </ul>
                  </div>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <h4 style={{ color: '#ef4444', borderLeft: '5px solid #ef4444', paddingLeft: '16px', margin: '0 0 16px 0', fontSize: '18px' }}>
                    Error Type Distribution Analysis:
                  </h4>
                  <div style={{ backgroundColor: '#fef2f2', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #ef4444' }}>
                    <p>The error type distribution data reveals that:</p>
                    <ul style={{ marginLeft: '20px', paddingLeft: '0' }}>
                      <li style={{ marginBottom: '8px' }}>Conceptual errors account for 72.0% of the errors, indicating a need for improved understanding and application of concepts.</li>
                      <li style={{ marginBottom: '8px' }}>No errors account for 28.0% of the cases, suggesting a significant proportion of tasks are being completed accurately.</li>
                      <li>Focus is needed on building stronger conceptual foundations.</li>
                    </ul>
                  </div>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <h4 style={{ color: '#f59e0b', borderLeft: '5px solid #f59e0b', paddingLeft: '16px', margin: '0 0 16px 0', fontSize: '18px' }}>
                    Conclusion and Recommendations:
                  </h4>
                  <div style={{ backgroundColor: '#fefbf0', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #f59e0b' }}>
                    <p>Based on the analysis, the following conclusions and recommendations can be made:</p>
                    <ul style={{ marginLeft: '20px', paddingLeft: '0' }}>
                      <li style={{ marginBottom: '8px' }}>The overall efficiency average of {selectedStudent.efficiency}% indicates room for targeted improvement in specific subject areas.</li>
                      <li style={{ marginBottom: '8px' }}>Focus should be placed on conceptual understanding, particularly in Chapter 2 and Chapter 3.</li>
                      <li style={{ marginBottom: '8px' }}>Continue building on strengths shown in Chapter 1 and Chapter 6.</li>
                      <li>Implement additional practice sessions for areas showing consistent conceptual errors.</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              // Class-specific report (existing code)
              <div>
                <div style={{ marginBottom: '28px' }}>
                  <h4 style={{ color: '#1f2937', borderLeft: '5px solid #3b82f6', paddingLeft: '16px', margin: '0 0 16px 0', fontSize: '18px' }}>
                    1. Overall Assessment of Class Performance in {selectedChapter}
                  </h4>
                  <div style={{ backgroundColor: '#f0f9ff', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #3b82f6' }}>
                    <p><strong>Class Overview:</strong> {selectedClass.name} shows varied performance levels in {selectedChapter}, with clear opportunities for targeted intervention and support.</p>
                    <p><strong>Student Engagement:</strong> The class demonstrates good overall engagement with {selectedClass.students.length} active students participating in Mathematics coursework.</p>
                  </div>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <h4 style={{ color: '#1f2937', borderLeft: '5px solid #3b82f6', paddingLeft: '16px', margin: '0 0 16px 0', fontSize: '18px' }}>
                    2. Teaching Strategies for {selectedClass.name}
                  </h4>
                  <div style={{ backgroundColor: '#f0f9ff', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #3b82f6' }}>
                    <ol style={{ marginLeft: '20px', paddingLeft: '0' }}>
                      <li style={{ marginBottom: '8px' }}><strong>Differentiated Instruction:</strong> Tailor lessons to address the diverse learning needs in {selectedClass.name}, incorporating multiple learning modalities for {selectedChapter}.</li>
                      <li style={{ marginBottom: '8px' }}><strong>Peer Learning:</strong> Implement group activities where stronger students can support those needing additional help.</li>
                      <li style={{ marginBottom: '8px' }}><strong>Technology Integration:</strong> Use digital tools and simulations to enhance understanding of {selectedChapter} concepts.</li>
                      <li><strong>Regular Assessment:</strong> Conduct frequent formative assessments to track progress and adjust instruction accordingly.</li>
                    </ol>
                  </div>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <h4 style={{ color: '#22c55e', borderLeft: '5px solid #22c55e', paddingLeft: '16px', margin: '0 0 16px 0', fontSize: '18px' }}>
                    3. Class Strengths
                  </h4>
                  <div style={{ backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #22c55e' }}>
                    <ul style={{ marginLeft: '20px', paddingLeft: '0' }}>
                      <li style={{ marginBottom: '8px' }}><strong>Active Participation:</strong> {selectedClass.name} shows good student engagement across {selectedChapter} topics.</li>
                      <li style={{ marginBottom: '8px' }}><strong>Diverse Skill Levels:</strong> The range of abilities provides opportunities for peer-to-peer learning and support.</li>
                      <li style={{ marginBottom: '8px' }}><strong>Consistent Attendance:</strong> Regular class participation supports continuous learning progress.</li>
                      <li><strong>Subject Enthusiasm:</strong> Students demonstrate interest in Mathematics concepts and problem-solving.</li>
                    </ul>
                  </div>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <h4 style={{ color: '#f59e0b', borderLeft: '5px solid #f59e0b', paddingLeft: '16px', margin: '0 0 16px 0', fontSize: '18px' }}>
                    4. Areas for Improvement
                  </h4>
                  <div style={{ backgroundColor: '#fefbf0', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #f59e0b' }}>
                    <ul style={{ marginLeft: '20px', paddingLeft: '0' }}>
                      <li style={{ marginBottom: '8px' }}><strong>Individual Support:</strong> Some students may benefit from additional one-on-one guidance in {selectedChapter}.</li>
                      <li style={{ marginBottom: '8px' }}><strong>Conceptual Understanding:</strong> Focus needed on building stronger foundation in core Mathematics principles.</li>
                      <li style={{ marginBottom: '8px' }}><strong>Problem-Solving Skills:</strong> Enhanced practice in applying theoretical knowledge to practical problems.</li>
                      <li><strong>Study Habits:</strong> Development of effective learning strategies and time management skills.</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 style={{ color: '#8b5cf6', borderLeft: '5px solid #8b5cf6', paddingLeft: '16px', margin: '0 0 16px 0', fontSize: '18px' }}>
                    5. Recommended Action Plan
                  </h4>
                  <div style={{ backgroundColor: '#faf5ff', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #8b5cf6' }}>
                    <ol style={{ marginLeft: '20px', paddingLeft: '0' }}>
                      <li style={{ marginBottom: '8px' }}><strong>Weekly Progress Monitoring:</strong> Implement regular check-ins to track student understanding in {selectedChapter}.</li>
                      <li style={{ marginBottom: '8px' }}><strong>Adaptive Learning Paths:</strong> Create personalized learning journeys based on individual student needs.</li>
                      <li style={{ marginBottom: '8px' }}><strong>Interactive Sessions:</strong> Increase hands-on activities and real-world applications of {selectedChapter} concepts.</li>
                      <li style={{ marginBottom: '8px' }}><strong>Parent Engagement:</strong> Involve families in supporting student learning at home.</li>
                      <li><strong>Remedial Support:</strong> Provide additional resources for students struggling with key concepts.</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render student list for student analysis
  const renderStudentList = () => {
    // Get students based on selected class
    const currentClassData = classesData[selectedClassForStudents];
    const filteredStudents = currentClassData.students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        height: 'fit-content'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>👥 Students List</h3>
          <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
            Select a class and student to view detailed analysis
          </p>
        </div>

        {/* Class Dropdown */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
            Select Class:
          </label>
          <select 
            value={selectedClassForStudents}
            onChange={(e) => {
              setSelectedClassForStudents(parseInt(e.target.value));
              setSelectedStudent(null);
              setStudentData(null);
              setSearchTerm('');
            }}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '6px',
              border: '2px solid #e5e7eb',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          >
            {Object.values(classesData).map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
            Search Student:
          </label>
          <input
            type="text"
            placeholder="Type student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '6px',
              border: '2px solid #e5e7eb',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          />
        </div>

        {/* Students List */}
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div 
                key={student.id}
                onClick={() => {
                  handleStudentSelect(student);
                  setSelectedClass(currentClassData);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  marginBottom: '10px',
                  backgroundColor: selectedStudent?.id === student.id ? '#e0f2fe' : '#f8fafc',
                  border: selectedStudent?.id === student.id ? '2px solid #0277bd' : '1px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  transform: selectedStudent?.id === student.id ? 'translateX(4px)' : 'none'
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  marginRight: '14px',
                  fontSize: '16px'
                }}>
                  {student.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{student.name}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>Class {student.class}</div>
                  <div style={{ fontSize: '12px', color: '#0369a1', marginTop: '2px', fontWeight: '500' }}>
                    Efficiency: {student.efficiency}%
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              color: '#666',
              fontSize: '14px'
            }}>
              No students found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render individual student analysis
  const renderStudentAnalysis = () => {
    if (!selectedStudent || !studentData) {
      return (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '60px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          textAlign: 'center',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👨‍🎓</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>Select a Student</h3>
            <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
              Choose a student from {selectedClass.name} to view their detailed analysis and performance metrics
            </p>
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Student Info Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📊 Student Analysis: {selectedStudent.name}
            </h3>
            <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
              Individual performance metrics for {selectedClass.name}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
            <div style={{
              backgroundColor: '#f0f9ff',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px solid #e0f2fe'
            }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0369a1' }}>
                {selectedStudent.efficiency}%
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>Current Efficiency</div>
            </div>
            <div style={{
              backgroundColor: '#f0fdf4',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px solid #dcfce7'
            }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>
                {selectedClass.name}
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>Class Level</div>
            </div>
          </div>
        </div>

        {/* Weekly Efficiency Progress */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ margin: '0 0 20px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📈 Weekly Efficiency Progress
          </h4>
          <div style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studentData.weeklyEfficiency}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Efficiency']} />
                <Line type="monotone" dataKey="efficiency" stroke="#2563eb" strokeWidth={4} dot={{ fill: '#2563eb', strokeWidth: 2, r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Error Types Analysis */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ margin: '0 0 20px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🚨 Error Types Analysis
          </h4>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentData.errorAnalysis}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Conceptual" fill="#ef4444" name="Conceptual Errors" radius={[4, 4, 0, 0]} />
                <Bar dataKey="No Error" fill="#22c55e" name="No Errors" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chapter-wise Performance Over Time */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ margin: '0 0 20px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📚 Chapter-wise Performance Over Time
          </h4>
          <div style={{ height: '450px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studentData.chapterPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Chapter 1" stroke="#0088FE" strokeWidth={2} />
                <Line type="monotone" dataKey="Chapter 2" stroke="#00C49F" strokeWidth={2} />
                <Line type="monotone" dataKey="Chapter 3" stroke="#FFBB28" strokeWidth={2} />
                <Line type="monotone" dataKey="Chapter 4" stroke="#FF8042" strokeWidth={2} />
                <Line type="monotone" dataKey="Chapter 5" stroke="#8884D8" strokeWidth={2} />
                <Line type="monotone" dataKey="Chapter 6" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="Chapter 7" stroke="#ffc658" strokeWidth={2} />
                <Line type="monotone" dataKey="Chapter 8" stroke="#ff7300" strokeWidth={2} />
                <Line type="monotone" dataKey="Chapter 9" stroke="#387908" strokeWidth={2} />
                <Line 
                  type="monotone" 
                  dataKey="overallAverage" 
                  stroke="#000000" 
                  strokeWidth={4} 
                  strokeDasharray="8 4"
                  name="Overall Average"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Generate AI Report Button */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button
              onClick={() => setShowAIReport(true)}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '14px 28px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                margin: '0 auto',
                boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 12px rgba(59, 130, 246, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px rgba(59, 130, 246, 0.3)';
              }}
            >
              📊 Generate AI Report
            </button>
          </div>
        </div>

        {/* AI Report Modal for Students */}
        {renderAIReportModal()}
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '0' }}>
      <div style={{ maxWidth: '100%', margin: '0' }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: 'white', 
          borderBottom: '1px solid #e5e7eb',
          padding: '24px 32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>
            Enhanced Analytics Dashboard
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '16px' }}>
            Comprehensive performance monitoring and AI-driven insights
          </p>
        </div>

        {/* Tabs */}
        <div style={{ 
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '0 32px'
        }}>
          <div style={{ display: 'flex', gap: '0' }}>
            <button 
              onClick={() => setActiveTab('class')}
              style={{
                padding: '16px 32px',
                backgroundColor: activeTab === 'class' ? '#3b82f6' : 'transparent',
                color: activeTab === 'class' ? 'white' : '#666',
                border: 'none',
                borderRadius: '0',
                borderBottom: activeTab === 'class' ? '3px solid #3b82f6' : '3px solid transparent',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Class Analysis
            </button>
            <button 
              onClick={() => setActiveTab('student')}
              style={{
                padding: '16px 32px',
                backgroundColor: activeTab === 'student' ? '#3b82f6' : 'transparent',
                color: activeTab === 'student' ? 'white' : '#666',
                border: 'none',
                borderRadius: '0',
                borderBottom: activeTab === 'student' ? '3px solid #3b82f6' : '3px solid transparent',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Student Analysis
            </button>
            <button 
              onClick={() => setActiveTab('homework')}
              style={{
                padding: '16px 32px',
                backgroundColor: activeTab === 'homework' ? '#3b82f6' : 'transparent',
                color: activeTab === 'homework' ? 'white' : '#666',
                border: 'none',
                borderRadius: '0',
                borderBottom: activeTab === 'homework' ? '3px solid #3b82f6' : '3px solid transparent',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Homework
            </button>
            <button 
              onClick={() => setActiveTab('exercise')}
              style={{
                padding: '16px 32px',
                backgroundColor: activeTab === 'exercise' ? '#3b82f6' : 'transparent',
                color: activeTab === 'exercise' ? 'white' : '#666',
                border: 'none',
                borderRadius: '0',
                borderBottom: activeTab === 'exercise' ? '3px solid #3b82f6' : '3px solid transparent',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Quick Exercise
            </button>
            <button 
              onClick={() => setActiveTab('classwork')}
              style={{
                padding: '16px 32px',
                backgroundColor: activeTab === 'classwork' ? '#3b82f6' : 'transparent',
                color: activeTab === 'classwork' ? 'white' : '#666',
                border: 'none',
                borderRadius: '0',
                borderBottom: activeTab === 'classwork' ? '3px solid #3b82f6' : '3px solid transparent',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Classwork
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ padding: '20px' }}>
          {activeTab === 'class' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', maxWidth: '100%' }}>
              {/* Left Sidebar - Classes */}
              <div>
                {renderClassSidebar()}
              </div>

              {/* Main Content Area - Full width for all data */}
              <div>
                {/* Student Progress Comparison */}
                {renderStudentProgressComparison()}
                
                {/* Learning Gap Analysis */}
                {renderLearningGapAnalysis()}
                
                {/* Chapter-wise Performance Analysis */}
                {renderChapterPerformance()}
                
                {/* AI Report Modal */}
                {renderAIReportModal()}
              </div>
            </div>
          ) : activeTab === 'student' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', maxWidth: '100%' }}>
              {/* Left Sidebar - Student Selection */}
              <div>
                {renderStudentList()}
              </div>
              
              {/* Main Content Area - Student Analysis */}
              <div>
                {renderStudentAnalysis()}
              </div>
            </div>
          ) : activeTab=== 'class'?(
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', maxWidth: '100%' }}>
              {/* Left Sidebar - Classes */}
              <div>
                {renderClassSidebar()}
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '60px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                textAlign: 'center',
                minHeight: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
                  <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>Homework Management</h3>
                  <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
                    Homework functionality for {selectedClass.name} will be implemented here
                  </p>
                </div>
              </div>
            </div>
          ):activeTab==='classwork'? (
            <QuickExerciseComponent onCreateHomework={(assignment) => handleAssignmentSubmit(assignment, "classwork")}  mode="classwork" />):activeTab==='homework'? (
            <TeacherDashboard 
              user={selectedClass}
              assignments={assignments}
              submissions={submissions}
              onAssignmentSubmit={(assignment) => handleAssignmentSubmit(assignment, "homework")}
            />):
          (<QuickExerciseComponent onCreateHomework={(assignment) => handleAssignmentSubmit(assignment, "quiz")} />)} 
        </div>
      </div>
    </div>
  ); 
};

export default EnhancedTeacherDash;