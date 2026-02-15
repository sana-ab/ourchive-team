import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthScreen from "./screens/AuthScreen";
import FeedScreen from "./screens/FeedScreen";
import MapScreen from "./screens/MapScreen";
import CaptureScreen from "./screens/CaptureScreen";
import ProfileScreen from "./screens/ProfileScreen";

function ErrorBoundary() {
  return <Navigate to="/" replace />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AuthScreen,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/feed",
    Component: FeedScreen,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/map",
    Component: MapScreen,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/capture",
    Component: CaptureScreen,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/profile",
    Component: ProfileScreen,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
    errorElement: <ErrorBoundary />,
  },
]);