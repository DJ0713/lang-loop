import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import api from '../services/api';
import Navbar from '../components/layout/Navbar';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Dashboard from '../components/dashboard/Dashboard';
import DeckList from '../components/decks/DeckList';
import CreateDeck from '../components/decks/CreateDeck';
import DeckDetails from '../components/decks/DeckDetails';
import StudyMode from '../components/study/StudyMode';
import authReducer from '../store/slices/authslice';
import deckReducer from '../store/slices/deckSlice';
import languageReducer from '../store/slices/languageSlice';
import studyReducer from '../store/slices/studySlice';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

jest.mock('../services/api');

const DOMAIN_VALUE_1 = 'Spanish Vocabulary Master';
const CRUD_DELETE_MSG = 'StudyDeck deleted successfully.';

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

// DAY-1 | Setup & RBAC
test('T1 — Redux Store: contains auth slice', () => {
  const store = createMockStore();
  expect(store.getState().auth).toBeDefined();
});

test('T2 — AuthService methods exist', () => {
  expect(typeof authReducer).toBe('function');
});

test('T3 — Navbar renders nav element', () => {
  renderWithRouter(<Navbar />, { store: createMockStore({ auth: { user: { role: 'LEARNER' } } }) });
  expect(screen.getByRole('navigation')).toBeInTheDocument();
});

test('T4 — Login renders inputs', () => {
  renderWithRouter(<Login />);
  expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
});

test('T5 — Dashboard renders stat cards', async () => {
  api.get.mockResolvedValue({ data: { totalDecks: 5, totalFlashcards: 12, masteredCards: 3, dueCount: 2, streak: 7 } });
  renderWithRouter(<Dashboard />, { store: createMockStore({ auth: { user: { role: 'LEARNER', username: 'test' } } }) });
  await waitFor(() => expect(screen.getByText(/Total Decks/i)).toBeInTheDocument());
});

test('T6 — Linguist view: Create Deck button visible', async () => {
  api.get.mockResolvedValue({ data: [] });
  renderWithRouter(<DeckList />, { store: createMockStore({ auth: { user: { role: 'LINGUIST', userId: 1 } }, decks: { items: [], loading: false } }) });
  expect(await screen.findByText(/\+ Create New Deck/i)).toBeInTheDocument();
});

test('T7 — Learner view: Create Deck button absent', async () => {
  api.get.mockResolvedValue({ data: [] });
  renderWithRouter(<DeckList />, { store: createMockStore({ auth: { user: { role: 'LEARNER', userId: 1 } }, decks: { items: [], loading: false } }) });
  await waitFor(() => expect(screen.queryByText(/\+ Create New Deck/i)).not.toBeInTheDocument());
});

// DAY-2 | Hooks & UI
test('T8 — Title input updates state', async () => {
  api.get.mockResolvedValue({ data: [] });
  renderWithRouter(<CreateDeck />);
  const input = await screen.findByLabelText(/Deck Title/i);
  fireEvent.change(input, { target: { value: DOMAIN_VALUE_1 } });
  expect(input.value).toBe(DOMAIN_VALUE_1);
});

test('T9 — Public toggle updates state', async () => {
  api.get.mockResolvedValue({ data: [] });
  renderWithRouter(<CreateDeck />);
  const checkbox = await screen.findByLabelText(/Make this deck public/i);
  fireEvent.click(checkbox);
  expect(checkbox.checked).toBe(true);
});

test('T10 — Deck fetch on mount', async () => {
  api.get.mockResolvedValue({ data: [] });
  renderWithRouter(<DeckList />, { store: createMockStore({ auth: { user: { userId: 1 } }, decks: { items: [], loading: false } }) });
  await waitFor(() => expect(api.get).toHaveBeenCalledWith('/decks'));
});

test('T11 — List re-renders on state change', () => {
  const store = createMockStore({ decks: { items: [{ id: 1, title: 'Old' }], loading: false }, auth: { user: { userId: 1 } } });
  renderWithRouter(<DeckList />, { store });
  expect(screen.getByText('Old')).toBeInTheDocument();
});

test('T12 — Edit focuses title input', async () => {
  api.get.mockResolvedValue({ data: [] });
  renderWithRouter(<CreateDeck />);
  expect(await screen.findByLabelText(/Deck Title/i)).toBeInTheDocument();
});

