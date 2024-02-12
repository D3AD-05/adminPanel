import "./style/global.scss";

import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { Catagories, Menus, Orders, Users } from "./components";
import SignIn from "./pages/login/SignIn";
import NavBar from "./components/navbar/Navbar";
import Home from "./pages/login/home/Home";
import Footer from "./components/footer/Footer";
import Notification from "./pages/notification/notification";

function App() {
  // layout

  const Layout = () => {
    return (
      <>
        <div className="main">
          <NavBar />
          <div className="homeContainer">
            <div className="menuContainer">
              <Menus />
            </div>
            <div className="contentContainer">
              <Outlet />{" "}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/users",
          element: <Users />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/catagories",
          element: <Catagories />,
        },
        {
          path: "/notifications",
          element: <Notification />,
        },
        // {
        //   path: "/users/:id",
        //   element: <User />,
        // },
        // {
        //   path: "/products/:id",
        //   element: <Product />,
        // },
      ],
    },
    {
      path: "/login",
      element: <SignIn />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
