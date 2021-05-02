
module.exports = {
    getCategoriesFromCompetition: function (competition) {
        if (competition === null) {
            return null;    
        }

        var categories = [];

        for (var i=0 ; i < competition.categories.length ; i++) {
            categories.push(competition.categories[i].name)
        }

        return categories
    },

    convertSportyFormatToPodiumFormat(sportyCompObj) {

        let newPosiumCompObj = {}

        newPosiumCompObj["name"] = sportyCompObj.CONTEST_NAME
        newPosiumCompObj["code"] = "2090"
        newPosiumCompObj["description"] = sportyCompObj.DESCRIPTION
        newPosiumCompObj["courtsNum"] = sportyCompObj.TOTAL_COURTS
        newPosiumCompObj["date"] = sportyCompObj.DATE
        newPosiumCompObj["type"] = sportyCompObj.BRANCH
        newPosiumCompObj["method"] = "בתים/נוקאווט"
        newPosiumCompObj["categories"] = []
        

        sportyCompObj.CATEGORIES.forEach(category => {
            let podiumCategoryObj = {}
            podiumCategoryObj["name"] = category.CATEGORY_TXT
            let competitors = this.calcCompetitorsInCategory(category)

            podiumCategoryObj["competitors"] = competitors
            newPosiumCompObj.categories.push(podiumCategoryObj)
        });

        newPosiumCompObj["curGames"] = []
        sportyCompObj.CATEGORIES.forEach(category => {
            let newGeneratedGames = this.calcGamesFromCategory(category)
            newGeneratedGames.forEach(game => {
                newPosiumCompObj.curGames.push(game)
            });
        });
        

        return newPosiumCompObj
    },

    calcGamesFromCategory(category) {
        let competitorsGames = []

        let knockoutMatchStage = 0
        let originalMatchIndexesArr = []

        category.ROUNDS.forEach(round => {
            let i = 0;
            round.GROUP.forEach(group => {
                group.GAMES.forEach(game => {
                    let newGame = {}

                    newGame["id"] = game.GAME_ID
                    newGame["teamA"] = game.PLAYER_A
                    newGame["teamB"] = game.PLAYER_B
                    newGame["resultA"] = game.RESULT_A
                    newGame["resultB"] = game.RESULT_B
                    newGame["finished"] = game.FINISH
                    newGame["startTime"] = game.TIME_START
                    newGame["endTime"] = game.TIME_END
                    newGame["category"] = category.CATEGORY_TXT

                    // TODO : Added court id calculation using is playing
                    // This is not verified yet !
                    newGame["court"] = game.COURT_ID
                    if (!category.IS_PLAYING &&
                        !newGame.finished) {

                         newGame["court"] = 0;
                    }
                    
                    // If this is a house game
                    if (round.ROUND_TXT === "GROUPS") {
                        newGame["houseId"] = group.GROUP_ID
                        newGame["stage"] = 3
                    } 
                    // Else, this is a knockout game
                    else {
                        newGame["stage"] = 5
                        newGame["matchStage"] = knockoutMatchStage
                        newGame["matchIndex"] = group.GROUP_ID - 1

                        if (newGame.matchStage === 0) {
                            let obj = {}

                            obj["name"] = newGame.teamA
                            obj["originalMatchIndex"] = newGame.matchIndex

                            originalMatchIndexesArr.push(obj)
                            obj = {}

                            obj["name"] = newGame.teamB
                            obj["originalMatchIndex"] = newGame.matchIndex
                            
                            originalMatchIndexesArr.push(obj)
                        }

                        newGame["originalMatchIndexA"] = this.getOriginalMatchIndex(originalMatchIndexesArr,newGame.teamA)
                        newGame["originalMatchIndexB"] = this.getOriginalMatchIndex(originalMatchIndexesArr,newGame.teamB)

                        if (i === round.GROUP.length - 1) {
                            knockoutMatchStage++
                        }

                        i++;
                    }

                    competitorsGames.push(newGame)
                    
                });
            });
        });
        return competitorsGames
    },

    getOriginalMatchIndex(originalMatchIndexesArr,playerName) {
        let result

        originalMatchIndexesArr.forEach(element => {
            if (element.name === playerName) {
                result = element.originalMatchIndex
            }
        });

        return result
    },

    calcCompetitorsInCategory(category) {
        let competitorsNames = []
        
        category.ROUNDS.forEach(round => {
            round.GROUP.forEach(group => {
                group.GAMES.forEach(game => {
                    competitorsNames.push(game.PLAYER_A)
                    competitorsNames.push(game.PLAYER_B)
                });
            });
        });

        competitorsNames = [...new Set(competitorsNames)];
        let competitors = []

        competitorsNames.forEach(competitorName => {
            let player = {}
            player["name"] = competitorName
            competitors.push(player)
        });

        return competitors
    }
}