import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, Sector
} from 'recharts';
// Import regular CSS file instead of CSS module
import './TeacherDash.css';

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Mock data generator for all classes
const generateClassData = () => {
  // Base data for all classes
  const classesData = {};
  
  // Class 6
  classesData[1] = {
    students: [
      {
        id: 1,
        name: "Alex Johnson",
        profileImage: "/api/placeholder/40/40",
        overallScore: 78,
        status: "On Track",
        weakChapters: ["Algebra", "Trigonometry"],
        conceptMastery: "Medium",
        chapterScores: {
          Algebra: 65,
          Geometry: 82,
          Trigonometry: 68,
          Calculus: 75,
          Statistics: 88,
        },
      },
      {
        id: 2,
        name: "Samantha Lee",
        profileImage: "/api/placeholder/40/40",
        overallScore: 92,
        status: "Excelling",
        weakChapters: ["Calculus"],
        conceptMastery: "High",
        chapterScores: {
          Algebra: 95,
          Geometry: 90,
          Trigonometry: 88,
          Calculus: 78,
          Statistics: 94,
        },
      },
      {
        id: 3,
        name: "Michael Chen",
        profileImage: "/api/placeholder/40/40",
        overallScore: 65,
        status: "Needs Improvement",
        weakChapters: ["Algebra", "Geometry", "Trigonometry"],
        conceptMastery: "Low",
        chapterScores: {
          Algebra: 58,
          Geometry: 62,
          Trigonometry: 55,
          Calculus: 70,
          Statistics: 72,
        },
      },
      {
        id: 4,
        name: "Emily Rodriguez",
        profileImage: "/api/placeholder/40/40",
        overallScore: 81,
        status: "On Track",
        weakChapters: ["Statistics"],
        conceptMastery: "Medium",
        chapterScores: {
          Algebra: 85,
          Geometry: 80,
          Trigonometry: 82,
          Calculus: 78,
          Statistics: 68,
        },
      },
      {
        id: 5,
        name: "David Kim",
        profileImage: "/api/placeholder/40/40",
        overallScore: 58,
        status: "Needs Improvement",
        weakChapters: ["Algebra", "Calculus", "Trigonometry"],
        conceptMastery: "Low",
        chapterScores: {
          Algebra: 52,
          Geometry: 65,
          Trigonometry: 55,
          Calculus: 50,
          Statistics: 68,
        },
      },
    ],
    chapterPerformance: [
      { chapter: "Algebra", struggling: 18, onTrack: 7, excelling: 5 },
      { chapter: "Geometry", struggling: 8, onTrack: 12, excelling: 10 },
      { chapter: "Trigonometry", struggling: 15, onTrack: 10, excelling: 5 },
      { chapter: "Calculus", struggling: 12, onTrack: 12, excelling: 6 },
      { chapter: "Statistics", struggling: 5, onTrack: 15, excelling: 10 },
    ]
  };
  
  // Class 7
  classesData[2] = {
    students: [
      {
        id: 1,
        name: "James Wilson",
        profileImage: "/api/placeholder/40/40",
        overallScore: 84,
        status: "On Track",
        weakChapters: ["Calculus"],
        conceptMastery: "Medium",
        chapterScores: {
          Algebra: 88,
          Geometry: 85,
          Trigonometry: 79,
          Calculus: 64,
          Statistics: 90,
        },
      },
      {
        id: 2,
        name: "Olivia Martinez",
        profileImage: "/api/placeholder/40/40",
        overallScore: 95,
        status: "Excelling",
        weakChapters: [],
        conceptMastery: "High",
        chapterScores: {
          Algebra: 98,
          Geometry: 96,
          Trigonometry: 94,
          Calculus: 92,
          Statistics: 95,
        },
      },
      {
        id: 3,
        name: "Ethan Brown",
        profileImage: "/api/placeholder/40/40",
        overallScore: 71,
        status: "On Track",
        weakChapters: ["Trigonometry", "Statistics"],
        conceptMastery: "Medium",
        chapterScores: {
          Algebra: 76,
          Geometry: 78,
          Trigonometry: 62,
          Calculus: 75,
          Statistics: 64,
        },
      },
      {
        id: 4,
        name: "Sophia Wang",
        profileImage: "/api/placeholder/40/40",
        overallScore: 59,
        status: "Needs Improvement",
        weakChapters: ["Algebra", "Geometry", "Calculus"],
        conceptMastery: "Low",
        chapterScores: {
          Algebra: 57,
          Geometry: 58,
          Trigonometry: 65,
          Calculus: 52,
          Statistics: 63,
        },
      },
      {
        id: 5,
        name: "Noah Garcia",
        profileImage: "/api/placeholder/40/40",
        overallScore: 76,
        status: "On Track",
        weakChapters: ["Trigonometry"],
        conceptMastery: "Medium",
        chapterScores: {
          Algebra: 80,
          Geometry: 82,
          Trigonometry: 64,
          Calculus: 73,
          Statistics: 81,
        },
      },
    ],
    chapterPerformance: [
      { chapter: "Algebra", struggling: 12, onTrack: 10, excelling: 8 },
      { chapter: "Geometry", struggling: 10, onTrack: 14, excelling: 6 },
      { chapter: "Trigonometry", struggling: 20, onTrack: 8, excelling: 2 },
      { chapter: "Calculus", struggling: 15, onTrack: 10, excelling: 5 },
      { chapter: "Statistics", struggling: 9, onTrack: 13, excelling: 8 },
    ]
  };
  
  // Class 8
  classesData[3] = {
    students: [
      {
        id: 1,
        name: "Ava Taylor",
        profileImage: "/api/placeholder/40/40",
        overallScore: 77,
        status: "On Track",
        weakChapters: ["Statistics"],
        conceptMastery: "Medium",
        chapterScores: {
          Algebra: 82,
          Geometry: 75,
          Trigonometry: 81,
          Calculus: 78,
          Statistics: 69,
        },
      },
      {
        id: 2,
        name: "William Anderson",
        profileImage: "/api/placeholder/40/40",
        overallScore: 61,
        status: "On Track",
        weakChapters: ["Algebra", "Calculus"],
        conceptMastery: "Medium",
        chapterScores: {
          Algebra: 58,
          Geometry: 63,
          Trigonometry: 65,
          Calculus: 57,
          Statistics: 62,
        },
      },
      {
        id: 3,
        name: "Isabella Thomas",
        profileImage: "/api/placeholder/40/40",
        overallScore: 88,
        status: "Excelling",
        weakChapters: [],
        conceptMastery: "High",
        chapterScores: {
          Algebra: 90,
          Geometry: 92,
          Trigonometry: 85,
          Calculus: 87,
          Statistics: 86,
        },
      },
      {
        id: 4,
        name: "Mason Jackson",
        profileImage: "/api/placeholder/40/40",
        overallScore: 53,
        status: "Needs Improvement",
        weakChapters: ["Trigonometry", "Calculus", "Algebra"],
        conceptMastery: "Low",
        chapterScores: {
          Algebra: 50,
          Geometry: 58,
          Trigonometry: 48,
          Calculus: 45,
          Statistics: 64,
        },
      },
      {
        id: 5,
        name: "Charlotte White",
        profileImage: "/api/placeholder/40/40",
        overallScore: 93,
        status: "Excelling",
        weakChapters: [],
        conceptMastery: "High",
        chapterScores: {
          Algebra: 95,
          Geometry: 93,
          Trigonometry: 92,
          Calculus: 90,
          Statistics: 95,
        },
      },
    ],
    chapterPerformance: [
      { chapter: "Algebra", struggling: 13, onTrack: 9, excelling: 8 },
      { chapter: "Geometry", struggling: 6, onTrack: 16, excelling: 8 },
      { chapter: "Trigonometry", struggling: 16, onTrack: 8, excelling: 6 },
      { chapter: "Calculus", struggling: 18, onTrack: 7, excelling: 5 },
      { chapter: "Statistics", struggling: 7, onTrack: 14, excelling: 9 },
    ]
  };
  
  // Class 9
  classesData[4] = {
    students: [
      {
        id: 1,
        name: "Liam Harris",
        profileImage: "/api/placeholder/40/40",
        overallScore: 69,
        status: "On Track",
        weakChapters: ["Calculus", "Trigonometry"],
        conceptMastery: "Medium",
        chapterScores: {
          Algebra: 75,
          Geometry: 72,
          Trigonometry: 63,
          Calculus: 60,
          Statistics: 75,
        },
      },
      {
        id: 2,
        name: "Emma Clark",
        profileImage: "/api/placeholder/40/40",
        overallScore: 84,
        status: "On Track",
        weakChapters: ["Statistics"],
        conceptMastery: "Medium",
        chapterScores: {
          Algebra: 88,
          Geometry: 85,
          Trigonometry: 83,
          Calculus: 86,
          Statistics: 78,
        },
      },
      {
        id: 3,
        name: "Benjamin Lewis",
        profileImage: "/api/placeholder/40/40",
        overallScore: 55,
        status: "Needs Improvement",
        weakChapters: ["Algebra", "Geometry", "Trigonometry"],
        conceptMastery: "Low",
        chapterScores: {
          Algebra: 51,
          Geometry: 53,
          Trigonometry: 49,
          Calculus: 62,
          Statistics: 60,
        },
      },
      {
        id: 4,
        name: "Amelia Young",
        profileImage: "/api/placeholder/40/40",
        overallScore: 97,
        status: "Excelling",
        weakChapters: [],
        conceptMastery: "High",
        chapterScores: {
          Algebra: 98,
          Geometry: 97,
          Trigonometry: 96,
          Calculus: 95,
          Statistics: 99,
        },
      },
      {
        id: 5,
        name: "Lucas Allen",
        profileImage: "/api/placeholder/40/40",
        overallScore: 72,
        status: "On Track",
        weakChapters: ["Calculus"],
        conceptMastery: "Medium",
        chapterScores: {
          Algebra: 76,
          Geometry: 75,
          Trigonometry: 74,
          Calculus: 65,
          Statistics: 70,
        },
      },
    ],
    chapterPerformance: [
      { chapter: "Algebra", struggling: 9, onTrack: 12, excelling: 9 },
      { chapter: "Geometry", struggling: 7, onTrack: 15, excelling: 8 },
      { chapter: "Trigonometry", struggling: 14, onTrack: 10, excelling: 6 },
      { chapter: "Calculus", struggling: 16, onTrack: 8, excelling: 6 },
      { chapter: "Statistics", struggling: 11, onTrack: 11, excelling: 8 },
    ]
  };
  
  // Class 10
  classesData[5] = {
    students: [
      {
        id: 1,
        name: "Mia Scott",
        profileImage: "/api/placeholder/40/40",
        overallScore: 81,
        status: "On Track",
        weakChapters: ["Geometry"],
        conceptMastery: "Medium",
        chapterScores: {
          Algebra: 85,
          Geometry: 73,
          Trigonometry: 82,
          Calculus: 80,
          Statistics: 85,
        },
      },
      {
        id: 2,
        name: "Henry King",
        profileImage: "/api/placeholder/40/40",
        overallScore: 66,
        status: "On Track",
        weakChapters: ["Statistics", "Trigonometry"],
        conceptMastery: "Medium",
        chapterScores: {
          Algebra: 68,
          Geometry: 70,
          Trigonometry: 62,
          Calculus: 67,
          Statistics: 63,
        },
      },
      {
        id: 3,
        name: "Evelyn Wright",
        profileImage: "/api/placeholder/40/40",
        overallScore: 90,
        status: "Excelling",
        weakChapters: [],
        conceptMastery: "High",
        chapterScores: {
          Algebra: 93,
          Geometry: 91,
          Trigonometry: 89,
          Calculus: 88,
          Statistics: 89,
        },
      },
      {
        id: 4,
        name: "Alexander Lopez",
        profileImage: "/api/placeholder/40/40",
        overallScore: 57,
        status: "Needs Improvement",
        weakChapters: ["Algebra", "Trigonometry", "Calculus"],
        conceptMastery: "Low",
        chapterScores: {
          Algebra: 53,
          Geometry: 60,
          Trigonometry: 55,
          Calculus: 52,
          Statistics: 65,
        },
      },
      {
        id: 5,
        name: "Abigail Hill",
        profileImage: "/api/placeholder/40/40",
        overallScore: 75,
        status: "On Track",
        weakChapters: ["Calculus"],
        conceptMastery: "Medium",
        chapterScores: {
          Algebra: 79,
          Geometry: 77,
          Trigonometry: 75,
          Calculus: 68,
          Statistics: 76,
        },
      },
    ],
    chapterPerformance: [
      { chapter: "Algebra", struggling: 11, onTrack: 14, excelling: 5 },
      { chapter: "Geometry", struggling: 9, onTrack: 13, excelling: 8 },
      { chapter: "Trigonometry", struggling: 13, onTrack: 11, excelling: 6 },
      { chapter: "Calculus", struggling: 14, onTrack: 9, excelling: 7 },
      { chapter: "Statistics", struggling: 10, onTrack: 12, excelling: 8 },
    ]
  };
  
  // Generate data for classes 11 and 12 with more variation
  // Class 11
  classesData[6] = {
    students: [
      {
        id: 1,
        name: "Elijah Baker",
        profileImage: "/api/placeholder/40/40",
        overallScore: 88,
        status: "Excelling",
        weakChapters: [],
        conceptMastery: "High",
        chapterScores: {
          Algebra: 90,
          Geometry: 87,
          Trigonometry: 86,
          Calculus: 89,
          Statistics: 88,
        },
      },
      {
        id: 2,
        name: "Scarlett Gonzalez",
        profileImage: "/api/placeholder/40/40",
        overallScore: 72,
        status: "On Track",
        weakChapters: ["Trigonometry"],
        conceptMastery: "Medium",
        chapterScores: {
          Algebra: 75,
          Geometry: 76,
          Trigonometry: 64,
          Calculus: 73,
          Statistics: 72,
        },
      },
      {
        id: 3,
        name: "Logan Nelson",
        profileImage: "/api/placeholder/40/40",
        overallScore: 61,
        status: "On Track",
        weakChapters: ["Algebra", "Geometry"],
        conceptMastery: "Medium",
        chapterScores: {
          Algebra: 58,
          Geometry: 59,
          Trigonometry: 63,
          Calculus: 62,
          Statistics: 63,
        },
      },
      {
        id: 4,
        name: "Aria Carter",
        profileImage: "/api/placeholder/40/40",
        overallScore: 51,
        status: "Needs Improvement",
        weakChapters: ["Algebra", "Geometry", "Calculus", "Trigonometry"],
        conceptMastery: "Low",
        chapterScores: {
          Algebra: 49,
          Geometry: 52,
          Trigonometry: 48,
          Calculus: 50,
          Statistics: 56,
        },
      },
      {
        id: 5,
        name: "Jack Mitchell",
        profileImage: "/api/placeholder/40/40",
        overallScore: 80,
        status: "On Track",
        weakChapters: ["Statistics"],
        conceptMastery: "Medium",
        chapterScores: {
          Algebra: 82,
          Geometry: 81,
          Trigonometry: 83,
          Calculus: 79,
          Statistics: 75,
        },
      },
    ],
    chapterPerformance: [
      { chapter: "Algebra", struggling: 14, onTrack: 10, excelling: 6 },
      { chapter: "Geometry", struggling: 12, onTrack: 12, excelling: 6 },
      { chapter: "Trigonometry", struggling: 18, onTrack: 6, excelling: 6 },
      { chapter: "Calculus", struggling: 15, onTrack: 9, excelling: 6 },
      { chapter: "Statistics", struggling: 13, onTrack: 10, excelling: 7 },
    ]
  };
  
  // Class 12
  classesData[7] = {
    students: [
      {
        id: 1,
        name: "Lily Perez",
        profileImage: "/api/placeholder/40/40",
        overallScore: 93,
        status: "Excelling",
        weakChapters: [],
        conceptMastery: "High",
        chapterScores: {
          Algebra: 95,
          Geometry: 92,
          Trigonometry: 94,
          Calculus: 91,
          Statistics: 93,
        },
      },
      {
        id: 2,
        name: "Gabriel Roberts",
        profileImage: "/api/placeholder/40/40",
        overallScore: 79,
        status: "On Track",
        weakChapters: ["Calculus"],
        conceptMastery: "Medium",
        chapterScores: {
          Algebra: 83,
          Geometry: 80,
          Trigonometry: 81,
          Calculus: 72,
          Statistics: 79,
        },
      },
      {
        id: 3,
        name: "Sofia Phillips",
        profileImage: "/api/placeholder/40/40",
        overallScore: 85,
        status: "On Track",
        weakChapters: ["Trigonometry"],
        conceptMastery: "Medium",
        chapterScores: {
          Algebra: 88,
          Geometry: 87,
          Trigonometry: 79,
          Calculus: 84,
          Statistics: 87,
        },
      },
      {
        id: 4,
        name: "Julian Campbell",
        profileImage: "/api/placeholder/40/40",
        overallScore: 63,
        status: "On Track",
        weakChapters: ["Algebra", "Statistics"],
        conceptMastery: "Medium",
        chapterScores: {
          Algebra: 59,
          Geometry: 65,
          Trigonometry: 64,
          Calculus: 67,
          Statistics: 60,
        },
      },
      {
        id: 5,
        name: "Madison Parker",
        profileImage: "/api/placeholder/40/40",
        overallScore: 48,
        status: "Needs Improvement",
        weakChapters: ["Algebra", "Geometry", "Trigonometry", "Calculus"],
        conceptMastery: "Low",
        chapterScores: {
          Algebra: 45,
          Geometry: 47,
          Trigonometry: 46,
          Calculus: 49,
          Statistics: 53,
        },
      },
    ],
    chapterPerformance: [
      { chapter: "Algebra", struggling: 10, onTrack: 13, excelling: 7 },
      { chapter: "Geometry", struggling: 8, onTrack: 15, excelling: 7 },
      { chapter: "Trigonometry", struggling: 16, onTrack: 9, excelling: 5 },
      { chapter: "Calculus", struggling: 12, onTrack: 12, excelling: 6 },
      { chapter: "Statistics", struggling: 9, onTrack: 14, excelling: 7 },
    ]
  };
  
  return classesData;
};

