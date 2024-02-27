import React from "react"


const MealsContext=React.createContext()

const todayMeals=["Baked Beans","Grilled Veggies","Soup"]


const MealProvider=({children})=>{
    const [meals, setMealsList]=React.useState(todayMeals)
    return(
        <MealsContext.Provider value={{meals}}>  
            {children}
        </MealsContext.Provider>
    )
}

export const useMealsListContext=()=>React.useContext(MealsContext)
export default MealProvider
