#!/usr/bin/env node
// Patch @hanzogui/* packages whose 7.0.0 publish shipped without dist/.
// Rewrites their package.json main/module/exports to point at src/ so that
// Vite/Rolldown compiles the TS source on the fly.
const fs = require('fs');
const path = require('path');

const SCOPES = ['@hanzogui', '@hanzo'];
const PATCH_NAMES = new Set(['gui', 'theming']);
const ROOT_NM = path.resolve(__dirname, '..', 'node_modules');
const PNPM_STORE = path.join(ROOT_NM, '.pnpm');
const ROOTS = [ROOT_NM];
if (fs.existsSync(PNPM_STORE)) {
  for (const e of fs.readdirSync(PNPM_STORE, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const inner = path.join(PNPM_STORE, e.name, 'node_modules');
    if (fs.existsSync(inner)) ROOTS.push(inner);
  }
}

let patched = 0;

function findScopeDirs(start) {
  const found = [];
  if (!fs.existsSync(start)) return found;
  const queue = [start];
  while (queue.length) {
    const dir = queue.shift();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      const full = path.join(dir, e.name);
      if (SCOPES.includes(e.name)) {
        found.push(full);
      } else if (e.name === 'node_modules') {
        queue.push(full);
      }
    }
  }
  return found;
}

function distEmpty(pkgDir) {
  const dist = path.join(pkgDir, 'dist');
  if (!fs.existsSync(dist)) return true;
  let hasFiles = false;
  function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (hasFiles) return;
      if (e.isDirectory()) walk(path.join(d, e.name));
      else if (e.isFile()) hasFiles = true;
    }
  }
  try { walk(dist); } catch {}
  return !hasFiles;
}

function pickEntry(pkgDir) {
  const candidates = [
    'src/index.ts',
    'src/index.tsx',
    'src/index.web.ts',
    'src/index.web.tsx',
  ];
  for (const c of candidates) {
    if (fs.existsSync(path.join(pkgDir, c))) return './' + c;
  }
  return null;
}

function pickNativeEntry(pkgDir) {
  const candidates = [
    'src/index.native.ts',
    'src/index.native.tsx',
  ];
  for (const c of candidates) {
    if (fs.existsSync(path.join(pkgDir, c))) return './' + c;
  }
  return null;
}

function patchPackage(pkgDir) {
  const pjPath = path.join(pkgDir, 'package.json');
  if (!fs.existsSync(pjPath)) return false;
  if (!distEmpty(pkgDir)) return false;
  const entry = pickEntry(pkgDir);
  if (!entry) return false;
  const native = pickNativeEntry(pkgDir);
  const types = fs.existsSync(path.join(pkgDir, 'types', 'index.d.ts'))
    ? './types/index.d.ts'
    : entry;
  const pj = JSON.parse(fs.readFileSync(pjPath, 'utf8'));
  pj.main = entry;
  pj.module = entry;
  pj.types = types;
  pj.source = entry;
  const exportsMap = {
    './package.json': './package.json',
    '.': {
      types,
      ...(native ? { 'react-native': native } : {}),
      browser: entry,
      module: entry,
      import: entry,
      require: entry,
      default: entry,
    },
  };
  // Generate explicit subpath exports for every file in src/ so consumers
  // that import `@scope/pkg/foo` get the right file. We emit each base name
  // (without extension) plus the extension-suffixed variants.
  const srcDir = path.join(pkgDir, 'src');
  if (fs.existsSync(srcDir)) {
    const seen = new Set();
    function walk(dir, rel) {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        const childRel = rel ? path.join(rel, e.name) : e.name;
        if (e.isDirectory()) { walk(full, childRel); continue; }
        if (!/\.(ts|tsx)$/.test(e.name)) continue;
        if (e.name.endsWith('.d.ts')) continue;
        if (e.name.endsWith('.test.ts') || e.name.endsWith('.test.tsx')) continue;
        const noExt = childRel.replace(/\.(ts|tsx)$/, '');
        if (noExt === 'index' || /(^|\/)index$/.test(noExt)) continue;
        if (/\.native$/.test(noExt)) continue;
        if (/\.web$/.test(noExt)) continue;
        const baseKey = './' + noExt.replace(/\\/g, '/');
        if (seen.has(baseKey)) continue;
        seen.add(baseKey);
        const target = './src/' + childRel.replace(/\\/g, '/');
        const nativeFull = path.join(srcDir, noExt + '.native.tsx');
        const nativeFull2 = path.join(srcDir, noExt + '.native.ts');
        const nativeRel = fs.existsSync(nativeFull)
          ? './src/' + noExt + '.native.tsx'
          : fs.existsSync(nativeFull2) ? './src/' + noExt + '.native.ts' : null;
        exportsMap[baseKey] = {
          ...(nativeRel ? { 'react-native': nativeRel } : {}),
          browser: target,
          module: target,
          import: target,
          require: target,
          default: target,
        };
      }
    }
    walk(srcDir, '');
  }
  pj.exports = exportsMap;
  fs.writeFileSync(pjPath, JSON.stringify(pj, null, 2) + '\n');
  return true;
}

