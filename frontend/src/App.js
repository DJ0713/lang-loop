import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { restoreAuth } from "./store/slices/authslice";
import "./index.css";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import DeckList from "./components/decks/DeckList";
import CreateDeck from "./components/decks/CreateDeck";
import DeckDetails from "./components/decks/DeckDetails";
import DeckForm from "./components/DeckForm";
import StudyMode from "./components/study/StudyMode";
import Profile from "./components/profile/Profile";
import AdminPanel from "./components/admin/AdminPanel";
import UserManagement from "./components/admin/UserManagement";
import AdminDeckManagement from "./components/admin/AdminDeckManagement";
import AdminFlashcardManagement from "./components/admin/AdminFlashcardManagement";
import AdminAnalytics from "./components/admin/AdminAnalytics";
import AppLayout from "./components/layout/AppLayout";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authenticated Application Shell Routes */}
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />

        <Route
          path="/decks"
          element={
            <AppLayout>
              <DeckList />
            </AppLayout>
          }
        />

        <Route
          path="/decks/create"
          element={
            <AppLayout>
              <CreateDeck />
            </AppLayout>
          }
        />

        <Route
          path="/decks/:id"
          element={
            <AppLayout>
              <DeckDetails />
            </AppLayout>
          }
        />

        <Route
          path="/decks/:id/edit"
          element={
            <AppLayout>
              <DeckForm editMode />
            </AppLayout>
          }
        />

        <Route
          path="/study/:deckId"
          element={
            <AppLayout>
              <StudyMode />
            </AppLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <AppLayout>
              <Profile />
            </AppLayout>
          }
        />

        <Route
          path="/users"
          element={
            <AppLayout>
              <UserManagement />
            </AppLayout>
          }
        />

        <Route
          path="/admin"
          element={
            <AppLayout>
              <AdminPanel />
            </AppLayout>
          }
        />

        <Route
          path="/admin/decks"
          element={
            <AppLayout>
              <AdminDeckManagement />
            </AppLayout>
          }
        />

        <Route
          path="/admin/flashcards"
          element={
            <AppLayout>
              <AdminFlashcardManagement />
            </AppLayout>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <AppLayout>
              <AdminAnalytics />
            </AppLayout>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;