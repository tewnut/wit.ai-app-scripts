/* WIT SDK
Last updated 14 Sep 2016
Author phong.nguyen@mhealthvn.com
*/


// Declare global properties
var WITVERSION = "?v=20160814";
var WITDEFAULTKEY = "YPEWRPKSQTIWPDM2DGU2XRA3WN27FTIV"; // default cashflow models

function setKey() {
  try {
    var KEY = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("conf").getRange("B1").getValue().toString();
    PropertiesService.getScriptProperties().setProperty('KEY', KEY);
  }
  catch(e) {
    PropertiesService.getScriptProperties().setProperty('KEY', WITDEFAULTKEY);
  }
}

function getKey() {
  var key = PropertiesService.getScriptProperties().getProperty('KEY');
  if ( key != null) {
    return PropertiesService.getScriptProperties().getProperty('KEY');
  }
  else {
    setKey();
  }
}


function witGetMeaning(q) {
  Utilities.sleep(1000);
  var url = encodeURI("https://api.wit.ai/message&q=" + q +WITVERSION);
  var headers = {
    "Content-Type" : "text/plain; charset=utf-8",
    "Authorization" : "Bearer "+ getKey(),
  };
  var options = {
    "method" : "get",
    "headers" : headers,
    "muteHttpExceptions" : true,
    "followRedirects" : false,
    "contentType" : "application/json"
  };
  var response = null;
  response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
}

function getEntities() {
  var url = encodeURI("https://api.wit.ai/entities"+WITVERSION);
  var headers = {
    "Content-Type" : "text/plain; charset=utf-8",
    "Authorization" : "Bearer "+ getKey(),
  };
  var options = {
    "method" : "get",
    "headers" : headers,
    "muteHttpExceptions" : true,
    "followRedirects" : false,
    "contentType" : "application/json"
  };
  var response = null;
  response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
}

function witGetEntityValues(entity) {
  var url = encodeURI("https://api.wit.ai/entities/"+entity+WITVERSION);
  var headers = {
    "Content-Type" : "text/plain; charset=utf-8",
    "Authorization" : "Bearer "+ getKey(),
  };
  
  var options = {
    "method" : "get",
    "headers" : headers,
    "muteHttpExceptions" : true,
    "followRedirects" : false,
    "contentType" : "application/json"
  };
  var response = null;
  response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
}

function getEntityExpressions(entity) {
  var array = witGetEntityValues(entity).values;
  var a = [];
  var m = 0;
  for (i=0;i<array.length; i++) {
    if (array[i].expressions != null) {
      for (j=0;j<array[i].expressions.length;j++){
        a[m] = [array[i].value,array[i].expressions[j]];
        m += 1; 
      }
    }
    else {
      a[m] = [array[i].value,''];
      m += 1; 
    }
  }
  return a;
}

function getEntityValues(entity) {
  var array = witGetEntityValues(entity).values;
  var a = [];
  for (i=0;i<array.length; i++) {
    a[i] = array[i].value;
  }
  return a;
}

function addNewExpression(Entity, Value, Expression) {
  Utilities.sleep(1000);
  var url = encodeURI("https://api.wit.ai/entities/"+Entity+"/values/" + Value +"/expressions"+WITVERSION);
  var headers = {
    "Content-Type" : "text/plain; charset=utf-8",
    "Authorization" : "Bearer "+ getKey(),
  };
  var payload = {"expression":Expression}
  var options = {
    "method" : "post",
    "headers" : headers,
    "payload" : JSON.stringify(payload),
    "muteHttpExceptions" : true,
    "followRedirects" : false,
    "contentType" : "application/json"
  };
  var response = null;
  response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
}


function addNewValuesToEntity(Entity, Value) {
  Utilities.sleep(1000);
  var url = encodeURI("https://api.wit.ai/entities/"+Entity+"/values"+WITVERSION);
  var headers = {
    "Content-Type" : "text/plain; charset=utf-8",
    "Authorization" : "Bearer "+ getKey(),
  };
  var payload = {"value":Value}
  var options = {
    "method" : "post",
    "headers" : headers,
    "payload" : JSON.stringify(payload),
    "muteHttpExceptions" : true,
    "followRedirects" : false,
    "contentType" : "application/json"
  };
  var response = null;
  response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
}

function deleteEntityValues(Entity, Value) {
  //this method still has bugs, it show {deleted=bank transfer} but in fact it was not deleted
  var url = encodeURI("https://api.wit.ai/entities/"+Entity+"/values/"+ Value + WITVERSION );
  var headers = {
    "Authorization" : "Bearer "+ PropertiesService.getScriptProperties().getProperty('KEY'),
  };
  var options = {
    "method" : "delete",
    "headers" : headers,
  };
  var response = null;
  response = UrlFetchApp.fetch(url, options);
  var data = JSON.parse(response.getContentText());
  log(data);
}

function deleteExpression(Entity, Value, Expression) {
  var url = encodeURI("https://api.wit.ai/entities/"+Entity+"/values/" + Value +"/expressions/" + Expression + WITVERSION);
  var headers = {
    "Content-Type" : "text/plain; charset=utf-8",
    "Authorization" : "Bearer "+ getKey(),
  };
  var options = {
    "method" : "delete",
    "headers" : headers
  };
  var response = null;
  response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
}
