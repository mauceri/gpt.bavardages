import React from "react";
import { useState } from "react";

export default function Marge() {
  const [isNavExpanded, setIsNavExpanded] = useState(false)

  if (isNavExpanded) {
    return (
      <div className="marge">
        <button
          className="hamburger"
          onClick={() => {
            console.log("Click!");
            setIsNavExpanded(!isNavExpanded);
          }}
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
    )
  } else {
    return (
      <button
        className="hamburger"
        onClick={() => {
          console.log("Click!");
          setIsNavExpanded(!isNavExpanded);
        }}
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
      </button>)
  }
}