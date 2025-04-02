import React, { createContext, useState, useContext, useEffect } from "react";

const TutorialContext = createContext();

export const TutorialProvider = ({ children }) => {
  const [showTutorial, setShowTutorial] = useState(
    localStorage.getItem("tutorialShown") !== "false"
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [currentPage, setCurrentPage] = useState("studentDash");
  const [completedPages, setCompletedPages] = useState(
    JSON.parse(localStorage.getItem("completedTutorialPages") || "[]")
  );
  const [tutorialFlow, setTutorialFlow] = useState(
    localStorage.getItem("tutorialFlow") || "active"
  );

  // Save tutorial state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("tutorialShown", showTutorial);
  }, [showTutorial]);

  // Save completed pages to localStorage
  useEffect(() => {
    localStorage.setItem(
      "completedTutorialPages",
      JSON.stringify(completedPages)
    );
  }, [completedPages]);

  // Save tutorial flow to localStorage
  useEffect(() => {
    localStorage.setItem("tutorialFlow", tutorialFlow);
  }, [tutorialFlow]);

  // Function to mark a page as completed or uncompleted
  const markPageCompleted = (pageName, completed = true) => {
    if (completed) {
      // Add to completed pages if not already there
      if (!completedPages.includes(pageName)) {
        console.log(`Marking page ${pageName} as completed`);
        setCompletedPages([...completedPages, pageName]);
      }
    } else {
      // Remove from completed pages
      console.log(`Marking page ${pageName} as not completed`);
      setCompletedPages(completedPages.filter((page) => page !== pageName));
    }
  };

  // Function to reset the tutorial (show it again)
  const resetTutorial = () => {
    setShowTutorial(true);
    setCurrentStep(0);
    setCompletedPages([]);
    setTutorialFlow("active");
    localStorage.removeItem("completedTutorialPages");
    localStorage.setItem("tutorialShown", true);
    localStorage.setItem("tutorialFlow", "active");
  };

  // Function to restart tutorial for a specific page
  const restartTutorialForPage = (pageName) => {
    console.log(`Restarting tutorial for page: ${pageName}`);
    setShowTutorial(true);
    setCurrentStep(0);
    // Remove the page from completed pages if it's there
    if (completedPages.includes(pageName)) {
      setCompletedPages(completedPages.filter((page) => page !== pageName));
      localStorage.setItem(
        "completedTutorialPages",
        JSON.stringify(completedPages.filter((page) => page !== pageName))
      );
    }
  };

  // Function to check if tutorial should be shown for a page
  const shouldShowTutorialForPage = (pageName) => {
    // Special handling for the tutorial flow
    if (tutorialFlow === "active") {
      // If we're in StudentDash, always show tutorial
      if (pageName === "studentDash") {
        const shouldShow = showTutorial && !completedPages.includes(pageName);
        console.log(
          `Tutorial check for ${pageName}: ${shouldShow} (flow: ${tutorialFlow})`
        );
        return shouldShow;
      }

      // For QuestionListModal, show if StudentDash is completed and QuestionListModal isn't
      if (pageName === "questionListModal") {
        const shouldShow =
          showTutorial &&
          completedPages.includes("studentDash") &&
          !completedPages.includes(pageName);
        console.log(
          `Tutorial check for ${pageName}: ${shouldShow} (flow: ${tutorialFlow})`
        );
        console.log(`Completed pages:`, completedPages);
        return shouldShow;
      }

      // For SolveQuestion, show if QuestionListModal is completed and SolveQuestion isn't
      if (pageName === "solveQuestion") {
        const shouldShow =
          showTutorial &&
          completedPages.includes("questionListModal") &&
          !completedPages.includes(pageName);
        console.log(
          `Tutorial check for ${pageName}: ${shouldShow} (flow: ${tutorialFlow})`
        );
        console.log(`Completed pages:`, completedPages);
        return shouldShow;
      }
    }

    // Default fallback
    const shouldShow = showTutorial && !completedPages.includes(pageName);
    console.log(
      `Tutorial check for ${pageName}: ${shouldShow} (default flow check)`
    );
    return shouldShow;
  };

  // Function to continue the tutorial flow
  const continueTutorialFlow = (fromPage, toPage) => {
    if (tutorialFlow === "active") {
      console.log(`Tutorial flow: continuing from ${fromPage} to ${toPage}`);
      markPageCompleted(fromPage);
      setCurrentPage(toPage);
      setCurrentStep(0); // Reset step count for the new page
    } else {
      console.log(
        `Tutorial flow: cannot continue because flow is ${tutorialFlow}`
      );
    }
  };

  // Function to exit the tutorial flow
  const exitTutorialFlow = () => {
    console.log("Tutorial flow: exiting flow");
    setTutorialFlow("completed");
  };

  const value = {
    showTutorial,
    setShowTutorial,
    currentStep,
    setCurrentStep,
    currentPage,
    setCurrentPage,
    markPageCompleted,
    resetTutorial,
    restartTutorialForPage,
    shouldShowTutorialForPage,
    completedPages,
    continueTutorialFlow,
    exitTutorialFlow,
    tutorialFlow,
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
};
