/* global angular */
'use strict';
import angular from 'angular';
import config from './config';

angular.module('dockerswarmUI',['ngRoute','ui.bootstrap'])
  .config(config);
