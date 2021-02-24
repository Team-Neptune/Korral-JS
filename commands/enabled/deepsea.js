const { updateLocale } = require("moment");

module.exports = {
    name: 'deepsea',
    description: 'Displays deepsea statistics and infos',
    execute(message, args) {
        var request = require('request'); // this is deprecated and shoud **not** be used anymore!

        let deepseaApi = "https://api.github.com/repos/Team-Neptune/DeepSea/releases";

        function update(){
            client.tempStorage["deepsea"] = {};
            request({url: deepseaApi, headers: { 'User-Agent': 'request'}, json: true}, function(err, res, releasejson) {
                client.tempStorage["deepsea"]["lastUpdate"] = new Date();
                client.tempStorage["deepsea"]["lastTag"] = releasejson[0].tag_name;
                client.tempStorage["deepsea"]["pubDate"] = releasejson[0].published_at;
                client.tempStorage["deepsea"]["body"] = releasejson[0].body;
                client.tempStorage["deepsea"]["totalDownloads"] = 0
                releasejson.forEach((release) => {
                    release.assets.forEach(asset => {
                        client.tempStorage["deepsea"]["totalDownloads"] += asset.download_count;
                    });
                })
                sendMessage();
             })
        }


        if (!client.tempStorage["deepsea"]){
            console.log("tempstorage does not exit")
            update();
        } else{
            let lastDate = client.tempStorage["deepsea"]["lastUpdate"];
            let currDate = new Date()
            let diffTime = Math.abs(currDate.getTime() - lastDate.getTime()); //milliseconds
            diffTime = (diffTime / 1000) / 60 //minutes
            if (diffTime > 30){
                update();
            } else {
                sendMessage();
            }

        };

        function sendMessage(){
            message.channel.send("Cached from: " + client.tempStorage["deepsea"]["lastUpdate"]+ "\n\n" +
            "- Current version: " + client.tempStorage["deepsea"]["lastTag"] + "\n" +
            "- Released at: " + client.tempStorage["deepsea"]["pubDate"] + "\n" +
            "- Total Downloads: " + client.tempStorage["deepsea"]["totalDownloads"] + "\n" +
            "```" + client.tempStorage["deepsea"]["body"] + "```")
        }
    }
};