// This file will register necessary Handlebars helpers
const Handlebars = require('handlebars');

// Equal comparison helper
Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

// Not equal comparison helper
Handlebars.registerHelper('neq', function(a, b) {
  return a !== b;
});

// Greater than helper
Handlebars.registerHelper('gt', function(a, b) {
  return a > b;
});

// Less than helper
Handlebars.registerHelper('lt', function(a, b) {
  return a < b;
});

// Greater than or equal helper
Handlebars.registerHelper('gte', function(a, b) {
  return a >= b;
});

// Less than or equal helper
Handlebars.registerHelper('lte', function(a, b) {
  return a <= b;
});

// And helper
Handlebars.registerHelper('and', function() {
  return Array.prototype.slice.call(arguments, 0, -1).every(Boolean);
});

// Or helper
Handlebars.registerHelper('or', function() {
  return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
});

module.exports = Handlebars; 