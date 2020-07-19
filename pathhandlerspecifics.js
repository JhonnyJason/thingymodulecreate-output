// Generated by CoffeeScript 2.5.1
(function() {

  /* FYI:
  This module is to be injected into the pathhandlermodule
  At best keep it most minimal to the specifics of this cli
  We may use everything off the pathhandlermodule using @
  as @ = this. and this will be the pathhandlermodule
  */
  var pathModule, pathhandlerspecifics, print;

  pathhandlerspecifics = {
    name: "pathhandlerspecifics"
  };

  //###########################################################
  print = function(arg) {
    return console.log(arg);
  };

  pathModule = require("path");

  //###########################################################
  pathhandlerspecifics.thingyModuleBase = ""; //direcotry

  pathhandlerspecifics.parentPath = ""; //directory

  
  //###########################################################
  pathhandlerspecifics.getParentThingyName = async function() {
    var base, git, url, urlHandler;
    git = allModules.gitmodule;
    urlHandler = allModules.urlhandlermodule;
    base = this.thingyModuleBase;
    this.parentPath = (await git.getGitRoot(base));
    this.parentPath = this.parentPath.replace(/\s/g, "");
    url = (await git.getOriginURL(base));
    url = url.replace(/\s/g, "");
    return urlHandler.getRepo(url);
  };

  pathhandlerspecifics.prepare = async function() {
    var basePath, cfg, exists;
    cfg = allModules.configmodule;
    basePath = this.resolveHomeDir(cfg.userConfig.defaultThingyRoot);
    if (!pathModule.isAbsolute(basePath)) {
      throw "unexpected path in userConfig: " + basePath;
    }
    this.basePath = basePath;
    exists = (await this.checkDirectoryExists(basePath));
    if (!exists) {
      throw new Error("Our basePath (" + basePath + ") does not exist!");
    }
    this.thingyModuleBase = process.cwd();
  };

  module.exports = pathhandlerspecifics;

}).call(this);