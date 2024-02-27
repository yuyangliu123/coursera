import { useMealsListContext } from "../provider/MealsProvider";

const MealsList=()=>{
    
    const  {meals} =useMealsListContext()
    return(
        <>
        <h1>Meals List using Content API</h1>
        {meals.map((meal,index)=>{
            return <h2 key={index}>{meal}</h2>
        })}
        </>
        
    )
}

export default MealsList