const addTwo=(a,b)=>{
    if(typeof(a)=="number"&&typeof(b)=="number"){
        console.log(a+b);
    }else{
        console.log("input must be number");
    }
}

function addThree(a, b, c) {
    console.log(a + b + c);
}

export { addTwo,addThree};