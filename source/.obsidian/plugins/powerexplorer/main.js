var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => PowerExplorerPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var import_view = require("@codemirror/view");
var import_state = require("@codemirror/state");

// src/order.ts
function isUnder(path, folder) {
  if (!folder || folder === "/") return true;
  return path === folder || path.startsWith(folder + "/");
}
function parentPathOf(path) {
  const i = path.lastIndexOf("/");
  return i < 0 ? "/" : path.slice(0, i) || "/";
}
function nameOf(path) {
  const i = path.lastIndexOf("/");
  return i < 0 ? path : path.slice(i + 1);
}
function joinPath(dir, name) {
  return !dir || dir === "/" ? name : dir + "/" + name;
}
function sortChildren(items, mode, nameOf2, isFolder, timeOf) {
  const arr = [...items];
  const byName = (a, b) => compareNames(nameOf2(a), nameOf2(b));
  if (mode === "alphabeticalReverse") return arr.sort((a, b) => byName(b, a));
  if (mode === "byModifiedTime" || mode === "byModifiedTimeReverse" || mode === "byCreatedTime" || mode === "byCreatedTimeReverse") {
    const key = mode.startsWith("byCreated") ? "ctime" : "mtime";
    const oldestFirst = mode.endsWith("Reverse");
    return arr.sort((a, b) => {
      const fa = isFolder(a);
      const fb = isFolder(b);
      if (fa || fb) return fa && fb ? byName(a, b) : fa ? -1 : 1;
      const ta = timeOf(a);
      const tb = timeOf(b);
      const va = ta ? ta[key] : 0;
      const vb = tb ? tb[key] : 0;
      return oldestFirst ? va - vb : vb - va;
    });
  }
  return arr.sort(byName);
}
function pathDepth(path) {
  if (!path || path === "/") return 0;
  return path.split("/").length;
}
function autoAccent(index, palette) {
  if (!palette.length || !Number.isInteger(index) || index < 0) return null;
  return palette[index % palette.length];
}
function mergeForSave(ours, baseline, disk) {
  const out = { ...ours };
  if (!disk) return out;
  for (const k of Object.keys(ours)) {
    if (!(k in disk)) continue;
    const o = ours[k];
    const b = baseline[k];
    const d = disk[k];
    if (isRecord(o) && isRecord(b) && isRecord(d)) {
      out[k] = mergeEntries(o, b, d);
      continue;
    }
    const changedByUs = JSON.stringify(o) !== JSON.stringify(b);
    if (!changedByUs) out[k] = d;
  }
  return out;
}
function isRecord(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
var DEVICE_KEYS = ["recentPages"];
function withoutDeviceKeys(o) {
  const out = { ...o };
  for (const k of DEVICE_KEYS) delete out[k];
  return out;
}
function pickDeviceKeys(o) {
  const src = o;
  const out = {};
  for (const k of DEVICE_KEYS) if (k in src) out[k] = src[k];
  return out;
}
function hasDeviceKeys(o) {
  return DEVICE_KEYS.some((k) => k in o);
}
function overlayDeviceState(target, raw) {
  let parsed;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    return target;
  }
  if (!isRecord(parsed)) return target;
  const dest = target;
  for (const k of DEVICE_KEYS) {
    const v = parsed[k];
    if (Array.isArray(v) && v.every((x) => typeof x === "string")) dest[k] = v;
  }
  return target;
}
function mergeEntries(ours, baseline, disk) {
  const out = {};
  for (const k of Object.keys(disk)) {
    const removedByUs = k in baseline && !(k in ours);
    if (!removedByUs) out[k] = disk[k];
  }
  for (const k of Object.keys(ours)) {
    const changedByUs = JSON.stringify(ours[k]) !== JSON.stringify(baseline[k]);
    if (changedByUs || !(k in disk)) out[k] = ours[k];
  }
  return out;
}
function compareNames(a, b) {
  return a.localeCompare(b, void 0, { numeric: true, sensitivity: "base" });
}
function pairPages(ordered, hasNote) {
  const folders = /* @__PURE__ */ new Set();
  for (const o of ordered) if (o.folder) folders.add(o.name);
  const siblingBases = /* @__PURE__ */ new Set();
  for (const o of ordered) {
    if (!o.folder && o.name.endsWith(".md") && folders.has(o.name.slice(0, -3))) siblingBases.add(o.name.slice(0, -3));
  }
  const out = [];
  for (const o of ordered) {
    if (!o.folder) {
      const base = o.name.endsWith(".md") ? o.name.slice(0, -3) : o.name;
      out.push({ page: o.name, group: o.name.endsWith(".md") && folders.has(base) ? base : null });
    } else if (!siblingBases.has(o.name) && hasNote(o.name)) {
      out.push({ page: null, group: o.name });
    }
  }
  return out;
}
function insertOrder(visible, dragged, before) {
  const rest = visible.filter((n) => n !== dragged);
  if (before == null || before === dragged) return [...rest, dragged];
  const i = rest.indexOf(before);
  if (i < 0) return [...rest, dragged];
  return [...rest.slice(0, i), dragged, ...rest.slice(i)];
}
function insertOrderMany(visible, dragged, before) {
  const moving = new Set(dragged);
  const block = visible.filter((n) => moving.has(n));
  for (const n of dragged) if (!block.includes(n)) block.push(n);
  const rest = visible.filter((n) => !moving.has(n));
  if (before == null || moving.has(before)) return [...rest, ...block];
  const i = rest.indexOf(before);
  if (i < 0) return [...rest, ...block];
  return [...rest.slice(0, i), ...block, ...rest.slice(i)];
}
function renameInOrders(orders, oldPath, newPath, isFolder) {
  const out = {};
  const oldPrefix = oldPath + "/";
  for (const [k, v] of Object.entries(orders)) {
    let key = k;
    if (isFolder) {
      if (k === oldPath) key = newPath;
      else if (k.startsWith(oldPrefix)) key = newPath + k.slice(oldPath.length);
    }
    out[key] = v;
  }
  const oldParent = parentPathOf(oldPath);
  const newParent = parentPathOf(newPath);
  const oldName = nameOf(oldPath);
  const newName = nameOf(newPath);
  const arr = out[oldParent];
  if (arr) {
    out[oldParent] = oldParent === newParent ? arr.map((n) => n === oldName ? newName : n) : arr.filter((n) => n !== oldName);
  }
  return out;
}
function renamePathKeyed(map, oldPath, newPath) {
  const out = {};
  const oldPrefix = oldPath + "/";
  for (const [k, v] of Object.entries(map)) {
    const key = k === oldPath ? newPath : k.startsWith(oldPrefix) ? newPath + k.slice(oldPath.length) : k;
    out[key] = v;
  }
  return out;
}
function removePathKeyed(map, path) {
  const out = {};
  const prefix = path + "/";
  for (const [k, v] of Object.entries(map)) {
    if (k === path || k.startsWith(prefix)) continue;
    out[k] = v;
  }
  return out;
}
function renameInHidden(hidden, oldPath, newPath) {
  const oldPrefix = oldPath + "/";
  return hidden.map(
    (h) => h === oldPath ? newPath : h.startsWith(oldPrefix) ? newPath + h.slice(oldPath.length) : h
  );
}
function removeFromHidden(hidden, path) {
  const prefix = path + "/";
  return hidden.filter((h) => h !== path && !h.startsWith(prefix));
}
function pruneHidden(hidden, exists) {
  return hidden.filter((h) => exists(h));
}
function renameSection(path, oldPath, newPath) {
  if (path === null) return null;
  if (path === oldPath) return newPath;
  if (path.startsWith(oldPath + "/")) return newPath + path.slice(oldPath.length);
  return path;
}
function dropSection(path, deleted) {
  if (path === null) return null;
  if (path === deleted || path.startsWith(deleted + "/")) return null;
  return path;
}
var TEMPLATE_META_KEYS = ["icon", "description", "filename", "folders", "destination", "unique", "ask", "pe-icon", "pe-desc"];
function stripTemplateMeta(body) {
  const m = body.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---[ \t]*(\r?\n|$)/);
  if (!m) return body;
  const rest = body.slice(m[0].length);
  let dropping = false;
  const kept = m[1].split(/\r?\n/).filter((line) => {
    const key = line.match(/^([A-Za-z0-9_-]+)[ \t]*:/);
    if (key) dropping = TEMPLATE_META_KEYS.includes(key[1]);
    else if (dropping && !/^[ \t]/.test(line)) dropping = false;
    return !dropping;
  });
  if (kept.join("").trim() === "") return rest;
  return `---
${kept.join("\n")}
---
${rest}`;
}
function removeFromOrders(orders, path, isFolder) {
  const out = {};
  const prefix = path + "/";
  for (const [k, v] of Object.entries(orders)) {
    if (isFolder && (k === path || k.startsWith(prefix))) continue;
    out[k] = v;
  }
  const parent = parentPathOf(path);
  const name = nameOf(path);
  const arr = out[parent];
  if (arr) {
    const next = arr.filter((n) => n !== name);
    if (next.length) out[parent] = next;
    else delete out[parent];
  }
  return out;
}
function drillDirection(from, to, recent) {
  if (from === to) return null;
  if (to === recent) return "push";
  if (from === recent) return "pop";
  const under = (anc, p) => anc === "/" ? p !== "/" : p.startsWith(anc + "/");
  if (under(from, to)) return "push";
  if (under(to, from)) return "pop";
  return null;
}
function pushRecent(list, path, cap) {
  const next = [path, ...list.filter((p) => p !== path)];
  return next.length > cap ? next.slice(0, cap) : next;
}
function renameInRecents(list, oldPath, newPath, isFolder) {
  return list.map((p) => {
    if (p === oldPath) return newPath;
    if (isFolder && p.startsWith(oldPath + "/")) return newPath + p.slice(oldPath.length);
    return p;
  });
}
function removeFromRecents(list, path, isFolder) {
  return list.filter((p) => p !== path && !(isFolder && p.startsWith(path + "/")));
}
function rangeSelect(order, anchor, target) {
  const a = order.indexOf(anchor);
  const b = order.indexOf(target);
  if (b < 0) return [];
  if (a < 0) return [target];
  const [lo, hi] = a <= b ? [a, b] : [b, a];
  return order.slice(lo, hi + 1);
}
var PAGE_EXTS = /* @__PURE__ */ new Set(["md", "canvas", "base"]);
function isAttachmentName(name) {
  const at = name.lastIndexOf(".");
  return !PAGE_EXTS.has(at > 0 ? name.slice(at + 1).toLowerCase() : "");
}

// src/search.ts
var MAX_CHUNK = 1600;
var STOPWORDS = new Set(
  "a an and are as at be but by for from has have i in is it its of on or that the this to was we were what when where which who will with you your".split(" ")
);
function tokenize(text) {
  return (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((t) => t.length > 1 && !STOPWORDS.has(t));
}
function chunkNote(content) {
  const lines = content.split("\n");
  let start = 0;
  if (lines[0]?.trim() === "---") {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === "---") {
        start = i + 1;
        break;
      }
    }
  }
  const out = [];
  let heading = "";
  let headingLine = null;
  let buf = [];
  const flush = () => {
    while (buf.length && !buf[0].text.trim()) buf.shift();
    while (buf.length && !buf[buf.length - 1].text.trim()) buf.pop();
    if (!buf.length) {
      if (heading && headingLine != null) out.push({ heading, text: "", anchor: headingLine });
      buf = [];
      return;
    }
    const text = buf.map((b) => b.text).join("\n");
    const offsets = [];
    let o = 0;
    for (const b of buf) {
      offsets.push(o);
      o += b.text.length + 1;
    }
    for (let i = 0; i < text.length; i += MAX_CHUNK) {
      let li = 0;
      while (li + 1 < offsets.length && offsets[li + 1] <= i) li++;
      const anchor = i === 0 && headingLine != null ? headingLine : buf[li].line;
      out.push({ heading, text: text.slice(i, i + MAX_CHUNK), anchor });
    }
    buf = [];
  };
  for (let i = start; i < lines.length; i++) {
    const h = lines[i].match(/^#{1,6}\s+(.*)/);
    if (h) {
      flush();
      heading = h[1].trim();
      headingLine = i;
    } else buf.push({ line: i, text: lines[i] });
  }
  flush();
  return out;
}
var KIND_WEIGHT = { body: 1, attach: 0.85, title: 1.6, meta: 1.1 };
var EXPANSION_WEIGHT = 0.6;
var MAX_EXPANSIONS = 64;
var TIER_EXACT_TITLE = 7;
var TIER_TITLE_PREFIX = 5;
var TIER_ALL_IN_TITLE = 3;
var TIER_PROXIMITY = 8;
var VaultIndex = class {
  constructor() {
    this.chunks = /* @__PURE__ */ new Map();
    this.postings = /* @__PURE__ */ new Map();
    this.byPath = /* @__PURE__ */ new Map();
    /** Every distinct term a document put into the postings, so removal costs
     *  O(doc terms), never O(dictionary), folder deletes stay instant. */
    this.docTerms = /* @__PURE__ */ new Map();
    this.docs = /* @__PURE__ */ new Map();
    this.nextId = 1;
    this.totalLen = 0;
    this.sortedTerms = [];
    this.termsDirty = true;
  }
  has(path) {
    return this.docs.has(path);
  }
  addDoc(doc) {
    this.removeDoc(doc.path);
    const ids = [];
    const terms = /* @__PURE__ */ new Set();
    const add = (kind, heading, text, anchor) => {
      const tokens = tokenize(`${heading} ${text}`);
      if (!tokens.length) return;
      const id = this.nextId++;
      this.chunks.set(id, { id, path: doc.path, kind, heading, text, anchor, len: tokens.length });
      this.totalLen += tokens.length;
      for (const t of tokens) {
        let post = this.postings.get(t);
        if (!post) {
          this.postings.set(t, post = /* @__PURE__ */ new Map());
          this.termsDirty = true;
        }
        post.set(id, (post.get(id) ?? 0) + 1);
        terms.add(t);
      }
      ids.push(id);
    };
    add("title", "", [doc.title, ...doc.aliases].join(" "), 0);
    const folders = doc.path.split("/").slice(0, -1).join(" ");
    add("meta", "", [...doc.tags, folders].filter(Boolean).join(" "), 0);
    for (const c of doc.chunks) add("body", c.heading, c.text, c.anchor);
    for (const c of doc.attach ?? []) add("attach", c.heading, c.text, c.anchor);
    this.byPath.set(doc.path, ids);
    this.docTerms.set(doc.path, terms);
    this.docs.set(doc.path, {
      title: doc.title,
      titleLower: doc.title.toLowerCase(),
      titleTokens: tokenize(doc.title),
      mtime: doc.mtime
    });
  }
  removeDoc(path) {
    const ids = this.byPath.get(path);
    if (!ids) return;
    for (const id of ids) {
      const c = this.chunks.get(id);
      if (!c) continue;
      this.totalLen -= c.len;
      this.chunks.delete(id);
    }
    const gone = new Set(ids);
    for (const term of this.docTerms.get(path) ?? []) {
      const post = this.postings.get(term);
      if (!post) continue;
      for (const id of gone) post.delete(id);
      if (!post.size) this.postings.delete(term);
    }
    this.byPath.delete(path);
    this.docTerms.delete(path);
    this.docs.delete(path);
  }
  ensureTerms() {
    if (!this.termsDirty) return;
    this.sortedTerms = [...this.postings.keys()].sort();
    this.termsDirty = false;
  }
  /** The typed term (if it exists) plus up to MAX_EXPANSIONS completions,
   *  highest document frequency first. Empty = this token matches nothing. */
  expand(token) {
    this.ensureTerms();
    const terms = this.sortedTerms;
    let lo = 0;
    let hi = terms.length;
    while (lo < hi) {
      const mid = lo + hi >> 1;
      if (terms[mid] < token) lo = mid + 1;
      else hi = mid;
    }
    const completions = [];
    let exact = false;
    for (let i = lo; i < terms.length && terms[i].startsWith(token); i++) {
      if (terms[i] === token) exact = true;
      else completions.push(terms[i]);
      if (completions.length >= 2e3) break;
    }
    if (completions.length > MAX_EXPANSIONS) {
      completions.sort((a, b) => (this.postings.get(b)?.size ?? 0) - (this.postings.get(a)?.size ?? 0));
      completions.length = MAX_EXPANSIONS;
    }
    return exact ? [token, ...completions] : completions;
  }
  inScope(path, scope) {
    return isUnder(path, scope);
  }
  search(query, opts = {}) {
    const limit = opts.limit ?? 50;
    const scope = opts.scope ?? "";
    const phrases = [];
    const rest = query.replace(/"([^"]*)"/g, (_, p) => {
      if (p.trim()) phrases.push(p.trim());
      return " ";
    });
    const tokens = [...new Set(tokenize(rest + " " + phrases.join(" ")))];
    if (!tokens.length && !phrases.length) return [];
    const expansions = /* @__PURE__ */ new Map();
    let candidates = null;
    for (const token of tokens) {
      const exps = this.expand(token);
      if (!exps.length) return [];
      expansions.set(token, exps);
      const docsWith = /* @__PURE__ */ new Set();
      for (const e of exps) {
        for (const id of this.postings.get(e)?.keys() ?? []) {
          const c = this.chunks.get(id);
          if (c && this.inScope(c.path, scope)) docsWith.add(c.path);
        }
      }
      if (!docsWith.size) return [];
      if (!candidates) candidates = docsWith;
      else {
        for (const p of candidates) if (!docsWith.has(p)) candidates.delete(p);
        if (!candidates.size) return [];
      }
    }
    if (!candidates) {
      candidates = /* @__PURE__ */ new Set();
      for (const p of this.docs.keys()) if (this.inScope(p, scope)) candidates.add(p);
    }
    const phraseRegexes = phrases.map((p) => {
      const words = p.toLowerCase().match(/[a-z0-9]+/g) ?? [];
      if (!words.length) return null;
      return new RegExp("\\b" + words.map((w) => escapeRegex(w)).join("[^a-z0-9]{1,5}"), "i");
    });
    const phraseChunk = /* @__PURE__ */ new Map();
    for (const re of phraseRegexes) {
      if (!re) continue;
      for (const path of [...candidates]) {
        let hit = false;
        let display = -1;
        for (const id of this.byPath.get(path) ?? []) {
          const c = this.chunks.get(id);
          if (!re.test(cleanText(c.text))) continue;
          hit = true;
          if (c.kind === "body" || c.kind === "attach") {
            display = id;
            break;
          }
        }
        if (!hit) candidates.delete(path);
        else if (display >= 0 && !phraseChunk.has(path)) phraseChunk.set(path, display);
      }
      if (!candidates.size) return [];
    }
    const proxHit = /* @__PURE__ */ new Set();
    if (tokens.length >= 2) {
      const body = tokens.map((t, i) => escapeRegex(t) + (i < tokens.length - 1 ? "\\b" : "[a-z0-9]*")).join("[^a-z0-9]{1,3}");
      const proxRe = new RegExp("\\b" + body, "i");
      for (const path of candidates) {
        for (const id of this.byPath.get(path) ?? []) {
          if (proxRe.test(cleanText(this.chunks.get(id).text))) {
            proxHit.add(path);
            break;
          }
        }
      }
    }
    const N = this.chunks.size;
    const avgdl = N ? this.totalLen / N : 1;
    const k1 = 1.5;
    const b = 0.75;
    const scores = /* @__PURE__ */ new Map();
    for (const token of tokens) {
      for (const e of expansions.get(token)) {
        const post = this.postings.get(e);
        if (!post) continue;
        const w = e === token ? 1 : EXPANSION_WEIGHT;
        const idf = Math.log(1 + (N - post.size + 0.5) / (post.size + 0.5));
        for (const [id, tf] of post) {
          const c = this.chunks.get(id);
          if (!candidates.has(c.path)) continue;
          const s = w * idf * (tf * (k1 + 1) / (tf + k1 * (1 - b + b * c.len / avgdl)));
          scores.set(id, (scores.get(id) ?? 0) + s);
        }
      }
    }
    const best = /* @__PURE__ */ new Map();
    for (const [id, raw] of scores) {
      const c = this.chunks.get(id);
      const s = raw * KIND_WEIGHT[c.kind];
      let d = best.get(c.path);
      if (!d) best.set(c.path, d = { score: 0, display: null, displayScore: -1 });
      if (s > d.score) d.score = s;
      if ((c.kind === "body" || c.kind === "attach") && s > d.displayScore && !phraseChunk.has(c.path)) {
        d.display = c;
        d.displayScore = s;
      }
    }
    for (const [path, id] of phraseChunk) {
      const c = this.chunks.get(id);
      let d = best.get(path);
      if (!d) best.set(path, d = { score: 0, display: null, displayScore: -1 });
      d.display = c;
    }
    const queryLower = query.replace(/"/g, "").trim().toLowerCase();
    const joined = tokens.join(" ");
    const ranked = [];
    for (const path of candidates) {
      const d = best.get(path);
      const doc = this.docs.get(path);
      if (!doc) continue;
      let score = d?.score ?? 1;
      const titleAll = tokens.length > 0 && tokens.every((t) => doc.titleTokens.some((tt) => tt === t || tt.startsWith(t)));
      if (tokens.length) {
        if (doc.titleTokens.join(" ") === joined) score += TIER_EXACT_TITLE;
        else if (queryLower && doc.titleLower.startsWith(queryLower)) score += TIER_TITLE_PREFIX;
        else if (titleAll) score += TIER_ALL_IN_TITLE;
      }
      if (proxHit.has(path)) score += TIER_PROXIMITY;
      score += opts.docBoost?.(path) ?? 0;
      ranked.push({ path, score, display: d?.display ?? null, titleAll });
    }
    ranked.sort((a, b2) => {
      if (b2.score !== a.score) return b2.score - a.score;
      const ma = this.docs.get(a.path)?.mtime ?? 0;
      const mb = this.docs.get(b2.path)?.mtime ?? 0;
      if (mb !== ma) return mb - ma;
      return a.path < b2.path ? -1 : 1;
    });
    const surfaces = [...new Set([...expansions.values()].flat())].sort((a, b2) => b2.length - a.length);
    const finder = buildFinder(surfaces, phraseRegexes);
    return this.assembleHits(ranked.slice(0, limit), surfaces, phraseRegexes, finder);
  }
  assembleHits(ranked, surfaces, phraseRegexes, finder) {
    const out = [];
    for (const r of ranked) {
      const doc = this.docs.get(r.path);
      const c = r.display;
      out.push({
        path: r.path,
        title: doc.title,
        score: r.score,
        kind: c?.kind ?? "title",
        heading: c?.heading ?? "",
        anchor: c?.anchor ?? 0,
        snippet: c ? makeSnippet(c.text, surfaces, phraseRegexes) : null,
        titleRanges: findRanges(doc.title, finder),
        titleAll: r.titleAll ?? false,
        terms: surfaces
      });
    }
    return out;
  }
  /**
   * OR-mode BM25 over content chunks with their FULL text, for RAG consumers
   * (Power Capture's Ask-your-vault). No AND gate, no prefix expansion, no
   * title tiers, the caller brings its own expanded synonym terms, where
   * requiring every one would guarantee zero results.
   */
  retrieveChunks(terms, k, scope = "") {
    const N = this.chunks.size;
    if (!N) return [];
    const avgdl = this.totalLen / N;
    const k1 = 1.5;
    const b = 0.75;
    const scores = /* @__PURE__ */ new Map();
    const byTitle = /* @__PURE__ */ new Map();
    for (const term of new Set(terms)) {
      const post = this.postings.get(term);
      if (!post) continue;
      const idf = Math.log(1 + (N - post.size + 0.5) / (post.size + 0.5));
      for (const [id, tf] of post) {
        const c = this.chunks.get(id);
        if (!isUnder(c.path, scope)) continue;
        const s = idf * (tf * (k1 + 1) / (tf + k1 * (1 - b + b * c.len / avgdl)));
        if (c.kind === "title" || c.kind === "meta") {
          byTitle.set(c.path, (byTitle.get(c.path) ?? 0) + s);
          continue;
        }
        scores.set(id, (scores.get(id) ?? 0) + s);
      }
    }
    const TITLE_SPREAD = 3;
    for (const [path, titleScore] of byTitle) {
      const body = (this.byPath.get(path) ?? []).filter((id) => {
        const c = this.chunks.get(id);
        return !!c && c.kind !== "title" && c.kind !== "meta";
      });
      if (!body.length) continue;
      const scored = body.filter((id) => scores.has(id)).sort((x, y) => (scores.get(y) ?? 0) - (scores.get(x) ?? 0));
      const targets = (scored.length ? scored : body).slice(0, TITLE_SPREAD);
      for (const id of targets) scores.set(id, (scores.get(id) ?? 0) + titleScore);
    }
    return [...scores.entries()].sort((x, y) => y[1] - x[1]).slice(0, k).map(([id, score]) => {
      const c = this.chunks.get(id);
      return { path: c.path, heading: c.heading, text: c.text, score };
    });
  }
};
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function editorMatchRanges(text, terms, cap = 2e3) {
  const uniq = [...new Set(terms.map((t) => t.trim().toLowerCase()).filter(Boolean))];
  if (!uniq.length) return [];
  const src = uniq.sort((a, b) => b.length - a.length).map((t) => "\\b" + escapeRegex(t) + "\\w*");
  const re = new RegExp("(" + src.join(")|(") + ")", "gi");
  const out = [];
  let m;
  while (m = re.exec(text)) {
    if (m[0].length) out.push([m.index, m.index + m[0].length]);
    else re.lastIndex++;
    if (out.length >= cap) break;
  }
  return out;
}
function cleanText(text) {
  return text.replace(/[#*_`>|]|\[\[|\]\]|!\[|\]\(([^)]*)\)/g, " ").replace(/\s+/g, " ").trim();
}
function buildFinder(surfaces, phraseRegexes) {
  const sources = [
    ...phraseRegexes.filter((r) => !!r).map((r) => r.source),
    ...surfaces.map((s) => "\\b" + escapeRegex(s))
  ];
  return sources.length ? new RegExp("(" + sources.join(")|(") + ")", "gi") : null;
}
function findRanges(text, finder) {
  if (!finder) return [];
  const ranges = [];
  finder.lastIndex = 0;
  let m;
  while (m = finder.exec(text)) {
    if (m[0].length) ranges.push([m.index, m.index + m[0].length]);
    else finder.lastIndex++;
  }
  return ranges;
}
function makeSnippet(text, surfaces, phraseRegexes = []) {
  const clean = cleanText(text);
  if (!clean) return null;
  const finder = buildFinder(surfaces, phraseRegexes);
  if (!finder) return { text: clean.slice(0, 170), ranges: [] };
  const first = finder.exec(clean);
  if (!first) return { text: clean.slice(0, 170), ranges: [] };
  const from = Math.max(0, first.index - 40);
  const start = from === 0 ? 0 : clean.indexOf(" ", from) + 1 || from;
  let excerpt = clean.slice(start, start + 170);
  if (start > 0) excerpt = "\u2026" + excerpt;
  if (start + 170 < clean.length) excerpt = excerpt + "\u2026";
  return { text: excerpt, ranges: findRanges(excerpt, finder) };
}
function persistOverdue(now, dirtySince, maxAgeMs) {
  if (dirtySince == null) return false;
  return now - dirtySince >= maxAgeMs;
}

// src/template.ts
var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var DATE_TOKENS = /\[([^\]]*)\]|YYYY|YY|MMMM|MMM|MM|M|dddd|ddd|DD|D|HH|hh|mm|ss|A|a/g;
var pad = (n) => n < 10 ? "0" + n : String(n);
function formatDate(d, fmt) {
  return fmt.replace(DATE_TOKENS, (tok, literal) => {
    if (literal !== void 0) return literal;
    const h12 = d.getHours() % 12 || 12;
    switch (tok) {
      case "YYYY":
        return String(d.getFullYear());
      case "YY":
        return pad(d.getFullYear() % 100);
      case "MMMM":
        return MONTHS[d.getMonth()];
      case "MMM":
        return MONTHS[d.getMonth()].slice(0, 3);
      case "MM":
        return pad(d.getMonth() + 1);
      case "M":
        return String(d.getMonth() + 1);
      case "dddd":
        return DAYS[d.getDay()];
      case "ddd":
        return DAYS[d.getDay()].slice(0, 3);
      case "DD":
        return pad(d.getDate());
      case "D":
        return String(d.getDate());
      case "HH":
        return pad(d.getHours());
      case "hh":
        return pad(h12);
      case "mm":
        return pad(d.getMinutes());
      case "ss":
        return pad(d.getSeconds());
      case "A":
        return d.getHours() < 12 ? "AM" : "PM";
      case "a":
        return d.getHours() < 12 ? "am" : "pm";
      default:
        return tok;
    }
  });
}
var MARK_START = "";
var MARK_END = "";
var MARK_CURSOR = "";
var TOKEN = /\{\{\s*([a-zA-Z]+)\s*([+-]\s*\d+\s*[dwmy])?\s*(?::([^}]*))?\}\}/g;
function shiftDate(d, offset) {
  const m = offset?.replace(/\s+/g, "").match(/^([+-])(\d+)([dwmy])$/);
  if (!m) return d;
  const n = (m[1] === "-" ? -1 : 1) * parseInt(m[2], 10);
  const out = new Date(d.getTime());
  if (m[3] === "d") out.setDate(out.getDate() + n);
  else if (m[3] === "w") out.setDate(out.getDate() + n * 7);
  else {
    const day = out.getDate();
    out.setDate(1);
    if (m[3] === "m") out.setMonth(out.getMonth() + n);
    else out.setFullYear(out.getFullYear() + n);
    const last = new Date(out.getFullYear(), out.getMonth() + 1, 0).getDate();
    out.setDate(Math.min(day, last));
  }
  return out;
}
function renderTokens(pattern, ctx, markName = false) {
  return pattern.replace(TOKEN, (whole, rawName, offset, arg) => {
    const name = rawName.toLowerCase();
    const a = arg?.trim();
    switch (name) {
      case "date":
        return formatDate(shiftDate(ctx.now, offset), a || "YYYY-MM-DD");
      case "time":
        return formatDate(shiftDate(ctx.now, offset), a || "HH:mm");
      case "folder":
        return ctx.folder;
      case "parent":
        return ctx.parent;
      case "vault":
        return ctx.vault;
      // The bit you're meant to type over. Bare {{name}} leaves an empty
      // slot, which lands the cursor there with nothing to delete first.
      case "name":
        return markName ? MARK_START + (a ?? "") + MARK_END : a ?? "";
      // Where to leave the cursor. Marked while rendering, located and
      // removed by renderBodyAt; renderBody just drops it.
      case "cursor":
        return markName ? MARK_CURSOR : "";
      default:
        return whole;
    }
  });
}
function sanitizeFilename(name) {
  return name.replace(/:/g, ".").replace(/[/\\]/g, "-").replace(/[*?"<>|#^[\]]/g, "").replace(/\s+/g, " ").replace(/^[\s.]+|[\s.]+$/g, "").slice(0, 120).trim();
}
function renderName(pattern, ctx) {
  const marked = sanitizeFilename(renderTokens(pattern, ctx, true));
  const start = marked.indexOf(MARK_START);
  const end = start < 0 ? -1 : marked.indexOf(MARK_END, start);
  const raw = strip(marked);
  const lead = raw.length - raw.replace(/^[\s.]+/, "").length;
  const name = raw.replace(/^[\s.]+|[\s.]+$/g, "");
  if (!name) return { name: "Untitled", select: null };
  if (start < 0 || end < 0) return { name, select: null };
  const from = clamp(start - lead, 0, name.length);
  return { name, select: { start: from, end: clamp(end - 1 - lead, from, name.length) } };
}
var strip = (s) => s.split(MARK_START).join("").split(MARK_END).join("");
var clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);
function renderBody(body, ctx) {
  return renderTokens(body, ctx);
}
function renderBodyAt(body, ctx) {
  const cleaned = strip(renderTokens(body, ctx, true));
  const at = cleaned.indexOf(MARK_CURSOR);
  if (at < 0) return { body: cleaned, cursor: null };
  return { body: cleaned.split(MARK_CURSOR).join(""), cursor: at };
}
function uniqueName(base, exists, sep = "-", start = 2) {
  if (!exists(base)) return base;
  for (let n = start; ; n++) {
    const candidate = `${base}${sep}${n}`;
    if (!exists(candidate)) return candidate;
  }
}
var ASK = /\{\{\s*ask\s*:([^}]*)\}\}/gi;
function askFields(...texts) {
  const out = [];
  for (const text of texts) {
    for (const m of text.matchAll(ASK)) {
      const [q, ...rest] = m[1].split("=");
      const question = q.trim();
      if (!question || out.some((f) => f.question === question)) continue;
      out.push({ question, fallback: rest.join("=").trim() });
    }
  }
  return out;
}
function applyAnswers(text, answers) {
  return text.replace(ASK, (_w, body) => {
    const [q, ...rest] = body.split("=");
    const question = q.trim();
    const given = (answers[question] ?? "").trim();
    return given || rest.join("=").trim();
  });
}
function dateKeyIn(name) {
  const m = name.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const mo = +m[2];
  const d = +m[3];
  return mo >= 1 && mo <= 12 && d >= 1 && d <= 31 ? `${m[1]}-${m[2]}-${m[3]}` : null;
}
function uniqueMatch(mode, existing, name) {
  if (mode == null || mode === false || mode === "" || mode === "false") return null;
  const byDay = typeof mode === "string" && /^(day|date|daily)$/i.test(mode.trim());
  if (!byDay) return existing.includes(name) ? name : null;
  const key = dateKeyIn(name);
  if (!key) return existing.includes(name) ? name : null;
  return existing.find((n) => dateKeyIn(n) === key) ?? null;
}
function previousDatedName(existing, key) {
  let best = null;
  for (const n of existing) {
    const k = dateKeyIn(n);
    if (!k || k >= key) continue;
    if (!best || k > best.key || k === best.key && n < best.name) best = { name: n, key: k };
  }
  return best?.name ?? null;
}
function unfinishedTasks(markdown) {
  const out = [];
  for (const line of markdown.split(/\r?\n/)) {
    const m = line.match(/^([ \t]*)[-*+][ \t]+\[([ xX])\][ \t]*(.*)$/);
    if (m && m[2] === " " && m[3].trim()) out.push(`${m[1]}- [ ] ${m[3].trim()}`);
  }
  return out;
}
function folderScopes(value) {
  const raw = typeof value === "string" ? value.split(",") : Array.isArray(value) ? value : [];
  const out = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const p = item.trim().replace(/^\.?\//, "").replace(/\/+$/, "");
    if (p && !out.includes(p)) out.push(p);
  }
  return out;
}
function templateRank(scopes, folderPath) {
  let best = 0;
  for (const s of scopes) {
    if (s === folderPath) return 2;
    if (isUnder(folderPath, s)) best = Math.max(best, 1);
  }
  return best;
}

// src/main.ts
var pluginNoticesEnabled = () => true;
var Notice = class extends import_obsidian.Notice {
  constructor(message, duration) {
    super(message, duration);
    if (!pluginNoticesEnabled()) this.hide();
  }
};
var setMatchHl = import_state.StateEffect.define();
var clearMatchHl = import_state.StateEffect.define();
var matchHlField = import_state.StateField.define({
  create: () => import_view.Decoration.none,
  update(deco, tr) {
    deco = deco.map(tr.changes);
    let set = false;
    for (const e of tr.effects) {
      if (e.is(setMatchHl)) {
        const marks = e.value.filter(([s, en]) => s < en && en <= tr.newDoc.length).map(([s, en]) => import_view.Decoration.mark({ class: "pe-jump-mark" }).range(s, en));
        deco = import_view.Decoration.set(marks, true);
        set = true;
      } else if (e.is(clearMatchHl)) {
        deco = import_view.Decoration.none;
        set = true;
      }
    }
    if (tr.docChanged && !set) deco = import_view.Decoration.none;
    return deco;
  },
  provide: (f) => import_view.EditorView.decorations.from(f)
});
var RECENT = ":recent:";
var RECENT_CAP = 30;
var DEVICE_STORE = "pe-device";
var SECTION_COLORS = [
  ["Blue", "#0063B1"],
  ["Blue Mist", "#2D7D9A"],
  ["Cyan", "#00B7C3"],
  ["Teal", "#038387"],
  ["Green", "#107C10"],
  ["Apple", "#498205"],
  ["Lemon Lime", "#8CBD18"],
  ["Yellow", "#FFB900"],
  ["Orange", "#F7630C"],
  ["Red Chalk", "#DA3B01"],
  ["Red", "#E81123"],
  ["Magenta", "#E3008C"],
  ["Purple", "#744DA9"],
  ["Purple Mist", "#8E8CD8"],
  ["Tan", "#986F0B"],
  ["Silver", "#7A7574"]
];
var PALETTE = SECTION_COLORS.filter(([n]) => n !== "Silver" && n !== "Tan").map(([, hex]) => hex);
var DEFAULT_TEMPLATE_SEED = '---\nicon: \u{1F4C4}\ndescription: Describe this template.\nfilename: "{{date}} {{name:New page}}"\nfolders:\n---\n';
var DEFAULT_SETTINGS = {
  orders: {},
  unranked: "bottom",
  dragEnabled: true,
  sectionsLayout: false,
  desktopPane: "tree",
  sectionWidth: 240,
  lastSection: null,
  hidden: [],
  hideAttachments: false,
  collapsedGroups: [],
  expandedNbs: [],
  colors: {},
  pins: {},
  folderSort: {},
  icons: {},
  autoNotebookColors: true,
  phoneWideNav: true,
  alwaysEdit: false,
  rememberSettingsWindow: true,
  actionsInExplorerBar: false,
  explorerBarHidden: [],
  explorerBarCommands: [],
  explorerBarIcons: {},
  explorerBarOrder: [],
  phoneTopActions: false,
  phoneDrawerMenu: false,
  drawerMenuHidden: [],
  drawerMenuCommands: [],
  folderNoteGroups: true,
  recentPages: [],
  showRecent: true,
  hidePhoneActions: true,
  searchEnabled: true,
  searchPdfs: true,
  searchImages: true,
  searchExclude: "",
  searchScope: "vault",
  searchCompact: true,
  pageTemplates: {},
  folderTemplates: {},
  templatesFolder: "",
  filenamePattern: "",
  askForAnswers: true,
  templateSeed: "",
  launcherFavorites: [],
  launcherOrder: {},
  welcomed: false,
  showNotifications: true
};
var IMAGE_EXTS = /* @__PURE__ */ new Set(["png", "jpg", "jpeg", "webp", "bmp", "gif"]);
var OCR_PROVIDERS = ["powerextract", "text-extractor"];
var MAX_PERSIST_AGE = 3e4;
var IDLE_WRITE_DEADLINE = 2e3;
var ICON_IMAGE_EXTS = /* @__PURE__ */ new Set(["png", "jpg", "jpeg", "webp", "gif", "svg"]);
var EMOJI_PICKS = [
  "\u{1F4C4}",
  "\u{1F4DD}",
  "\u{1F5D2}\uFE0F",
  "\u{1F4CB}",
  "\u{1F4CC}",
  "\u{1F4CE}",
  "\u{1F516}",
  "\u{1F3F7}\uFE0F",
  "\u{1F4C1}",
  "\u{1F5C2}\uFE0F",
  "\u{1F5C3}\uFE0F",
  "\u{1F4DA}",
  "\u{1F4D6}",
  "\u{1F4D3}",
  "\u2705",
  "\u2611\uFE0F",
  "\u{1F3AF}",
  "\u{1F4C5}",
  "\u{1F5D3}\uFE0F",
  "\u23F0",
  "\u{1F514}",
  "\u{1F9E9}",
  "\u{1F6E0}\uFE0F",
  "\u{1F527}",
  "\u2699\uFE0F",
  "\u{1F9EA}",
  "\u{1F41B}",
  "\u{1F680}",
  "\u{1F4A1}",
  "\u{1F9E0}",
  "\u{1F525}",
  "\u26A1",
  "\u2B50",
  "\u2764\uFE0F",
  "\u{1F3A8}",
  "\u{1F5BC}\uFE0F",
  "\u{1F3AC}",
  "\u{1F3B5}",
  "\u{1F4CA}",
  "\u{1F4C8}",
  "\u{1F4C9}",
  "\u{1F4B0}",
  "\u{1F4BB}",
  "\u{1F5A5}\uFE0F",
  "\u{1F4F1}",
  "\u2328\uFE0F",
  "\u{1F310}",
  "\u2601\uFE0F",
  "\u{1F512}",
  "\u{1F511}",
  "\u{1F465}",
  "\u{1F91D}",
  "\u{1F3E2}",
  "\u{1F4E3}",
  "\u{1F4AC}",
  "\u{1F4E6}",
  "\u{1F69A}",
  "\u{1F9FE}",
  "\u{1F3C6}",
  "\u{1F331}",
  "\u{1F37D}\uFE0F",
  "\u2708\uFE0F",
  "\u{1F3E0}",
  "\u{1F4CD}"
];
var SECTION_EMOJI = ["\u{1F4C1}", "\u{1F4C5}", "\u2705", "\u2B50", "\u{1F4A1}", "\u{1F4CA}", "\u{1F9EA}", "\u{1F527}", "\u{1F680}", "\u{1F9E0}", "\u{1F4BC}", "\u{1F3E0}"];
var DRAWER_NATIVE_ITEMS = [
  { type: "file-explorer", label: "Files" },
  { type: "search", label: "Search" },
  { type: "tag", label: "Tags" },
  { type: "all-properties", label: "All properties" },
  { type: "bookmarks", label: "Bookmarks" }
];
var shortCommandName = (name) => name.replace(/^[^:]+:\s*/, "");
var RESTORED_NOTICE = "Power Explorer: saved settings are back (the settings file can be read again).";
function drawNotebook(host) {
  host.empty();
  const svg = host.createSvg("svg", {
    attr: { viewBox: "0 0 16 16", width: "15", height: "15", "aria-hidden": "true" }
  });
  svg.createSvg("rect", {
    attr: { x: "2.2", y: "1.5", width: "11.6", height: "13", rx: "2", fill: "currentColor" }
  });
  svg.createSvg("rect", {
    attr: { x: "5.2", y: "1.5", width: "1.2", height: "13", fill: "var(--background-primary)", opacity: "0.75" }
  });
}
var PowerExplorerPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.settings = DEFAULT_SETTINGS;
    /** Per-folder name→rank maps, rebuilt lazily after any order change. */
    this.rankCache = /* @__PURE__ */ new Map();
    this.patchedViews = /* @__PURE__ */ new WeakSet();
    this.saveTimer = null;
    /** A write of our settings is in flight. Pairs with saveTimer to cover the
     *  whole change-to-disk span; see persistSettings(). */
    this.saving = false;
    /** The boot read of data.json came back empty while the file exists (a sync
     *  replacing it mid-launch). Memory is running on defaults, so writing is
     *  forbidden until a read succeeds and restores it; see persistSettings()
     *  and adoptExternalData(). */
    this.loadFailed = false;
    /** Our ribbon icons, kept so they can step aside for the explorer toolbar. */
    this.ribbonEls = [];
    /** The navigation-bar actions we borrow on phones, and the row we took them
     *  from, so they can always be put back exactly as they were. */
    this.navActions = [];
    this.navHome = null;
    /** Where the drawer's tab switcher lives when we have not moved it. */
    this.tabOptsHome = null;
    /** The tap-away-to-close handler is wired once, not once per layout pass. */
    this.drawerOutsideWired = false;
    /** The settings as they last stood on disk, read or written by us. Whatever
     *  differs from this in memory is OUR change, and only those keys may
     *  overwrite a synced data.json; see persistSettings(). */
    this.baseline = DEFAULT_SETTINGS;
    this.drag = null;
    /** Sections layout state: the decorated explorer container and pages pane. */
    this.sectionsApplied = null;
    this.pagesEl = null;
    this.recentRowEl = null;
    this.sectionPath = null;
    /** How the sections chrome is currently built: the two-pane split with the
     *  full folder tree ("tree"), the split with a roots-only notebooks pane
     *  ("notebooks"), or the phone drill navigator ("drill"). Null while off. */
    this.paneMode = null;
    /** Whether the applied drill got phone (touch-sized) chrome; desktop drill
     *  keeps compact rows. Tracked so a mode-preserving resize can restyle. */
    this.touchApplied = false;
    this.notebooksEl = null;
    /** Two-level layout: which notebooks show their sections. Mirrors
     *  settings.expandedNbs, which outlives the session. */
    this.expandedNbs = /* @__PURE__ */ new Set();
    this.drillAnim = null;
    /** The current render's chunk-loader; one persistent scroll listener calls it. */
    this.pagesScrollHandler = null;
    /** Hidden folders: filtered out inside the sort hook; showHidden is a
     *  session-only peek so hiding can't be silently left off. */
    this.hiddenSet = /* @__PURE__ */ new Set();
    this.showHidden = false;
    this.origSort = /* @__PURE__ */ new WeakMap();
    this.refreshTimer = null;
    this.settingsRepaintTimer = null;
    /** One generated stylesheet paints every section color: zero per-item work. */
    this.colorSheet = null;
    /** Pages pane interaction state; reset when the section changes. */
    this.pagesFilter = "";
    this.filterOpen = false;
    this.selectedPage = null;
    /** Multi-select in the pages pane (Ctrl/Cmd+click toggles, Shift+click
     *  ranges); cleared on a plain click or a section change. */
    this.selectedPages = /* @__PURE__ */ new Set();
    this.selectAnchor = null;
    /** Pages cut and waiting for somewhere to go: page paths, in list order.
     *  Session-only, a pending cut is a gesture in progress, not a setting. */
    this.cutPaths = [];
    /** Page groups (folder-note subfolders) start expanded; the ones you shut
     *  live in settings.collapsedGroups and survive a reload. */
    this.collapsedGroups = /* @__PURE__ */ new Set();
    /** Paths we are renaming ourselves to keep a pair together, so the event our
     *  own rename fires can never start another one. */
    this.pairing = /* @__PURE__ */ new Set();
    /* -------- a command per template -------- */
    /** Command ids currently registered for templates, so they can be retired
     *  when their note goes away. */
    this.tplCommandIds = /* @__PURE__ */ new Set();
    this.tplCommandTimer = null;
    /** Armed by the settings tab while it exists. Called wherever a change out
     *  of the tab's reach alters which rows it would draw: 1.13 renders a
     *  reopened tab from cached definitions, so without this a folder hidden
     *  from the tree, or a toolbar that only just appeared, would still be
     *  missing the next time settings were opened. */
    this.refreshSettingsTab = null;
  }
  /**
   * Write the expansion state back to settings.
   *
   * Which groups are shut and which notebooks are open is a small thing to get
   * wrong and an annoying one to live with: reopen the vault and a tree you had
   * arranged to show one branch is showing all of them again, every time. It
   * rides the normal debounced save, and mergeForSave keeps a second device
   * from posting its own view over yours.
   */
  saveExpansion() {
    this.settings.collapsedGroups = [...this.collapsedGroups];
    this.settings.expandedNbs = [...this.expandedNbs];
    this.queueSave();
  }
  async onload() {
    const raw = await this.readDisk();
    if (!raw && await this.dataFileOnDisk()) {
      this.loadFailed = true;
      for (const wait of [800, 2500, 8e3]) {
        const t = window.setTimeout(() => void this.adoptExternalData(), wait);
        this.register(() => window.clearTimeout(t));
      }
      new Notice(
        "Power Explorer: the settings file could not be read at startup (likely mid-sync). Running on temporary defaults; your saved settings are protected and will return automatically.",
        1e4
      );
    }
    this.adoptSettings(this.withDevice(Object.assign({}, DEFAULT_SETTINGS, raw)));
    pluginNoticesEnabled = () => this.settings.showNotifications;
    this.baseline = structuredClone(this.settings);
    if (raw && raw.desktopPane === void 0) {
      this.settings.desktopPane = raw.drillOnDesktop ? "drill" : raw.notebooksMode ? "notebooks" : "tree";
    }
    delete this.settings.notebooksMode;
    delete this.settings.drillOnDesktop;
    this.hiddenSet = new Set(this.settings.hidden);
    this.collapsedGroups = new Set(this.settings.collapsedGroups);
    this.expandedNbs = new Set(this.settings.expandedNbs);
    this.applyColorStyles();
    this.registerEditorExtension([matchHlField]);
    document.body.toggleClass("pe-hide-phone-actions", this.settings.hidePhoneActions);
    this.register(() => document.body.removeClass("pe-hide-phone-actions"));
    document.body.toggleClass("pe-wide-nav", this.settings.phoneWideNav);
    this.register(() => document.body.removeClass("pe-wide-nav"));
    document.body.toggleClass("pe-always-edit", this.settings.alwaysEdit);
    this.register(() => document.body.removeClass("pe-always-edit"));
    this.applySettingsWindowMemory();
    this.register(() => {
      const setting = this.app.setting;
      if (setting) setting.popoutStorageKey = null;
    });
    this.register(() => document.body.removeClass("pe-own-new-folder"));
    this.register(() => document.querySelectorAll(".pe-new-folder-btn").forEach((n) => n.remove()));
    this.registerEvent(this.app.workspace.on("file-open", () => this.enforceEditMode()));
    this.registerEvent(this.app.workspace.on("file-open", () => this.autoReveal()));
    this.registerEvent(this.app.workspace.on("layout-change", () => this.enforceEditMode()));
    this.registerEvent(this.app.workspace.on("layout-change", () => this.applyPhoneTopActions()));
    this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.applyPhoneTopActions()));
    this.registerEvent(this.app.workspace.on("layout-change", () => this.applyPhoneDrawerMenu()));
    this.registerEvent(this.app.workspace.on("layout-change", () => this.applyDrawerMenuItems()));
    this.registerEvent(this.app.workspace.on("layout-change", () => this.refreshSettingsTab?.()));
    this.wireDrawerMenuTapSync();
    this.app.workspace.onLayoutReady(() => {
      this.applyPhoneTopActions();
      this.applyPhoneDrawerMenu();
      this.applyDrawerMenuItems();
    });
    this.register(() => this.restoreNavbar());
    this.register(() => this.restoreDrawerMenu());
    this.register(() => this.clearDrawerMenuItems());
    this.search = new SearchService(this);
    this.app.workspace.onLayoutReady(() => {
      this.syncTemplateCommands();
      this.register(() => {
        if (this.tplCommandTimer != null) window.clearTimeout(this.tplCommandTimer);
      });
      this.patchExplorers();
      this.applySections();
      this.warnConflicts();
      this.welcomeOnce();
      void this.search.start();
      this.registerEvent(
        this.app.vault.on("create", (f) => {
          if (!(f instanceof import_obsidian.TFile)) return;
          if (IMAGE_EXTS.has(f.extension.toLowerCase())) void this.search.ocrImage(f);
          else void this.search.indexFile(f);
        })
      );
      this.registerEvent(this.app.metadataCache.on("changed", (f) => void this.search.indexFile(f)));
      this.registerEvent(
        this.app.vault.on("modify", (f) => {
          if (!(f instanceof import_obsidian.TFile)) return;
          if (f.extension === "pdf") void this.search.indexFile(f);
          else if (IMAGE_EXTS.has(f.extension.toLowerCase())) void this.search.ocrImage(f);
        })
      );
    });
    this.registerEvent(
      this.app.workspace.on("layout-change", () => {
        this.patchExplorers();
        this.applySections();
      })
    );
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => {
        this.patchExplorers();
        this.applySections();
      })
    );
    this.registerEvent(this.app.workspace.on("resize", () => this.applySections()));
    this.registerEvent(
      this.app.vault.on("rename", (f, oldPath) => {
        const isFolder = f instanceof import_obsidian.TFolder;
        const touched = this.ordersTouched(oldPath, isFolder, f.path);
        this.settings.orders = renameInOrders(this.settings.orders, oldPath, f.path, isFolder);
        this.settings.pins = renameInOrders(this.settings.pins, oldPath, f.path, isFolder);
        this.settings.recentPages = renameInRecents(this.settings.recentPages, oldPath, f.path, isFolder);
        if (isFolder) {
          this.settings.hidden = renameInHidden(this.settings.hidden, oldPath, f.path);
          this.hiddenSet = new Set(this.settings.hidden);
          this.collapsedGroups = new Set(renameInHidden([...this.collapsedGroups], oldPath, f.path));
          this.expandedNbs = new Set(renameInHidden([...this.expandedNbs], oldPath, f.path));
          this.settings.collapsedGroups = [...this.collapsedGroups];
          this.settings.expandedNbs = [...this.expandedNbs];
          this.settings.colors = renamePathKeyed(this.settings.colors, oldPath, f.path);
          this.settings.icons = renamePathKeyed(this.settings.icons, oldPath, f.path);
          this.settings.folderSort = renamePathKeyed(this.settings.folderSort, oldPath, f.path);
          this.settings.pageTemplates = renamePathKeyed(this.settings.pageTemplates, oldPath, f.path);
          this.settings.folderTemplates = renamePathKeyed(this.settings.folderTemplates, oldPath, f.path);
          this.settings.lastSection = renameSection(this.settings.lastSection, oldPath, f.path);
          this.sectionPath = renameSection(this.sectionPath, oldPath, f.path);
          this.applyColorStyles();
        }
        for (const k of Object.keys(this.settings.pageTemplates)) {
          if (this.settings.pageTemplates[k] === oldPath) this.settings.pageTemplates[k] = f.path;
        }
        for (const k of Object.keys(this.settings.folderTemplates)) {
          this.settings.folderTemplates[k] = this.settings.folderTemplates[k].map((p) => p === oldPath ? f.path : p);
        }
        if (touched) this.rankCache.clear();
        this.templatesChanged(oldPath, f.path);
        this.queueSave();
        this.search.renameFile(f, oldPath);
        this.selectionFollows(oldPath, f.path);
        void this.keepPairTogether(f, oldPath);
        if (this.pagesEl && this.sectionTouched(oldPath, f.path)) this.queuePagesRefresh();
      })
    );
    this.registerEvent(
      this.app.vault.on("delete", (f) => {
        const isFolder = f instanceof import_obsidian.TFolder;
        const touched = this.ordersTouched(f.path, isFolder);
        this.settings.orders = removeFromOrders(this.settings.orders, f.path, isFolder);
        this.settings.pins = removeFromOrders(this.settings.pins, f.path, isFolder);
        this.settings.recentPages = removeFromRecents(this.settings.recentPages, f.path, isFolder);
        if (isFolder) {
          this.settings.hidden = removeFromHidden(this.settings.hidden, f.path);
          this.hiddenSet = new Set(this.settings.hidden);
          this.collapsedGroups = new Set(removeFromHidden([...this.collapsedGroups], f.path));
          this.expandedNbs = new Set(removeFromHidden([...this.expandedNbs], f.path));
          this.settings.collapsedGroups = [...this.collapsedGroups];
          this.settings.expandedNbs = [...this.expandedNbs];
          this.settings.colors = removePathKeyed(this.settings.colors, f.path);
          this.settings.icons = removePathKeyed(this.settings.icons, f.path);
          this.settings.folderSort = removePathKeyed(this.settings.folderSort, f.path);
          this.settings.pageTemplates = removePathKeyed(this.settings.pageTemplates, f.path);
          this.settings.folderTemplates = removePathKeyed(this.settings.folderTemplates, f.path);
          this.settings.lastSection = dropSection(this.settings.lastSection, f.path);
          this.sectionPath = dropSection(this.sectionPath, f.path);
          this.applyColorStyles();
        }
        for (const k of Object.keys(this.settings.pageTemplates)) {
          if (this.settings.pageTemplates[k] === f.path) delete this.settings.pageTemplates[k];
        }
        for (const k of Object.keys(this.settings.folderTemplates)) {
          const left = this.settings.folderTemplates[k].filter((p) => p !== f.path);
          if (left.length) this.settings.folderTemplates[k] = left;
          else delete this.settings.folderTemplates[k];
        }
        if (touched) this.rankCache.clear();
        this.templatesChanged(f.path);
        this.queueSave();
        this.selectionFollows(f.path, null);
        this.search.removePath(f.path, isFolder);
        if (this.pagesEl && this.sectionTouched(f.path)) this.queuePagesRefresh();
      })
    );
    this.registerEvent(
      this.app.vault.on("create", (f) => {
        if (this.pagesEl && this.sectionTouched(f.path)) this.queuePagesRefresh();
        this.templatesChanged(f.path);
      })
    );
    this.registerDomEvent(document, "click", (e) => {
      if (!this.pagesEl) return;
      const title = e.target?.closest?.(".nav-folder-title[data-path]");
      if (title && title.closest(".nav-files-container")) this.setSection(title.getAttribute("data-path"));
    });
    this.registerEvent(
      this.app.workspace.on("file-open", (f) => {
        if (f && f.extension === "md") {
          const next = pushRecent(this.settings.recentPages, f.path, RECENT_CAP);
          if (next.length !== this.settings.recentPages.length || next[0] !== this.settings.recentPages[0]) {
            this.settings.recentPages = next;
            this.queueSave();
          }
        }
        if (!this.pagesEl || !f) return;
        if (this.isRecent()) {
          this.renderPages();
          return;
        }
        const row = this.pagesEl.querySelector(`.pe-page[data-path="${CSS.escape(f.path)}"]`);
        if (row) {
          this.pagesEl.querySelectorAll(".pe-page.is-active").forEach((el) => el.removeClass("is-active"));
          row.addClass("is-active");
          return;
        }
        const sec = this.sectionShowing(f);
        if (sec.path === this.sectionFolder().path) {
          this.renderPages();
          return;
        }
        this.setSection(sec.path);
      })
    );
    this.registerDomEvent(document, "pointerdown", (e) => this.onPointerDown(e));
    this.registerDomEvent(document, "pointermove", (e) => this.onPointerMove(e));
    this.registerDomEvent(document, "pointerup", (e) => this.onPointerUp(e));
    this.registerDomEvent(document, "keydown", (e) => {
      if (e.key === "Escape" && this.drag) this.cancelDrag();
    });
    this.registerDomEvent(document, "pointercancel", () => {
      if (this.drag) this.cancelDrag();
    });
    this.registerDomEvent(document, "dragstart", (e) => {
      if (this.drag) e.preventDefault();
    }, { capture: true });
    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        const parent = file.parent;
        if (parent) {
          const pinned = this.isPinned(parent.path, file.name);
          menu.addItem(
            (item) => item.setTitle(pinned ? "Unpin from top" : "Pin to top").setIcon(pinned ? "pin-off" : "pin").onClick(() => this.togglePin(parent, file.name))
          );
        }
        if (!(file instanceof import_obsidian.TFolder)) return;
        if (this.cutPaths.length) {
          menu.addItem(
            (i) => i.setTitle(this.pasteLabel(" here")).setIcon("clipboard-paste").onClick(() => void this.pasteInto(file))
          );
          menu.addSeparator();
        }
        if (this.canBecomePage(file)) {
          menu.addItem(
            (item) => item.setTitle("Turn into a page").setIcon("file-plus").onClick(() => void this.folderToPage(file))
          );
        }
        const inside = this.plainFolders(file).length;
        if (inside) {
          menu.addItem(
            (item) => item.setTitle(`Turn ${inside} folder${inside === 1 ? "" : "s"} inside into pages\u2026`).setIcon("files").onClick(() => this.sweepFoldersToPages(file, `"${file.name}"`))
          );
        }
        menu.addItem((item) => {
          item.setTitle("Sort").setIcon("arrow-up-narrow-wide");
          const sub = item.setSubmenu?.();
          if (sub) this.fillSortMenu(sub, file);
          else
            item.onClick((e) => {
              const m = new import_obsidian.Menu();
              this.fillSortMenu(m, file);
              m.showAtMouseEvent(e);
            });
        });
        if (this.settings.orders[file.path] && !this.isForcedSort(file.path)) {
          menu.addItem(
            (item) => item.setTitle("Reset manual order").setIcon("rotate-ccw").onClick(() => {
              delete this.settings.orders[file.path];
              this.orderChanged();
              new Notice("Manual order cleared; this folder follows the default sort again.");
            })
          );
        }
        const isHidden = this.hiddenSet.has(file.path);
        menu.addItem(
          (item) => item.setTitle(isHidden ? "Unhide folder" : "Hide folder").setIcon(isHidden ? "eye" : "eye-off").onClick(() => this.setFolderHidden(file, !isHidden))
        );
        const nb = file.parent?.path === "/";
        menu.addItem((item) => {
          item.setTitle(nb ? "Notebook color" : "Section color").setIcon("palette");
          const sub = item.setSubmenu?.();
          if (sub) this.fillColorMenu(sub, file);
          else
            item.onClick((e) => {
              const m = new import_obsidian.Menu();
              this.fillColorMenu(m, file);
              m.showAtMouseEvent(e);
            });
        });
        menu.addItem((item) => {
          item.setTitle(nb ? "Notebook icon" : "Section icon").setIcon("smile");
          const sub = item.setSubmenu?.();
          if (sub) this.fillIconMenu(sub, file);
          else
            item.onClick((e) => {
              const m = new import_obsidian.Menu();
              this.fillIconMenu(m, file);
              m.showAtMouseEvent(e);
            });
        });
        const hasTpl = !!this.settings.pageTemplates[file.path];
        menu.addItem(
          (item) => item.setTitle(hasTpl ? "Change page template\u2026" : "Set page template\u2026").setIcon("file-plus-2").onClick(
            () => new TemplatePromptModal(
              this.app,
              this.settings.pageTemplates[file.path] ?? null,
              (v) => this.setPageTemplate(file, v)
            ).open()
          )
        );
        menu.addItem(
          (item) => item.setTitle("Templates for this folder\u2026").setIcon("layout-template").onClick(() => new FolderTemplatesModal(this, file).open())
        );
      })
    );
    this.addCommand({
      id: "toggle-drag",
      icon: "move",
      name: "Toggle drag to reorder",
      callback: () => {
        this.settings.dragEnabled = !this.settings.dragEnabled;
        void this.persistSettings();
        new Notice(`Power Explorer: drag to reorder ${this.settings.dragEnabled ? "on" : "off"}.`);
      }
    });
    this.addCommand({
      id: "toggle-sections",
      icon: "panel-left",
      name: "Toggle sections layout (folders and pages panes)",
      callback: () => this.setSectionsLayout(!this.settings.sectionsLayout)
    });
    this.addCommand({
      id: "folders-to-pages",
      name: "Turn plain folders into pages (whole vault)",
      icon: "files",
      callback: () => this.sweepFoldersToPages(this.app.vault.getRoot(), "the whole vault")
    });
    const paneToggle = (mode) => this.setLayout(this.settings.sectionsLayout && this.settings.desktopPane === mode ? "default" : mode);
    this.addCommand({
      id: "toggle-notebooks",
      icon: "book",
      name: "Toggle notebooks-only desktop layout (root folders in the left pane)",
      callback: () => paneToggle("notebooks")
    });
    this.addCommand({
      id: "toggle-onenote-layout",
      icon: "book-open",
      name: "Toggle notebooks-and-sections layout (two levels in the left pane)",
      callback: () => paneToggle("onenote")
    });
    this.addCommand({
      id: "toggle-desktop-drill",
      icon: "chevron-right",
      name: "Toggle drill desktop layout (one level at a time)",
      callback: () => paneToggle("drill")
    });
    this.addCommand({
      id: "toggle-hidden",
      icon: "eye-off",
      name: "Show/hide hidden folders",
      callback: () => this.toggleHidden()
    });
    this.addCommand({
      id: "perf-report",
      icon: "gauge",
      name: "Copy performance report",
      callback: () => void this.copyPerfReport()
    });
    this.addCommand({
      id: "open-recent-pages",
      icon: "history",
      name: "Open Recent Pages",
      callback: () => {
        if (this.pagesEl) this.setSection(RECENT);
        else new Notice("Power Explorer: turn on Sections layout to use Recent Pages.");
      }
    });
    this.addCommand({
      id: "reveal-active",
      icon: "locate",
      name: "Reveal active page (jump to its section)",
      callback: () => this.revealActive()
    });
    this.addCommand({
      id: "search-vault",
      icon: "search",
      name: "Search everywhere",
      callback: () => this.openSearch()
    });
    for (const a of this.actions()) this.ribbonEls.push(this.addRibbonIcon(a.icon, a.label, a.run));
    this.register(() => document.querySelectorAll(".pe-bar-action, .pe-bar-cmd").forEach((n) => n.remove()));
    this.addCommand({ id: "new-page-gallery", name: "New page from template", icon: "file-plus", callback: () => this.ribbonNewPage() });
    this.addCommand({ id: "open-launcher", name: "Power apps launcher", icon: "layout-grid", callback: () => new PowerLauncherModal(this).open() });
    this.applyActionHome();
    this.addSettingTab(new PowerExplorerSettingTab(this));
  }
  /** A one-time welcome pointing at the two features hidden behind a hotkey
   *  and a command, so a new user actually finds them. */
  welcomeOnce() {
    if (this.loadFailed) return;
    if (this.settings.welcomed) return;
    this.settings.welcomed = true;
    new Notice(
      "Power Explorer is on. Click the ribbon search icon for instant vault search, and turn on Sections layout (command palette: 'Toggle sections layout') for the notebook/pages view. Right-click any folder for colors, icons, hide, and templates.",
      15e3
    );
  }
  /** Open the instant vault search, or say why it can't. */
  openSearch() {
    if (!this.settings.searchEnabled) {
      new Notice("Power Explorer: search is turned off in settings.");
      return;
    }
    new PowerSearchModal(this).open();
  }
  /** After a search result opens, highlight the matched terms in the editor
   *  and scroll to the match nearest the hit's line. Edit-mode only (reading
   *  view has no CM editor); a couple of retries cover the view mounting. */
  highlightMatches(leaf, terms, anchorLine, tries = 0) {
    if (!terms.length) return;
    const cm = leaf?.view?.editor?.cm;
    if (!cm) {
      if (tries < 3) window.setTimeout(() => this.highlightMatches(leaf, terms, anchorLine, tries + 1), 60);
      return;
    }
    const text = cm.state.doc.toString();
    const ranges = editorMatchRanges(text, terms);
    if (!ranges.length) return;
    const lineNo = Math.min(Math.max(1, anchorLine + 1), cm.state.doc.lines);
    const anchorOff = cm.state.doc.line(lineNo).from;
    const target = ranges.find((r) => r[0] >= anchorOff) ?? ranges[0];
    cm.dispatch({
      effects: [setMatchHl.of(ranges), import_view.EditorView.scrollIntoView(target[0], { y: "center" })],
      selection: { anchor: target[0] }
    });
    window.setTimeout(() => {
      if (cm.dom.isConnected && cm.state.field(matchHlField, false) !== void 0) cm.dispatch({ effects: clearMatchHl.of(null) });
    }, 8e3);
  }
  onunload() {
    if (this.drag) this.cancelDrag();
    this.removeSections();
    this.search?.flushPersist();
    this.search?.shutdown();
    if (this.refreshTimer != null) window.clearTimeout(this.refreshTimer);
    if (this.settingsRepaintTimer != null) window.clearTimeout(this.settingsRepaintTimer);
    if (this.saveTimer != null) {
      window.clearTimeout(this.saveTimer);
      void this.persistSettings();
    }
  }
  queueSave() {
    this.stashDevice();
    if (this.saveTimer != null) window.clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => {
      this.saveTimer = null;
      void this.persistSettings();
    }, 400);
  }
  /**
   * The one write path for settings. Every save goes through here so the
   * data.json watcher can tell our own write from someone else's edit.
   *
   * `saveTimer` alone cannot do that: it is cleared when the debounce fires,
   * which is BEFORE saveData's write actually lands, so the gap between the two
   * looks idle to the watcher. That gap is where favorites went. `saving` is set
   * synchronously before the first await, so it and `saveTimer` together cover
   * the whole change-to-disk span with no hole between them.
   */
  async persistSettings() {
    this.saving = true;
    this.stashDevice();
    try {
      const disk = await this.readDisk();
      const healing = this.loadFailed;
      if (healing && !disk) return;
      this.loadFailed = false;
      this.adoptSettings(mergeForSave(this.settings, this.baseline, disk));
      await this.saveData(withoutDeviceKeys(this.settings));
      this.baseline = structuredClone(this.settings);
      if (healing) {
        this.repaintFromSettings();
        new Notice(RESTORED_NOTICE);
      }
    } finally {
      this.saving = false;
    }
  }
  /** A change of ours is on its way to disk, so anything read off disk right now
   *  is behind memory and must not be adopted over it. */
  busySaving() {
    return this.saveTimer != null || this.saving;
  }
  /**
   * Take on new settings CONTENTS without swapping the object.
   *
   * Settings tabs and modals capture this object once (`const s =
   * plugin.settings`, then `s.key = v`), so replacing it strands every one of
   * those writes on an orphan and the setting silently stops sticking. Every
   * assignment to this.settings goes through here for that reason. The field
   * starts life as DEFAULT_SETTINGS itself, which must never be mutated.
   */
  adoptSettings(next) {
    if (this.settings && this.settings !== DEFAULT_SETTINGS) Object.assign(this.settings, next);
    else this.settings = { ...next };
  }
  /** loadData that treats a throw the same as an empty read: null. A corrupt
   *  or half-written data.json must land in the same guarded path as a
   *  missing one, never abort a load or a save halfway through. */
  async readDisk() {
    let raw;
    try {
      raw = await this.loadData() ?? null;
    } catch {
      return null;
    }
    if (!raw) return null;
    if (this.app.loadLocalStorage(DEVICE_STORE) == null && hasDeviceKeys(raw)) {
      this.app.saveLocalStorage(DEVICE_STORE, JSON.stringify(pickDeviceKeys(raw)));
    }
    return withoutDeviceKeys(raw);
  }
  /** Persist this device's own state. Local storage is synchronous, so this
   *  runs at the moment of the change rather than on the save debounce: a
   *  phone killed from the app switcher between the two keeps its list. */
  stashDevice() {
    this.app.saveLocalStorage(DEVICE_STORE, JSON.stringify(pickDeviceKeys(this.settings)));
  }
  /** Lay the stash back over settings built from disk. */
  withDevice(s) {
    return overlayDeviceState(s, this.app.loadLocalStorage(DEVICE_STORE));
  }
  /** Is data.json actually present? Asked only when a read came back empty,
   *  to tell a fresh install (defaults are correct, write away) from a file
   *  that would not read (write nothing). An adapter error counts as
   *  present: when in doubt, protect the file. */
  async dataFileOnDisk() {
    try {
      return await this.app.vault.adapter.exists(`${this.app.vault.configDir}/plugins/${this.manifest.id}/data.json`);
    } catch {
      return true;
    }
  }
  /**
   * Obsidian calls this when data.json changes underneath us, which is what
   * Sync landing another device's write looks like. It is the only such signal
   * gets. A desktop-only fs.watch on data.json used to sit alongside this,
   * doing the same job through the Node filesystem API; the hook covers the
   * external-program case it existed for, and its cost was a listing that
   * warned users the plugin could read and write any file on the system.
   */
  async onExternalSettingsChange() {
    await this.adoptExternalData();
  }
  async adoptExternalData() {
    if (this.busySaving()) return;
    const before = JSON.stringify(this.settings);
    const raw = await this.readDisk();
    if (!raw) return;
    if (this.busySaving() || JSON.stringify(this.settings) !== before) return;
    if (this.loadFailed) {
      this.loadFailed = false;
      this.adoptSettings(mergeForSave(this.settings, this.baseline, raw));
      this.baseline = structuredClone(this.withDevice(Object.assign({}, DEFAULT_SETTINGS, raw)));
      this.repaintFromSettings();
      new Notice(RESTORED_NOTICE);
      return;
    }
    const next = this.withDevice(Object.assign({}, DEFAULT_SETTINGS, raw));
    if (JSON.stringify(next) === JSON.stringify(this.settings)) return;
    this.adoptSettings(next);
    this.baseline = structuredClone(next);
    this.repaintFromSettings();
  }
  /** Repaint everything that is drawn from settings, after memory was
   *  replaced under the UI (an external edit adopted, or a failed boot read
   *  finally making good). */
  repaintFromSettings() {
    if (import_obsidian.Platform.isMobileApp && this.mobileSyncSettling()) {
      if (this.settingsRepaintTimer == null) {
        this.settingsRepaintTimer = window.setTimeout(() => {
          this.settingsRepaintTimer = null;
          this.repaintFromSettings();
        }, 750);
      }
      return;
    }
    this.rankCache.clear();
    this.hiddenSet = new Set(this.settings.hidden);
    this.applyColorStyles();
    document.body.toggleClass("pe-hide-phone-actions", this.settings.hidePhoneActions);
    document.body.toggleClass("pe-wide-nav", this.settings.phoneWideNav);
    for (const leaf of this.app.workspace.getLeavesOfType("file-explorer")) {
      leaf.view.requestSort?.();
    }
    if (this.settings.sectionsLayout) this.applySections();
    else this.removeSections();
    if (this.pagesEl) this.renderPages();
  }
  /** Did this rename/delete touch any stored order? O(arranged folders). */
  ordersTouched(oldPath, isFolder, newPath) {
    const o = this.settings.orders;
    if (o[parentPathOf(oldPath)] || newPath && o[parentPathOf(newPath)]) return true;
    if (!isFolder) return false;
    const p1 = oldPath + "/";
    const p2 = newPath ? newPath + "/" : null;
    for (const k of Object.keys(o)) {
      if (k === oldPath || k.startsWith(p1)) return true;
      if (p2 && (k === newPath || k.startsWith(p2))) return true;
    }
    return false;
  }
  /** Does a change at this path affect what the pages pane is showing? Group
   *  subpages live a level below the section, so the whole subtree counts. */
  sectionTouched(path, newPath) {
    const shallow = (p) => {
      const pp = parentPathOf(p);
      return pp === "/" || parentPathOf(pp) === "/";
    };
    if (this.notebooksEl && (shallow(path) || newPath != null && shallow(newPath))) return true;
    const s = this.sectionFolder().path;
    const prefix = s === "/" ? "" : s + "/";
    const hit = (p) => p === s || p.startsWith(prefix) || s.startsWith(p + "/");
    return hit(path) || newPath != null && hit(newPath);
  }
  /** One trailing pages repaint per event burst; user actions repaint directly. */
  queuePagesRefresh() {
    if (this.refreshTimer != null) return;
    this.refreshTimer = window.setTimeout(() => {
      this.refreshTimer = null;
      if (import_obsidian.Platform.isMobileApp && this.mobileSyncSettling()) {
        this.queuePagesRefresh();
        return;
      }
      if (this.pagesEl) this.renderPages();
    }, import_obsidian.Platform.isMobileApp ? 500 : 250);
  }
  /** Shared, read-only startup signal from Power Connect. Kept structural so
   *  Explorer remains independent when Connect is not installed. */
  mobileSyncSettling() {
    const pc = this.app.plugins?.plugins?.powerconnect;
    return pc?.running === true || pc?.mobileStartupPending === true;
  }
  /* ---------------- sorting ---------------- */
  /** Wrap the explorer's own per-folder sort. It is called lazily, only for
   *  folders being rendered, so cost scales with what's on screen, never
   *  with vault size. */
  patchExplorers() {
    for (const leaf of this.app.workspace.getLeavesOfType("file-explorer")) {
      const view = leaf.view;
      if (!view || this.patchedViews.has(view)) continue;
      const orig = view.getSortedFolderItems;
      if (typeof orig !== "function") {
        console.warn("Power Explorer: this Obsidian version has no getSortedFolderItems; manual order is inactive.");
        continue;
      }
      this.patchedViews.add(view);
      this.origSort.set(view, orig);
      view.getSortedFolderItems = (folder) => {
        const items = orig.call(view, folder).filter((it) => this.showsInTree(it.file));
        return this.orderItems(folder, items);
      };
      this.register(() => {
        if (view.getSortedFolderItems !== orig) view.getSortedFolderItems = orig;
      });
      const setSort = view.setSortOrder;
      if (typeof setSort === "function") {
        view.setSortOrder = (order) => {
          setSort.call(view, order);
          this.queuePagesRefresh();
        };
        this.register(() => {
          if (view.setSortOrder !== setSort) view.setSortOrder = setSort;
        });
      }
      view.requestSort?.();
    }
    this.addRevealButtons();
  }
  /** A Reveal-active-file button on the explorer's own header, standing in
   *  for the separate Reveal Active File Button plugin; one per leaf. */
  /**
   * This plugin's own three actions, described once so the ribbon and the
   * explorer's toolbar offer exactly the same set and cannot drift apart.
   */
  actions() {
    return [
      { icon: "search", label: "Power Explorer: Search everywhere", run: () => this.openSearch() },
      { icon: "file-plus", label: "Power Explorer: New page from template", run: () => this.ribbonNewPage() },
      { icon: "layout-grid", label: "Power Explorer: Power apps launcher", run: () => new PowerLauncherModal(this).open() }
    ];
  }
  /**
   * Phones: move the navigation bar's actions up into the note's header and
   * hide the bar, handing the bottom of the screen back to the note.
   *
   * These are the app's own elements, carrying live state (the tab count) and
   * their own handlers, so they are MOVED rather than rebuilt. Nothing is
   * hidden until the move has actually happened: if a future version renames
   * these classes this does nothing at all, which costs a phone its tidier
   * header but never its search, tabs or menu.
   *
   * A header belongs to a view, while the bar is the app's, so the actions are
   * re-parked on every layout and active-leaf change. That also repairs them if
   * the app rebuilds a header underneath us.
   */
  applyPhoneTopActions() {
    if (!this.settings.phoneTopActions || !import_obsidian.Platform.isPhone) return;
    if (!this.grabNavActions()) return;
    const host = document.querySelector(".workspace-leaf.mod-active .view-header .view-actions") ?? document.querySelector(".view-header .view-actions");
    if (!(host instanceof HTMLElement)) return;
    if (this.navActions.every((el) => el.parentElement === host)) {
      document.body.addClass("pe-phone-top-actions");
      return;
    }
    for (const el of [...this.navActions].reverse()) host.prepend(el);
    document.body.addClass("pe-phone-top-actions");
  }
  /**
   * Phones: fold the drawer's tab row into a button beside the vault settings.
   *
   * The app already collapses these tabs into a menu that flies open on tap; it
   * just spends a whole row on the trigger. So the switcher is MOVED whole,
   * trigger and list together, and the app's own tap handling keeps working.
   * The row it vacates goes to the folder list, which is the point.
   *
   * Search is ours instead of the app's: it reaches the whole vault rather than
   * a pane, which is the whole reason the search action exists here.
   */
  applyPhoneDrawerMenu() {
    if (!this.settings.phoneDrawerMenu || !import_obsidian.Platform.isPhone) return;
    const drawer = document.querySelector(".workspace-drawer.mod-left");
    const opts = drawer?.querySelector(".workspace-drawer-tab-options");
    const header = drawer?.querySelector(".workspace-drawer-header");
    if (!(opts instanceof HTMLElement) || !(header instanceof HTMLElement)) return;
    if (!this.tabOptsHome) this.tabOptsHome = opts.parentElement;
    if (opts.parentElement !== header) {
      header.insertBefore(opts, header.querySelector(".mod-settings"));
      this.wireDrawerSearch(opts);
    }
    const trigger = opts.querySelector(".workspace-drawer-tab-select");
    if (trigger instanceof HTMLElement) trigger.addClass("clickable-icon", "workspace-drawer-header-icon", "mod-raised");
    const glyph = opts.querySelector(".workspace-drawer-tab-select .workspace-tab-header-inner-icon");
    if (glyph instanceof HTMLElement && !glyph.querySelector(".lucide-menu")) (0, import_obsidian.setIcon)(glyph, "menu");
    document.body.addClass("pe-phone-drawer-menu");
    this.wireDrawerOutsideClose();
  }
  /**
   * Tapping away closes the menu, the way every menu does.
   *
   * The app opens and shuts this list by toggling is-collapsed on its own taps,
   * but a tap OUTSIDE it did nothing, so it hung open over the folder list. This
   * shuts it on any click that is not inside it, which the trigger is, so
   * tapping the button still toggles as before, and a tap on a folder both opens
   * that folder and dismisses the menu.
   *
   * On click, not pointerdown, so starting a scroll of the list leaves it open.
   * Wired once for the plugin's life; the handler no-ops whenever the option is
   * off or the menu is already shut, so it costs nothing when it is not needed.
   */
  wireDrawerOutsideClose() {
    if (this.drawerOutsideWired) return;
    this.drawerOutsideWired = true;
    this.registerDomEvent(document, "click", (e) => {
      if (!this.settings.phoneDrawerMenu || !import_obsidian.Platform.isPhone) return;
      const opts = document.querySelector(".workspace-drawer-header .workspace-drawer-tab-options");
      if (!(opts instanceof HTMLElement) || opts.hasClass("is-collapsed")) return;
      if (opts.contains(e.target)) return;
      opts.addClass("is-collapsed");
    });
  }
  /** The menu's Search opens ours. Captured before the app's own handler, which
   *  would swap the drawer to its search pane instead. */
  wireDrawerSearch(opts) {
    opts.addEventListener(
      "click",
      (e) => {
        const hit = e.target.closest?.('.workspace-tab-header[data-type="search"]');
        if (!hit) return;
        e.preventDefault();
        e.stopPropagation();
        opts.addClass("is-collapsed");
        this.openSearch();
      },
      true
    );
  }
  /** Put the switcher back in its row. */
  restoreDrawerMenu() {
    document.body.removeClass("pe-phone-drawer-menu");
    const opts = document.querySelector(".workspace-drawer-tab-options");
    if (!(opts instanceof HTMLElement)) return;
    const trigger = opts.querySelector(".workspace-drawer-tab-select");
    if (trigger instanceof HTMLElement) trigger.removeClass("clickable-icon", "workspace-drawer-header-icon", "mod-raised");
    if (this.tabOptsHome) this.tabOptsHome.prepend(opts);
  }
  setPhoneDrawerMenu(on) {
    this.settings.phoneDrawerMenu = on;
    void this.persistSettings();
    if (on) this.applyPhoneDrawerMenu();
    else this.restoreDrawerMenu();
  }
  /**
   * The drawer menu, your way: stock entries you have hidden step out, and
   * the commands you picked line up after them.
   *
   * The list is the app's own, so nothing is removed: a hidden entry wears a
   * class and comes back the moment it drops, whether from its toggle or the
   * plugin unloading. The command rows are ours outright, dressed in the
   * stock rows' classes so every theme styles them identically. Tapping one
   * shuts the menu and runs the command; whatever it opens then owns the
   * screen (a modal covers the drawer, a note closes it, the app's call).
   *
   * The command rows are rebuilt from scratch each pass rather than patched:
   * the list is a handful of items, and one path serves add, remove,
   * reorder, and a drawer the app has rebuilt alike. This shapes the same
   * menu whether or not it has been folded into the header as a button.
   */
  applyDrawerMenuItems() {
    if (!this.phoneDrill()) return;
    const list = document.querySelector(".workspace-drawer.mod-left .workspace-drawer-tab-options-list");
    if (!(list instanceof HTMLElement)) return;
    const hidden = new Set(this.settings.drawerMenuHidden);
    for (const el of Array.from(list.querySelectorAll(":scope > .workspace-tab-header:not(.pe-drawer-cmd)"))) {
      if (el.instanceOf(HTMLElement)) el.toggleClass("pe-drawer-hidden", hidden.has(el.dataset.type ?? ""));
    }
    list.querySelectorAll(":scope > .pe-drawer-cmd").forEach((n) => n.remove());
    const reg = this.app.commands;
    for (const id of this.settings.drawerMenuCommands) {
      const cmd = reg.commands[id];
      if (!cmd) continue;
      const row = list.createDiv({ cls: "workspace-tab-header pe-drawer-cmd" });
      const inner = row.createDiv({ cls: "workspace-tab-header-inner" });
      const icon = cmd.icon || POWER_APPS.find((a) => id.startsWith(a.prefix + ":"))?.icon || "zap";
      (0, import_obsidian.setIcon)(inner.createDiv({ cls: "workspace-tab-header-inner-icon" }), icon);
      inner.createDiv({ cls: "workspace-tab-header-inner-title", text: shortCommandName(cmd.name) });
      row.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        row.closest(".workspace-drawer-tab-options")?.addClass("is-collapsed");
        reg.executeCommandById(id);
      });
    }
  }
  /** Reapply as the menu's trigger is tapped, captured ahead of the app's own
   *  handler: if the app rebuilt the list since the last layout pass, the
   *  items are put right again before the menu first paints. */
  wireDrawerMenuTapSync() {
    this.registerDomEvent(
      document,
      "click",
      (e) => {
        if (!this.phoneDrill()) return;
        const el = e.target;
        if (el.closest?.(".workspace-drawer.mod-left .workspace-drawer-tab-select")) this.applyDrawerMenuItems();
      },
      true
    );
  }
  /** Hand the menu back exactly as found: our command rows out, hidden stock
   *  entries showing again. */
  clearDrawerMenuItems() {
    document.querySelectorAll(".pe-drawer-cmd").forEach((n) => n.remove());
    document.querySelectorAll(".pe-drawer-hidden").forEach((n) => n.removeClass("pe-drawer-hidden"));
  }
  /** Take the four actions, all or nothing: a partial set would hide the bar
   *  while leaving some of it unreachable. */
  grabNavActions() {
    if (this.navActions.length) return true;
    const bar = document.querySelector(".mobile-navbar");
    if (!(bar instanceof HTMLElement)) return false;
    const found = [];
    for (const key of ["quick-switcher", "new-tab", "tabs", "menu"]) {
      const el = bar.querySelector(".mobile-navbar-action-" + key);
      if (!(el instanceof HTMLElement)) return false;
      found.push(el);
    }
    this.navHome = found[0].parentElement;
    this.navActions = found;
    return true;
  }
  /** Put the bar back exactly as it was. Appending restores the original order,
   *  since back and forward never left. */
  restoreNavbar() {
    document.body.removeClass("pe-phone-top-actions");
    if (!this.navHome) return;
    for (const el of this.navActions) this.navHome.appendChild(el);
  }
  setPhoneTopActions(on) {
    this.settings.phoneTopActions = on;
    void this.persistSettings();
    if (on) this.applyPhoneTopActions();
    else this.restoreNavbar();
  }
  /** The actions live in the ribbon or in the explorer's toolbar, never both. */
  applyActionHome() {
    const inBar = this.settings.actionsInExplorerBar;
    for (const el of this.ribbonEls) el.style.display = inBar ? "none" : "";
    this.addRevealButtons();
  }
  /** Keep this bar's copies matching the setting. Cheap to re-run: the buttons
   *  are rebuilt only when what is there is not what is wanted. */
  syncBarActions(bar) {
    const want = this.settings.actionsInExplorerBar;
    const have = bar.querySelectorAll(".pe-bar-action");
    if (want === have.length > 0) return;
    have.forEach((n) => n.remove());
    if (!want) return;
    for (const a of this.actions()) {
      const b = bar.createDiv({ cls: "clickable-icon nav-action-button pe-bar-action", attr: { "aria-label": a.label } });
      (0, import_obsidian.setIcon)(b, a.icon);
      b.addEventListener("click", a.run);
    }
  }
  addRevealButtons() {
    document.body.toggleClass("pe-own-new-folder", this.settings.sectionsLayout);
    for (const leaf of this.app.workspace.getLeavesOfType("file-explorer")) {
      const el = leaf.view?.containerEl;
      const bar = el?.querySelector(".nav-buttons-container");
      if (!bar) continue;
      this.syncBarActions(bar);
      this.syncFolderBtn(bar);
      this.syncBarCommands(bar);
      this.wireCollapseAll(bar);
      if (!bar.querySelector(".pe-reveal-btn")) {
        const btn = bar.createDiv({
          cls: "clickable-icon nav-action-button pe-reveal-btn",
          attr: { "aria-label": "Reveal active file" }
        });
        (0, import_obsidian.setIcon)(btn, "locate");
        btn.addEventListener("click", () => this.revealActive());
        this.register(() => btn.remove());
      }
      this.syncBarVisibility(bar);
      this.syncBarOrder(bar);
    }
  }
  /**
   * Our New folder replaces the app's, but only where our model applies.
   *
   * Under the sections layout the app's button makes an empty folder, and an
   * empty folder has no note to anchor a row, so it lands outside the order
   * that ranks everything else. Ours gives it that note. Two buttons for one
   * job behaving differently is worse than either alone.
   *
   * With the layout off there is no section to make a folder in, and nothing
   * reads a folder's note as a page, so the app's button is simply the right
   * one and taking it away would be rude. The layout already says which world
   * this is; a setting would only ask again for what is already known.
   */
  /**
   * A stable name for one button in the explorer's toolbar.
   *
   * Ours are known by the classes we put on them. The app's are known by their
   * Lucide icon and never by their label, which is translated (the same reason
   * wireCollapseAll looks the way it does). The collapse button swaps its own
   * icon as it toggles, so both faces fold into one key or hiding it would come
   * undone the first time you pressed it.
   *
   * Null when nothing identifies the button, which is the fail-open case: a
   * button we cannot name is a button we never hide.
   */
  barKey(btn) {
    const cmd = btn.getAttribute("data-pe-cmd");
    if (cmd) return "cmd:" + cmd;
    if (btn.hasClass("pe-reveal-btn")) return "pe:reveal";
    if (btn.hasClass("pe-new-folder-btn")) return "pe:new-folder";
    const svg = btn.querySelector("svg");
    const icon = svg && Array.from(svg.classList).find((c) => c.startsWith("lucide-"))?.slice(7);
    if (!icon) return null;
    if (btn.hasClass("pe-bar-action")) return "pe:" + icon;
    return "ob:" + (icon === "chevrons-up-down" ? "chevrons-down-up" : icon);
  }
  /**
   * Every button the toolbar has, in the order it shows them, for the settings
   * list. Read from the live bar so it lists what is really there rather than a
   * table kept here that any Obsidian update could make a lie of.
   *
   * A hidden button is still in the list, or turning one off would take away
   * the switch that turns it back on. An added command whose plugin is off has
   * no button to read, so it is filled in from the stored list and marked.
   */
  barInventory() {
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    for (const leaf of this.app.workspace.getLeavesOfType("file-explorer")) {
      const el = leaf.view?.containerEl;
      const bar = el?.querySelector(".nav-buttons-container");
      if (!bar) continue;
      const ownFolder = document.body.hasClass("pe-own-new-folder");
      for (const btn of Array.from(bar.children)) {
        const key = this.barKey(btn);
        if (!key || seen.has(key)) continue;
        if (ownFolder && key === "ob:folder-plus") continue;
        seen.add(key);
        out.push({ key, label: btn.getAttribute("aria-label") || key });
      }
      break;
    }
    const reg = this.app.commands;
    for (const id of this.settings.explorerBarCommands) {
      if (seen.has("cmd:" + id)) continue;
      seen.add("cmd:" + id);
      out.push({ key: "cmd:" + id, label: reg.commands[id]?.name ?? id, missing: true });
    }
    return out;
  }
  /** Take the toolbar's order from the settings list after a drag. The list is
   *  the whole arrangement, so this stores it whole: the first drag freezes
   *  today's order rather than ranking one button against nothing. */
  setBarOrder(keys) {
    if (!keys.length) return;
    this.settings.explorerBarOrder = keys;
    void this.persistSettings();
    this.addRevealButtons();
  }
  addBarCommand(id) {
    this.settings.explorerBarCommands = [...this.settings.explorerBarCommands, id];
    void this.persistSettings();
    this.addRevealButtons();
  }
  removeBarCommand(id) {
    this.settings.explorerBarCommands = this.settings.explorerBarCommands.filter((c) => c !== id);
    this.settings.explorerBarOrder = this.settings.explorerBarOrder.filter((k) => k !== "cmd:" + id);
    delete this.settings.explorerBarIcons[id];
    void this.persistSettings();
    this.addRevealButtons();
  }
  /** Back to the toolbar Obsidian and the plugins drew, keeping nothing. */
  resetBar() {
    this.settings.explorerBarHidden = [];
    this.settings.explorerBarCommands = [];
    this.settings.explorerBarIcons = {};
    this.settings.explorerBarOrder = [];
    void this.persistSettings();
    document.querySelectorAll(".pe-bar-cmd").forEach((n) => n.remove());
    this.addRevealButtons();
  }
  /**
   * The commands you asked for, as buttons of their own.
   *
   * Anything in the command palette can sit here, which is the point: the
   * toolbar stops being the handful of things two plugins happened to put
   * there. A command whose plugin is off simply does not render, and returns
   * when it comes back, so a missing plugin never leaves a dead icon.
   *
   * Rebuilt only when the list on the bar is not the list you asked for.
   */
  syncBarCommands(bar) {
    const want = this.settings.explorerBarCommands;
    const have = Array.from(bar.querySelectorAll(".pe-bar-cmd")).map((n) => n.getAttribute("data-pe-cmd") ?? "");
    if (have.length === want.length && have.every((id, i) => id === want[i])) {
      this.refreshBarCmdIcons(bar);
      return;
    }
    bar.querySelectorAll(".pe-bar-cmd").forEach((n) => n.remove());
    const reg = this.app.commands;
    for (const id of want) {
      const cmd = reg.commands[id];
      if (!cmd) continue;
      const b = bar.createDiv({
        cls: "clickable-icon nav-action-button pe-bar-cmd",
        attr: { "aria-label": cmd.name, "data-pe-cmd": id }
      });
      this.paintIcon(b, this.commandIcon(id));
      b.addEventListener("click", () => reg.executeCommandById(id));
    }
  }
  /** setIcon with a floor under it: a name the app does not know draws nothing
   *  at all, and a blank button is worse than a plain one. */
  paintIcon(el, icon) {
    (0, import_obsidian.setIcon)(el, icon);
    if (!el.querySelector("svg")) (0, import_obsidian.setIcon)(el, "terminal");
  }
  /**
   * Put the right icon on a button that already exists.
   *
   * The ribbon this reads is not necessarily drawn when the toolbar is first
   * built, and a guess made too early would otherwise stay wrong for the life
   * of the pane. Only ever writes when the icon on screen is not the one
   * wanted: setIcon rewrites the button's contents, and doing that on every
   * layout change is the kind of churn that swallowed clicks last time.
   */
  refreshBarCmdIcons(bar) {
    for (const el of Array.from(bar.querySelectorAll(".pe-bar-cmd"))) {
      const id = el.getAttribute("data-pe-cmd");
      if (!id) continue;
      const want = this.commandIcon(id);
      const svg = el.querySelector("svg");
      const now = svg && Array.from(svg.classList).find((c) => c.startsWith("lucide-"))?.slice(7);
      if (now !== want) this.paintIcon(el, want);
    }
  }
  /**
   * The icon for an added command: the one you picked, else the one the command
   * registered, else the one its own plugin put on the ribbon for the same
   * name, and only then something generic.
   *
   * The ribbon step earns its keep. Most plugins (the Power ones included) call
   * addCommand with an id and a name and no icon at all, then register a ribbon
   * button with the icon they actually wanted, so reading the command alone
   * gave every added button the same terminal glyph. The lookup is on internal
   * shape, so it is guarded and simply falls through if that shape changes.
   */
  commandIcon(id) {
    const picked = this.settings.explorerBarIcons[id];
    if (picked) return picked;
    const reg = this.app.commands;
    const cmd = reg.commands[id];
    if (cmd?.icon) return cmd.icon;
    const name = cmd?.name ?? "";
    const icon = name ? this.ribbonIconFor(name) : null;
    if (icon) return icon;
    return "terminal";
  }
  /**
   * The icon the ribbon shows for a button of this name.
   *
   * Matching is loose in both directions because the two strings are written by
   * different hands: a command is named "Open inbox" and reaches us as "Power
   * Desk: Open inbox", while its ribbon button might be titled either. One
   * containing the other is as good as this gets, and a miss simply means the
   * generic icon and one click on the row to set what you want.
   */
  ribbonIconFor(name) {
    const want = name.toLowerCase();
    const tail = want.includes(": ") ? want.slice(want.indexOf(": ") + 2) : want;
    const nodes = document.querySelectorAll(
      ".workspace-ribbon [aria-label], .side-dock-ribbon [aria-label], .side-dock-ribbon-action[aria-label]"
    );
    for (const el of Array.from(nodes)) {
      const title = (el.getAttribute("aria-label") ?? "").toLowerCase();
      if (!title) continue;
      if (title !== want && title !== tail && !title.includes(tail) && !want.includes(title)) continue;
      const svg = el.querySelector("svg");
      const cls = svg && Array.from(svg.classList).find((c) => c.startsWith("lucide-"));
      if (cls) return cls.slice(7);
    }
    return null;
  }
  setBarIcon(id, icon) {
    if (icon) this.settings.explorerBarIcons[id] = icon;
    else delete this.settings.explorerBarIcons[id];
    void this.persistSettings();
    document.querySelectorAll(`.pe-bar-cmd[data-pe-cmd="${CSS.escape(id)}"]`).forEach((n) => n.remove());
    this.addRevealButtons();
  }
  /**
   * Put the toolbar in the order you set.
   *
   * Appending in sequence is all it takes, and re-running is how it survives:
   * the app rebuilds this bar on its own schedule, and every rebuild is
   * followed by another pass here. A button whose key is not in the order is
   * left where it was, at the end, so an unconfigured toolbar is untouched and
   * a button a future Obsidian adds appears rather than being silently sorted
   * somewhere you would not look for it.
   */
  syncBarOrder(bar) {
    const order = this.settings.explorerBarOrder;
    if (!order.length) return;
    const rank = new Map(order.map((k, i) => [k, i]));
    const ranked = [];
    const rest = [];
    for (const el of Array.from(bar.children)) {
      const key = this.barKey(el);
      const i = key != null ? rank.get(key) : void 0;
      if (i === void 0) rest.push(el);
      else ranked.push({ el, i });
    }
    ranked.sort((a, b) => a.i - b.i);
    const want = [...ranked.map((r) => r.el), ...rest];
    const kids = Array.from(bar.children);
    if (want.length === kids.length && want.every((el, i) => el === kids[i])) return;
    for (const el of want) bar.appendChild(el);
  }
  /** Paint the hidden set onto one toolbar. Re-run freely: it only ever adds
   *  or removes one class, and a rebuilt bar is repainted on the next pass. */
  syncBarVisibility(bar) {
    const hidden = new Set(this.settings.explorerBarHidden);
    for (const btn of Array.from(bar.children)) {
      if (!btn.hasClass("nav-action-button")) continue;
      const key = this.barKey(btn);
      btn.toggleClass("pe-bar-off", !!key && hidden.has(key));
      btn.toggleClass("pe-app-new-folder", key === "ob:folder-plus");
    }
  }
  setBarHidden(key, hide) {
    const set = new Set(this.settings.explorerBarHidden);
    if (hide) set.add(key);
    else set.delete(key);
    this.settings.explorerBarHidden = [...set];
    void this.persistSettings();
    this.addRevealButtons();
  }
  syncFolderBtn(bar) {
    const want = this.settings.sectionsLayout;
    const have = bar.querySelector(".pe-new-folder-btn");
    if (want === !!have) return;
    if (!want) {
      have?.remove();
      return;
    }
    const nf = bar.createDiv({
      cls: "clickable-icon nav-action-button pe-new-folder-btn",
      attr: { "aria-label": "New folder" }
    });
    (0, import_obsidian.setIcon)(nf, "folder-plus");
    nf.addEventListener("click", () => this.newFolder(this.sectionFolder(), null));
  }
  /**
   * Make the app's own collapse-all button collapse what is actually on screen.
   *
   * It works the file tree, which the sections layout hides and replaces with
   * our own rows, so pressing it did nothing you could see. Found by its icon
   * rather than its label, which is translated, and left to run its own handler
   * afterwards so the hidden tree still collapses underneath.
   */
  wireCollapseAll(bar) {
    const btn = bar.querySelector(
      ".nav-action-button:has(.lucide-chevrons-down-up), .nav-action-button:has(.lucide-chevrons-up-down)"
    );
    if (!(btn instanceof HTMLElement) || btn.dataset.peCollapse) return;
    btn.dataset.peCollapse = "1";
    const onClick = () => this.collapseAllSections();
    btn.addEventListener("click", onClick);
    this.register(() => {
      btn.removeEventListener("click", onClick);
      delete btn.dataset.peCollapse;
    });
  }
  /**
   * Honour the explorer's own auto-reveal toggle in our panes.
   *
   * That toggle reveals the active file in the file tree, which the sections
   * layout hides, so it looked like a dead button. Same complaint as
   * collapse-all, same cause, and the third control our layout quietly took the
   * meaning out of.
   *
   * The toggle is read from the view's own state, so unlike the collapse button
   * no icon or label is involved and nothing here can be defeated by a rename.
   */
  autoReveal() {
    if (!this.pagesEl || this.paneMode === "tree") return;
    if (!this.app.workspace.getActiveFile()) return;
    if (!this.autoRevealOn()) return;
    this.revealActive();
  }
  autoRevealOn() {
    for (const leaf of this.app.workspace.getLeavesOfType("file-explorer")) {
      const view = leaf.view;
      const state = view?.getState?.();
      if (typeof state?.autoReveal === "boolean") return state.autoReveal;
    }
    return false;
  }
  /**
   * Is this folder a page group, a row inside its parent rather than a place
   * you step into? Either shape counts, because pairPages honors both: a note
   * inside it, or a note beside it carrying its name.
   */
  isGroupFolder(folder) {
    if (this.groupNote(folder)) return true;
    return !!folder.parent?.children.some((c) => c instanceof import_obsidian.TFile && c.name === folder.name + ".md");
  }
  /**
   * The section that shows a row for this file: its nearest ancestor that is
   * not a page group. Every group passed on the way is expanded, because until
   * it is, the row does not render at all.
   *
   * A group is a row, not a place you step into, and groups nest. Checking one
   * level meant a note two groups deep sent the pane INTO the group holding it,
   * which is how making a new folder inside a group swapped the whole pane for
   * a one-row list you had to walk back out of.
   */
  sectionShowing(f) {
    let sec = f.parent ?? this.app.vault.getRoot();
    let opened = false;
    for (let i = 0; sec.parent && this.isGroupFolder(sec) && i < 16; i++) {
      opened = this.collapsedGroups.delete(sec.path) || opened;
      sec = sec.parent;
    }
    if (opened) this.saveExpansion();
    return sec;
  }
  /** Shut every notebook and page group our panes have open. */
  collapseAllSections() {
    if (!this.settings.sectionsLayout) return;
    this.expandedNbs.clear();
    const shut = (folder, depth) => {
      if (depth > 8) return;
      for (const en of this.sectionEntries(folder)) {
        if (!en.group) continue;
        this.collapsedGroups.add(en.group.path);
        shut(en.group, depth + 1);
      }
    };
    if (!this.isRecent()) shut(this.sectionFolder(), 0);
    this.saveExpansion();
    this.renderNotebooks();
    if (this.pagesEl) this.renderPages();
  }
  /** The "where am I?" jump: move the pane to the active note's section,
   *  expanding its notebook and any page groups on the way, then spotlight
   *  its row. In the tree layout (or with the sections layout off) it also
   *  runs Obsidian's own reveal so the native tree expands to the file. */
  revealActive() {
    const f = this.app.workspace.getActiveFile();
    if (!f) {
      new Notice("Power Explorer: no active file to reveal.");
      return;
    }
    if (!this.settings.sectionsLayout || this.paneMode === "tree") {
      const app = this.app;
      app.commands?.executeCommandById?.("file-explorer:reveal-active-file");
    }
    if (!this.pagesEl) return;
    const sec = this.sectionShowing(f);
    if (!this.isRecent() && this.sectionFolder().path === sec.path) {
      this.pagesFilter = "";
      this.filterOpen = false;
      this.renderPages();
    } else {
      this.setSection(sec.path);
    }
    this.selectPage(f.path);
    const find = () => this.pagesEl.querySelector(`.pe-page[data-path="${CSS.escape(f.path)}"]`);
    let row = find();
    const more = this.pagesEl.querySelector(".pe-pages-more");
    for (let i = 0; !row && more && more.style.display !== "none" && i < 200; i++) {
      more.click();
      row = find();
    }
    if (!row) return;
    row.scrollIntoView({ block: "center" });
    row.addClass("pe-flash");
    window.setTimeout(() => row.removeClass("pe-flash"), 900);
  }
  /** Reorder one folder's already-sorted items by its own sort: a forced name
   *  sort if the folder has one, else the stored manual order. Pins (in pin
   *  order) float above either. O(children) plus a sort of the ranked subset;
   *  O(1) rank lookups. Mirrors applySortMode/applyOrder/applyPins (order.ts)
   *  for item objects instead of names. */
  orderItems(folder, items) {
    const mode = this.settings.folderSort[folder.path];
    if (mode === "az" || mode === "za") {
      const sorted = [...items].sort((a, b) => compareNames(a.file?.name ?? "", b.file?.name ?? ""));
      if (mode === "za") sorted.reverse();
      return this.pinItems(folder, sorted);
    }
    const order = this.settings.orders[folder.path];
    let base = items;
    if (order && order.length) {
      let rank = this.rankCache.get(folder.path);
      if (!rank) {
        rank = /* @__PURE__ */ new Map();
        order.forEach((n, i) => rank.set(n, i));
        this.rankCache.set(folder.path, rank);
      }
      const ranked = [];
      const rest = [];
      for (const it of items) {
        const n = it.file?.name;
        (n != null && rank.has(n) ? ranked : rest).push(it);
      }
      if (ranked.length) {
        ranked.sort((a, b) => (rank.get(a.file.name) ?? 0) - (rank.get(b.file.name) ?? 0));
        base = this.settings.unranked === "top" ? [...rest, ...ranked] : [...ranked, ...rest];
      }
    }
    return this.pinItems(folder, base);
  }
  /** Float this folder's pinned items (in pin order) above the rest. Pins are
   *  an explicit per-item choice, so they hold under a forced sort too. */
  pinItems(folder, base) {
    const pinned = this.settings.pins[folder.path];
    if (!pinned || !pinned.length) return base;
    const prank = /* @__PURE__ */ new Map();
    pinned.forEach((n, i) => prank.set(n, i));
    const pin = [];
    const unpinned = [];
    for (const it of base) {
      const n = it.file?.name;
      (n != null && prank.has(n) ? pin : unpinned).push(it);
    }
    if (!pin.length) return base;
    pin.sort((a, b) => (prank.get(a.file.name) ?? 0) - (prank.get(b.file.name) ?? 0));
    return [...pin, ...unpinned];
  }
  /** A folder's children in effective manual order, computed straight from our
   *  order state rather than the file explorer's patched sort hook. The explorer
   *  view loads DEFERRED, so on a Ctrl+R reload its hook isn't wrapped yet when
   *  the first pages render runs, which used to leave the pages pane
   *  alphabetical until the next click re-rendered it. This mirrors the hook:
   *  a base sort (Obsidian's own when a patched view can give it, else raw
   *  children), the hidden-folder filter, then orderItems. */
  orderedChildren(folder) {
    let base = null;
    for (const leaf of this.app.workspace.getLeavesOfType("file-explorer")) {
      const view = leaf.view;
      const orig = this.origSort.get(view);
      if (orig) {
        base = orig.call(view, folder);
        break;
      }
      if (typeof view.getSortedFolderItems === "function") {
        base = view.getSortedFolderItems(folder);
        break;
      }
    }
    let items = base ?? sortChildren(
      folder.children,
      this.explorerSortOrder(),
      (f) => f.name,
      (f) => f instanceof import_obsidian.TFolder,
      (f) => f instanceof import_obsidian.TFile ? f.stat : null
    ).map((c) => ({ file: c }));
    return this.orderItems(folder, items.filter((it) => this.showsInTree(it.file))).map((it) => it.file).filter((f) => f != null);
  }
  /**
   * Whether a row belongs in the tree and the pages list right now: hidden
   * folders are out, and so are attachments while that setting is on.
   *
   * Both are lifted by the same session-only peek, since both answer the same
   * question, "show me what is really in here". The ordering ranks are read
   * from the UNFILTERED list elsewhere (see visibleNames), so nothing that is
   * merely out of sight loses its place while it is away.
   */
  showsInTree(f) {
    if (this.showHidden) return true;
    if (f instanceof import_obsidian.TFolder) return !this.hiddenSet.has(f.path);
    if (f instanceof import_obsidian.TFile) return !this.settings.hideAttachments || !isAttachmentName(f.name);
    return true;
  }
  /** The explorer's chosen sort order, read from its view state (present on
   *  mobile, where the sort method itself is not). Its own default when unset. */
  explorerSortOrder() {
    for (const leaf of this.app.workspace.getLeavesOfType("file-explorer")) {
      const so = leaf.view.getState?.()?.sortOrder;
      if (typeof so === "string") return so;
    }
    return "alphabetical";
  }
  /* ---------------- pins ---------------- */
  isPinned(parentPath, name) {
    return (this.settings.pins[parentPath] ?? []).includes(name);
  }
  togglePin(parent, name) {
    const arr = this.settings.pins[parent.path] ?? [];
    const next = arr.includes(name) ? arr.filter((n) => n !== name) : [...arr, name];
    if (next.length) this.settings.pins[parent.path] = next;
    else delete this.settings.pins[parent.path];
    this.queueSave();
    for (const leaf of this.app.workspace.getLeavesOfType("file-explorer")) {
      leaf.view.requestSort?.();
    }
    if (this.pagesEl) this.renderPages();
  }
  /** A folder's children in their effective order, INCLUDING hidden folders,
   *  so a reorder among visible siblings never silently drops the rank of a
   *  folder that happens to be hidden at the time. */
  visibleNames(folder) {
    for (const leaf of this.app.workspace.getLeavesOfType("file-explorer")) {
      const view = leaf.view;
      const orig = this.origSort.get(view);
      if (orig) {
        return this.orderItems(folder, orig.call(view, folder)).map((it) => it.file?.name ?? "").filter(Boolean);
      }
      if (typeof view.getSortedFolderItems === "function") {
        return view.getSortedFolderItems(folder).map((it) => it.file?.name ?? "").filter(Boolean);
      }
    }
    return folder.children.map((c) => c.name);
  }
  /* ---------------- section colors ---------------- */
  /** Regenerate the one stylesheet that paints every section accent and icon.
   *  This is the whole runtime cost of both: no per-item classes, no observers.
   *
   *  These rules select `.nav-folder-title`, which belongs to Obsidian's file
   *  explorer rather than to this plugin, so the per-element approach cannot
   *  reach them: the explorer reveals rows on expand without firing any event
   *  we listen to, and catching that needs a MutationObserver over the tree,
   *  which is exactly the cost this design exists to avoid. The rules are also
   *  keyed by the user's own folder paths and colors, so styles.css cannot
   *  express them.
   *
   *  A constructable stylesheet gives the same one-sheet behavior with no
   *  element in the document. Where it is unavailable (Safari below 16.4, so
   *  older iOS) the accents are simply skipped: they are decoration, and a
   *  missing accent is better than a broken pane. */
  applyColorStyles() {
    if (!this.colorSheet) {
      if (typeof CSSStyleSheet === "undefined" || !("replaceSync" in CSSStyleSheet.prototype)) return;
      this.colorSheet = new CSSStyleSheet();
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, this.colorSheet];
      this.register(() => {
        document.adoptedStyleSheets = document.adoptedStyleSheets.filter((s) => s !== this.colorSheet);
      });
    }
    const esc = (p) => p.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    let css = "";
    for (const [p, c] of Object.entries(this.settings.colors)) {
      if (!/^#[0-9A-Fa-f]{3,8}$/.test(c)) continue;
      css += `.nav-folder-title[data-path="${esc(p)}"]{box-shadow:inset 3px 0 0 0 ${c};}
`;
    }
    for (const [p, ico] of Object.entries(this.settings.icons)) {
      const safe = ico.replace(/[\\"]/g, "").slice(0, 8).trim();
      if (!safe) continue;
      css += `.nav-folder-title[data-path="${esc(p)}"] .nav-folder-title-content::before{content:"${safe} ";}
`;
    }
    this.colorSheet.replaceSync(css);
  }
  setSectionColor(folder, color) {
    if (color) this.settings.colors[folder.path] = color;
    else delete this.settings.colors[folder.path];
    this.queueSave();
    this.applyColorStyles();
    if (this.pagesEl) this.renderPages();
  }
  setSectionIcon(folder, icon) {
    const safe = icon?.replace(/[\\"]/g, "").slice(0, 8).trim() || null;
    if (safe) this.settings.icons[folder.path] = safe;
    else delete this.settings.icons[folder.path];
    this.queueSave();
    this.applyColorStyles();
    if (this.pagesEl) this.renderPages();
  }
  /**
   * Turn any note sitting in reading view back to editing.
   *
   * Obsidian's own "default view for new tabs" only covers notes it opens
   * fresh; a note reopened from a workspace saved in reading view, or one whose
   * frontmatter asks for it, still lands read-only. This runs on file-open and
   * layout-change, so every route ends up in the editor.
   */
  enforceEditMode() {
    for (const leaf of this.app.workspace.getLeavesOfType("markdown")) {
      const view = leaf.view;
      if (!(view instanceof import_obsidian.MarkdownView)) continue;
      view.modeButtonEl?.addClass("pe-mode-toggle");
      if (!this.settings.alwaysEdit) continue;
      if (view.getMode() !== "preview") continue;
      const state = view.getState();
      if (state.mode === "source") continue;
      state.mode = "source";
      void view.setState(state, { history: false });
    }
  }
  setAlwaysEdit(on) {
    this.settings.alwaysEdit = on;
    document.body.toggleClass("pe-always-edit", on);
    void this.persistSettings();
    this.enforceEditMode();
  }
  /**
   * The main-area tab already showing this path, if there is one.
   *
   * Asked through `getViewState()` rather than `leaf.view.file`, because every
   * tab you are not standing in is deferred since 1.7.2: its view is a stand-in
   * that holds no file, and reaching for one to ask would load every tab in the
   * window. The view state carries the path whether the view is real or not.
   *
   * Main-area leaves only. A note showing in a sidebar is not a tab, and a note
   * deliberately popped out into a window of its own should not have this pane
   * pulling focus to another window behind your back.
   */
  openLeafFor(path) {
    const hits = [];
    this.app.workspace.iterateRootLeaves((leaf) => {
      const open = leaf.getViewState().state?.file;
      if (typeof open === "string" && open === path) hits.push(leaf);
    });
    return hits[0] ?? null;
  }
  /**
   * Step to the tab already holding this path, if there is one.
   *
   * The open itself is left to the caller: an `openLinkText` that follows lands
   * in the tab this just made active, which is how the attachment routes keep
   * Obsidian's own subpath handling and still stop short of a second copy.
   */
  async focusOpenTab(path) {
    const open = this.openLeafFor(path);
    if (!open) return;
    await this.app.workspace.revealLeaf(open);
    this.app.workspace.setActiveLeaf(open, { focus: true });
  }
  /**
   * Show a page: step to the tab already holding it, or open it where you are.
   *
   * Every route from this pane into a note goes through here. `getLeaf(false)`
   * means "the tab I am standing in" and knows nothing about the tab the note is
   * already open in, so opening a page from anywhere else hands you a second
   * copy of it: two scroll positions, two undo histories, and edits landing in
   * whichever one you looked at last. A list of pages should navigate to a note,
   * not clone it. Asking for a second copy on purpose is still there, on the
   * row's right-click menu.
   *
   * `eState` rides along both ways, so a search hit that lands on a note that
   * was already open still scrolls to its line.
   */
  async showPage(f, eState) {
    const open = this.openLeafFor(f.path);
    if (open) {
      await this.app.workspace.revealLeaf(open);
      this.app.workspace.setActiveLeaf(open, { focus: true });
      if (eState) open.setEphemeralState(eState);
      return open;
    }
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(f, eState ? { eState } : void 0);
    return leaf;
  }
  /** Let Obsidian's Settings window reopen where you left it.
   *
   *  None of the work is ours. The settings modal already reads its size and
   *  position out of local storage as it opens and writes them back as it
   *  closes, but both halves are guarded on `popoutStorageKey`, which 1.13.4
   *  initializes to null and then never assigns. Naming a key is the whole
   *  fix: Obsidian's own code does the rest.
   *
   *  Guarded rather than assumed, because this is not API Obsidian documents:
   *  a build that renames or drops the property leaves the settings window
   *  behaving exactly as it does today rather than throwing. It is also only
   *  ever consulted when Settings opens in a window of its own, so it stays
   *  inert for anyone who keeps Settings as a dialog inside the main window. */
  applySettingsWindowMemory() {
    const setting = this.app.setting;
    if (!setting) return;
    setting.popoutStorageKey = this.settings.rememberSettingsWindow ? "pe-settings-window" : null;
  }
  setRememberSettingsWindow(on) {
    this.settings.rememberSettingsWindow = on;
    void this.persistSettings();
    this.applySettingsWindowMemory();
  }
  /** The color a folder paints with. The user's own choice always wins; a
   *  notebook they never colored falls back to its place in the palette, which
   *  is why `nth` is its position among the notebooks on screen. Anything that
   *  is not a notebook stays uncoloured unless chosen. */
  accentOf(path, notebook, nth) {
    const chosen = this.settings.colors[path];
    if (chosen) return chosen;
    if (!notebook || !this.settings.autoNotebookColors) return null;
    return autoAccent(nth, PALETTE);
  }
  /** True when this folder re-sorts itself, so hand-arranging it is off. */
  isForcedSort(path) {
    const m = this.settings.folderSort[path];
    return m === "az" || m === "za";
  }
  setFolderSort(folder, mode) {
    if (mode === "manual") delete this.settings.folderSort[folder.path];
    else this.settings.folderSort[folder.path] = mode;
    this.orderChanged();
  }
  /** Sort submenu: which order this one folder keeps itself in. A forced sort
   *  leaves any drag order stored but unused, so switching back to Manual
   *  restores the arrangement rather than losing it. */
  fillSortMenu(menu, folder) {
    const current = this.settings.folderSort[folder.path] ?? "manual";
    const modes = [
      ["manual", "Manual (drag to arrange)", "move"],
      ["az", "Name (A to Z)", "arrow-down-az"],
      ["za", "Name (Z to A)", "arrow-down-za"]
    ];
    for (const [mode, label, icon] of modes) {
      menu.addItem(
        (item) => item.setTitle(`${label}${current === mode ? "  \u2713" : ""}`).setIcon(icon).onClick(() => this.setFolderSort(folder, mode))
      );
    }
  }
  fillIconMenu(menu, folder) {
    const current = this.settings.icons[folder.path] ?? null;
    for (const e of SECTION_EMOJI) {
      menu.addItem((item) => item.setTitle(`${e}${current === e ? "  \u2713" : ""}`).onClick(() => this.setSectionIcon(folder, e)));
    }
    menu.addItem(
      (item) => item.setTitle("Custom\u2026").setIcon("pencil").onClick(() => new IconPromptModal(this.app, current, (v) => this.setSectionIcon(folder, v)).open())
    );
    if (current) {
      menu.addItem((item) => item.setTitle("Remove icon").setIcon("x").onClick(() => this.setSectionIcon(folder, null)));
    }
  }
  fillColorMenu(menu, folder) {
    const current = this.settings.colors[folder.path] ?? null;
    for (const [name, hex] of SECTION_COLORS) {
      menu.addItem((item) => {
        const title = createFragment((frag) => {
          const dot = frag.createSpan();
          dot.setText("\u25CF ");
          dot.style.color = hex;
          frag.appendText(name + (current === hex ? " \u2713" : ""));
        });
        item.setTitle(title).onClick(() => this.setSectionColor(folder, hex));
      });
    }
    if (current) {
      menu.addItem((item) => item.setTitle("Remove color").setIcon("x").onClick(() => this.setSectionColor(folder, null)));
    }
  }
  /* ---------------- hidden folders ---------------- */
  refreshTrees() {
    for (const leaf of this.app.workspace.getLeavesOfType("file-explorer")) {
      leaf.view.requestSort?.();
    }
    if (this.pagesEl) this.renderPages();
  }
  setFolderHidden(folder, hide) {
    if (hide) this.hiddenSet.add(folder.path);
    else this.hiddenSet.delete(folder.path);
    this.settings.hidden = [...this.hiddenSet];
    this.queueSave();
    this.refreshTrees();
    this.refreshSettingsTab?.();
    new Notice(
      hide ? `"${folder.name}" hidden. Show/hide hidden folders brings it back any time.` : `"${folder.name}" is visible again.`
    );
  }
  /** Unhide by path, even when the folder no longer exists in the vault. */
  unhidePath(path) {
    this.hiddenSet.delete(path);
    this.settings.hidden = [...this.hiddenSet];
    this.queueSave();
    this.refreshTrees();
  }
  /** Clear every hidden entry whose folder no longer exists. User-initiated
   *  only (a settings button), deliberately never at load, where a Sync
   *  catch-up that lands data.json before the folders would delete a live
   *  mark. Returns how many stale entries were removed. */
  removeMissingHidden() {
    const before = this.settings.hidden.length;
    this.settings.hidden = pruneHidden(
      this.settings.hidden,
      (p) => this.app.vault.getAbstractFileByPath(p) instanceof import_obsidian.TFolder
    );
    this.hiddenSet = new Set(this.settings.hidden);
    if (this.settings.hidden.length !== before) {
      this.queueSave();
      this.refreshTrees();
    }
    return before - this.settings.hidden.length;
  }
  toggleHidden() {
    const folders = this.liveHiddenCount();
    const files = this.settings.hideAttachments;
    if (!folders && !files && !this.showHidden) {
      new Notice("Power Explorer: nothing is hidden. Right-click a folder and choose Hide folder.");
      return;
    }
    this.showHidden = !this.showHidden;
    this.refreshTrees();
    const what = [folders ? `${folders} hidden folder(s)` : "", files ? "attachments" : ""].filter(Boolean).join(" and ");
    new Notice(this.showHidden ? `Showing ${what} until toggled off (this session only).` : "Hidden items are tucked away again.");
  }
  /** How many hidden folders STILL EXIST. A folder renamed or moved without our
   *  rename hook seeing it (the filesystem, Sync from another device, or a move
   *  made while the plugin was off) leaves a stale path in settings.hidden;
   *  counting it would show a phantom "N hidden" the eye toggle can never
   *  reveal. The stale entry is left in place, pruning it here and persisting
   *  could unhide a folder across every device on a Sync catch-up that lands
   *  data.json before the folders, and stays clearable from the settings
   *  "Hidden folders" list, where missing entries are now flagged. */
  liveHiddenCount() {
    let n = 0;
    for (const p of this.hiddenSet) {
      if (this.app.vault.getAbstractFileByPath(p) instanceof import_obsidian.TFolder) n++;
    }
    return n;
  }
  /** After a user-driven order change: immediate refresh (drops must feel instant). */
  orderChanged() {
    this.rankCache.clear();
    this.queueSave();
    this.refreshTrees();
    this.refreshSettingsTab?.();
  }
  /* ---------------- sections layout (folders | pages) ---------------- */
  setSectionsLayout(on) {
    this.settings.sectionsLayout = on;
    this.queueSave();
    if (on) this.applySections();
    else this.removeSections();
    this.addRevealButtons();
    new Notice(`Power Explorer: sections layout ${on ? "on" : "off"}.`);
  }
  setHidePhoneActions(on) {
    this.settings.hidePhoneActions = on;
    document.body.toggleClass("pe-hide-phone-actions", on);
    this.queueSave();
  }
  /** The single layout control: "default" is Obsidian's own file explorer
   *  (sections layout off); any pane value turns the sections layout on with
   *  that left pane. Folds the old on/off toggle into one choice. */
  setLayout(v) {
    const on = v !== "default";
    if (on) this.settings.desktopPane = v;
    this.settings.sectionsLayout = on;
    this.queueSave();
    this.removeSections();
    if (on) this.applySections();
    const names = {
      tree: "full folder tree",
      notebooks: "notebooks only",
      onenote: "notebooks and sections",
      drill: "drill"
    };
    new Notice(on ? `Power Explorer: layout set to ${names[v]}.` : "Power Explorer: using the Obsidian default explorer.");
  }
  /** Is the app in phone form right now? Class check keeps it live for iPad
   *  split view and mobile emulation; Platform covers early startup. */
  phoneDrill() {
    return import_obsidian.Platform.isPhone || document.body.hasClass("is-phone");
  }
  /** Decorate the existing Files pane in place: CSS grid splits it into the
   *  native folder tree (files hidden by CSS) and our pages pane. Nothing of
   *  Obsidian's own DOM is moved, so turning it off restores stock exactly.
   *  Phones get drill navigation instead: two stacked panes leave rows too
   *  small for fingers, so one pane shows a single level at a time. */
  applySections() {
    if (!this.settings.sectionsLayout) return;
    const leaf = this.app.workspace.getLeavesOfType("file-explorer")[0];
    const container = leaf?.view?.containerEl;
    if (!container || !container.querySelector(".nav-files-container")) return;
    const touch = this.phoneDrill();
    const mode = touch ? "drill" : this.settings.desktopPane;
    if (this.sectionsApplied === container && this.pagesEl?.isConnected && this.paneMode === mode && this.touchApplied === touch) {
      return;
    }
    this.removeSections();
    if (mode === "drill") {
      container.addClass("pe-drill");
      if (touch) container.addClass("pe-touch");
      this.pagesEl = container.createDiv({ cls: "pe-pages" });
      const inner2 = this.pagesEl.createDiv({ cls: "pe-pages-inner", attr: { tabindex: "0" } });
      inner2.addEventListener("keydown", (e) => this.pagesKeydown(e));
      inner2.addEventListener("scroll", () => this.pagesScrollHandler?.());
      this.attachLongPress(inner2);
      this.sectionsApplied = container;
      this.paneMode = "drill";
      this.touchApplied = touch;
      this.renderPages();
      return;
    }
    container.addClass("pe-sections");
    if (mode === "notebooks" || mode === "onenote") container.addClass("pe-notebooks");
    container.style.setProperty("--pe-split", (this.settings.sectionWidth || 240) + "px");
    if (this.settings.showRecent) {
      this.recentRowEl = container.createDiv({ cls: "pe-recent-row" });
      const ric = this.recentRowEl.createSpan({ cls: "pe-recent-icon" });
      (0, import_obsidian.setIcon)(ric, "history");
      this.recentRowEl.createSpan({ text: "Recent Pages" });
      this.recentRowEl.addEventListener("click", () => this.setSection(RECENT));
    }
    if (mode === "notebooks" || mode === "onenote") {
      this.notebooksEl = container.createDiv({ cls: "pe-notebooks-pane" });
    }
    if (mode === "onenote") {
      const sec = this.settings.lastSection;
      if (sec && sec !== RECENT && sec !== "/") this.expandedNbs.add(sec.split("/")[0]);
    }
    this.pagesEl = container.createDiv({ cls: "pe-pages" });
    const divider = this.pagesEl.createDiv({ cls: "pe-divider" });
    divider.addEventListener("pointerdown", (e) => this.startDividerDrag(e, container));
    const inner = this.pagesEl.createDiv({ cls: "pe-pages-inner", attr: { tabindex: "0" } });
    inner.addEventListener("keydown", (e) => this.pagesKeydown(e));
    inner.addEventListener("scroll", () => this.pagesScrollHandler?.());
    this.sectionsApplied = container;
    this.paneMode = mode;
    this.touchApplied = false;
    this.renderPages();
  }
  removeSections() {
    this.sectionsApplied?.removeClass("pe-sections");
    this.sectionsApplied?.removeClass("pe-notebooks");
    this.sectionsApplied?.removeClass("pe-drill");
    this.sectionsApplied?.removeClass("pe-touch");
    this.sectionsApplied?.style.removeProperty("--pe-split");
    this.pagesEl?.remove();
    this.pagesEl = null;
    this.notebooksEl?.remove();
    this.notebooksEl = null;
    this.recentRowEl?.remove();
    this.recentRowEl = null;
    this.sectionsApplied = null;
    this.paneMode = null;
    this.touchApplied = false;
    this.pagesScrollHandler = null;
  }
  /** Whether the pages pane is showing the Recent Pages pseudo-section. */
  isRecent() {
    return (this.sectionPath ?? this.settings.lastSection) === RECENT;
  }
  /** Re-apply the sections chrome after a settings change (e.g. the Recent
   *  Pages toggle) without disturbing the layout switch itself. */
  reapplySections() {
    if (!this.settings.sectionsLayout) return;
    this.removeSections();
    this.applySections();
  }
  /** The folder whose pages are showing: last selected, else the vault root. */
  /** Other explorer-sorting plugins fight over the same hook; say so once. */
  warnConflicts() {
    const conflicts = {
      "manual-sorting": "Manual Sorting / Flexplorer",
      flexplorer: "Flexplorer",
      "custom-sort": "Custom File Explorer sorting",
      "obsidian-bartender": "Bartender",
      "notebook-navigator": "Notebook Navigator",
      "file-order": "File Order",
      "file-explorer-plus": "File Explorer++"
    };
    const enabled = this.app.plugins?.enabledPlugins;
    if (!enabled) return;
    const found = Object.keys(conflicts).filter((id) => enabled.has(id)).map((id) => conflicts[id]);
    if (found.length) {
      new Notice(
        `Power Explorer: ${found.join(", ")} also reorders or filters the file explorer. Running both sides will fight; disable one.`,
        12e3
      );
    }
  }
  /** Evidence for lag reports: timings and state sizes on the clipboard. */
  async copyPerfReport() {
    const explorer = this.app.workspace.getLeavesOfType("file-explorer")[0]?.view;
    const root = this.app.vault.getRoot();
    const t0 = performance.now();
    if (explorer && typeof explorer.getSortedFolderItems === "function") explorer.getSortedFolderItems(root);
    const t1 = performance.now();
    const section = this.sectionFolder();
    const entryCount = this.sectionEntries(section).length;
    const t2 = performance.now();
    if (this.pagesEl) this.renderPages();
    const t3 = performance.now();
    const s = this.settings;
    const report = {
      plugin: this.manifest.version,
      obsidianApi: import_obsidian.apiVersion,
      mobile: document.body.hasClass("is-mobile"),
      vault: {
        markdownFiles: this.app.vault.getMarkdownFiles().length,
        loadedFilesAndFolders: this.app.vault.getAllLoadedFiles().length
      },
      state: {
        arrangedFolders: Object.keys(s.orders).length,
        hiddenFolders: s.hidden.length,
        coloredFolders: Object.keys(s.colors).length,
        iconFolders: Object.keys(s.icons).length,
        pinnedFolders: Object.keys(s.pins ?? {}).length,
        sectionsLayout: s.sectionsLayout,
        paneMode: this.paneMode,
        section: section.path,
        sectionChildren: section.children.length,
        sectionEntries: entryCount,
        rankCacheSize: this.rankCache.size,
        sortHookPatched: !!explorer && this.patchedViews.has(explorer)
      },
      timingsMs: {
        sortRootChildren: +(t1 - t0).toFixed(2),
        buildSectionEntries: +(t2 - t1).toFixed(2),
        renderPagesPane: +(t3 - t2).toFixed(2)
      },
      search: s.searchEnabled ? this.search.stats() : { enabled: false }
    };
    await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    new Notice("Power Explorer: performance report copied to the clipboard.");
  }
  sectionFolder() {
    const p = this.sectionPath ?? this.settings.lastSection;
    if (p && p !== "/") {
      const af = this.app.vault.getAbstractFileByPath(p);
      if (af instanceof import_obsidian.TFolder) return af;
    }
    return this.app.vault.getRoot();
  }
  /** The current section's folder path, for the search modal's scope chips. */
  currentSectionPath() {
    return this.sectionFolder().path;
  }
  setSection(path) {
    if (this.sectionPath === path) return;
    const prev = this.sectionPath ?? this.settings.lastSection ?? "/";
    const drillish = this.paneMode != null && this.paneMode !== "tree";
    this.drillAnim = drillish ? drillDirection(prev, path, RECENT) : null;
    if (this.paneMode === "onenote" && path !== RECENT && path !== "/") {
      this.expandedNbs.add(path.split("/")[0]);
    }
    this.sectionPath = path;
    this.settings.lastSection = path;
    this.pagesFilter = "";
    this.filterOpen = false;
    this.selectedPage = null;
    this.selectedPages.clear();
    this.selectAnchor = null;
    this.saveExpansion();
    this.renderPages();
  }
  /** The folder note that makes a subfolder a page group. */
  /**
   * The note that makes a folder a page rather than a folder: one inside it
   * carrying its name. That reading is a convention, not something the app
   * itself means, so it is a setting. Off, a folder is always a folder and the
   * same-named note is just a page inside it, which is what a vault wants when
   * naming a page after the folder it sits in is a habit rather than a marker.
   * The other shape, a note beside a folder of the same name, is unaffected:
   * pairPages reads that from the names alone.
   */
  groupNote(folder) {
    if (!this.canPairInside(folder)) return null;
    for (const c of folder.children) {
      if (c instanceof import_obsidian.TFile && c.name === folder.name + ".md") return c;
    }
    return null;
  }
  /** Would a note inside this folder, carrying its name, make it a page? The
   *  test groupNote applies, asked without the note having to exist yet, so
   *  conversion and rename-pairing read the rule from the same place.
   *
   *  A notebook or a section is a place you step into, never a page. Both it and
   *  a page's own folder hold a note carrying their name, and nothing on disk
   *  tells them apart, so the level has to: naming a page after the section it
   *  sits in is a habit, and it must not cost that section its place in the
   *  navigator. */
  canPairInside(folder) {
    return this.settings.folderNoteGroups && pathDepth(folder.path) > 2;
  }
  /**
   * A page group is one thing wearing two names: a folder, and the note that
   * anchors it. Rename half of it and the pairing dissolves, the note stops
   * matching the folder, the row drops out of the pages list, and the folder
   * reappears in the Folders block as though it had never been a page. And the
   * way that happens is not some corner case: it is retitling the note, from
   * the editor, which is how anyone renames a page.
   *
   * So the halves move together, whichever one was renamed and wherever the
   * rename came from, this pane, the explorer's F2, the inline title, another
   * plugin, because this rides the vault's own rename event rather than any one
   * entry point. Both shapes count: the note inside the folder, and the note
   * beside it.
   *
   * Renames only. A move changes the parent, and a note carried into a folder
   * has no claim on that folder's name.
   */
  async keepPairTogether(f, oldPath) {
    if (this.pairing.delete(f.path)) return;
    if (parentPathOf(oldPath) !== parentPathOf(f.path)) return;
    const oldName = nameOf(oldPath);
    if (oldName === f.name || !f.parent) return;
    const follow = async (half, dest) => {
      if (this.app.vault.getAbstractFileByPath(dest)) {
        new Notice(`Power Explorer: "${nameOf(dest)}" already exists, so the page and its folder no longer match.`);
        return;
      }
      this.pairing.add(dest);
      try {
        await this.app.fileManager.renameFile(half, dest);
      } catch {
        this.pairing.delete(dest);
        new Notice("Power Explorer: renamed one half of the page, but the other could not follow.");
      }
    };
    if (f instanceof import_obsidian.TFile && f.extension === "md") {
      const oldBase = oldName.slice(0, -3);
      if (f.parent.name === oldBase && this.canPairInside(f.parent)) {
        await follow(f.parent, joinPath(parentPathOf(f.parent.path), f.basename));
        return;
      }
      const beside2 = f.parent.children.find((c) => c instanceof import_obsidian.TFolder && c.name === oldBase);
      if (beside2) await follow(beside2, joinPath(f.parent.path, f.basename));
      return;
    }
    if (!(f instanceof import_obsidian.TFolder)) return;
    const inside = f.children.find((c) => c instanceof import_obsidian.TFile && c.name === oldName + ".md");
    if (inside && this.canPairInside(f)) {
      await follow(inside, joinPath(f.path, f.name + ".md"));
      return;
    }
    const beside = f.parent.children.find((c) => c instanceof import_obsidian.TFile && c.name === oldName + ".md");
    if (beside) await follow(beside, joinPath(f.parent.path, f.name + ".md"));
  }
  /**
   * Could this folder be given its own page? Only where a folder's own note
   * means "page" at all (the setting on, below section level) and only when
   * nothing anchors it yet: a note inside it, or one beside it carrying its
   * name, which pairPages reads from the names alone and which already seats
   * the folder in the list.
   */
  canBecomePage(folder) {
    if (!this.settings.folderNoteGroups) return false;
    if (pathDepth(folder.path) <= 2) return false;
    if (this.groupNote(folder)) return false;
    return !folder.parent?.children.some((c) => c instanceof import_obsidian.TFile && c.name === folder.name + ".md");
  }
  /**
   * Give an existing folder its own page, so it stops living off to one side.
   *
   * Folders made in this pane arrive holding their page (createFolderWithPage);
   * folders made in Obsidian's explorer, imported from a notebook, or made
   * before that rule existed never do, and a folder with no note has nothing
   * to anchor a row, so the pane can only show it in the Folders block, out of
   * reach of the order that ranks everything else in the section. This is the
   * way back. The note goes in, the folder becomes a page group, and pairPages
   * seats the row exactly where the folder already sat in the order: nothing to
   * rewrite, nothing to drag. The vault's own create event repaints the pane,
   * so no settings are touched and nothing is saved.
   */
  async folderToPage(folder) {
    const f = await this.createFolderNote(folder);
    if (!f) {
      new Notice("Power Explorer: could not make that folder's page.");
      return;
    }
    await this.app.workspace.getLeaf(false).openFile(f);
  }
  /** Write a folder's own page, or null if it could not be written. Shared by
   *  the single conversion and the sweep, which differ only in whether the new
   *  page is opened and in how they report. */
  async createFolderNote(folder) {
    if (!this.canBecomePage(folder)) return null;
    const path = joinPath(folder.path, folder.name + ".md");
    if (this.app.vault.getAbstractFileByPath(path)) return null;
    try {
      const f = await this.app.vault.create(path, await this.newPageBody(folder));
      return f instanceof import_obsidian.TFile ? f : null;
    } catch {
      return null;
    }
  }
  /**
   * Every folder under `root` that could hold its own page and has none.
   *
   * Hidden folders and the attachment folder are left out: one you deliberately
   * tucked out of the tree, the other is a bucket for files rather than a place
   * with pages. Neither wants a page, and a sweep that gave them one would be a
   * sweep you had to undo by hand.
   */
  plainFolders(root) {
    const skip = this.attachmentSkip();
    const out = [];
    const walk = (folder) => {
      for (const c of folder.children) {
        if (!(c instanceof import_obsidian.TFolder)) continue;
        if (this.hiddenSet.has(c.path)) continue;
        if (skip.path && isUnder(c.path, skip.path)) continue;
        if (skip.name && c.name === skip.name) continue;
        if (this.canBecomePage(c)) out.push(c);
        walk(c);
      }
    };
    walk(root);
    return out;
  }
  /** Where Obsidian files attachments, in the two shapes that name a folder:
   *  a fixed vault path, or the per-note "./name" form, which is a name to
   *  match anywhere. Attachments beside the note name no folder at all. */
  attachmentSkip() {
    const cfg = this.app.vault.getConfig?.("attachmentFolderPath");
    const raw = (typeof cfg === "string" ? cfg : "").trim().replace(/\/+$/, "");
    if (!raw || raw === ".") return { path: null, name: null };
    if (raw.startsWith("./")) return { path: null, name: raw.slice(2) };
    return { path: raw, name: null };
  }
  /**
   * Give every plain folder under `root` its own page, in one pass.
   *
   * One at a time is the wrong tool for a vault that came out of a notebook
   * app. The import makes folders by the hundred and pages for none of them,
   * and each one sits outside the section's order until somebody clicks it.
   * This is that same conversion, counted first and confirmed once.
   */
  sweepFoldersToPages(root, where) {
    const targets = this.plainFolders(root);
    if (!targets.length) {
      new Notice(`Power Explorer: every folder in ${where} already has its page.`);
      return;
    }
    new ConfirmModal(
      this.app,
      `Turn ${targets.length} folder${targets.length === 1 ? "" : "s"} into pages?`,
      `In ${where}. Each folder gets a note carrying its own name (from its page template, where one is set) and moves out of the Folders block into the pages list, at the position it already holds. Nothing is deleted, renamed, or moved. Hidden folders and attachment folders are left alone.`,
      "Turn into pages",
      () => {
        void (async () => {
          let made = 0;
          for (const folder of targets) if (await this.createFolderNote(folder)) made++;
          new Notice(
            made === targets.length ? `Power Explorer: ${made} folder${made === 1 ? "" : "s"} now hold their own page.` : `Power Explorer: wrote ${made} of ${targets.length} pages; the rest could not be written.`
          );
        })();
      }
    ).open();
  }
  /** What a new page in this folder starts from: the folder's template with the
   *  template's own metadata stripped, or nothing. Shared so a folder's page is
   *  never the one page that ignores your template, however it came to exist. */
  async newPageBody(folder) {
    const tpl = this.templateForFolder(folder);
    if (!tpl) return "";
    try {
      return renderBody(stripTemplateMeta(await this.app.vault.read(tpl)), this.tokenContext(folder));
    } catch {
      return "";
    }
  }
  /** The section's page entries in effective order: plain notes, plus page
   *  groups, a folder anchored by a same-named sibling note (the subpage
   *  layout notebook importers produce) or by an inside folder note. */
  sectionEntries(folder) {
    const byName = new Map(folder.children.map((c) => [c.name, c]));
    const ordered = [];
    for (const af of this.orderedChildren(folder)) {
      if (af instanceof import_obsidian.TFile) ordered.push({ name: af.name, folder: false });
      else if (af instanceof import_obsidian.TFolder) ordered.push({ name: af.name, folder: true });
    }
    const out = [];
    for (const en of pairPages(ordered, (n) => {
      const af = byName.get(n);
      return af instanceof import_obsidian.TFolder && this.groupNote(af) != null;
    })) {
      const group = en.group ? byName.get(en.group) ?? null : null;
      const file = en.page ? byName.get(en.page) : group ? this.groupNote(group) : null;
      if (file instanceof import_obsidian.TFile) out.push({ file, group });
    }
    return out;
  }
  /** A group's subpages as entries, so nested page groups recurse. The
   *  group's own inside folder note never repeats as a child row. */
  groupEntries(group) {
    const note = this.groupNote(group);
    return this.sectionEntries(group).filter((en) => !(note && !en.group && en.file.path === note.path));
  }
  /** Does this entry (or any nested subpage) match the pages filter? A match
   *  is a name hit, a content hit from the search index, or a matching child. */
  entryMatches(en, q, content) {
    if (en.file.name.toLowerCase().includes(q)) return true;
    if (content?.has(en.file.path)) return true;
    if (!en.group) return false;
    return this.groupEntries(en.group).some((c) => this.entryMatches(c, q, content));
  }
  /** Paths under the folder whose CONTENT matches the filter, via the search
   *  index (same word-prefix semantics as Search everywhere). Null while
   *  search is off or still building, the filter then matches names only. */
  contentMatches(q, folder) {
    if (!q || !this.settings.searchEnabled || !this.search.ready) return null;
    const scope = folder.path === "/" ? "" : folder.path;
    return new Set(this.search.query(q, { scope, limit: 400 }).map((h) => h.path));
  }
  /** The Recent Pages pseudo-section: last-opened notes, newest first, each
   *  with its section for context. Read-only: no drag, no New page. */
  renderRecent(inner) {
    const files = this.settings.recentPages.map((p) => this.app.vault.getAbstractFileByPath(p)).filter((f) => f instanceof import_obsidian.TFile);
    if (files.length !== this.settings.recentPages.length) {
      this.settings.recentPages = files.map((f) => f.path);
      this.queueSave();
    }
    const head = inner.createDiv({ cls: "pe-pages-head" });
    const hic = head.createSpan({ cls: "pe-recent-icon" });
    (0, import_obsidian.setIcon)(hic, "history");
    head.createSpan({ cls: "pe-pages-title", text: "Recent Pages" });
    const countEl = head.createSpan({ cls: "pe-pages-count" });
    const btns = head.createDiv({ cls: "pe-head-btns" });
    const rbtn = btns.createEl("button", { cls: "pe-eye", attr: { title: "Reveal active page" } });
    (0, import_obsidian.setIcon)(rbtn, "locate");
    rbtn.addEventListener("click", () => this.revealActive());
    const fbtn = btns.createEl("button", {
      cls: "pe-eye" + (this.filterOpen ? " is-active" : ""),
      attr: { title: this.filterOpen ? "Hide the filter" : "Filter pages" }
    });
    (0, import_obsidian.setIcon)(fbtn, "search");
    fbtn.addEventListener("click", () => {
      this.filterOpen = !this.filterOpen;
      if (!this.filterOpen) this.pagesFilter = "";
      this.renderPages();
    });
    let filterInput = null;
    if (this.filterOpen) {
      const frow = inner.createDiv({ cls: "pe-filter" });
      filterInput = frow.createEl("input", {
        attr: { type: "text", placeholder: "Filter pages\u2026", spellcheck: "false" }
      });
      filterInput.value = this.pagesFilter;
    }
    const list = inner.createDiv({ cls: "pe-pages-list pe-recent-list" });
    const active = this.app.workspace.getActiveFile();
    const rebuild = () => {
      list.empty();
      const q = this.pagesFilter.toLowerCase();
      const shown = q ? files.filter((f) => f.basename.toLowerCase().includes(q)) : files;
      countEl.setText(String(shown.length));
      if (!shown.length) {
        list.createDiv({ cls: "pe-empty", text: q ? "No recent pages match." : "Pages you open will show up here." });
        return;
      }
      for (const f of shown) {
        const row = list.createDiv({ cls: "pe-page", attr: { "data-path": f.path } });
        if (active && f.path === active.path) row.addClass("is-active");
        row.createSpan({ cls: "pe-page-name", text: f.basename });
        row.createSpan({
          cls: "pe-page-sec",
          text: f.parent && f.parent.path !== "/" ? f.parent.name : this.app.vault.getName()
        });
        row.addEventListener("click", () => void this.showPage(f));
        row.addEventListener("contextmenu", (ev) => {
          ev.preventDefault();
          const menu = new import_obsidian.Menu();
          menu.addItem(
            (i) => i.setTitle("Go to section").setIcon("folder-open").onClick(() => this.setSection(f.parent?.path ?? "/"))
          );
          menu.addItem(
            (i) => i.setTitle("Remove from Recent").setIcon("x").onClick(() => {
              this.settings.recentPages = this.settings.recentPages.filter((p) => p !== f.path);
              this.queueSave();
              this.renderPages();
            })
          );
          menu.showAtMouseEvent(ev);
        });
      }
    };
    rebuild();
    if (filterInput) {
      filterInput.addEventListener("input", () => {
        this.pagesFilter = filterInput.value;
        rebuild();
      });
      filterInput.focus();
    }
  }
  /** Render the pages pane; on phones, the drill navigator around it. */
  renderPages() {
    const inner = this.pagesEl?.querySelector(".pe-pages-inner");
    if (!inner) return;
    inner.empty();
    this.pagesScrollHandler = null;
    this.recentRowEl?.toggleClass("is-active", this.isRecent());
    if (this.paneMode === "notebooks" || this.paneMode === "onenote") this.renderNotebooks();
    if (this.paneMode && this.paneMode !== "tree") this.renderBackRow(inner);
    if (this.isRecent()) {
      this.renderRecent(inner);
      this.animateDrill(inner);
      return;
    }
    const folder = this.sectionFolder();
    const depth = folder.path === "/" ? 0 : folder.path.split("/").length;
    const showFolderRows = this.paneMode === "drill" || this.paneMode === "notebooks" && depth >= 1 || this.paneMode === "onenote" && depth >= 2;
    if (showFolderRows) this.renderDrillFolders(inner, folder);
    if (this.paneMode !== "tree" && folder.path === "/" && !this.sectionEntries(folder).length) {
      this.animateDrill(inner);
      return;
    }
    this.renderSectionPages(inner, folder);
    this.animateDrill(inner);
  }
  /** The top row names WHERE YOU ARE and steps back out one level when
   *  tapped (the chevron says back, the label says here). It only appears
   *  for levels the left pane does not already cover: everywhere on the
   *  drill, below the roots (notebooks), below the sections (notebooks-and-sections). */
  renderBackRow(inner) {
    const recent = this.isRecent();
    if (recent && this.paneMode !== "drill") return;
    const folder = this.sectionFolder();
    const depth = folder.path === "/" ? 0 : folder.path.split("/").length;
    const need = this.paneMode === "drill" ? recent || depth >= 1 : this.paneMode === "notebooks" ? depth >= 2 : depth >= 3;
    if (!need) return;
    const parent = recent ? this.app.vault.getRoot() : folder.parent ?? this.app.vault.getRoot();
    const row = inner.createDiv({ cls: "pe-back" });
    const ic = row.createSpan({ cls: "pe-back-icon" });
    (0, import_obsidian.setIcon)(ic, "chevron-left");
    const emoji = recent ? null : this.settings.icons[folder.path];
    row.createSpan({ text: recent ? "Recent Pages" : (emoji ? emoji + " " : "") + folder.name });
    row.addEventListener("click", () => this.setSection(parent.path));
  }
  /** The section's subfolders in effective order (manual order, pins, and the
   *  hidden filter), computed directly so it survives the deferred-explorer
   *  reload the same way the pages list does. */
  sectionSubfolders(folder) {
    return this.orderedChildren(folder).filter((af) => af instanceof import_obsidian.TFolder);
  }
  /** Phone drill: the section's subfolders as tappable rows. Page-group
   *  folders are left to the pages list, where they expand in place. */
  renderDrillFolders(inner, folder) {
    const groups = /* @__PURE__ */ new Set();
    for (const en of this.sectionEntries(folder)) if (en.group) groups.add(en.group.path);
    const notebooks = folder.path === "/";
    const subs = this.sectionSubfolders(folder).filter((sub) => !groups.has(sub.path));
    if (!notebooks && subs.length) {
      const fhead = inner.createDiv({ cls: "pe-pages-head pe-folders-head" });
      fhead.createSpan({ cls: "pe-pages-title", text: "Folders" });
      fhead.createSpan({ cls: "pe-pages-count", text: String(subs.length) });
    }
    const list = inner.createDiv({ cls: "pe-drill-folders" });
    if (folder.path === "/" && this.settings.showRecent) {
      const row = list.createDiv({ cls: "pe-drill-folder" });
      const ic = row.createSpan({ cls: "pe-drill-ico" });
      (0, import_obsidian.setIcon)(ic, "history");
      row.createSpan({ cls: "pe-drill-name", text: "Recent Pages" });
      const chev = row.createSpan({ cls: "pe-drill-chev" });
      (0, import_obsidian.setIcon)(chev, "chevron-right");
      row.addEventListener("click", () => this.setSection(RECENT));
    }
    let nth = 0;
    for (const sub of subs) {
      const row = list.createDiv({ cls: "pe-drill-folder", attr: { "data-path": sub.path } });
      const accent = this.accentOf(sub.path, notebooks, nth++);
      const emoji = this.settings.icons[sub.path] ?? null;
      const ic = row.createSpan({ cls: "pe-drill-ico" });
      if (emoji) ic.setText(emoji);
      else if (notebooks && accent) {
        drawNotebook(ic);
        ic.style.color = accent;
      } else (0, import_obsidian.setIcon)(ic, notebooks ? "book" : "folder");
      if (accent && (emoji || !notebooks)) row.style.setProperty("--pe-accent", accent);
      row.createSpan({ cls: "pe-drill-name", text: sub.name });
      const chev = row.createSpan({ cls: "pe-drill-chev" });
      (0, import_obsidian.setIcon)(chev, "chevron-right");
      row.addEventListener("click", () => this.setSection(sub.path));
      row.addEventListener("contextmenu", (ev) => {
        ev.preventDefault();
        this.folderMenu(sub, ev);
      });
    }
    if (!list.childElementCount) list.remove();
  }
  /** Notebooks and two-level variants: the left pane lists root folders, plus
   *  a vault row so loose root notes stay reachable. The two-level variant
   *  goes exactly one level deeper: each notebook expands to its sections
   *  (page-group folders stay with the pages pane), and anything below the
   *  sections belongs to the right pane. */
  renderNotebooks() {
    const pane = this.notebooksEl;
    if (!pane) return;
    pane.empty();
    const twoLevel = this.paneMode === "onenote";
    const section = this.isRecent() ? null : this.sectionFolder().path;
    let nth = 0;
    const decorate = (row, f, notebook) => {
      const accent = this.accentOf(f.path, notebook, notebook ? nth++ : -1);
      const emoji = this.settings.icons[f.path] ?? null;
      const ic = row.createSpan({ cls: "pe-drill-ico" });
      if (emoji) ic.setText(emoji);
      else if (notebook && accent) {
        drawNotebook(ic);
        ic.style.color = accent;
      } else (0, import_obsidian.setIcon)(ic, notebook ? "book" : "folder");
      if (accent && (emoji || !notebook)) row.style.setProperty("--pe-accent", accent);
      row.createSpan({ cls: "pe-drill-name", text: f.name });
      if (section === f.path) row.addClass("is-active");
      else if (section?.startsWith(f.path + "/")) row.addClass(twoLevel ? "is-ancestor" : "is-active");
      row.addEventListener("click", () => this.setSection(f.path));
      row.addEventListener("contextmenu", (ev) => {
        ev.preventDefault();
        this.folderMenu(f, ev);
      });
    };
    const root = this.app.vault.getRoot();
    if (root.children.some((c) => c instanceof import_obsidian.TFile)) {
      const vaultRow = pane.createDiv({ cls: "pe-notebook pe-notebook-vault" });
      if (twoLevel) vaultRow.createSpan({ cls: "pe-nb-chev" });
      const vic = vaultRow.createSpan({ cls: "pe-drill-ico" });
      (0, import_obsidian.setIcon)(vic, "home");
      vaultRow.createSpan({ cls: "pe-drill-name", text: this.app.vault.getName() });
      if (section === "/") vaultRow.addClass("is-active");
      vaultRow.addEventListener("click", () => this.setSection("/"));
    }
    for (const f of this.sectionSubfolders(root)) {
      const row = pane.createDiv({ cls: "pe-notebook", attr: { "data-path": f.path } });
      if (twoLevel) {
        const open = this.expandedNbs.has(f.path);
        const chev = row.createSpan({ cls: "pe-nb-chev" + (open ? " is-open" : "") });
        (0, import_obsidian.setIcon)(chev, "chevron-right");
        const toggle = () => {
          if (this.expandedNbs.has(f.path)) this.expandedNbs.delete(f.path);
          else this.expandedNbs.add(f.path);
          this.saveExpansion();
          this.renderNotebooks();
        };
        chev.addEventListener("click", (ev) => {
          ev.stopPropagation();
          toggle();
        });
        row.addEventListener("dblclick", (ev) => {
          if (ev.ctrlKey || ev.metaKey || ev.shiftKey) return;
          ev.preventDefault();
          window.getSelection()?.removeAllRanges();
          toggle();
        });
      }
      decorate(row, f, true);
      if (!twoLevel || !this.expandedNbs.has(f.path)) continue;
      const groups = /* @__PURE__ */ new Set();
      for (const en of this.sectionEntries(f)) if (en.group) groups.add(en.group.path);
      for (const sub of this.sectionSubfolders(f)) {
        if (groups.has(sub.path)) continue;
        const srow = pane.createDiv({ cls: "pe-notebook pe-nb-sec", attr: { "data-path": sub.path } });
        decorate(srow, sub, false);
      }
    }
  }
  /** One-shot slide on drill navigation: stepping in arrives from the right,
   *  stepping out from the left. Set by setSection, consumed here. */
  animateDrill(inner) {
    const dir = this.drillAnim;
    this.drillAnim = null;
    if (!dir) return;
    const cls = dir === "push" ? "pe-anim-push" : "pe-anim-pop";
    inner.removeClass("pe-anim-push", "pe-anim-pop");
    void inner.offsetWidth;
    inner.addClass(cls);
    inner.addEventListener("animationend", () => inner.removeClass(cls), { once: true });
  }
  /** Phones have no right-click: a still, half-second press on a row opens
   *  its context menu. Where the webview also fires a native long-press
   *  contextmenu (Android), the duplicate within the window is swallowed. */
  attachLongPress(inner) {
    let timer = null;
    let x = 0;
    let y = 0;
    let fired = false;
    let lastSynthetic = 0;
    const cancel = () => {
      if (timer != null) window.clearTimeout(timer);
      timer = null;
    };
    inner.addEventListener("pointerdown", (e) => {
      fired = false;
      if (e.pointerType !== "touch") return;
      const row = e.target.closest?.(".pe-page[data-path], .pe-drill-folder[data-path]");
      if (!row) return;
      x = e.clientX;
      y = e.clientY;
      cancel();
      timer = window.setTimeout(() => {
        timer = null;
        fired = true;
        lastSynthetic = Date.now();
        row.dispatchEvent(new MouseEvent("contextmenu", { clientX: x, clientY: y, bubbles: true }));
      }, 500);
    });
    inner.addEventListener("pointermove", (e) => {
      if (timer != null && Math.abs(e.clientX - x) + Math.abs(e.clientY - y) > 10) cancel();
    });
    inner.addEventListener("pointerup", cancel);
    inner.addEventListener("pointercancel", cancel);
    inner.addEventListener(
      "contextmenu",
      (e) => {
        if (e.isTrusted && Date.now() - lastSynthetic < 600) {
          e.stopPropagation();
          e.preventDefault();
        }
      },
      { capture: true }
    );
    inner.addEventListener(
      "click",
      (e) => {
        if (fired) {
          e.stopPropagation();
          e.preventDefault();
          fired = false;
        }
      },
      { capture: true }
    );
  }
  /** The section head, filter, and page list, shared by the desktop pages
   *  pane and the phone drill view. Chunked so a 13,000-note attachments
   *  folder can never lock the UI: 200 rows at a time, more on scroll or click. */
  renderSectionPages(inner, folder) {
    const head = inner.createDiv({ cls: "pe-pages-head" });
    const accent = this.settings.colors[folder.path];
    if (accent) {
      head.addClass("has-accent");
      head.style.setProperty("--pe-accent", accent);
      const dot = head.createSpan({ cls: "pe-sec-dot" });
      dot.style.backgroundColor = accent;
    }
    const icon = this.settings.icons[folder.path];
    head.createSpan({
      cls: "pe-pages-title",
      text: (icon ? icon + " " : "") + (folder.path === "/" ? this.app.vault.getName() : folder.name)
    });
    const allEntries = this.sectionEntries(folder);
    const countEl = head.createSpan({ cls: "pe-pages-count" });
    const btns = head.createDiv({ cls: "pe-head-btns" });
    const headBtn = (icon2, title, fn, active2 = false) => {
      const b = btns.createEl("button", { cls: "pe-eye" + (active2 ? " is-active" : ""), attr: { title } });
      (0, import_obsidian.setIcon)(b, icon2);
      b.addEventListener("click", fn);
      return b;
    };
    headBtn("plus", "New page (choose a template)", () => this.openNewPageGallery(folder));
    headBtn("locate", "Reveal active page", () => this.revealActive());
    headBtn("search", this.filterOpen ? "Hide the filter" : "Filter pages", () => {
      this.filterOpen = !this.filterOpen;
      if (!this.filterOpen) this.pagesFilter = "";
      this.renderPages();
    }, this.filterOpen);
    const liveHidden = this.liveHiddenCount();
    if (liveHidden || this.settings.hideAttachments || this.showHidden) {
      const what = [liveHidden ? `${liveHidden} hidden folder(s)` : "", this.settings.hideAttachments ? "attachments" : ""].filter(Boolean).join(" and ");
      headBtn(
        this.showHidden ? "eye-off" : "eye",
        this.showHidden ? "Tuck hidden items away" : `Show ${what}`,
        () => this.toggleHidden(),
        this.showHidden
      );
    }
    let filterInput = null;
    if (this.filterOpen) {
      const frow = inner.createDiv({ cls: "pe-filter" });
      const canContent = this.settings.searchEnabled && this.search.ready;
      filterInput = frow.createEl("input", {
        attr: { type: "text", placeholder: canContent ? "Filter pages by name or content\u2026" : "Filter pages\u2026", spellcheck: "false" }
      });
      filterInput.value = this.pagesFilter;
    }
    const list = inner.createDiv({ cls: "pe-pages-list" });
    const more = inner.createDiv({ cls: "pe-pages-more", text: "Show more" });
    const active = this.app.workspace.getActiveFile();
    let entries = allEntries;
    let shown = 0;
    const CHUNK = 200;
    const renderRow = (f, group, depth) => {
      const row = createDiv({ cls: "pe-page" + (depth ? " pe-sub" : ""), attr: { "data-path": f.path } });
      row.style.setProperty("--pe-depth", String(depth));
      list.appendChild(row);
      if (active && f.path === active.path) row.addClass("is-active");
      if (this.selectedPage === f.path) row.addClass("is-selected");
      if (this.selectedPages.has(f.path)) row.addClass("is-multi");
      if (this.cutPaths.includes(f.path)) row.addClass("is-cut");
      if (group) {
        const open = this.pagesFilter ? true : !this.collapsedGroups.has(group.path);
        const chev = row.createSpan({ cls: "pe-chevron" + (open ? " is-open" : "") });
        (0, import_obsidian.setIcon)(chev, "chevron-right");
        const toggle = () => {
          if (this.collapsedGroups.has(group.path)) this.collapsedGroups.delete(group.path);
          else this.collapsedGroups.add(group.path);
          this.saveExpansion();
          rebuildList();
        };
        chev.addEventListener("click", (ev) => {
          ev.stopPropagation();
          toggle();
        });
        row.addEventListener("dblclick", (ev) => {
          if (ev.ctrlKey || ev.metaKey || ev.shiftKey) return;
          ev.preventDefault();
          window.getSelection()?.removeAllRanges();
          toggle();
        });
      }
      row.createSpan({ cls: "pe-page-name", text: f.extension === "md" ? f.basename : f.name });
      const insideGroup = group != null && f.parent?.path === group.path;
      const pinParent = insideGroup ? group.parent : f.parent;
      const pinName = insideGroup && group ? group.name : f.name;
      if (pinParent && this.isPinned(pinParent.path, pinName)) {
        const pin = row.createSpan({ cls: "pe-pin", attr: { "aria-label": "Pinned" } });
        (0, import_obsidian.setIcon)(pin, "pin");
      }
      row.addEventListener("click", (ev) => {
        if (ev.ctrlKey || ev.metaKey) {
          this.foldSelectionIntoMulti();
          if (this.selectedPages.has(f.path)) this.selectedPages.delete(f.path);
          else this.selectedPages.add(f.path);
          this.selectAnchor = f.path;
          this.paintMulti();
          return;
        }
        if (ev.shiftKey && this.selectAnchor) {
          this.foldSelectionIntoMulti();
          const order = this.pageRowOrder();
          for (const p of rangeSelect(order, this.selectAnchor, f.path)) this.selectedPages.add(p);
          this.paintMulti();
          return;
        }
        if (this.selectedPages.size) this.clearMulti();
        this.selectAnchor = f.path;
        this.selectPage(f.path);
        void this.showPage(f);
      });
      row.addEventListener("contextmenu", (ev) => {
        ev.preventDefault();
        if (this.selectedPages.size > 1 && this.selectedPages.has(f.path)) {
          this.bulkMenu(ev);
          return;
        }
        if (this.selectedPages.size) this.clearMulti();
        const menu = new import_obsidian.Menu();
        const sibling = group != null && f.parent?.path !== group.path;
        const anchorName = group && !sibling ? group.name : f.name;
        const anchorParent = (group && !sibling ? group.parent : f.parent) ?? this.sectionFolder();
        menu.addItem(
          (i) => i.setTitle("Open in new tab").setIcon("layers").onClick(() => void this.app.workspace.getLeaf("tab").openFile(f))
        );
        menu.addSeparator();
        menu.addItem(
          (i) => i.setTitle("New page above").setIcon("arrow-up").onClick(() => void this.newPageAt(anchorParent, anchorName))
        );
        menu.addItem(
          (i) => i.setTitle("New page below").setIcon("arrow-down").onClick(() => {
            const seq = this.visibleNames(anchorParent);
            const idx = seq.indexOf(anchorName);
            void this.newPageAt(anchorParent, idx >= 0 ? seq[idx + 1] ?? null : null);
          })
        );
        menu.addItem(
          (i) => i.setTitle("New folder\u2026").setIcon("folder-plus").onClick(() => this.newFolder(anchorParent, anchorName))
        );
        menu.addSeparator();
        menu.addItem((i) => i.setTitle("Cut").setIcon("scissors").onClick(() => this.cutPages(f.path)));
        if (this.cutPaths.length) {
          menu.addItem(
            (i) => i.setTitle(this.pasteLabel(" above")).setIcon("clipboard-paste").onClick(() => void this.pasteAt(anchorParent, anchorName))
          );
          if (group) {
            menu.addItem(
              (i) => i.setTitle(this.pasteLabel(" inside")).setIcon("clipboard-paste").onClick(() => void this.pasteInto(group))
            );
          } else if (f.extension === "md") {
            menu.addItem(
              (i) => i.setTitle(this.pasteLabel(" inside")).setIcon("clipboard-paste").onClick(() => void this.pasteIntoPage(f))
            );
          }
          menu.addItem(
            (i) => i.setTitle(this.pasteLabel(" below")).setIcon("clipboard-paste").onClick(() => {
              const seq = this.visibleNames(anchorParent);
              const idx = seq.indexOf(anchorName);
              void this.pasteAt(anchorParent, idx >= 0 ? seq[idx + 1] ?? null : null);
            })
          );
        }
        menu.addSeparator();
        this.app.workspace.trigger("file-menu", menu, f, "file-explorer-context-menu");
        menu.addSeparator();
        menu.addItem((i) => {
          i.setTitle("Delete").setIcon("trash-2").onClick(() => group ? this.deleteGroup(f, group) : void this.deletePage(f));
          i.setWarning?.(true);
        });
        menu.showAtMouseEvent(ev);
      });
    };
    let contentSet = null;
    const renderEntry = (en, depth) => {
      renderRow(en.file, en.group, depth);
      const q = this.pagesFilter.toLowerCase();
      if (en.group && (q ? true : !this.collapsedGroups.has(en.group.path))) {
        for (const child of this.groupEntries(en.group)) {
          if (q && !this.entryMatches(child, q, contentSet)) continue;
          renderEntry(child, depth + 1);
        }
      }
    };
    const renderChunk = () => {
      const end = Math.min(entries.length, shown + CHUNK);
      for (; shown < end; shown++) renderEntry(entries[shown], 0);
      more.style.display = shown < entries.length ? "" : "none";
    };
    const rebuildList = () => {
      list.empty();
      shown = 0;
      const q = this.pagesFilter.toLowerCase();
      contentSet = q ? this.contentMatches(this.pagesFilter, folder) : null;
      entries = q ? allEntries.filter((en) => this.entryMatches(en, q, contentSet)) : allEntries;
      countEl.setText(q ? `${entries.length} / ${allEntries.length}` : String(allEntries.length));
      renderChunk();
      if (!entries.length && (this.paneMode === "drill" || this.paneMode === "notebooks")) {
        list.createDiv({ cls: "pe-empty", text: q ? "No pages match." : "No pages in this section yet." });
      }
    };
    filterInput?.addEventListener("input", () => {
      this.pagesFilter = filterInput.value;
      rebuildList();
    });
    more.addEventListener("click", renderChunk);
    this.pagesScrollHandler = () => {
      if (shown < entries.length && inner.scrollTop + inner.clientHeight > inner.scrollHeight - 240) renderChunk();
    };
    rebuildList();
    if (this.filterOpen) filterInput?.focus();
  }
  /** New page at an explicit position: before `before` (null = the end). A
   *  folder that sorts itself files the page by name instead. */
  async newPageAt(folder, before) {
    const f = await this.createUntitled(folder);
    if (!f) return;
    if (this.isForcedSort(folder.path)) return;
    this.settings.orders[folder.path] = insertOrder(this.visibleNames(folder), f.name, before);
    this.orderChanged();
  }
  /**
   * Deleting a page group takes its folder with it.
   *
   * A group row is one thing: a page, and the subpages under it. Deleting only
   * its note left the folder and everything in it behind, with nothing to
   * anchor it in the list, so a page you deleted came back as a stray folder
   * in the Folders block, holding the subpages you thought went with it.
   *
   * The folder goes. The note goes with it when it lives inside; when it sits
   * beside the folder instead, it has to be taken separately. Either way the
   * count says what is leaving, because this takes more than the row clicked.
   */
  deleteGroup(note, group) {
    const beside = note.parent?.path !== group.path;
    const kids = group.children.length;
    const detail = kids ? `"${group.name}" and the ${kids} item${kids === 1 ? "" : "s"} inside it follow your 'Deleted files' setting (trash by default).` : "This follows your 'Deleted files' setting (trash by default).";
    new ConfirmDeleteModal(
      this.app,
      group.name,
      () => {
        void (async () => {
          const bin = async (t) => {
            await this.app.fileManager.trashFile(t);
          };
          await bin(group);
          if (beside && this.app.vault.getAbstractFileByPath(note.path)) await bin(note);
        })();
      },
      detail
    ).open();
  }
  /** Always confirm, then delete per the user's deleted-files preference.
   *  Afterwards the neighboring page (above, else below) takes the selection,
   *  and takes the editor too when the deleted page was the one open. */
  deletePage(f) {
    new ConfirmDeleteModal(this.app, f.name, () => {
      void (async () => {
        const rows = Array.from(this.pagesEl?.querySelectorAll(".pe-page") ?? []);
        const idx = rows.findIndex((r) => r.getAttribute("data-path") === f.path);
        const neighbor = idx >= 0 ? (rows[idx - 1] ?? rows[idx + 1])?.getAttribute("data-path") ?? null : null;
        const wasActive = this.app.workspace.getActiveFile()?.path === f.path;
        await this.app.fileManager.trashFile(f);
        if (!neighbor) return;
        const nf = this.app.vault.getAbstractFileByPath(neighbor);
        if (!(nf instanceof import_obsidian.TFile)) return;
        this.selectedPage = neighbor;
        if (wasActive) await this.showPage(nf);
      })();
    }).open();
  }
  /** Context menu for a folder row in the notebooks/drill panes. Triggering
   *  the file-menu event pulls in plugin items (Move, Search, Bookmark, base
   *  actions, our own color/hide/template), but NOT the file explorer view's
   *  built-in Rename/Delete, which the view adds itself and the event never
   *  carries. So we append them here. */
  folderMenu(folder, ev) {
    const menu = new import_obsidian.Menu();
    menu.addItem(
      (i) => i.setTitle("New folder\u2026").setIcon("folder-plus").onClick(() => this.newFolder(folder.parent ?? this.app.vault.getRoot(), folder.name))
    );
    menu.addSeparator();
    this.app.workspace.trigger("file-menu", menu, folder, "file-explorer-context-menu");
    menu.addSeparator();
    menu.addItem((i) => i.setTitle("Rename\u2026").setIcon("pencil").onClick(() => this.renameFolder(folder)));
    menu.addItem((i) => {
      i.setTitle("Delete").setIcon("trash-2").onClick(() => this.deleteFolder(folder));
      i.setWarning?.(true);
    });
    menu.showAtMouseEvent(ev);
  }
  deleteFolder(folder) {
    const kids = folder.children.length;
    const detail = kids ? `"${folder.name}" and the ${kids} item${kids === 1 ? "" : "s"} inside it follow your 'Deleted files' setting (trash by default).` : "This follows your 'Deleted files' setting (trash by default).";
    new ConfirmDeleteModal(
      this.app,
      folder.name,
      () => {
        void (async () => {
          await this.app.fileManager.trashFile(folder);
        })();
      },
      detail
    ).open();
  }
  /** Make a folder inside this one, with its page. Guards mirror renameFolder:
   *  the same two ways a name can fail apply whether it is new or changed. */
  newFolder(parent, afterName) {
    new FolderNameModal(this.app, { title: "New folder", cta: "Create", value: "New folder" }, (name) => {
      void this.createFolderWithPage(parent, name, afterName);
    }).open();
  }
  /**
   * A new folder arrives holding its own page, named after it.
   *
   * Nobody makes a folder meaning to leave it empty; the page was always the
   * next thing you were going to do. It also settles where the folder appears.
   * A folder with no note has nothing to anchor a row in the pages list, so the
   * pane can only show it off to one side, out of reach of the order that ranks
   * everything else in that section. Made this way it arrives already a page:
   * in the list, in its place, and draggable from the moment it exists.
   *
   * Only below section level, where a folder's own note means "this is a page".
   * A new section keeps its note and stays a section, which is right: sections
   * are places you step into, not pages.
   */
  async createFolderWithPage(parent, name, afterName = null) {
    if (name.includes("/")) {
      new Notice("Power Explorer: a folder name can't contain '/'.");
      return;
    }
    const dest = (parent.path === "/" ? "" : parent.path + "/") + name;
    if (this.app.vault.getAbstractFileByPath(dest)) {
      new Notice("Power Explorer: a folder with that name already exists here.");
      return;
    }
    try {
      await this.app.vault.createFolder(dest);
    } catch {
      new Notice("Power Explorer: could not make that folder.");
      return;
    }
    const made = this.app.vault.getAbstractFileByPath(dest);
    const body = made instanceof import_obsidian.TFolder ? await this.newPageBody(made) : "";
    try {
      const f = await this.app.vault.create(`${dest}/${name}.md`, body);
      if (f instanceof import_obsidian.TFile) await this.app.workspace.getLeaf(false).openFile(f);
    } catch {
      new Notice("Power Explorer: made the folder, but not its page.");
    }
    if (afterName && !this.isForcedSort(parent.path)) {
      const seq = this.visibleNames(parent).filter((n) => n !== name);
      const i = seq.indexOf(afterName);
      const before = i >= 0 ? seq[i + 1] ?? null : null;
      this.settings.orders[parent.path] = insertOrder(this.visibleNames(parent), name, before);
      this.orderChanged();
    }
  }
  renameFolder(folder) {
    new FolderNameModal(this.app, { title: "Rename folder", cta: "Rename", value: folder.name }, (newName) => {
      if (newName === folder.name) return;
      if (newName.includes("/")) {
        new Notice("Power Explorer: a folder name can't contain '/'.");
        return;
      }
      const parent = folder.parent && folder.parent.path !== "/" ? folder.parent.path + "/" : "";
      const dest = parent + newName;
      if (this.app.vault.getAbstractFileByPath(dest)) {
        new Notice("Power Explorer: a folder with that name already exists here.");
        return;
      }
      void this.app.fileManager.renameFile(folder, dest);
    }).open();
  }
  /** The template note that a new page in this folder should start from: the
   *  nearest ancestor folder (or the folder itself) with a template set. */
  templateForFolder(folder) {
    const map = this.settings.pageTemplates;
    if (!map || !Object.keys(map).length) return null;
    let path = folder.path;
    for (; ; ) {
      const tp = map[path === "/" ? "/" : path];
      if (tp) {
        const tf = this.app.vault.getAbstractFileByPath(tp);
        if (tf instanceof import_obsidian.TFile) return tf;
      }
      if (path === "/" || !path) break;
      path = parentPathOf(path);
    }
    return null;
  }
  setPageTemplate(folder, templatePath) {
    if (templatePath) this.settings.pageTemplates[folder.path] = templatePath;
    else delete this.settings.pageTemplates[folder.path];
    this.queueSave();
  }
  /** The folder the template gallery draws from: the explicit setting, or a
   *  top-level "Templates" folder when the setting is blank. "" means neither
   *  exists yet, the gallery then offers only a blank page. Scanning the whole
   *  vault for "template" in the path was too greedy (it swept up research
   *  notes like "Bootstrap Templates"), so it's gone. */
  resolveTemplatesFolder() {
    const set = this.settings.templatesFolder.trim().replace(/\/+$/, "");
    if (set) return set;
    return this.app.vault.getAbstractFileByPath("Templates") instanceof import_obsidian.TFolder ? "Templates" : "";
  }
  /** The notes offered in the New-page gallery: every markdown note under the
   *  resolved templates folder. */
  templateNotes() {
    const folder = this.resolveTemplatesFolder();
    if (!folder) return [];
    return this.app.vault.getMarkdownFiles().filter((f) => f.path.startsWith(folder + "/")).sort((a, b) => a.basename.localeCompare(b.basename));
  }
  /** A folder's template shortlist: its own, or the nearest ancestor's. null
   *  when no folder above it has one, which hands scoping back to what the
   *  templates themselves claim. */
  shortlistFor(folder) {
    const map = this.settings.folderTemplates;
    if (!map || !Object.keys(map).length) return null;
    let path = folder.path || "/";
    for (; ; ) {
      const list = map[path];
      if (list?.length) return list;
      if (path === "/" || !path) return null;
      path = parentPathOf(path);
    }
  }
  /** The gallery's templates for this folder, best fit first: the folder's
   *  shortlist if any folder above it set one, otherwise how squarely each
   *  template's own `folders` property claims this folder. Nothing is hidden,
   *  so an off-book template stays one scroll or one search away. */
  templatesForFolder(folder) {
    const path = folder.path || "/";
    const shortlist = this.shortlistFor(folder);
    const defaultPath = this.templateForFolder(folder)?.path ?? null;
    const rank = (f) => shortlist ? shortlist.includes(f.path) ? 2 : 0 : templateRank(this.templateMeta(f).folders, path);
    return this.templateNotes().map((f) => ({ f, rank: rank(f), fallback: f.path === defaultPath ? 1 : 0 })).sort((a, b) => b.rank - a.rank || b.fallback - a.fallback || a.f.basename.localeCompare(b.f.basename)).map((x) => x.f);
  }
  /** What a template would call a page made in this folder right now, for the
   *  gallery card. Empty when the template names nothing in particular. */
  previewName(folder, tpl) {
    const pattern = this.patternFor(tpl);
    return pattern ? renderName(pattern, this.tokenContext(folder)).name : "";
  }
  setFolderTemplates(folder, paths) {
    if (paths.length) this.settings.folderTemplates[folder.path] = paths;
    else delete this.settings.folderTemplates[folder.path];
    this.queueSave();
  }
  /** A template note's own settings, all optional: `icon` (an emoji or Lucide
   *  icon name) and `description` (a one-line blurb) for its gallery card,
   *  `filename` for what it names the pages it makes, and `folders` for where
   *  it's offered. The original `pe-icon`/`pe-desc` names still work. */
  templateMeta(f) {
    const fm = this.app.metadataCache.getFileCache(f)?.frontmatter;
    const pick = (a, b) => typeof fm?.[a] === "string" ? fm[a] : typeof fm?.[b] === "string" ? fm[b] : "";
    return {
      icon: pick("icon", "pe-icon"),
      desc: pick("description", "pe-desc"),
      filename: typeof fm?.filename === "string" ? fm.filename : "",
      folders: folderScopes(fm?.folders),
      destination: typeof fm?.destination === "string" ? fm.destination.trim().replace(/^\.?\//, "").replace(/\/+$/, "") : "",
      unique: fm?.unique,
      ask: fm?.ask
    };
  }
  /** Whether this template's {{ask}} questions should be put to the user: its
   *  own `ask` property when it states one, otherwise the vault-wide setting.
   *  A template that asks nothing is unaffected either way. */
  asksQuestions(meta) {
    const own = meta?.ask;
    if (own === true || own === "true" || own === "yes") return true;
    if (own === false || own === "false" || own === "no") return false;
    return this.settings.askForAnswers;
  }
  /** The folder at `path`, made if it isn't there yet. Null when the path is
   *  taken by a note, or the vault refuses it: the caller then falls back to
   *  the folder the page was asked for, which always exists. */
  async ensureFolder(path) {
    const existing = this.app.vault.getAbstractFileByPath(path);
    if (existing instanceof import_obsidian.TFolder) return existing;
    if (existing) return null;
    try {
      await this.app.vault.createFolder(path);
    } catch {
    }
    const made = this.app.vault.getAbstractFileByPath(path);
    if (made instanceof import_obsidian.TFolder) return made;
    new Notice(`Power Explorer: couldn't make the folder "${path}"; putting the page where you asked instead.`);
    return null;
  }
  /** The note names (no extension) directly inside a folder. */
  pageNames(folder) {
    return folder.children.filter((c) => c instanceof import_obsidian.TFile && c.extension === "md").map((c) => c.basename);
  }
  /**
   * Replace a template's {{rollover}} with the unfinished tasks of the previous
   * dated page in the same folder, so Monday's note opens carrying what Friday
   * left behind. The old page is only ever READ: work moves forward by being
   * copied, and nothing quietly edits a note you aren't looking at.
   *
   * Substituted before the tokens are rendered, so the cursor offset counts the
   * tasks that landed above it.
   */
  async fillRollover(body, folder, name) {
    if (!body.includes("{{rollover")) return body;
    const key = dateKeyIn(name);
    const prev = key ? previousDatedName(this.pageNames(folder).filter((n) => n !== name), key) : null;
    const file = prev ? this.app.vault.getAbstractFileByPath((folder.path === "/" ? "" : folder.path + "/") + prev + ".md") : null;
    let tasks = [];
    if (file instanceof import_obsidian.TFile) {
      try {
        tasks = unfinishedTasks(await this.app.vault.read(file));
      } catch {
      }
    }
    return body.replace(
      /\{\{\s*rollover\s*(?::([^}]*))?\}\}/g,
      (_w, empty) => tasks.length ? tasks.join("\n") : (empty ?? "").trim()
    );
  }
  /** What the `{{...}}` tokens in a filename or body resolve against for a page
   *  being created in this folder. */
  tokenContext(folder) {
    const root = folder.path === "/" || !folder.path;
    return {
      now: /* @__PURE__ */ new Date(),
      folder: root ? this.app.vault.getName() : folder.name,
      folderPath: root ? "/" : folder.path,
      parent: folder.parent && folder.parent.path !== "/" ? folder.parent.name : this.app.vault.getName(),
      vault: this.app.vault.getName()
    };
  }
  /** The naming pattern for a page from this template: the template's own
   *  `filename`, else the vault-wide default, else nothing (plain "Untitled"). */
  patternFor(tpl) {
    const own = tpl ? this.templateMeta(tpl).filename.trim() : "";
    return own || this.settings.filenamePattern.trim();
  }
  /** Render a template's icon into `el`. A vault image (wikilink or path) draws
   *  as an <img>; a plain lowercase token is a Lucide icon name; anything else
   *  (an emoji or other glyph) is shown as text; nothing set falls back to a
   *  page glyph. */
  renderTemplateIcon(el, icon) {
    el.empty();
    if (!icon) {
      (0, import_obsidian.setIcon)(el, "file-text");
      return;
    }
    const img = this.resolveIconImage(icon);
    if (img) {
      el.createEl("img", { cls: "pe-tpl-img", attr: { src: this.app.vault.getResourcePath(img) } });
    } else if (/^[a-z0-9][a-z0-9-]*$/.test(icon)) {
      (0, import_obsidian.setIcon)(el, icon);
    } else {
      el.setText(icon);
    }
  }
  /** The vault image an icon value points at (a `[[wikilink]]` or a path),
   *  or null when the value isn't an image reference. */
  resolveIconImage(icon) {
    const val = icon.trim();
    const wl = val.match(/^\[\[(.+?)\]\]$/);
    if (wl) {
      const f = this.app.metadataCache.getFirstLinkpathDest(wl[1], "");
      return f instanceof import_obsidian.TFile && ICON_IMAGE_EXTS.has(f.extension.toLowerCase()) ? f : null;
    }
    if (/\.(png|jpe?g|gif|webp|svg)$/i.test(val)) {
      const f = this.app.vault.getAbstractFileByPath(val);
      return f instanceof import_obsidian.TFile ? f : null;
    }
    return null;
  }
  /** Write the chosen icon into a template's frontmatter, retiring the legacy
   *  pe-icon key if it was there. */
  async setTemplateIcon(file, value) {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      if (value) fm.icon = value;
      else delete fm.icon;
      delete fm["pe-icon"];
    });
  }
  /** Create a starter template note (seeded from the New-template starter
   *  setting, or the built-in default) in the templates folder, then open it
   *  for editing. Pins the templates folder on first use so the gallery can
   *  find what you make. */
  async newTemplate() {
    let folder = this.settings.templatesFolder.trim().replace(/\/+$/, "");
    if (!folder) {
      folder = this.resolveTemplatesFolder() || "Templates";
      this.settings.templatesFolder = folder;
      this.queueSave();
    }
    if (!(this.app.vault.getAbstractFileByPath(folder) instanceof import_obsidian.TFolder)) {
      try {
        await this.app.vault.createFolder(folder);
      } catch {
      }
    }
    let name = "New template";
    for (let i = 1; this.app.vault.getAbstractFileByPath(`${folder}/${name}.md`); i++) name = `New template ${i}`;
    const seed = this.settings.templateSeed.trim() ? this.settings.templateSeed : DEFAULT_TEMPLATE_SEED;
    let f;
    try {
      f = await this.app.vault.create(`${folder}/${name}.md`, seed);
    } catch {
      new Notice(`Power Explorer: couldn't create a template in "${folder}". Check the Templates folder setting.`);
      return null;
    }
    if (!(f instanceof import_obsidian.TFile)) return null;
    await this.app.workspace.getLeaf(false).openFile(f);
    this.execCommand("workspace:edit-file-title");
    return f;
  }
  execCommand(id) {
    this.app.commands?.executeCommandById?.(id);
  }
  /** Create a page in `folder`. `template` undefined = the folder's default
   *  (nearest-ancestor) template; null = an explicit blank page; a TFile =
   *  that gallery template. The template names the page as well as filling it:
   *  its `filename` pattern is rendered against today, and template-only
   *  frontmatter is stripped from the copy. */
  async createUntitled(folder, template) {
    const tpl = template === void 0 ? this.templateForFolder(folder) : template;
    const meta = tpl ? this.templateMeta(tpl) : null;
    const dest = meta?.destination && await this.ensureFolder(meta.destination) || folder;
    const prefix = dest.path === "/" ? "" : dest.path + "/";
    const ctx = this.tokenContext(dest);
    let pattern = this.patternFor(tpl);
    const taken = (n) => !!this.app.vault.getAbstractFileByPath(prefix + n + ".md");
    let raw = "";
    if (tpl) {
      try {
        raw = stripTemplateMeta(await this.app.vault.read(tpl));
      } catch {
        new Notice("Power Explorer: could not read the template; making a blank page.");
      }
    }
    const fields = askFields(pattern, raw);
    if (fields.length && this.asksQuestions(meta)) {
      const answers = await new Promise(
        (resolve) => new TemplateAskModal(this.app, tpl?.basename ?? "New page", fields, resolve).open()
      );
      if (!answers) return null;
      pattern = applyAnswers(pattern, answers);
      raw = applyAnswers(raw, answers);
    } else {
      pattern = applyAnswers(pattern, {});
      raw = applyAnswers(raw, {});
    }
    const rendered = pattern ? renderName(pattern, ctx) : { name: "Untitled", select: null };
    const already = meta?.unique != null ? uniqueMatch(meta.unique, this.pageNames(dest), rendered.name) : null;
    if (already) {
      const f2 = this.app.vault.getAbstractFileByPath(prefix + already + ".md");
      if (f2 instanceof import_obsidian.TFile) {
        await this.showPage(f2);
        return f2;
      }
    }
    const name = pattern ? uniqueName(rendered.name, taken) : uniqueName("Untitled", taken, " ", 1);
    const made = renderBodyAt(await this.fillRollover(raw, dest, rendered.name), ctx);
    const body = made.body;
    const cursor = made.cursor;
    const f = await this.app.vault.create(prefix + name + ".md", body);
    if (!(f instanceof import_obsidian.TFile)) return null;
    await this.app.workspace.getLeaf(false).openFile(f);
    if (!pattern || rendered.select) this.execCommand("workspace:edit-file-title");
    if (rendered.select) this.selectInInlineTitle(name, rendered.select);
    else if (cursor != null) this.placeCursor(cursor);
    return f;
  }
  /**
   * Put the cursor where the template's {{cursor}} asked for it.
   *
   * This is about Live Preview, where the cursor decides what renders. A page
   * that opens with the cursor sitting in a code block (a daily note whose
   * agenda block comes first) shows that block's raw source until you click
   * away, which reads as the block being broken. Landing the cursor where you
   * actually write means the page looks right the moment it opens.
   */
  placeCursor(offset) {
    window.setTimeout(() => {
      const editor = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView)?.editor;
      if (!editor) return;
      editor.setCursor(editor.offsetToPos(Math.min(offset, editor.getValue().length)));
      editor.focus();
    }, 0);
  }
  /**
   * Preselect the generic part of a just-created name, so a page called
   * "2026-07-28 Meeting Name" is one keystroke from "2026-07-28 Alpha sync"
   * with the date left alone. Obsidian's own rename selects the whole title;
   * this narrows it once the inline title has actually rendered.
   *
   * Every step is guarded: a title element that isn't there, or holds text we
   * didn't write, means Obsidian changed something, and the right answer is to
   * leave its whole-name selection alone rather than mangle the rename.
   */
  selectInInlineTitle(name, range) {
    window.setTimeout(() => {
      const view = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
      const el = view?.containerEl.querySelector(".inline-title");
      if (!el || el.textContent !== name) return;
      const node = el.firstChild;
      if (!node || node.nodeType !== Node.TEXT_NODE || (node.textContent?.length ?? 0) < range.end) return;
      try {
        const r = document.createRange();
        r.setStart(node, range.start);
        r.setEnd(node, range.end);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(r);
      } catch {
      }
    }, 0);
  }
  /** Open the Notion-style gallery, then make the chosen page (blank or from a
   *  template) in `folder`. Always opens the picker; Blank page is the first
   *  card, so a plain page is a single Enter away. */
  openNewPageGallery(folder) {
    new PageTemplateGallery(this, folder, async (tpl) => {
      await this.createUntitled(folder, tpl);
      this.renderPages();
    }).open();
  }
  /** Ribbon "New page": open the gallery for the most useful folder, the
   *  current section when the pages pane is up, otherwise the folder of the note
   *  you're in, otherwise the vault root. */
  ribbonNewPage() {
    this.openNewPageGallery(this.currentFolder());
  }
  /** The folder a page asked for from outside the tree should land in: the
   *  current section when the pages pane is up, otherwise the folder of the
   *  note you're in, otherwise the vault root. */
  currentFolder() {
    const active = this.app.workspace.getActiveFile();
    return this.pagesEl && !this.isRecent() ? this.sectionFolder() : active?.parent instanceof import_obsidian.TFolder ? active.parent : this.app.vault.getRoot();
  }
  /** Re-sync the per-template commands when a path inside the templates folder
   *  appears, moves, or goes. Debounced: a folder full of templates arriving at
   *  once (a sync, a restore) should rebuild the list once, not per file. */
  templatesChanged(...paths) {
    const root = this.resolveTemplatesFolder();
    if (!root || !paths.some((p) => p && (p === root || p.startsWith(root + "/")))) return;
    if (this.tplCommandTimer != null) window.clearTimeout(this.tplCommandTimer);
    this.tplCommandTimer = window.setTimeout(() => {
      this.tplCommandTimer = null;
      this.syncTemplateCommands();
      this.refreshSettingsTab?.();
    }, 300);
  }
  /** A stable id for a template's command. Derived from the note's PATH, so
   *  the hotkey you bind survives a restart; moving or renaming the template
   *  mints a new id, which is the honest trade for not tracking identity in a
   *  file Obsidian owns. */
  tplCommandId(f) {
    return "new-from-" + f.path.replace(/\.md$/i, "").replace(/[^A-Za-z0-9]+/g, "-").toLowerCase();
  }
  /**
   * Give every template its own command, so a daily note is a hotkey rather
   * than a trip through the gallery. Rebuilt whenever the set of templates
   * changes: added notes gain commands, removed ones lose them, and the ids of
   * everything else stay exactly as they were so bound hotkeys survive.
   */
  syncTemplateCommands() {
    const notes = this.templateNotes();
    const wanted = new Map(notes.map((f) => [this.tplCommandId(f), f]));
    for (const id of [...this.tplCommandIds]) {
      if (wanted.has(id)) continue;
      this.app.commands?.removeCommand?.(
        `${this.manifest.id}:${id}`
      );
      this.tplCommandIds.delete(id);
    }
    for (const [id, f] of wanted) {
      if (this.tplCommandIds.has(id)) continue;
      this.tplCommandIds.add(id);
      this.addCommand({
        id,
        name: `New page: ${f.basename}`,
        icon: "file-plus",
        callback: () => {
          const live = this.app.vault.getAbstractFileByPath(f.path);
          if (!(live instanceof import_obsidian.TFile)) {
            new Notice(`Power Explorer: the template "${f.basename}" is gone.`);
            return;
          }
          void this.createUntitled(this.currentFolder(), live).then(() => this.renderPages());
        }
      });
    }
  }
  /* -------- launcher favorites -------- */
  isFavoriteCommand(id) {
    return this.settings.launcherFavorites.includes(id);
  }
  toggleFavoriteCommand(id) {
    const favs = this.settings.launcherFavorites;
    const i = favs.indexOf(id);
    if (i >= 0) favs.splice(i, 1);
    else favs.push(id);
    this.queueSave();
  }
  setFavoriteOrder(ids) {
    this.settings.launcherFavorites = ids;
    this.queueSave();
  }
  setLauncherAppOrder(app, ids) {
    this.settings.launcherOrder[app] = ids;
    this.queueSave();
  }
  selectPage(path) {
    this.selectedPage = path;
    this.pagesEl?.querySelectorAll(".pe-page.is-selected").forEach((el) => el.removeClass("is-selected"));
    if (path) this.pagesEl?.querySelector(`.pe-page[data-path="${CSS.escape(path)}"]`)?.addClass("is-selected");
  }
  /* ---------------- pages multi-select ---------------- */
  /* ---------------- cut and paste ---------------- */
  /**
   * Cut: mark pages and go find where they belong.
   *
   * Dragging is the direct way to move a page and the wrong way to move seven
   * of them into a folder three screens up: you are holding the whole list
   * hostage to one long scroll, and a slip drops them somewhere you did not
   * mean. Cut and paste splits that in two, say what moves, then go say where
   *, and the two halves can be minutes and a lot of scrolling apart.
   *
   * The pages stay exactly where they are until something is pasted. Nothing is
   * copied to the system clipboard: this is a marked set inside the pane, and
   * Escape or a second cut is all it takes to call it off.
   */
  cutPages(clicked) {
    const paths = this.selectedPages.size > 1 && this.selectedPages.has(clicked) ? [...this.selectedPages] : [clicked];
    this.cutPaths = this.pageRowOrder().filter((p) => paths.includes(p));
    if (!this.cutPaths.length) this.cutPaths = paths;
    this.paintCut();
    const n = this.cutPaths.length;
    new Notice(`Power Explorer: ${n} page${n === 1 ? "" : "s"} cut. Right-click a folder or a page to paste.`);
  }
  clearCut() {
    if (!this.cutPaths.length) return;
    this.cutPaths = [];
    this.paintCut();
  }
  /** Reflect the pending cut onto the rows without a full repaint. */
  paintCut() {
    this.pagesEl?.querySelectorAll(".pe-page").forEach((el) => {
      const p = el.getAttribute("data-path");
      el.toggleClass("is-cut", !!p && this.cutPaths.includes(p));
    });
  }
  /** The cut pages as the items that actually have to move, or empty when the
   *  destination is one of them (pasting a folder into itself). */
  cutFilesFor(dest) {
    const files = this.moveUnits(this.cutPaths);
    if (files.some((f) => isUnder(dest.path, f.path))) {
      new Notice("Power Explorer: that would paste a folder into itself.");
      return [];
    }
    return files;
  }
  /** Paste at a position among a folder's pages, the drop the drag would have
   *  made, without the drag. */
  async pasteAt(parent, before) {
    const files = this.cutFilesFor(parent);
    if (!files.length) return;
    const n = this.cutPaths.length;
    this.clearCut();
    await this.dropAt(files, parent, before);
    new Notice(`Power Explorer: pasted ${n} page${n === 1 ? "" : "s"} into ${parent.name || this.app.vault.getName()}.`);
  }
  /** Paste into a folder: the same move a drop onto a folder row makes, so the
   *  pages arrive unranked and land per the "unarranged items" setting. */
  async pasteInto(folder) {
    const files = this.cutFilesFor(folder);
    if (!files.length) return;
    const n = this.cutPaths.length;
    this.clearCut();
    await this.moveInto(files, folder);
    new Notice(`Power Explorer: pasted ${n} page${n === 1 ? "" : "s"} into ${folder.name || this.app.vault.getName()}.`);
  }
  /** Paste inside a plain page: it becomes a group first, exactly as dropping
   *  onto it does. The cut is only cleared once the folder actually exists, so
   *  a page that cannot take one leaves the pages still cut and still there. */
  async pasteIntoPage(page) {
    if (!this.cutPaths.length) return;
    const folder = await this.pageToGroup(page);
    if (!folder) return;
    await this.pasteInto(folder);
  }
  /** "Paste" or "Paste 7", so a menu never reads as one page when it is seven. */
  pasteLabel(suffix = "") {
    const n = this.cutPaths.length;
    return `Paste${n > 1 ? " " + n : ""}${suffix}`;
  }
  /**
   * Keep the selection pointing at real pages when one moves or goes away.
   * `to` is null for a delete, and a folder carries everything under it.
   *
   * Dragging a selection into another folder renames every page in it, and a
   * set still holding the old paths is a selection you can see but not act on:
   * the rows repaint unlit while the bulk menu counts pages that no longer
   * exist. It costs one pass over a handful of strings, so it is not worth
   * being clever about which kind of change could have moved them.
   */
  selectionFollows(from, to) {
    const moved = (p) => !isUnder(p, from) ? p : to ? to + p.slice(from.length) : null;
    if (this.selectedPage) this.selectedPage = moved(this.selectedPage);
    if (this.selectAnchor) this.selectAnchor = moved(this.selectAnchor);
    if (this.cutPaths.length) this.cutPaths = this.cutPaths.map(moved).filter((p) => !!p);
    if (!this.selectedPages.size) return;
    const next = /* @__PURE__ */ new Set();
    for (const p of this.selectedPages) {
      const m = moved(p);
      if (m) next.add(m);
    }
    this.selectedPages = next;
  }
  /** The visible page rows' paths, top to bottom, for range selection. */
  pageRowOrder() {
    return Array.from(this.pagesEl?.querySelectorAll(".pe-page[data-path]") ?? []).map(
      (el) => el.getAttribute("data-path")
    );
  }
  /**
   * Fold the single selection into the multi-selection, so a modifier-click
   * extends what you can see selected instead of starting up beside it.
   *
   * A plain click and a Ctrl-click write to different places: one page in
   * `selectedPage`, a set of them in `selectedPages`. Click a page and
   * Ctrl-click the next and both light up, but the set holds only the second
   * so a selection that reads as two counts as one, the bulk menu (which wants
   * two) never appears, and Delete takes the second page alone. The two rows
   * even look different, one outlined and one barred, which is the state saying
   * out loud what went wrong.
   *
   * The single highlight goes when the page joins the set: one page cannot be
   * selected two ways at once.
   */
  foldSelectionIntoMulti() {
    if (!this.selectedPage) return;
    this.selectedPages.add(this.selectedPage);
    this.selectPage(null);
  }
  /** Reflect the multi-selection onto the rows without a full repaint. */
  paintMulti() {
    this.pagesEl?.querySelectorAll(".pe-page").forEach((el) => {
      const p = el.getAttribute("data-path");
      el.toggleClass("is-multi", !!p && this.selectedPages.has(p));
    });
  }
  clearMulti() {
    this.selectedPages.clear();
    this.pagesEl?.querySelectorAll(".pe-page.is-multi").forEach((el) => el.removeClass("is-multi"));
  }
  /** The bulk-action menu for a multi-selection: open all, pin/unpin, delete. */
  bulkMenu(ev) {
    const files = [...this.selectedPages].map((p) => this.app.vault.getAbstractFileByPath(p)).filter((f) => f instanceof import_obsidian.TFile);
    if (!files.length) return;
    const n = files.length;
    const menu = new import_obsidian.Menu();
    menu.addItem(
      (i) => i.setTitle(`Cut ${n}`).setIcon("scissors").onClick(() => this.cutPages(files[0].path))
    );
    menu.addSeparator();
    menu.addItem(
      (i) => i.setTitle(`Open ${n} in new tabs`).setIcon("layers").onClick(() => {
        for (const f of files) void this.app.workspace.getLeaf("tab").openFile(f);
        this.clearMulti();
      })
    );
    const allPinned = files.every((f) => f.parent && this.isPinned(f.parent.path, f.name));
    menu.addItem(
      (i) => i.setTitle(allPinned ? `Unpin ${n}` : `Pin ${n} to top`).setIcon(allPinned ? "pin-off" : "pin").onClick(() => {
        for (const f of files) if (f.parent && this.isPinned(f.parent.path, f.name) === allPinned) this.togglePin(f.parent, f.name);
        this.clearMulti();
        if (this.pagesEl) this.renderPages();
      })
    );
    menu.addSeparator();
    menu.addItem((i) => {
      i.setTitle(`Delete ${n}`).setIcon("trash-2").onClick(() => this.bulkDelete(files));
      i.setWarning?.(true);
    });
    menu.showAtMouseEvent(ev);
  }
  /**
   * What has to travel when this row moves, anchor first.
   *
   * A page group is a folder and a note wearing one name, so moving the note
   * alone dissolves it, and for the shape where the note lives INSIDE the
   * folder, moving the note is also moving it out of its own folder, which
   * leaves a stray folder holding the subpages you thought you were dragging.
   * The anchor is whichever half the parent's order actually ranks: the folder
   * when the note is inside it, the note when it sits beside.
   */
  moveUnit(file) {
    if (!(file instanceof import_obsidian.TFile)) return [file];
    const group = this.groupOf(file);
    if (!group) return [file];
    return file.parent?.path === group.path ? [group] : [file, group];
  }
  /** Page paths as move units, in the order the list shows the rows, with no
   *  item listed twice (a group and a subpage of it can both be selected). */
  moveUnits(paths) {
    const want = new Set(paths);
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    for (const p of this.pageRowOrder()) {
      if (!want.has(p)) continue;
      const f = this.app.vault.getAbstractFileByPath(p);
      if (!f) continue;
      for (const u of this.moveUnit(f)) if (!seen.has(u.path)) {
        seen.add(u.path);
        out.push(u);
      }
    }
    return out;
  }
  /**
   * Where a page row sits in an order: the item its parent actually ranks, and
   * that parent.
   *
   * For most rows this is the note itself. For a group whose note lives INSIDE
   * its folder it is the folder, the note is not the section's child at all,
   * it is one level down, so reading the drop position off the note aims every
   * calculation at the wrong folder. That is the difference between dropping a
   * page above a group and dropping it inside the group by accident.
   */
  rowAnchor(f) {
    const group = f instanceof import_obsidian.TFile ? this.groupOf(f) : null;
    const item = group && f.parent?.path === group.path ? group : f;
    return item.parent ? { item, parent: item.parent } : null;
  }
  /** The same, read straight off a rendered row. */
  rowAnchorAt(row) {
    const p = row?.getAttribute("data-path");
    const f = p ? this.app.vault.getAbstractFileByPath(p) : null;
    return f ? this.rowAnchor(f) : null;
  }
  /** The folder a page anchors as a group, in either shape, the note inside
   *  it, or the note beside it, or null for a plain page. */
  groupOf(f) {
    const parent = f.parent;
    if (parent && this.groupNote(parent)?.path === f.path) return parent;
    const beside = parent?.children.find((c) => c instanceof import_obsidian.TFolder && c.name === f.basename);
    return beside instanceof import_obsidian.TFolder ? beside : null;
  }
  /**
   * Confirm once, then delete every selected page per the trash preference.
   *
   * A group row is a page AND its folder, so a bulk delete has to take both for
   * the same reason deleteGroup does: the note alone leaves the folder and its
   * subpages behind with nothing to anchor them, and a page you deleted comes
   * back as a stray folder in the Folders block. Deleting one at a time already
   * knew this; deleting many did not, which is the worse place to forget it.
   */
  bulkDelete(files) {
    const bin = [];
    for (const f of files) {
      const group = this.groupOf(f);
      if (!group) {
        bin.push(f);
        continue;
      }
      bin.push(group);
      if (f.parent?.path !== group.path) bin.push(f);
    }
    const groups = bin.filter((t) => t instanceof import_obsidian.TFolder).length;
    const trash = "This follows your 'Deleted files' setting (trash by default).";
    const detail = groups ? `${groups === 1 ? "One is a page group: its folder and everything inside go" : `${groups} are page groups: their folders and everything inside go`} too. ${trash}` : trash;
    new ConfirmDeleteModal(
      this.app,
      `${files.length} pages`,
      () => {
        void (async () => {
          for (const t of bin) {
            if (!this.app.vault.getAbstractFileByPath(t.path)) continue;
            await this.app.fileManager.trashFile(t);
          }
          this.clearMulti();
          new Notice(`Power Explorer: deleted ${files.length} pages.`);
        })();
      },
      detail
    ).open();
  }
  /** Keyboard control for the pages pane: arrows move, Enter opens,
   *  Alt+Up/Down nudges the manual order without a drag. */
  pagesKeydown(e) {
    if (e.target?.tagName === "INPUT" && e.key !== "Escape") return;
    const rows = Array.from(this.pagesEl?.querySelectorAll(".pe-page") ?? []);
    if (!rows.length) return;
    const idx = rows.findIndex((r) => r.hasClass("is-selected"));
    const cur = idx >= 0 ? idx : rows.findIndex((r) => r.hasClass("is-active"));
    if (e.key === "Escape") {
      if (this.cutPaths.length) {
        this.clearCut();
        e.preventDefault();
        return;
      }
      if (this.filterOpen) {
        this.filterOpen = false;
        this.pagesFilter = "";
        this.renderPages();
        e.preventDefault();
        return;
      }
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === "x" || e.key === "X") && cur >= 0) {
      this.cutPages(rows[cur].getAttribute("data-path"));
      e.preventDefault();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === "v" || e.key === "V") && this.cutPaths.length) {
      const row = rows[cur];
      const file = row ? this.app.vault.getAbstractFileByPath(row.getAttribute("data-path")) : null;
      const parent = file?.parent ?? this.sectionFolder();
      const seq = this.visibleNames(parent);
      const i = file ? seq.indexOf(file.name) : -1;
      void this.pasteAt(parent, i >= 0 ? seq[i + 1] ?? null : null);
      e.preventDefault();
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const delta = e.key === "ArrowDown" ? 1 : -1;
      if (e.altKey) {
        const me = this.rowAnchorAt(rows[cur]);
        if (!me) return;
        const target = this.rowAnchorAt(rows[cur + delta]);
        let before;
        if (delta < 0) before = target?.item.name ?? null;
        else {
          if (!target) return;
          before = this.rowAnchorAt(rows[cur + 2])?.item.name ?? null;
        }
        this.selectedPage = rows[cur].getAttribute("data-path");
        void this.dropAt([me.item], me.parent, before);
      } else {
        const next = Math.max(0, Math.min(rows.length - 1, cur + delta));
        this.selectPage(rows[next].getAttribute("data-path"));
        rows[next].scrollIntoView({ block: "nearest" });
      }
      e.preventDefault();
      return;
    }
    if (e.key === "Enter" && cur >= 0) {
      const f = this.app.vault.getAbstractFileByPath(rows[cur].getAttribute("data-path"));
      if (f instanceof import_obsidian.TFile) void this.showPage(f);
      e.preventDefault();
    }
  }
  startDividerDrag(e, container) {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startW = this.settings.sectionWidth || 240;
    const move = (ev) => {
      const w = Math.max(140, Math.min(560, startW + (ev.clientX - startX)));
      this.settings.sectionWidth = w;
      container.style.setProperty("--pe-split", w + "px");
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      this.queueSave();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }
  /* ---------------- drag to reorder ---------------- */
  onPointerDown(e) {
    if (this.drag) this.cancelDrag();
    if (!this.settings.dragEnabled || e.button !== 0) return;
    if (e.pointerType === "touch") return;
    const target = e.target;
    if (!target?.closest) return;
    const title = target.closest(
      ".nav-file-title[data-path], .nav-folder-title[data-path], .pe-page[data-path], .pe-notebook[data-path], .pe-drill-folder[data-path]"
    );
    if (!title || !title.closest(".nav-files-container, .pe-pages, .pe-notebooks-pane")) return;
    if (title.closest(".pe-recent-list")) return;
    if (target.closest(".nav-folder-collapse-indicator")) return;
    const path = title.getAttribute("data-path");
    const file = path ? this.app.vault.getAbstractFileByPath(path) : null;
    if (!file) return;
    const multi = title.hasClass("pe-page") && this.selectedPages.size > 1 && this.selectedPages.has(file.path);
    const unit = this.moveUnit(file);
    const files = multi ? this.moveUnits([...this.selectedPages]) : unit;
    if (!files.length) return;
    this.drag = {
      file: unit[0],
      files,
      paths: new Set(files.map((f) => f.path)),
      titleEl: title,
      scrollEl: title.closest(".nav-files-container, .pe-pages-inner, .pe-notebooks-pane"),
      startX: e.clientX,
      startY: e.clientY,
      active: false,
      ghost: null,
      line: null,
      intoEl: null,
      mode: "none",
      dropParent: null,
      before: null,
      intoFolder: null,
      intoPage: null
    };
    title.draggable = false;
  }
  onPointerMove(e) {
    const d = this.drag;
    if (!d) return;
    if (!d.active) {
      if (Math.abs(e.clientX - d.startX) + Math.abs(e.clientY - d.startY) < 6) return;
      d.active = true;
      document.body.addClass("pe-dragging");
      const rows = this.selectedPages.size > 1 && d.paths.size > 1 ? this.selectedPages.size : 1;
      d.ghost = document.body.createDiv({ cls: "pe-ghost", text: rows > 1 ? `${rows} pages` : d.file.name });
      d.line = document.body.createDiv({ cls: "pe-line" });
    }
    e.preventDefault();
    d.ghost.style.left = e.clientX + 14 + "px";
    d.ghost.style.top = e.clientY + 10 + "px";
    this.resolveDrop(e);
    this.autoscroll(e);
  }
  /** Where would releasing right now land? Between two siblings (reorder /
   *  positional move) or onto a folder's middle (move into, unranked). */
  resolveDrop(e) {
    const d = this.drag;
    d.mode = "none";
    d.dropParent = null;
    d.before = null;
    d.intoFolder = null;
    d.intoPage = null;
    d.line.removeClass("pe-line-on");
    if (d.intoEl) {
      d.intoEl.removeClass("pe-into");
      d.intoEl = null;
    }
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el?.closest) return;
    if (el.closest(".pe-notebooks-pane")) {
      this.resolveNotebooksDrop(e, el);
      return;
    }
    const pages = el.closest(".pe-pages");
    if (pages) {
      this.resolvePagesDrop(e, el);
      return;
    }
    const container = el.closest(".nav-files-container");
    if (!container) return;
    let title = el.closest(".nav-file-title[data-path], .nav-folder-title[data-path]");
    if (!title) {
      const block = el.closest(".nav-folder, .nav-file");
      title = block?.querySelector(":scope > .nav-folder-title[data-path], :scope > .nav-file-title[data-path]") ?? null;
    }
    if (!title) {
      const rows = container.querySelectorAll(".nav-folder-title[data-path], .nav-file-title[data-path]");
      const last = rows[rows.length - 1];
      if (!last || e.clientY <= last.getBoundingClientRect().bottom) return;
      d.mode = "reorder";
      d.dropParent = this.app.vault.getRoot();
      d.before = null;
      const lr = last.getBoundingClientRect();
      const s2 = d.line.style;
      d.line.addClass("pe-line-on");
      s2.left = lr.left + "px";
      s2.width = lr.width + "px";
      s2.top = lr.bottom - 1 + "px";
      return;
    }
    const overPath = title.getAttribute("data-path");
    if (this.dragCarries(d, overPath)) return;
    const overFile = this.app.vault.getAbstractFileByPath(overPath);
    if (!overFile) return;
    const rect = title.getBoundingClientRect();
    const frac = (e.clientY - rect.top) / Math.max(1, rect.height);
    if (overFile instanceof import_obsidian.TFolder) {
      const sibling = overFile.parent?.path === d.file.parent?.path;
      const lo = sibling ? 0.4 : 0.25;
      if (frac > lo && frac < 1 - lo) {
        d.mode = "into";
        d.intoFolder = overFile;
        d.intoEl = title;
        title.addClass("pe-into");
        return;
      }
    }
    const parent = overFile.parent;
    if (!parent) return;
    const seq = this.visibleNames(parent);
    const idx = seq.indexOf(overFile.name);
    if (idx < 0) return;
    const before = frac < 0.5;
    d.mode = "reorder";
    d.dropParent = parent;
    d.before = before ? overFile.name : seq[idx + 1] ?? null;
    const y = before ? rect.top : rect.bottom;
    const s = d.line.style;
    d.line.addClass("pe-line-on");
    s.left = rect.left + "px";
    s.width = rect.width + "px";
    s.top = y - 1 + "px";
  }
  /** Shared folder-row drop math for our own panes (notebook, section, and
   *  drill-folder rows): edges reorder among the row's real siblings, the
   *  middle nests into the folder. A dragged NOTE is into-only, its rank
   *  among folder rows would be invisible where pages don't render. */
  resolveFolderRowDrop(e, row) {
    const d = this.drag;
    const overPath = row.getAttribute("data-path");
    if (this.dragCarries(d, overPath)) return;
    const overFile = this.app.vault.getAbstractFileByPath(overPath);
    if (!(overFile instanceof import_obsidian.TFolder)) return;
    const rect = row.getBoundingClientRect();
    const frac = (e.clientY - rect.top) / Math.max(1, rect.height);
    const setInto = () => {
      d.mode = "into";
      d.intoFolder = overFile;
      d.intoEl = row;
      row.addClass("pe-into");
    };
    if (!(d.file instanceof import_obsidian.TFolder)) {
      setInto();
      return;
    }
    const sibling = overFile.parent?.path === d.file.parent?.path;
    const lo = sibling ? 0.4 : 0.25;
    if (frac > lo && frac < 1 - lo) {
      setInto();
      return;
    }
    const parent = overFile.parent;
    if (!parent) return;
    if (parent.path === d.file.path || parent.path.startsWith(d.file.path + "/")) return;
    const seq = this.visibleNames(parent);
    const idx = seq.indexOf(overFile.name);
    if (idx < 0) return;
    const before = frac < 0.5;
    d.mode = "reorder";
    d.dropParent = parent;
    d.before = before ? overFile.name : seq[idx + 1] ?? null;
    const s = d.line.style;
    d.line.addClass("pe-line-on");
    s.left = rect.left + "px";
    s.width = rect.width + "px";
    s.top = (before ? rect.top : rect.bottom) - 1 + "px";
  }
  /** Drop resolution inside the notebooks pane: notebook and section rows
   *  reorder and nest like tree folders; open space below the list drops a
   *  folder at the end of the vault root. */
  resolveNotebooksDrop(e, el) {
    const d = this.drag;
    const pane = this.notebooksEl;
    if (!pane) return;
    const row = el.closest(".pe-notebook[data-path]");
    if (row) {
      this.resolveFolderRowDrop(e, row);
      return;
    }
    if (!(d.file instanceof import_obsidian.TFolder)) return;
    const rows = pane.querySelectorAll(".pe-notebook[data-path]");
    const last = rows[rows.length - 1];
    if (!last || e.clientY <= last.getBoundingClientRect().bottom) return;
    d.mode = "reorder";
    d.dropParent = this.app.vault.getRoot();
    d.before = null;
    const lr = last.getBoundingClientRect();
    const s = d.line.style;
    d.line.addClass("pe-line-on");
    s.left = lr.left + "px";
    s.width = lr.width + "px";
    s.top = lr.bottom - 1 + "px";
  }
  /** Drop resolution inside the pages pane: between rows reorders (a foreign
   *  item is moved here positionally); folder rows reorder and nest; open
   *  space below means the end. */
  resolvePagesDrop(e, el) {
    const d = this.drag;
    if (el.closest(".pe-back")) return;
    const frow = el.closest(".pe-drill-folder[data-path]");
    if (frow) {
      this.resolveFolderRowDrop(e, frow);
      return;
    }
    if (el.closest(".pe-drill-folders")) return;
    const row = el.closest(".pe-page[data-path]");
    const showLine = (rect2, atTop) => {
      const s = d.line.style;
      d.line.addClass("pe-line-on");
      s.left = rect2.left + "px";
      s.width = rect2.width + "px";
      s.top = (atTop ? rect2.top : rect2.bottom) - 1 + "px";
    };
    if (!row) {
      const folder = this.sectionFolder();
      if (this.dragCarries(d, folder.path)) return;
      d.mode = "reorder";
      d.dropParent = folder;
      d.before = null;
      const rows = this.pagesEl.querySelectorAll(".pe-page");
      const last = rows[rows.length - 1];
      if (last) showLine(last.getBoundingClientRect(), false);
      return;
    }
    const overPath = row.getAttribute("data-path");
    if (d.paths.has(overPath)) return;
    const overFile = this.app.vault.getAbstractFileByPath(overPath);
    if (!overFile) return;
    const anchor = this.rowAnchor(overFile);
    if (!anchor) return;
    if (this.dragCarries(d, anchor.parent.path)) return;
    const rect = row.getBoundingClientRect();
    const frac = (e.clientY - rect.top) / Math.max(1, rect.height);
    const into = overFile instanceof import_obsidian.TFile ? this.groupOf(overFile) : null;
    if (into && !this.dragCarries(d, into.path)) {
      const sibling = into.parent?.path === d.file.parent?.path;
      const lo = sibling ? 0.4 : 0.25;
      if (frac > lo && frac < 1 - lo) {
        d.mode = "into";
        d.intoFolder = into;
        d.intoEl = row;
        row.addClass("pe-into");
        return;
      }
    }
    if (!into && overFile instanceof import_obsidian.TFile && overFile.extension === "md" && frac > 0.4 && frac < 0.6) {
      d.mode = "into";
      d.intoPage = overFile;
      d.intoEl = row;
      row.addClass("pe-into");
      return;
    }
    const seq = this.visibleNames(anchor.parent);
    const idx = seq.indexOf(anchor.item.name);
    if (idx < 0) return;
    const before = frac < 0.5;
    d.mode = "reorder";
    d.dropParent = anchor.parent;
    d.before = before ? anchor.item.name : seq[idx + 1] ?? null;
    showLine(rect, before);
  }
  autoscroll(e) {
    const sc = this.drag?.scrollEl;
    if (!sc) return;
    const r = sc.getBoundingClientRect();
    if (e.clientY < r.top + 28) sc.scrollTop -= 14;
    else if (e.clientY > r.bottom - 28) sc.scrollTop += 14;
  }
  onPointerUp(e) {
    const d = this.drag;
    if (!d) return;
    this.drag = null;
    const wasActive = d.active;
    this.cleanupDrag(d);
    if (!wasActive) return;
    e.preventDefault();
    if (d.mode === "into" && d.intoPage) {
      void this.moveIntoPage(d.files, d.intoPage);
    } else if (d.mode === "into" && d.intoFolder) {
      void this.moveInto(d.files, d.intoFolder);
    } else if (d.mode === "reorder" && d.dropParent) {
      void this.dropAt(d.files, d.dropParent, d.before);
    }
  }
  /** Is this path something the drag is carrying, or inside it? Guards every
   *  "you cannot drop it on itself" test, for one item or a selection. */
  dragCarries(d, path) {
    for (const p of d.paths) if (path === p || path.startsWith(p + "/")) return true;
    return false;
  }
  cancelDrag() {
    const d = this.drag;
    this.drag = null;
    if (d) this.cleanupDrag(d);
  }
  cleanupDrag(d) {
    d.ghost?.remove();
    d.line?.remove();
    d.intoEl?.removeClass("pe-into");
    d.titleEl.draggable = true;
    document.body.removeClass("pe-dragging");
  }
  /** Drop between siblings: freeze the folder's visible sequence with the
   *  dragged items at their new place. Works across folders too, they are
   *  moved first, then ranked exactly where they were dropped, as one block
   *  in list order. */
  async dropAt(files, parent, before) {
    const moved = await this.moveAll(files, parent);
    if (!moved.length) return;
    if (this.isForcedSort(parent.path)) {
      new Notice(`${parent.name || "That folder"} sorts itself by name. Set its sort to Manual to arrange by hand.`);
      return;
    }
    this.settings.orders[parent.path] = insertOrderMany(
      this.visibleNames(parent),
      moved.map((f) => f.name),
      before
    );
    this.orderChanged();
  }
  /**
   * Give a plain page a folder of its own, so things can go inside it.
   *
   * The folder is made BESIDE the note, not around it. pairPages reads a folder
   * and a same-named note as one row either way, note inside, or note beside
   * and beside means the note never moves: no rename, no re-linking, no window
   * where the page you are filing under is somewhere else. The row it already
   * had keeps its place in the order, and simply grows a chevron.
   *
   * Only a Markdown page, because only a .md can anchor a group.
   */
  async pageToGroup(page) {
    const parent = page.parent;
    if (!parent || page.extension !== "md") return null;
    const dest = joinPath(parent.path, page.basename);
    const existing = this.app.vault.getAbstractFileByPath(dest);
    if (existing instanceof import_obsidian.TFolder) return existing;
    if (existing) {
      new Notice(`Power Explorer: "${page.basename}" is already taken here, so this page cannot take subpages.`);
      return null;
    }
    try {
      await this.app.vault.createFolder(dest);
    } catch {
      new Notice("Power Explorer: could not make a folder for that page.");
      return null;
    }
    const made = this.app.vault.getAbstractFileByPath(dest);
    return made instanceof import_obsidian.TFolder ? made : null;
  }
  /** Drop onto a plain page: it becomes a group, and the items land inside it. */
  async moveIntoPage(files, page) {
    const folder = await this.pageToGroup(page);
    if (!folder) return;
    await this.moveInto(files, folder);
  }
  /** Drop onto a folder: a plain move. The items arrive unranked and land
   *  per the "unarranged items" setting. */
  async moveInto(files, folder) {
    await this.moveAll(files, folder);
  }
  /**
   * Move everything into `folder`, returning what is actually there now
   * items already in it included, since a reorder within one folder moves
   * nothing.
   *
   * A name already taken blocks that one item and nothing else. Aborting the
   * whole drop on the first collision would strand a multi-item move halfway
   * with no way to tell which half went, so the rest still land and one notice
   * says how many stayed behind.
   */
  async moveAll(files, folder) {
    const moved = [];
    const blocked = [];
    for (const file of files) {
      if (file.parent?.path === folder.path) {
        moved.push(file);
        continue;
      }
      const dest = joinPath(folder.path, file.name);
      if (this.app.vault.getAbstractFileByPath(dest)) {
        blocked.push(file.name);
        continue;
      }
      await this.app.fileManager.renameFile(file, dest);
      moved.push(file);
    }
    if (blocked.length === 1) new Notice(`Power Explorer: "${blocked[0]}" already exists there, so it stayed put.`);
    else if (blocked.length) new Notice(`Power Explorer: ${blocked.length} items already exist there, so they stayed put.`);
    return moved;
  }
};
var SearchService = class {
  constructor(plugin) {
    this.plugin = plugin;
    this.index = new VaultIndex();
    /** Initial reconcile finished; results are complete from here on. */
    this.ready = false;
    this.store = {};
    /** OCR text per image path, cached by mtime, the expensive part of image
     *  search, never re-done for an unchanged file. */
    /** Cached OCR text per image. `by` names the provider that read it, so a
     *  change of provider re-reads rather than serving the old one's mistakes
     *  forever; absent means Text Extractor, the only one that used to exist. */
    this.images = {};
    /** Each note's embedded images at last index time, so an embed-set change
     *  can reconcile the images' standalone docs (session-only, rebuilt free). */
    this.noteImages = {};
    this.persistTimer = null;
    /** When the oldest currently-unwritten change happened, or null when
     *  everything is on disk. Drives the ceiling on the write debounce. */
    this.dirtySince = null;
    /** A write is in flight. Guards against a fast sweep starting a second
     *  serialization of a 27 MB index on top of the first. */
    this.persisting = false;
    this.statusEl = null;
    /** The store has changes search-index.json hasn't seen yet. */
    this.dirty = false;
    /** Parsed "Folders search skips", recomputed only when the setting changes. */
    this.exCache = null;
    this.waitedForMobileCatchup = false;
    this.startGeneration = 0;
  }
  get app() {
    return this.plugin.app;
  }
  /** A diagnostic snapshot of the index: how much is indexed, how big it is,
   *  and how many images still await OCR. Powers the performance report. */
  stats() {
    let chunks = 0;
    for (const d of Object.values(this.store)) chunks += d.chunks.length + (d.attach?.length ?? 0);
    let imagesPending = 0;
    if (this.plugin.settings.searchImages) {
      for (const f of this.app.vault.getFiles()) {
        if (IMAGE_EXTS.has(f.extension.toLowerCase()) && this.indexablePath(f.path) && !this.images[f.path]) imagesPending++;
      }
    }
    const approxIndexKB = Math.round(JSON.stringify({ v: 2, docs: this.store, images: this.images }).length / 1024);
    return {
      ready: this.ready,
      indexedDocs: Object.keys(this.store).length,
      chunks,
      imagesOcrd: Object.keys(this.images).length,
      imagesPending,
      approxIndexKB
    };
  }
  storePath() {
    return `${this.plugin.manifest.dir}/search-index.json`;
  }
  /** Load the persisted store, then reconcile against the live vault. */
  async start() {
    if (!this.plugin.settings.searchEnabled) return;
    const generation = ++this.startGeneration;
    if (import_obsidian.Platform.isMobileApp && !this.waitedForMobileCatchup) {
      this.waitedForMobileCatchup = true;
      const started = Date.now();
      while (generation === this.startGeneration && this.plugin.mobileSyncSettling() && Date.now() - started < 30 * 6e4) {
        await new Promise((resolve) => window.setTimeout(resolve, 750));
      }
      if (generation !== this.startGeneration) return;
      await new Promise((resolve) => window.setTimeout(resolve, 750));
    }
    if (generation !== this.startGeneration) return;
    try {
      const raw = await this.app.vault.adapter.read(this.storePath());
      const data = JSON.parse(raw);
      if ((data?.v === 1 || data?.v === 2) && data.docs) {
        this.store = data.docs;
        this.images = data.images ?? {};
      }
    } catch {
    }
    if (generation !== this.startGeneration) return;
    await this.build();
  }
  /** Rebuild from the in-memory store (settings changed: PDFs toggled,
   *  folders excluded). Cached text is reused; only the filter re-runs. */
  restart() {
    this.index = new VaultIndex();
    this.ready = false;
    void this.build();
  }
  /** Turn search off: drop everything and remove the cache file. */
  stop() {
    this.startGeneration++;
    this.waitedForMobileCatchup = false;
    this.index = new VaultIndex();
    this.store = {};
    this.images = {};
    this.noteImages = {};
    this.ready = false;
    this.dirty = false;
    this.status("");
    if (this.persistTimer != null) {
      window.clearTimeout(this.persistTimer);
      this.persistTimer = null;
    }
    this.app.vault.adapter.remove(this.storePath()).catch(() => {
    });
  }
  /** Cancel deferred startup/build work without deleting the persisted cache. */
  shutdown() {
    this.startGeneration++;
    this.index = new VaultIndex();
    if (this.persistTimer != null) {
      window.clearTimeout(this.persistTimer);
      this.persistTimer = null;
    }
  }
  async build() {
    const idx = this.index;
    const tick = () => new Promise((r) => window.setTimeout(r, 0));
    let n = 0;
    for (const [path, d] of Object.entries(this.store)) {
      if (idx !== this.index) return;
      if (!this.indexablePath(path)) continue;
      if (path.endsWith(".md")) this.addNoteDoc(path, d);
      else this.index.addDoc({ path, ...d });
      if (++n % 250 === 0) await tick();
    }
    const all = this.app.vault.getFiles();
    const allPaths = new Set(all.map((f) => f.path));
    const live = all.filter((f) => this.indexable(f));
    const livePaths = new Set(live.map((f) => f.path));
    for (const path of Object.keys(this.store)) {
      if (!allPaths.has(path)) {
        delete this.store[path];
        this.index.removeDoc(path);
        this.dirty = true;
      } else if (!livePaths.has(path)) this.index.removeDoc(path);
    }
    for (const path of Object.keys(this.images)) {
      if (allPaths.has(path)) continue;
      delete this.images[path];
      this.index.removeDoc(path);
      this.dirty = true;
    }
    const stale = live.filter((f) => this.store[f.path]?.mtime !== f.stat.mtime);
    let done = 0;
    for (const f of stale) {
      if (idx !== this.index) return;
      await this.indexFile(f);
      if (++done % 10 === 0) {
        this.status(`Search: indexing ${done}/${stale.length}`);
        await tick();
      }
    }
    if (idx !== this.index) return;
    this.applyImages();
    this.status("");
    this.ready = true;
    if (this.dirty) void this.persist();
    void this.ocrBackfill();
  }
  excludedRoots() {
    const src = this.plugin.settings.searchExclude;
    if (this.exCache?.src !== src) {
      this.exCache = {
        src,
        roots: src.split(",").map((s) => s.trim().replace(/^\/+|\/+$/g, "")).filter(Boolean)
      };
    }
    return this.exCache.roots;
  }
  /** Path-only eligibility, shared by live files and the persisted store.
   *  Keyed off the extension, so each attachment kind has its own gate. */
  indexablePath(path) {
    const lower = path.toLowerCase();
    if (lower.endsWith(".pdf") && !this.plugin.settings.searchPdfs) return false;
    const ext = lower.slice(lower.lastIndexOf(".") + 1);
    if (IMAGE_EXTS.has(ext) && !this.plugin.settings.searchImages) return false;
    return !this.excludedRoots().some((root) => isUnder(path, root));
  }
  indexable(f) {
    if (!this.indexablePath(f.path)) return false;
    return f.extension === "md" || f.extension === "pdf";
  }
  /** (Re)index one file: markdown is chunked with its cache-provided tags and
   *  aliases (plus its embedded images' OCR text, attached live, never stored
   *  twice); PDFs get their text layer extracted, page by page. `force` skips
   *  the mtime short-circuit, used when an image's OCR text arrives and the
   *  unchanged notes embedding it must pick it up. */
  async indexFile(f, force = false) {
    if (!this.plugin.settings.searchEnabled || !this.indexable(f)) return;
    if (!force && this.store[f.path]?.mtime === f.stat.mtime && this.index.has(f.path)) return;
    try {
      if (f.extension === "md") {
        const content = await this.app.vault.cachedRead(f);
        const cache = this.app.metadataCache.getFileCache(f);
        const tags = (cache ? (0, import_obsidian.getAllTags)(cache) ?? [] : []).map((t) => t.replace(/^#/, ""));
        const fmAliases = cache?.frontmatter?.aliases;
        const aliases = Array.isArray(fmAliases) ? fmAliases.map(String) : typeof fmAliases === "string" ? [fmAliases] : [];
        const d = {
          mtime: f.stat.mtime,
          title: f.basename,
          aliases,
          tags: [...new Set(tags)],
          chunks: chunkNote(content)
        };
        this.store[f.path] = d;
        this.index.addDoc({ path: f.path, ...d, attach: this.noteImageChunks(f, cache) });
        const now = this.noteImagePaths(f, cache);
        const prev = this.noteImages[f.path] ?? [];
        this.noteImages[f.path] = now;
        const flipped = [.../* @__PURE__ */ new Set([...prev, ...now])].filter((p) => prev.includes(p) !== now.includes(p));
        if (flipped.length) this.reconcileImages(flipped);
      } else {
        const d = {
          mtime: f.stat.mtime,
          title: f.basename,
          aliases: [],
          tags: [],
          chunks: [],
          attach: await this.pdfChunks(f)
        };
        this.store[f.path] = d;
        this.index.addDoc({ path: f.path, ...d });
      }
      this.schedulePersist();
    } catch (e) {
      console.warn("Power Explorer: could not index", f.path, e);
    }
  }
  /** A PDF's embedded text layer as page-anchored chunks (no OCR, scanned
   *  pages come back empty and simply aren't findable yet). Bounded so one
   *  giant PDF can't swallow the index. */
  async pdfChunks(f) {
    const buf = await this.app.vault.readBinary(f);
    const pdfjs = await (0, import_obsidian.loadPdfJs)();
    const pdf = await pdfjs.getDocument({ data: buf }).promise;
    const out = [];
    try {
      const pages = Math.min(pdf.numPages, 300);
      let total = 0;
      for (let p = 1; p <= pages && total < 5e5; p++) {
        const page = await pdf.getPage(p);
        const tc = await page.getTextContent();
        const text = tc.items.map((it) => it.str ?? "").join(" ").replace(/\s+/g, " ").trim();
        if (!text) continue;
        total += text.length;
        for (let i = 0; i < text.length; i += MAX_CHUNK) {
          out.push({ heading: `p. ${p}`, text: text.slice(i, i + MAX_CHUNK), anchor: p });
        }
      }
    } finally {
      pdf.destroy?.();
    }
    return out;
  }
  /** Delete maintenance; a folder takes its whole subtree out of the index.
   *  A deleted image's text lingers in notes that embedded it until their
   *  next reindex, removing the embed edits the note, which triggers one. */
  removePath(path, isFolder) {
    let touched = false;
    for (const p of Object.keys(this.store)) {
      if (isFolder ? !isUnder(p, path) : p !== path) continue;
      delete this.store[p];
      delete this.noteImages[p];
      this.index.removeDoc(p);
      touched = true;
    }
    for (const p of Object.keys(this.images)) {
      if (isFolder ? !isUnder(p, path) : p !== path) continue;
      delete this.images[p];
      this.index.removeDoc(p);
      touched = true;
    }
    if (touched) this.schedulePersist();
  }
  /** Rename maintenance. Cached text is reused (no re-reading) but docs are
   *  re-added so titles and folder-name terms follow the new path. */
  renameFile(f, oldPath) {
    if (f instanceof import_obsidian.TFolder) {
      const prefix = oldPath + "/";
      let touched = false;
      for (const p of Object.keys(this.images)) {
        if (!p.startsWith(prefix)) continue;
        const np = f.path + p.slice(oldPath.length);
        this.images[np] = this.images[p];
        delete this.images[p];
        if (this.index.has(p)) {
          this.index.removeDoc(p);
          this.indexStandaloneImage(np);
        }
        touched = true;
      }
      for (const p of Object.keys(this.store)) {
        if (!p.startsWith(prefix)) continue;
        const np = f.path + p.slice(oldPath.length);
        const d2 = this.store[p];
        delete this.store[p];
        delete this.noteImages[p];
        this.index.removeDoc(p);
        this.store[np] = d2;
        if (this.indexablePath(np)) {
          if (np.endsWith(".md")) this.addNoteDoc(np, d2);
          else this.index.addDoc({ path: np, ...d2 });
        }
        touched = true;
      }
      if (touched) this.schedulePersist();
      return;
    }
    if (!(f instanceof import_obsidian.TFile)) return;
    const img = this.images[oldPath];
    if (img) {
      this.images[f.path] = img;
      delete this.images[oldPath];
      if (this.index.has(oldPath)) {
        this.index.removeDoc(oldPath);
        this.indexStandaloneImage(f.path);
      }
      this.schedulePersist();
      return;
    }
    const d = this.store[oldPath];
    delete this.store[oldPath];
    delete this.noteImages[oldPath];
    this.index.removeDoc(oldPath);
    if (d) {
      d.title = f.basename;
      this.store[f.path] = d;
      if (this.indexablePath(f.path)) {
        if (f.extension === "md") this.addNoteDoc(f.path, d);
        else this.index.addDoc({ path: f.path, ...d });
      }
      this.schedulePersist();
    } else void this.indexFile(f);
  }
  schedulePersist() {
    this.dirty = true;
    if (!this.ready) return;
    if (this.dirtySince == null) this.dirtySince = Date.now();
    if (persistOverdue(Date.now(), this.dirtySince, MAX_PERSIST_AGE)) {
      if (this.persistTimer != null) {
        window.clearTimeout(this.persistTimer);
        this.persistTimer = null;
      }
      this.dirtySince = null;
      void this.persist();
      return;
    }
    if (this.persistTimer != null) window.clearTimeout(this.persistTimer);
    this.persistTimer = window.setTimeout(() => {
      this.persistTimer = null;
      const ric = window.requestIdleCallback;
      if (ric) ric(() => void this.persist(), { timeout: IDLE_WRITE_DEADLINE });
      else void this.persist();
    }, 1e4);
  }
  /** Best-effort write on unload: fire-and-forget, since onunload cannot
   *  await. A write that doesn't finish costs only a re-index of the last
   *  burst next launch (mtime reconcile), never correctness. */
  flushPersist() {
    if (this.persistTimer != null) {
      window.clearTimeout(this.persistTimer);
      this.persistTimer = null;
    }
    if (this.dirty) void this.persist();
  }
  async persist() {
    if (this.persisting) return;
    this.persisting = true;
    try {
      await this.app.vault.adapter.write(
        this.storePath(),
        JSON.stringify({ v: 2, docs: this.store, images: this.images })
      );
      this.dirty = false;
      this.dirtySince = null;
    } catch (e) {
      console.warn("Power Explorer: could not save the search index", e);
    } finally {
      this.persisting = false;
    }
  }
  /* ---- image OCR (via a companion plugin) ---- */
  /** Whichever OCR provider is installed, in order of preference. Both expose
   *  the same `extractText` and both keep their own extraction cache, so the
   *  one that answers is an implementation detail from here.
   *
   *  Power Extract is preferred: it reads through the OCR built into Windows
   *  rather than downloading an engine, and it is markedly better at the
   *  screenshots this index is mostly made of. Text Extractor stays in the
   *  list because a vault that already has it should not lose image search
   *  the day this preference changed. */
  textExtractor() {
    const plugins = this.app.plugins?.plugins;
    for (const id of OCR_PROVIDERS) {
      const api = plugins?.[id]?.api;
      if (api && typeof api.extractText === "function") return { id, extractText: (f) => api.extractText(f) };
    }
    return null;
  }
  /**
   * Is this image's cached text still current?
   *
   * Not just "is it the same file": also "did the provider that is answering
   * now write it". Cached text is keyed on modification time, and swapping OCR
   * providers does not touch a single file's mtime, so without the second half
   * of this question a vault that has just gained a better recognizer keeps
   * serving every word the old one got wrong, forever, and the upgrade appears
   * to have done nothing.
   *
   * Entries written before this field existed came from Text Extractor, which
   * was the only provider there had ever been, so that is what a missing value
   * means. Naming it keeps a vault that still uses Text Extractor from
   * re-reading its whole library to arrive back where it started.
   */
  imageFresh(f, providerId) {
    const cached = this.images[f.path];
    if (!cached || cached.mtime !== f.stat.mtime) return false;
    if (providerId === void 0) return true;
    return (cached.by ?? "text-extractor") === providerId;
  }
  /** Add a note to the index with its embedded images' OCR text attached live
   *  from the cache, attach text is derived at add time, never stored twice. */
  addNoteDoc(path, d) {
    const af = this.app.vault.getAbstractFileByPath(path);
    const cache = af instanceof import_obsidian.TFile ? this.app.metadataCache.getFileCache(af) : null;
    if (af instanceof import_obsidian.TFile) this.noteImages[path] = this.noteImagePaths(af, cache);
    this.index.addDoc({ path, ...d, attach: af instanceof import_obsidian.TFile ? this.noteImageChunks(af, cache) : void 0 });
  }
  /** The image files a note currently embeds. */
  noteImagePaths(f, cache) {
    const out = /* @__PURE__ */ new Set();
    for (const em of cache?.embeds ?? []) {
      const target = this.app.metadataCache.getFirstLinkpathDest(em.link, f.path);
      if (target && IMAGE_EXTS.has(target.extension.toLowerCase())) out.add(target.path);
    }
    return [...out];
  }
  /** A note's embed set changed: images it dropped may need a standalone doc
   *  (their text must stay findable), images it gained must lose theirs (no
   *  duplicate results for the same screenshot). */
  reconcileImages(paths) {
    const rev = this.reverseEmbeds();
    for (const p of paths) {
      if (!this.images[p]?.text) continue;
      const embedded = (rev.get(p) ?? []).length > 0;
      if (embedded && this.index.has(p)) this.index.removeDoc(p);
      else if (!embedded) this.indexStandaloneImage(p);
    }
  }
  /** OCR text of the images a note embeds, as attach chunks anchored at each
   *  embed's line: a hit inside a screenshot lands on the page. */
  noteImageChunks(f, cache) {
    if (!this.plugin.settings.searchImages) return [];
    const out = [];
    for (const em of cache?.embeds ?? []) {
      const target = this.app.metadataCache.getFirstLinkpathDest(em.link, f.path);
      if (!target || !IMAGE_EXTS.has(target.extension.toLowerCase())) continue;
      const text = this.images[target.path]?.text;
      if (!text) continue;
      const line = em.position?.start?.line ?? 0;
      for (let i = 0; i < text.length; i += MAX_CHUNK) {
        out.push({ heading: target.name, text: text.slice(i, i + MAX_CHUNK), anchor: line });
      }
    }
    return out;
  }
  /** target path → the notes linking/embedding it, built in one pass over the
   *  metadata cache (never per image, 13k images times 5k notes won't fly). */
  reverseEmbeds() {
    const rev = /* @__PURE__ */ new Map();
    for (const [src, targets] of Object.entries(this.app.metadataCache.resolvedLinks)) {
      for (const t of Object.keys(targets)) {
        let arr = rev.get(t);
        if (!arr) rev.set(t, arr = []);
        arr.push(src);
      }
    }
    return rev;
  }
  /** An image nobody embeds still deserves to be findable: it becomes its own
   *  document, opened directly from a result row. */
  indexStandaloneImage(path) {
    const rec = this.images[path];
    if (!rec?.text || !this.indexablePath(path)) return;
    const name = nameOf(path);
    const chunks = [];
    for (let i = 0; i < rec.text.length; i += MAX_CHUNK) {
      chunks.push({ heading: name, text: rec.text.slice(i, i + MAX_CHUNK), anchor: 0 });
    }
    this.index.addDoc({ path, title: name.replace(/\.\w+$/, ""), aliases: [], tags: [], mtime: rec.mtime, chunks: [], attach: chunks });
  }
  /** Fold cached OCR text into the index. Embedded images already rode in on
   *  their notes' attach chunks; the rest become standalone docs. */
  applyImages() {
    if (!this.plugin.settings.searchImages) return;
    const rev = this.reverseEmbeds();
    for (const path of Object.keys(this.images)) {
      if (!(rev.get(path) ?? []).length) this.indexStandaloneImage(path);
    }
  }
  /** OCR one image now (create/modify events) and refresh whoever shows it. */
  async ocrImage(f) {
    const s = this.plugin.settings;
    if (!s.searchEnabled || !s.searchImages || !this.indexablePath(f.path)) return;
    const te = this.textExtractor();
    if (!te) return;
    if (this.imageFresh(f, te.id)) return;
    try {
      const text = (await te.extractText(f) ?? "").trim();
      this.images[f.path] = { mtime: f.stat.mtime, text, by: te.id };
      this.schedulePersist();
      if (!text) return;
      const embedders = this.reverseEmbeds().get(f.path) ?? [];
      if (embedders.length) await this.reindexNotes(new Set(embedders));
      else this.indexStandaloneImage(f.path);
    } catch (e) {
      console.warn("Power Explorer: OCR failed for", f.path, e);
    }
  }
  /**
   * The one-time OCR sweep over vault images, serial and resumable: the text
   * cache persists as it goes, so a quit mid-sweep resumes where it left off.
   * Runs after the text index is ready; touched notes reindex in batches so
   * screenshots become findable while the sweep is still running.
   *
   * "Persists as it goes" depends on the checkpoint below actually reaching
   * disk, which is not free: it asks for a write every 25 images, and a fast
   * enough recognizer can ask faster than the write debounce ever expires.
   * MAX_PERSIST_AGE is what keeps this sentence true; see persistOverdue().
   */
  async ocrBackfill() {
    const s = this.plugin.settings;
    if (!s.searchEnabled || !s.searchImages || !import_obsidian.Platform.isDesktopApp) return;
    const te = this.textExtractor();
    const pending = this.app.vault.getFiles().filter(
      (f) => IMAGE_EXTS.has(f.extension.toLowerCase()) && this.indexablePath(f.path) && !this.imageFresh(f, te?.id)
    );
    if (!pending.length) return;
    if (!te) {
      new Notice(
        `Power Explorer: ${pending.length} image(s) are waiting for OCR. Install and enable "Power Extract" to make screenshots searchable.`,
        1e4
      );
      return;
    }
    const idx = this.index;
    const rev = this.reverseEmbeds();
    const touched = /* @__PURE__ */ new Set();
    let done = 0;
    for (const f of pending) {
      if (idx !== this.index) return;
      try {
        const text = (await te.extractText(f) ?? "").trim();
        this.images[f.path] = { mtime: f.stat.mtime, text, by: te.id };
        if (text) {
          const embedders = rev.get(f.path) ?? [];
          if (embedders.length) for (const n of embedders) touched.add(n);
          else this.indexStandaloneImage(f.path);
        }
      } catch (e) {
        console.warn("Power Explorer: OCR failed for", f.path, e);
        this.images[f.path] = { mtime: f.stat.mtime, text: "", by: te.id };
      }
      done++;
      this.dirty = true;
      if (done % 5 === 0) this.status(`Search: OCR ${done}/${pending.length}`);
      if (done % 25 === 0) {
        await this.reindexNotes(touched);
        touched.clear();
        this.schedulePersist();
      }
    }
    await this.reindexNotes(touched);
    this.status("");
    this.schedulePersist();
  }
  async reindexNotes(paths) {
    for (const p of paths) {
      const af = this.app.vault.getAbstractFileByPath(p);
      if (af instanceof import_obsidian.TFile) await this.indexFile(af, true);
    }
  }
  /** The plugin-level search API: engine results ranked with everything Power
   *  Explorer knows (recency, pins, manual order, the section being browsed).
   *  The modal calls this, and other plugins (Power Capture's Ask-your-vault)
   *  can call it too, one index, one ranking. */
  query(q, opts = {}) {
    return this.index.search(q, {
      limit: opts.limit ?? 60,
      scope: opts.scope ?? "",
      docBoost: this.defaultBoost()
    });
  }
  /** RAG-style retrieval over the shared index: top-k content chunks with
   *  full text, OR semantics (callers bring expanded synonym terms). Power
   *  Capture's Ask-your-vault uses this when Power Explorer is installed
   *  which means answers can draw on PDF pages and OCR'd screenshots too. */
  retrieve(terms, k = 12, scope = "") {
    if (!this.plugin.settings.searchEnabled) return [];
    return this.index.retrieveChunks(terms, k, scope);
  }
  defaultBoost() {
    const s = this.plugin.settings;
    const recent = s.recentPages;
    const recentRank = new Map(recent.map((p, i) => [p, i]));
    const section = this.plugin.currentSectionPath();
    return (path) => {
      let b = 0;
      const r = recentRank.get(path);
      if (r != null) b += 1.5 * (recent.length - r) / recent.length;
      const parent = parentPathOf(path);
      const name = nameOf(path);
      if ((s.pins[parent] ?? []).includes(name)) b += 1;
      if (s.orders[parent]?.includes(name)) b += 0.4;
      if (section !== "/" && isUnder(path, section)) b += 0.6;
      return b;
    };
  }
  status(text) {
    if (!text) {
      this.statusEl?.remove();
      this.statusEl = null;
      return;
    }
    if (!this.statusEl) this.statusEl = this.plugin.addStatusBarItem();
    this.statusEl.setText(text);
  }
};
var PowerSearchModal = class extends import_obsidian.Modal {
  constructor(plugin) {
    super(plugin.app);
    this.plugin = plugin;
    this.rows = [];
    this.sel = 0;
    this.debounce = null;
    /** Ask mode: the same box, but Enter sends the question to Power Capture's
     *  Claude pipeline (which retrieves through this same index). */
    this.askMode = false;
    this.asking = false;
    /** Owns whatever MarkdownRenderer attaches to a rendered answer. Rendering
     *  against the plugin instead would tie those children to the plugin's
     *  lifetime, so every answer would outlive its modal until Obsidian quits. */
    this.renderComp = null;
  }
  onOpen() {
    this.modalEl.addClass("pe-search-modal");
    const c = this.contentEl;
    c.empty();
    const box = c.createDiv({ cls: "pe-search-box" });
    const ic = box.createSpan({ cls: "pe-search-ico" });
    (0, import_obsidian.setIcon)(ic, "search");
    this.inputEl = box.createEl("input", {
      attr: { type: "text", placeholder: 'Search everywhere\u2026  ("quotes" for phrases)', spellcheck: "false" }
    });
    const compactBtn = box.createSpan({ cls: "pe-search-compact" });
    compactBtn.createSpan({ cls: "pe-search-compact-lbl", text: "Titles" });
    const knob = compactBtn.createSpan({ cls: "pe-search-compact-knob" });
    const paintCompact = () => {
      const on = this.plugin.settings.searchCompact;
      knob.empty();
      (0, import_obsidian.setIcon)(knob, on ? "toggle-right" : "toggle-left");
      compactBtn.toggleClass("is-active", on);
      compactBtn.setAttribute("aria-label", on ? "Titles only (click to show snippets" : "Showing snippets) click for titles only");
      this.modalEl.toggleClass("is-compact", on);
    };
    paintCompact();
    compactBtn.addEventListener("click", () => {
      this.plugin.settings.searchCompact = !this.plugin.settings.searchCompact;
      void this.plugin.persistSettings();
      paintCompact();
      this.run();
      this.inputEl.focus();
    });
    this.scopesEl = c.createDiv({ cls: "pe-search-scopes" });
    this.listEl = c.createDiv({ cls: "pe-search-results" });
    this.metaEl = c.createDiv({ cls: "pe-search-meta" });
    this.renderScopes();
    this.inputEl.addEventListener("input", () => this.queueRun());
    this.inputEl.addEventListener("keydown", (e) => this.keydown(e));
    this.run();
    window.setTimeout(() => this.inputEl.focus(), 0);
  }
  onClose() {
    if (this.debounce != null) window.clearTimeout(this.debounce);
    this.renderComp?.unload();
    this.renderComp = null;
    this.contentEl.empty();
  }
  /* ---- scope chips ---- */
  scopeChoices() {
    const out = [
      { key: "vault", label: "Everywhere", path: "" }
    ];
    const section = this.plugin.currentSectionPath();
    if (section && section !== "/") {
      const nb = section.split("/")[0];
      out.push({ key: "notebook", label: nb, path: nb });
      if (nb !== section) out.push({ key: "section", label: nameOf(section), path: section });
    }
    return out;
  }
  activeScope() {
    const choices = this.scopeChoices();
    return choices.find((s) => s.key === this.plugin.settings.searchScope) ?? choices[0];
  }
  renderScopes() {
    this.scopesEl.empty();
    const active = this.activeScope();
    for (const s of this.scopeChoices()) {
      const chip = this.scopesEl.createSpan({
        cls: "pe-search-scope" + (!this.askMode && s.key === active.key ? " is-active" : ""),
        text: s.label
      });
      chip.addEventListener("click", () => {
        if (this.askMode) this.toggleAsk();
        this.setScope(s.key);
      });
    }
    if (this.askApi()) {
      const chip = this.scopesEl.createSpan({
        cls: "pe-search-scope pe-search-ask" + (this.askMode ? " is-active" : ""),
        text: "\u2728 Ask AI"
      });
      chip.addEventListener("click", () => this.toggleAsk());
    }
  }
  /** Power Assistant's cross-plugin API, when it's installed and enabled
   *  (the plugin was previously named Power Capture; both ids are probed). */
  askApi() {
    const plugins = this.app.plugins?.plugins;
    const api = plugins?.powerassistant?.api ?? plugins?.powercapture?.api;
    return api && typeof api.ask === "function" ? { ask: (q) => api.ask(q) } : null;
  }
  toggleAsk() {
    this.askMode = !this.askMode;
    this.inputEl.placeholder = this.askMode ? "Ask your vault a question\u2026" : 'Search everywhere\u2026  ("quotes" for phrases)';
    this.renderScopes();
    this.rows = [];
    this.listEl.empty();
    if (this.askMode) {
      this.listEl.createDiv({
        cls: "pe-empty",
        text: "Type a question and press Enter. Claude answers from your notes, with citations."
      });
      this.metaEl.setText("Ask runs through Power Assistant \xB7 Tab returns to search");
    } else this.run();
    this.inputEl.focus();
  }
  async runAsk() {
    const api = this.askApi();
    const q = this.inputEl.value.trim();
    if (!api || !q || this.asking) return;
    this.asking = true;
    this.rows = [];
    this.listEl.empty();
    this.listEl.createDiv({ cls: "pe-empty", text: "Thinking\u2026" });
    this.metaEl.setText("Asking Claude\u2026");
    try {
      const { answer, hits } = await api.ask(q);
      if (!this.askMode) return;
      this.listEl.empty();
      const box = this.listEl.createDiv({ cls: "pe-search-answer" });
      this.renderComp?.unload();
      this.renderComp = new import_obsidian.Component();
      this.renderComp.load();
      await import_obsidian.MarkdownRenderer.render(this.app, answer, box, "", this.renderComp);
      box.addEventListener("click", (e) => {
        if (e.target.closest("a.internal-link")) this.close();
      });
      this.metaEl.setText(
        hits ? `Answered from ${hits} matching section(s) \xB7 citations open the source notes` : "No matching sections found"
      );
    } catch (e) {
      if (!this.askMode) return;
      this.listEl.empty();
      this.listEl.createDiv({ cls: "pe-empty", text: "Ask failed: " + (e instanceof Error ? e.message : String(e)) });
      this.metaEl.setText("");
    } finally {
      this.asking = false;
    }
  }
  setScope(key) {
    this.plugin.settings.searchScope = key;
    void this.plugin.persistSettings();
    this.renderScopes();
    this.run();
    this.inputEl.focus();
  }
  /* ---- running a query ---- */
  queueRun() {
    if (this.askMode) return;
    if (this.debounce != null) window.clearTimeout(this.debounce);
    this.debounce = window.setTimeout(() => {
      this.debounce = null;
      this.run();
    }, 90);
  }
  run() {
    const q = this.inputEl.value.trim();
    this.sel = 0;
    this.rows = [];
    this.listEl.empty();
    if (!q) {
      this.renderRecent();
      return;
    }
    this.renderResults(this.plugin.search.query(q, { scope: this.activeScope().path }));
  }
  /* ---- rendering ---- */
  /** "notebook › section" breadcrumb for a folder path; the vault name at root. */
  folderCrumb(folder) {
    return folder === "/" || !folder ? this.app.vault.getName() : folder.split("/").join(" \u203A ");
  }
  renderRecent() {
    const files = this.plugin.settings.recentPages.map((p) => this.app.vault.getAbstractFileByPath(p)).filter((f) => f instanceof import_obsidian.TFile).slice(0, 12);
    if (files.length) this.listEl.createDiv({ cls: "pe-search-group", text: "Recent pages" });
    for (const f of files) {
      this.renderRow({ path: f.path, anchor: 0, kind: "body" }, f.basename, [], this.folderCrumb(f.parent?.path ?? "/"), null);
    }
    this.metaEl.setText(this.indexingNote() + 'Type to search \xB7 "quotes" match phrases \xB7 Tab switches scope');
    this.select(0);
  }
  renderResults(hits) {
    if (!hits.length) {
      this.listEl.createDiv({ cls: "pe-empty", text: "No matches. Every word must match; check the scope chip." });
      this.metaEl.setText(this.indexingNote() + "0 results");
      return;
    }
    const titleHits = hits.filter((h) => h.titleAll);
    const textHits = hits.filter((h) => !h.titleAll);
    if (titleHits.length && textHits.length) {
      this.listEl.createDiv({ cls: "pe-search-section", text: `In title \xB7 ${titleHits.length}` });
      this.renderGrouped(titleHits);
      this.listEl.createDiv({ cls: "pe-search-section", text: `In text \xB7 ${textHits.length}` });
      this.renderGrouped(textHits);
    } else {
      this.renderGrouped(hits);
    }
    this.metaEl.setText(
      this.indexingNote() + `${hits.length} result${hits.length === 1 ? "" : "s"} \xB7 \u2191\u2193 move \xB7 Enter opens \xB7 Ctrl+Enter new tab`
    );
    this.select(0);
  }
  /** Render hits grouped by their folder crumb, in ranking order. */
  renderGrouped(hits) {
    const groups = /* @__PURE__ */ new Map();
    for (const h of hits) {
      const folder = parentPathOf(h.path);
      let g = groups.get(folder);
      if (!g) groups.set(folder, g = []);
      g.push(h);
    }
    for (const [folder, hs] of groups) {
      this.listEl.createDiv({ cls: "pe-search-group", text: this.folderCrumb(folder) });
      for (const h of hs) {
        const sub = h.kind === "attach" ? h.heading : h.heading ? "\u203A " + h.heading : "";
        this.renderRow(h, h.title, h.titleRanges, sub, h.snippet);
      }
    }
  }
  indexingNote() {
    return this.plugin.search.ready ? "" : "Still indexing, results may be incomplete \xB7 ";
  }
  renderRow(target, title, titleRanges, sub, snippet) {
    const idx = this.rows.length;
    this.rows.push(target);
    const row = this.listEl.createDiv({ cls: "pe-search-hit", attr: { "data-idx": String(idx) } });
    const titleEl = row.createDiv({ cls: "pe-search-title" });
    if (target.kind === "attach") {
      const m = sub.match(/\.(\w{2,5})$/);
      const ext = (m ? m[1] : target.path.split(".").pop() ?? "file").toUpperCase();
      titleEl.createSpan({ cls: "pe-search-badge", text: ext });
    }
    this.renderMarked(titleEl.createSpan(), title, titleRanges);
    if (sub) titleEl.createSpan({ cls: "pe-search-head", text: " " + sub });
    if (snippet?.text && !this.plugin.settings.searchCompact) {
      this.renderMarked(row.createDiv({ cls: "pe-search-snippet" }), snippet.text, snippet.ranges);
    }
    row.addEventListener("click", (e) => this.openTarget(target, e.ctrlKey || e.metaKey));
    row.addEventListener("mousemove", () => {
      if (this.sel !== idx) this.select(idx);
    });
  }
  /** Render text with the engine-computed [start, end) ranges highlighted
   *  titles and snippets light up through the same matcher, never two. */
  renderMarked(el, text, ranges) {
    let at = 0;
    for (const [s, e] of ranges) {
      if (s > at) el.appendText(text.slice(at, s));
      el.createSpan({ cls: "pe-search-mark", text: text.slice(s, e) });
      at = e;
    }
    if (at < text.length) el.appendText(text.slice(at));
  }
  /* ---- selection and opening ---- */
  select(idx) {
    if (!this.rows.length) return;
    this.sel = Math.max(0, Math.min(this.rows.length - 1, idx));
    this.listEl.querySelectorAll(".pe-search-hit.is-selected").forEach((el) => el.removeClass("is-selected"));
    const row = this.listEl.querySelector(`.pe-search-hit[data-idx="${this.sel}"]`);
    row?.addClass("is-selected");
    row?.scrollIntoView({ block: "nearest" });
  }
  keydown(e) {
    if (this.askMode) {
      if (e.key === "Enter") {
        void this.runAsk();
        e.preventDefault();
      } else if (e.key === "Tab") {
        this.toggleAsk();
        e.preventDefault();
      }
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      this.select(this.sel + (e.key === "ArrowDown" ? 1 : -1));
      e.preventDefault();
    } else if (e.key === "Enter") {
      const t = this.rows[this.sel];
      if (t) this.openTarget(t, e.ctrlKey || e.metaKey);
      e.preventDefault();
    } else if (e.key === "Tab") {
      const choices = this.scopeChoices();
      const at = choices.findIndex((s) => s.key === this.activeScope().key);
      this.setScope(choices[(at + 1) % choices.length].key);
      e.preventDefault();
    }
  }
  openTarget(t, newTab) {
    this.close();
    const lower = t.path.toLowerCase();
    if (t.kind === "attach" && !lower.endsWith(".md")) {
      const link = lower.endsWith(".pdf") && t.anchor ? `${t.path}#page=${t.anchor}` : t.path;
      void (async () => {
        if (!newTab) await this.plugin.focusOpenTab(t.path);
        await this.app.workspace.openLinkText(link, "", newTab);
      })();
      return;
    }
    const f = this.app.vault.getAbstractFileByPath(t.path);
    if (f instanceof import_obsidian.TFile) {
      const eState = { line: t.anchor };
      const going = newTab ? (async () => {
        const leaf = this.app.workspace.getLeaf(true);
        await leaf.openFile(f, { eState });
        return leaf;
      })() : this.plugin.showPage(f, eState);
      void going.then((leaf) => {
        if (t.terms?.length) this.plugin.highlightMatches(leaf, t.terms, t.anchor);
      });
    }
  }
};
var ConfirmModal = class extends import_obsidian.Modal {
  constructor(app, heading, detail, cta, onConfirm) {
    super(app);
    this.heading = heading;
    this.detail = detail;
    this.cta = cta;
    this.onConfirm = onConfirm;
  }
  onOpen() {
    this.titleEl.setText(this.heading);
    this.contentEl.createEl("p", { cls: "pe-modal-desc", text: this.detail });
    const btns = this.contentEl.createDiv({ cls: "pe-modal-btns" });
    btns.createEl("button", { text: "Cancel" }).addEventListener("click", () => this.close());
    const go = btns.createEl("button", { text: this.cta, cls: "mod-cta" });
    go.addEventListener("click", () => {
      this.close();
      this.onConfirm();
    });
    go.focus();
  }
  onClose() {
    this.contentEl.empty();
  }
};
var ConfirmDeleteModal = class extends import_obsidian.Modal {
  constructor(app, name, onConfirm, detail = "This follows your 'Deleted files' setting (trash by default).") {
    super(app);
    this.name = name;
    this.onConfirm = onConfirm;
    this.detail = detail;
  }
  onOpen() {
    this.titleEl.setText(`Delete "${this.name}"?`);
    this.contentEl.createEl("p", { cls: "pe-modal-desc", text: this.detail });
    const btns = this.contentEl.createDiv({ cls: "pe-modal-btns" });
    btns.createEl("button", { text: "Cancel" }).addEventListener("click", () => this.close());
    const del = btns.createEl("button", { text: "Delete", cls: "mod-warning" });
    del.addEventListener("click", () => {
      this.close();
      this.onConfirm();
    });
    del.focus();
  }
  onClose() {
    this.contentEl.empty();
  }
};
var FolderNameModal = class extends import_obsidian.Modal {
  constructor(app, opts, onSubmit) {
    super(app);
    this.opts = opts;
    this.onSubmit = onSubmit;
  }
  onOpen() {
    this.titleEl.setText(this.opts.title);
    const input = this.contentEl.createEl("input", { attr: { type: "text", spellcheck: "false" } });
    input.value = this.opts.value;
    input.addClass("pe-modal-input");
    const btns = this.contentEl.createDiv({ cls: "pe-modal-btns" });
    btns.createEl("button", { text: "Cancel" }).addEventListener("click", () => this.close());
    const save = btns.createEl("button", { text: this.opts.cta, cls: "mod-cta" });
    const commit = () => {
      const v = input.value.trim();
      this.close();
      if (v) this.onSubmit(v);
    };
    save.addEventListener("click", commit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") commit();
    });
    input.focus();
    input.select();
  }
  onClose() {
    this.contentEl.empty();
  }
};
var IconPromptModal = class extends import_obsidian.Modal {
  constructor(app, current, onPick) {
    super(app);
    this.current = current;
    this.onPick = onPick;
  }
  onOpen() {
    this.titleEl.setText("Section icon");
    this.contentEl.createEl("p", { cls: "pe-modal-desc", text: "Any emoji (or a short glyph) shown before the folder name." });
    const input = this.contentEl.createEl("input", {
      attr: { type: "text", maxlength: "8", spellcheck: "false", placeholder: "e.g. \u{1F4CC}" }
    });
    input.value = this.current ?? "";
    const btns = this.contentEl.createDiv({ cls: "pe-modal-btns" });
    btns.createEl("button", { text: "Cancel" }).addEventListener("click", () => this.close());
    const save = btns.createEl("button", { text: "Set icon", cls: "mod-cta" });
    const commit = () => {
      this.close();
      this.onPick(input.value.trim() || null);
    };
    save.addEventListener("click", commit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") commit();
    });
    input.focus();
    input.select();
  }
  onClose() {
    this.contentEl.empty();
  }
};
var POWER_APPS = [
  { prefix: "powerexplorer", label: "Power Explorer", icon: "compass" },
  { prefix: "powerassistant", label: "Power Assistant", icon: "sparkles" },
  { prefix: "powercapture", label: "Power Assistant", icon: "sparkles" },
  { prefix: "powereditor", label: "Power Editor", icon: "pen-line" },
  { prefix: "powerbases", label: "Power Bases", icon: "database" },
  { prefix: "powertables", label: "Power Tables", icon: "table" },
  { prefix: "powerdesk", label: "Power Desk", icon: "calendar-days" },
  { prefix: "powercalendar", label: "Power Desk", icon: "calendar-days" }
];
var POWER_APP_ORDER = ["Power Explorer", "Power Assistant", "Power Editor", "Power Bases", "Power Tables", "Power Desk"];
var FAVORITES_TAB = "Favorites";
var LAUNCHER_NOISE = /\b(insert|move|delete|clear|duplicate|reset|paste|fill|prettify|verify|re-extract|autofit)\b|\b(rows?|columns?|cells?|borders?)\b|\b(above|below)\b|\bthis (note|table|base|meeting)\b|add or change|rename speakers|copy (summary|table)|export as/i;
var PowerLauncherModal = class extends import_obsidian.Modal {
  constructor(plugin) {
    super(plugin.app);
    this.plugin = plugin;
    this.items = [];
    this.byId = /* @__PURE__ */ new Map();
    this.tabs = [];
    this.activeTab = FAVORITES_TAB;
    this.query = "";
    this.rows = [];
    this.active = 0;
  }
  onOpen() {
    this.modalEl.addClass("pe-launcher-modal");
    this.titleEl.setText("Power apps");
    this.items = this.collect();
    this.byId = new Map(this.items.map((it) => [it.id, it]));
    const appsPresent = POWER_APP_ORDER.filter((app) => this.items.some((it) => it.app === app));
    this.tabs = [FAVORITES_TAB, ...appsPresent];
    if (!this.tabs.includes(this.activeTab)) this.activeTab = this.tabs[0];
    const head = this.contentEl.createDiv({ cls: "pe-launcher-head" });
    const search = head.createEl("input", {
      cls: "pe-launcher-search",
      attr: { type: "text", spellcheck: "false", placeholder: "Search Power commands\u2026" }
    });
    const clear = head.createEl("button", { cls: "pe-launcher-clear is-hidden", attr: { type: "button", "aria-label": "Clear search" } });
    (0, import_obsidian.setIcon)(clear, "x");
    const syncClear = () => clear.toggleClass("is-hidden", !search.value);
    this.tabBar = this.contentEl.createDiv({ cls: "pe-settings-tabs pe-launcher-tabs" });
    this.listEl = this.contentEl.createDiv({ cls: "pe-launcher-body" });
    this.renderTabs();
    this.render();
    search.addEventListener("input", () => {
      this.query = search.value;
      syncClear();
      this.render();
    });
    clear.addEventListener("click", () => {
      search.value = "";
      this.query = "";
      syncClear();
      this.render();
      search.focus();
    });
    search.addEventListener("keydown", (e) => this.onKey(e));
    search.focus();
  }
  collect() {
    const reg = this.app.commands;
    const out = [];
    for (const id in reg.commands) {
      if (id === "powerexplorer:open-launcher") continue;
      const app = POWER_APPS.find((a) => id.startsWith(a.prefix + ":"));
      if (!app) continue;
      const cmd = reg.commands[id];
      const short = cmd.name.replace(/^Power[^:]*:\s*/i, "").replace(/[.…]+$/, "");
      if (LAUNCHER_NOISE.test(short)) continue;
      out.push({ id, name: short, icon: cmd.icon || app.icon, app: app.label });
    }
    return out;
  }
  renderTabs() {
    this.tabBar.empty();
    for (const tab of this.tabs) {
      const btn = this.tabBar.createEl("button", { cls: "pe-settings-tab" });
      if (tab === FAVORITES_TAB) (0, import_obsidian.setIcon)(btn.createSpan({ cls: "pe-launcher-tab-ic" }), "star");
      btn.createSpan({ text: tab });
      btn.toggleClass("is-active", tab === this.activeTab);
      btn.onclick = () => {
        if (this.activeTab === tab) return;
        this.activeTab = tab;
        for (const o of Array.from(this.tabBar.children)) o.toggleClass("is-active", o === btn);
        this.render();
      };
    }
  }
  render() {
    this.listEl.empty();
    this.rows = [];
    const q = this.query.trim().toLowerCase();
    this.tabBar.style.display = q ? "none" : "";
    if (q) {
      for (const app of POWER_APP_ORDER) {
        const list = this.matching(app, q);
        if (!list.length) continue;
        this.listEl.createDiv({ cls: "pe-launcher-cat", text: app });
        for (const it of list) this.addRow(it, false);
      }
      if (!this.rows.length) this.listEl.createDiv({ cls: "pe-launcher-empty", text: "No commands match your search." });
    } else if (this.activeTab === FAVORITES_TAB) {
      const favs = this.favoriteItems();
      if (!favs.length) {
        this.listEl.createDiv({
          cls: "pe-launcher-empty",
          text: "No favorites yet. Hover any command in the other tabs and click its \u2605 to pin it here, then drag to reorder."
        });
      } else {
        for (const it of favs) this.addRow(it, true);
      }
    } else {
      for (const it of this.orderedItems(this.activeTab)) this.addRow(it, true);
      if (!this.rows.length) this.listEl.createDiv({ cls: "pe-launcher-empty", text: "No Power apps are enabled." });
    }
    this.setActive(0);
  }
  favoriteItems() {
    return this.plugin.settings.launcherFavorites.map((id) => this.byId.get(id)).filter((x) => !!x);
  }
  /** A plugin tab's commands in the user's saved drag order; anything not yet
   *  ordered (e.g. a command added by a plugin update) trails alphabetically. */
  orderedItems(app) {
    const saved = this.plugin.settings.launcherOrder[app] ?? [];
    const pos = new Map(saved.map((id, i) => [id, i]));
    return this.items.filter((it) => it.app === app).sort((a, b) => {
      const pa = pos.has(a.id) ? pos.get(a.id) : Infinity;
      const pb = pos.has(b.id) ? pos.get(b.id) : Infinity;
      return pa !== pb ? pa - pb : a.name.localeCompare(b.name);
    });
  }
  matching(app, q) {
    return this.items.filter((it) => it.app === app && (!q || it.name.toLowerCase().includes(q) || app.toLowerCase().includes(q))).sort((a, b) => a.name.localeCompare(b.name));
  }
  addRow(it, draggable) {
    const reg = this.app.commands;
    const row = this.listEl.createDiv({ cls: "pe-launcher-row" });
    (0, import_obsidian.setIcon)(row.createDiv({ cls: "pe-launcher-row-ic" }), it.icon);
    row.createDiv({ cls: "pe-launcher-row-name", text: it.name });
    const on = this.plugin.isFavoriteCommand(it.id);
    const star = row.createDiv({ cls: "pe-launcher-star", attr: { "aria-label": on ? "Remove from Favorites" : "Add to Favorites" } });
    star.toggleClass("is-on", on);
    (0, import_obsidian.setIcon)(star, "star");
    star.addEventListener("click", (e) => {
      e.stopPropagation();
      this.plugin.toggleFavoriteCommand(it.id);
      this.render();
    });
    const idx = this.rows.length;
    row.addEventListener("mouseenter", () => this.setActive(idx));
    row.addEventListener("click", () => {
      this.close();
      reg.executeCommandById(it.id);
    });
    if (draggable) this.makeDraggable(row, it.id);
    this.rows.push(row);
  }
  /** Favorites reorder by dragging a grip handle. Pointer-based, because
   *  Obsidian (Electron) suppresses native HTML5 drag. The row body stays
   *  click-to-run; only the grip starts a drag, with a top/bottom drop marker
   *  committed to settings on release. */
  makeDraggable(row, id) {
    row.dataset.rowId = id;
    const grip = createDiv({ cls: "pe-launcher-grip", attr: { "aria-label": "Drag to reorder" } });
    (0, import_obsidian.setIcon)(grip, "grip-vertical");
    row.prepend(grip);
    grip.addEventListener("click", (e) => e.stopPropagation());
    grip.addEventListener("pointerdown", (e) => this.startDrag(e, id, row));
  }
  startDrag(e, id, row) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    row.addClass("is-dragging");
    let drop = null;
    const clear = () => this.rows.forEach((r) => r.removeClasses(["drop-before", "drop-after"]));
    const onMove = (ev) => {
      clear();
      drop = null;
      for (const r of this.rows) {
        const rect = r.getBoundingClientRect();
        if (ev.clientY < rect.top || ev.clientY > rect.bottom) continue;
        const tid = r.dataset.rowId;
        if (!tid || tid === id) break;
        const after = ev.clientY > rect.top + rect.height / 2;
        r.toggleClass("drop-after", after);
        r.toggleClass("drop-before", !after);
        drop = { id: tid, after };
        break;
      }
    };
    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      clear();
      row.removeClass("is-dragging");
      if (drop) this.commitReorder(id, drop.id, drop.after);
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }
  /** Move the dragged command relative to the target within whichever tab is
   *  active (the Favorites list or this app's own order) and persist it. */
  commitReorder(draggedId, targetId, after) {
    if (draggedId === targetId) return;
    const ids = this.activeTab === FAVORITES_TAB ? [...this.plugin.settings.launcherFavorites] : this.orderedItems(this.activeTab).map((it) => it.id);
    const from = ids.indexOf(draggedId);
    if (from < 0) return;
    ids.splice(from, 1);
    const to = ids.indexOf(targetId);
    if (to < 0) return;
    ids.splice(after ? to + 1 : to, 0, draggedId);
    if (this.activeTab === FAVORITES_TAB) this.plugin.setFavoriteOrder(ids);
    else this.plugin.setLauncherAppOrder(this.activeTab, ids);
    this.render();
  }
  setActive(i) {
    if (!this.rows.length) return;
    this.active = Math.max(0, Math.min(i, this.rows.length - 1));
    this.rows.forEach((r, n) => r.toggleClass("is-active", n === this.active));
    this.rows[this.active]?.scrollIntoView({ block: "nearest" });
  }
  onKey(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.rows[this.active]?.click();
    } else if (e.key === "ArrowDown" || e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      this.setActive(this.active + 1);
    } else if (e.key === "ArrowUp" || e.key === "Tab" && e.shiftKey) {
      e.preventDefault();
      this.setActive(this.active - 1);
    }
  }
  onClose() {
    this.contentEl.empty();
  }
};
var IconPickerModal = class extends import_obsidian.Modal {
  constructor(plugin, current, onPick) {
    super(plugin.app);
    this.plugin = plugin;
    this.current = current;
    this.onPick = onPick;
    this.lucide = [];
  }
  onOpen() {
    this.modalEl.addClass("pe-icon-modal");
    this.titleEl.setText("Choose an icon");
    this.lucide = (0, import_obsidian.getIconIds)().filter((id) => id.startsWith("lucide-")).map((id) => id.slice("lucide-".length));
    const head = this.contentEl.createDiv({ cls: "pe-icon-head" });
    const search = head.createEl("input", {
      cls: "pe-icon-search",
      attr: { type: "text", spellcheck: "false", placeholder: "Search icons\u2026" }
    });
    head.createEl("button", { cls: "pe-icon-upload", text: "Upload image\u2026" }).addEventListener("click", () => void this.upload());
    head.createEl("button", { text: "Remove" }).addEventListener("click", () => this.pick(""));
    this.gridEl = this.contentEl.createDiv({ cls: "pe-icon-grids" });
    this.render("");
    search.addEventListener("input", () => this.render(search.value));
    search.focus();
  }
  render(query) {
    this.gridEl.empty();
    const q = query.trim().toLowerCase();
    if (!q) {
      this.gridEl.createDiv({ cls: "pe-icon-cat", text: "Emoji" });
      const eg = this.gridEl.createDiv({ cls: "pe-icon-grid" });
      for (const e of EMOJI_PICKS) this.cell(eg, e, () => this.pick(e)).setText(e);
    }
    this.gridEl.createDiv({ cls: "pe-icon-cat", text: q ? "Matching icons" : "Icons" });
    const ig = this.gridEl.createDiv({ cls: "pe-icon-grid" });
    const names = (q ? this.lucide.filter((n) => n.includes(q)) : this.lucide).slice(0, 240);
    for (const name of names) (0, import_obsidian.setIcon)(this.cell(ig, name, () => this.pick(name)), name);
    if (!names.length) ig.createDiv({ cls: "pe-icon-none", text: "No icons match (try another word, or upload an image)." });
  }
  cell(grid, value, onClick) {
    const el = grid.createDiv({ cls: "pe-icon-cell", attr: { "aria-label": value } });
    if (value === this.current) el.addClass("is-current");
    el.addEventListener("click", onClick);
    return el;
  }
  async upload() {
    const input = createEl("input", { attr: { type: "file", accept: "image/*" } });
    input.addEventListener("change", () => {
      void (async () => {
        const file = input.files?.[0];
        if (!file) return;
        try {
          const buf = await file.arrayBuffer();
          const path = await this.app.fileManager.getAvailablePathForAttachment(file.name);
          const tf = await this.app.vault.createBinary(path, buf);
          this.pick(`[[${tf.path}]]`);
        } catch {
          new Notice("Power Explorer: couldn't import that image.");
        }
      })();
    });
    input.click();
  }
  pick(value) {
    this.close();
    void this.onPick(value);
  }
  onClose() {
    this.contentEl.empty();
  }
};
var PageTemplateGallery = class extends import_obsidian.Modal {
  constructor(plugin, folder, onPick) {
    super(plugin.app);
    this.plugin = plugin;
    this.folder = folder;
    this.onPick = onPick;
    this.comp = new import_obsidian.Component();
    this.notes = [];
    this.cards = [];
    this.active = 0;
    /** Previews render only when a card scrolls into view, so a broad templates
     *  folder can't stall the modal by rendering dozens of notes up front. */
    this.io = null;
    this.toPreview = /* @__PURE__ */ new WeakMap();
    this.defaultPath = plugin.templateForFolder(folder)?.path ?? null;
  }
  onOpen() {
    this.comp.load();
    this.modalEl.addClass("pe-tpl-modal");
    this.titleEl.setText("New page");
    const where = this.folder.path === "/" ? this.app.vault.getName() : this.folder.name;
    const head = this.contentEl.createDiv({ cls: "pe-tpl-head" });
    this.searchEl = head.createEl("input", {
      cls: "pe-tpl-search",
      attr: { type: "text", spellcheck: "false", placeholder: `Search templates, new page in ${where}` }
    });
    const newBtn = head.createEl("button", { cls: "pe-tpl-new", text: "\uFF0B New template" });
    newBtn.addEventListener("click", () => {
      this.close();
      void this.plugin.newTemplate();
    });
    this.gridEl = this.contentEl.createDiv({ cls: "pe-tpl-grid" });
    this.io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          const f = this.toPreview.get(en.target);
          this.io?.unobserve(en.target);
          if (f) void this.renderPreview(f, en.target);
        }
      },
      { root: this.gridEl, rootMargin: "150px" }
    );
    this.notes = this.plugin.templatesForFolder(this.folder);
    this.render("");
    this.searchEl.addEventListener("input", () => this.render(this.searchEl.value));
    this.searchEl.addEventListener("keydown", (e) => this.onKey(e));
    this.searchEl.focus();
  }
  render(query) {
    this.io?.disconnect();
    this.gridEl.empty();
    this.cards = [];
    const q = query.trim().toLowerCase();
    if (!q || "blank page".includes(q)) this.addBlankCard();
    for (const f of this.notes) {
      const meta = this.plugin.templateMeta(f);
      if (q && !`${f.basename} ${meta.desc}`.toLowerCase().includes(q)) continue;
      this.addTemplateCard(f, meta);
    }
    if (!this.cards.length) {
      this.gridEl.createDiv({
        cls: "pe-tpl-empty",
        text: this.notes.length ? "No templates match your search." : "No templates yet: click \uFF0B New template to make one."
      });
    }
    this.setActive(0);
  }
  addBlankCard() {
    const card = this.gridEl.createDiv({ cls: "pe-tpl-card is-blank" });
    const row = card.createDiv({ cls: "pe-tpl-card-head" });
    row.createSpan({ cls: "pe-tpl-ic", text: "\u{1F4C4}" });
    row.createDiv({ cls: "pe-tpl-name", text: "Blank page" });
    card.createDiv({ cls: "pe-tpl-desc", text: "Start from scratch." });
    this.wireCard(card, () => this.choose(null));
  }
  addTemplateCard(f, meta) {
    const card = this.gridEl.createDiv({ cls: "pe-tpl-card" });
    const row = card.createDiv({ cls: "pe-tpl-card-head" });
    const ic = row.createSpan({ cls: "pe-tpl-ic pe-tpl-ic-btn", attr: { "aria-label": "Change icon" } });
    this.plugin.renderTemplateIcon(ic, meta.icon);
    ic.addEventListener("click", (e) => {
      e.stopPropagation();
      new IconPickerModal(this.plugin, meta.icon, async (v) => {
        await this.plugin.setTemplateIcon(f, v);
        meta.icon = v;
        this.plugin.renderTemplateIcon(ic, v);
      }).open();
    });
    row.createDiv({ cls: "pe-tpl-name", text: f.basename });
    if (this.defaultPath === f.path) row.createSpan({ cls: "pe-tpl-badge", text: "Default" });
    const edit = row.createSpan({ cls: "pe-tpl-edit", attr: { "aria-label": "Edit this template" } });
    (0, import_obsidian.setIcon)(edit, "pencil");
    edit.addEventListener("click", (e) => {
      e.stopPropagation();
      this.close();
      void this.plugin.showPage(f);
    });
    if (meta.desc) card.createDiv({ cls: "pe-tpl-desc", text: meta.desc });
    const named = this.plugin.previewName(this.folder, f);
    if (named) card.createDiv({ cls: "pe-tpl-filename", text: named });
    const prev = card.createDiv({ cls: "pe-tpl-card-preview" });
    this.toPreview.set(prev, f);
    this.io?.observe(prev);
    this.wireCard(card, () => this.choose(f));
  }
  wireCard(card, onClick) {
    const idx = this.cards.length;
    card.addEventListener("click", onClick);
    card.addEventListener("mouseenter", () => this.setActive(idx));
    this.cards.push(card);
  }
  async renderPreview(f, el) {
    try {
      const body = stripTemplateMeta(await this.app.vault.read(f)).slice(0, 800);
      await import_obsidian.MarkdownRenderer.render(this.app, body || "*(empty template)*", el, f.path, this.comp);
    } catch {
      el.setText("Preview unavailable.");
    }
  }
  setActive(i) {
    if (!this.cards.length) return;
    this.active = Math.max(0, Math.min(i, this.cards.length - 1));
    this.cards.forEach((c, n) => c.toggleClass("is-active", n === this.active));
    this.cards[this.active]?.scrollIntoView({ block: "nearest" });
  }
  onKey(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.cards[this.active]?.click();
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      this.setActive(this.active + 1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "Tab" && e.shiftKey) {
      e.preventDefault();
      this.setActive(this.active - 1);
    }
  }
  choose(tpl) {
    this.close();
    void this.onPick(tpl);
  }
  onClose() {
    this.io?.disconnect();
    this.io = null;
    this.comp.unload();
    this.contentEl.empty();
  }
};
var TemplatePromptModal = class extends import_obsidian.Modal {
  constructor(app, current, onPick) {
    super(app);
    this.current = current;
    this.onPick = onPick;
  }
  onOpen() {
    this.titleEl.setText("Page template");
    this.contentEl.createEl("p", {
      cls: "pe-modal-desc",
      text: "New pages in this folder (and its subfolders, unless they set their own) start as a copy of this note. Leave blank for a blank page."
    });
    const listId = "pe-tpl-" + Math.floor(performance.now());
    const dl = this.contentEl.createEl("datalist", { attr: { id: listId } });
    for (const f of this.app.vault.getMarkdownFiles()) {
      if (f.path.toLowerCase().includes("template")) dl.createEl("option", { attr: { value: f.path } });
    }
    const input = this.contentEl.createEl("input", {
      attr: { type: "text", spellcheck: "false", placeholder: "Templates/Meeting.md", list: listId }
    });
    input.value = this.current ?? "";
    input.addClass("pe-modal-input");
    const btns = this.contentEl.createDiv({ cls: "pe-modal-btns" });
    btns.createEl("button", { text: "Cancel" }).addEventListener("click", () => this.close());
    const save = btns.createEl("button", { text: "Save", cls: "mod-cta" });
    const commit = () => {
      const v = input.value.trim();
      if (v && !(this.app.vault.getAbstractFileByPath(v) instanceof import_obsidian.TFile)) {
        new Notice("Power Explorer: no note found at that path.");
        return;
      }
      this.close();
      this.onPick(v || null);
    };
    save.addEventListener("click", commit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") commit();
    });
    input.focus();
    input.select();
  }
  onClose() {
    this.contentEl.empty();
  }
};
var TemplateAskModal = class extends import_obsidian.Modal {
  constructor(app, templateName, fields, resolve) {
    super(app);
    this.templateName = templateName;
    this.fields = fields;
    this.resolve = resolve;
    this.answers = {};
    this.done = false;
  }
  onOpen() {
    this.titleEl.setText(this.templateName);
    const c = this.contentEl;
    c.addClass("pe-ask-modal");
    c.createEl("p", { cls: "pe-modal-desc", text: "This template asks for a few details before the page is made." });
    const inputs = [];
    for (const f of this.fields) {
      this.answers[f.question] = "";
      const row = c.createDiv({ cls: "pe-ask-row" });
      row.createEl("label", { cls: "pe-ask-label", text: f.question });
      const input = row.createEl("input", {
        cls: "pe-ask-input",
        attr: { type: "text", spellcheck: "false", placeholder: f.fallback || "" }
      });
      input.addEventListener("input", () => this.answers[f.question] = input.value);
      input.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        const next = inputs[inputs.indexOf(input) + 1];
        if (next) next.focus();
        else this.finish();
      });
      inputs.push(input);
    }
    const btns = c.createDiv({ cls: "pe-modal-btns" });
    btns.createEl("button", { text: "Cancel" }).addEventListener("click", () => this.close());
    btns.createEl("button", { text: "Create", cls: "mod-cta" }).addEventListener("click", () => this.finish());
    inputs[0]?.focus();
  }
  finish() {
    this.done = true;
    this.close();
    this.resolve(this.answers);
  }
  onClose() {
    this.contentEl.empty();
    if (!this.done) this.resolve(null);
  }
};
var FolderTemplatesModal = class extends import_obsidian.Modal {
  constructor(plugin, folder) {
    super(plugin.app);
    this.plugin = plugin;
    this.folder = folder;
  }
  onOpen() {
    const where = this.folder.path === "/" ? this.app.vault.getName() : this.folder.name;
    this.titleEl.setText(`Templates for ${where}`);
    const notes = this.plugin.templateNotes();
    if (!notes.length) {
      this.contentEl.createEl("p", {
        cls: "pe-modal-desc",
        text: "No templates yet. Make one from the New page gallery, then come back to choose which of them this folder offers."
      });
      return;
    }
    this.contentEl.createEl("p", {
      cls: "pe-modal-desc",
      text: "The templates this folder offers first when you add a page. Subfolders inherit this until they set their own. Tick nothing and the folder falls back to what each template says it is for."
    });
    const chosen = new Set(this.plugin.settings.folderTemplates[this.folder.path] ?? []);
    const list = this.contentEl.createDiv({ cls: "pe-tpl-picklist" });
    for (const f of notes) {
      const row = list.createEl("label", { cls: "pe-tpl-pick" });
      const box = row.createEl("input", { attr: { type: "checkbox" } });
      box.checked = chosen.has(f.path);
      box.addEventListener("change", () => box.checked ? chosen.add(f.path) : chosen.delete(f.path));
      const meta = this.plugin.templateMeta(f);
      this.plugin.renderTemplateIcon(row.createSpan({ cls: "pe-tpl-ic pe-tpl-ic-inline" }), meta.icon);
      row.createSpan({ cls: "pe-tpl-pick-name", text: f.basename });
      if (meta.filename) row.createSpan({ cls: "pe-tpl-pick-pattern", text: meta.filename });
    }
    const btns = this.contentEl.createDiv({ cls: "pe-modal-btns" });
    btns.createEl("button", { text: "Cancel" }).addEventListener("click", () => this.close());
    btns.createEl("button", { text: "Save", cls: "mod-cta" }).addEventListener("click", () => {
      this.plugin.setFolderTemplates(this.folder, notes.filter((f) => chosen.has(f.path)).map((f) => f.path));
      this.close();
    });
  }
  onClose() {
    this.contentEl.empty();
  }
};
var BarCommandPicker = class extends import_obsidian.FuzzySuggestModal {
  constructor(plugin, onPick) {
    super(plugin.app);
    this.plugin = plugin;
    this.onPick = onPick;
    this.setPlaceholder("Pick a command for the explorer toolbar");
  }
  getItems() {
    const reg = this.plugin.app.commands;
    const chosen = new Set(this.plugin.settings.explorerBarCommands);
    return Object.values(reg.commands).filter((cmd) => !chosen.has(cmd.id)).sort((a, b) => a.name.localeCompare(b.name));
  }
  getItemText(it) {
    return it.name;
  }
  onChooseItem(it) {
    this.onPick(it.id);
  }
};
var DrawerCommandPicker = class extends import_obsidian.FuzzySuggestModal {
  constructor(plugin, onPick) {
    super(plugin.app);
    this.plugin = plugin;
    this.onPick = onPick;
    this.setPlaceholder("Pick a command for the drawer menu");
  }
  getItems() {
    const reg = this.plugin.app.commands;
    const chosen = new Set(this.plugin.settings.drawerMenuCommands);
    return Object.values(reg.commands).filter((cmd) => !chosen.has(cmd.id)).sort((a, b) => a.name.localeCompare(b.name));
  }
  getItemText(it) {
    return it.name;
  }
  onChooseItem(it) {
    this.onPick(it.id);
  }
};
var PowerExplorerSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(plugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
    /** Kept across re-renders so a self-triggered redraw (removing a hidden folder,
     *  adding a template) leaves you on the same tab with your search intact. Both
     *  belong to the fallback renderer; 1.13 has a page stack and a search of its own. */
    this.activeTab = "layout";
    this.query = "";
    this.helpEl = null;
    this.helpAnchor = null;
    this.helpPinned = false;
    this.helpCleanup = null;
    /** Re-indexing is expensive, so the exclude list waits for a pause in typing.
     *  Kept on the tab, not in a render closure, so a redraw mid-edit still cancels. */
    this.excludeTimer = null;
    plugin.refreshSettingsTab = () => this.refresh();
  }
  closeHelp() {
    this.helpCleanup?.();
    this.helpCleanup = null;
    this.helpEl?.remove();
    this.helpEl = null;
    this.helpAnchor = null;
    this.helpPinned = false;
  }
  /** Show the help popover for `icon`: a soft theme-colored card rather than the
   *  native black tooltip. Hover opens it; a click pins it so it survives the
   *  pointer leaving; Esc, a click elsewhere, or scrolling closes it. */
  openHelp(icon, text, pin) {
    if (this.helpAnchor === icon && this.helpEl) {
      if (pin) this.helpPinned = true;
      return;
    }
    this.closeHelp();
    const el = document.body.createDiv({ cls: "pe-help-pop", text });
    this.helpEl = el;
    this.helpAnchor = icon;
    this.helpPinned = pin;
    const r = icon.getBoundingClientRect();
    el.style.left = Math.max(8, Math.min(r.left - 12, window.innerWidth - el.offsetWidth - 8)) + "px";
    const below = r.bottom + 8;
    el.style.top = (below + el.offsetHeight > window.innerHeight - 8 ? r.top - el.offsetHeight - 8 : below) + "px";
    const onDocDown = (e) => {
      if (e.target instanceof Node && (el.contains(e.target) || icon.contains(e.target))) return;
      this.closeHelp();
    };
    const onKey = (e) => {
      if (e.key === "Escape") this.closeHelp();
    };
    const onScroll = () => this.closeHelp();
    document.addEventListener("pointerdown", onDocDown, true);
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("scroll", onScroll, true);
    this.helpCleanup = () => {
      document.removeEventListener("pointerdown", onDocDown, true);
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("scroll", onScroll, true);
    };
  }
  /** Redraw when the rows themselves change: a template added, a folder
   *  unhidden, a toolbar button removed. Obsidian 1.13 rebuilds the tab from
   *  getSettingDefinitions(); older builds have only the fallback renderer. */
  refresh() {
    if (!this.containerEl.isShown()) return;
    this.closeHelp();
    const tab = this;
    if (tab.update) tab.update();
    else this.renderFallback();
  }
  /** A small help icon after the setting name carrying the deeper "what does
   *  this actually do" explanation; hover shows it, a click pins it open so
   *  the one-line description stays scannable. No aria-label: Obsidian would
   *  double it up with its own native black tooltip. */
  addHelp(st, text) {
    const ic = st.nameEl.createSpan({ cls: "pe-setting-help" });
    (0, import_obsidian.setIcon)(ic, "help-circle");
    ic.addEventListener("mouseenter", () => this.openHelp(ic, text, false));
    ic.addEventListener("mouseleave", () => {
      if (!this.helpPinned && this.helpAnchor === ic) this.closeHelp();
    });
    ic.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.helpPinned && this.helpAnchor === ic) this.closeHelp();
      else this.openHelp(ic, text, true);
    });
  }
  /** Obsidian 1.13 and up builds the tab from these and never calls display():
   *  one native page per section, standing in for the tab bar the fallback
   *  draws for older builds.
   *
   *  Every row renders itself rather than declaring a `control`. These settings
   *  do more than store a value (they re-register commands, re-sort the tree,
   *  rewrite the toolbar), so they have to stay on the plugin's own save path;
   *  a declarative control would write through Obsidian's generic one instead
   *  and skip all of that. */
  getSettingDefinitions() {
    const pages = this.buildPages();
    const rowsOf = new Map(pages.map((p) => [p.label, p.rows]));
    return [
      {
        name: "",
        searchable: false,
        // it is a masthead, not a setting
        render: (s) => {
          s.settingEl.empty();
          this.renderAbout(s.settingEl);
        }
      },
      {
        type: "group",
        search: {
          placeholder: "Search settings...",
          // the entries here are whole sections, so a section stays up when
          // anything inside it matches. Obsidian's own search box, top left,
          // reaches the individual settings.
          match: (def, query) => {
            const q = query.trim().toLowerCase();
            if (!q) return true;
            const has = (s) => (s ?? "").toLowerCase().includes(q);
            return (rowsOf.get(def.name) ?? []).some(
              (r) => has(r.name) || has(r.desc) || (r.aliases ?? []).some(has)
            );
          }
        },
        items: pages.map(
          (p) => ({
            type: "page",
            name: p.label,
            items: p.rows.map(
              (r) => ({
                name: r.name,
                desc: r.desc,
                // searching the section name still finds its rows, the way
                // a heading match opened the whole section in the tab bar
                aliases: [...r.aliases ?? [], p.label],
                render: (s) => {
                  const teardown = r.build?.(s);
                  if (r.help) this.addHelp(s, r.help);
                  return teardown;
                }
              })
            )
          })
        )
      }
    ];
  }
  /** What this plugin is and which build is running, above the section list.
   *  Read off the manifest so it cannot drift from the released version. */
  renderAbout(el) {
    el.addClass("pe-about");
    const head = el.createDiv({ cls: "pe-about-head" });
    head.createSpan({ cls: "pe-about-name", text: this.plugin.manifest.name });
    head.createSpan({ cls: "pe-about-version", text: "v" + this.plugin.manifest.version });
    el.createDiv({ cls: "pe-about-desc", text: this.plugin.manifest.description });
    const support = el.createDiv({ cls: "pe-about-support" });
    support.createEl("a", { text: "Buy me a coffee", href: "https://buymeacoffee.com/powerplugins" });
    support.createSpan({
      text: `. One page covers every Power Plugin, so mention ${this.plugin.manifest.name} in the note, and say what would make it better while you are there. A good deal of what is in these plugins started as someone's note.`
    });
  }
  /** The pre-1.13 renderer: every section on one page, with a tab bar and a
   *  search box of our own because there was no declarative API to hand the
   *  work to. Obsidian 1.13 and up ignores this and renders the definitions
   *  above instead, so the two only ever differ in how they draw, never in
   *  what they draw. */
  display() {
    this.renderFallback();
  }
  renderFallback() {
    const root = this.containerEl;
    root.empty();
    this.closeHelp();
    const pages = this.buildPages();
    if (!pages.some((p) => p.id === this.activeTab)) this.activeTab = pages[0].id;
    this.renderAbout(root.createDiv({ cls: "pe-about-standalone" }));
    const searchWrap = root.createDiv({ cls: "pe-settings-search" });
    const searchInput = searchWrap.createEl("input", { cls: "pe-settings-search-input" });
    searchInput.type = "search";
    searchInput.placeholder = "Search settings...";
    searchInput.value = this.query;
    const tabBar = root.createDiv({ cls: "pe-settings-tabs" });
    const body = root.createDiv({ cls: "pe-settings-body" });
    for (const p of pages) {
      const sec = body.createDiv({ cls: "pe-settings-section" });
      sec.dataset.tab = p.id;
      sec.dataset.name = p.label.toLowerCase();
      new import_obsidian.Setting(sec).setName(p.label).setHeading();
      for (const r of p.rows) {
        const st = new import_obsidian.Setting(sec).setName(r.name);
        if (r.desc) st.setDesc(r.desc);
        if (r.aliases?.length) st.settingEl.dataset.peAlias = r.aliases.join(" ").toLowerCase();
        r.build?.(st);
        if (r.help) this.addHelp(st, r.help);
      }
    }
    const setVisible = (el, v) => el.style.display = v ? "" : "none";
    const applyView = () => {
      const q = this.query.trim().toLowerCase();
      setVisible(tabBar, !q);
      for (const sec of Array.from(body.children)) {
        const items = Array.from(sec.querySelectorAll(":scope > .setting-item:not(.setting-item-heading)"));
        if (!q) {
          for (const it of items) setVisible(it, true);
          setVisible(sec, sec.dataset.tab === this.activeTab);
          continue;
        }
        const nameHit = (sec.dataset.name ?? "").includes(q);
        let anyHit = false;
        for (const it of items) {
          const name = it.querySelector(".setting-item-name")?.textContent?.toLowerCase() ?? "";
          const desc = it.querySelector(".setting-item-description")?.textContent?.toLowerCase() ?? "";
          const hit = nameHit || name.includes(q) || desc.includes(q) || (it.dataset.peAlias ?? "").includes(q);
          setVisible(it, hit);
          if (hit) anyHit = true;
        }
        setVisible(sec, anyHit);
      }
    };
    for (const p of pages) {
      const btn = tabBar.createEl("button", { text: p.label, cls: "pe-settings-tab" });
      btn.toggleClass("is-active", p.id === this.activeTab);
      btn.onclick = () => {
        if (this.activeTab === p.id) return;
        this.activeTab = p.id;
        for (const other of Array.from(tabBar.children)) other.toggleClass("is-active", other === btn);
        applyView();
      };
    }
    searchInput.addEventListener("input", () => {
      this.query = searchInput.value;
      applyView();
    });
    applyView();
  }
  /** Every row of the settings tab, in order, as plain data: the one source
   *  both renderers draw from, so they cannot drift apart. Built fresh on each
   *  render because several sections list live state (the buttons actually in
   *  the toolbar, the folders you have hidden, the templates you have written). */
  buildPages() {
    const general = [
      {
        name: "Show notifications",
        desc: "Show popup notices from Power Explorer. Turn off to keep Obsidian clear, especially on phones.",
        help: "When off, Power Explorer suppresses every popup notice, including progress, success, warning, and error notices.",
        build: (s) => {
          s.addToggle(
            (t) => t.setValue(this.plugin.settings.showNotifications).onChange((v) => {
              this.plugin.settings.showNotifications = v;
              void this.plugin.persistSettings();
            })
          );
        }
      }
    ];
    const layout = [];
    const ordering = [];
    const templates = [];
    const search = [];
    layout.push({
      name: "Desktop layout",
      desc: "How the Files pane looks on desktop. Phones use Drill for every option except Obsidian default. The non-default options use a two-pane split (folders on the left, the selected folder's pages on the right). Drag the divider to resize.",
      help: "Not sure which to pick? Notebooks and sections is the OneNote-style two-level view most people want. Full folder tree stays closest to vanilla Obsidian, just inside the two-pane split. Phones ignore this and always use Drill (except on Obsidian default).",
      build: (s) => {
        const list = s.descEl.createEl("ul", { cls: "pe-setting-list" });
        const item = (name, text) => {
          const li = list.createEl("li");
          li.createEl("strong", { text: name });
          li.createSpan({ text: ": " + text });
        };
        item("Obsidian default", "the normal single-pane file explorer, untouched.");
        item("Full folder tree", "Obsidian's own nested tree on the left, every level.");
        item("Notebooks only", "just your top-level folders; the right pane drills everything below.");
        item("Notebooks and sections", "your top folders plus their immediate subfolders (two fixed levels); anything deeper opens on the right.");
        item("Drill", "one level at a time, everywhere.");
        s.descEl.createDiv({
          cls: "pe-setting-note",
          text: "On a vault only two levels deep, Full folder tree and Notebooks and sections look alike; the difference shows once folders nest three or more levels."
        });
        s.addDropdown(
          (d) => d.addOptions({
            default: "Obsidian default",
            tree: "Full folder tree",
            notebooks: "Notebooks only",
            onenote: "Notebooks and sections",
            drill: "Drill (one level at a time)"
          }).setValue(this.plugin.settings.sectionsLayout ? this.plugin.settings.desktopPane : "default").onChange((v) => this.plugin.setLayout(v))
        );
      }
    });
    layout.push({
      name: "Recent Pages",
      desc: "Pin a list of your last-opened notes above the folder tree.",
      help: "Recency is tracked whether this is on or off, so the list is already warm the moment you enable it. Click any entry to jump straight back to that note.",
      build: (s) => {
        s.addToggle(
          (t) => t.setValue(this.plugin.settings.showRecent).onChange((v) => {
            this.plugin.settings.showRecent = v;
            void this.plugin.persistSettings();
            this.plugin.reapplySections();
          })
        );
      }
    });
    layout.push({
      name: "Hide explorer buttons on phones",
      desc: "On phones, hide Obsidian's own explorer buttons while the drill view is up.",
      help: "The drill view has its own New page button, so Obsidian's new-note, new-folder, sort, and collapse buttons are redundant there. Turn this off to keep them. Desktop is never affected.",
      build: (s) => {
        s.addToggle((t) => t.setValue(this.plugin.settings.hidePhoneActions).onChange((v) => this.plugin.setHidePhoneActions(v)));
      }
    });
    layout.push({
      name: "A folder's own note makes it a page",
      desc: "A note named after the folder it sits in turns that folder into an expandable page instead of a plain folder.",
      aliases: ["folder note"],
      help: "Obsidian gives this shape no meaning of its own, so it is a choice. On, a folder holding a note of the same name becomes an expandable page anchored by that note, which suits a vault that uses such notes as covers. Off, the folder stays a folder you step into and the note is just a page inside it, which suits a vault where naming a page after its folder is only a habit. Either way this leaves alone the other shape, a note sitting BESIDE a folder of the same name, which stays an expandable page with its subpages.",
      build: (s) => {
        s.addToggle(
          (t) => t.setValue(this.plugin.settings.folderNoteGroups).onChange((v) => {
            this.plugin.settings.folderNoteGroups = v;
            void this.plugin.persistSettings();
            this.plugin.orderChanged();
          })
        );
      }
    });
    layout.push({
      name: "Phone: drawer tabs as a menu button",
      desc: "Fold the Files tab row into a menu button beside the vault settings, giving that row back to the folder list.",
      help: "Phones only, and off unless you ask. Obsidian already collapses these tabs into a menu that flies open on tap; it just spends a whole row on the trigger. That trigger moves up beside the settings gear, and its menu still lists Files, Bookmarks and the rest. Search in that menu opens this plugin's search, which reaches the whole vault rather than a pane. Nothing is hidden unless the move works, and everything goes back when this is turned off.",
      build: (s) => {
        s.addToggle((t) => t.setValue(this.plugin.settings.phoneDrawerMenu).onChange((v) => this.plugin.setPhoneDrawerMenu(v)));
      }
    });
    layout.push({
      name: "Phone: drawer menu entries",
      desc: "Choose what the drawer's switcher menu lists: hide built-in entries you never open, and add commands you want in reach.",
      help: "The menu behind the drawer's tab switcher (Files, Search, Tags and the rest). Hiding an entry only takes it off this menu; its view keeps working and returns the moment the toggle goes back on. Added commands run when tapped, so anything from the command palette can sit here (the Power apps launcher, Ask your vault, a daily note). The same menu is shaped whether or not it is folded into a header button, and desktop is never affected.",
      build: (s) => {
        s.addButton(
          (b) => b.setButtonText("Add command").onClick(() => {
            new DrawerCommandPicker(this.plugin, (id) => {
              this.plugin.settings.drawerMenuCommands.push(id);
              void this.plugin.persistSettings();
              this.plugin.applyDrawerMenuItems();
              this.refresh();
            }).open();
          })
        );
      }
    });
    const natives = [];
    document.querySelectorAll(".workspace-drawer.mod-left .workspace-drawer-tab-options-list > .workspace-tab-header:not(.pe-drawer-cmd)").forEach((el) => {
      if (!el.instanceOf(HTMLElement)) return;
      const type = el.dataset.type ?? "";
      const label = el.querySelector(".workspace-tab-header-inner-title")?.textContent?.trim() ?? "";
      if (type && label && !natives.some((n) => n.type === type)) natives.push({ type, label });
    });
    for (const it of DRAWER_NATIVE_ITEMS) if (!natives.some((n) => n.type === it.type)) natives.push(it);
    for (const it of natives) {
      layout.push({
        name: it.label,
        build: (s) => {
          s.addToggle(
            (t) => t.setValue(!this.plugin.settings.drawerMenuHidden.includes(it.type)).onChange((v) => {
              const set = new Set(this.plugin.settings.drawerMenuHidden);
              if (v) set.delete(it.type);
              else set.add(it.type);
              this.plugin.settings.drawerMenuHidden = [...set];
              void this.plugin.persistSettings();
              this.plugin.applyDrawerMenuItems();
            })
          );
        }
      });
    }
    const menuCmds = this.plugin.settings.drawerMenuCommands;
    const cmdReg = this.plugin.app.commands;
    menuCmds.forEach((id, i) => {
      const cmd = cmdReg.commands[id];
      layout.push({
        name: cmd ? cmd.name : id,
        desc: cmd ? void 0 : "Not available right now (its plugin may be off).",
        build: (s) => {
          const move = (from, to) => {
            [menuCmds[from], menuCmds[to]] = [menuCmds[to], menuCmds[from]];
            void this.plugin.persistSettings();
            this.plugin.applyDrawerMenuItems();
            this.refresh();
          };
          s.addExtraButton((b) => b.setIcon("chevron-up").setTooltip("Move up").setDisabled(i === 0).onClick(() => move(i, i - 1)));
          s.addExtraButton(
            (b) => b.setIcon("chevron-down").setTooltip("Move down").setDisabled(i === menuCmds.length - 1).onClick(() => move(i, i + 1))
          );
          s.addExtraButton(
            (b) => b.setIcon("x").setTooltip("Remove").onClick(() => {
              menuCmds.splice(i, 1);
              void this.plugin.persistSettings();
              this.plugin.applyDrawerMenuItems();
              this.refresh();
            })
          );
        }
      });
    });
    layout.push({
      name: "Phone: navigation actions in the header",
      desc: "Move search, new tab, the tab switcher and the menu up into the note's header, and hide the bar at the bottom of the screen.",
      help: "Phones only, and off unless you ask, because it borrows Obsidian's own buttons rather than copying them: the tab switcher carries a live count, so it has to be the real thing. They are handed straight back when this is turned off or the plugin is disabled. Nothing is hidden until the move has actually worked, so if an Obsidian update renames those buttons you lose this tidier header, never the buttons themselves. Back and forward are not moved: the header already has its own pair.",
      build: (s) => {
        s.addToggle((t) => t.setValue(this.plugin.settings.phoneTopActions).onChange((v) => this.plugin.setPhoneTopActions(v)));
      }
    });
    layout.push({
      name: "Actions in the explorer toolbar",
      desc: "Put Search everywhere, New page, and the Power apps launcher in the file explorer's toolbar instead of the ribbon.",
      aliases: ["ribbon"],
      help: "For a short ribbon. The same three actions either way, just somewhere else: in the toolbar they sit beside the folder buttons they mostly concern, rather than in a strip shared with every other plugin. This moves only this plugin's icons. To thin out the rest, right-click the ribbon and untick what you do not want, which works for every icon including Obsidian's own.",
      build: (s) => {
        s.addToggle(
          (t) => t.setValue(this.plugin.settings.actionsInExplorerBar).onChange((v) => {
            this.plugin.settings.actionsInExplorerBar = v;
            void this.plugin.persistSettings();
            this.plugin.applyActionHome();
          })
        );
      }
    });
    const inv = this.plugin.barInventory();
    layout.push({
      name: "Buttons in the explorer toolbar",
      desc: inv.length ? "Add any command, turn off the ones you do not use, and put them in the order you want. Obsidian's own buttons are included." : "Open the file explorer pane, then come back here and its buttons will be listed.",
      aliases: ["ribbon"],
      help: "The app's buttons are recognized by their icon, never by their name, because names are translated. A button this cannot recognize is one it never touches, so an Obsidian update can only ever give you a button back (it can never hide or move the wrong one). Hidden buttons still work as commands and hotkeys; only the icon goes. Added commands run when clicked, so anything in the command palette can sit here, and one whose plugin is off simply does not draw until it returns.",
      build: (s) => {
        s.addButton(
          (b) => b.setButtonText("Add command").onClick(() => {
            new BarCommandPicker(this.plugin, (id) => {
              this.plugin.addBarCommand(id);
              this.refresh();
            }).open();
          })
        );
        if (inv.length) {
          s.addExtraButton(
            (b) => b.setIcon("rotate-ccw").setTooltip("Back to the default toolbar").onClick(() => {
              this.plugin.resetBar();
              this.refresh();
            })
          );
        }
      }
    });
    const commit = (el) => {
      const host = el.parentElement;
      if (!host) return;
      this.plugin.setBarOrder(
        Array.from(host.children).map((n) => n.dataset.peKey ?? "").filter(Boolean)
      );
    };
    for (const b of inv) {
      layout.push({
        name: b.label,
        desc: b.missing ? "Not available right now (its plugin may be off)." : void 0,
        build: (s) => {
          const el = s.settingEl;
          el.addClasses(["pe-sub-setting", "pe-bar-row"]);
          el.dataset.peKey = b.key;
          const grip = createDiv({ cls: "pe-bar-grip", attr: { "aria-label": "Drag to reorder" } });
          (0, import_obsidian.setIcon)(grip, "grip-vertical");
          el.prepend(grip);
          const drag = new AbortController();
          const until = { signal: drag.signal };
          grip.addEventListener("pointerdown", () => el.draggable = true, until);
          el.addEventListener(
            "dragstart",
            (ev) => {
              el.addClass("is-dragging");
              ev.dataTransfer?.setData("text/plain", b.key);
              if (ev.dataTransfer) ev.dataTransfer.effectAllowed = "move";
            },
            until
          );
          el.addEventListener(
            "dragend",
            () => {
              el.removeClass("is-dragging");
              el.draggable = false;
              commit(el);
            },
            until
          );
          el.addEventListener(
            "dragover",
            (ev) => {
              ev.preventDefault();
              const host = el.parentElement;
              const moving = host?.querySelector(".pe-bar-row.is-dragging");
              if (!host || !moving || moving === el) return;
              const r = el.getBoundingClientRect();
              host.insertBefore(moving, ev.clientY > r.top + r.height / 2 ? el.nextSibling : el);
            },
            until
          );
          const teardown = () => {
            drag.abort();
            grip.remove();
            el.removeClasses(["pe-sub-setting", "pe-bar-row"]);
            delete el.dataset.peKey;
          };
          if (b.key.startsWith("cmd:")) {
            const id = b.key.slice(4);
            s.addExtraButton(
              (x) => x.setIcon(this.plugin.commandIcon(id)).setTooltip("Choose an icon").onClick(() => {
                new IconPickerModal(this.plugin, this.plugin.commandIcon(id), (v) => {
                  this.plugin.setBarIcon(id, v);
                  this.refresh();
                }).open();
              })
            );
            s.addExtraButton(
              (x) => x.setIcon("x").setTooltip("Remove").onClick(() => {
                this.plugin.removeBarCommand(id);
                this.refresh();
              })
            );
          } else {
            s.addToggle(
              (t) => t.setValue(!this.plugin.settings.explorerBarHidden.includes(b.key)).onChange((v) => this.plugin.setBarHidden(b.key, !v))
            );
          }
          return teardown;
        }
      });
    }
    layout.push({
      name: "Always edit",
      desc: "Keep notes in editing view, and hide the header button that switches to reading view.",
      help: "For anyone who treats their vault like a notebook and never reads a note read-only. Obsidian's own 'Default view for new tabs' covers only notes it opens fresh; a note reopened from a saved workspace, or one whose frontmatter asks for reading view, still lands read-only. This turns those back and takes the button off the header so it cannot be hit by accident. Nothing stops you toggling reading view from the command palette.",
      build: (s) => {
        s.addToggle((t) => t.setValue(this.plugin.settings.alwaysEdit).onChange((v) => this.plugin.setAlwaysEdit(v)));
      }
    });
    layout.push({
      name: "Settings window remembers its size",
      desc: "Reopen Obsidian's Settings window at the size and position you left it, instead of the same default every time.",
      aliases: ["settings window", "position", "popout", "geometry"],
      help: "Obsidian already does the work: its Settings window reads a size and position as it opens and writes them back as it closes. It just never fills in the name it stores them under, so both halves sit idle and the window reopens at its default. This fills in the name. It applies only when Settings opens in a window of its own rather than as a dialog inside the main window, and turning it off (or turning this plugin off) puts Obsidian back exactly as it was. The position is saved when the Settings window closes, so quitting Obsidian with it still open may not catch the last move.",
      build: (s) => {
        s.addToggle((t) => t.setValue(this.plugin.settings.rememberSettingsWindow).onChange((v) => this.plugin.setRememberSettingsWindow(v)));
      }
    });
    layout.push({
      name: "Full-width navigation on phones",
      desc: "Let the navigation drawer take the whole screen instead of leaving a slice of the note beside it.",
      help: "Obsidian leaves a strip of the note showing next to the open drawer so you can tap it to dismiss. When the drawer is your navigator that strip is just lost width, so this takes the full screen and you close it with the back gesture or the sidebar button instead. Phones only; desktop is never affected.",
      build: (s) => {
        s.addToggle(
          (t) => t.setValue(this.plugin.settings.phoneWideNav).onChange((v) => {
            this.plugin.settings.phoneWideNav = v;
            document.body.toggleClass("pe-wide-nav", v);
            void this.plugin.persistSettings();
          })
        );
      }
    });
    layout.push({
      name: "Color notebooks automatically",
      desc: "Give every notebook a cover color from the palette instead of a gray outline.",
      help: "Notebooks with no color of their own walk the palette by position, so neighbours never match. A color you pick yourself always wins and never moves; these follow the arrangement, so rearranging notebooks reshuffles them. Turn this off for plain outlines everywhere.",
      build: (s) => {
        s.addToggle(
          (t) => t.setValue(this.plugin.settings.autoNotebookColors).onChange((v) => {
            this.plugin.settings.autoNotebookColors = v;
            this.plugin.orderChanged();
          })
        );
      }
    });
    layout.push({
      name: "Hide attachments",
      desc: "Keep PDFs, images, and documents out of the tree and the pages list, leaving the pages you actually open. The files stay exactly where they are.",
      help: "For vaults that file a note's own documents beside it rather than in one attachment folder: the folder holding six pages and nine PDFs reads as six pages again. Notes, canvases, and Bases always stay. The eye button in the pages pane shows everything again for as long as you need it.",
      build: (s) => {
        s.addToggle(
          (t) => t.setValue(this.plugin.settings.hideAttachments).onChange((v) => {
            this.plugin.settings.hideAttachments = v;
            this.plugin.orderChanged();
          })
        );
      }
    });
    const hidden = this.plugin.settings.hidden;
    const missing = hidden.filter((p) => !(this.plugin.app.vault.getAbstractFileByPath(p) instanceof import_obsidian.TFolder));
    layout.push({
      name: "Hidden folders",
      desc: hidden.length ? "Folders tucked out of the tree. Right-click any folder to hide it." : "None yet. Right-click a folder and choose Hide folder, handy for attachment dumps.",
      help: "A hidden folder disappears from the explorer tree, but its notes still turn up in search (add it to 'Folders search skips' too if you want it fully out). Use the eye button in the pages pane for a quick temporary peek, or the Show/hide hidden folders command.",
      build: (s) => {
        if (!missing.length) return;
        s.addButton(
          (b) => b.setButtonText(`Remove ${missing.length} missing`).setTooltip("Clear entries whose folder no longer exists").onClick(() => {
            const n = this.plugin.removeMissingHidden();
            new Notice(`Cleared ${n} stale hidden-folder entr${n === 1 ? "y" : "ies"}.`);
            this.refresh();
          })
        );
      }
    });
    for (const p of hidden) {
      const gone = !(this.plugin.app.vault.getAbstractFileByPath(p) instanceof import_obsidian.TFolder);
      layout.push({
        name: p,
        desc: gone ? "Folder no longer exists (safe to remove)." : void 0,
        build: (s) => {
          s.addButton(
            (b) => b.setButtonText(gone ? "Remove" : "Unhide").onClick(() => {
              this.plugin.unhidePath(p);
              this.refresh();
            })
          );
        }
      });
    }
    ordering.push({
      name: "Drag to reorder",
      desc: "Drag items in the file explorer to arrange them by hand.",
      aliases: ["drag and drop"],
      help: "Drop between two items to set the order; drop onto a folder to move the item inside it. Folders you never arrange keep Obsidian's normal sort. This is Power Explorer's founding feature.",
      build: (s) => {
        s.addToggle(
          (t) => t.setValue(this.plugin.settings.dragEnabled).onChange((v) => {
            this.plugin.settings.dragEnabled = v;
            void this.plugin.persistSettings();
          })
        );
      }
    });
    ordering.push({
      name: "Unarranged items go",
      desc: "Where new or never-dragged items land in an arranged folder.",
      help: "In a folder you've hand-ordered, brand-new notes (and any you've never dragged) collect together at the top or the bottom, keeping Obsidian's own sort among themselves instead of scattering through your arrangement.",
      build: (s) => {
        s.addDropdown(
          (d) => d.addOptions({ bottom: "Bottom", top: "Top" }).setValue(this.plugin.settings.unranked).onChange((v) => {
            this.plugin.settings.unranked = v;
            void this.plugin.persistSettings();
            this.plugin.orderChanged();
          })
        );
      }
    });
    const count = Object.keys(this.plugin.settings.orders).length;
    ordering.push({
      name: "Manually arranged folders",
      desc: `${count} folder${count === 1 ? "" : "s"} currently carry a manual order.`,
      help: "Each of these folders remembers a hand-set order. Reset a single folder from its right-click menu ('Reset manual order'), or wipe every folder's order at once with Clear all.",
      build: (s) => {
        s.addButton(
          (b) => b.setButtonText("Clear all").onClick(() => {
            this.plugin.settings.orders = {};
            this.plugin.orderChanged();
            this.refresh();
            new Notice("All manual orders cleared.");
          })
        );
      }
    });
    const forced = Object.keys(this.plugin.settings.folderSort);
    ordering.push({
      name: "Folders that sort themselves",
      desc: forced.length ? `Sorting by name, not by hand: ${forced.map((p) => nameOf(p) || p).join(", ")}.` : "None. Right-click any folder and pick Sort to keep it filed by name.",
      help: "Set one folder to sort itself with its right-click Sort menu. Handy for folders other tools keep adding to, like People, where a new note should file itself alphabetically instead of landing at the end. Dragging is off in these folders, but their hand-set order is kept and comes back if you switch that folder to Manual.",
      build: (s) => {
        s.addButton(
          (b) => b.setButtonText("Reset all to manual").setDisabled(!forced.length).onClick(() => {
            this.plugin.settings.folderSort = {};
            this.plugin.orderChanged();
            this.refresh();
            new Notice("Every folder follows manual order again.");
          })
        );
      }
    });
    templates.push({
      name: "Templates folder",
      desc: "The folder whose notes fill the New-page gallery.",
      help: `The + button in the pages pane opens a gallery of these notes as templates. A template note is configured by its own properties: 'icon' (an emoji or a Lucide icon name) and 'description' set its gallery card, 'filename' names the pages it makes, 'folders' lists where it is offered, 'destination' files its pages in one folder wherever you press +, and 'unique: day' opens today's page instead of making a second one. None of them are copied into the pages themselves. Every template also gets its own command, so the ones you use daily can take a hotkey. Leave this empty and Power Explorer falls back to a top-level "Templates" folder if you have one.`,
      build: (s) => {
        s.addText(
          (t) => t.setPlaceholder("Templates").setValue(this.plugin.settings.templatesFolder).onChange((v) => {
            this.plugin.settings.templatesFolder = v.trim();
            void this.plugin.persistSettings();
            this.plugin.syncTemplateCommands();
          })
        );
        s.addButton(
          (b) => b.setButtonText("New template").setCta().onClick(async () => {
            await this.plugin.newTemplate();
            this.refresh();
          })
        );
      }
    });
    templates.push({
      name: "Page name",
      desc: "How pages are named when their template says nothing. {{date}} = today, {{name:Text}} = the part you type over. Empty names them Untitled.",
      help: "A template names its own pages with a 'filename' property; this is the fallback for the ones that do not. The tokens are {{date}} and {{time}} (both take a format, as in {{date:YYYY-MM}}, and an offset, as in {{date+1d}} or {{date-1w:dddd}}), {{folder}}, {{parent}}, {{vault}}, and {{name:Text}} for the generic part you mean to replace, which is preselected when the page opens so you can type straight over it. In a template's body you also get {{cursor}} for where to leave the cursor and {{rollover}} for the unfinished tasks of the previous dated page. In a template's properties, wrap a pattern that starts with a brace in quotes, or YAML reads it as a list.",
      build: (s) => {
        s.addText(
          (t) => t.setPlaceholder("{{date}} {{name:New page}}").setValue(this.plugin.settings.filenamePattern).onChange((v) => {
            this.plugin.settings.filenamePattern = v;
            void this.plugin.persistSettings();
          })
        );
      }
    });
    templates.push({
      name: "Ask for template answers",
      desc: "Templates using {{ask:Question}} open a small dialog before the page is made. Off fills their defaults silently.",
      help: "Only templates that actually use {{ask:Question}} are affected; everything else is made the moment you pick it. The answer can go in the page's name as well as its body, and the same question asked twice is one field. Write {{ask:Client=Acme}} to give a question a default, which is what an unanswered field falls back to. A single template can overrule this setting with an 'ask' property of true or false.",
      build: (s) => {
        s.addToggle(
          (t) => t.setValue(this.plugin.settings.askForAnswers).onChange((v) => {
            this.plugin.settings.askForAnswers = v;
            void this.plugin.persistSettings();
          })
        );
      }
    });
    templates.push({
      name: "New template starter",
      desc: "What the New template button seeds a fresh template with.",
      help: "The frontmatter properties (and any body) every new template starts from. It uses 'icon' and 'description' by default; add your own properties and defaults. Leave empty for the built-in starter.",
      build: (s) => {
        s.addTextArea((t) => {
          t.setPlaceholder(DEFAULT_TEMPLATE_SEED).setValue(this.plugin.settings.templateSeed).onChange((v) => {
            this.plugin.settings.templateSeed = v;
            void this.plugin.persistSettings();
          });
          t.inputEl.rows = 6;
          t.inputEl.addClass("pe-tpl-seed");
        });
      }
    });
    const notes = this.plugin.templateNotes();
    templates.push({
      name: "Available templates",
      desc: notes.length ? `${notes.length} template${notes.length === 1 ? "" : "s"} in the gallery.` : "None yet. Click New template above to make your first.",
      help: "The notes currently offered in the New-page gallery, listed below, with how each names its pages and which folders it belongs to. Open one to edit its content, or use its Icon button to pick the emoji or Lucide icon shown on its gallery card."
    });
    for (const f of notes) {
      const meta = this.plugin.templateMeta(f);
      const facts = [
        meta.filename && `Names pages ${meta.filename}`,
        meta.destination && `Saves to ${meta.destination}`,
        meta.unique != null && meta.unique !== false ? "One page per day" : "",
        meta.ask === false || meta.ask === "false" || meta.ask === "no" ? "Never asks" : "",
        meta.folders.length && `For ${meta.folders.join(", ")}`
      ].filter(Boolean).join(" \xB7 ");
      templates.push({
        name: f.basename,
        desc: facts || meta.desc || f.path,
        build: (s) => {
          s.nameEl.empty();
          this.plugin.renderTemplateIcon(s.nameEl.createSpan({ cls: "pe-tpl-ic pe-tpl-ic-inline" }), meta.icon);
          s.nameEl.createSpan({ text: " " + f.basename });
          s.addButton(
            (b) => b.setButtonText("Icon").setTooltip("Choose an icon").onClick(() => {
              new IconPickerModal(this.plugin, meta.icon, async (v) => {
                await this.plugin.setTemplateIcon(f, v);
                this.refresh();
              }).open();
            })
          );
          s.addButton(
            (b) => b.setButtonText("Open").onClick(() => {
              void this.plugin.showPage(f);
            })
          );
        }
      });
    }
    search.push({
      name: "Search everywhere",
      desc: "Instant vault-wide search across titles, headings, body, tags, and folders.",
      help: "Word-prefix matching (type 'budg', find 'budget'), with results grouped by section. Open it with the 'Search everywhere' command, bind a hotkey like Ctrl+E to make it muscle memory. The index updates as you edit and is cached in the plugin folder.",
      build: (s) => {
        s.addToggle(
          (t) => t.setValue(this.plugin.settings.searchEnabled).onChange((v) => {
            this.plugin.settings.searchEnabled = v;
            void this.plugin.persistSettings();
            if (v) void this.plugin.search.start();
            else this.plugin.search.stop();
          })
        );
      }
    });
    search.push({
      name: "Titles only in results",
      desc: "Show results as a clean list of page titles, hiding the body snippet.",
      help: "On by default. You can flip it any time from the list/text button inside the search box itself; this setting just chooses the starting default.",
      build: (s) => {
        s.addToggle(
          (t) => t.setValue(this.plugin.settings.searchCompact).onChange((v) => {
            this.plugin.settings.searchCompact = v;
            void this.plugin.persistSettings();
          })
        );
      }
    });
    search.push({
      name: "Search PDF text",
      desc: "Index the text layer of PDFs.",
      help: "A search hit inside a PDF opens the file right at the matching page. Scanned PDFs with no text layer won't be searchable unless they've been OCR'd first.",
      build: (s) => {
        s.addToggle(
          (t) => t.setValue(this.plugin.settings.searchPdfs).onChange((v) => {
            this.plugin.settings.searchPdfs = v;
            void this.plugin.persistSettings();
            this.plugin.search.restart();
          })
        );
      }
    });
    search.push({
      name: "Search image text (OCR)",
      desc: "Make screenshots and photos searchable by the text inside them.",
      help: 'The reading is done by the "Power Extract" companion plugin, install and enable it once. Each image is read in the background exactly once and cached; a search hit opens the note embedding the image, right at its spot. An existing Text Extractor install is still used if Power Extract is not there.',
      build: (s) => {
        s.addToggle(
          (t) => t.setValue(this.plugin.settings.searchImages).onChange((v) => {
            this.plugin.settings.searchImages = v;
            void this.plugin.persistSettings();
            this.plugin.search.restart();
          })
        );
      }
    });
    search.push({
      name: "Folders search skips",
      desc: "Comma-separated folders to leave out of the search index.",
      help: "Good for attachment dumps, archives, or template folders you never want surfacing in results. Changes re-index after a short pause. This is separate from hiding a folder, a hidden folder is still searchable unless you list it here too.",
      build: (s) => {
        s.addText(
          (t) => t.setPlaceholder("Attachments, _archive").setValue(this.plugin.settings.searchExclude).onChange((v) => {
            this.plugin.settings.searchExclude = v;
            void this.plugin.persistSettings();
            if (this.excludeTimer != null) window.clearTimeout(this.excludeTimer);
            this.excludeTimer = window.setTimeout(() => {
              this.excludeTimer = null;
              if (this.plugin.settings.searchEnabled) this.plugin.search.restart();
            }, 1200);
          })
        );
      }
    });
    return [
      { id: "general", label: "General", rows: general },
      { id: "layout", label: "Layout", rows: layout },
      { id: "ordering", label: "Ordering", rows: ordering },
      { id: "templates", label: "Templates", rows: templates },
      { id: "search", label: "Search", rows: search }
    ];
  }
};

/* nosourcemap */