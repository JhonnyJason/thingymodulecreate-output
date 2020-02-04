// Generated by CoffeeScript 2.5.1
(function() {
  var c, cliArguments, createProcess, log, olog, ostr, print, printError, printSuccess, startupmodule;

  startupmodule = {
    name: "startupmodule"
  };

  //region modulesFromEnvironment
  //region node_modules
  c = require('chalk');

  //endregion

  //region localModules
  createProcess = null;

  cliArguments = null;

  //endregion
  //endregion

  //region logPrintFunctions
  //#############################################################################
  log = function(arg) {
    if (allModules.debugmodule.modulesToDebug["startupmodule"] != null) {
      console.log("[startupmodule]: " + arg);
    }
  };

  olog = function(o) {
    return log("\n" + ostr(o));
  };

  ostr = function(o) {
    return JSON.stringify(o, null, 4);
  };

  printSuccess = function(arg) {
    return console.log(c.green(arg));
  };

  printError = function(arg) {
    return console.log(c.red(arg));
  };

  print = function(arg) {
    return console.log(arg);
  };

  //endregion
  //#############################################################################
  startupmodule.initialize = function() {
    log("startupmodule.initialize");
    createProcess = allModules.createprocessmodule;
    cliArguments = allModules.cliargumentsmodule;
  };

  //region exposedFunctions
  startupmodule.cliStartup = async function() {
    var e, err;
    log("startupmodule.cliStartup");
    try {
      e = cliArguments.extractArguments();
      await createProcess.execute(e);
      return printSuccess('All done!');
    } catch (error) {
      err = error;
      printError("Error!");
      printError(err);
      if (err.stack) {
        printError(err.stack);
      }
      return process.exit(-1);
    }
  };

  //endregion exposed functions
  module.exports = startupmodule;

}).call(this);