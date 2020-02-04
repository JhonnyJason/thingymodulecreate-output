// Generated by CoffeeScript 2.5.1
(function() {
  var CLI, Spinner, addArbitraryConstructions, c, camelcase, cloneAndLoadRecipe, cloneAndStoreRecipe, createUserChoices, destroyImpossibleChoice, evaluateUserChoiceForStaticBase, evaluateUserChoiceForThingyModule, exec, executeScript, fs, getArbitraryConstructionChoices, getCheckedRecipeChoice, getChoicesForStaticBase, getChoicesForThingyModule, getIntegrationBehaviour, getIntegrationOptions, getMountBehaviour, getMountOptions, getOptionMap, getRecipeChoice, getStaticBaseConstructionBehaviour, getStaticBaseOptions, getThingyModuleConstructionBehaviour, git, globalScope, importRecipeFromRepo, isStaticBase, loadRecipe, loadRecipeFromRepo, log, olog, ostr, pathHandler, print, printError, recipemodule, remoteHandler, repoNameToThingyType, temporaryRecipes, user, userConfig, wildcardContentStaticBase, wildcardContentThingyModule;

  recipemodule = {
    name: "recipemodule"
  };

  //region modulesFromEnvironment
  //region node_modules
  CLI = require('clui');

  Spinner = CLI.Spinner;

  c = require("chalk");

  fs = require("fs-extra");

  camelcase = require("camelcase");

  exec = require("child_process").exec;

  //endregion

  //region localModules
  git = null;

  user = null;

  pathHandler = null;

  globalScope = null;

  userConfig = null;

  remoteHandler = null;

  //endregion
  //endregion

  //region logPrintFunctions
  //#############################################################################
  log = function(arg) {
    if (allModules.debugmodule.modulesToDebug["recipemodule"] != null) {
      console.log("[recipemodule]: " + arg);
    }
  };

  olog = function(o) {
    return log("\n" + ostr(o));
  };

  ostr = function(o) {
    return JSON.stringify(o, null, 4);
  };

  printError = function(arg) {
    return console.log(c.red(arg));
  };

  print = function(arg) {
    return console.log(arg);
  };

  //endregion
  //#############################################################################
  recipemodule.initialize = function() {
    log("recipemodule.initialize");
    git = allModules.gitmodule;
    user = allModules.userinquirermodule;
    userConfig = allModules.userconfigmodule;
    globalScope = allModules.globalscopemodule;
    remoteHandler = allModules.remotehandlermodule;
    pathHandler = allModules.pathhandlermodule;
  };

  //region internalProperties
  temporaryRecipes = {};

  wildcardContentThingyModule = [
    ["submodule",
    "directory"],
    ["merge",
    "use",
    "create"],
    {
      merge: ["*"],
      use: ["*"],
      create: ["*"]
    }
  ];

  wildcardContentStaticBase = [
    ["merge"],
    {
      merge: ["*"]
    }
  ];

  //endregion

  //region internalFunctions
  getArbitraryConstructionChoices = function() {
    var choices;
    log("getArbitraryConstructionChoices");
    choices = [];
    choices.push({
      name: "merge staticBase",
      value: "mergeBase"
    });
    choices.push({
      name: "add thingyModule",
      value: "addModule"
    });
    choices.push({
      name: "skip",
      value: "skip"
    });
    return choices;
  };

  addArbitraryConstructions = async function(constructionPlan) {
    var label, userChoice, userChoices;
    log("addArbitraryConstructions");
    userChoices = getArbitraryConstructionChoices();
    while (true) {
      userChoice = (await user.inquireUserDecision(userChoices, "recipe * >"));
      switch (userChoice) {
        case "mergeBase":
          constructionPlan.push((await getStaticBaseConstructionBehaviour(wildcardContentStaticBase)));
          break;
        case "addModule":
          label = (await user.inquireString("label for thingyModule: ", ""));
          constructionPlan.push((await getThingyModuleConstructionBehaviour(label, wildcardContentThingyModule)));
          break;
        case "skip":
          return;
        default:
          throw "unexpected userChoice: " + userChoice;
      }
    }
  };

  getRecipeChoice = function(thingyType) {
    var choice;
    return choice = {
      name: thingyType + " recipe",
      value: thingyType
    };
  };

  getCheckedRecipeChoice = function(element, index) {
    var choice;
    return choice = {
      name: element,
      checked: true
    };
  };

  cloneAndStoreRecipe = async function(remote, basePath, type) {
    var destDir, err, individualizeDest, individualizePath, localPath, recipeDest, recipePath, storePath;
    log("cloneAndStoreRecipe");
    await git.clone(remote, basePath);
    localPath = pathHandler.resolve(basePath, remote.getRepo());
    recipePath = pathHandler.resolve(localPath, "recipe.json");
    individualizePath = pathHandler.resolve(localPath, "individualize.js");
    storePath = pathHandler.recipesPath;
    destDir = pathHandler.resolve(storePath, type);
    pathHandler.ensureDirectoryExists(destDir);
    recipeDest = pathHandler.resolve(destDir, "recipe.json");
    individualizeDest = pathHandler.resolve(destDir, "individualize.js");
    try {
      await fs.move(recipePath, recipeDest, {
        overwrite: true
      });
      await fs.move(individualizePath, individualizeDest, {
        overwrite: true
      });
    } catch (error1) {
      err = error1;
      log(err);
    }
    await fs.remove(localPath);
  };

  loadRecipe = async function(type) {
    var err, recipe, recipePath, recipeString, storeDir;
    log("loadRecipe");
    storeDir = pathHandler.resolve(pathHandler.recipesPath, type);
    recipePath = pathHandler.resolve(storeDir, "recipe.json");
    try {
      recipeString = (await fs.readFile(recipePath, 'utf8'));
      recipe = JSON.parse(recipeString);
      return recipe;
    } catch (error1) {
      err = error1;
      log(err);
    }
    return {};
  };

  cloneAndLoadRecipe = async function(remote, basePath) {
    var recipe, thingyType;
    log("cloneAndLoadRecipe");
    thingyType = repoNameToThingyType(remote.getRepo());
    await cloneAndStoreRecipe(remote, basePath, thingyType);
    recipe = (await loadRecipe(thingyType));
    return recipe;
  };

  loadRecipeFromRepo = async function(repo) {
    var basePath, err, remote, status, statusMessage;
    log("loadRecipeFromRepo");
    remote = remoteHandler.getRemoteObject(repo);
    basePath = pathHandler.temporaryFilesPath;
    statusMessage = "Loading recipe " + repo + "...";
    status = new Spinner(statusMessage);
    status.start();
    try {
      return (await cloneAndLoadRecipe(remote, basePath));
    } catch (error1) {
      err = error1;
      log(err);
    } finally {
      status.stop();
    }
  };

  importRecipeFromRepo = async function(repo) {
    var basePath, err, remote, thingyType;
    log("importRecipeFromRepo");
    thingyType = repoNameToThingyType(repo);
    remote = remoteHandler.getRemoteObject(repo);
    olog(remote);
    basePath = pathHandler.temporaryFilesPath;
    try {
      await cloneAndStoreRecipe(remote, basePath, thingyType);
      userConfig.addThingyRecipe(thingyType);
    } catch (error1) {
      err = error1;
      log(err);
    }
  };

  repoNameToThingyType = function(repo) {
    var recipeString;
    log("repoNameToThingyType");
    repo = camelcase(repo);
    // 6 = "Recipe".length
    recipeString = repo.substr(-6);
    if (recipeString !== "Recipe") {
      throw "Invalid RepoName for Recipe!";
    }
    return repo.substring(0, repo.length - 6);
  };

  executeScript = function(script, cwd) {
    log("executeScript");
    return new Promise(function(resolve, reject) {
      var callback;
      callback = function(error, stdout, stderr) {
        if (error) {
          reject(error);
        }
        if (stderr) {
          reject(new Error(stderr));
        }
        return resolve(stdout);
      };
      return exec("node " + script, {cwd}, callback);
    });
  };

  
  //region constructionPlanGenerationHelper
  isStaticBase = function(content) {
    var arrayOptionsCount, i, len, options;
    if (!Array.isArray(content)) {
      return false;
    }
    arrayOptionsCount = 0;
    for (i = 0, len = content.length; i < len; i++) {
      options = content[i];
      if (Array.isArray(options)) {
        ++arrayOptionsCount;
      }
    }
    if (arrayOptionsCount === 1) {
      return true;
    }
    return false;
  };

  getStaticBaseConstructionBehaviour = async function(content) {
    var behaviour, choices, optionMap, options, userChoice, userChoices;
    behaviour = [];
    optionMap = getOptionMap(content);
    options = getStaticBaseOptions(content);
    choices = getChoicesForStaticBase(options, optionMap);
    if (choices.length === 1) {
      behaviour = (await evaluateUserChoiceForStaticBase(choices[0]));
    } else {
      userChoices = createUserChoices(choices);
      userChoice = (await user.inquireUserDecision(userChoices, "integrate staticBase:"));
      behaviour = (await evaluateUserChoiceForStaticBase(userChoice));
    }
    return behaviour;
  };

  getThingyModuleConstructionBehaviour = async function(label, content) {
    var behaviour, optionMap, options, result;
    behaviour = [];
    optionMap = getOptionMap(content);
    options = getMountOptions(content);
    result = (await getMountBehaviour(options, label));
    behaviour = behaviour.concat(result);
    options = getIntegrationOptions(content);
    result = (await getIntegrationBehaviour(options, optionMap, label));
    behaviour = behaviour.concat(result);
    // log "construcion Behaviour:"
    // olog behaviour
    return behaviour;
  };

  getOptionMap = function(recipePropertyContent) {
    var i, len, optionMap, options;
    optionMap = {};
    for (i = 0, len = recipePropertyContent.length; i < len; i++) {
      options = recipePropertyContent[i];
      if (!(!Array.isArray(options))) {
        continue;
      }
      if (typeof options !== "object") {
        continue;
      }
      Object.assign(optionMap, options);
    }
    return optionMap;
  };

  //region constructionPlanGenerationHelperForStaticBase
  getStaticBaseOptions = function(staticBaseContent) {
    var i, len, options;
    for (i = 0, len = staticBaseContent.length; i < len; i++) {
      options = staticBaseContent[i];
      if (Array.isArray(options)) {
        return options;
      }
    }
  };

  getChoicesForStaticBase = function(options, optionMap) {
    var choices, i, j, len, len1, mergeOption, option, ref;
    // log "getChoicesForStaticBase"
    choices = [];
    for (i = 0, len = options.length; i < len; i++) {
      option = options[i];
      if (option === "createEmpty") {
        choices.push(["createEmpty"]);
      }
      if (option === "merge") {
        ref = optionMap.merge;
        for (j = 0, len1 = ref.length; j < len1; j++) {
          mergeOption = ref[j];
          choices.push(["merge", mergeOption]);
        }
      }
    }
    // olog choices
    return choices;
  };

  evaluateUserChoiceForStaticBase = async function(choice) {
    var message;
    // log "evaluateUserChoiceForStaticBase"
    if (choice[0] === "createEmpty") {
      return [];
    }
    choice = (await destroyImpossibleChoice(choice));
    if (choice[0] === "merge" && choice[1] === "*") {
      message = "staticBase: merge with:";
      choice[1] = (await user.inquireExistingRemote(message, ""));
    }
    return choice;
  };

  //endregion
  createUserChoices = function(choices) {
    var choice, i, len, userChoice, userChoices;
    // log "createUserChoices"
    // olog choices
    userChoices = [];
    for (i = 0, len = choices.length; i < len; i++) {
      choice = choices[i];
      userChoice = {};
      userChoice.value = choice;
      if (Array.isArray(choice)) {
        userChoice.name = choice.join(" ");
      } else if (typeof choice === "string") {
        userChoice.name = choice;
      } else {
        throw new Error("choice to create UserChoice from is of unexpected type.");
      }
      userChoices.push(userChoice);
    }
    // log "generated userChoices"
    // olog userChoices
    return userChoices;
  };

  //region constructionPlanGenerationHelperForThingyModules
  getMountOptions = function(content) {
    return content[0];
  };

  getMountBehaviour = async function(options, label) {
    var choice, message, userChoices;
    if (options.length === 1) {
      return [options[0], label];
    }
    userChoices = createUserChoices(options);
    message = "add thingyModule " + label + " as: ";
    choice = (await user.inquireUserDecision(userChoices, message));
    return [choice, label];
  };

  getIntegrationOptions = function(content) {
    return content[1];
  };

  getIntegrationBehaviour = async function(options, optionMap, label) {
    var behaviour, choices, message, userChoice, userChoices;
    behaviour = [];
    choices = getChoicesForThingyModule(options, optionMap);
    if (choices.length === 1) {
      behaviour = (await evaluateUserChoiceForThingyModule(choices[0], label));
    } else {
      userChoices = createUserChoices(choices);
      message = "construct thingyModule " + label + ": ";
      userChoice = (await user.inquireUserDecision(userChoices, message));
      behaviour = (await evaluateUserChoiceForThingyModule(userChoice, label));
    }
    return behaviour;
  };

  getChoicesForThingyModule = function(options, optionMap) {
    var choices, i, j, k, l, len, len1, len2, len3, mergeOption, option, ref, ref1, ref2;
    // log "getChoicesForThingyModule"
    choices = [];
// olog options
    for (i = 0, len = options.length; i < len; i++) {
      option = options[i];
      if (option === "create") {
        ref = optionMap.create;
        for (j = 0, len1 = ref.length; j < len1; j++) {
          mergeOption = ref[j];
          choices.push(["create", mergeOption]);
        }
      }
      if (option === "merge") {
        ref1 = optionMap.merge;
        for (k = 0, len2 = ref1.length; k < len2; k++) {
          mergeOption = ref1[k];
          choices.push(["merge", mergeOption]);
        }
      }
      if (option === "use") {
        ref2 = optionMap.use;
        for (l = 0, len3 = ref2.length; l < len3; l++) {
          mergeOption = ref2[l];
          choices.push(["use", mergeOption]);
        }
      }
    }
    // olog choices
    return choices;
  };

  destroyImpossibleChoice = async function(choice) {
    var err, result;
    log("destroyImpossibleChoice");
    if (choice[1] === "*") {
      return choice;
    }
    if (choice[0] === "create") {
      result = (await recipemodule.checkIfRecipeExistsForModule(choice[1]));
      if (result !== true) {
        printError("choice " + choice[1] + " is impossible!");
        choice[1] = "*";
      }
    }
    if (choice[0] === "merge" || choice[0] === "use") {
      try {
        result = (await remoteHandler.checkIfRemoteIsAvailable(choice[1]));
        if (result !== true) {
          throw "hi!";
        }
      } catch (error1) {
        err = error1;
        printError("choice " + choice[1] + " is impossible!");
        choice[1] = "*";
      }
    }
    return choice;
  };

  evaluateUserChoiceForThingyModule = async function(choice, label) {
    var message;
    // log "evaluateUserChoiceForThingyModule"
    choice = (await destroyImpossibleChoice(choice));
    if (choice[0] === "create" && choice[1] === "*") {
      message = label + ": create thingyModule of type:";
      choice[1] = (await user.inquireThingyModuleType(message, ""));
    }
    if (choice[0] === "merge" && choice[1] === "*") {
      message = label + ": merge with";
      choice[1] = (await user.inquireExistingRemote(message, ""));
    }
    if (choice[0] === "use" && choice[1] === "*") {
      message = label + ": use:";
      choice[1] = (await user.inquireExistingRemote(message, ""));
    }
    return choice;
  };

  //endregion
  //endregion
  //endregion

  //region exposedFunctions
  recipemodule.executeIndividualize = async function(type, path) {
    var err, result, scriptPath, storeDir;
    log("recipemodule.executeIndividualize");
    storeDir = pathHandler.resolve(pathHandler.recipesPath, type);
    scriptPath = pathHandler.resolve(storeDir, "individualize.js");
    try {
      result = (await executeScript(scriptPath, path));
      print(result);
    } catch (error1) {
      err = error1;
      log(err);
    }
  };

  recipemodule.import = async function() {
    var all, choices, err, promises, recipes, repo, selection, status, statusMessage;
    log("recipemodule.import");
    all = globalScope.getAllThingiesInScope();
    recipes = all.filter(function(el) {
      return "recipe" === el.substr(-6);
    });
    choices = recipes.map(getCheckedRecipeChoice);
    selection = (await user.inquireSelectionSet(choices));
    promises = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = selection.length; i < len; i++) {
        repo = selection[i];
        results.push(importRecipeFromRepo(repo));
      }
      return results;
    })();
    //region awaitImport §
    statusMessage = "Importing recipes [" + selection + "]...";
    status = new Spinner(statusMessage);
    status.start();
    try {
      await Promise.all(promises);
    } catch (error1) {
      err = error1;
      log(err);
    } finally {
      status.stop();
    }
  };

  //endregion
  recipemodule.removeAnyRecipe = async function() {
    var recipeChoice;
    log("recipemodule.removeAnyRecipe");
    recipeChoice = (await user.inquireThingyRecipeSelect());
    if (recipeChoice === -1) {
      return;
    }
    log(recipeChoice);
    await userConfig.removeThingyRecipe(recipeChoice);
  };

  recipemodule.getModuleRecipe = async function(type) {
    var recipe, repoName;
    log("recipemodule.getModuleRecipe");
    repoName = type + "-recipe";
    recipe = (await loadRecipeFromRepo(repoName));
    return recipe;
  };

  recipemodule.getRecipe = async function(thingyType) {
    var err, latestChosenType, message, recipe, thingyRecipes, userChoice, userChoices;
    log("recipemodule.getRecipe");
    thingyRecipes = userConfig.getThingyRecipes();
    latestChosenType = thingyType;
    if (!thingyType || (thingyRecipes[thingyType] == null)) {
      if (thingyType) {
        try {
          return (await recipemodule.getModuleRecipe(thingyType));
        } catch (error1) {
          err = error1;
          log(err);
        }
      }
      message = "select thingyType: ";
      userChoices = Object.keys(thingyRecipes);
      userChoice = (await user.inquireUserDecision(userChoices, message));
      latestChosenType = userChoice;
      recipe = (await loadRecipe(userChoice));
      return recipe;
    } else {
      recipe = (await loadRecipe(thingyType));
      return recipe;
    }
  };

  recipemodule.toConstructionPlan = async function(recipe) {
    var constructionPlan, content, label;
    log("recipemodule.toConstructionPlan");
    constructionPlan = [];
    for (label in recipe) {
      content = recipe[label];
      if (label === "*" && content) {
        await addArbitraryConstructions(constructionPlan);
      }
      if (!Array.isArray(content)) {
        continue;
      }
      if (isStaticBase(content)) {
        constructionPlan.push((await getStaticBaseConstructionBehaviour(content)));
      } else {
        constructionPlan.push((await getThingyModuleConstructionBehaviour(label, content)));
      }
    }
    return constructionPlan;
  };

  recipemodule.getAllRecipeChoices = function() {
    var content, label, thingyRecipes, userChoices;
    log("recipemodule.getAllRecipeChoices");
    userChoices = [];
    thingyRecipes = userConfig.getThingyRecipes();
    for (label in thingyRecipes) {
      content = thingyRecipes[label];
      userChoices.push(getRecipeChoice(label));
    }
    return userChoices;
  };

  //# recipes for thingymodules
  recipemodule.checkIfRecipeExistsForModule = function(moduleName) {
    var recipeRepo;
    log("recipemodule.checkIfRecipeExistsForModule");
    recipeRepo = moduleName + "-recipe";
    if (globalScope.repoIsInScope(recipeRepo)) {
      return true;
    } else {
      return "We donot have a recipe for that thingyModule...";
    }
  };

  //endregion
  module.exports = recipemodule;

}).call(this);