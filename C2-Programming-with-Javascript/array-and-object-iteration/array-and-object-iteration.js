var dairy = ['cheese', 'sour cream', 'milk', 'yogurt', 'ice cream', 'milkshake']

function logDairy(arr){
    for(var i of arr){
        console.log(i);
    }
}

logDairy(dairy)

const animal = {
    canJump: true
}

const bird = Object.create(animal);
bird.canFly=true;
bird.hasFeathers = true;

function birdCan(obj){
    for(var key of Object.keys(obj)){
        console.log(`${key} : ${obj[key]}`);
    }
}
birdCan(bird)

function animalCan(){
    for(var i in bird){
        console.log(`${i} ${bird[i]}`);
    }
    for(var j in animal){
        console.log(`${j} ${animal[j]}`);
    }
}

animalCan()