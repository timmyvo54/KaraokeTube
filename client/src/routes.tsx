import Layout from "./other/layout";
import App from "./App";
import NewRoom from "./pages/new-room";

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
        element: <NewRoom />
      }
    ]
  }
]

export default routes;
