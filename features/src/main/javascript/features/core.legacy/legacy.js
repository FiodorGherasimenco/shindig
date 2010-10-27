/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*global gadgets */
var gadgets;

/**
 * @fileoverview All functions in this file should be treated as deprecated legacy routines.
 * Gadget authors are explicitly discouraged from using any of them.
 */

var JSON = window.JSON || gadgets.json;

/**
 * @deprecated
 */
var _IG_Prefs = (function() {
  var instance = null;

  var _IG_Prefs = function() {
    if (!instance) {
      instance = new gadgets.Prefs();
      instance.setDontEscape_();
    }
    return instance;
  };

  _IG_Prefs._parseURL = gadgets.Prefs.parseUrl;

  return _IG_Prefs;
})();

function _IG_Fetch_wrapper(callback, obj) {
  callback(obj.data ? obj.data : '');
}

/**
 * @deprecated
 */
function _IG_FetchContent(url, callback, opt_params) {
  var params = opt_params || {};
  // This is really the only legacy parameter documented
  // at http://code.google.com/apis/gadgets/docs/remote-content.html#Params
  if (params.refreshInterval) {
    params['REFRESH_INTERVAL'] = params.refreshInterval;
  } else {
    params['REFRESH_INTERVAL'] = 3600;
  }
  // Other params, such as POST_DATA, were supported in lower case.
  // Upper-case all param keys as a convenience, since all valid values
  // are uppercased.
  for (var param in params) {
    var pvalue = params[param];
    delete params[param];
    params[param.toUpperCase()] = pvalue;
  }
  var cb = gadgets.util.makeClosure(null, _IG_Fetch_wrapper, callback);
  gadgets.io.makeRequest(url, cb, params);
}

/**
 * @deprecated
 */
function _IG_FetchXmlContent(url, callback, opt_params) {
  var params = opt_params || {};
  if (params.refreshInterval) {
    params['REFRESH_INTERVAL'] = params.refreshInterval;
  } else {
    params['REFRESH_INTERVAL'] = 3600;
  }
  params.CONTENT_TYPE = 'DOM';
  var cb = gadgets.util.makeClosure(null, _IG_Fetch_wrapper, callback);
  gadgets.io.makeRequest(url, cb, params);
}


/**
 * @deprecated
 */
function _IG_FetchFeedAsJSON(url, callback, numItems, getDescriptions,
                             opt_params) {
  var params = opt_params || {};
  params.CONTENT_TYPE = 'FEED';
  params.NUM_ENTRIES = numItems;
  params.GET_SUMMARIES = getDescriptions;
  gadgets.io.makeRequest(url,
      function(resp) {
        // special case error reporting for back-compatibility
        // see http://code.google.com/apis/gadgets/docs/legacy/remote-content.html#Fetch_JSON
        resp.data = resp.data || {};
        if (resp.errors && resp.errors.length > 0) {
          resp.data.ErrorMsg = resp.errors[0];
        }
        if (resp.data.link) {
          resp.data.URL = url;
        }
        if (resp.data.title) {
          resp.data.Title = resp.data.title;
        }
        if (resp.data.description) {
          resp.data.Description = resp.data.description;
        }
        if (resp.data.link) {
          resp.data.Link = resp.data.link;
        }
        if (resp.data.items && resp.data.items.length > 0) {
          resp.data.Entry = resp.data.items;
          for (var index = 0; index < resp.data.Entry.length; ++index) {
            var entry = resp.data.Entry[index];
            entry.Title = entry.title;
            entry.Link = entry.link;
            entry.Summary = entry.summary || entry.description;
            entry.Date = entry.pubDate;
          }
        }
        for (var ix = 0; ix < resp.data.Entry.length; ++ix) {
          var entry = resp.data.Entry[ix];
          entry.Date = (entry.Date / 1000);  // response in sec, not ms
        }
        // for Gadgets back-compatibility, return the feed obj directly
        callback(resp.data);
      }, params);
}

/**
 * @param {string} url
 * @param {Object=} opt_params
 * @deprecated
 */
function _IG_GetCachedUrl(url, opt_params) {
  var params = opt_params || {};
  params['REFRESH_INTERVAL'] = 3600;
  if (params.refreshInterval) {
    params['REFRESH_INTERVAL'] = params.refreshInterval;
  }
  return gadgets.io.getProxyUrl(url, params);
}
/**
 * @param {string} url
 * @param {Object=} opt_params
 * @deprecated
 */
function _IG_GetImageUrl(url, opt_params) {
  return _IG_GetCachedUrl(url, opt_params);
}

/**
 * @param {string} url
 * @return {Element}
 * @deprecated
 */
function _IG_GetImage(url) {
  var img = document.createElement('img');
  img.src = _IG_GetCachedUrl(url);
  return img;
}


/**
 * @deprecated
 */
function _IG_RegisterOnloadHandler(callback) {
  gadgets.util.registerOnLoadHandler(callback);
}

