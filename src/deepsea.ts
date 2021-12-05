import fetch from 'node-fetch'
import {closeSync, openSync, writeFileSync, readFileSync, existsSync, mkdirSync} from 'fs'
import {DeepseaDb} from '../typings'
const dbFile = "./storage/deepsea_db.json";
const deepseaApi = "https://api.github.com/repos/Team-Neptune/DeepSea/releases";

var db:DeepseaDb = {
    "lastFetchDate":0,
    "releaseApi": []
}

var getJsonFromUrl = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data
    }catch(err){console.error(err)}
}

var createFile = (file) => {
    closeSync(openSync(file, 'w'));
}

var writeToDb = (databaseObject) => {
    let data = JSON.stringify(databaseObject);
    writeFileSync(dbFile, data);
}

var readFromDb = () => {
    var rawdata = readFileSync(dbFile).toString();
    return JSON.parse(rawdata);
}

var updateDatabase = async () => {
    console.log("Updating DeepSea DB data")
    db.releaseApi = await getJsonFromUrl(deepseaApi);
    db.lastFetchDate = Date.now()
    writeToDb(db);
}

var setup = async () => {
    try {
        if (!existsSync("./storage")) {
            mkdirSync("./storage");
        }

        if (existsSync(dbFile)) {
            db = readFromDb();
            var differenceInHours = Math.abs(Date.now() - db.lastFetchDate) / 36e5;
            if (differenceInHours > 1) updateDatabase(), console.log(`Updating database...`);
            if (differenceInHours < 1) console.log(`Cached data new enough...`);
        } else {
            console.log(`Creating db file...`)
            createFile(dbFile), updateDatabase();
        }
    } catch (err) {
        console.error(err)
    }
}


class Get {
    name:string;
    downloadCount:string;
    latestTag: string;
    releaseDate:string;
    /**
     * 
     * @param {Get} p 
     */
    constructor(p?:Get){
        if(p)
            Object.keys(p).forEach(e => {
                this[e] = p[e];
            });
    }
    setName(n){
        this.name = n;
        return this;
    }
    setDownloadCount(dc){
        this.downloadCount = dc;
        return this;
    }
    setLatestTag(lt){
        this.latestTag = lt;
        return this;
    }
    setReleaseDate(rd){
        this.releaseDate = rd;
        return this;
    }
}

export default class {
    /**
     * Get the latest version
     * @returns {String} latest tag
     */
    getLatestVersion(){
        return db.releaseApi[0].tag_name;
    }
    getLatestReleaseDate(){
        return new Date(db.releaseApi[0].published_at);
    }
    getTotalDownloads(){
        var totalDownloads = 0;
        for (let mainIndex = 0; mainIndex < db.releaseApi.length; mainIndex++) {
            const release = db.releaseApi[mainIndex];
            for (let index = 0; index < release.assets.length; index++) {
                const asset = release.assets[index];
                totalDownloads += asset.download_count;
                if(mainIndex+1 == db.releaseApi.length)
                    return totalDownloads;
            }
        }
    }
    /**
     * Update cached data
     */
    async update(){
        let res = await setup()
        return res
    }
    updateDatabase(){
        updateDatabase();
    }
    /**
     * @returns {Array<Get}
     */
    get(){
        let returned = new Array;
        const release = db.releaseApi[0];
        for (let index = 0; index < release.assets.length; index++) {
            let releaseReturn = new Get()
            const asset = release.assets[index];
            releaseReturn
            .setLatestTag(release.tag_name)
            .setName(asset.name)
            .setDownloadCount(asset.download_count)
            .setReleaseDate(release.published_at)
            returned.push(releaseReturn);
            if(index+1 == release.assets.length)
                return returned
        }
    }
    getLastFetched(){
        return db.lastFetchDate
    }
}