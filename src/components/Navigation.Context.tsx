// context/NavigationContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

type Step = 1 | 2 | 3 | 4;

interface NavigationContextType {
  currentStep: Step;
  setCurrentStep: (step: Step) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);

  return (
    <NavigationContext.Provider value={{ currentStep, setCurrentStep }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationStep = () => {
  const context = useContext(NavigationContext);
  if (!context)
    throw new Error("useNavigation must be used within NavigationProvider");
  return context;
};
