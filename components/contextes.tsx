import { useEffect, useState } from "react";

export default function Contextes() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    (async () => {
        const results = await fetch("/api/list").then(response => response.json());
        setRestaurants(results);
    })();
}, []);

    return(
        <div className="contextes">
        <h2>Contextes</h2>
        <ul>
        {restaurants.map((restaurant) => {
          return (<li key={restaurant.id}>{restaurant.name as string}</li>)
        })}
        </ul>
      </div>
    )
}