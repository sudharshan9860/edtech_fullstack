import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import axiosInstance from '../api/axiosInstance';
import QuestionListModal from './QuestionListModal';
import './QuickExerciseComponent.css';

const QuickExerciseComponent = ({ onCreateHomework, mode = "homework" }) => {
  // State for dropdown data
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [subTopics, setSubTopics] = useState([]);

  // State for selections
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [questionLevel, setQuestionLevel] = useState("");
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for homework form
  const [showHomeworkForm, setShowHomeworkForm] = useState(false);
  const [homeworkTitle, setHomeworkTitle] = useState("");
  const [homeworkCode, setHomeworkCode] = useState("");
  const [homeworkDescription, setHomeworkDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // State for classwork image upload (UPDATED: changed from PDF to images)
  const [classworkTitle, setClassworkTitle] = useState("");
  const [classworkCode, setClassworkCode] = useState("");
  const [classworkDescription, setClassworkDescription] = useState("");
  const [classworkDueDate, setClassworkDueDate] = useState("");
  const [classworkImages, setClassworkImages] = useState([]); // UPDATED: changed from classworkPDF
  const [isClassworkSubmitting, setIsClassworkSubmitting] = useState(false);
  const [classworkError, setClassworkError] = useState(null);
  const [showClassworkForm, setShowClassworkForm] = useState(false);

  // Fetch classes on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const classResponse = await axiosInstance.get("/classes/");
        const classesData = classResponse.data.data;
        setClasses(classesData);
      } catch (error) {
        console.error("Error fetching classes", error);
      }
    }
    fetchData();
  }, []);

  // Fetch subjects when class is selected
  useEffect(() => {
    async function fetchSubjects() {
      if (selectedClass) {
        try {
          const subjectResponse = await axiosInstance.post("/subjects/", {
            class_id: selectedClass,
          });
          setSubjects(subjectResponse.data.data);
          // Reset dependent fields
          setSelectedSubject("");
          setSelectedChapters([]);
          setQuestionLevel("");
        } catch (error) {
          console.error("Error fetching subjects:", error);
          setSubjects([]);
        }
      }
    }
    fetchSubjects();
  }, [selectedClass]);

  // Fetch chapters when subject is selected
  useEffect(() => {
    async function fetchChapters() {
      if (selectedSubject && selectedClass) {
        try {
          const chapterResponse = await axiosInstance.post("/chapters/", {
            subject_id: selectedSubject,
            class_id: selectedClass,
          });
          setChapters(chapterResponse.data.data);
          // Reset dependent fields
          setSelectedChapters([]);
          setQuestionLevel("");
        } catch (error) {
          console.error("Error fetching chapters:", error);
          setChapters([]);
        }
      }
    }
    fetchChapters();
  }, [selectedSubject, selectedClass]);

  // Fetch subtopics when chapters are selected
  useEffect(() => {
    async function fetchSubTopics() {
      if (selectedClass && selectedSubject && selectedChapters.length > 0) {
        try {
          console.log("Fetching subtopics with:", {
            classid: selectedClass,
            subjectid: selectedSubject,
            topicid: selectedChapters[0]
          });
          
          const response = await axiosInstance.post("/question-images/", {
            classid: selectedClass,
            subjectid: selectedSubject,
            topicid: selectedChapters[0], // Assuming single chapter selection
            external: true
          });
          
          console.log("Subtopics response:", response.data);
          
          if (response.data && response.data.subtopics) {
            setSubTopics(response.data.subtopics);
          } else {
            console.warn("No subtopics found in response:", response.data);
            setSubTopics([]);
          }
        } catch (error) {
          console.error("Error fetching subtopics:", error);
          setSubTopics([]);
        }
      }
    }
    fetchSubTopics();
  }, [selectedClass, selectedSubject, selectedChapters]);

  // Determine if generate button should be enabled
  const isGenerateButtonEnabled = () => {
    return (
      selectedClass !== "" &&
      selectedSubject !== "" &&
      selectedChapters.length > 0 &&
      questionLevel !== "" &&
      !isLoading
    );
  };

  // Handle form submission to generate questions
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isGenerateButtonEnabled()) {
      console.error("Please select all required fields");
      return;
    }

    setIsLoading(true);

    try {
      // Now make a second request to get the actual questions for the selected subtopic
      const requestData = {
        classid: Number(selectedClass),
        subjectid: Number(selectedSubject),
        topicid: selectedChapters,
        external: false,
        subtopic: questionLevel
      };

      console.log("Requesting questions with:", requestData);
      
      const response = await axiosInstance.post("/question-images/", requestData);
      console.log("Questions response:", response.data);
      
      // Process questions if they exist
      if (response.data && response.data.questions && Array.isArray(response.data.questions)) {
        console.log("Questions found:", response.data);
        const questionsWithImages = response.data.questions.map((question) => ({
          ...question,
          question: question.question,
          image: question.question_image
            ? `data:image/png;base64,${question.question_image}`
            : null,
        }));

        setQuestionList(questionsWithImages);
        setSelectedQuestions([]); // Reset selected questions
        setShowQuestionList(true);
      } else {
        // If no questions array in the response, try to map the subtopics to exercises
        // This is a fallback if the API behaves differently than expected
        console.log("No questions found in response, creating manual questions");
        
        // Get the selected subtopic's index in the subtopics array
        const subtopicIndex = subTopics.findIndex(st => st === questionLevel);
        const exerciseNumber = subtopicIndex !== -1 ? subtopicIndex + 1 : 1;
        
        // Create a single mock question representing the exercise
        const mockQuestions = [{
          question: `Exercise ${exerciseNumber} from Chapter ${selectedChapters.map(c => 
            chapters.find(ch => ch.topic_code === c)?.name || c).join(", ")}`,
          question_image: null
        }];
        
        setQuestionList(mockQuestions);
        setSelectedQuestions([]); // Reset selected questions
        setShowQuestionList(true);
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      alert(`Failed to generate questions: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle question selection from modal
  const handleMultipleSelectSubmit = (selectedQuestionsData) => {
    console.log("Selected questions:", selectedQuestionsData);
    setSelectedQuestions(selectedQuestionsData);
    setShowQuestionList(false);
    setShowHomeworkForm(true);
    
    // Generate a default homework code
    const timestamp = new Date().getTime().toString().slice(-6);
    setHomeworkCode(`HW-${timestamp}`);
    
    // Generate a default title based on subject and chapter
    const subjectName = subjects.find(s => s.subject_code === selectedSubject)?.subject_name || "Subject";
    const chapterName = chapters.find(c => c.topic_code === selectedChapters[0])?.name || "Chapter";
    
    // Get exercise number from subtopic
    const subtopicIndex = subTopics.findIndex(st => st === questionLevel);
    const exerciseNumber = subtopicIndex !== -1 ? subtopicIndex + 1 : "";
    
    setHomeworkTitle(`${subjectName} - ${chapterName} Exercise ${exerciseNumber}`);
  };

  // Handle homework submission
  const handleHomeworkSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!homeworkTitle.trim() || !homeworkCode.trim() || !dueDate) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create the questions text for the description
      const questionsText = selectedQuestions.map((q, idx) => 
        `Question ${idx + 1}: ${q.question}`
      ).join('\n\n');
      console.log("Questions text:", questionsText);
      // Combine user description with questions
      const fullDescription = homeworkDescription.trim() 
        ? `${homeworkDescription}\n\n${questionsText}`
        : questionsText;

      // Create assignment object
      const assignment = {
        homework_code: homeworkCode.trim(),
        title: homeworkTitle.trim(),
        description: selectedQuestions,
        imageUrl: selectedQuestions.length > 0 && selectedQuestions[0].image ? selectedQuestions[0].image : null,
        teacherId: selectedClass, // Using selectedClass as teacherId
        classId: selectedClass,
        due_date: new Date(dueDate).toISOString(),
        date_assigned: new Date().toISOString(),
        questions: selectedQuestions,
      };
      
      // Submit assignment
      await onCreateHomework(assignment);
      
      // Reset form and state
      setShowHomeworkForm(false);
      setHomeworkTitle("");
      setHomeworkCode("");
      setHomeworkDescription("");
      setDueDate("");
      setSelectedQuestions([]);
      
      // Show success message
      alert("Homework assignment created successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create assignment");
      console.error("Error creating homework assignment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // UPDATED: Handle multiple image uploads for classwork
  const handleClassworkImageChange = (e) => {
    const files = Array.from(e.target.files);
    setClassworkImages(files);
  };

  // UPDATED: Classwork submission handler (after questions are selected)
  const handleClassworkSubmit = async (e) => {
    e.preventDefault();
    setClassworkError(null);
    setIsClassworkSubmitting(true);
    
    if (!classworkTitle.trim() || !classworkCode.trim() || !classworkDueDate) {
      setClassworkError("Please fill in all required fields.");
      setIsClassworkSubmitting(false);
      return;
    }
    
    if (!classworkImages || classworkImages.length === 0) {
      setClassworkError("Please upload at least one image of student work.");
      setIsClassworkSubmitting(false);
      return;
    }
    
    if (!selectedQuestions || selectedQuestions.length === 0) {
      setClassworkError("Please select at least one question.");
      setIsClassworkSubmitting(false);
      return;
    }
    
    try {
      const formData = new FormData();
      
      // Append all images
      classworkImages.forEach((image) => {
        formData.append('image_response', image);
      });
      
      // Append classwork information
      formData.append('class_work_code', classworkCode.trim());
      formData.append('worksheet_name', classworkTitle.trim());
      
      // Append questions data
      formData.append('questions', JSON.stringify(selectedQuestions));
      
      // Make API call to classwork-submission endpoint
      const response = await axiosInstance.post('/classwork-submission/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Reset form and state
      setClassworkTitle("");
      setClassworkCode("");
      setClassworkDescription("");
      setClassworkDueDate("");
      setClassworkImages([]);
      setSelectedQuestions([]);
      setShowClassworkForm(false);
      
      alert("Classwork images and questions uploaded successfully!");
    } catch (error) {
      setClassworkError(error.response?.data?.error || "Failed to upload classwork");
      console.error("Error uploading classwork:", error);
    } finally {
      setIsClassworkSubmitting(false);
    }
  };

  // Render the homework form
  const renderHomeworkForm = () => {
    return (
      <div className="homework-form-container">
        <h3>Create Homework Assignment</h3>
        {error && <div className="error-message">{error}</div>}
        
        <Form onSubmit={handleHomeworkSubmit}>
          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Group controlId="homeworkCode">
                <Form.Label>Homework Code</Form.Label>
                <Form.Control 
                  type="text"
                  value={homeworkCode}
                  onChange={(e) => setHomeworkCode(e.target.value)}
                  placeholder="Enter a unique code"
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group controlId="dueDate">
                <Form.Label>Due Date</Form.Label>
                <Form.Control 
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group controlId="homeworkTitle" className="mb-3">
            <Form.Label>Assignment Title</Form.Label>
            <Form.Control 
              type="text"
              value={homeworkTitle}
              onChange={(e) => setHomeworkTitle(e.target.value)}
              placeholder="Enter assignment title"
              required
            />
          </Form.Group>
          
          <Form.Group controlId="homeworkDescription" className="mb-3">
            <Form.Label>Additional Instructions (Optional)</Form.Label>
            <Form.Control 
              as="textarea"
              rows={3}
              value={homeworkDescription}
              onChange={(e) => setHomeworkDescription(e.target.value)}
              placeholder="Enter any additional instructions"
            />
          </Form.Group>
          
          <div className="selected-questions-preview mb-3">
            <h5>Selected Questions ({selectedQuestions.length})</h5>
            <ul className="question-preview-list">
              {selectedQuestions.map((q, idx) => (
                <li key={idx} className="question-preview-item">
                  <span className="question-number">{idx + 1}.</span>
                  <span className="question-text">{q.question}</span>
                  {q.image && (
                    <div className="question-image-small">
                      <img src={q.image} alt={`Question ${idx + 1}`} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="d-flex justify-content-between">
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowHomeworkForm(false);
                setShowQuestionList(true);
              }}
            >
              Back to Questions
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Homework Assignment'}
            </Button>
          </div>
        </Form>
      </div>
    );
  };

  // UPDATED: Render classwork image upload form (changed from PDF)
  const renderClassworkForm = () => (
    <div className="homework-form-container">
      <h3>Upload Classwork Images & Submit Questions</h3>
      {classworkError && <div className="error-message">{classworkError}</div>}
      <Form onSubmit={handleClassworkSubmit}>
        <Row className="mb-3">
          <Col xs={12} md={6}>
            <Form.Group controlId="classworkCode">
              <Form.Label>Classwork Code</Form.Label>
              <Form.Control
                type="text"
                value={classworkCode}
                onChange={(e) => setClassworkCode(e.target.value)}
                placeholder="Enter a unique code"
                required
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group controlId="classworkDueDate">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={classworkDueDate}
                onChange={(e) => setClassworkDueDate(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="classworkTitle" className="mb-3">
          <Form.Label>Classwork Title</Form.Label>
          <Form.Control
            type="text"
            value={classworkTitle}
            onChange={(e) => setClassworkTitle(e.target.value)}
            placeholder="Enter classwork title"
            required
          />
        </Form.Group>
        <Form.Group controlId="classworkDescription" className="mb-3">
          <Form.Label>Additional Instructions (Optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={classworkDescription}
            onChange={(e) => setClassworkDescription(e.target.value)}
            placeholder="Enter any additional instructions"
          />
        </Form.Group>
        
        {/* UPDATED: Changed PDF upload to multiple image upload */}
        <Form.Group controlId="classworkImages" className="mb-3">
          <Form.Label>Upload Student Work Images</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            multiple
            onChange={handleClassworkImageChange}
            required
          />
          {classworkImages && classworkImages.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <span>Selected files: {classworkImages.length} images</span>
            </div>
          )}
        </Form.Group>
        
        {/* Preview selected questions */}
        <div className="selected-questions-preview mb-3">
          <h5>Selected Questions ({selectedQuestions.length})</h5>
          <ul className="question-preview-list">
            {selectedQuestions.map((q, idx) => (
              <li key={idx} className="question-preview-item">
                <span className="question-number">{idx + 1}.</span>
                <span className="question-text">{q.question}</span>
                {q.image && (
                  <div className="question-image-small">
                    <img src={q.image} alt={`Question ${idx + 1}`} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="d-flex justify-content-between">
          <Button
            variant="secondary"
            onClick={() => {
              setShowClassworkForm(false);
              setShowQuestionList(true);
            }}
          >
            Back to Questions
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isClassworkSubmitting}
          >
            {isClassworkSubmitting ? "Uploading..." : "Upload Classwork Images & Questions"}
          </Button>
        </div>
      </Form>
    </div>
  );

  // Format subtopic display names
  const getSubtopicDisplayName = (subtopic, index) => {
    return `Exercise ${index + 1}`;
  };

  return (
    <div className="quick-exercise-container">
      {mode === "classwork"
        ? (
            !showClassworkForm ? (
              <div className="question-selection-container">
                <h3>Quick Classwork Generator</h3>
                <p className="text-muted">Select class, subject, and chapter to generate questions for classwork</p>
                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col xs={12} md={6}>
                      <Form.Group controlId="formClass">
                        <Form.Label>Class</Form.Label>
                        <Form.Control
                          as="select"
                          value={selectedClass}
                          onChange={(e) => setSelectedClass(e.target.value)}
                          className="form-control"
                        >
                          <option value="">Select Class</option>
                          {classes.map((cls) => (
                            <option key={cls.class_code} value={cls.class_code}>
                              {cls.class_name}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group controlId="formSubject">
                        <Form.Label>Subject</Form.Label>
                        <Form.Control
                          as="select"
                          value={selectedSubject}
                          onChange={(e) => setSelectedSubject(e.target.value)}
                          className="form-control"
                          disabled={!selectedClass}
                        >
                          <option value="">Select Subject</option>
                          {subjects.map((subject) => (
                            <option
                              key={subject.subject_code}
                              value={subject.subject_code}
                            >
                              {subject.subject_name}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col className="select-chapters" xs={12} md={6}>
                      <Form.Group controlId="formChapters">
                        <Form.Label>Chapters</Form.Label>
                        <Select
                          isMulti
                          options={chapters.map((chapter) => ({
                            value: chapter.topic_code,
                            label: chapter.name,
                          }))}
                          value={selectedChapters.map((code) => ({
                            value: code,
                            label: chapters.find(
                              (chapter) => chapter.topic_code === code
                            )?.name,
                          }))}
                          onChange={(selectedOptions) => {
                            setSelectedChapters(
                              selectedOptions.map((option) => option.value)
                            );
                          }}
                          classNamePrefix="react-select"
                          placeholder="Select Chapters"
                          isDisabled={!selectedSubject}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group controlId="formQuestionLevel">
                        <Form.Label>Select The Set</Form.Label>
                        <Form.Control
                          as="select"
                          value={questionLevel}
                          onChange={(e) => setQuestionLevel(e.target.value)}
                          className="form-control"
                          disabled={selectedChapters.length === 0}
                        >
                          <option value="">Select The Set</option>
                          {subTopics.map((subTopic, index) => (
                            <option key={subTopic} value={subTopic}>
                              {getSubtopicDisplayName(subTopic, index)}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="primary"
                      type="submit"
                      className="btn-generate mt-3"
                      disabled={!isGenerateButtonEnabled()}
                    >
                      {isLoading ? 'Loading...' : 'Generate Questions'}
                    </Button>
                  </div>
                </Form>
              </div>
            ) : renderClassworkForm()
          )
        : (!showHomeworkForm ? (
            <div className="question-selection-container">
              <h3>Quick Exercise Generator</h3>
              <p className="text-muted">Select class, subject, and chapter to generate questions for homework</p>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formClass">
                      <Form.Label>Class</Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="form-control"
                      >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                          <option key={cls.class_code} value={cls.class_code}>
                            {cls.class_name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formSubject">
                      <Form.Label>Subject</Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="form-control"
                        disabled={!selectedClass}
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((subject) => (
                          <option
                            key={subject.subject_code}
                            value={subject.subject_code}
                          >
                            {subject.subject_name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col className="select-chapters" xs={12} md={6}>
                    <Form.Group controlId="formChapters">
                      <Form.Label>Chapters</Form.Label>
                      <Select
                        isMulti
                        options={chapters.map((chapter) => ({
                          value: chapter.topic_code,
                          label: chapter.name,
                        }))}
                        value={selectedChapters.map((code) => ({
                          value: code,
                          label: chapters.find(
                            (chapter) => chapter.topic_code === code
                          )?.name,
                        }))}
                        onChange={(selectedOptions) => {
                          setSelectedChapters(
                            selectedOptions.map((option) => option.value)
                          );
                        }}
                        classNamePrefix="react-select"
                        placeholder="Select Chapters"
                        isDisabled={!selectedSubject}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formQuestionLevel">
                      <Form.Label>Select The Set</Form.Label>
                      <Form.Control
                        as="select"
                        value={questionLevel}
                        onChange={(e) => setQuestionLevel(e.target.value)}
                        className="form-control"
                        disabled={selectedChapters.length === 0}
                      >
                        <option value="">Select The Set</option>
                        {subTopics.map((subTopic, index) => (
                          <option key={subTopic} value={subTopic}>
                            {getSubtopicDisplayName(subTopic, index)}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="primary"
                    type="submit"
                    className="btn-generate mt-3"
                    disabled={!isGenerateButtonEnabled()}
                  >
                    {isLoading ? 'Loading...' : 'Generate Questions'}
                  </Button>
                </div>
              </Form>
            </div>
          ) : renderHomeworkForm())}
      {/* Question List Modal */}
      {showQuestionList && mode !== "classwork" && (
        <QuestionListModal
          show={showQuestionList}
          onHide={() => setShowQuestionList(false)}
          questionList={questionList}
          isMultipleSelect={true}
          onMultipleSelectSubmit={handleMultipleSelectSubmit}
        />
      )}
      {/* For classwork mode, show question list modal and then classwork form */}
      {showQuestionList && mode === "classwork" && (
        <QuestionListModal
          show={showQuestionList}
          onHide={() => setShowQuestionList(false)}
          questionList={questionList}
          isMultipleSelect={true}
          onMultipleSelectSubmit={(selectedQuestionsData) => {
            setSelectedQuestions(selectedQuestionsData);
            setShowQuestionList(false);
            setShowClassworkForm(true);
            // Optionally, generate a default code/title
            const timestamp = new Date().getTime().toString().slice(-6);
            setClassworkCode(`CW-${timestamp}`);
            const subjectName = subjects.find(s => s.subject_code === selectedSubject)?.subject_name || "Subject";
            const chapterName = chapters.find(c => c.topic_code === selectedChapters[0])?.name || "Chapter";
            const subtopicIndex = subTopics.findIndex(st => st === questionLevel);
            const exerciseNumber = subtopicIndex !== -1 ? subtopicIndex + 1 : "";
            setClassworkTitle(`${subjectName} - ${chapterName} Exercise ${exerciseNumber}`);
          }}
        />
      )}
    </div>
  );
};

export default QuickExerciseComponent;