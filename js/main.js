// model stores some useful data to be cached
let model = {
    data: data,
    searchedBeers: [],
    loadedFromData: [],
}

// view handles any changes to the view
let view = {
    catalog: document.getElementById('catalog'),
    entrySource: document.getElementById('entry-template').innerHTML,
    detailSource: document.getElementById('beer-detail').innerHTML,

    cleanContainer() {
        this.catalog.innerHTML = '';
    },

    addToContainer(objList) {
        let template = Handlebars.compile(this.entrySource);
        let html = template({'beers': objList});

        this.catalog.innerHTML += html;
    },

    containerMessage(str) {
        this.catalog.innerHTML += `<p class="lead text-center">${str}</p>`;
    },

    showBeer(beer) {
        let template = Handlebars.compile(this.detailSource);
        let html = template(beer)

        this.catalog.innerHTML += html;
    }
}


document.addEventListener('DOMContentLoaded', function() {
    // mv handles any underlying functionality
    let mv = {
        data: data,

        // sets out event listeners and initial catalog
        init() {
            view.cleanContainer();

            let initialBeers = this.fetchRandomBeersFromStorage(8, mv.data);
            view.addToContainer(initialBeers);

            document.addEventListener('scroll', mv.addMoreBeers);

            document.getElementById('queryForm').addEventListener('submit', mv.handleQuery);

            document.addEventListener('click', mv.showBeerDetails)
        },

        handleQuery(evt) {
            evt.preventDefault();
            let value = document.getElementById('beerInput').value;
            if(!value) return;

            document.removeEventListener('scroll', mv.addMoreBeers);

            mv.fetchQuery(value).then(res => {
                view.cleanContainer();
                if(res.length > 0) view.addToContainer(res);
                else view.containerMessage('No beers found.');
            });
        },

        async fetchQuery(query) {
            query = query.split(' ').join('_');
            let baseUrl = "https://api.punkapi.com/v2/beers?";
            let limit = '&per_page=8';
            let results = [], i = 0,
                parameters= [
                    'beer_name',
                    'yeast',
                    'malt',
                    'food',
                ];

            // Fetches results until it has 8 beers
            while(results.length < 8 && i < parameters.length) {
                let response = await fetch(baseUrl + parameters[i++] + '=' + query + limit)
                let result = await response.json();

                results = results.concat(result);
            }

            model.searchedBeers = results;
            return results
        },

        fetchRandomBeersFromStorage(numb, beerData) {
            let choosenBeers = [];

            while(choosenBeers.length < numb && model.loadedFromData.length < beerData.length) {
                let random = Math.floor(Math.random() * 50);

                if(!model.loadedFromData.includes(random)) {
                    model.loadedFromData.push(random);
                    choosenBeers.push(beerData[random])
                }
            }

            return choosenBeers
        },

        addMoreBeers() {
            if((window.innerHeight + window.scrollY) < document.body.offsetHeight) {
                return;
            }

            let moreBeers = mv.fetchRandomBeersFromStorage(4, mv.data);
            view.addToContainer(moreBeers);
        },

        showBeerDetails(evt) {
            if(evt.target.classList.contains('beer-header') || evt.target.classList.contains('beer-image')) {

                let id = +evt.target.parentNode.parentNode.parentNode.dataset.id;
                console.log(id);

                let list = (model.searchedBeers.length > 1) ? model.searchedBeers : model.data;

                let beer = list.find(beer => beer.id === id);

                document.removeEventListener('scroll',  mv.addMoreBeers)
                view.cleanContainer();
                view.showBeer(beer);
            }
        }
    }

    mv.init();
})
