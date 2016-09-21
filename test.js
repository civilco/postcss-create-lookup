import postcss from 'postcss';
import fs from 'fs';
import test    from 'ava';

import plugin from './';

test('find any properties with a $', t => {
  let input = `
  .bob { background-color: $xyz; padding: 10px; }
  .foo { width: 50; color: $boo; height: 10px; }
  .bar { flex: 1 }
  `;

  return postcss([ plugin({
    file: './output.json',
  }) ])
  .process(input)
  .then( result => {
    let json = JSON.parse(fs.readFileSync('./output.json'));

    t.deepEqual(json, [
      {
        selector: ".bob",
        value: "$xyz",
        prop: "background-color"
      },
      {
        selector: ".foo",
        value: "$boo",
        prop: "color",
      }
    ]);
    t.deepEqual(result.warnings().length, 0);

    fs.unlinkSync('./output.json');
  });
});
