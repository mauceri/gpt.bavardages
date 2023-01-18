import React, { ReactNode } from "react";
import Marge from "./marge";
import BurgerButton from "./burger-button";

interface Props {
  children?: ReactNode
  // any props that come into the component
}

function Layout({ children }: Props) {
  return (
    <div className="page-principale">
      <Marge />
      <div className="contenu-principal">
        {children}
      </div>
    </div>
  );
};


export default Layout;