
var g_preview = false; 
var file_id = null;

setup();

$(function(){


  if (!g_preview)
  {
    setTimeout(function(){ 
      convert();

      $(".file-click").click(function() {
        file_id = $(this).attr("id");
        $("#file-upload").click();

      });

    },2); 
  } 

  /*
  if (!g_converter) return;

   $('*').click(function(){ 
    $('.selectable').removeClass('selectable');
    if ($(this).children('div').length == 0)
    { 
      $(this).addClass("selectable"); 
    } 
    return false;
  });
  */

  $('#file-upload').change(function (e) { 
      var filepath = document.getElementById('file-upload');
      var filename = filepath.value.substr(filepath.value.lastIndexOf("\\")+1);
      if (!file_id) return; 
      $("#" + file_id).attr('src', 'img/' + filename);
      saveData(file_id, filename);
  });

  $('#file-upload').click(function(e){  
  }); 
});

function setup()
{
  var sURL = window.document.URL.toString();
  if (sURL.indexOf("?preview") > 0)
  {
    g_preview = true;
    convert();
  } 

  $.fn.editable.defaults.mode = 'inline';
}

function convert()
{  
  $("*").filter(function()
  { 
    var text = $(this).clone().children().remove().end().text();
    text = text.replace(/^\s+|\s+$/g,'');
    if (text.length > 0)
    {
      var parentId = $(this).attr('id');
      if (parentId)
      {
          $(this).contents().filter(function() {
            return this.nodeType == 3; 
          }).remove();

          var height = $(this).height(); 
          var tag = parentId + '-editable';
          addEditable(parentId, tag);

          if (height > 240)
          {
            setupHtmlEditable(tag,text);
          }
          else if (height > 100)
          {
            setupTextAreaEditable(tag,text);
          }
          else
          {
            setupTextEditable(tag, text); 
          }

          if (!g_preview && $(this).is('button')) $(this).attr("disabled", true); 
      }
    }

    if ($(this).is('img'))
    {
      var imgId = $(this).attr('id'); 
      if (imgId)
      {   
        if (!g_preview)
        { 
          var parentId = imgId + '-img'; 
          $(this).addClass('file-click');
          $(this).wrap("<div id='" + parentId + "' class='img-container'></div>");
          $("<img class='img-upload' src='img/upload.png'></img>").insertBefore($(this));
        }

        var filename = getData(imgId); 
        if (filename)
        {
          $(this).attr('src', 'img/' + filename);
        }
      }
    } 
    else if ($(this).css('backgroundImage') !== 'none')
    {

    }
    
  });
  /*
  addEditable('title', 'titleText');
  addEditable('content', 'contentText');  
  setupTextAreaEditable('titleText');
  setupHtmlEditable('contentText');


  var menuItems = getData('menuItems');
  for (var i in menuItems)
  {
    var key1 = menuItems[i] + 'Text';
    var key2 = menuItems[i] + 'Price';
    var divname = 'menuText'  + i;

    addChild('footer', 'div', {'id':divname});
    addEditable(divname, key1);

    divname = 'menuPrice' + i;
    addChild('footer', 'div', {'id':divname});
    
    addEditable(divname, key2); 
    setupTextEditable(key1);
    setupTextEditable(key2);
  }
  */
}


/**
 * DATA
 */

function saveData(key, value)
{ 
    if (sessvars.data == undefined) sessvars.data = getInitData(); 
    sessvars.data[key] = value; 
    saveLocalStorage(sessvars.data);
}           

function getData(key)
{   
    if (sessvars.data == undefined) sessvars.data = getInitData();  
    var data = sessvars.data[key];    
    //if (data == null) data = getDefaultData(key);
    return data;
}

function getDefaultData(key)
{
  var initData = getInitData();
  var data = initData[key];
  if (data == null) data = "";
  return data;
}

function getInitData()
{
  var data = getLocalStorage(); 

  if (data == null) return {};
 
  return JSON.parse(data);
  /*
  try { 
    if (data != null) return JSON.parse(data);
  }catch(err){}


  return {
    "titleText" : "Joey's Restaurant",
    "contentText" : "The best sushi around. Thank u come again", 
    "menuItem1Text" :"Salmon Roll", 
    "menuItem1Price" : "$6.99",
    "menuItem2Text" :"Cali Roll", 
    "menuItem2Price" : "$5.99",
    "menuItems" : ["menuItem1", "menuItem2"]
  } 
  */
} 

/**
 * APPLICATION  
 */

function setupTextAreaEditable(name, defaultData)
{
  setupEditable(name, defaultData, 'textarea');
}

function setupTextEditable(name, defaultData)
{   
  setupEditable(name, defaultData, 'text');
}

function setupHtmlEditable(name, defaultData)
{
  setupEditable(name, defaultData, 'wysihtml5');
}

function setupEditable(name, defaultData, type)
{
  var text = getData(name);
  if (text == null) text = defaultData;  
  $('#' + name).editable({
      disabled: g_preview,
      type: type,
      unsavedclass:null,
      error: printError,
      value: text,
      success: function(response, newValue) {
        saveData(name, newValue);
      }, 
  });
}

var printError = function(response, newValue) 
{ 
  console.log(response);  
}  

function addAttributes(name, attrs)
{
    var e = document.getElementById(name);
    for(var attr in attrs)
    {
      e.setAttribute(attr,attrs[attr]);
    } 
}

function addEditable(parent, name, options)
{
  var attrs = {href:'#', id:name};
  if (options) attrs = $.extend({}, attrs, options);
  addChild(parent, 'a', attrs);
}

function addChild(parent,tn,attrs)
{
  var p = document.getElementById(parent); 
    var e = document.createElement(tn);
    if(attrs)
    {
      for(var attr in attrs)
        {
          e.setAttribute(attr,attrs[attr]);
      }
    }
    p.appendChild(e);
    return e;
}


/**
 * HIDDEN  
 */

function getLocalStorage()
{
   var name = "dine-data";
   //localStorage.removeItem(name);
   return localStorage[name];
}

function saveLocalStorage(value)
{
  var name = "dine-data";
  localStorage[name] = JSON.stringify(value);
}

/*
function includer()
{  
    function includeSrc(path, div)
    {
      var include   = document.createElement("script");
      include.type  = "text/javascript";
      include.src   = path;
      div.appendChild(include);
    }

    function includeCss(path, div)
    {
      var cssLink = document.createElement("link") 
      cssLink.href = path; 
      cssLink.rel = "stylesheet"; 
      cssLink.type = "text/css"; 
      div.appendChild(cssLink);
    } 

    var head = document.getElementsByTagName('head')[0];

    includeCss("includes/bootstrap/css/bootstrap.css", head); 
    includeCss("includes/bootstrap-editable/css/bootstrap-editable.css", head);
    includeCss("includes/inputs-ext/wysihtml5/bootstrap-wysihtml5-0.0.2/bootstrap-wysihtml5-0.0.2.css", head);
    includeSrc("includes/bootstrap/js/bootstrap.js", head);
    includeSrc("includes/bootstrap-editable/js/bootstrap-editable.js", head);
    includeSrc("includes/inputs-ext/wysihtml5/bootstrap-wysihtml5-0.0.2/wysihtml5-0.3.0.min.js", head);
    includeSrc("includes/inputs-ext/wysihtml5/bootstrap-wysihtml5-0.0.2/bootstrap-wysihtml5-0.0.2.min.js", head);
    includeSrc("includes/inputs-ext/wysihtml5/wysihtml5.js", head);
    includeSrc("includes/sessvars.js", head); 
}
*/