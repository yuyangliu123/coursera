import React from "react"
import Fruits from "./components/Fruits";
import FruitsCounter from "./components/FruitsCounter";


function App() {
  const [fruits] = React.useState([
    {fruitName: 'apple', id: 1},
    {fruitName: 'apple', id: 2},
    {fruitName: 'plum', id: 3},
    {fruitName: 'pluf', id: 4}
]);

  return (
    <div className="App">
      <h1>Where should the state go?</h1>
      <Fruits fruitList={fruits}/>
      <FruitsCounter fruitList={fruits}/>
    </div>
  );
}

export default App;
