"https://github.com/greyhatguy007/meta-front-end-developer-professional-certificate/tree/main/C2-Programming-with-Javascript/week5/w5a1"

// Given variables
const dishData = [
    {
        name: "Italian pasta",
        price: 9.55
    },
    {
        name: "Rice with veggies",
        price: 8.65
    },
    {
        name: "Chicken with potatoes",
        price: 15.55
    },
    {
        name: "Vegetarian Pizza",
        price: 6.45
    },
]
const tax = 1.20;
function getPrice (taxBoolean){
    for(var dish =0;dish<dishData.length;dish++){
        let finalPrice
        if(taxBoolean===true){
            finalPrice=dishData[dish].price*tax
        }else if(taxBoolean===false){
            finalPrice=dishData[dish].price
        }else{
            console.log("You need to pass a boolean to the getPrices call!");
            return
        }
        console.log(`Dish: ${dishData[dish].name} Price: $${finalPrice}`);
    }
}

getPriceArrow=(taxBoolean)=>{
    for(dish of dishData){  //use for of loop(because dishData is array)
        let finalPrice
        finalPrice=(taxBoolean) ? dish.price*tax:dish.price // use ternary operator
        console.log(`Dish: ${dish.name} Price: $${finalPrice}`);
    }
    
}

getPriceArrow2=(taxBoolean)=>{
    let priceAction = {  //use hash table
        true: dish=>dish.price * tax,
        false: dish => dish.price,
        default: ()=>{
            console.log("You need to pass a boolean to the getPrices call!");
            return;
        }
    }

    for(dish of dishData){
        let action = priceAction[taxBoolean] || priceAction.default;
        let finalPrice=action(dish);
        console.log(`Dish: ${dish.name} Price: $${finalPrice}`);
    }
}

function getDiscount(taxBoolean,guests){
    getPrice(taxBoolean)
    if(typeof(guests)=="number" && 0<guests && guests<30){
        let discount = 0;
        if(guests<5){
            discount=5
        }else if(guests>=5){
            discount=10
        }
        console.log(`Discount is: $${discount}`);
    }else{
        console.log("The second argument must be a number between 0 and 30");
    }
}

function getDiscount2(taxBoolean,guests){
    getPriceArrow(taxBoolean)
    if(typeof(guests)=="number" && 0<guests && guests<30){
        let discount = 0;
        if(guests<5){
            discount=5
        }else if(guests>=5){
            discount=10
        }
        console.log(`Discount is: $${discount}`);
    }else{
        console.log("The second argument must be a number between 0 and 30");
    }
}

function getDiscount3(taxBoolean,guests){
    getPriceArrow2(taxBoolean)
    if(typeof(guests)=="number" && 0<guests && guests<30){
        let discount = 0;
        if(guests<5){
            discount=5
        }else if(guests>=5){
            discount=10
        }
        console.log(`Discount is: $${discount}`);
    }else{
        console.log("The second argument must be a number between 0 and 30");
    }
}
getDiscount(true,10)
getDiscount2(false,3)
getDiscount3(true,100)