// Mock data for classes
const classes = [
  { id: 1, name: "Class 6" },
  { id: 2, name: "Class 7" },
  { id: 3, name: "Class 8" },
  { id: 4, name: "Class 9" },
  { id: 5, name: "Class 10" },
  { id: 6, name: "Class 11" },
  { id: 7, name: "Class 12" },
];

// Custom active shape for pie chart
const renderActiveShape = (props) => {
  const { 
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value 
  } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontSize={14} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

const TeacherDash = () => {
  const [classesData] = useState(generateClassData());
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [activeTab, setActiveTab] = useState('chart');
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Update selected student when class changes
  useEffect(() => {
    if (classesData[selectedClass.id]?.students?.length > 0) {
      setSelectedStudent(classesData[selectedClass.id].students[0]);
    }
  }, [selectedClass, classesData]);

  // Ensure we have a selected student
  const currentStudent = selectedStudent || (classesData[selectedClass.id]?.students[0] || null);
  
  // Get current class data
  const currentClassData = classesData[selectedClass.id] || { students: [], chapterPerformance: [] };
  
  // Calculate chapter-wise struggling percentage for the chart
  const chapterStruggleData = currentClassData.chapterPerformance.map((item) => {
    const total = item.struggling + item.onTrack + item.excelling;
    const strugglingPercentage = Math.round((item.struggling / total) * 100);
    return {
      name: item.chapter,
      value: strugglingPercentage,
    };
  });

  // Prepare data for pie chart - Student distribution by status
  const getStatusCounts = () => {
    const statusCounts = { Excelling: 0, "On Track": 0, "Needs Improvement": 0 };
    
    currentClassData.students.forEach(student => {
      statusCounts[student.status]++;
    });
    
    return [
      { name: "Excelling", value: statusCounts["Excelling"] },
      { name: "On Track", value: statusCounts["On Track"] },
      { name: "Needs Improvement", value: statusCounts["Needs Improvement"] }
    ];
  };
  
  const statusData = getStatusCounts();
  
  // Convert chapter scores to array for chart
  const selectedStudentChartData = currentStudent 
    ? Object.entries(currentStudent.chapterScores).map(
        ([chapter, score]) => ({
          name: chapter,
          value: score,
        })
      ) 
    : [];

  // Get status styles for badges
  const getStatusStyles = (status) => {
    switch (status) {
      case "Excelling": return "badge1 badgeExcelling";
      case "On Track": return "badge1 badgeOnTrack";
      case "Needs Improvement": return "badge1 badgeNeedsImprovement";
      default: return "badge1";
    }
  };

  // Get mastery styles for indicators
  const getMasteryStyles = (level) => {
    switch (level) {
      case "High": return "masteryDot masteryHigh";
      case "Medium": return "masteryDot masteryMedium";
      case "Low": return "masteryDot masteryLow";
      default: return "masteryDot";
    }
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div className="appContainer">
      {/* Main Content */}
      <div className="mainContent">
        <div className="flex justifyBetween">
          <div className="pageHeader">
            <h1 className="pageTitle">Gap Analysis Dashboard</h1>
            <p className="pageSubtitle">Monitor student performance and identify learning gaps</p>
          </div>
          
          {/* Class Selector */}
          <div className="classSelector">
            <div 
              className="classDropdownButton"
              onClick={() => setShowClassDropdown(!showClassDropdown)}
            >
              <span>{selectedClass.name}</span>
              <span>▼</span>
            </div>
            {showClassDropdown && (
              <div className="classDropdownContent">
                {classes.map((classItem) => (
                  <div 
                    key={classItem.id} 
                    className="dropdownItem"
                    onClick={() => {
                      setSelectedClass(classItem);
                      setShowClassDropdown(false);
                    }}
                  >
                    {classItem.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div className="cardGrid">
          {/* Chapter-wise Struggling Students */}
          <div className="card">
            <div className="cardHeader">
              <div className="cardTitle">Chapter-wise Struggling Students</div>
              <div className="cardDescription">Percentage of students struggling in each chapter</div>
            </div>
            <div className="cardContent">
              <div className="tabs">
                <div 
                  className={activeTab === 'chart' ? 
                    "tabButton tabButtonActive" : 
                    "tabButton"}
                  onClick={() => setActiveTab('chart')}
                >
                  Chart
                </div>
                <div 
                  className={activeTab === 'table' ? 
                    "tabButton tabButtonActive" : 
                    "tabButton"}
                  onClick={() => setActiveTab('table')}
                >
                  Table
                </div>
              </div>

              {activeTab === 'chart' ? (
                <div style={{height: '300px'}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chapterStruggleData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, "Struggling"]}
                      />
                      <Bar dataKey="value" fill="#ef4444" name="Struggling" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="tableContainer">
                  <table className="dataTable">
                    <thead>
                      <tr>
                        <th className="tableHeader">Chapter</th>
                        <th className="tableHeader">Struggling</th>
                        <th className="tableHeader">On Track</th>
                        <th className="tableHeader">Excelling</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentClassData.chapterPerformance.map((item) => (
                        <tr 
                          key={item.chapter}
                          style={{cursor: 'pointer'}}
                          onClick={() => setSelectedChapter(item.chapter)}
                        >
                          <td className="tableCell fontWeightBold">{item.chapter}</td>
                          <td className="tableCell" style={{color: '#ef4444'}}>{item.struggling}</td>
                          <td className="tableCell" style={{color: '#0284c7'}}>{item.onTrack}</td>
                          <td className="tableCell" style={{color: '#22c55e'}}>{item.excelling}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Student Status Distribution Pie Chart */}
          <div className="card">
            <div className="cardHeader">
              <div className="cardTitle">Student Status Distribution</div>
              <div className="cardDescription">Overview of student performance levels</div>
            </div>
            <div className="cardContent">
              <div style={{height: '300px'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                    >
                      {statusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            entry.name === "Excelling" ? "#22c55e" : 
                            entry.name === "On Track" ? "#0284c7" : 
                            "#ef4444"
                          } 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} students`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="statusSummary mt2">
                <div className="flex justifyBetween">
                  <div>
                    <span className="badge1 badgeExcelling">Excelling</span>
                    <span className="mx2">{statusData[0].value} students</span>
                  </div>
                  <div>
                    <span className="badge1 badgeOnTrack">On Track</span>
                    <span className="mx2">{statusData[1].value} students</span>
                  </div>
                  <div>
                    <span className="badge1 badgeNeedsImprovement">Needs Improvement</span>
                    <span className="mx2">{statusData[2].value} students</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cardGrid">
          {/* Student Performance Table */}
          <div className="card wideCard">
            <div className="cardHeader">
              <div className="cardTitle">Student Performance</div>
              <div className="cardDescription">Overview of all students in {selectedClass.name}</div>
            </div>
            <div className="cardContent">
              <div className="tableContainer">
                <table className="dataTable">
                  <thead>
                    <tr>
                      <th className="tableHeader">Student</th>
                      <th className="tableHeader">Overall Score</th>
                      <th className="tableHeader">Status</th>
                      <th className="tableHeader">Weak Chapters</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentClassData.students.map((student) => (
                      <tr 
                        key={student.id} 
                        className={currentStudent && currentStudent.id === student.id ? "tableCell selectedRow" : "tableCell"}
                        onClick={() => setSelectedStudent(student)}
                      >
                        <td className="tableCell">
                          <div className="flex itemsCenter">
                            <span className="mx2">{student.name}</span>
                          </div>
                        </td>
                        <td className="tableCell">
                          <div className="progressContainer">
                            <div className="progressBar">
                              <div 
                                className="progressFill"
                                style={{
                                  width: `${student.overallScore}%`,
                                  backgroundColor: student.overallScore < 60 ? '#ef4444' : '#0284c7'
                                }}
                              ></div>
                            </div>
                            <span>{student.overallScore}%</span>
                          </div>
                        </td>
                        <td className="tableCell">
                          <span className={getStatusStyles(student.status)}>
                            {student.status}
                          </span>
                        </td>
                        <td className="tableCell">
                          {student.weakChapters.length > 0 
                            ? student.weakChapters.join(', ') 
                            : <span className="success">None</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Student Profile */}
          {currentStudent && (
            <div className="card">
              <div className="cardHeader">
                <div className="cardTitle">Student Profile</div>
                <div className="cardDescription">Detailed analysis for selected student</div>
              </div>
              <div className="cardContent">
                <div className="flex itemsCenter">
                  <div className="mx2">
                    <div className="cardTitle">{currentStudent.name}</div>
                    <span className={getStatusStyles(currentStudent.status)}>
                      {currentStudent.status}
                    </span>
                  </div>
                </div>

                <div className="separator"></div>

                <div>
                  <h4 className="mb2">
                    {currentStudent.weakChapters.length > 0 
                      ? "Weak Chapters" 
                      : "Top Performing Chapters"}
                  </h4>
                  <div className="flex flexCol gap2">
                    {currentStudent.weakChapters.length > 0 
                      ? currentStudent.weakChapters.map((chapter) => (
                          <div key={chapter} className="flex justifyBetween">
                            <span>{chapter}</span>
                            <span className="fontWeightBold">{currentStudent.chapterScores[chapter]}%</span>
                          </div>
                        ))
                      : Object.entries(currentStudent.chapterScores)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 3)
                          .map(([chapter, score]) => (
                            <div key={chapter} className="flex justifyBetween">
                              <span>{chapter}</span>
                              <span className="fontWeightBold success">{score}%</span>
                            </div>
                          ))
                    }
                  </div>
                </div>

                <div className="separator"></div>

                <div>
                  <h4 className="mb2">Concept Mastery</h4>
                  <div className="masteryIndicator">
                    <div className={getMasteryStyles(currentStudent.conceptMastery)}></div>
                    <span>{currentStudent.conceptMastery}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="cardGrid">
          {/* Gap Analysis Chart */}
          {currentStudent && (
            <div className="card">
              <div className="cardHeader">
                <div className="cardTitle">Gap Analysis</div>
                <div className="cardDescription">Chapter-wise performance for {currentStudent.name}</div>
              </div>
              <div className="cardContent">
                <div style={{height: '300px'}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={selectedStudentChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, "Score"]}
                      />
                      <Bar dataKey="value" fill="#0284c7" name="Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chapter Drill-Down Section */}
        {selectedChapter && (
          <div className="card chapterCard">
            <div className="cardHeader chapterHeader">
              <div className="flex justifyBetween">
                <div>
                  <div className="cardTitle chapterTitle">Chapter Drill-Down: {selectedChapter}</div>
                  <div className="cardDescription">Topic-wise performance analysis</div>
                </div>
                <button 
                  className="btn btnOutline"
                  onClick={() => setSelectedChapter(null)}
                >
                  Close
                </button>
              </div>
            </div>
            <div className="cardContent">
              <div className="chapterGrid">
                <div>
                  <h3 className="mb4">Topic Performance</h3>
                  <div className="topicItem">
                    <div className="topicHeader">
                      <span className="topicName">Topic 1</span>
                      <span className="topicScore">68%</span>
                    </div>
                    <div className="progressBar">
                      <div className="progressFill" style={{width: '68%'}}></div>
                    </div>
                  </div>
                  <div className="topicItem">
                    <div className="topicHeader">
                      <span className="topicName">Topic 2</span>
                      <span className="topicScore" style={{color: '#ef4444'}}>45%</span>
                    </div>
                    <div className="progressBar">
                      <div className="progressFill progressLow" style={{width: '45%'}}></div>
                    </div>
                  </div>
                  <div className="topicItem">
                    <div className="topicHeader">
                      <span className="topicName">Topic 3</span>
                      <span className="topicScore">82%</span>
                    </div>
                    <div className="progressBar">
                      <div className="progressFill" style={{width: '82%'}}></div>
                    </div>
                  </div>
                  <div className="topicItem">
                    <div className="topicHeader">
                      <span className="topicName">Topic 4</span>
                      <span className="topicScore">73%</span>
                    </div>
                    <div className="progressBar">
                      <div className="progressFill" style={{width: '73%'}}></div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="mb4">Struggling Students</h3>
                  <div className="tableContainer">
                    <table className="dataTable">
                      <thead>
                        <tr>
                          <th className="tableHeader">Student</th>
                          <th className="tableHeader">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentClassData.students
                          .filter((student) => student.weakChapters.includes(selectedChapter))
                          .map((student) => (
                            <tr key={student.id}>
                              <td className="tableCell">{student.name}</td>
                              <td className="tableCell">{student.chapterScores[selectedChapter]}%</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDash;