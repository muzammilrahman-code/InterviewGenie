import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import InterviewPage from "./pages/InterviewPage";
import FeedbackPage from "./pages/FeedbackPage";
import { Toaster } from "react-hot-toast";
import UpgradeFeature from "./pages/UpgradeFeature";
import Questions from "./pages/Questions";
import WorkingGuide from "./pages/WorkingGuide";
import AboutUs from "./pages/AboutUs";

const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Home />} />
        
        {/* Main App Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/interview/:id" element={<InterviewPage />} />
          <Route path="dashboard/interview/:id/feedback" element={<FeedbackPage />} />
          <Route path="questions" element={<Questions />} />
          <Route path="upgrade" element={<UpgradeFeature />} />
          
        </Route>
          <Route path="how-it-works" element={<WorkingGuide />} />
          <Route path="about-us" element={<AboutUs />} />
      </Routes>
    </div>
  );
};

export default App;