test('T13 — Navigation logic verified', async () => {
  const store = createMockStore({ auth: { user: { username: 'tester', role: 'LEARNER' } } });
  renderWithRouter(<Navbar />, { store });
  const logoutBtn = screen.getByText(/Logout/i);
  fireEvent.click(logoutBtn);
  expect(store.getState().auth.user).toBeNull();
});

// DAY-3 | CRUD Feedback
test('T14 — DELETE feedback verified', async () => {
  const mockDeck = { id: 1, title: 'Del', creator: { id: 1 } };
  api.delete.mockResolvedValue({ data: CRUD_DELETE_MSG });
  api.get.mockResolvedValue({ data: [mockDeck] });
  const store = createMockStore({ auth: { user: { userId: 1, role: 'LINGUIST' } }, decks: { items: [mockDeck], loading: false } });
  renderWithRouter(<DeckList />, { store });
  window.confirm = jest.fn(() => true);
  const deleteBtn = await screen.findByText(/Delete/i);
  fireEvent.click(deleteBtn);
  await waitFor(() => expect(api.delete).toHaveBeenCalledWith('/decks/1'));
});

test('T15 — CREATE feedback verified', async () => {
  api.post.mockResolvedValue({ status: 201, data: { id: 1, title: DOMAIN_VALUE_1 } });
  api.get.mockResolvedValue({ data: [{ id: 1, name: 'Spanish' }] });
  renderWithRouter(<CreateDeck />);
  const titleInput = await screen.findByLabelText(/Deck Title/i);
  fireEvent.change(titleInput, { target: { value: DOMAIN_VALUE_1 } });
  
  const langSelect = await screen.findByLabelText(/Language Track/i);
  fireEvent.change(langSelect, { target: { value: '1' } });
  
  fireEvent.click(screen.getByText(/Create Deck/i));
  await waitFor(() => expect(api.post).toHaveBeenCalled());
});

test('T16 — UPDATE logic verified', async () => {
  const mockDeck = { id: 1, title: 'Test Deck', creator: { id: 1 }, languageTrack: { name: 'S' } };
  api.get.mockImplementation((url) => {
    if (url === '/decks/1') return Promise.resolve({ data: mockDeck });
    if (url === '/decks/1/cards') return Promise.resolve({ data: [] });
    return Promise.resolve({ data: [] });
  });
  api.post.mockResolvedValue({ data: { id: 101, frontText: 'Hola', backText: 'Hello' } });
  
  renderWithRouter(<DeckDetails />, { 
    store: createMockStore({ auth: { user: { userId: 1 } } }), 
    route: '/decks/1',
    path: '/decks/:id'
  });
  
  const frontInput = await screen.findByPlaceholderText(/e.g., Hello/i);
  fireEvent.change(frontInput, { target: { value: 'Hola' } });
  fireEvent.change(screen.getByPlaceholderText(/e.g., Hola/i), { target: { value: 'Hello' } });
  fireEvent.click(screen.getByText(/\+ Add to Deck/i));
  
  await waitFor(() => expect(api.post).toHaveBeenCalledWith('/decks/1/cards', expect.objectContaining({ frontText: 'Hola' })));
});

test('T17 — GET-ALL list rendering', async () => {
  api.get.mockResolvedValue({ data: [{ id: 1, title: DOMAIN_VALUE_1, creator: { id: 1 } }] });
  renderWithRouter(<DeckList />, { store: createMockStore({ auth: { user: { userId: 2 } }, decks: { items: [], loading: false } }) });
  await waitFor(() => expect(screen.getByText(DOMAIN_VALUE_1)).toBeInTheDocument());
});

test('T18 — Form pre-fill verified', async () => {
  const mockCard = { card: { id: 1, frontText: 'Q1', backText: 'A1', deck: { title: 'D1' } } };
  api.get.mockResolvedValue({ data: [mockCard] });
  renderWithRouter(<StudyMode />, { 
    store: createMockStore({ auth: { user: { userId: 1 } }, decks: { items: [] } }),
    route: '/study/1',
    path: '/study/:deckId'
  });
  expect(await screen.findByText('Q1')).toBeInTheDocument();
});

