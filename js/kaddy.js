/* Krowd.io API Explorer (http://www.krowd.io/)
 * ======================================================= */
$(function () {
  var html = '<section>\
    <a class="sectionanchor"></a>\
          <h3></h3>\
          <p class="lead"></p>\
          <div class="buttons"><a href="#" class="btn btn-mini closeall btn-info" style="display:none"><strong>Collapse All</strong></a><a href="#" class="btn btn-info btn-mini showall" ><strong>Show All</strong></a></div>\
          <div class="methods">\
            <div class="method">\
                 <div class="accordion-group">\
                   <div class="accordion-heading">\
                     <a class="accordion-toggle" data-toggle="collapse">\
                       <div class="row">\
                        <div class="span1-fluid"><span class="label label-success verb"></span></div>\
                        <div class="span3-fluid title"></div>\
                        <div class="span3-fluid path"></div>\
                        <div class="span5-fluid visible-desktop pull-right text-info"></div>\
                       </div>\
                     </a>\
                   </div>\
                   <div class="accordion-body collapse out">\
                     <div class="accordion-inner">\
                      <table class="table table-striped  table-condensed">\
                        <thead>\
                          <tr>\
                            <th>Parameter</th>\
                            <th>Value</th>\
                            <th>Type</th>\
                            <th class="hidden-phone hidden-tablet">Description</th>\
                          </tr>\
                        </thead>\
                        <tbody class="parameters">\
                          <tr class="parameter">\
                            <td class="name"></td>\
                            <td class="value"><span class="text-info hidden-desktop"></span></td>\
                            <td class="type"></td>\
                            <td class="hidden-phone hidden-tablet text-info"></td>\
                          </tr>\
                        </tbody>\
                      </table>\
                     </div>\
                   </div>\
                 </div>\
            </div>\
          </div>\
      </section>';

  $.fn.outerHTML = function() {
    // IE, Chrome & Safari will comply with the non-standard outerHTML, all others (FF) will have a fall-back for cloning
    return (!this.length) ? this : (this[0].outerHTML || (
      function(el) {
        var div = document.createElement('div');
        div.appendChild(el.cloneNode(true));
        var contents = div.innerHTML;
        div = null;
        return contents;
      })(this[0]));
  }
  var sections = [];
  var methods = [];
  var parameters = [];
  var headers = [];
  var section = $(html);
  var methodhtml = $('.method', section);
  var parameterhtml = $('.parameter', section);
  var s = 0;
  var m = 0;
  $.getJSON('data/krowd.json', function(data) {
    var apijson = data;
    $(".method", section).remove();
    $(".parameter", methodhtml).remove();
    if (data['baseurl']) {
      $('.accordion-inner', methodhtml).append('<a href="#" class="btn btn-block btn-mini btn-info try"><strong>Try Endpoint</strong></a>')
    }
    if (data['authentication']) {
      var buttonText = data['authentication']['button'] ? data['authentication']['button'] : 'Authenticate!';
      var authparams;
      if (data['authentication']['fields'].length == 1) {
        authparams = '<div class="input-append">\
            <input class="span7" name="' + data['authentication']['fields'][0]['Name'] + '" type="text">\
            <button id="authbtn" class="btn" type="button">' + buttonText + '</button>\
          </div>';
      } else {
        // Add looping code here.
      }
      $(".explorer").append('\
        <div class="alert alert-success authentication">\
        <strong>Authentication</strong>\
        <p>' + data['authentication']['description'] + '</p>\
        ' + authparams + '\
        </div>');
    }
    if (data['globals']) {
      var globalparams;
      var globalparams = '<table class="table table-bordered  table-condensed">\
                          <thead>\
                            <tr>\
                              <th>Parameter</th>\
                              <th>Value</th>\
                              <th>Type</th>\
                              <th class="hidden-phone hidden-tablet">Description</th>\
                            </tr>\
                          </thead>\
                          <tbody>';
      $.each(data['globals'], function(k, global) {
        globalparams += '<tr class="parameter">\
                              <td class="name">' + global['Name'] + '</td>\
                              <td class="value"><span class="text-info hidden-desktop">' + global['Description'] + '</span><input class="global" name="' + global['Name'] + '" type="text" value="' + global['Default'] + '"></td>\
                              <td class="type">' + global['Type'] + '</td>\
                              <td class="hidden-phone hidden-tablet text-info">' + global['Description'] + '</td>\
                            </tr>';
      });
      globalparams += '</tbody></table>';
      $(".explorer").append('\
      <div class="alert alert-info authentication">\
      <strong>Global Parameters</strong>\
      <p>These parameters will globally override method parameters if changed.</p>\
      ' + globalparams + '\
      </div>');
    }
    $.each(data['endpoints'], function(k, endpoint) {
      var c = k == 0 ? "class=\"active\"" : "";
      $('.sidebar .nav').append('<li '+ c +'><a href="#' + endpoint['name'].toLowerCase() + '"><i class="icon-chevron-right"></i> ' + endpoint['name'] + '</a></li>');
      $(".sectionanchor", section).attr("id", endpoint['name'].toLowerCase());
      $("h3", section).html(endpoint['name']);
      $(".lead", section).html(endpoint['description']);
      methods = []
      $.each(endpoint['methods'], function(km, method) {
        $(methodhtml).attr("id", "method-" + s + "-" + m);
        $(".verb", methodhtml).removeClass().addClass("label verb label-" + method['HTTPMethod'].toLowerCase()).html(method['HTTPMethod']);
        $(".title", methodhtml).html(method['MethodName']);
        $(".path", methodhtml).html(method['URI']);
        $(".text-info", methodhtml).html(method['Synopsis']);
        $(".accordion-toggle", methodhtml).attr({
          "data-parent": "#method-" + s + "-" + m,
          "href": "#method-" + s + "-" + m + "-toggle"
        });
        $(".accordion-body", methodhtml).attr("id", "method-" + s + "-" + m + "-toggle");
        parameters = [];
        // Method Parameter Loop
        $.each(method['parameters'], function(kp, parameter) {
          $(".name", parameterhtml).html(parameter['Name']);
          $(".type", parameterhtml).html(parameter['Type']);
          $(".value input, .value select, div.fileupload", parameterhtml).remove();
          if (parameter['Type'] == 'enumerated') {
            var select = '<select name="' + parameter['Name'] + '">';
            $.each(parameter['enumerated'], function(ke, option) {
              select += '<option>' + option + '</option>';
            });
            select += '</select>';
            $(".value", parameterhtml).prepend(select);
          }else if(parameter['Type'] == 'file'){
            var upload = '<div class="fileupload fileupload-new" data-provides="fileupload">\
            <div class="input-append">\
              <div class="uneditable-input span3"><i class="icon-file fileupload-exists"></i> <span class="fileupload-preview"></span></div><span class="btn btn-file"><span class="fileupload-new">Select file</span><span class="fileupload-exists">Change</span><input name = "'+parameter['Name']+'[]" type="file" /></span><a href="#" class="btn fileupload-exists" data-dismiss="fileupload">Remove</a>\
              </div>\
            </div>';
            $(".value", parameterhtml).prepend(upload);
          }else {
            var value = (parameter['Default'] != null) ? parameter['Default'] : "";
            var placeholder = (parameter['Required'] == 'Y') ? 'required' : "";
            $(".value", parameterhtml).prepend('<input name="' + parameter['Name'] + '" placeholder = "'+placeholder+'" type="text" value="' + value + '">');
          }
          $(".test", parameterhtml).attr("value", parameter['Default']);
          $(".text-info", parameterhtml).html(parameter['Description']);
          parameters.push($(parameterhtml).outerHTML());
        });
        $("tbody", methodhtml).html(parameters);
        methods.push($(methodhtml).outerHTML());
        m++;
      });
      $(".methods", section).html(methods);
      sections.push($(section).outerHTML());
    });
    s++;
    $(".explorer").append(sections);
    $("body").scrollspy();
    $('section .btn.closeall').on('click', function(e) {
      e.preventDefault();
      var self = $(this);
      var methods = self.closest('section').find('.collapse');
      methods.collapse('hide');
      $(this).hide();
      self.next('.btn.showall').fadeIn('fast');
    });
    $('section .btn.showall').on('click', function(e) {
      e.preventDefault();
      var self = $(this);
      var methods = self.closest('section').find('.collapse');
      methods.collapse('show');
      $(this).hide();
      self.prev('.btn.closeall').fadeIn('fast');
    });
    $('.global').change(function() {
      name = $(this).attr('name');
      $('input[name="' + name + '"]').val($(this).val());
    });
    // This is where the authentication magic happens.  You will need to update this to get a valid token depending on how
    // your authentication schema works.  We use oauth2 and will redirect on login back to the page with a valid token.
    // This really could be updated to do username/password as well if you were comfortable doing that.  All we need to do is
    // populate the parameters set in the JSON to send with every request, in our case an Authorization : Token="TOKENID" header.
    $('#authbtn').on('click', function(e) {
      var params = {};
      $.each(apijson['authentication']['parameters'], function(k, v) {
        params[v['Name']] = v['Default'];
      });
      var reqURL = apijson['authentication']['AuthURI'];

      $.ajax({
        type: apijson['authentication']['HTTPMethod'],
        url: reqURL,
        data: params,
        dataType: "jsonp",
        jsonpCallback: 'callback',
        async: true,
        success: function(data, status, XHR) {
          $("input[name='token']").val(data['access_token']);
          headers = {
            'Authorization': 'Token token="' + $("input[name='token']").val() + '"'
          };
        },
        error: function(data, status, XHR) {}
      });
    });


    $('.try').on('click', function(e) {
      var reqURL = data['baseurl'] + $(this).closest('.method').find('.path').html();
      e.preventDefault();
      var params = {};
      var self = this;
      $.each($(this).prev('table').find('.parameter'), function(k, v) {
        params[$('.name', v).html()] = $('input,select', v).val();
      });
      var matches = reqURL.match(/(:(?:[a-z][a-z0-9_-]*))/g);
      if (matches) {
        $.each(matches, function(k, v) {
          reqURL = reqURL.replace(v, params[v.replace(':', '')]);
          delete params[v.replace(':', '')];
        });
      }

      if ($(self).closest('.accordion-inner').find('pre').length == 0) {
        $(self).closest('.accordion-inner').append('<pre class="prettyprint request-url"><h5>Request URL</h5><p></p></pre><pre class="prettyprint response-headers"><h5>Response Headers</h5><p></p></pre><pre class="prettyprint  response-body pre-scrollable"><h5>Response Body</h5><p></p></pre>');
      }else{
        $(self).closest('.accordion-inner').find('.response-headers p').html('');
        $(self).closest('.accordion-inner').find('.response-body p').html('');
        $(self).closest('.accordion-inner').find('.request-url p').html('');
      }


      var ajaxTime= new Date().getTime();
      var geturl;
      if($(self).closest('.method').find('.verb').html() == 'IMAGE'){
        $(self).closest('.accordion-inner').find('.request-url p').html(reqURL);
        $(self).closest('.accordion-inner').find('.response-headers').hide();
        $(self).closest('.accordion-inner').find('.response-body p').html('<img src="'+reqURL+'">');
      }else{
        geturl = $.ajax({
        type: $(this).closest('.method').find('.verb').html(),
        url: reqURL,
        headers: headers,
        data: params,
        dataType: "json",
        jsonpCallback: 'callback',
        async: true,
        success: function(data, status, XHR) {
          $(self).closest('.accordion-inner').find('.request-url p').html(this.url);
          $(self).closest('.accordion-inner').find('.response-headers p').html(XHR.getAllResponseHeaders());
          $(self).closest('.accordion-inner').find('.response-body p').html(syntaxHighlight(data));
        },
        error: function(data, status, XHR) {
          $(self).closest('.accordion-inner').find('.request-url p').html(this.url);
          $(self).closest('.accordion-inner').find('.response-headers p').html(data.getAllResponseHeaders());
          $(self).closest('.accordion-inner').find('.response-body p').html(syntaxHighlight(data['responseText']));
        }
        }).done(function () {
            var totalTime = new Date().getTime()-ajaxTime;
            console.log("You waited: " + totalTime + " ms")
            // Here I want to get the how long it took to load some.php and use it further
        });
      }
    });
  });

  function makeRequest(params) {}
  $('.collapse').on('shown', function() {
    $("body").scrollspy('refresh');
  })
  $('.collapse').on('hidden', function() {
    $("body").scrollspy('refresh');
  })
  $(document).ajaxSend(function(event, xhr, settings) {
    settings.xhrFields = {
      withCredentials: true
    };
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  });

  function syntaxHighlight(json) {
    if (typeof json != 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }
})


