for(let i=1; i<=5;i++){
    console.log(i);
}
console.log('Counting completed!')

for(let i=5;i>=1;i--){
    console.log(i);
}
console.log('Countdown finished!')

var i=1
while(i<=5){
    console.log(i);
    i++
}
console.log('Counting completed!')

var i = 5
while(i>=1){
    console.log(i);
    i--
}
console.log('Countdown finished!')

var y=2018
while(y<=2022){
    console.log(y);
    y++
}

for(let i =1;i<=4;i++){
    let j =1
    while(j<=5){
        console.log("week "+i+" - "+"day "+j);
        j+=1
    }
}

for( let i =1;i<=9;i++){
    for(let j=1;j<=9;j++){
        console.log(i+"*"+j+"="+i*j);
    }
}

var cubes = 'ABCDEFG';
//styling console output using CSS with a %c format specifier
for (var i = 0; i < cubes.length; i++) {
    var styles = "font-size: 40px; border-radius: 10px; border: 1px solid blue; background: pink; color: purple";
    console.log("%c" + cubes[i], styles)
}

function letterFinder(word , match){
    for(var i = 0; i<word.length; i++){
        if(word[i]==match){
            console.log("Found the",match,"at",i);
        }else{
            console.log('---No match found at', i)
        }
    }
}

letterFinder("test","t")

let drone = {
    speed: 100,
    altitude: 200,
    color: "red"
}

Object.keys(drone).forEach(key => {
    console.log(key);
});

Object.values(drone).forEach(value => {
    console.log(value);
});