import navbarTemplate from './navbar.template.html';

function navbarDirective() {
  return {
    templateUrl: navbarTemplate,
    scope: {
      // isNavCollapsed: '&',
      // apptitle: '@'
    }
  };
};

module.exports = {
  name: 'navbarDirective',
  fn: navbarDirective
};