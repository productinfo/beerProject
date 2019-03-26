let model = {
    searchedBeers: [],
    loadedFromData: [],
}

let view = {
    catalog: document.getElementById('catalog'),
    source: document.getElementById('entry-template').innerHTML,

    cleanContainer() {
        this.catalog.innerHTML = '';
    },

    addContainer(objList) {
        let template = Handlebars.compile(this.source);
        let html = template({'beers': objList});
        console.log(objList);
        // console.log(html);
        this.catalog.innerHTML += html;
    },
}


document.addEventListener('DOMContentLoaded', function() {

    let mv = {
        init() {
            let beerData = data.slice(0, 10);
            view.addContainer(beerData)
        },

        changeLayout() {
            document.querySelectorAll('.beer-item').forEach(beerItem => {
                let columns = beerItem.querySelectorAll('.column')
                // console.log(columns);
                columns[0].classList.toggle('col-12');
                columns[1].classList.toggle('col-12');
                columns[0].classList.toggle('col-4');
                columns[1].classList.toggle('col-8');
            });
        },

        handleQuery() {
            let value = document.getElementById('beerInput').value;
            if(!value) return;

            let results = fetchQuery(value)
            view.cleanContainer();
            view.addContainer(results);
        },

        fetchQuery(query) {
            let query = query.split(' ').join('_');
            let baseUrl = "https://api.punkapi.com/v2/beers?";
            let limit = '&per_page=10';
            let results = [], i = 0,
                parameters= [
                    'beer_name',
                    'yeast',
                    'malt',
                    'food',
                ];
                // Fetches results until it has 10 beers
            while(results.length < 10 && i < parameters.length) {
                fetch(baseUrl + parameters[i++] + '=' + query + limit)
                .then(res => res.json())
                .then(res => results = results.concat(res))
                .catch(err => alert(err));
            }
            return results
        }
    }
    mv.init();
})
