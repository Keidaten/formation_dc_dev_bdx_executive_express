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

//POKEMON
app.get('/', function (req, res) {
  let pokemonChosen1 = req.query.chooseYourPokemon1;                            //récupère le paramètre de requête pour le 1er pokemon
  let pokemonChosen2 = req.query.chooseYourPokemon2;                            //récupère le paramètre de requête pour le 2e pokemon


  axios.get('https://pokeapi.co/api/v2/pokemon/' + pokemonChosen1)               //méthode d'appele d'axios pour le pokemon 1
    .then((response) =>{
      // handle success
      let pokemonData = response.data;                                          // récupère toutes les données du pokemon
      let pokemonName = pokemonData.name                                        // récupère ne nom
      let pokemonHP = pokemonData.stats[5].base_stat                            // récupère les HP
      let pokemonATK = pokemonData.stats[4].base_stat                           // récupère l'ATK

      res.json(pokemonHP);
    })
    .catch((error) => {
      // handle error
      console.log(error);
    })
    // .then(axios.get('https://pokeapi.co/api/v2/pokemon/' + pokemonChosen2))   //appel d'axios pour le pokemon 2


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
