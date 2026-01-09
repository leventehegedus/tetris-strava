import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TetrisGame } from "@/components/tetris/TetrisGame";
import { StravaConnect } from "@/components/strava/StravaConnect";
import { StravaActivities } from "@/components/strava/StravaActivities";
import { StravaCallback } from "@/pages/StravaCallback";
import { StravaProvider } from "@/hooks/useStrava";

function App() {
  return (
    <StravaProvider>
      <Router>
        <Routes>
          <Route path="/strava/callback" element={<StravaCallback />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </StravaProvider>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <TetrisGame />
            </div>

            <div className="lg:w-80 space-y-4">
              <StravaConnect />
              <StravaActivities />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
