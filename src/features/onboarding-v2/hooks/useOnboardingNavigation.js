import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentStep } from "../store/onboardingSlice";

const STEP_MAP = {
  information: 1,
  documents: 2,
  "menu-setup": 3,
  review: 4,
};

export const useOnboardingNavigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navigateToPage = useCallback(
    (page) => {
      const step = STEP_MAP[page];
      if (step) dispatch(setCurrentStep(step));
    },
    [dispatch],
  );

  const navigateToReview = useCallback(() => {
    dispatch(setCurrentStep(4));
  }, [dispatch]);

  const navigateBack = useCallback(
    (fromPage) => {
      if (fromPage === "information") {
        navigate("/select-category");
        return;
      }
      const prevStep = STEP_MAP[fromPage] ? STEP_MAP[fromPage] - 1 : 1;
      dispatch(setCurrentStep(prevStep));
    },
    [navigate, dispatch],
  );

  const navigateNext = useCallback(
    (fromPage) => {
      if (fromPage === "review") {
        navigate("/submitted");
        return;
      }
      const nextStep = STEP_MAP[fromPage] ? STEP_MAP[fromPage] + 1 : null;
      if (nextStep) dispatch(setCurrentStep(nextStep));
    },
    [navigate, dispatch],
  );

  const getRoute = () => "/onboarding";

  return {
    navigate,
    navigateToPage,
    navigateToReview,
    navigateBack,
    navigateNext,
    getRoute,
  };
};
