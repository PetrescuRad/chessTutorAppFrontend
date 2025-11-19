import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import GameReplay from "../pages/GameReplay";
import AnalysisLayout from "../pages/AnalysisLayout";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import SignupPage from "../pages/SignupPage";
import ProtectedRoute from "./ProtectedRoute";
import { GameProvider } from "../context/GameContext";

const Router = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Navigate to="/signup" replace />,
        },
        {
            path: "/analysis",
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
            path: "/home",
            element: (
                <ProtectedRoute>
                    <HomePage />
                </ProtectedRoute>
                )
        }
    ]);

    return (
        <GameProvider>
            <RouterProvider router={router} />
        </GameProvider>
    )
};
export default Router;