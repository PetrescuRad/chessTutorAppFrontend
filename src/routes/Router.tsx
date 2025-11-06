import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import GameReplay from "../pages/GameReplay";
import AnalysisLayout from "../pages/AnalysisLayout";
import LoginPage from "../pages/LoginPage";
import { UserProvider } from "../components/UserProvider";
import HomePage from "../pages/HomePage";
import SignupPage from "../pages/SignupPage";

const Router = () => {
    const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/signup" replace />,
    },
    {
      path: "/games/:username",
      element: <AnalysisLayout />, // parent layout
      children: [
        {
          path: ":url", // nested route
          element: <GameReplay />,
        },
      ],
    },
    {
        path: "/signup",
        element: <SignupPage />
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path:"/home",
        element: <HomePage />
    }
  ]);

    return (
        <UserProvider>
            <RouterProvider router={router}/>
        </UserProvider>
    )
};
export default Router;