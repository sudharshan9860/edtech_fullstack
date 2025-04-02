import React from "react";
import Joyride from "react-joyride";
import { useTutorial } from "../contexts/TutorialContext";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./Tutorial.css";

const Tutorial = ({ steps, onComplete }) => {
  const {
    showTutorial,
    setShowTutorial,
    currentStep,
    setCurrentStep,
    currentPage,
    exitTutorialFlow,
  } = useTutorial();

  const handleClose = () => {
    // When closing manually, we should exit the tutorial flow entirely
    setShowTutorial(false);
    exitTutorialFlow();
  };

  return (
    <>
      <div className="tutorial-toggle">
        <Button
          variant="danger"
          size="sm"
          onClick={handleClose}
          className="tutorial-close-btn"
        >
          <FontAwesomeIcon icon={faTimes} /> Close Tutorial
        </Button>
      </div>

      <Joyride
        steps={steps}
        run={showTutorial}
        continuous
        showProgress
        showSkipButton
        stepIndex={currentStep}
        disableCloseOnEsc={false}
        disableOverlayClose={false}
        disableScrolling={false}
        debug={false}
        styles={{
          options: {
            primaryColor: "#00C1D4",
            zIndex: 1000,
          },
          tooltip: {
            className: "tutorial-tooltip",
          },
          overlay: {
            className: "tutorial-overlay",
          },
        }}
        callback={(data) => {
          const { status, index, type } = data;

          console.log("Tutorial callback:", {
            status,
            index,
            type,
            currentPage,
          });

          // Update current step when moving through tutorial
          if (type === "step:after") {
            setCurrentStep(index + 1);
          }

          // Handle tutorial completion for this page
          if (status === "finished") {
            console.log(`Tutorial finished on ${currentPage}`);
            if (onComplete) {
              onComplete();
            }
          }

          // If tutorial is skipped, turn it off completely
          if (status === "skipped") {
            console.log("Tutorial skipped, exiting flow");
            setShowTutorial(false);
            exitTutorialFlow();
          }
        }}
      />
    </>
  );
};

export default Tutorial;
