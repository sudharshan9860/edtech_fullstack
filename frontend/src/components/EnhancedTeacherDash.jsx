import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart, ReferenceLine
} from 'recharts';

import './EnhancedTeacherDash.css';
import axiosInstance from '../api/axiosInstance';
import TeacherDashboard from './TeacherDashboard';

// Colors matching the streamlit application
const COLORS = ['#2E86AB', '#A23B72', '#F18F01', '#6A994E', '#F44336'];
const CHART_COLORS = {
  homework: '#2E86AB',
  classwork: '#A23B72',
  excellent: '#4CAF50',
  good: '#8BC34A', 
  average: '#FFC107',
  poor: '#FF9800',
  failing: '#F44336'
};

// Process student data for analytics (based on the JSON structure)
const processStudentData = (studentData, dataType) => {
  const daily_data = [];
  const question_data = [];
  const topic_data = {};
  
  const id_key = dataType === "Homework" ? "homework_id" : "classwork_id";
  
  studentData.forEach(assignment => {
    const date = assignment.submission_date;
    const assignment_id = assignment[id_key];
    
    let daily_total_score = 0;
    let daily_max_score = 0;
    
    assignment.questions.forEach(question => {
      daily_total_score += question.total_score;
      daily_max_score += question.max_score;
      
      // Individual question data
      question_data.push({
        question_id: question.question_id,
        assignment_id: assignment_id,
        date: date,
        topic: question.topic,
        score: question.total_score,
        max_score: question.max_score,
        percentage: (question.total_score / question.max_score) * 100,
        category: question.answer_category
      });
      
      // Topic aggregation
      if (!topic_data[question.topic]) {
        topic_data[question.topic] = [];
      }
      topic_data[question.topic].push({
        assignment_id: assignment_id,
        question_id: question.question_id,
        score: question.total_score,
        max_score: question.max_score,
        percentage: (question.total_score / question.max_score) * 100
      });
    });
    
    // Daily/Assignment summary
    const daily_percentage = (daily_total_score / daily_max_score) * 100;
    daily_data.push({
      date: date,
      assignment_id: assignment_id,
      total_score: daily_total_score,
      max_score: daily_max_score,
      percentage: daily_percentage
    });
  });
  
  return { daily_data, question_data, topic_data };
};

// Process all students data for classroom analytics
const processClassroomData = (allStudentsData) => {
  const classroom_data = {
    homework: {},
    classwork: {}
  };
  
  // Process each student's data
  Object.keys(allStudentsData.homework || {}).forEach(student_id => {
    const hw_data = allStudentsData.homework[student_id];
    if (hw_data && hw_data.length > 0) {
      const processed = processStudentData(hw_data, "Homework");
      classroom_data.homework[student_id] = processed;
    }
  });
  
  Object.keys(allStudentsData.classwork || {}).forEach(student_id => {
    const cw_data = allStudentsData.classwork[student_id];
    if (cw_data && cw_data.length > 0) {
      const processed = processStudentData(cw_data, "Classwork");
      classroom_data.classwork[student_id] = processed;
    }
  });
  
  return classroom_data;
};

// Create classroom overview data (based on your mock data structure)
const createClassOverviewData = (classroom_data) => {
  const students = new Set([
    ...Object.keys(classroom_data.homework || {}),
    ...Object.keys(classroom_data.classwork || {})
  ]);
  
  const studentPerformanceComparison = [];
  let hw_total = 0, cw_total = 0, hw_count = 0, cw_count = 0;
  
  students.forEach(student_id => {
    let hw_avg = 0, cw_avg = 0;
    
    // Calculate homework average
    if (classroom_data.homework[student_id]) {
      const hw_daily = classroom_data.homework[student_id].daily_data;
      if (hw_daily.length > 0) {
        const total_hw_score = hw_daily.reduce((sum, d) => sum + d.total_score, 0);
        const total_hw_max = hw_daily.reduce((sum, d) => sum + d.max_score, 0);
        hw_avg = (total_hw_score / total_hw_max) * 100;
        hw_total += hw_avg;
        hw_count++;
      }
    }
    
    // Calculate classwork average
    if (classroom_data.classwork[student_id]) {
      const cw_daily = classroom_data.classwork[student_id].daily_data;
      if (cw_daily.length > 0) {
        const total_cw_score = cw_daily.reduce((sum, d) => sum + d.total_score, 0);
        const total_cw_max = cw_daily.reduce((sum, d) => sum + d.max_score, 0);
        cw_avg = (total_cw_score / total_cw_max) * 100;
        cw_total += cw_avg;
        cw_count++;
      }
    }
    
    studentPerformanceComparison.push({
      student: student_id,
      homework: Math.round(hw_avg),
      classwork: Math.round(cw_avg)
    });
  });
  
  return {
    studentPerformanceComparison,
    overallStatistics: {
      homeworkAverage: hw_count > 0 ? Math.round(hw_total / hw_count) : 0,
      classworkAverage: cw_count > 0 ? Math.round(cw_total / cw_count) : 0
    }
  };
};

