function sum(...arr){
    if (!arr.length) return undefined;
    return arr.reduce((accumulator, current)=>{
        return accumulator + current;
    })
}

const filterByType = (type, ...vals) => {
    return vals.filter((v)=> typeof v ===type);
}

let myStr = "helloo";
const newArr = [...myStr];