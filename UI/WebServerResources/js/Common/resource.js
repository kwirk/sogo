/* -*- Mode: javascript; indent-tabs-mode: nil; c-basic-offset: 2 -*- */

(function() {
  'use strict';

  /**
   * @name Resource
   * @constructor
   * @param {Object} $http - the Angular HTTP service
   * @param {Object} $q - the Angular promise/deferred service
   * @param {String} path - the base path of the external resource
   * @param {Object} options - extra attributes to be associated to the object
   */
  function Resource($http, $q, path, activeUser, options) {
    angular.extend(this, {
      _http: $http,
      _q: $q,
      _path: path,
      _activeUser: activeUser
    });
    angular.extend(this, options);
  }

  /**
   * @memberof Resource
   * @desc The factory we'll use to register with Angular.
   * @return a new Resource object
   */
  Resource.$factory =  ['$http', '$q', function($http, $q) {
    return function(path, options) {
      return new Resource($http, $q, path, options);
    };
  }];

  /**
   * @module SOGo.Common
   * @desc Factory registration of Resource in Angular module.
   */
  angular.module('SOGo.Common').factory('sgResource', Resource.$factory);

  /**
   * @function userResource
   * @memberof Resource.prototype
   * @desc Create a new Resource object associated to a username different than the active user.
   * @param {String} uid - the user UID
   * @return a new Resource object
   */
  Resource.prototype.userResource = function(uid) {
    var path = _.compact(this._activeUser.folderURL.split('/'));
    path.splice(path.length - 1, 1, escape(uid));

    return new Resource(this._http, this._q, '/' + path.join('/'), this._activeUser);
  };

  /**
   * @function fetch
   * @memberof Resource.prototype
   * @desc Fetch resource using a specific folder, action and/or parameters.
   * @param {string} folderId - the folder on which the action will be applied (ex: addressbook, calendar)
   * @param {string} action - the action to be used in the URL
   * @param {Object} params - Object parameters injected through the $http service
   * @return a promise
   */
  Resource.prototype.fetch = function(folderId, action, params) {
    var deferred = this._q.defer(),
        path = [this._path];
    if (folderId) path.push(folderId.split('/'));
    if (action)   path.push(action);
    path = _.compact(_.flatten(path)).join('/');

    this._http({
      method: 'GET',
      url: path,
      params: params
    })
      .success(deferred.resolve)
      .error(deferred.reject);

    return deferred.promise;
  };

  /**
   * @function newguid
   * @memberof Resource.prototype
   * @desc Fetch a new GUID on the specified folder ID.
   * @return a promise of the new data structure
   */
  Resource.prototype.newguid = function(folderId) {
    var deferred = this._q.defer(),
        path = this._path + '/' + folderId + '/newguid';

    this._http
      .get(path)
      .success(deferred.resolve)
      .error(deferred.reject);

    return deferred.promise;
  };

  /**
   * @function create
   * @memberof Resource.prototype
   * @desc Create a new resource using a specific action (post).
   * @param {string} action - the action to be used in the URL
   * @param {string} name - the new resource's name
   * @return a promise
   */
  Resource.prototype.create = function(action, name) {
    var deferred = this._q.defer(),
        path = this._path + '/' + action;

    this._http
      .post(path, { name: name })
      .success(deferred.resolve)
      .error(deferred.reject);

    return deferred.promise;
  };

  /**
   * @function save
   * @memberof Resource.prototype
   * @desc Save a resource attributes on the server (post /save).
   * @return a promise
   */
  Resource.prototype.save = function(id, newValue, options) {
    var deferred = this._q.defer(),
        action = (options && options.action)? options.action : 'save',
        path = this._path + '/' + id + '/' + action;

    this._http
      .post(path, newValue)
      .success(deferred.resolve)
      .error(deferred.reject);

    return deferred.promise;
  };

  /**
   * @function remove
   * @memberof Resource.prototype
   * @desc Delete a resource (get /delete).
   * @return a promise
   */
  Resource.prototype.remove = function(uid) {
    var deferred = this._q.defer(),
        path = this._path + '/' + uid + '/delete';

    this._http
      .get(path)
      .success(deferred.resolve)
      .error(deferred.reject);

    return deferred.promise;
  };

})();