// Create progress trends data
const createProgressTrendsData = (classroom_data) => {
  const assignment_averages = new Map();
  const all_dates = new Set();
  
  // Collect all assignment data with dates
  Object.values(classroom_data.homework || {}).forEach(student_data => {
    student_data.daily_data.forEach(daily => {
      const key = `HW_${daily.date}`;
      if (!assignment_averages.has(key)) {
        assignment_averages.set(key, { scores: [], date: daily.date, type: 'HW' });
      }
      assignment_averages.get(key).scores.push(daily.percentage);
      all_dates.add(daily.date);
    });
  });
  
  Object.values(classroom_data.classwork || {}).forEach(student_data => {
    student_data.daily_data.forEach(daily => {
      const key = `CW_${daily.date}`;
      if (!assignment_averages.has(key)) {
        assignment_averages.set(key, { scores: [], date: daily.date, type: 'CW' });
      }
      assignment_averages.get(key).scores.push(daily.percentage);
      all_dates.add(daily.date);
    });
  });
  
  // Calculate averages and sort by date
  const assignmentProgress = [];
  assignment_averages.forEach((data, key) => {
    const average = data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length;
    assignmentProgress.push({
      date: data.date,
      [data.type === 'HW' ? 'hwAverage' : 'cwAverage']: Math.round(average),
      submissionDate: data.date
    });
  });
  
  // Group by date and merge HW/CW data
  const dateMap = new Map();
  assignmentProgress.forEach(item => {
    if (!dateMap.has(item.date)) {
      dateMap.set(item.date, { date: item.date, hwAverage: 0, cwAverage: 0 });
    }
    const existing = dateMap.get(item.date);
    if (item.hwAverage) existing.hwAverage = item.hwAverage;
    if (item.cwAverage) existing.cwAverage = item.cwAverage;
  });
  
  const sortedProgress = Array.from(dateMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Top performers
  const student_averages = [];
  Object.keys(classroom_data.homework || {}).forEach(student_id => {
    const hw_data = classroom_data.homework[student_id];
    const cw_data = classroom_data.classwork[student_id];
    
    let total_avg = 0;
    let count = 0;
    
    if (hw_data && hw_data.daily_data.length > 0) {
      const hw_avg = hw_data.daily_data.reduce((sum, d) => sum + d.percentage, 0) / hw_data.daily_data.length;
      total_avg += hw_avg;
      count++;
    }
    
    if (cw_data && cw_data.daily_data.length > 0) {
      const cw_avg = cw_data.daily_data.reduce((sum, d) => sum + d.percentage, 0) / cw_data.daily_data.length;
      total_avg += cw_avg;
      count++;
    }
    
    if (count > 0) {
      student_averages.push({
        student: student_id,
        percentage: Math.round(total_avg / count)
      });
    }
  });
  
  const topPerformers = student_averages
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);
  
  return { assignmentProgress: sortedProgress, topPerformers };
};

