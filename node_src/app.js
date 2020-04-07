const express = require('express')
const app = express()
const axios = require('axios')

let connect = require("./connection.js")
let config = require("./config.js")

let mustacheExpress = require('mustache-express')

app.engine("html", mustacheExpress())

  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
  app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  // enregister le nom du pokemon dans une variable
  // Envoyer une requête à l'api PokeAPI pour récupérer les infos du pokemon envoyé en param_tre
  // Renvoyer les informations du pokemon en paramètre au client
  // declare la variable qui contient le nom de pokemon passé en parametre de requete
  let pokemonChosen = req.query.pokemonName;

  // methode appel axios
  axios.get('https://pokeapi.co/api/v2/pokemon/' + pokemonChosen)
    .then((response) =>{
      // handle success
      //console.log(response.data);
      let pokemonData = response.data;
      res.json(pokemonData);
    })
    .catch((error) => {
      // handle error
      console.log(error);
    })
})

app.get('/calendar', (req, res) => {
  let date = new Date();
  console.log("params ", req.query);
  res.send('la requêquête du graal se passe le ' + date + " donc soyez prêts");

})

app.get("/hello", (req, res) => {
  res.render('index', {name: "Jey"})
})


app.get('/todo', async (req, res) => {

  let {db_client, db_connection} = await connect()

  db_connection.collection('todo').find({}).toArray((err, result) => {
    if(err) return console.log(err)

    console.log('todo :', result)

    db_client.close()
    res.send(result)

  })
})


app.listen(config.port, function () {
  console.log(`Example app listening on port ${config.port} !`)
})
