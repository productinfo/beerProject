let model = []

function randomBeers(numb) {
    let articles = [];

    for(let i = 0; i < numb; i++) {
        fetch('https://api.punkapi.com/v2/beers/random')
        .then( res => res.json())
        .then( res => console.log(res))
    }
}
randomBeers(1);

let view = {

};
