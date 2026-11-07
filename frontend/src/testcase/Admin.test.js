import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import api from '../services/api';
import Navbar from '../components/layout/Navbar';
import AdminPanel from '../components/admin/AdminPanel';
import UserManagement from '../components/admin/UserManagement';
import AdminDeckManagement from '../components/admin/AdminDeckManagement';
import AdminFlashcardManagement from '../components/admin/AdminFlashcardManagement';
import AdminAnalytics from '../components/admin/AdminAnalytics';
import authReducer from '../store/slices/authslice';
import deckReducer from '../store/slices/deckSlice';
import languageReducer from '../store/slices/languageSlice';
import studyReducer from '../store/slices/studySlice';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

jest.mock('../services/api');

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: { 
      auth: authReducer, 
      decks: deckReducer, 
      languages: languageReducer,
      study: studyReducer 
    },
    preloadedState: initialState
  });
};

const renderWithRouter = (ui, { store = createMockStore(), route = '/', path = '/' } = {}) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={path} element={ui} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('Admin Experience and RBAC Frontend Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('A1 — Navbar shows Admin navigation items ONLY for ADMIN role', () => {
    // Admin user
    const adminStore = createMockStore({ auth: { user: { role: 'ADMIN', username: 'admin1' } } });
    const { unmount } = renderWithRouter(<Navbar />, { store: adminStore });
    expect(screen.getByText(/ADMINISTRATION/i)).toBeInTheDocument();
    expect(screen.getByText(/^Users$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Decks$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Flashcards$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Analytics$/i)).toBeInTheDocument();
    unmount();

    // Learner user
    const learnerStore = createMockStore({ auth: { user: { role: 'LEARNER', username: 'learner1' } } });
    renderWithRouter(<Navbar />, { store: learnerStore });
    expect(screen.queryByText(/ADMINISTRATION/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Flashcards$/i)).not.toBeInTheDocument();
  });

  test('A2 — AdminPanel renders platform statistics from backend', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/admin/stats') {
        return Promise.resolve({
          data: {
            totalUsers: 15,
            totalLearners: 8,
            totalLinguists: 4,
            totalAdmins: 3,
            totalDecks: 6,
            totalFlashcards: 42,
            totalStudySessions: 19
          }
        });
      }
      if (url === '/admin/users') {
        return Promise.resolve({
          data: [
            { id: 1, username: 'alex', role: 'LEARNER' },
            { id: 2, username: 'sophia', role: 'LINGUIST' }
          ]
        });
      }
      return Promise.resolve({ data: [] });
    });

    renderWithRouter(<AdminPanel />);
    expect(screen.getByText(/Loading admin dashboard.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Total Platform Users/i)).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('alex')).toBeInTheDocument();
    });
  });

  test('A3 — UserManagement displays user list, handles filter and search', async () => {
    const mockUsers = [
      { id: 1, username: 'alice_learner', role: 'LEARNER' },
      { id: 2, username: 'bob_linguist', role: 'LINGUIST' },
      { id: 3, username: 'carol_admin', role: 'ADMIN' }
    ];
    api.get.mockResolvedValue({ data: mockUsers });

    renderWithRouter(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('alice_learner')).toBeInTheDocument();
      expect(screen.getByText('bob_linguist')).toBeInTheDocument();
      expect(screen.getByText('carol_admin')).toBeInTheDocument();
    });

    // Test Search
    const searchInput = screen.getByPlaceholderText(/Search by username.../i);
    fireEvent.change(searchInput, { target: { value: 'alice' } });

    expect(screen.getByText('alice_learner')).toBeInTheDocument();
    expect(screen.queryByText('bob_linguist')).not.toBeInTheDocument();

    // Test Role Filter Tab
    fireEvent.change(searchInput, { target: { value: '' } });
    const linguistTab = screen.getByRole('button', { name: 'LINGUIST' });
    fireEvent.click(linguistTab);

    expect(screen.queryByText('alice_learner')).not.toBeInTheDocument();
    expect(screen.getByText('bob_linguist')).toBeInTheDocument();
  });

  test('A4 — UserManagement allows role update and delete action', async () => {
    const mockUsers = [
      { id: 1, username: 'target_user', role: 'LEARNER' }
    ];
    api.get.mockResolvedValue({ data: mockUsers });
    api.put.mockResolvedValue({ data: { id: 1, username: 'target_user', role: 'LINGUIST' } });
    api.delete.mockResolvedValue({ data: 'User deleted successfully.' });
    window.confirm = jest.fn(() => true);

    renderWithRouter(<UserManagement />);

    await waitFor(() => expect(screen.getByText('target_user')).toBeInTheDocument());

    // Open Role Change
    fireEvent.click(screen.getByText(/Change Role/i));
    expect(screen.getByText(/Change Role for target_user/i)).toBeInTheDocument();

    // Save new role
    fireEvent.click(screen.getByText(/Save Role/i));
    await waitFor(() => expect(api.put).toHaveBeenCalledWith('/admin/users/1/role', { role: 'LEARNER' }));

    // Trigger Delete
    fireEvent.click(screen.getByText(/Delete/i));
    await waitFor(() => expect(api.delete).toHaveBeenCalledWith('/admin/users/1'));
  });

  test('A5 — AdminDeckManagement renders deck table and delete button', async () => {
    const mockDecks = [
      { id: 1, title: 'German Basics', mentorName: 'Hans', capacity: 30, flashcards: [{ id: 10 }] }
    ];
    api.get.mockResolvedValue({ data: mockDecks });
    api.delete.mockResolvedValue({ data: 'Deck deleted successfully.' });
    window.confirm = jest.fn(() => true);

    renderWithRouter(<AdminDeckManagement />);

    await waitFor(() => {
      expect(screen.getByText('German Basics')).toBeInTheDocument();
      expect(screen.getByText('Hans')).toBeInTheDocument();
      expect(screen.getByText('1 cards')).toBeInTheDocument();
    });

    const deleteBtn = screen.getByText(/Delete/i);
    fireEvent.click(deleteBtn);
    await waitFor(() => expect(api.delete).toHaveBeenCalledWith('/decks/1'));
  });

  test('A6 — AdminFlashcardManagement displays flashcard inventory', async () => {
    const mockCards = [
      { id: 1, frontContent: 'Bonjour', backContent: 'Hello', deckTitle: 'French 101', deckId: 5 }
    ];
    api.get.mockResolvedValue({ data: mockCards });

    renderWithRouter(<AdminFlashcardManagement />);

    await waitFor(() => {
      expect(screen.getByText('Bonjour')).toBeInTheDocument();
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getAllByText('French 101').length).toBeGreaterThanOrEqual(1);
    });
  });

  test('A7 — AdminAnalytics shows calculated demographic percentages', async () => {
    api.get.mockResolvedValue({
      data: {
        totalUsers: 10,
        totalLearners: 5,
        totalLinguists: 3,
        totalAdmins: 2,
        totalDecks: 4,
        totalFlashcards: 20,
        totalStudySessions: 8
      }
    });

    renderWithRouter(<AdminAnalytics />);

    await waitFor(() => {
      expect(screen.getByText(/5 \(50%\)/i)).toBeInTheDocument();
      expect(screen.getByText(/3 \(30%\)/i)).toBeInTheDocument();
      expect(screen.getByText(/2 \(20%\)/i)).toBeInTheDocument();
      expect(screen.getByText('5.0')).toBeInTheDocument(); // 20 / 4 cards per deck
    });
  });

  test('A8 — 403 Forbidden display message on unauthorized access attempt', async () => {
    api.get.mockRejectedValue({ response: { status: 403 } });
    renderWithRouter(<AdminPanel />);

    await waitFor(() => {
      expect(screen.getByText(/You do not have permission to perform this action\./i)).toBeInTheDocument();
    });
  });
});
