const { updateLocale } = require("moment");

module.exports = {
    name: 'deepsea',
    description: 'Displays deepsea statistics and infos',
    execute(message, args) {
        var request = require('request'); // this is deprecated and shoud **not** be used anymore!

        let deepseaApi = "https://api.github.com/repos/Team-Neptune/DeepSea/releases";

        function update(){
            request({url: deepseaApi, headers: { 'User-Agent': 'request'}, json: true}, function(err, res, releasejson) {
                console.log(releasejson[0])
                client.tempStorage["lastUpdate"] = new Date();
                client.tempStorage["lastTag"] = releasejson[0].tag_name;
                client.tempStorage["pubDate"] = releasejson[0].published_at;
                client.tempStorage["totalDownloads"] = 0
                releasejson.forEach((release) => {
                    release.assets.forEach(asset => {
                        client.tempStorage["totalDownloads"] += asset.download_count;
                    });
                })
             }).then(function(){
                sendMessage();
            });
        }


        if (!client.tempStorage["deepsea"]){
            update();
        } else{
            let lastDate = client.tempStorage["deepsea"]["lastUpdate"];
            let currDate = new Date()
            let diffTime = Math.abs(lastDate - currDate); //milliseconds
            diffTime = (diffTime * 1000) * 60 //minutes
            if (diffTime > 30){
                update();
            }
        };

        function sendMessage(){
            console.log(client.tempStorage["lastUpdate"], client.tempStorage["lastTag"],
            client.tempStorage["pubDate"], client.tempStorage["totalDownloads"])
        }
    }
};