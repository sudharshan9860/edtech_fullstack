import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faChartLine,
  faBook,
  faSchool,
  faCog,
  faFileExport,
  faDatabase,
  faDashboard,
  faChalkboardTeacher,
  faGraduationCap,
  faUserShield,
  faBell,
  faArrowUp,
  faArrowDown,
  faCheckCircle,
  faExclamationTriangle,
  faSpinner,
  faEye,
  faEdit,
  faTrash,
  faPlus,
  faSearch,
  faUpload,
  faDownload,
  faUserPlus,
  faClipboardList,
  faCalendarAlt,
  faMedal,
  faFileImport,
  faUserGraduate,
  faUserTie,
  faClipboard
} from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showAssignTeacherModal, setShowAssignTeacherModal] = useState(false);
  
  // Enhanced data structure for classes 6-12
  const [classData] = useState({
    6: {
      sections: {
        A: { students: 45, teacher: 'Ms. Sarah Johnson', subjects: ['Math', 'Science', 'English'] },
        B: { students: 42, teacher: 'Mr. David Wilson', subjects: ['Math', 'Science', 'Social'] },
        C: { students: 40, teacher: 'Ms. Emily Davis', subjects: ['Math', 'English', 'Hindi'] },
        D: { students: 38, teacher: 'Mr. James Brown', subjects: ['Science', 'Social', 'English'] },
        E: { students: 35, teacher: 'Ms. Lisa Chen', subjects: ['Math', 'Science', 'Computer'] },
        F: { students: 33, teacher: 'Mr. Robert Taylor', subjects: ['English', 'Social', 'Art'] }
      }
    },
    7: {
      sections: {
        A: { students: 48, teacher: 'Dr. Michael Smith', subjects: ['Math', 'Science', 'English'] },
        B: { students: 45, teacher: 'Ms. Jennifer Lee', subjects: ['Math', 'Science', 'Social'] },
        C: { students: 43, teacher: 'Mr. Thomas Anderson', subjects: ['Math', 'English', 'Hindi'] },
        D: { students: 41, teacher: 'Ms. Maria Rodriguez', subjects: ['Science', 'Social', 'English'] },
        E: { students: 39, teacher: 'Mr. Kevin Wong', subjects: ['Math', 'Science', 'Computer'] },
        F: { students: 37, teacher: 'Ms. Rachel Green', subjects: ['English', 'Social', 'Music'] }
      }
    },
    8: {
      sections: {
        A: { students: 50, teacher: 'Dr. Patricia Miller', subjects: ['Math', 'Science', 'English'] },
        B: { students: 47, teacher: 'Mr. Christopher Davis', subjects: ['Math', 'Physics', 'Chemistry'] },
        C: { students: 45, teacher: 'Ms. Amanda Wilson', subjects: ['Biology', 'English', 'Hindi'] },
        D: { students: 43, teacher: 'Mr. Daniel Moore', subjects: ['Math', 'Social', 'English'] },
        E: { students: 41, teacher: 'Ms. Nicole Brown', subjects: ['Science', 'Computer', 'Math'] },
        F: { students: 39, teacher: 'Mr. Andrew Clark', subjects: ['English', 'Social', 'PE'] }
      }
    },
    9: {
      sections: {
        A: { students: 52, teacher: 'Dr. Elizabeth Johnson', subjects: ['Math', 'Physics', 'Chemistry'] },
        B: { students: 49, teacher: 'Mr. William Garcia', subjects: ['Biology', 'English', 'Social'] },
        C: { students: 47, teacher: 'Ms. Jessica Martinez', subjects: ['Math', 'Computer', 'English'] },
        D: { students: 45, teacher: 'Mr. Richard Lee', subjects: ['Physics', 'Chemistry', 'Math'] },
        E: { students: 43, teacher: 'Ms. Helen Davis', subjects: ['Biology', 'English', 'Hindi'] },
        F: { students: 41, teacher: 'Mr. Joseph Wilson', subjects: ['Math', 'Social', 'PE'] }
      }
    },
    10: {
      sections: {
        A: { students: 48, teacher: 'Dr. Margaret Thompson', subjects: ['Math', 'Physics', 'Chemistry'] },
        B: { students: 46, teacher: 'Mr. Charles Anderson', subjects: ['Biology', 'English', 'Computer'] },
        C: { students: 44, teacher: 'Ms. Linda Taylor', subjects: ['Math', 'Social', 'English'] },
        D: { students: 42, teacher: 'Mr. Paul Martinez', subjects: ['Physics', 'Chemistry', 'Math'] },
        E: { students: 40, teacher: 'Ms. Karen Rodriguez', subjects: ['Biology', 'Hindi', 'English'] },
        F: { students: 38, teacher: 'Mr. Mark Johnson', subjects: ['Computer', 'Math', 'Social'] }
      }
    },
    11: {
      sections: {
        A: { students: 45, teacher: 'Dr. Susan Williams', subjects: ['Math', 'Physics', 'Chemistry'] },
        B: { students: 43, teacher: 'Mr. Robert Jones', subjects: ['Biology', 'Chemistry', 'Physics'] },
        C: { students: 41, teacher: 'Ms. Michelle Brown', subjects: ['Economics', 'Business', 'English'] },
        D: { students: 39, teacher: 'Mr. Steven Davis', subjects: ['History', 'Geography', 'Political Science'] },
        E: { students: 37, teacher: 'Ms. Laura Wilson', subjects: ['Computer Science', 'Math', 'Physics'] },
        F: { students: 35, teacher: 'Mr. Brian Miller', subjects: ['Arts', 'English', 'Psychology'] }
      }
    },
    12: {
      sections: {
        A: { students: 42, teacher: 'Dr. Dorothy Garcia', subjects: ['Math', 'Physics', 'Chemistry'] },
        B: { students: 40, teacher: 'Mr. Anthony Martinez', subjects: ['Biology', 'Chemistry', 'Physics'] },
        C: { students: 38, teacher: 'Ms. Nancy Rodriguez', subjects: ['Economics', 'Business Studies', 'Accountancy'] },
        D: { students: 36, teacher: 'Mr. Kenneth Lee', subjects: ['History', 'Geography', 'Political Science'] },
        E: { students: 34, teacher: 'Ms. Betty Anderson', subjects: ['Computer Science', 'Math', 'Informatics'] },
        F: { students: 32, teacher: 'Mr. Edward Taylor', subjects: ['Arts', 'English Literature', 'Philosophy'] }
      }
    }
  });

  // Sample student data
  const [students] = useState([
    {
      id: 1,
      name: 'Aarav Sharma',
      rollNumber: 'CL6A001',
      class: '6',
      section: 'A',
      email: 'aarav.sharma@school.edu',
      phone: '+91 98765 43210',
      guardian: 'Mr. Rajesh Sharma',
      address: '123 MG Road, Mumbai',
      admissionDate: '2024-04-15',
      status: 'active',
      academicRecord: {
        unitTest1: { math: 85, science: 78, english: 82 },
        unitTest2: { math: 88, science: 80, english: 85 },
        halfYearly: { math: 86, science: 79, english: 84 },
        unitTest3: { math: 90, science: 82, english: 87 },
        unitTest4: { math: 92, science: 85, english: 89 },
        quarterly: { math: 89, science: 83, english: 86 },
        overall: 85.5
      }
    },
    {
      id: 2,
      name: 'Priya Patel',
      rollNumber: 'CL7B002',
      class: '7',
      section: 'B',
      email: 'priya.patel@school.edu',
      phone: '+91 87654 32109',
      guardian: 'Mrs. Meera Patel',
      address: '456 Park Street, Delhi',
      admissionDate: '2024-04-16',
      status: 'active',
      academicRecord: {
        unitTest1: { math: 92, science: 88, english: 85 },
        unitTest2: { math: 94, science: 90, english: 87 },
        halfYearly: { math: 93, science: 89, english: 86 },
        unitTest3: { math: 95, science: 91, english: 88 },
        unitTest4: { math: 96, science: 93, english: 90 },
        quarterly: { math: 94, science: 91, english: 88 },
        overall: 91.2
      }
    }
  ]);

  // Enhanced dashboard metrics
  const [dashboardData] = useState({
    metrics: {
      totalStudents: 2847,
      activeTeachers: 156,
      totalClasses: 42, // 7 grades × 6 sections
      systemUptime: '99.9%',
      totalAssignments: 892,
      completedAssignments: 7653,
      avgPerformance: 87.3,
      monthlyGrowth: 12.5,
      pendingAdmissions: 23,
      examScheduled: 15,
      parentMeetings: 8
    },
    recentActivity: [
      {
        id: 1,
        type: 'student_admission',
        message: 'New student "Arjun Patel" admitted to Class 9-A',
        timestamp: '2 minutes ago',
        icon: faUserPlus,
        color: 'success'
      },
      {
        id: 2,
        type: 'exam_scheduled',
        message: 'Unit Test 1 scheduled for Class 10 (Math)',
        timestamp: '15 minutes ago',
        icon: faClipboardList,
        color: 'info'
      },
      {
        id: 3,
        type: 'teacher_assigned',
        message: 'Ms. Priya Singh assigned to Class 8-C (Science)',
        timestamp: '1 hour ago',
        icon: faChalkboardTeacher,
        color: 'success'
      },
      {
        id: 4,
        type: 'performance_alert',
        message: 'Class 12-A performance improved by 8.5%',
        timestamp: '2 hours ago',
        icon: faChartLine,
        color: 'info'
      }
    ]
  });

  const adminTabs = [
    { key: 'overview', label: 'Dashboard', icon: faDashboard },
    { key: 'classes', label: 'Class Management', icon: faSchool },
    { key: 'students', label: 'Student Management', icon: faUsers },
    { key: 'teachers', label: 'Teacher Management', icon: faChalkboardTeacher },
    { key: 'academics', label: 'Academic Records', icon: faClipboardList },
    { key: 'examinations', label: 'Examinations', icon: faClipboard },
    { key: 'reports', label: 'Reports & Analytics', icon: faChartLine },
    { key: 'configuration', label: 'Settings', icon: faCog }
  ];

  const MetricCard = ({ title, value, icon, color, change, trend }) => (
    <div className="metric-card">
      <div className="metric-header">
        <div className={`metric-icon text-${color}`}>
          <FontAwesomeIcon icon={icon} />
        </div>
        {change && (
          <div className={`metric-change text-${trend === 'up' ? 'success' : 'danger'}`}>
            <FontAwesomeIcon icon={trend === 'up' ? faArrowUp : faArrowDown} />
            {change}%
          </div>
        )}
      </div>
      <div className="metric-content">
        <div className="metric-value">{value}</div>
        <div className="metric-label">{title}</div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="overview-content">
      {/* Enhanced Metrics */}
      <div className="metrics-grid">
        <MetricCard
          title="Total Students"
          value={dashboardData.metrics.totalStudents.toLocaleString()}
          icon={faUsers}
          color="primary"
          change={8.2}
          trend="up"
        />
        <MetricCard
          title="Active Teachers"
          value={dashboardData.metrics.activeTeachers}
          icon={faChalkboardTeacher}
          color="success"
          change={4.1}
          trend="up"
        />
        <MetricCard
          title="Classes"
          value={dashboardData.metrics.totalClasses}
          icon={faGraduationCap}
          color="warning"
        />
        <MetricCard
          title="Pending Admissions"
          value={dashboardData.metrics.pendingAdmissions}
          icon={faUserPlus}
          color="info"
        />
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Recent Activity */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <FontAwesomeIcon icon={faBell} />
          </div>
          <div className="card-content">
            <div className="activity-list">
              {dashboardData.recentActivity.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon text-${activity.color}`}>
                    <FontAwesomeIcon icon={activity.icon} />
                  </div>
                  <div className="activity-content">
                    <p className="activity-message">{activity.message}</p>
                    <small className="activity-time">{activity.timestamp}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
            <FontAwesomeIcon icon={faClipboardList} />
          </div>
          <div className="card-content">
            <div className="quick-actions">
              <button className="action-button" onClick={() => setActiveTab('students')}>
                <FontAwesomeIcon icon={faUserPlus} />
                <span>Add Student</span>
              </button>
              <button className="action-button" onClick={() => setActiveTab('teachers')}>
                <FontAwesomeIcon icon={faChalkboardTeacher} />
                <span>Assign Teacher</span>
              </button>
              <button className="action-button" onClick={() => setActiveTab('examinations')}>
                <FontAwesomeIcon icon={faClipboard} />
                <span>Schedule Exam</span>
              </button>
              <button className="action-button" onClick={() => setActiveTab('reports')}>
                <FontAwesomeIcon icon={faChartLine} />
                <span>View Reports</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClassManagement = () => (
    <div className="class-management">
      <div className="section-header">
        <h2>Class Management (Grades 6-12)</h2>
        <div className="header-actions">
          <select 
            className="class-filter"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select Class</option>
            {Object.keys(classData).map(grade => (
              <option key={grade} value={grade}>Class {grade}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="classes-grid">
        {Object.entries(classData).map(([grade, gradeInfo]) => (
          <div key={grade} className="class-card">
            <div className="class-header">
              <h3>Class {grade}</h3>
              <span className="total-students">
                {Object.values(gradeInfo.sections).reduce((sum, section) => sum + section.students, 0)} Students
              </span>
            </div>
            <div className="sections-grid">
              {Object.entries(gradeInfo.sections).map(([section, sectionInfo]) => (
                <div key={section} className="section-card">
                  <div className="section-header">
                    <h4>Section {section}</h4>
                    <span className="student-count">{sectionInfo.students} students</span>
                  </div>
                  <div className="section-details">
                    <p><strong>Class Teacher:</strong> {sectionInfo.teacher}</p>
                    <p><strong>Subjects:</strong> {sectionInfo.subjects.join(', ')}</p>
                  </div>
                  <div className="section-actions">
                    <button className="btn-small btn-primary">
                      <FontAwesomeIcon icon={faEye} /> View Students
                    </button>
                    <button className="btn-small btn-secondary">
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStudentManagement = () => (
    <div className="student-management">
      <div className="section-header">
        <h2>Student Management</h2>
        <div className="header-actions">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} />
            <input type="text" placeholder="Search students..." />
          </div>
          <button className="btn btn-outline" onClick={() => setShowBulkUploadModal(true)}>
            <FontAwesomeIcon icon={faUpload} />
            Bulk Upload (CSV)
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddStudentModal(true)}>
            <FontAwesomeIcon icon={faUserPlus} />
            Add Individual Student
          </button>
        </div>
      </div>

      <div className="filter-section">
        <select onChange={(e) => setSelectedClass(e.target.value)} value={selectedClass}>
          <option value="">All Classes</option>
          {Object.keys(classData).map(grade => (
            <option key={grade} value={grade}>Class {grade}</option>
          ))}
        </select>
        <select onChange={(e) => setSelectedSection(e.target.value)} value={selectedSection}>
          <option value="">All Sections</option>
          {['A', 'B', 'C', 'D', 'E', 'F'].map(section => (
            <option key={section} value={section}>Section {section}</option>
          ))}
        </select>
      </div>

      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Guardian</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.rollNumber}</td>
                <td>
                  <div className="student-info">
                    <strong>{student.name}</strong>
                    <small>{student.email}</small>
                  </div>
                </td>
                <td>{student.class}-{student.section}</td>
                <td>{student.guardian}</td>
                <td>{student.phone}</td>
                <td>
                  <span className={`status-badge status-${student.status}`}>
                    {student.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn view">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button className="action-btn edit">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="action-btn delete">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTeacherManagement = () => (
    <div className="teacher-management">
      <div className="section-header">
        <h2>Teacher Management & Assignment</h2>
        <button className="btn btn-primary" onClick={() => setShowAssignTeacherModal(true)}>
          <FontAwesomeIcon icon={faUserTie} />
          Assign Teacher to Class
        </button>
      </div>

      <div className="teacher-assignments">
        <h3>Current Teacher Assignments</h3>
        <div className="assignments-grid">
          {Object.entries(classData).map(([grade, gradeInfo]) => (
            <div key={grade} className="grade-assignment">
              <h4>Class {grade}</h4>
              <div className="section-assignments">
                {Object.entries(gradeInfo.sections).map(([section, sectionInfo]) => (
                  <div key={section} className="assignment-card">
                    <div className="assignment-header">
                      <span className="section-label">Section {section}</span>
                      <span className="student-count">{sectionInfo.students} students</span>
                    </div>
                    <div className="teacher-info">
                      <FontAwesomeIcon icon={faChalkboardTeacher} />
                      <span>{sectionInfo.teacher}</span>
                    </div>
                    <div className="subjects-info">
                      <strong>Subjects:</strong> {sectionInfo.subjects.join(', ')}
                    </div>
                    <div className="assignment-actions">
                      <button className="btn-small btn-outline">
                        <FontAwesomeIcon icon={faEdit} /> Reassign
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAcademicRecords = () => (
    <div className="academic-records">
      <div className="section-header">
        <h2>Academic Records & Performance</h2>
        <div className="header-actions">
          <select>
            <option value="">Select Academic Year</option>
            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
            <option value="2022-23">2022-23</option>
          </select>
        </div>
      </div>

      <div className="exam-types">
        <div className="exam-card">
          <h3>Unit Tests</h3>
          <div className="exam-grid">
            <div className="exam-item">
              <span>Unit Test 1</span>
              <span className="exam-status completed">Completed</span>
            </div>
            <div className="exam-item">
              <span>Unit Test 2</span>
              <span className="exam-status completed">Completed</span>
            </div>
            <div className="exam-item">
              <span>Unit Test 3</span>
              <span className="exam-status upcoming">Upcoming</span>
            </div>
            <div className="exam-item">
              <span>Unit Test 4</span>
              <span className="exam-status pending">Pending</span>
            </div>
          </div>
        </div>

        <div className="exam-card">
          <h3>Major Examinations</h3>
          <div className="exam-grid">
            <div className="exam-item">
              <span>Half Yearly</span>
              <span className="exam-status completed">Completed</span>
            </div>
            <div className="exam-item">
              <span>Quarterly</span>
              <span className="exam-status upcoming">Upcoming</span>
            </div>
            <div className="exam-item">
              <span>Final Examination</span>
              <span className="exam-status pending">Pending</span>
            </div>
          </div>
        </div>
      </div>

      <div className="student-performance">
        <h3>Individual Student Performance</h3>
        <div className="performance-table-container">
          <table className="performance-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Unit Test 1</th>
                <th>Unit Test 2</th>
                <th>Half Yearly</th>
                <th>Unit Test 3</th>
                <th>Unit Test 4</th>
                <th>Quarterly</th>
                <th>Overall %</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>
                    <div className="student-cell">
                      <strong>{student.name}</strong>
                      <small>{student.rollNumber}</small>
                    </div>
                  </td>
                  <td>{student.academicRecord.unitTest1.math}%</td>
                  <td>{student.academicRecord.unitTest2.math}%</td>
                  <td>{student.academicRecord.halfYearly.math}%</td>
                  <td>{student.academicRecord.unitTest3.math}%</td>
                  <td>{student.academicRecord.unitTest4.math}%</td>
                  <td>{student.academicRecord.quarterly.math}%</td>
                  <td>
                    <span className={`performance-badge ${student.academicRecord.overall >= 90 ? 'excellent' : student.academicRecord.overall >= 75 ? 'good' : 'average'}`}>
                      {student.academicRecord.overall}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderExaminations = () => (
    <div className="examinations">
      <div className="section-header">
        <h2>Examination Management</h2>
        <button className="btn btn-primary">
          <FontAwesomeIcon icon={faCalendarAlt} />
          Schedule New Exam
        </button>
      </div>

      <div className="exam-schedule">
        <h3>Upcoming Examinations</h3>
        <div className="schedule-grid">
          <div className="schedule-card">
            <div className="schedule-header">
              <h4>Unit Test 3</h4>
              <span className="schedule-date">March 15-20, 2025</span>
            </div>
            <div className="schedule-details">
              <p><strong>Classes:</strong> 6-12 (All Sections)</p>
              <p><strong>Subjects:</strong> Math, Science, English</p>
              <p><strong>Duration:</strong> 2 hours each</p>
            </div>
            <div className="schedule-actions">
              <button className="btn-small btn-primary">View Details</button>
              <button className="btn-small btn-outline">Edit Schedule</button>
            </div>
          </div>

          <div className="schedule-card">
            <div className="schedule-header">
              <h4>Quarterly Examination</h4>
              <span className="schedule-date">June 1-15, 2025</span>
            </div>
            <div className="schedule-details">
              <p><strong>Classes:</strong> 9-12 (All Sections)</p>
              <p><strong>Subjects:</strong> All Core Subjects</p>
              <p><strong>Duration:</strong> 3 hours each</p>
            </div>
            <div className="schedule-actions">
              <button className="btn-small btn-primary">View Details</button>
              <button className="btn-small btn-outline">Edit Schedule</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="reports">
      <div className="section-header">
        <h2>Reports & Analytics</h2>
        <div className="header-actions">
          <button className="btn btn-outline">
            <FontAwesomeIcon icon={faDownload} />
            Export Report
          </button>
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <div className="report-header">
            <FontAwesomeIcon icon={faChartLine} />
            <h3>Academic Performance</h3>
          </div>
          <div className="report-content">
            <p>Overall class performance trends and analytics</p>
            <button className="btn-small btn-primary">Generate Report</button>
          </div>
        </div>

        <div className="report-card">
          <div className="report-header">
            <FontAwesomeIcon icon={faUsers} />
            <h3>Attendance Report</h3>
          </div>
          <div className="report-content">
            <p>Student and teacher attendance analytics</p>
            <button className="btn-small btn-primary">Generate Report</button>
          </div>
        </div>

        <div className="report-card">
          <div className="report-header">
            <FontAwesomeIcon icon={faMedal} />
            <h3>Achievement Report</h3>
          </div>
          <div className="report-content">
            <p>Student achievements and recognition</p>
            <button className="btn-small btn-primary">Generate Report</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComingSoon = (feature) => (
    <div className="coming-soon">
      <div className="coming-soon-content">
        <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
        <h3>{feature} Module</h3>
        <p>This feature is currently under development and will be available soon.</p>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard-container">
      <div className="admin-content-wrapper">
        {/* Admin Sidebar */}
        <div className="admin-sidebar">
          <div className="sidebar-header">
            <FontAwesomeIcon icon={faUserShield} />
            <h2>Admin Panel</h2>
            <p>AI Educator Platform</p>
          </div>
          
          <nav className="sidebar-nav">
            {adminTabs.map((tab) => (
              <button
                key={tab.key}
                className={`nav-item ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <FontAwesomeIcon icon={tab.icon} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="admin-main-content">
          <div className="main-header">
            <h1>
              {adminTabs.find(tab => tab.key === activeTab)?.label}
            </h1>
            <p>Comprehensive school management and administrative control</p>
          </div>

          <div className="main-content">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'classes' && renderClassManagement()}
            {activeTab === 'students' && renderStudentManagement()}
            {activeTab === 'teachers' && renderTeacherManagement()}
            {activeTab === 'academics' && renderAcademicRecords()}
            {activeTab === 'examinations' && renderExaminations()}
            {activeTab === 'reports' && renderReports()}
            {activeTab === 'configuration' && renderComingSoon('Configuration')}
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard-container {
          min-height: calc(100vh - 60px);
          height: calc(100vh - 60px);
          background: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          display: flex;
          flex-direction: column;
          margin: 0;
          padding: 0;
        }

        .admin-content-wrapper {
          display: flex;
          flex: 1;
          width: 100vw;
          height: 100%;
          margin: 0;
          padding: 0;
        }

        .admin-sidebar {
          width: 280px;
          background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
          color: white;
          overflow-y: auto;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
        }

        .sidebar-header {
          padding: 2rem 1.5rem;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.2);
        }

        .sidebar-header svg {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #3b82f6;
        }

        .sidebar-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0.5rem 0;
        }

        .sidebar-header p {
          font-size: 0.9rem;
          opacity: 0.8;
          margin: 0;
        }

        .sidebar-nav {
          padding: 1rem 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          color: #cbd5e1;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 1rem;
          font-weight: 500;
          border-left: 3px solid transparent;
          cursor: pointer;
          text-align: left;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          transform: translateX(5px);
        }

        .nav-item.active {
          background: rgba(59, 130, 246, 0.2);
          color: #ffffff;
          border-left-color: #3b82f6;
        }

        .nav-item svg {
          margin-right: 0.75rem;
          width: 1.25rem;
          flex-shrink: 0;
        }

        .admin-main-content {
          flex: 1;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          min-height: 0;
          width: 100%;
        }

        .main-header {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          padding: 2rem;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .main-header h1 {
          color: #1e293b;
          font-weight: 700;
          font-size: 2rem;
          margin: 0 0 0.5rem 0;
        }

        .main-header p {
          color: #64748b;
          margin: 0;
        }

        .main-content {
          padding: 0;
          flex: 1;
          overflow-y: auto;
          width: 100%;
        }

        /* Overview Content */
        .overview-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
          padding: 1.5rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
          width: 100%;
        }

        .metric-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .metric-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .metric-icon {
          font-size: 2rem;
          opacity: 0.8;
        }

        .metric-change {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .metric-content {
          text-align: center;
        }

        .metric-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .metric-label {
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          width: 100%;
        }

        .dashboard-card {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .card-header {
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
          border-bottom: 1px solid #e2e8f0;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .card-content {
          padding: 1.5rem;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          background: #f1f5f9;
          transform: translateX(5px);
        }

        .activity-icon {
          font-size: 1.25rem;
          padding: 0.5rem;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.8);
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
        }

        .activity-message {
          font-weight: 500;
          color: #374151;
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
        }

        .activity-time {
          color: #9ca3af;
          font-size: 0.8rem;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .action-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #374151;
          font-weight: 500;
        }

        .action-button:hover {
          background: #3b82f6;
          color: white;
          transform: translateY(-2px);
        }

        /* Class Management */
        .class-management {
          width: 100%;
          padding: 1.5rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .section-header h2 {
          color: #1e293b;
          font-weight: 700;
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .class-filter {
          padding: 0.5rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .classes-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .class-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .class-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .class-header h3 {
          color: #1e293b;
          font-weight: 600;
          margin: 0;
        }

        .total-students {
          background: #3b82f6;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .sections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .section-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .section-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .section-header h4 {
          color: #1e293b;
          font-weight: 600;
          margin: 0;
        }

        .student-count {
          background: #10b981;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
        }

        .section-details {
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .section-details p {
          margin: 0.25rem 0;
        }

        .section-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-small {
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .btn-small.btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-small.btn-secondary {
          background: #6b7280;
          color: white;
        }

        .btn-small.btn-outline {
          background: transparent;
          border: 1px solid #e2e8f0;
          color: #6b7280;
        }

        /* Student Management */
        .student-management {
          width: 100%;
          padding: 1.5rem;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-box svg {
          position: absolute;
          left: 1rem;
          color: #9ca3af;
        }

        .search-box input {
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          min-width: 250px;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
        }

        .btn-outline {
          background: transparent;
          border: 2px solid #3b82f6;
          color: #3b82f6;
        }

        .filter-section {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .filter-section select {
          padding: 0.5rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .students-table-container {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .students-table {
          width: 100%;
          border-collapse: collapse;
        }

        .students-table thead th {
          background: #f8fafc;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #374151;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #e2e8f0;
        }

        .students-table tbody td {
          padding: 1rem;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .students-table tbody tr:hover {
          background: #f8fafc;
        }

        .student-info strong {
          display: block;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .student-info small {
          color: #6b7280;
          font-size: 0.8rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-active {
          background: #dcfce7;
          color: #166534;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: white;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn.view:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .action-btn.edit:hover {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }

        .action-btn.delete:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }

        /* Teacher Management */
        .teacher-management {
          width: 100%;
          padding: 1.5rem;
        }

        .teacher-assignments h3 {
          color: #1e293b;
          margin-bottom: 1.5rem;
        }

        .assignments-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .grade-assignment h4 {
          color: #3b82f6;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .section-assignments {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .assignment-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .assignment-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .assignment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .section-label {
          font-weight: 600;
          color: #1e293b;
        }

        .teacher-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          color: #10b981;
          font-weight: 500;
        }

        .subjects-info {
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        /* Academic Records */
        .academic-records {
          width: 100%;
          padding: 1.5rem;
        }

        .exam-types {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .exam-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .exam-card h3 {
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .exam-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .exam-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .exam-status {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .exam-status.completed {
          background: #dcfce7;
          color: #166534;
        }

        .exam-status.upcoming {
          background: #dbeafe;
          color: #1e40af;
        }

        .exam-status.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .performance-table-container {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .performance-table {
          width: 100%;
          border-collapse: collapse;
        }

        .performance-table thead th {
          background: #f8fafc;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #374151;
          font-size: 0.8rem;
          text-transform: uppercase;
          border-bottom: 2px solid #e2e8f0;
        }

        .performance-table tbody td {
          padding: 1rem;
          border-bottom: 1px solid #f1f5f9;
          text-align: center;
        }

        .student-cell strong {
          display: block;
          color: #1e293b;
        }

        .student-cell small {
          color: #6b7280;
        }

        .performance-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .performance-badge.excellent {
          background: #dcfce7;
          color: #166534;
        }

        .performance-badge.good {
          background: #dbeafe;
          color: #1e40af;
        }

        .performance-badge.average {
          background: #fef3c7;
          color: #92400e;
        }

        /* Examinations */
        .examinations {
          width: 100%;
          padding: 1.5rem;
        }

        .schedule-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .schedule-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .schedule-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .schedule-header h4 {
          color: #1e293b;
          margin: 0;
        }

        .schedule-date {
          background: #3b82f6;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .schedule-details {
          margin-bottom: 1.5rem;
          color: #6b7280;
        }

        .schedule-details p {
          margin: 0.5rem 0;
        }

        .schedule-actions {
          display: flex;
          gap: 0.75rem;
        }

        /* Reports */
        .reports {
          width: 100%;
          padding: 1.5rem;
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .report-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .report-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .report-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          color: #3b82f6;
        }

        .report-header svg {
          font-size: 2rem;
        }

        .report-content p {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }

        /* Coming Soon */
        .coming-soon {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          text-align: center;
          padding: 1.5rem;
        }

        .coming-soon-content {
          background: white;
          padding: 3rem;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          max-width: 500px;
        }

        .coming-soon-content svg {
          font-size: 3rem;
          color: #3b82f6;
          margin-bottom: 1rem;
        }

        .coming-soon-content h3 {
          color: #1e293b;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .coming-soon-content p {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }

        /* Color classes */
        .text-primary { color: #3b82f6; }
        .text-success { color: #10b981; }
        .text-warning { color: #f59e0b; }
        .text-danger { color: #ef4444; }
        .text-info { color: #06b6d4; }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .admin-sidebar {
            width: 250px;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .metrics-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }

          .exam-types {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .admin-content-wrapper {
            flex-direction: column;
          }

          .admin-sidebar {
            width: 100%;
            order: 2;
          }

          .admin-main-content {
            order: 1;
          }

          .main-header {
            padding: 1.5rem 1rem;
          }

          .overview-content,
          .class-management,
          .student-management,
          .teacher-management,
          .academic-records,
          .examinations,
          .reports {
            padding: 1rem;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .sections-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            justify-content: stretch;
          }

          .search-box input {
            min-width: 100%;
          }

          .sidebar-nav {
            display: flex;
            overflow-x: auto;
            padding: 0.5rem;
          }

          .nav-item {
            min-width: 120px;
            padding: 0.75rem 1rem;
            text-align: center;
            border-left: none;
            border-bottom: 3px solid transparent;
          }

          .nav-item.active {
            border-left: none;
            border-bottom-color: #3b82f6;
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }

          .schedule-grid {
            grid-template-columns: 1fr;
          }

          .reports-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .sidebar-header {
            padding: 1rem;
          }

          .nav-item {
            font-size: 0.9rem;
            padding: 0.5rem;
          }

          .nav-item svg {
            margin-right: 0.5rem;
          }

          .metric-value {
            font-size: 2rem;
          }

          .students-table {
            font-size: 0.8rem;
          }

          .students-table thead th,
          .students-table tbody td {
            padding: 0.75rem 0.5rem;
          }

          .performance-table {
            font-size: 0.8rem;
          }

          .performance-table thead th,
          .performance-table tbody td {
            padding: 0.5rem 0.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;