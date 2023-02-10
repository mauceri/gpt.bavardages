import { useEffect, useState } from "react";

export default function Contextes() {
  const [restaurants, setRestaurants] =
    useState<any[]>([
      { _id: 1, name: "a" },
      { _id: 2, name: "b" },
      { _id: 3, name: "c" }]);

  useEffect(() => {
    (async () => {
      const results = await fetch("/api/list_restaurants").then(response => response.json());
      setRestaurants(results);
    })();
  }, []);

  return (
    <div className="contextes">
      <h2>Contextes</h2>
      <ul>
        {restaurants.map((restaurant) => {
          if (restaurant != null)
            return (<li key={restaurant._id}>{restaurant.name as string}</li>)
        })}
      </ul>
    </div>
  )
}