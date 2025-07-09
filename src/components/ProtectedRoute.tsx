// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { JSX } from "react";
import { useNavigationStep } from "./Navigation.Context";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredStep: number;
}

export default function ProtectedRoute({
  children,
  requiredStep,
}: ProtectedRouteProps) {
  const { currentStep } = useNavigationStep();

  if (currentStep < requiredStep) {
    return <Navigate to="/" replace />;
  }

  return children;
}
