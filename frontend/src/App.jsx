import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OnboardingWizard from "./components/Onboarding";
import { OnboardingProvider } from "./context/OnboardingContext";

function App() {
  return (
    <div className="App bg-aurora">
      <OnboardingProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<OnboardingWizard />} />
          </Routes>
        </BrowserRouter>
      </OnboardingProvider>
    </div>
  );
}

export default App;
