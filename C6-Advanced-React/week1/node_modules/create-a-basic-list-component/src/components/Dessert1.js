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
        image: "https://natashaskitchen.com/wp-content/uploads/2023/06/Strawberry-Cheesecake-3.jpg",
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
  
    
  return(
    desserts.map(dessert => (
      <div key={dessert.id}>
        <h2>{dessert.title}</h2>
        <p>{dessert.description}</p>
        <img src={dessert.image} alt={dessert.title} />
        <p>{dessert.price}</p>
      </div>
    ))
    
  )
}

export default Dessert