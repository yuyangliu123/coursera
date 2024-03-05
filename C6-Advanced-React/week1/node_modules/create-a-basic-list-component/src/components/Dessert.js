const Dessert=()=>{
    
    const desserts = [
      {
        id: 1,
        title: "Chocolate Cake",
        description: "A rich, moist chocolate cake.",
        image: "https://butternutbakeryblog.com/wp-content/uploads/2023/04/chocolate-cake.jpg",
        price: "$10"
      },
      {
        id: 2,
        title: "Strawberry Cheesecake",
        description: "A creamy cheesecake with fresh strawberries.",
        image: "https://random.image.url/2.jpghttps://natashaskitchen.com/wp-content/uploads/2023/06/Strawberry-Cheesecake-3.jpg",
        price: "$12"
      },
      {
        id: 3,
        title: "Apple Pie",
        description: "A classic apple pie with a flaky crust.",
        image: "https://www.inspiredtaste.net/wp-content/uploads/2022/11/Apple-Pie-Recipe-Video.jpg",
        price: "$8"
      }
    ];
  
    const dessertOutput=desserts.map(dessert=>{
      return{
        content: `${dessert.title} - ${dessert.description}`,
        image: dessert.image,
        price: dessert.price,
      }
    })
    console.log(dessertOutput)
  return(
    <>
    <h1>Dessert</h1>
    </>
    
  )
}

export default Dessert