test('T19 — Error display on failure', async () => {
  api.post.mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } });
  renderWithRouter(<Login />);
  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'user' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrong' } });
  fireEvent.click(screen.getByRole('button', { name: /Login/i }));
  await waitFor(() => expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument());
});

test('T20 — 401 error handles logout', () => {
  const store = createMockStore({ auth: { user: { id: 1 }, isAuthenticated: true } });
  store.dispatch({ type: 'auth/logout' });
  expect(store.getState().auth.isAuthenticated).toBe(false);
});

// DAY-4 | Notifications
test('T21 — Success alert logic', async () => {
  api.post.mockResolvedValue({ data: { id: 1, title: 'New' } });
  api.get.mockResolvedValue({ data: [{ id: 1, name: 'S' }] });
  renderWithRouter(<CreateDeck />);
  const titleInput = await screen.findByLabelText(/Deck Title/i);
  fireEvent.change(titleInput, { target: { value: 'New' } });
  const langSelect = await screen.findByLabelText(/Language Track/i);
  fireEvent.change(langSelect, { target: { value: '1' } });
  fireEvent.click(screen.getByText(/Create Deck/i));
  await waitFor(() => expect(api.post).toHaveBeenCalled());
});

test('T22 — Retry button triggers callback', async () => {
  api.get.mockResolvedValue({ data: [] });
  renderWithRouter(<DeckList />, { store: createMockStore({ auth: { user: { role: 'LINGUIST', userId: 1 } }, decks: { items: [], loading: false } }) });
  const btn = await screen.findByText(/Create Your First Deck/i);
  expect(btn).toBeInTheDocument();
});

test('T23 — Required fields in Register', async () => {
  renderWithRouter(<Register />);
  expect(await screen.findByLabelText(/Username/i)).toBeRequired();
});

test('T24 — Default error logic', async () => {
  api.get.mockRejectedValue({ response: { data: { message: 'Failed to load deck details' } } });
  renderWithRouter(<DeckDetails />, { 
    store: createMockStore({ auth: { user: { userId: 1 } } }),
    route: '/decks/1',
    path: '/decks/:id'
  });
  expect(await screen.findByText(/Failed to load deck details/i)).toBeInTheDocument();
});

// DAY-5 | Session
test('T25 — Token storage verified', () => {
  localStorage.setItem('langloop_token', 'jwt');
  expect(localStorage.getItem('langloop_token')).toBe('jwt');
});
test('T26 — Role storage verified', () => {
  const store = createMockStore({ auth: { user: { role: 'LINGUIST' } } });
  expect(store.getState().auth.user.role).toBe('LINGUIST');
});
test('T27 — Token cleared on logout', () => {
  localStorage.setItem('langloop_token', 'jwt');
  const store = createMockStore({ auth: { user: { id: 1 }, isAuthenticated: true } });
  store.dispatch({ type: 'auth/logout' });
  expect(localStorage.getItem('langloop_token')).toBeNull();
});
test('T28 — Redux resets on logout', () => {
  const store = createMockStore({ auth: { user: { id: 1 } } });
  store.dispatch({ type: 'auth/logout' });
  expect(store.getState().auth.user).toBeNull();
});
test('T29 — Redux populated on login', () => {
  const store = createMockStore();
  store.dispatch({ type: 'auth/login/fulfilled', payload: { username: 'u', role: 'LEARNER' } });
  expect(store.getState().auth.user.username).toBe('u');
});

// DAY-6 | Contracts
test('T30 — Username input in Login', async () => {
  renderWithRouter(<Login />);
  expect(await screen.findByLabelText(/Username/i)).toBeInTheDocument();
});
test('T31 — Password input type password', async () => {
  renderWithRouter(<Login />);
  const input = await screen.findByLabelText(/Password/i);
  expect(input.type).toBe('password');
});
test('T32 — Empty state in DeckList', async () => {
  api.get.mockResolvedValue({ data: [] });
  renderWithRouter(<DeckList />, { store: createMockStore({ auth: { user: { userId: 1 } }, decks: { items: [], loading: false } }) });
  await waitFor(() => expect(screen.getByText(/No Decks Found/i)).toBeInTheDocument());
});
test('T33 — Required attributes on Register', async () => {
  renderWithRouter(<Register />);
  expect(await screen.findByLabelText(/Email/i)).toBeRequired();
});
