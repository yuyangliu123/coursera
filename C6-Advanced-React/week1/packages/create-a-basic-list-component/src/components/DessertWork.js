const DessertWork=()=>{
    const desserts = [
        {
          name: "Chocolate Cake",
          calories: 400,
          createdAt: "2022-09-01",
        },
        {
          name: "Ice Cream",
          calories: 200,
          createdAt: "2022-01-02",
        },
        {
          name: "Tiramisu",
          calories: 300,
          createdAt: "2021-10-03",
        },
        {
          name: "Cheesecake",
          calories: 600,
          createdAt: "2022-01-04",
        },
      ];
    
      const filterDesserts=desserts.filter(dessert=>dessert.calories<=500) 
    
        return (
          <div>
            <h2>List of low calorie desserts:</h2>
            <ul>
                
                {filterDesserts.map((d) => (
                    <li key={d.name}>{d.name} - {d.calories} cal</li>
                ))}
            </ul>
          </div>
        );
      
}

export default DessertWork