import {
  createContext,
  useReducer,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { kakaoInit } from '@/utils/kakao/kakaoinit';

interface AuthState {
  isLoggedIn: boolean;
  userName: string | null;
}

interface AuthAction {
  type: 'LOGIN' | 'LOGOUT';
  payload?: string;
}

const AuthContext = createContext<{
  state: AuthState;
  login: (userName: string) => void;
  logout: () => void;
}>({
  state: {
    isLoggedIn: false,
    userName: null,
  },
  login: () => {},
  logout: () => {},
});

const initialState = {
  isLoggedIn: false,
  userName: null,
};

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        userName: action.payload || null,
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        userName: null,
      };
    default:
      throw new Error('Invalid action type');
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 로그인 처리
  const login = (userName: string) => {
    dispatch({ type: 'LOGIN', payload: userName });
  };

  // 로그아웃 처리
  const logout = () => {
    // 카카오 로그아웃 처리
    const kakao = kakaoInit();
    if (kakao && kakao.Auth.getAccessToken()) {
      kakao.Auth.logout();
    }

    // 로컬 스토리지에서 사용자 정보 제거
    localStorage.removeItem('name');
    localStorage.removeItem('accessToken');
    typeof window !== 'undefined' &&
      window.localStorage.removeItem('expirationTime');

    // 상태 업데이트
    dispatch({ type: 'LOGOUT' });
  };

  // 초기 상태 설정
  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      login(storedName);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};