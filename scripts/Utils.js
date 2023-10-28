class Utils{
    /* J'ai accès à cette fonction de partout car elle est static */
    static removeFromArray(tab,element){
        let index = tab.indexOf(element);
        if(index !== -1){
            tab.splice(index,1);
        }
    }
    
    static isIngredientInThisRecipe(ingredientToFind,recipe){
        let ingredientValid = false;
        for(let ingredient of recipe.ingredients){
            if(ingredient.ingredient.toLowerCase() == ingredientToFind.toLowerCase()){
                ingredientValid = true;
                break;
            }
        }
        return ingredientValid;
    }

    static isUstensileInThisRecipe(ustentileToFind,recipe){
        let ustensileValid = false;
        for(let ustensile of recipe.ustensils){
            if(ustensile.toLowerCase().indexOf(ustentileToFind) >= 0){
                ustensileValid = true;
                break;
            }
        }
        return ustensileValid;
    }

     /* -------- RECUPERER LISTE DES APPAREILS -------- */    
    static getAppliancesList(recipes) {
        let applianceList = [];
        for (let i = 0 ; i < recipes.length ; i++) {
            // recipes[i].appliance = recipes[i].appliance.toLowerCase();
            if (!applianceList.includes(recipes[i].appliance)) {
                applianceList.push(recipes[i].appliance.trim());
            }
        }
        return applianceList;
    }
    
    /* -------- RECUPERER LISTE DES USTENSILS -------- */    
    static getUstensilsList(recipes) {
        let ustensilsList = [];
        for (let i = 0 ; i < recipes.length ; i++) {
            // recipes[i].ustensils = recipes[i].ustensils.toLowerCase();
            for (let ustensil of recipes[i].ustensils){
                ustensil = ustensil.toLowerCase();
                if (!ustensilsList.includes(ustensil)) {
                    ustensilsList.push(ustensil.trim());
                }
            }
        }
        return ustensilsList;
    }
    
    static getIngredientsList(recipes) {
        let ingredientsList = [];
        for (let i = 0 ; i < recipes.length ; i++) {
            // recipes[i].ustensils = recipes[i].ustensils.toLowerCase();
            for (let ingredient of recipes[i].ingredients){
                ingredient = ingredient.ingredient.toLowerCase();
                if (!ingredientsList.includes(ingredient)) {
                    ingredientsList.push(ingredient.trim());
                }
            }
        }
        return ingredientsList;
    }
    
}