import { useAuth } from '@/contexts/AuthContext';
import { kakaoInit } from '@/utils/kakao/kakaoinit';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useContext } from 'react';

const LOGIN_URL = 'http://localhost:8000/auth/login';
const LOGOUT_URL = 'http://localhost:8000/auth/logout';

export default function NavBar() {
  const router = useRouter();
  const { state, login, logout } = useAuth();
  const userName = state.userName;

  console.log(`navbar2: ${userName}`);

  const handleLogout = () => {
    const kakao = kakaoInit();
    if (kakao && kakao.Auth.getAccessToken()) {
      kakao.Auth.logout();
    }
    logout();
    router.replace('/');
  };

  // useEffect(() => {
  //   const kakao = kakaoInit();
  //   return () => {
  //     if (kakao && kakao.Auth.getAccessToken()) {
  //       kakao.Auth.logout();
  //     }
  //   };
  // }, []);

  return (
    <>
      <nav className="border-gray-200 px-2 py-2.5 dark:bg-gray-900 sm:px-4">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <Link href="/" className="flex items-center">
            {/* <img src="" className="mr-3 h-6 sm:h-9" alt="Logo" /> */}
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              アグリート
            </span>
          </Link>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="ml-3 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:text-sm md:font-medium md:dark:bg-gray-900">
              <li>
                <a
                  href="#"
                  className="block rounded bg-blue-700 py-2 pl-3 pr-4 text-white dark:text-white md:bg-transparent md:p-0 md:text-blue-700"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block rounded py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
                >
                  About
                </a>
              </li>
              <Link
                href="/boards/main"
                className="block rounded py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
              >
                FAQ
              </Link>
              <li>
                {userName ? (
                  <>
                    <div>{`Hello, ${userName}`}</div>
                    <button onClick={handleLogout}>로그아웃</button>
                  </>
                ) : (
                  <Link href="/login">
                    <p>로그인</p>
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
