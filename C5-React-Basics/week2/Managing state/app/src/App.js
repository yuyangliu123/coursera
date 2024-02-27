import logo from './logo.svg';
import './App.css';
import MealsList from './components/MealsList';
import Counter from './components/Counter';
import MealProvider from './provider/MealsProvider';
import Wallet from './components/Wallet';

function App() {
  return (
    <>
    <MealProvider>
      <MealsList/>
      <Counter/>
    </MealProvider>
    <Wallet/>
    </>
  );
}

export default App;
