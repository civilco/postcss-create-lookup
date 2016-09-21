var postcss = require('postcss');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');

var isVariableDeclaration = /^\$[\w-]+$/;

module.exports = postcss.plugin('postcss-create-lookup', (opts) => {
  opts = opts || {};
  return function (css, result) {
    var output = [];

    css.walkDecls(declaration => {
      if (isVariableDeclaration.test(declaration.value)) {
        output.push({
          selector: _.get(declaration, 'parent.selector'),
          value: declaration.value,
          prop: declaration.prop,
        });
      }
    });

    if (output.length && _.isString(opts.file)) {
      mkdirp.sync(path.dirname(opts.file));
      fs.writeFileSync(opts.file, JSON.stringify(output, null, 2));
    }

    // console.log(output);

  };
});
