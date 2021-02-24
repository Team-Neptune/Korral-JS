module.exports = {
    name: 'eshopprices',
    description: 'Get eshop prices for a game in all available countrys and convert them to a given currency.',
    execute(message, args) {

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


    }
};