for (const root of ROOTS) {
  for (const scopeDir of findScopeDirs(root)) {
    const scope = path.basename(scopeDir);
    for (const name of fs.readdirSync(scopeDir)) {
      // For @hanzo scope, only touch known broken packages so we don't
      // clobber unrelated published packages like @hanzo/branding.
      if (scope === '@hanzo' && !PATCH_NAMES.has(name)) continue;
      const pkgDir = path.join(scopeDir, name);
      if (patchPackage(pkgDir)) patched++;
    }
  }
}

// Source-level fixups for known stale references in published 7.0.0 sources.
// `@hanzogui/web` exports `GuiRoot`, but `@hanzogui/portal`'s source still
// imports the old `HanzoguiRoot` symbol. Rewrite locally so vite can compile.
let srcFixups = 0;
// Generic rename map. Old names in published 7.0.0 sources → canonical Gui*.
// Order matters: longer prefixes first so `Hanzogui*` doesn't shadow rename of
// inner `Hanzogui*` token.
const RENAMES = [
  [/\.\/createHanzogui\b/g, './createGui'],
  [/\.\/views\/HanzoguiProvider\b/g, './views/GuiProvider'],
  [/\bcreateHanzogui\b/g, 'createGui'],
  [/\bCreateHanzoguiConfig\b/g, 'CreateGuiConfig'],
  [/\bCreateHanzoguiProps\b/g, 'CreateGuiProps'],
  [/\bHanzoguiProviderProps\b/g, 'GuiProviderProps'],
  [/\bHanzoguiInternalConfig\b/g, 'GuiInternalConfig'],
  [/\bHanzoguiProvider\b/g, 'GuiProvider'],
  [/\bHanzoguiRoot\b/g, 'GuiRoot'],
  [/\bisHanzoguiComponent\b/g, 'isGuiComponent'],
  [/\bisHanzoguiElement\b/g, 'isGuiElement'],
  [/\bHanzoguiComponent\b/g, 'GuiComponent'],
  [/\bHanzoguiElement\b/g, 'GuiElement'],
  [/\bHanzoguiInstance\b/g, 'GuiInstance'],
  [/\bHanzoguiInternalConfig\b/g, 'GuiInternalConfig'],
];

function fixupSource(file) {
  if (!fs.existsSync(file)) return;
  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  for (const [re, repl] of RENAMES) after = after.replace(re, repl);
  if (after !== before) {
    fs.writeFileSync(file, after);
    srcFixups++;
  }
}

function renameFile(from, to) {
  if (fs.existsSync(from) && !fs.existsSync(to)) {
    fs.renameSync(from, to);
    return true;
  }
  return false;
}

function fixupTree(pkgDir) {
  const srcDir = path.join(pkgDir, 'src');
  if (!fs.existsSync(srcDir)) return;
  // Rename files using old names so import paths still resolve.
  renameFile(path.join(srcDir, 'createHanzogui.ts'), path.join(srcDir, 'createGui.ts'));
  renameFile(path.join(srcDir, 'createHanzogui.tsx'), path.join(srcDir, 'createGui.tsx'));
  const viewsDir = path.join(srcDir, 'views');
  if (fs.existsSync(viewsDir)) {
    renameFile(path.join(viewsDir, 'HanzoguiProvider.tsx'), path.join(viewsDir, 'GuiProvider.tsx'));
    renameFile(path.join(viewsDir, 'HanzoguiProvider.native.tsx'), path.join(viewsDir, 'GuiProvider.native.tsx'));
  }
  function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else if (/\.(ts|tsx|mjs|cjs|js)$/.test(e.name)) fixupSource(full);
    }
  }
  walk(srcDir);
}

for (const root of ROOTS) {
  for (const scopeDir of findScopeDirs(root)) {
    for (const name of fs.readdirSync(scopeDir)) {
      const pkgDir = path.join(scopeDir, name);
      const stat = (() => { try { return fs.statSync(pkgDir); } catch { return null; } })();
      if (!stat || !stat.isDirectory()) continue;
      fixupTree(pkgDir);
    }
  }
}

console.log(`patch-hanzogui-exports: patched ${patched} package(s); fixed ${srcFixups} source file(s)`);
