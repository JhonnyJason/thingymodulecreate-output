// Generated by CoffeeScript 2.5.1
(function() {
  var analyseURL, getHTTPSHostFromURL, getRepoFromURL, getSSHHostFromURL, log, urlhandlermodule;

  urlhandlermodule = {
    name: "urlhandlermodule"
  };

  //region logPrintFunctions
  //#############################################################################
  log = function(arg) {
    if (allModules.debugmodule.modulesToDebug["urlhandlermodule"] != null) {
      console.log("[urlhandlermodule]: " + arg);
    }
  };

  //endregion
  //#############################################################################
  urlhandlermodule.initialize = function() {
    log("urlhandlermodule.initialize");
  };

  
  //region internalFunctions
  analyseURL = function(url) {
    var result;
    log("analyseURLForUnknownService");
    result = {};
    //# Standard result contains
    //# https only if we have https
    //# hostURL
    //# ressourceScope 
    //# repoName 
    result.repoName = getRepoFromURL(url);
    if (url.lastIndexOf(".git") === (url.length - 4)) {
      url = url.slice(0, -4);
    }
    url = url.slice(0, -result.repoName.length);
    if ("https://" === url.substr(0, 8)) {
      result.https = true;
      result.hostURL = getHTTPSHostFromURL(url);
    } else {
      result.hostURL = getSSHHostFromURL(url);
    }
    url = url.slice(result.hostURL.length);
    if (url.charAt(0) === "/") {
      url = url.slice(1);
    }
    if (url.charAt(url.length - 1) === "/") {
      url = url.slice(0, url.length - 1);
    }
    result.ressourceScope = url;
    return result;
  };

  getSSHHostFromURL = function(url) {
    var end;
    log("getHostFromURL");
    end = url.lastIndexOf(":") + 1;
    return url.slice(0, end);
  };

  getHTTPSHostFromURL = function(url) {
    var end;
    log("getHTTPSHostFromURL");
    end = url.indexOf("/", 8);
    if (end === -1) {
      return url;
    } else {
      return url.slice(0, end);
    }
  };

  getRepoFromURL = function(url) {
    var endPoint, lastSlash;
    log("getRepoFromURL");
    if (url.lastIndexOf(".git") !== (url.length - 4)) {
      url += ".git";
    }
    endPoint = url.lastIndexOf(".");
    if (endPoint < 0) {
      throw new Error("Unexpectd URL: " + url);
    }
    lastSlash = url.lastIndexOf("/");
    if (lastSlash < 0) {
      throw new Error("Unexpectd URL: " + url);
    }
    return url.substring(lastSlash + 1, endPoint);
  };

  //endregion

  //region exposedFunctions
  urlhandlermodule.isURL = function(url) {
    log("urlhandlermodule.isURL");
    if (!url || typeof url !== "string") {
      return false;
    }
    if (url.length < 4) {
      return false;
    }
    if (url.substr(0, 4) === "git@") {
      return true;
    }
    if (url.length < 8) {
      return false;
    }
    if (url.substr(0, 8) === "https://") {
      return true;
    }
    return false;
  };

  urlhandlermodule.analyze = function(url) {
    log("urlhandlermodule.analyze");
    return analyseURL(url);
  };

  urlhandlermodule.getServerName = function(url) {
    var hostURL, start;
    log("urlhandlermodule.getServerName");
    // 8 = "https://".length
    if ("https://" === url.substr(0, 8)) {
      hostURL = getHTTPSHostFromURL(url);
      log("hostURL: " + hostURL);
      return hostURL.slice(8);
    } else {
      hostURL = getSSHHostFromURL(url);
      log("hostURL: " + hostURL);
      start = hostURL.lastIndexOf("@");
      if (start > 0) {
        return hostURL.slice(start);
      } else {
        return hostURL;
      }
    }
  };

  urlhandlermodule.getHostURL = function(url) {
    log("urlhandlermodule.getServerName");
    if ("https://" === url.substr(0, 8)) {
      return getHTTPSHostFromURL(url);
    } else {
      return getSSHHostFromURL(url);
    }
  };

  urlhandlermodule.getRessourceScope = function(url) {
    var result;
    log("urlhandlermodule.getRessourceScope");
    result = analyseURL(url);
    return result.ressourceScope;
  };

  urlhandlermodule.getRepo = function(url) {
    log("urlhandlermodule.getRepo");
    return getRepoFromURL(url);
  };

  //endregion
  module.exports = urlhandlermodule;

}).call(this);
