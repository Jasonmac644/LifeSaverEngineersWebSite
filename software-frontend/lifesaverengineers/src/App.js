import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Login } from "./pages/auth";
import { FirebaseProvider } from "./hooks/contexts/AuthContext";
import { ThemeProvider } from "@mui/material";
import theme from "./styles/muiTheme";
import { Protected } from "./pages/auth";
import Layout from "./components/Layout";
import { Dashboard, Profile } from "./containers";
const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Protected>
          <Layout />
        </Protected>
      ),
      children: [
        { path: "/dashboard", element: <Dashboard />, index: true },
        { path: "/profile", element: <Profile /> },
      ],
    },
    {
      path: "*",
      element:<Navigate to="/dashboard" replace/>
    },
    {
      path: "/login",
      element: <Login />,
    },
    
  ]);
  return (
    <ThemeProvider theme={theme}>
      <FirebaseProvider>
        <RouterProvider router={router}></RouterProvider>
      </FirebaseProvider>
    </ThemeProvider>
  );
};

export default App;
