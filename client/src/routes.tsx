import Layout from "./other/layout";
import App from "./App";
import Room from "./pages/room";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />
      },
      {
        path: "room/:id",
        element: <Room />
      }
    ]
  }
]

export default routes;
