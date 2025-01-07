import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import DashboardPage from "./pages/admin/DashboardPage";
import UserPage from "./pages/admin/UserPage";
import HomePage from "./pages/user/HomePage";
import PostPage from "./pages/admin/PostPage";
import MentorshipRequestPage from "./pages/admin/MentorshipRequestPage";

import MajorCodePage from "./pages/admin/MajorCodePage";
import EventPage from "./pages/admin/EventPage";
import JobPostPage from "./pages/admin/JobPostPage";
import JobApplicationPage from "./pages/admin/JobApplicationPage";
import UserEventPage from "./pages/user/UserEventPage";
import RegisterPage from "./pages/user/RegisterPage";
import UserJobPostPage from "./pages/user/UserJobPostPage";
import UserJobPostDetailsPage from "./pages/user/UserJobPostDetailsPage";
import CVPage from "./pages/user/CVPage";
import CreatePostPage from "./pages/user/CreatePostPage";
import CreateJobPostPage from "./pages/user/CreateJobPostPage";
import CreateEventPage from "./pages/user/CreateEventPage";
import LoginPage from "./pages/user/LoginPage";
import ListPostPage from "./pages/user/ListPostPage";
import ListEventPage from "./pages/user/ListEventPage";
import EventDetailsPage from "./pages/user/EventDetailsPage";
import PostDetailsPage from "./pages/user/PostDetailsPage";
import MentorDashboardPage from "./pages/user/MentorDashboard";
import AlumniPage from "./pages/user/AlumniPage";
import MentorDetailsPage from "./pages/user/MentorDetailsPage";
import MentorRequestListPage from "./pages/user/MentorRequestListPage";
import RequestDetailPage from "./pages/user/RequestDetailPage";
import SchedulePage from "./pages/user/SchedulePage";
import MentorRatingPage from "./pages/user/MentorRatingPage";
import MyEventPage from "./pages/user/MyEventPage";
import ProfilePage from "./pages/user/ProfilePage";
import MyJobPostPage from "./pages/user/MyJobPostPage";
import UserJobApplicationPage from "./pages/user/UserJobApplicationPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/list-post" element={<ListPostPage />} />
        <Route path="/list-event" element={<ListEventPage />} />
        <Route path="/my-event" element={<MyEventPage />} />
        <Route path="/post/:postId" element={<PostDetailsPage />} />
        <Route path="/mentor-dashboard" element={<MentorDashboardPage />} />
        <Route path="/alumni" element={<AlumniPage />} />
        <Route path="/user/:id" element={<MentorDetailsPage />} />
        <Route path="/mentor-requests" element={<MentorRequestListPage />} />
        <Route path="/request/:id" element={<RequestDetailPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/rating" element={<MentorRatingPage />} />
        <Route path="/event/:id" element={<EventDetailsPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/user-event" element={<UserEventPage />} />
        <Route path="/user-job-post" element={<UserJobPostPage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/user-job-post/:id" element={<UserJobPostDetailsPage />} />
        <Route path="/create-job-post" element={<CreateJobPostPage />} />
        <Route path="/my-job-post" element={<MyJobPostPage />} />
        <Route path="/job-applications/:jobId" element={<UserJobApplicationPage />} />

        <Route path="/cv" element={<CVPage />} />
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/user" element={<UserPage />} />
        <Route path="/admin/post" element={<PostPage />} />
        <Route path="/admin/mentor_ship_request" element={<MentorshipRequestPage />} />
        <Route path="/admin/major" element={<MajorCodePage />} />
        <Route path="/admin/event" element={<EventPage />} />
        <Route path="/admin/jobposts" element={<JobPostPage />} />
        <Route path="/admin/jobapplications/:id" element={<JobApplicationPage />} />

      </Routes>
    </Router>
  );
}

export default App;
