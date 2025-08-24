import { useState } from "react";

const NumMeal = ({ render }) => {
    const [numMeal, setNumMeal] = useState(1);
    return render(numMeal, setNumMeal);
  };

  export default NumMeal