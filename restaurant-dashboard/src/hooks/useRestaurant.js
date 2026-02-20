import { useEffect, useState } from "react";
import api from "../services/api";

export default function RestaurantInfo() {
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    api.get("/restaurant/info").then((response) => {
      setRestaurant(response.data);
    }).catch(() => {});
  }, []);

  return restaurant ? restaurant.name : "Restaurant";
}