// Create topic analysis data
const createTopicAnalysisData = (classroom_data) => {
  const all_topics = new Map();
  
  // Aggregate all topic data
  Object.values(classroom_data.homework || {}).forEach(student_data => {
    Object.entries(student_data.topic_data).forEach(([topic, scores]) => {
      if (!all_topics.has(topic)) {
        all_topics.set(topic, { hw_scores: [], cw_scores: [] });
      }
      all_topics.get(topic).hw_scores.push(...scores.map(s => s.percentage));
    });
  });
  
  Object.values(classroom_data.classwork || {}).forEach(student_data => {
    Object.entries(student_data.topic_data).forEach(([topic, scores]) => {
      if (!all_topics.has(topic)) {
        all_topics.set(topic, { hw_scores: [], cw_scores: [] });
      }
      all_topics.get(topic).cw_scores.push(...scores.map(s => s.percentage));
    });
  });
  
  // Calculate topic statistics
  const topic_stats = [];
  all_topics.forEach((data, topic) => {
    const hw_avg = data.hw_scores.length > 0 ? data.hw_scores.reduce((sum, score) => sum + score, 0) / data.hw_scores.length : 0;
    const cw_avg = data.cw_scores.length > 0 ? data.cw_scores.reduce((sum, score) => sum + score, 0) / data.cw_scores.length : 0;
    const combined_scores = [...data.hw_scores, ...data.cw_scores];
    const combined_avg = combined_scores.length > 0 ? combined_scores.reduce((sum, score) => sum + score, 0) / combined_scores.length : 0;
    
    topic_stats.push({
      topic: topic,
      hw_average: Math.round(hw_avg),
      cw_average: Math.round(cw_avg),
      combined_average: Math.round(combined_avg),
      hw_count: data.hw_scores.length,
      cw_count: data.cw_scores.length,
      total_questions: combined_scores.length,
      std_dev: combined_scores.length > 0 ? Math.round(Math.sqrt(combined_scores.reduce((sum, score) => sum + Math.pow(score - combined_avg, 2), 0) / combined_scores.length) * 100) / 100 : 0
    });
  });
  
  // Sort and get struggling/excelling topics
  const sorted_topics = topic_stats.sort((a, b) => a.combined_average - b.combined_average);
  const strugglingTopics = sorted_topics.slice(0, 5).map(t => ({ topic: t.topic, value: t.combined_average }));
  const excellingTopics = sorted_topics.slice(-5).map(t => ({ topic: t.topic, value: t.combined_average }));
  
  return {
    strugglingTopics,
    excellingTopics,
    topicComparison: topic_stats.map(t => ({ topic: t.topic, hw: t.hw_average, cw: t.cw_average })),
    detailedTopicStats: topic_stats
  };
};

