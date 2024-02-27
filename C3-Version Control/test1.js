const birds = [ "Parrots", "Falcons", "Eagles", "Emus", "Caracaras", "Egrets" ];

let eagle=birds.indexOf("Eagles")
birds.splice(eagle,1)
let ebirds = birds.filter(item =>item.startsWith("E"))
console.log(eagle);
console.log(birds);
console.log(ebirds);