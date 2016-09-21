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
    file: './test1.json',
  }) ])
  .process(input)
  .then( result => {
    let json = JSON.parse(fs.readFileSync('./test1.json'));

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
  })
  .then(()=>new Promise((resolve, reject)=>fs.unlink('./test1.json', resolve)))
});


test('merge with an existing file', t => {
  let input = `.bob { background-color: $xyz; padding: 10px; }`;

  fs.writeFileSync('./test2.json', JSON.stringify([{ old: true }]));

  return postcss([ plugin({
    file: './test2.json',
  }) ])
  .process(input)
  .then( result => {
    let json = JSON.parse(fs.readFileSync('./test2.json'));

    t.deepEqual(json, [
      { old: true },
      {
        selector: ".bob",
        value: "$xyz",
        prop: "background-color"
      }
    ]);
    t.deepEqual(result.warnings().length, 0);
  })
  .then(()=>new Promise((resolve, reject)=>fs.unlink('./test2.json', resolve)))
});