// Create summary data
const createSummaryData = (classroom_data) => {
  const all_students = new Set([
    ...Object.keys(classroom_data.homework || {}),
    ...Object.keys(classroom_data.classwork || {})
  ]);
  
  const hw_students = Object.keys(classroom_data.homework || {}).length;
  const cw_students = Object.keys(classroom_data.classwork || {}).length;
  
  // Calculate total assignments
  let total_assignments = 0;
  Object.values(classroom_data.homework || {}).forEach(student_data => {
    total_assignments += student_data.daily_data.length;
  });
  Object.values(classroom_data.classwork || {}).forEach(student_data => {
    total_assignments += student_data.daily_data.length;
  });
  
  // Calculate averages
  const all_hw_scores = [];
  const all_cw_scores = [];
  
  Object.values(classroom_data.homework || {}).forEach(student_data => {
    student_data.daily_data.forEach(daily => all_hw_scores.push(daily.percentage));
  });
  
  Object.values(classroom_data.classwork || {}).forEach(student_data => {
    student_data.daily_data.forEach(daily => all_cw_scores.push(daily.percentage));
  });
  
  const hw_class_avg = all_hw_scores.length > 0 ? all_hw_scores.reduce((sum, score) => sum + score, 0) / all_hw_scores.length : 0;
  const cw_class_avg = all_cw_scores.length > 0 ? all_cw_scores.reduce((sum, score) => sum + score, 0) / all_cw_scores.length : 0;
  const overall_class_avg = [...all_hw_scores, ...all_cw_scores].length > 0 ? 
    ([...all_hw_scores, ...all_cw_scores].reduce((sum, score) => sum + score, 0) / [...all_hw_scores, ...all_cw_scores].length) : 0;
  
  // Grade distribution
  const all_scores = [...all_hw_scores, ...all_cw_scores];
  const grade_distribution = [
    { grade: 'F', range: '<60%', count: all_scores.filter(s => s < 60).length, percentage: 0 },
    { grade: 'D', range: '60-69%', count: all_scores.filter(s => s >= 60 && s < 70).length, percentage: 0 },
    { grade: 'C', range: '70-79%', count: all_scores.filter(s => s >= 70 && s < 80).length, percentage: 0 },
    { grade: 'B', range: '80-89%', count: all_scores.filter(s => s >= 80 && s < 90).length, percentage: 0 },
    { grade: 'A', range: '90-100%', count: all_scores.filter(s => s >= 90).length, percentage: 0 }
  ];
  
  grade_distribution.forEach(grade => {
    grade.percentage = all_scores.length > 0 ? (grade.count / all_scores.length) * 100 : 0;
  });
  
  // Top performers
  const student_performance = [];
  all_students.forEach(student_id => {
    const scores = [];
    if (classroom_data.homework[student_id]) {
      scores.push(...classroom_data.homework[student_id].daily_data.map(d => d.percentage));
    }
    if (classroom_data.classwork[student_id]) {
      scores.push(...classroom_data.classwork[student_id].daily_data.map(d => d.percentage));
    }
    
    if (scores.length > 0) {
      const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      student_performance.push({ student: student_id, percentage: Math.round(avg) });
    }
  });
  
  const top_performers = student_performance.sort((a, b) => b.percentage - a.percentage).slice(0, 3);
  
  // Topic analysis for summary
  const topic_analysis = createTopicAnalysisData(classroom_data);
  const strongest_topics = topic_analysis.detailedTopicStats
    .sort((a, b) => b.combined_average - a.combined_average)
    .slice(0, 3)
    .map(t => ({ topic: t.topic, percentage: t.combined_average }));
  
  const topics_needing_attention = topic_analysis.detailedTopicStats
    .sort((a, b) => a.combined_average - b.combined_average)
    .slice(0, 3)
    .map(t => ({ topic: t.topic, percentage: t.combined_average }));
  
  return {
    classOverview: {
      totalStudents: all_students.size,
      studentsWithHomeworkData: hw_students,
      studentsWithClassworkData: cw_students,
      totalAssignmentsAnalyzed: total_assignments
    },
    performanceStats: {
      overallClassAverage: Math.round(overall_class_avg * 10) / 10,
      homeworkClassAverage: Math.round(hw_class_avg * 10) / 10,
      classworkClassAverage: Math.round(cw_class_avg * 10) / 10,
      performanceGap: Math.round((cw_class_avg - hw_class_avg) * 10) / 10
    },
    gradeDistribution: grade_distribution,
    topPerformers: top_performers,
    strongestTopics: strongest_topics,
    topicsNeedingAttention: topics_needing_attention,
    recommendations: [
      {
        type: 'focus',
        text: `Focus on ${Math.abs(cw_class_avg - hw_class_avg) > 5 ? 
          (cw_class_avg > hw_class_avg ? 'Homework' : 'Classwork') : 'maintaining balance'}: ${Math.abs(cw_class_avg - hw_class_avg) > 5 ? 
          `Class performs ${Math.abs(cw_class_avg - hw_class_avg).toFixed(1)}% better on ${cw_class_avg > hw_class_avg ? 'classwork' : 'homework'}` : 
          'Class shows balanced performance across both areas'}.`
      },
      {
        type: 'priority',
        text: `Priority Topics: Focus additional instruction on ${topics_needing_attention.map(t => t.topic).join(', ')}.`
      },
      {
        type: 'support',
        text: `Support Needed: ${grade_distribution.filter(g => g.grade === 'D' || g.grade === 'F').reduce((sum, g) => sum + g.count, 0)} assignments show grades D or F. Consider additional support strategies.`
      }
    ]
  };
};

