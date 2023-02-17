import React from "react";
import { useState } from "react";
import Menu from './menu-clerk'
import Contextes from './contextes'

function youClickedMe() {
  // remove last character
  let oldWidth = Math.floor(
    parseInt(getComputedStyle(document.documentElement).
      getPropertyValue('--marge-width').split("").
      slice(0, -1).join(""))
  );

  let width = oldWidth
  if (width == 25) {
    width = 3;
    document.documentElement.style.setProperty('--contextes-and-menu-display', 'none');
    document.documentElement.style.setProperty('--marge-background-color', '#3C3C3C');
    document.documentElement.style.setProperty('--marge-width', '42px');
    document.documentElement.style.setProperty('--contenu-principal-width', '95%');
  } else {
    document.documentElement.style.setProperty('--contextes-and-menu-display', 'flex');
    document.documentElement.style.setProperty('--marge-background-color', 'white');
    document.documentElement.style.setProperty('--marge-width', '25%');
    document.documentElement.style.setProperty('--contenu-principal-width', '73%');
    width = 25
  }

  console.log("Marge width changed from %s to %s", `${oldWidth}%`, `${width}%`);
  //document.documentElement.style.setProperty('--marge-width', `${width}%`);

}
export default function Marge() {
  return (
    <div className="marge">
      <button
        className="hamburger"
        onClick={youClickedMe}
      >
        {/* icon from heroicons.com */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="white"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div className="menu"><p><small>La Marge prend trop de place. Hamburger &uarr;</small></p></div>
      <Contextes />
      <Menu />
    </div>
  )
}
