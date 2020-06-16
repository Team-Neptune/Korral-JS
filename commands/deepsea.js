module.exports = {
    name: 'deepsea',
    description: 'Displays deepsea statistics and infos',
    execute(message, args) {

        const dbFile = "./storage/deepsea_db.json";
        const deepseaApi = "https://api.github.com/repos/Team-Neptune/DeepSea/releases";
        const deepseaModules = "https://raw.githack.com/Team-Neptune/DeepSea/master/builder/deepsea.json";
        const moduleDefinitions = "https://raw.githack.com/Team-Neptune/DeepSea/master/builder/Modules/modules-definitions.json";


        var db = {
            "lastFetchDate": new Date(),
            "releaseApi": {},
            "deepseaModules": {},
            "moduleDefinitions": {}
        }

        var getJsonFromUrl = async (url) => {
            const response = await fetch(url);
            const data = await response.json();
            return data
        }

        var createFile = (file) => {
            fs.closeSync(fs.openSync(file, 'w'));
        }

        var writeToDb = (databaseObject) => {
            let data = JSON.stringify(databaseObject);
            fs.writeFileSync(dbFile, data);
        }

        var readFromDb = () => {
            var rawdata = fs.readFileSync(dbFile);
            return JSON.parse(rawdata);
        }

        var updateDatabase = async () => {
            console.log("Downloading new APIs")
            db.lastFetchDate = new Date();
            db.releaseApi = await getJsonFromUrl(deepseaApi);
            db.deepseaModules = await getJsonFromUrl(deepseaModules);
            db.moduleDefinitions = await getJsonFromUrl(moduleDefinitions);
            writeToDb(db);
        }

        var buildEmbedField = (module, embed) => {
            var url = "";
            var service = "";
            if (module.git.service === 0) {
                url = "http://github.com/" + module.git.org_name + "/" + module.git.repo_name;
                service = "Github";
            } else {
                url = "https://gitlab.com/" + module.git.org_name + "/" + module.git.repo_name;
                service = "Gitlab";
            }
            embed.fields.push({
                "name": module.git.repo_name,
                "value": `[${module.git.org_name}](${url})`,
                "inline": true
            })
        }

        var setup = async () => {
            try {
                if (!fs.existsSync("./storage")) {
                    fs.mkdirSync("./storage");
                }

                if (fs.existsSync(dbFile)) {
                    db = readFromDb();
                    var differenceInHours = Math.abs(new Date() - new Date(db.lastFetchDate)) / 36e5;
                    if (differenceInHours > 1) updateDatabase();
                } else {
                    createFile(dbFile);
                    updateDatabase();
                }
            } catch (err) {
                console.error(err)
            }
        }


        setup().then(() => {

            var latestReleaseTag = db.releaseApi[0].tag_name;
            var latestReleaseDate = db.releaseApi[0].published_at;
            var versions = "";
            var totalDownloads = 0;

            db.releaseApi.forEach((release, index) => {
                release.assets.forEach(asset => {
                    totalDownloads += asset.download_count;
                    if (index === 0) {
                        versions += "- [" + asset.name + "](" + asset.browser_download_url + ") (" + asset.download_count + ")\n";
                    }
                });
            })

            var embed = {
                "title": "DEEPSEA SUMMARY",
                "description": `
            Useful information about DeepSea
            
            Latest Release: **${latestReleaseTag}**
            Release date: **${latestReleaseDate}**
            Versions:
            ${versions}
            Combined total downloads: **${totalDownloads}**
            
            __Included Homebrews__:
            `,
                "url": "https://github.com/Team-Neptune/DeepSea/",
                "color": 6277439,
                "thumbnail": {
                    "url": "https://raw.githubusercontent.com/Team-Neptune/DeepSea/master/assets/deepsea_256.jpg"
                },
                "fields": [],
                "footer": {
                    "text": "Last cached "
                },
                "timestamp": db.lastFetchDate
            };



            db.moduleDefinitions.forEach(definition => {
                db.deepseaModules.modules.forEach(module => {
                    if (definition.name == module.module_name) {
                        buildEmbedField(definition, embed);
                    }
                });
            });

            message.channel.send({ embed });
        });



    }
};