class VueIndex {
    constructor(recipeList) {
        this.ustensilsListFiltered = [];
        this.appliancesListFiltered = [];
        this.ingredientsListFiltered = [];
        this.recipesCount = 0;
        this.recipeList = recipeList;

        this.ingredientsActifsFilter = [];
        this.appareilsActifsFilter = [];
        this.ustensilesActifsFilter = [];

        this.search = document.getElementById("search");
        search.addEventListener('keyup', () => {
            this.refreshAllPagesAfterResearch();
        })
        document.addEventListener("DOMContentLoaded", function() {
            search.value = ""; /*VIDER LE CHAMP DE RECHERCHE LORSQU'ON RAFRAICHIT LA PAGE*/
        });
    }

    showRecipesfromAList(recipesList) {
        const recipesSection = document.querySelector(".recipes_section");
        let html = "";
        for (let recipe of recipesList) {
            html += this.createHtmlCard(recipe);
            this.recipesCount = recipesList.length;
        }
        document.querySelector("#recipers-count").innerHTML = this.recipesCount + " Recettes"; // Nombre de recette total
        recipesSection.innerHTML = html;
    }

    createHtmlCard(recipe) {
        let html = `
            <div class="recipeCard">
                <div class="recipeCard-head position-relative">
                    <img src="./assets/${recipe.image}" alt="Image ${recipe.name}">
                    <p class="position-absolute">${recipe.time} min</p>
                </div>
                <div>
                    <h2>${recipe.name}</h2>
                    <p class="titles">Recette</p>
                    <p class="card-description">${recipe.description}</p>
                    <p class="titles">Ingrédients</p>
                    <div class='ingredients-list flex-row flex-wrap'>`;

        for (let ingredient of recipe.ingredients) {
            html += `<div class="ingredients"><p>${ingredient.ingredient}</p>`
            if (ingredient.quantity) {
                html += `<p class='grey'>${ingredient.quantity}`
                if (ingredient.unit) {
                    html += ` ${ingredient.unit}</p></div>`
                }
                else {
                    html += `</p></div>`
                }
            }
            else {
                html += `</div>`
            }
        }
        html += `</div></div>
            </div>
        `
        return html;
    }

    displayIndexFilters(ustensilsList, appliancesList, ingredientsList) {
        this.ustensilsListFiltered = ustensilsList;
        this.appliancesListFiltered = appliancesList;
        this.ingredientsListFiltered = ingredientsList;

        let filtersListHtml = document.getElementById("filters-list");
        filtersListHtml.innerHTML = ``;//Reinitialiser pour pas avoir 6 boutons

        let ingredientsFilter = this.displayIndexFiltersFunction("Ingredients");
        filtersListHtml.innerHTML += ingredientsFilter;
        this.displayIndexFiltersList(ingredientsList, "Ingredients");

        let appliancesFilter = this.displayIndexFiltersFunction("Appareils");
        filtersListHtml.innerHTML += appliancesFilter;
        this.displayIndexFiltersList(appliancesList, "Appareils");
        
        let ustensilsFilter = this.displayIndexFiltersFunction("Ustentiles");
        filtersListHtml.innerHTML += ustensilsFilter;
        this.displayIndexFiltersList(ustensilsList, "Ustentiles");
        
        this.showHiddenPartFilter();
        this.filtersListSearchHandle();
        
        this.filtersInputHandle();
    }
    
    refreshIndexFitlers(recipesList) {
        let ingredientsList = Utils.getIngredientsList(recipesList);
        this.displayIndexFiltersList(ingredientsList, "Ingredients");
        
        let appliancesList = Utils.getAppliancesList(recipesList);
        this.displayIndexFiltersList(appliancesList, "Appareils");
        
        let ustensilsList = Utils.getUstensilsList(recipesList);
        this.displayIndexFiltersList(ustensilsList, "Ustentiles");

        this.filtersInputHandle();
    }

    displayIndexFiltersFunction(filterName) {
        let filters_html = `
            <div id="filter-${filterName}" class="flex-column filters-main">
                <div class="filter-head flex-row align-items-center cursor-pointer">
                    <p>${filterName}</p>
                    <i class="fa-solid fa-chevron-down grey"></i>
                </div>
                <div class="filter-hidden-part">
                    <div class="filter-search flex-row justify-content-center col-12">
                        <input data-id="${filterName}" type="text" class="col-12 search" placeholder="Verres, passoire, fourchette .."/>
                        <button class="white"><i class="fa-solid fa-magnifying-glass"></i></button>
                    </div>
                    <div class="filters-list ${filterName}">
                    </div>
                </div>
            </div>`
        return filters_html;
    }

    displayIndexFiltersList(filtersList, filterName) {
        let filterListDOM = document.querySelector(`.filters-list.${filterName}`);
        filterListDOM.innerHTML = ``;
        for (let filterElement of filtersList) {
            filterListDOM.innerHTML += `<div class="filters-list-of">
            <p>${filterElement}</p>
            </div>
            `
        }
    }

