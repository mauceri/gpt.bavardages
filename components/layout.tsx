import React, { ReactNode } from "react";

interface Props {
    children?: ReactNode
    // any props that come into the component
}

function Layout ({ children } : Props) 
{
  return (
    <div className="page-principale">
      <div className="marge">
      <div className="contextes">
        <h2>Contextes</h2>
        <ul>
          <li>Fichier 1</li>
          <li>Fichier 2</li>
          <li>Fichier 3</li>
        </ul>
      </div>
      <div className="menu">
        <h2>Menu</h2>
        <ul>
          <li>Option 1</li>
          <li>Option 2</li>
          <li>Option 3</li>
        </ul>
      </div>
    </div>
    <div className="contenu-principal">
        {children}
    </div>
  </div>
  );
};


export default Layout;