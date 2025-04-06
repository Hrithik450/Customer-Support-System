import {
  BrowserRouter as Router,
  Routes,
  Route,
  useSearchParams,
} from "react-router-dom";
import NotFound from "../pages/NotFound/notFound.jsx";
import Header from "../components/layout/header.jsx";
import Dashboard from "../pages/Home/home.jsx";
import TicketView from "../pages/Home/workspace/workspace.jsx";
import { ToastContainer } from "react-toastify";
import AICollaboration from "../pages/Home/collaboration.jsx";
import RoutingInterface from "../pages/Home/routing.jsx";
import AnalyticsHub from "../pages/Home/analytics.jsx";
import { useMemo } from "react";
import Auth from "../pages/Auth/login.jsx";
import Profile from "../pages/Auth/profile.jsx";
import Chat from "../pages/Home/workspace/chat.jsx";

const AppRoutes = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const modalState = useMemo(
    () => ({
      isAccOpen: searchParams.get("account") === "open",
      isAuthOpen: searchParams.get("authpage") === "open",
      isChatOpen: searchParams.get("showChat") === "open",
    }),
    [searchParams]
  );

  const toggleParam = (key) => {
    const newParams = new URLSearchParams(searchParams);

    if (newParams.get(key) === "open") {
      newParams.delete(key);
    } else {
      newParams.set(key, "open");
    }
    setSearchParams(newParams);
  };

  return (
    <>
      <Header
        toggleAuthen={() => toggleParam("authpage")}
        toggleAcc={() => toggleParam("account")}
      />
      {modalState.isAuthOpen && (
        <Auth
          toggleAuthen={() => toggleParam("authpage")}
          isOpen={modalState.isAuthOpen}
        />
      )}
      {modalState.isAccOpen && (
        <Profile
          toggleAcc={() => toggleParam("account")}
          isOpen={modalState.isAccOpen}
        />
      )}
      {modalState.isChatOpen && (
        <Chat
          toggleChat={() => toggleParam("showChat")}
          isOpen={modalState.isChatOpen}
        />
      )}

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/workspace"
          element={<TicketView toggleChat={() => toggleParam("showChat")} />}
        />
        <Route path="/builder" element={<RoutingInterface />} />
        <Route path="/collaboration" element={<AICollaboration />} />
        <Route path="/analytics" element={<AnalyticsHub />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer />
    </>
  );
};

export default AppRoutes;
