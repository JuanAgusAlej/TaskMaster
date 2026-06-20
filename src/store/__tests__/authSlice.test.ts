import authReducer, { loadSession, loginAsync, logoutAsync } from '../authSlice';
import { authService } from '../../services/authService';
import { configureStore } from '@reduxjs/toolkit';

jest.mock('../../services/authService', () => ({
  authService: {
    getCurrentUser: jest.fn(),
    loginUser: jest.fn(),
    logout: jest.fn(),
  },
}));

describe('authSlice', () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
  };

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('loadSession thunk', () => {
    it('should set loading to true when loadSession is pending', () => {
      const state = authReducer(initialState, loadSession.pending(''));
      expect(state.loading).toBe(true);
    });

    it('should set user and isAuthenticated when loadSession is fulfilled with user', () => {
      const state = authReducer(initialState, loadSession.fulfilled('john', '', undefined));
      expect(state.user).toBe('john');
      expect(state.isAuthenticated).toBe(true);
      expect(state.loading).toBe(false);
    });

    it('should reset user and isAuthenticated when loadSession is fulfilled with null', () => {
      const state = authReducer({ user: 'john', isAuthenticated: true, loading: false }, loadSession.fulfilled(null, '', undefined));
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
    });

    it('should reset user and isAuthenticated when loadSession is rejected', () => {
      const state = authReducer({ user: 'john', isAuthenticated: true, loading: false }, loadSession.rejected(new Error('fail'), ''));
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
    });
  });

  describe('loginAsync thunk', () => {
    it('should set user and isAuthenticated when loginAsync is fulfilled', () => {
      const state = authReducer(initialState, loginAsync.fulfilled('john', '', { username: 'john', password: '123' }));
      expect(state.user).toBe('john');
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('logoutAsync thunk', () => {
    it('should clear user and isAuthenticated when logoutAsync is fulfilled', () => {
      const state = authReducer({ user: 'john', isAuthenticated: true, loading: false }, logoutAsync.fulfilled(undefined, ''));
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('integration with store / mock service execution', () => {
    let store: any;

    beforeEach(() => {
      store = configureStore({
        reducer: {
          auth: authReducer,
        },
      });
      jest.clearAllMocks();
    });

    it('should dispatch loadSession and fetch current user successfully', async () => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValue('john');
      await store.dispatch(loadSession());
      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(store.getState().auth.user).toBe('john');
      expect(store.getState().auth.isAuthenticated).toBe(true);
    });

    it('should dispatch loginAsync and log in successfully', async () => {
      (authService.loginUser as jest.Mock).mockResolvedValue(true);
      await store.dispatch(loginAsync({ username: 'john', password: '123' }));
      expect(authService.loginUser).toHaveBeenCalledWith('john', '123');
      expect(store.getState().auth.user).toBe('john');
      expect(store.getState().auth.isAuthenticated).toBe(true);
    });

    it('should reject loginAsync thunk if login fails', async () => {
      (authService.loginUser as jest.Mock).mockResolvedValue(false);
      const action = await store.dispatch(loginAsync({ username: 'john', password: '123' }));
      expect(loginAsync.rejected.match(action)).toBe(true);
      expect(action.payload).toBe('Credenciales inválidas');
      expect(store.getState().auth.isAuthenticated).toBe(false);
    });

    it('should dispatch logoutAsync and clear session', async () => {
      (authService.logout as jest.Mock).mockResolvedValue(undefined);
      // Pre-set authenticated state
      await store.dispatch(loginAsync.fulfilled('john', '', { username: 'john', password: '123' }));
      expect(store.getState().auth.isAuthenticated).toBe(true);

      await store.dispatch(logoutAsync());
      expect(authService.logout).toHaveBeenCalled();
      expect(store.getState().auth.user).toBeNull();
      expect(store.getState().auth.isAuthenticated).toBe(false);
    });
  });
});
