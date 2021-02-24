module.exports = {
    name: 'e',
    description: 'Get eshop prices for a game in all available countrys and convert them to a given currency.',
    execute(message, args) {

        if (!args[0]){
            message.channel.send("Please specify a TitleID");
            return;
        }

        let fs = require('fs')
        let path = require("path")
        let https = require('https')
        let extract = require('extract-zip')
        let currencyConverter = require('ecb-exchange-rates');

        // not all countrys have a specific game
        // games per country can have different NSU ids
        // titleid (if existing) is always the same
        // eshop querys are via language code and nsuid

        // if cache (1 day?) outdated
        //      get Blawars TitleDB 

        // loop through all files for titles
        //       loop through all items for titleid
        //           if found -> get nsuid

        // query eshop api by country (from blawars filename) and nsuid
        // reformat the returned object. add country, language, output currency + delete some stuff
        
        // query a currencyconverter with given values
        // reformat the returned object. add output currency value

        // display everything neatly to discord.


        if (!client.tempStorage["eshopprices"]){
            updateTitleDB();
        }

        async function downloadFile(url, path) {
            const res = await fetch(url);
            const fileStream = fs.createWriteStream(path);
            await new Promise((resolve, reject) => {
                res.body.pipe(fileStream);
                res.body.on("error", reject);
                fileStream.on("finish", resolve);
              });
          };

        async function updateTitleDB(){
            client.tempStorage["eshopprices"] = {
                "lastUpdate": new Date(),
                "tdbfiles": []
            }
            const dest  = './storage/master.zip'
            const url = 'https://codeload.github.com/blawar/titledb/zip/master'
            // await downloadFile(url, dest)
            // await extract(dest, { dir: path.resolve("./storage/titledb") })

            fs.readdir(path.resolve("./storage/titledb/titledb-master"), (err, files) => {
                files.forEach(file => {
                    var re = /^[A-Z]{2}.[a-z]{2}.json/;
                    if(file.match(re)){
                        client.tempStorage.eshopprices.tdbfiles.push(file)
                    }
                });
                let nsuobj = getNSUIDs(client.tempStorage.eshopprices.tdbfiles);
                fetchPriceApi(nsuobj);
            });
        }


        function getNSUIDs(tdbfileList){
            tmpobj = []
            tdbfileList.forEach(filename => {
                console.log("Opening:", filename)
                const data = fs.readFileSync("./storage/titledb/titledb-master/"+filename, {encoding:'utf8', flag:'r'});
                let tidfile = JSON.parse(data);
                for (var game in tidfile) {
                    if (tidfile[game]["id"] == args[0]){
                        coLa = filename.split(".")
                        tmpobj.push({
                            "country": coLa[0],
                            "language": coLa[1],
                            "nsuid": tidfile[game]["nsuId"]
                        })
                    }
                }
            });
            return tmpobj;
        }


        function fetchPriceApi(nsuobj){
            let urls = [];
            let count = 1
            let headers = {
                "Accept"       : "application/json",
                "Content-Type" : "application/json",
                "User-Agent"   : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36"
            };

            nsuobj.forEach(element => {

                // get json data
                // put everything into one array
                // `https://api.ec.nintendo.com/v1/price?country=${element.country}&ids=${element.nsuid}&lang=en`
            })

        };
    }
};