/**
 * _IG_Callback takes the arguments in the scope the callback is executed and
 * places them first in the argument array. MakeClosure takes the arguments
 * from the scope at callback construction and pushes them first in the array
 *
 * @deprecated
 */
function _IG_Callback(handler_func, var_args) {
  var orig_args = arguments;
  return function() {
    var combined_args = Array.prototype.slice.call(arguments);
    // call the handler with all args combined
    handler_func.apply(null,
        combined_args.concat(Array.prototype.slice.call(orig_args, 1)));
  };
}

var _args = gadgets.util.getUrlParameters;

/**
 * Fetches an object by document id.
 *
 * @param {string | Object} el The element you wish to fetch. You may pass
 *     an object in which allows this to be called regardless of whether or
 *     not the type of the input is known.
 * @return {HTMLElement} The element, if it exists in the document, or null.
 * @deprecated
 */
function _gel(el) {
  return document.getElementById ? document.getElementById(el) : null;
}

/**
 * Fetches elements by tag name.
 * This is functionally identical to document.getElementsByTagName()
 *
 * @param {string} tag The tag to match elements against.
 * @return {Array.<HTMLElement>} All elements of this tag type.
 * @deprecated
 */
function _gelstn(tag) {
  if (tag === '*' && document.all) {
    return document.all;
  }
  return document.getElementsByTagName ?
         document.getElementsByTagName(tag) : [];
}

/**
 * Fetches elements with ids matching a given regular expression.
 *
 * @param {string} tagName The tag to match elements against.
 * @param {RegEx} regex The expression to match.
 * @return {Array.<HTMLElement>} All elements of this tag type that match
 *     regex.
 * @deprecated
 */
function _gelsbyregex(tagName, regex) {
  var matchingTags = _gelstn(tagName);
  var matchingRegex = [];
  for (var i = 0, j = matchingTags.length; i < j; ++i) {
    if (regex.test(matchingTags[i].id)) {
      matchingRegex.push(matchingTags[i]);
    }
  }
  return matchingRegex;
}

/**
 * URI escapes the given string.
 * @param {string} str The string to escape.
 * @return {string} The escaped string.
 * @deprecated
 */
function _esc(str) {
  return window.encodeURIComponent ? encodeURIComponent(str) : escape(str);
}

/**
 * URI unescapes the given string.
 * @param {string} str The string to unescape.
 * @return {string} The unescaped string.
 * @deprecated
 */
function _unesc(str) {
  return window.decodeURIComponent ? decodeURIComponent(str) : unescape(str);
}

/**
 * Encodes HTML entities such as <, " and >.
 *
 * @param {string} str The string to escape.
 * @return {string} The escaped string.
 * @deprecated
 */
function _hesc(str) {
  return gadgets.util.escapeString(str);
}

/**
 * Removes HTML tags from the given input string.
 *
 * @param {string} str The string to strip.
 * @return {string} The stripped string.
 * @deprecated
 */
function _striptags(str) {
  return str.replace(/<\/?[^>]+>/g, '');
}

/**
 * Trims leading & trailing whitespace from the given string.
 *
 * @param {string} str The string to trim.
 * @return {string} The trimmed string.
 * @deprecated
 */
function _trim(str) {
  return str.replace(/^\s+|\s+$/g, '');
}

/**
 * Toggles the given element between being shown and block-style display.
 *
 * @param {string | HTMLElement} el The element to toggle.
 * @deprecated
 */
function _toggle(el) {
  el = (typeof el === 'string') ? _gel(el) : el;
  if (el !== null) {
    if (el.style.display.length === 0 || el.style.display === 'block') {
      el.style.display = 'none';
    } else if (el.style.display === 'none') {
      el.style.display = 'block';
    }
  }
}


var _uid = (function() {
  /**
   * @type {number} A counter used by uniqueId().
   */
  var _legacy_uidCounter = 0;

  /**
   * @return {number} a unique number.
   * @deprecated
   */
  return function() {
    return _legacy_uidCounter++;
  };
})();

/**
 * @param {number} a
 * @param {number} b
 * @return {number} The lesser of a or b.
 * @deprecated
 */
function _min(a, b) {
  return (a < b ? a : b);
}

/**
 * @param {number} a
 * @param {number} b
 * @return {number} The greater of a or b.
 * @deprecated
 */
function _max(a, b) {
  return (a > b ? a : b);
}

/**
 * @param {string} name
 * @param {Array.<string | Object>} sym
 * @deprecated
 */
function _exportSymbols(name, sym) {
  var attach = window;
  var parts = name.split('.');
  for (var i = 0, j = parts.length; i < j; i++) {
    var part = parts[i];
    attach[part] = attach[part] || {};
    attach = attach[part];
  }
  for (var k = 0, l = sym.length; k < l; k += 2) {
    attach[sym[k]] = sym[k + 1];
  }
}

/**
 * @deprecated
 * @param {Object} src
 * @param {string} etype
 * @param {function()} func
 * TODO - implement.
 */
function _IG_AddDOMEventHandler(src, etype, func) {
  gadgets.warn('_IG_AddDOMEventHandler not implemented - see SHINDIG-198');
}

