import React from "react";
import ReactDOM from "react-dom";

function resolveRoot() {
  const existingRoot = document.getElementById("portal-root");
  if (existingRoot) {
    return existingRoot;
  }
  const root = document.createElement("div");
  root.setAttribute("id", "portal-root");
  return document.body.appendChild(root);
}

const Portal: React.FC = ({ children }) => {
  const [root] = React.useState(resolveRoot);
  const [container] = React.useState(() => {
    return document.createElement("div");
  });

  React.useLayoutEffect(() => {
    root.appendChild(container);

    return () => {
      root.removeChild(container);
      if (root.childNodes.length === 0) {
        root.parentElement?.removeChild(root);
      }
    };
  }, [container, root]);

  return ReactDOM.createPortal(children, container);
};

export default Portal;
