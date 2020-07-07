const fs = require('fs');
const http = require('http'); //include http module
const url = require('url'); //include url module

const slugify = require('slugify'); 

const replaceTemplate = require('./modules/replaceTemplate'); //import our own module

//SERVER


//top level command will execute only once when program starts. For ez use data
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8'); //call data from file
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8'); //call data from file
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8'); //call data from file

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); //call data from file
const dataObj = JSON.parse(data); //parse data and assign to the dataObj variable

const slugs = dataObj.map(el => slugify(el.productName, {lower: true})); //loop all data in Json and slugify productName


const server = http.createServer((req, res)=>{ //create a server

    const {query, pathname} = url.parse(req.url, true);
    //const pathName=req.url;

//OVERVIEW page
if(pathname==='/' || pathname==='/overview'){ //if request to this url, respond as the statement below
    res.writeHead(200, {'Content-type': 'text/html'});
    
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    // console.log(cardsHtml);
    res.end(output);

//PRODUCT page
}else if(pathname==='/product'){
    const product = dataObj[query.id]; //retrieve data json according to id. For ex, if id=0, it will respone json data with id of 0
    const output = replaceTemplate(tempProduct, product); //replace placeholders with retrieved data in json
    res.end(output);

//API
} else if(pathname==='/api'){
    res.writeHead(200, {'Content-type': 'application/json'}); //show Json data in page
    res.end(data);

//Not found
}else{ //if request to undefined url above, we will get respond Page not found! or 404 error
    res.writeHead(404, {
        'Content-type': 'text/html',  //the content type when get undefined url is html, that why put <h1> in hand out below
        'my-own-header': 'hello error'
    });
    res.end('<h1>Page not found!<h1>');
}
});

server.listen(8000,'127.0.0.1', (/*callback function*/)=>{ //create incoming request on the local host IP 
    console.log('Listening to requests on port 8000');
});