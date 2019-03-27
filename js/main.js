// model stores some useful data to be cached
let model = {
    searchedBeers: [],
    loadedFromData: [],
}

// view handles any changes to the view
let view = {
    catalog: document.getElementById('catalog'),
    source: document.getElementById('entry-template').innerHTML,

    cleanContainer() {
        this.catalog.innerHTML = '';
    },

    addToContainer(objList) {
        let template = Handlebars.compile(this.source);
        let html = template({'beers': objList});

        this.catalog.innerHTML += html;
    },

    changeLayout() {
        document.querySelectorAll('.beer-item').forEach(beerItem => {
            let columns = beerItem.querySelectorAll('.column')
            columns[0].classList.toggle('col-12');
            columns[1].classList.toggle('col-12');
            columns[0].classList.toggle('col-4');
            columns[1].classList.toggle('col-8');
        });
    },
}


document.addEventListener('DOMContentLoaded', function() {
    // mv handles any underlying functionality
    let mv = {
        data: data,

        // sets out event listeners and initial catalog
        init() {
            let initialBeers = this.fetchRandomBeersFromStorage(8, mv.data);
            view.addToContainer(initialBeers);

            document.addEventListener('scroll', mv.addMoreBeers);

            document.getElementById('searchButton').addEventListener('click', mv.handleQuery);

            document.addEventListener('click', mv.showBeerDetails)
        },

        handleQuery() {
            let value = document.getElementById('beerInput').value;
            if(!value) return;

            document.removeEventListener('scroll', mv.addMoreBeers);

            mv.fetchQuery(value).then(res => {
                view.cleanContainer();
                view.addToContainer(res);
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
            console.log(evt.target);
        }
    }

    mv.init();
})
