/* global angular */
'use strict';
import angular from 'angular';
import uibootstrap from 'angular-ui-bootstrap';
import uirouter from 'angular-ui-router';
import toastr from 'angular-toastr';
import config from './config';

const dependencies = [
  uirouter,
  toastr,
  uibootstrap
];

const app = angular.module('dockerswarmUI', dependencies).config(config);

// bind controllers (/controllers/*.controller.js)
const controllersContext = require.context('./controllers', true, /^\.\/.*.controller.js$/);
const controllers = controllersContext.keys().map(key => controllersContext(key));
controllers.forEach(controller => app.controller(controller.name, controller.fn));

// bind factories (/services/*.factory.js)
const factoriesContext = require.context('./services', true, /^\.\/.*.factory.js$/);
const factories = factoriesContext.keys().map(key => factoriesContext(key));
factories.forEach(factory => app.factory(factory.name, factory.fn));

// bind factories (/services/*.service.js)
const servicesContext = require.context('./services', true, /^\.\/.*.service.js$/);
const services = servicesContext.keys().map(key => servicesContext(key));
services.forEach(service => app.service(service.name, service.fn));

// bind directives (/directives/*.directive.js)
// template imports are handled by directives themselves
const directivesContext = require.context('./directives', true, /^\.\/.*.directive.js$/);
const directives = directivesContext.keys().map(key => directivesContext(key));
directives.forEach(directive => app.directive(directive.name, directive.fn));