const EnhancedTeacherDash = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeTab, setActiveTab] = useState('class');
  const [classAnalysisTab, setClassAnalysisTab] = useState('overview');
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [classroomAnalytics, setClassroomAnalytics] = useState(null);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      const response = await axiosInstance.get('/teacher-dashboard/');
      console.log('teacher-data', response.data);
      setTeacherData(response.data);
      
      // Process the real data for analytics
      await loadAnalyticsData();
      
      if (response.data.students && response.data.students.length > 0) {
        setSelectedClass({
          id: 'current',
          name: response.data.teacher_info?.class ? `Class ${response.data.teacher_info.class}th` : "Class 10th",
          students: response.data.students,
          isReal: true
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teacher data:', error);
      setLoading(false);
    }
  };

  const loadAnalyticsData = async () => {
    try {
      // In a real implementation, you would load the combined JSON data from your backend
      // For now, we'll use the mock data structure to demonstrate the functionality
      
      // Simulated data structure based on your JSON files
      const mockClassroomData = {
        homework: {
          "10HPS17": [
            {
              "submission_date": "2025-06-23",
              "homework_id": "HW001",
              "questions": [
                {
                  "question_id": "Q1",
                  "question": "Find the shortest distance of the point (0,1) from the parabola y = x² where 1/2 ≤ c ≤ 5.",
                  "topic": "Quadratic Applications",
                  "total_score": 0,
                  "max_score": 10,
                  "answer_category": "Irrelevant"
                },
                {
                  "question_id": "Q2",
                  "question": "Find the derivative of f(x) = 3x³ + 2x² - 5x + 1",
                  "topic": "Calculus - Derivatives",
                  "total_score": 0,
                  "max_score": 8,
                  "answer_category": "Unattempted"
                },
                {
                  "question_id": "Q3",
                  "question": "Solve the system: 2x + 3y = 7, x - y = 1",
                  "topic": "Algebra - Linear Equations",
                  "total_score": 3,
                  "max_score": 6,
                  "answer_category": "Numerical Error"
                }
              ]
            }
          ],
          "10HPS18": [
            {
              "submission_date": "2025-06-23",
              "homework_id": "HW001",
              "questions": [
                {
                  "question_id": "Q1",
                  "question": "Find the shortest distance of the point (0,1) from the parabola y = x² where 1/2 ≤ c ≤ 5.",
                  "topic": "Quadratic Applications",
                  "total_score": 1,
                  "max_score": 10,
                  "answer_category": "Irrelevant"
                },
                {
                  "question_id": "Q2",
                  "question": "Find the derivative of f(x) = 3x³ + 2x² - 5x + 1",
                  "topic": "Calculus - Derivatives",
                  "total_score": 2,
                  "max_score": 8,
                  "answer_category": "Partially-Correct"
                }
              ]
            }
          ],
          "10HPS19": [
            {
              "submission_date": "2025-06-23",
              "homework_id": "HW001",
              "questions": [
                {
                  "question_id": "Q1",
                  "question": "Find the shortest distance of the point (0,1) from the parabola y = x² where 1/2 ≤ c ≤ 5.",
                  "topic": "Quadratic Applications",
                  "total_score": 2,
                  "max_score": 10,
                  "answer_category": "Irrelevant"
                },
                {
                  "question_id": "Q2",
                  "question": "Find the derivative of f(x) = 3x³ + 2x² - 5x + 1",
                  "topic": "Calculus - Derivatives",
                  "total_score": 3,
                  "max_score": 8,
                  "answer_category": "Partially-Correct"
                }
              ]
            }
          ]
        },
        classwork: {
          "10HPS17": [
            {
              "submission_date": "2025-06-24",
              "classwork_id": "CW001",
              "questions": [
                {
                  "question_id": "Q1",
                  "question": "Find the roots of 2x² - 7x + 3 = 0 using quadratic formula",
                  "topic": "Quadratic Applications",
                  "total_score": 2,
                  "max_score": 8,
                  "answer_category": "Partially-Correct"
                },
                {
                  "question_id": "Q2",
                  "question": "Solve the linear system: x + 2y = 5, 3x - y = 4",
                  "topic": "Algebra - Linear Equations",
                  "total_score": 1,
                  "max_score": 6,
                  "answer_category": "Irrelevant"
                }
              ]
            }
          ],
          "10HPS18": [
            {
              "submission_date": "2025-06-24",
              "classwork_id": "CW001",
              "questions": [
                {
                  "question_id": "Q1",
                  "question": "Find the roots of 2x² - 7x + 3 = 0 using quadratic formula",
                  "topic": "Quadratic Applications",
                  "total_score": 0,
                  "max_score": 8,
                  "answer_category": "Irrelevant"
                },
                {
                  "question_id": "Q2",
                  "question": "Solve the linear system: x + 2y = 5, 3x - y = 4",
                  "topic": "Algebra - Linear Equations",
                  "total_score": 0,
                  "max_score": 6,
                  "answer_category": "Irrelevant"
                }
              ]
            }
          ],
          "10HPS19": [
            {
              "submission_date": "2025-06-24",
              "classwork_id": "CW001",
              "questions": [
                {
                  "question_id": "Q1",
                  "question": "Find the roots of 2x² - 7x + 3 = 0 using quadratic formula",
                  "topic": "Quadratic Applications",
                  "total_score": 5,
                  "max_score": 8,
                  "answer_category": "Partially-Correct"
                },
                {
                  "question_id": "Q2",
                  "question": "Solve the linear system: x + 2y = 5, 3x - y = 4",
                  "topic": "Algebra - Linear Equations",
                  "total_score": 4,
                  "max_score": 6,
                  "answer_category": "Partially-Correct"
                }
              ]
            }
          ]
        }
      };
      
      // Process the data using the same logic as the streamlit app
      const processed_classroom_data = processClassroomData(mockClassroomData);
      setClassroomAnalytics(processed_classroom_data);
      
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  };

  const handleAssignmentSubmit = async (assignment, mode) => {
    try {
      const endpoint = mode === "classwork" ? '/add-classwork/' : '/add-homework/';
      const response = await axiosInstance.post(endpoint, assignment);
      setAssignments(prev => [...prev, response.data]);
    } catch (error) {
      console.error(`Error creating ${mode || 'homework'}:`, error);
    }
  };

  // Render Class Overview Tab (Image 5 - using real analytics data)
  const renderClassOverview = () => {
    if (!classroomAnalytics) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading analytics data...</p>
        </div>
      );
    }

    const overviewData = createClassOverviewData(classroomAnalytics);
    
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
          {/* Student Performance Comparison */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
              📊 Class Overview Dashboard
            </h3>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>Student Performance Comparison</p>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={overviewData.studentPerformanceComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="student" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="homework" fill={CHART_COLORS.homework} name="Homework Average" />
                <Bar dataKey="classwork" fill={CHART_COLORS.classwork} name="Classwork Average" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Overall Class Statistics */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
              Overall Class Statistics and Performance Comparison
            </h3>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>Class Performance Summary</p>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { type: 'Homework', average: overviewData.overallStatistics.homeworkAverage },
                { type: 'Classwork', average: overviewData.overallStatistics.classworkAverage }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis domain={[0, 70]} />
                <Tooltip />
                <Bar dataKey="average" fill={CHART_COLORS.homework} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  // Render Class Progress Trends Tab (Image 6)
  const renderClassProgressTrends = () => {
    if (!classroomAnalytics) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading analytics data...</p>
        </div>
      );
    }

    const trendsData = createProgressTrendsData(classroomAnalytics);
    
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          {/* Assignment Progress Trends */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
              📈 Class Progress Trends
            </h3>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>Assignment Progress and Top Performers</p>
            
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontWeight: '600', marginBottom: '10px' }}>Assignment-wise Class Average</p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendsData.assignmentProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="hwAverage" stroke={CHART_COLORS.homework} strokeWidth={3} name="HW Class Average" />
                  <Line type="monotone" dataKey="cwAverage" stroke={CHART_COLORS.classwork} strokeWidth={3} name="CW Class Average" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Performers */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>Top Performers</h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendsData.topPerformers} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 70]} />
                <YAxis dataKey="student" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="percentage" fill="#fbbf24" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  // Render Topic Analysis Tab (Images 7-9)
  const renderTopicAnalysis = () => {
    if (!classroomAnalytics) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading analytics data...</p>
        </div>
      );
    }

    const topicData = createTopicAnalysisData(classroomAnalytics);
    
    return (
      <div style={{ padding: '20px' }}>
        <h3 style={{ marginBottom: '30px', fontSize: '18px', fontWeight: 'bold' }}>
          🎯 Class Topic Analysis
        </h3>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>Across All Students</p>
        
        {/* Topics Class Struggles With Most & Excels In */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h4 style={{ marginBottom: '20px', color: '#ef4444' }}>Topics Class Struggles With Most</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topicData.strugglingTopics} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 60]} />
                <YAxis dataKey="topic" type="category" width={120} fontSize={10} />
                <Tooltip />
                <Bar dataKey="value" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h4 style={{ marginBottom: '20px', color: '#22c55e' }}>Topics Class Excels In</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topicData.excellingTopics} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[50, 80]} />
                <YAxis dataKey="topic" type="category" width={120} fontSize={10} />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic-wise HW vs CW Comparison */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h4 style={{ marginBottom: '20px' }}>Topic-wise HW vs CW Comparison</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topicData.topicComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="topic" angle={-45} textAnchor="end" height={100} fontSize={10} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="hw" fill={CHART_COLORS.homework} name="HW" />
              <Bar dataKey="cw" fill={CHART_COLORS.classwork} name="CW" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Topic Statistics Table */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h4 style={{ marginBottom: '20px' }}>📊 Detailed Topic Statistics</h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Topic</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>Overall Avg (%)</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>HW Avg (%)</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>CW Avg (%)</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>Total Questions</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>Std Deviation</th>
                </tr>
              </thead>
              <tbody>
                {topicData.detailedTopicStats.map((stat, index) => (
                  <tr key={index}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>{stat.topic}</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>{stat.combined_average}</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>{stat.hw_average}</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>{stat.cw_average}</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>{stat.total_questions}</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>{stat.std_dev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Render Summary Tab (Images 10-12)
  const renderSummary = () => {
    if (!classroomAnalytics) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading analytics data...</p>
        </div>
      );
    }

    const summaryData = createSummaryData(classroomAnalytics);
    
    return (
      <div style={{ padding: '20px' }}>
        <h2 style={{ marginBottom: '30px', fontSize: '24px', fontWeight: 'bold' }}>
          📋 CLASSROOM PERFORMANCE SUMMARY
        </h2>

        {/* Class Overview */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            👥 Class Overview:
          </h3>
          <ul style={{ listStyle: 'disc', marginLeft: '20px', lineHeight: '1.8' }}>
            <li><strong>Total Students:</strong> {summaryData.classOverview.totalStudents}</li>
            <li><strong>Students with Homework Data:</strong> {summaryData.classOverview.studentsWithHomeworkData}</li>
            <li><strong>Students with Classwork Data:</strong> {summaryData.classOverview.studentsWithClassworkData}</li>
            <li><strong>Total Assignments Analyzed:</strong> {summaryData.classOverview.totalAssignmentsAnalyzed}</li>
          </ul>
        </div>

        {/* Performance Statistics */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            📊 Performance Statistics:
          </h3>
          <ul style={{ listStyle: 'disc', marginLeft: '20px', lineHeight: '1.8' }}>
            <li><strong>Overall Class Average:</strong> {summaryData.performanceStats.overallClassAverage}%</li>
            <li><strong>Homework Class Average:</strong> {summaryData.performanceStats.homeworkClassAverage}%</li>
            <li><strong>Classwork Class Average:</strong> {summaryData.performanceStats.classworkClassAverage}%</li>
            <li><strong>Performance Gap (CW - HW):</strong> <span style={{ color: summaryData.performanceStats.performanceGap >= 0 ? '#22c55e' : '#ef4444' }}>{summaryData.performanceStats.performanceGap}%</span></li>
          </ul>
        </div>

        {/* Grade Distribution */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            🎯 Grade Distribution:
          </h3>
          <ul style={{ listStyle: 'none', marginLeft: '20px', lineHeight: '2' }}>
            {summaryData.gradeDistribution.map((grade, index) => (
              <li key={index}>
                <strong>{grade.grade} ({grade.range}):</strong> {grade.count} assignments ({grade.percentage.toFixed(1)}%)
              </li>
            ))}
          </ul>
        </div>

        {/* Top Performers */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            🏆 Top Performers:
          </h3>
          <ol style={{ marginLeft: '20px', lineHeight: '1.8' }}>
            {summaryData.topPerformers.map((performer, index) => (
              <li key={index}>
                <strong>{performer.student}:</strong> {performer.percentage}%
              </li>
            ))}
          </ol>
        </div>

        {/* Strongest Topics */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            💪 Strongest Topics:
          </h3>
          <ol style={{ marginLeft: '20px', lineHeight: '1.8' }}>
            {summaryData.strongestTopics.map((topic, index) => (
              <li key={index}>
                <strong>{topic.topic}:</strong> {topic.percentage}%
              </li>
            ))}
          </ol>
        </div>

        {/* Topics Needing Attention */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            🔍 Topics Needing Attention:
          </h3>
          <ol style={{ marginLeft: '20px', lineHeight: '1.8' }}>
            {summaryData.topicsNeedingAttention.map((topic, index) => (
              <li key={index}>
                <strong>{topic.topic}:</strong> {topic.percentage}%
              </li>
            ))}
          </ol>
        </div>

        {/* Recommendations */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            💡 Recommendations:
          </h3>
          <ul style={{ listStyle: 'none', marginLeft: '0px', lineHeight: '2' }}>
            {summaryData.recommendations.map((rec, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                {rec.type === 'focus' && '📚'}
                {rec.type === 'priority' && '🎯'}
                {rec.type === 'support' && '🚨'}
                <span style={{ marginLeft: '10px' }}>
                  <strong>
                    {rec.type === 'focus' && 'Focus Recommendation: '}
                    {rec.type === 'priority' && 'Priority Areas: '}
                    {rec.type === 'support' && 'Support Needed: '}
                  </strong>
                  {rec.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // Render class analysis content based on active tab
  const renderClassAnalysisContent = () => {
    switch (classAnalysisTab) {
      case 'overview':
        return renderClassOverview();
      case 'trends':
        return renderClassProgressTrends();
      case 'topics':
        return renderTopicAnalysis();
      case 'summary':
        return renderSummary();
      default:
        return renderClassOverview();
    }
  };

  // Render class sidebar
  const renderClassSidebar = () => {
    const availableClasses = [];
    
    // Add current class from API if available
    if (teacherData && teacherData.teacher_info) {
      availableClasses.push({
        id: 'current',
        name: `Class ${teacherData.teacher_info.class}th (Live)`,
        students: teacherData.students || [],
        isReal: true
      });
    }

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
          {availableClasses.map((classItem) => (
            <div
              key={classItem.id}
              onClick={() => {
                setSelectedClass(classItem);
              }}
              style={{
                padding: '16px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: selectedClass && selectedClass.id === classItem.id ? '#e0f2fe' : '#f8fafc',
                border: selectedClass && selectedClass.id === classItem.id ? '2px solid #0277bd' : '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                transform: selectedClass && selectedClass.id === classItem.id ? 'translateY(-2px)' : 'none',
                boxShadow: selectedClass && selectedClass.id === classItem.id ? '0 4px 12px rgba(2, 119, 189, 0.15)' : 'none'
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937', marginBottom: '4px' }}>
                {classItem.name}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>
                {classItem.students.length} students
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
            Enhanced Analytics Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            Comprehensive performance monitoring and AI-driven insights
          </p>
        </div>

        {/* Main Navigation Tabs */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e5e7eb' }}>
            {[
              { key: 'class', label: 'Class Analysis', icon: '📊' },
              { key: 'student', label: 'Student Analysis', icon: '👤' },
              { key: 'worksheets', label: 'Worksheets', icon: '📝' },
              { key: 'homework', label: 'Homework', icon: '📚' },
              { key: 'classwork', label: 'Classwork', icon: '✏️' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: activeTab === tab.key ? '#3b82f6' : 'transparent',
                  color: activeTab === tab.key ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Sidebar */}
          <div style={{ width: '280px', flexShrink: 0 }}>
            {renderClassSidebar()}
          </div>

          {/* Main Content */}
          <div style={{ flex: 1 }}>
            {activeTab === 'class' && (
              <div>
                {/* Class Analysis Sub-tabs */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '8px', backgroundColor: 'white', padding: '8px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    {[
                      { key: 'overview', label: 'Class Overview', icon: '📊' },
                      { key: 'trends', label: 'Class Progress Trends', icon: '📈' },
                      { key: 'topics', label: 'Topic Analysis', icon: '🎯' },
                      { key: 'summary', label: 'Summary', icon: '📋' }
                    ].map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setClassAnalysisTab(tab.key)}
                        style={{
                          padding: '10px 16px',
                          backgroundColor: classAnalysisTab === tab.key ? '#e0f2fe' : 'transparent',
                          color: classAnalysisTab === tab.key ? '#0277bd' : '#64748b',
                          border: classAnalysisTab === tab.key ? '2px solid #0277bd' : '1px solid transparent',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '500',
                          fontSize: '13px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {tab.icon} {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Class Analysis Content */}
                <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', minHeight: '600px' }}>
                  {renderClassAnalysisContent()}
                </div>
              </div>
            )}

            {activeTab === 'worksheets' && (
              <TeacherDashboard 
                assignments={assignments} 
                submissions={submissions} 
                onAssignmentSubmit={handleAssignmentSubmit}
              />
            )}

            {activeTab === 'homework' && (
              <TeacherDashboard 
                assignments={assignments} 
                submissions={submissions} 
                onAssignmentSubmit={handleAssignmentSubmit}
              />
            )}

            {activeTab === 'classwork' && (
              <TeacherDashboard 
                assignments={assignments} 
                submissions={submissions} 
                onAssignmentSubmit={handleAssignmentSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTeacherDash;