import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import Main from "../layouts/Main/index";
import MoviesPage from "../pages/Series and movies page/moviesPage";
import WelcomePage from "../pages/WelcomePage/WelcomePage";
import SeriesPage from "../pages/Series and movies page/seriesPage";
import Login from "../pages/Login/login";
import Register from "../pages/register/register";
import MovieByGenre from "../pages/MovieByGenrePage/MovieByGenre";
import DashAdmin from "../pages/dashboard.Admin/dashAdmin";
import SecondaryNav from "../components/Navbar/navBar";
import BasicTable from "../pages/dashboard.Admin/BasicTable";
import DrawerAppBar from "../pages/dashboard.Admin/adminNav";
import Fav from "../pages/fav/Fav";
const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />,
  },
  {
    path: "/main",
    element: <Main />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/movies",
    element: <Main />,
    children: [
      {
        path: "",
        element: <MoviesPage />,
      },
    ],
  },
  {
    path: "/favorites",
    element: <Main />,
    children: [
      {
        path: "",
        element: <Fav />,
      },
    ],
  },
  // {
  //   path: "/movies",
  //   element: <MoviesPage />,
  //   children : [
  //     {
  //       path : "",
  //       element : <Navbar/>
  //     }
  //   ]
  // },
  {
    path: "/series",
    element: <Main />,
    children: [
      {
        path: "",
        element: <SeriesPage />,
      },
    ],
  },
  {
    path: "/genre/:genreType/:genreId",
    element: <Main />,
    children: [
      {
        path: "",
        element: <MovieByGenre />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/admin-dashboard",
    element: <Main />,
    children: [
      {
        path: "",
        element: <BasicTable />,
      },
    ],
  },
]);

export default router;
