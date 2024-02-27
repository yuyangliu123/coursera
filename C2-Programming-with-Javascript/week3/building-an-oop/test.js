
"https://github.com/greyhatguy007/meta-front-end-developer-professional-certificate/blob/main/C2-Programming-with-Javascript/week3/building-an-oop/README.md"
class Person{
    constructor(name="Tom",age=20,energy=100){
        this.name=name;
        this.age=age;
        this.energy=energy
    };
    sleep(){
        this.energy+=10
    };
    doSomethingFun(){
        this.energy-=10
    }
}

class Worker extends Person{
    constructor(xp=0,hourlyWage=10,name="Bob",age=21,energy=110){
        super(name,age,energy);
        this.xp=xp;
        this.hourlyWage=hourlyWage
    }
    doSomethingFun(){
        super.doSomethingFun;
    }
    sleep(){
        super.sleep;
    }
    goToWork(){
        this.xp+=10
    }
}

function intern(){
    let intern = new Worker();
    intern.name = "Bob";
    intern.age = 21
    intern.energy = 110
    intern.xp = 0
    intern.hourlyWage = 10
    intern.goToWork()
    return(intern)
}

function manager() {
    let manager = new Worker("Alice", 30, 120, 100, 30);
    manager.doSomethingFun();
    return manager;
    
}

console.log(intern());
console.log(manager());
var clothingItem = {
    price: 50,
    color: 'beige',
    material: 'cotton',
    season: 'autumn'
}
