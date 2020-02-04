// Generated by CoffeeScript 2.5.1
(function() {
  var allActions, allPathActions, allRecipeActions, allServiceActions, allUserActions, cloud, getActionChoice, log, olog, recipe, user, userConfig, useractionmodule;

  useractionmodule = {
    name: "useractionmodule"
  };

  //region internalProperties
  user = null;

  cloud = null;

  recipe = null;

  userConfig = null;

  //endregion

  //region userActions
  allUserActions = {
    editDeveloperName: {
      userChoiceLabel: "edit developerName",
      execute: async function() {
        log("execution of editDeveloperNameAction");
        return (await userConfig.editDeveloperName());
      }
    },
    newService: {
      userChoiceLabel: "new cloudService",
      execute: async function() {
        log("execution of newServiceAction");
        return (await cloud.createConnection());
      }
    },
    editService: {
      userChoiceLabel: "edit cloudService",
      execute: async function() {
        log(" execution of editServiceAction");
        return (await cloud.editAnyService());
      }
    },
    selectMasterService: {
      userChoiceLabel: "select master cloudService",
      execute: async function() {
        log(" execution of selectMasterServiceAction");
        return (await cloud.selectMasterService());
      }
    },
    removeService: {
      userChoiceLabel: "remove cloudService",
      execute: async function() {
        log("execution of removeServiceAction");
        return (await cloud.removeAnyService());
      }
    },
    importRecipe: {
      userChoiceLabel: "import thingyRecipe",
      execute: async function() {
        log("execution of newRecipeAction");
        return (await recipe.import());
      }
    },
    removeRecipe: {
      userChoiceLabel: "remove thingyRecipe",
      execute: async function() {
        log("execution of removeRecipeAction");
        return (await recipe.removeAnyRecipe());
      }
    },
    editRecipesPath: {
      userChoiceLabel: "edit recipes path",
      execute: async function() {
        log("execution of editRecipesPathAction");
        return (await userConfig.editRecipesPath());
      }
    },
    editDefaultThingyRootPath: {
      userChoiceLabel: "edit defaultThingyRoot path",
      execute: async function() {
        log("execution of editDefaultThingyRootPathAction");
        return (await userConfig.editDefaultThingyRootPath());
      }
    },
    editTemporaryFilesPath: {
      userChoiceLabel: "edit temporaryFiles path",
      execute: async function() {
        log("execution of editDefaultThingyRootPathAction");
        return (await userConfig.editTemporaryFilesPath());
      }
    },
    skip: {
      userChoiceLabel: "skip",
      execute: function() {
        throw false;
      }
    }
  };

  allActions = Object.keys(allUserActions);

  // 7 = "Service".length 
  allServiceActions = allActions.filter(function(action) {
    return "Service" === action.substr(-7);
  });

  // 6 = "Recipe".length 
  allRecipeActions = allActions.filter(function(action) {
    return "Recipe" === action.substr(-6);
  });

  // 4 = "Path".length 
  allPathActions = allActions.filter(function(action) {
    return "Path" === action.substr(-4);
  });

  //endregion

  //region logPrintFunctions
  //#############################################################################
  log = function(arg) {
    if (allModules.debugmodule.modulesToDebug["useractionmodule"] != null) {
      console.log("[useractionmodule]: " + arg);
    }
  };

  olog = function(o) {
    return log("\n" + JSON.stringify(o, null, 4));
  };

  //endregion
  //#############################################################################
  useractionmodule.initialize = function() {
    log("useractionmodule.initialize");
    user = allModules.userinquirermodule;
    cloud = allModules.cloudservicemodule;
    recipe = allModules.recipemodule;
    userConfig = allModules.userconfigmodule;
  };

  //region internalFunctions
  getActionChoice = function(action) {
    var choice;
    log("getActionChoice");
    choice = {
      name: action.userChoiceLabel,
      value: action
    };
    return choice;
  };

  //endregion

  //region exposedFunctions
  useractionmodule.doAction = async function(action) {
    log("useractionmodule.doAction");
    // log action
    // olog allUserActions[action]
    // allUserActions[action].execute()
    return (await action.execute());
  };

  //region addChoices
  useractionmodule.addEditDeveloperNameChoice = function(choices) {
    log("useractionmodule.addEditDeveloperNameChoice");
    choices.push(getActionChoice(allUserActions.editDeveloperName));
    return choices;
  };

  useractionmodule.addImportRecipeChoice = function(choices) {
    log("useractionmodule.addNewRecipeChoice");
    choices.push(getActionChoice(allUserActions.importRecipe));
    return choices;
  };

  useractionmodule.addRecipeChoices = function(choices) {
    var action, i, len;
    log("useractionmodule.addRecipeChoices");
    for (i = 0, len = allRecipeActions.length; i < len; i++) {
      action = allRecipeActions[i];
      choices.push(getActionChoice(allUserActions[action]));
    }
    return choices;
  };

  useractionmodule.addNewServiceChoice = function(choices) {
    log("useractionmodule.addNewServiceChoice");
    choices.push(getActionChoice(allUserActions.newService));
    return choices;
  };

  useractionmodule.addServiceChoices = function(choices) {
    var action, i, len;
    log("useractionmodule.addServiceChoices");
    for (i = 0, len = allServiceActions.length; i < len; i++) {
      action = allServiceActions[i];
      choices.push(getActionChoice(allUserActions[action]));
    }
    return choices;
  };

  useractionmodule.addPathEditChoices = function(choices) {
    var action, i, len;
    log("useractionmodule.addServiceChoices");
    for (i = 0, len = allPathActions.length; i < len; i++) {
      action = allPathActions[i];
      choices.push(getActionChoice(allUserActions[action]));
    }
    return choices;
  };

  useractionmodule.addSkipChoice = function(choices) {
    log("useractionmodule.addSkipChoice");
    choices.push(getActionChoice(allUserActions.skip));
    return choices;
  };

  //endregion
  //endregion
  module.exports = useractionmodule;

}).call(this);