    showHiddenPartFilter() {
        let filter_button = document.querySelectorAll("div.filter-head");
        let filter_hidden = document.querySelectorAll("div.filter-hidden-part");

        for (let j = 0; j < filter_hidden.length; j++) {
            filter_hidden[j].isShown = false;
        }

        for (let i = 0; i < filter_button.length; i++) {
            filter_button[i].addEventListener("click", () => {
                let filter_button_parent = filter_button[i].parentNode;
                if (filter_hidden[i].isShown) {
                    filter_hidden[i].classList.remove("show");
                    filter_hidden[i].isShown = false;
                    filter_button_parent.classList.remove("show");
                }
                else {
                    filter_hidden[i].classList.add("show");
                    filter_hidden[i].isShown = true;
                    filter_button_parent.classList.add("show");
                }
            })
        }
    }

    filtersListSearchHandle() {
        let filter_searchs = document.querySelectorAll(".filter-search input");

        for (let i = 0; i < filter_searchs.length; i++) {
            filter_searchs[i].addEventListener("keyup", (e) => {
                // RECUPERATION DES TEXTES ET CREATION DE LA LISTE 
                e.target.value = e.target.value.toLowerCase();
                let inputTargetId = e.target.dataset.id;
                let filterHiddenPart = document.querySelector(`.filters-list.${inputTargetId}`);

                let filterList = [];
                if (inputTargetId == 'Appareils') {
                    filterList = this.appliancesListFiltered;
                }
                else if (inputTargetId == 'Ustentiles') {
                    filterList = this.ustensilsListFiltered;
                }
                else {
                    filterList = this.ingredientsListFiltered;
                }

                let filterListFiltererd = [];

                for (let filterListInitialItem of filterList) { // BOUCLE SUR LA TOTALITE DE MA LIST COMPLETE SANS FILTRE
                    let filterListText = filterListInitialItem.toLowerCase(); // STOKAGE DU TEXTE DE L'ELEMENT DE LA LIST, EN LOWERCASE
                    if (filterListText.indexOf(e.target.value) >= 0) { // SI LE TEXTE CONTIENT LE CONTENU DE MON INPUT
                        filterListFiltererd.push(filterListInitialItem); // ALORS ON LE RAJOUTE DANS LA FILTERLIST
                    }
                }

                // SUPRRESSION DE LA FILTERLIST ACTUELLE ET AJOUT DE LA NOUVELLE
                filterHiddenPart.innerHTML = ``;
                this.displayIndexFiltersList(filterListFiltererd, inputTargetId);
                this.filtersInputHandle();
            })
        }
    }

    filtersInputHandle() { /*RE RENDRE CLIQUABLE LES NOUVEAUX FILTRES DES LISTES DEROULANTES*/
        let filters_list_of = document.querySelectorAll(".filters-list-of");

        for (let i = 0; i < filters_list_of.length; i++) {

            filters_list_of[i].addEventListener("click", (e) => {
                let filterClicked = e.target.innerText;
                let directParent = e.target.closest(".filters-list");

                if (directParent.classList.contains("Ingredients")) {
                    if (!this.ingredientsActifsFilter.includes(filterClicked)) {
                        this.ingredientsActifsFilter.push(e.target.innerText)
                        this.filtersInputDisplay(filterClicked, "Ingredients");
                        this.refreshAllPagesAfterResearch();

                    }
                }
                else if (directParent.classList.contains("Appareils")) {
                    if (!this.appareilsActifsFilter.includes(filterClicked)) {
                        this.appareilsActifsFilter.push(e.target.innerText)
                        this.filtersInputDisplay(filterClicked, "Appareils");
                        this.refreshAllPagesAfterResearch();
                    }
                }
                else {
                    if (!this.ustensilesActifsFilter.includes(filterClicked)) {
                        this.ustensilesActifsFilter.push(e.target.innerText)
                        this.filtersInputDisplay(filterClicked, "Ustentiles");
                        this.refreshAllPagesAfterResearch();
                    }
                }
            })
        }
    }

    filtersInputDisplay(filterClicked, filterCategory) {
        let filters_list_active = document.querySelector("#filter-active-main");
        let new_filter = document.createElement("div");
        
        new_filter.classList.add("filter-active", "flex-row", "justify-content-between", "align-items-center", `${filterCategory}`)
        new_filter.innerHTML = `<p>${filterClicked}</p>
        <i class="fa-solid fa-times remove-filter cursor-pointer"></i>`
        filters_list_active.appendChild(new_filter);
        this.filtersInputRemove(new_filter);
    }

