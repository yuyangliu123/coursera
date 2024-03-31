import React from "react";
import { useRoutes } from "react-router-dom";
import DesktopOne from "pages/DesktopOne";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <DesktopOne /> }
  ]);

  return element;
};

export default ProjectRoutes;
