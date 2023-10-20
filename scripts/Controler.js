class Controleur {
    // Plus besoin de await et async car pas de fetch
    constructor () {
        this.recipesList =  Model.getRecipes();
        this.vue = new VueIndex(this.recipesList);
    }
    
    showRecipes() {
        this.vue.showRecipesfromAList(this.recipesList);
    }
    
    showFilters(newRecipesList) {
        let ustensilsList = [];
        let appliancesList = [];
        let ingredientsList = [];

        if(newRecipesList){
            ustensilsList =  Utils.getUstensilsList(newRecipesList);
            appliancesList =  Utils.getAppliancesList(newRecipesList);
            ingredientsList =  Utils.getIngredientsList(newRecipesList);
        }
        else{
            ustensilsList =  Utils.getUstensilsList(this.recipesList);
            appliancesList = Utils.getAppliancesList(this.recipesList);
            ingredientsList =  Utils.getIngredientsList(this.recipesList);
        }
        this.vue.displayIndexFilters(ustensilsList,appliancesList,ingredientsList);
    }
}