    filtersInputRemove(filterDisplayed) {
        let filterClose = filterDisplayed.children[1];
        filterClose.addEventListener("click", (e) => {
            let filterCloseParent = e.target.closest(".filter-active");
            let filterToRemove = filterCloseParent.children[0].innerText;
            if (filterCloseParent.classList.contains("Ingredients")) {
                Utils.removeFromArray(this.ingredientsActifsFilter, filterToRemove)
            }
            else if (filterCloseParent.classList.contains("Appareils")) {
                Utils.removeFromArray(this.appareilsActifsFilter, filterToRemove)
            }
            else {
                Utils.removeFromArray(this.ustensilesActifsFilter, filterToRemove)
            }
            filterCloseParent.remove();
            this.refreshAllPagesAfterResearch();
        })
    }

    doFilterRecipes() {
        
        let recipesListFiltered = this.doFilterIngredients(this.recipeList);
        recipesListFiltered = this.doFilterUstensiles(recipesListFiltered);
        recipesListFiltered = this.doFilterAppareils(recipesListFiltered);
        recipesListFiltered = this.doFilterSearchBar(recipesListFiltered);

        /* REFILTRER LA LISTE DES INGREDIENTS/APPAREILS/USTENSILES DEROULANTES EN FONCTION DEMA LISTE FILTRE ET NON TOTALE*/

        this.showRecipesfromAList(recipesListFiltered);
        return recipesListFiltered
    }

    doFilterIngredients(recipeList){
        let recipesListFiltered = [];
        for(let recipe of recipeList) {
            let isRecipeValid = true;
            for(let ingredientToFind of this.ingredientsActifsFilter) {
                let isIngredientValid = Utils.isIngredientInThisRecipe(ingredientToFind,recipe);
                if(!isIngredientValid) {
                    isRecipeValid = false;
                    break;
                }
            }
            if(isRecipeValid) {
                recipesListFiltered.push(recipe);
            }
        }
        return recipesListFiltered;
    }
    
    doFilterUstensiles(recipeList){
        let recipesListFiltered = [];
        for(let recipe of recipeList) {
            let isRecipeValid = true;
            for(let ustensileToFind of this.ustensilesActifsFilter) {
                let isUstensiletValid = Utils.isUstensileInThisRecipe(ustensileToFind,recipe);
                if(!isUstensiletValid) {
                    isRecipeValid = false;
                    break;
                }
            }
            if(isRecipeValid) {
                recipesListFiltered.push(recipe);
            }
        }
        return recipesListFiltered;
    }
    
    doFilterAppareils(recipeList){
        let newRecipesListFiltered = [];
        for(let recipe of recipeList) {
            let isRecipeValid = true;
            for(let appareilToFind of this.appareilsActifsFilter) {
                if(recipe.appliance.toLowerCase() !== appareilToFind.toLowerCase()){
                    isRecipeValid = false;
                    break;
                }
            }
            if(isRecipeValid) {
                newRecipesListFiltered.push(recipe);
            }
        }
        return newRecipesListFiltered;
    }

    doFilterSearchBar(recipeList){
        let searchTarget = this.search.value.toLowerCase();
        if (searchTarget.length >= 3) {
            recipeList = this.filterRecipesWithInputSearchBarFILTERJS(searchTarget, recipeList); // Accès au controleur d'ici car appelé dans le index.html 
        }
        return recipeList;
    }

    refreshAllPagesAfterResearch(){
        let recipesListFiltered = this.doFilterRecipes();
        this.refreshIndexFitlers(recipesListFiltered);
    }

    filterRecipesWithInputSearchBar(searchTarget,recipesList) { // Recherche à partir de 3 caractères, dans les titre/ingredients/descriptions des recettes
        let newRecipesList = [];
        for (let recipe of recipesList){
            // console.log(recipe)
            if(recipe.name.toLowerCase().indexOf(searchTarget) >= 0){
                newRecipesList.push(recipe);
            }
            else if(recipe.description.toLowerCase().indexOf(searchTarget) >= 0){
                newRecipesList.push(recipe);
            }
            else{
                for(let ingredientsList of recipe.ingredients){ç_
                    if(ingredientsList.ingredient.toLowerCase().indexOf(searchTarget) >= 0){
                        newRecipesList.push(recipe);
                    }
                }
            }
        }
        return newRecipesList;
    }

    filterRecipesWithInputSearchBarFILTERJS(searchTarget,recipesList) { 
        let newRecipesList = recipesList.filter((recipe) => {
            /* On fait une seule boucle filter, où on parcourt l'entiereté de mes recettes;
            si on a une correspondance entre la valeur de ma recherche et :
                - la description
                - le nom
                - l'un des ingrédients
                d'une des recettes, alors on return cette recette */
            if(
                recipe.description.toLowerCase().indexOf(searchTarget) >= 0 ||
                recipe.name.toLowerCase().indexOf(searchTarget) >= 0 ||
                recipe.ingredients.map((ingredientsList) => ingredientsList.ingredient.toLowerCase().indexOf(searchTarget) >= 0).some((test) => test == true)
                /* On parcourt chacun des ingredients (en lowercase) de la liste d'ingrédient des recettes ;
                si au moins l'un des ingredients d'une des recettes corresponds à ma recherche, alors on test validé */
            ){
                return recipe;
            }
        })
        return newRecipesList;
    }
}
