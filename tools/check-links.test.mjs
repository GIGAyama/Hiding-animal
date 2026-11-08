import { test } from 'node:test';
import assert from 'node:assert/strict';
import { localTargets, problemsIn } from './check-links.mjs';

test('相対の 道を 拾う', () => {
  assert.deepEqual(localTargets('<a href="./terms.html">x</a>'), ['terms.html']);
  assert.deepEqual(localTargets('<img src="./photos/a.jpg">'), ['photos/a.jpg']);
});

test('「./」だけは index.html と 見る', () => {
  assert.deepEqual(localTargets('<a href="./">もどる</a>'), ['index.html']);
});

test('#top や ?v=1 を はずして くらべる', () => {
  assert.deepEqual(localTargets('<a href="./a.html#中ほど">x</a>'), ['a.html']);
  assert.deepEqual(localTargets('<link rel="stylesheet" href="./style.css?v=3">'), ['style.css']);
});

test('外への リンクは 見ない', () => {
  assert.deepEqual(localTargets('<a href="https://commons.wikimedia.org/x">x</a>'), []);
  assert.deepEqual(localTargets('<a href="mailto:a@b.c">x</a>'), []);
  assert.deepEqual(localTargets('<a href="#top">x</a>'), []);
});

test('スキームを 省いた //cdn… を 自分の側に 数えない', () => {
  // ⚠️ 数えると「ファイルが 無い」としか 出ず、Zero-CDN 違反だと
  //    気づけない。あちらは check-no-external.mjs の 担当。
  assert.deepEqual(localTargets('<script src="//cdn.example/x.js"></script>'), []);
});

test('行き先が 無ければ 落ちる', () => {
  const bad = problemsIn(['a.html'], {
    exists: (p) => p === 'a.html',
    listPage: () => '<a href="./nai.html">x</a>',
  });
  assert.equal(bad.length, 1);
  assert.match(bad[0], /nai\.html/);
});

test('ぜんぶ 生きて いれば 何も 言わない', () => {
  const bad = problemsIn(['a.html'], {
    exists: () => true,
    listPage: () => '<a href="./b.html">x</a><img src="./c.jpg">',
  });
  assert.deepEqual(bad, []);
});
