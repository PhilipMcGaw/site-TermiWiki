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
  default: () => PowerExtractPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var import_node_child_process = require("node:child_process");
var import_node_process = require("node:process");

// src/cache.ts
var CACHE_VERSION = 1;
function isFresh(entry, mtime, size) {
  return !!entry && entry.m === mtime && entry.s === size;
}
function parseCache(raw) {
  if (!raw) return {};
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {};
  }
  if (!parsed || typeof parsed !== "object") return {};
  const file = parsed;
  if (file.v !== CACHE_VERSION || !file.e || typeof file.e !== "object") return {};
  const out = {};
  for (const [path, entry] of Object.entries(file.e)) {
    const e = entry;
    if (typeof e?.m === "number" && typeof e.s === "number" && typeof e.t === "string") {
      out[path] = { m: e.m, s: e.s, t: e.t };
    }
  }
  return out;
}
function serializeCache(map) {
  const file = { v: CACHE_VERSION, e: map };
  return JSON.stringify(file);
}
function pruneCache(map, livePaths) {
  const out = {};
  let removed = 0;
  for (const [path, entry] of Object.entries(map)) {
    if (livePaths.has(path)) out[path] = entry;
    else removed++;
  }
  return { map: out, removed };
}
function cacheStats(map) {
  let withText = 0;
  let chars = 0;
  for (const e of Object.values(map)) {
    if (e.t) {
      withText++;
      chars += e.t.length;
    }
  }
  return { total: Object.keys(map).length, withText, chars };
}

// src/ocr.ts
var MAX_FAILED_STARTS = 3;
var OcrEngine = class {
  constructor(opts) {
    this.opts = opts;
    this.proc = null;
    this.ready = false;
    this.queue = [];
    this.active = null;
    this.buf = "";
    this.seq = 0;
    this.failedStarts = 0;
    /**
     * Which worker is the current one.
     *
     * A process does not go quiet the moment it is let go: its close event, and
     * anything already in its pipe, arrive after the next worker has started and
     * possibly after that worker has taken a job. Acting on either would reject
     * or resolve a job belonging to a process that never saw it. Every handler
     * carries the generation it was registered for and does nothing once that
     * generation is history.
     */
    this.gen = 0;
    this.idleTimer = null;
    this.jobTimer = null;
    this.stopped = false;
    /** Set once the worker says it has no recognizer, so the next 13,000 images
     *  do not each start a process to be told the same thing. */
    this.unavailable = null;
    /** The recognizer's language tag, once known. Shown in settings, because
     *  "why is my German screenshot coming out as nonsense" is answered by it. */
    this.language = null;
    this.idleMs = opts.idleMs ?? 3e4;
    this.jobMs = opts.jobMs ?? 3e4;
    this.log = opts.log ?? (() => {
    });
  }
  /** Text found in the image at `absPath`. Rejects if this machine cannot run
   *  the engine at all, or if this one image could not be read. */
  extract(absPath) {
    if (this.stopped) return Promise.reject(new Error("Power Extract is unloading."));
    if (this.unavailable) return Promise.reject(new Error(unavailableMessage(this.unavailable)));
    return new Promise((resolve, reject) => {
      this.queue.push({ id: String(++this.seq), path: absPath, resolve, reject });
      this.pump();
    });
  }
  /** Is a worker running right now? Only the settings tab cares. */
  get running() {
    return this.proc !== null;
  }
  /** Shut down for good: no restarts, no queue, no lingering process. */
  stop(reason = "Power Extract is unloading.") {
    this.stopped = true;
    this.clearIdle();
    this.clearJobTimer();
    const active = this.active;
    this.active = null;
    this.failQueued(new Error(reason));
    active?.reject(new Error(reason));
    this.quit();
  }
  /* ---- the pump ---- */
  pump() {
    if (this.stopped || this.active || !this.queue.length) return;
    if (!this.proc) {
      this.start();
      return;
    }
    if (!this.ready) return;
    this.clearIdle();
    const job = this.queue.shift();
    this.active = job;
    this.jobTimer = window.setTimeout(() => {
      this.log("an image took too long and the worker was restarted", job.path);
      this.jobTimer = null;
      this.active = null;
      this.quit();
      job.reject(new Error("reading this image took too long."));
      this.pump();
    }, this.jobMs);
    try {
      this.proc.stdin.write(`${job.id}	${job.path}
`);
    } catch {
      this.clearJobTimer();
      this.active = null;
      this.queue.unshift(job);
      this.onClosed();
    }
  }
  start() {
    if (this.failedStarts >= MAX_FAILED_STARTS) {
      this.markUnavailable("failed");
      return;
    }
    this.failedStarts++;
    let proc;
    try {
      proc = this.opts.spawn();
    } catch (e) {
      this.log("could not start the OCR worker", e);
      this.markUnavailable("failed");
      return;
    }
    const gen = ++this.gen;
    this.proc = proc;
    this.ready = false;
    this.buf = "";
    proc.stdout.setEncoding("utf8");
    proc.stdout.on("data", (chunk) => {
      if (gen === this.gen) this.onData(chunk);
    });
    proc.stderr.setEncoding("utf8");
    proc.stderr.on("data", (chunk) => {
      const text = String(chunk).trim();
      if (text) this.log("OCR worker stderr", text);
    });
    proc.on("error", (err) => {
      if (gen !== this.gen) return;
      this.log("OCR worker error", err);
      this.onClosed();
    });
    proc.on("close", () => {
      if (gen === this.gen) this.onClosed();
    });
  }
  onData(chunk) {
    this.buf += chunk;
    let nl;
    while ((nl = this.buf.indexOf("\n")) >= 0) {
      const line = this.buf.slice(0, nl).trim();
      this.buf = this.buf.slice(nl + 1);
      if (line) this.onLine(line);
    }
  }
  onLine(line) {
    let msg;
    try {
      const parsed = JSON.parse(line);
      if (!parsed || typeof parsed !== "object") throw new Error("not an object");
      msg = parsed;
    } catch {
      this.log("unrecognized line from the OCR worker", line.slice(0, 200));
      return;
    }
    if (msg.ready !== void 0) {
      if (!msg.ready) {
        this.markUnavailable("no-engine");
        this.quit();
        return;
      }
      this.ready = true;
      this.language = msg.lang ?? null;
      this.pump();
      return;
    }
    if (!this.active || msg.id !== this.active.id) {
      this.log("ignored an out-of-band OCR result", msg.id);
      return;
    }
    const job = this.active;
    this.active = null;
    this.clearJobTimer();
    this.failedStarts = 0;
    if (msg.err) job.reject(new Error(msg.err));
    else job.resolve(msg.text ?? "");
    if (this.queue.length) this.pump();
    else this.scheduleIdle();
  }
  onClosed() {
    this.clearJobTimer();
    const wasActive = this.active;
    this.proc = null;
    this.ready = false;
    this.active = null;
    this.buf = "";
    if (wasActive) {
      wasActive.reject(new Error("the OCR worker stopped before it answered."));
    }
    if (this.stopped || this.unavailable) {
      this.failQueued(new Error(this.unavailable ? unavailableMessage(this.unavailable) : "Power Extract is unloading."));
      return;
    }
    if (this.queue.length) this.pump();
  }
  markUnavailable(why) {
    this.unavailable = why;
    this.failQueued(new Error(unavailableMessage(why)));
  }
  failQueued(err) {
    const queued = this.queue;
    this.queue = [];
    for (const job of queued) job.reject(err);
  }
  scheduleIdle() {
    this.clearIdle();
    this.idleTimer = window.setTimeout(() => {
      this.idleTimer = null;
      if (!this.active && !this.queue.length) this.quit();
    }, this.idleMs);
  }
  clearIdle() {
    if (this.idleTimer !== null) {
      window.clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }
  clearJobTimer() {
    if (this.jobTimer !== null) {
      window.clearTimeout(this.jobTimer);
      this.jobTimer = null;
    }
  }
  /** Ask the worker to leave, then make sure it did. Retiring the generation
   *  first means its parting words land on nobody. */
  quit() {
    const proc = this.proc;
    if (!proc) return;
    this.gen++;
    this.proc = null;
    this.ready = false;
    try {
      proc.stdin.write("@@quit\n");
      proc.stdin.end();
    } catch {
    }
    try {
      proc.kill();
    } catch {
    }
  }
};
function unavailableMessage(why) {
  switch (why) {
    case "no-node":
      return "reading text from images needs the desktop app.";
    case "not-windows":
      return "reading text from images currently needs Windows.";
    case "no-engine":
      return "Windows has no OCR language installed. Add one under Settings > Time & language > Language & region, then reload Obsidian.";
    case "failed":
      return "the OCR worker would not start on this machine.";
  }
}

// src/worker.ts
function powershellPath(systemRoot2) {
  const root = (systemRoot2 ?? "").trim().replace(/[\\/]+$/, "");
  if (!root) return "powershell.exe";
  return root + "\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";
}
function workerArgs(scriptPath) {
  return ["-NoProfile", "-NonInteractive", "-File", scriptPath];
}
var OCR_WORKER_PS1 = String.raw`
# Power Extract OCR worker. Written by the plugin; safe to delete when it is
# not running (it is recreated on demand).
#
# Protocol, one line each way:
#   in   <id> TAB <absolute path>      "@@quit" to stop
#   out  {"id":"..","text":".."} or {"id":"..","err":".."}
# The first line out is {"ready":true,"lang":".."}, or {"ready":false} when
# this machine has no recognizer, which is the parent's signal to stop asking.

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = New-Object Text.UTF8Encoding $false

# WinRT hands back IAsyncOperation; this is the reflection dance that turns one
# into a Task that Windows PowerShell can wait on. The parameter type is
# matched with -like so its generic arity suffix stays out of this file.
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and
    $_.GetParameters()[0].ParameterType.Name -like 'IAsyncOperation*'
})[0]

function Await($op, $type) {
    $t = $asTask.MakeGenericMethod($type).Invoke($null, @($op))
    $t.Wait(-1) | Out-Null
    $t.Result
}

function Emit($obj) {
    # One object, one line. Depth 3 is plenty for what we send and stops a
    # surprise from spilling across lines and desynchronizing the parent.
    [Console]::Out.WriteLine(($obj | ConvertTo-Json -Compress -Depth 3))
    [Console]::Out.Flush()
}

try {
    [Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
    [Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics, ContentType = WindowsRuntime] | Out-Null
    [Windows.Storage.Streams.InMemoryRandomAccessStream, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
    [Windows.Storage.Streams.DataWriter, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
} catch {
    $engine = $null
}

# No engine is a fact about the machine, not a failure of a job: an N edition
# without the Media Feature Pack, or a display language with no recognizer.
if ($null -eq $engine) { Emit ([pscustomobject]@{ ready = $false }); exit 1 }
Emit ([pscustomobject]@{ ready = $true; lang = $engine.RecognizerLanguage.LanguageTag })

while ($null -ne ($line = [Console]::In.ReadLine())) {
    if ($line -eq '@@quit') { break }
    # Split once, on a regex tab: a file name may contain a tab, an id never does.
    $id, $path = $line -split "\t", 2
    $bitmap = $null
    $stream = $null
    try {
        # Read the bytes here rather than going through StorageFile, which wants
        # a broker that is not always running and refuses some paths the
        # filesystem is perfectly happy with.
        $bytes = [IO.File]::ReadAllBytes($path)
        $stream = New-Object Windows.Storage.Streams.InMemoryRandomAccessStream
        $writer = New-Object Windows.Storage.Streams.DataWriter $stream
        $writer.WriteBytes($bytes)
        Await ($writer.StoreAsync()) ([uint32]) | Out-Null
        $writer.DetachStream() | Out-Null
        $stream.Seek(0)
        $decoder = Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
        $bitmap = Await ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
        $result = Await ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
        $text = $result.Text
        if ($null -eq $text) { $text = "" }
        Emit ([pscustomobject]@{ id = $id; text = $text })
    } catch {
        # A file that is missing, not an image, or in a format with no codec on
        # this machine is one job's problem. Report it and stay up.
        Emit ([pscustomobject]@{ id = $id; err = ($_.Exception.Message -replace '\s+', ' ') })
    } finally {
        if ($null -ne $bitmap) { $bitmap.Dispose() }
        if ($null -ne $stream) { $stream.Dispose() }
    }
}
`;

// src/main.ts
var pluginNoticesEnabled = () => true;
var Notice = class extends import_obsidian.Notice {
  constructor(message, duration) {
    super(message, duration);
    if (!pluginNoticesEnabled()) this.hide();
  }
};
var IMAGE_EXTS = /* @__PURE__ */ new Set(["png", "jpg", "jpeg", "webp", "bmp", "gif"]);
var spawnProcess = import_node_child_process.spawn;
function systemRoot() {
  return import_node_process.env.SystemRoot;
}
var DEFAULT_SETTINGS = {
  rightClickMenu: true,
  useCache: true,
  showNotifications: true
};
var PowerExtractPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.settings = DEFAULT_SETTINGS;
    this.baseline = DEFAULT_SETTINGS;
    this.loadFailed = false;
    this.engine = null;
    this.cache = {};
    this.cacheDirty = false;
    this.cacheTimer = null;
    this.scriptReady = null;
    /** Extractions in flight, keyed by path: two callers asking for the same
     *  image at once (the search index and a right-click) wait on one read
     *  rather than starting two. */
    this.inFlight = /* @__PURE__ */ new Map();
    this.api = {
      extractText: (file) => this.extractText(file),
      canExtract: (file) => this.canExtract(file),
      isAvailable: () => this.unavailableReason() === null,
      language: () => this.engine?.language ?? null
    };
    this.scriptAbsPath = null;
  }
  async onload() {
    await this.loadSettings();
    pluginNoticesEnabled = () => this.settings.showNotifications;
    this.cache = this.settings.useCache ? parseCache(await this.readCacheFile()) : {};
    this.engine = new OcrEngine({
      spawn: () => this.spawnWorker(),
      log: (message, detail) => console.warn("Power Extract: " + message, detail ?? "")
    });
    this.addSettingTab(new PowerExtractSettingTab(this));
    this.addCommand({
      id: "copy-image-text",
      name: "Copy the text from an image",
      callback: () => new ImagePickerModal(this).open()
    });
    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        if (!this.settings.rightClickMenu) return;
        if (!(file instanceof import_obsidian.TFile) || !this.canExtract(file)) return;
        menu.addItem(
          (item) => item.setTitle("Copy text from image").setIcon("scan-text").onClick(() => void this.copyTextToClipboard(file))
        );
      })
    );
    this.registerEvent(
      this.app.vault.on("delete", (file) => {
        if (file instanceof import_obsidian.TFile && this.cache[file.path]) {
          delete this.cache[file.path];
          this.queueCacheSave();
        }
      })
    );
    this.registerEvent(
      this.app.vault.on("rename", (file, oldPath) => {
        const entry = this.cache[oldPath];
        if (!entry) return;
        delete this.cache[oldPath];
        if (file instanceof import_obsidian.TFile) this.cache[file.path] = entry;
        this.queueCacheSave();
      })
    );
  }
  onunload() {
    this.engine?.stop();
    if (this.cacheTimer !== null) {
      window.clearTimeout(this.cacheTimer);
      this.cacheTimer = null;
    }
    if (this.cacheDirty) void this.writeCacheFile();
  }
  /* ---------------- extraction ---------------- */
  canExtract(file) {
    return IMAGE_EXTS.has(file.extension.toLowerCase());
  }
  /**
   * The one way text comes out of an image.
   *
   * Cache first, then the recognizer. A second caller asking for the same
   * image while the first is still waiting joins that read instead of starting
   * its own: the search index sweeping a folder and someone right-clicking a
   * screenshot in it is an ordinary way for that to happen.
   */
  async extractText(file) {
    if (!this.canExtract(file)) {
      throw new Error(`Power Extract does not read .${file.extension} files.`);
    }
    const cached = this.cache[file.path];
    if (this.settings.useCache && isFresh(cached, file.stat.mtime, file.stat.size)) return cached.t;
    const existing = this.inFlight.get(file.path);
    if (existing) return existing;
    const run = this.readImage(file).finally(() => this.inFlight.delete(file.path));
    this.inFlight.set(file.path, run);
    return run;
  }
  async readImage(file) {
    const why = this.unavailableReason();
    if (why) throw new Error(unavailableMessage(why));
    const engine = this.engine;
    if (!engine) throw new Error("Power Extract is not loaded.");
    const scriptPath = await this.ensureWorkerScript(engine.running);
    if (!scriptPath) throw new Error("Power Extract could not write its OCR worker.");
    const abs = this.absolutePath(file.path);
    if (!abs) throw new Error("Power Extract needs a vault stored on disk.");
    const text = (await engine.extract(abs)).trim();
    if (this.settings.useCache) {
      this.cache[file.path] = { m: file.stat.mtime, s: file.stat.size, t: text };
      this.queueCacheSave();
    }
    return text;
  }
  /** Why this device cannot read images, or null when it can. Checked before
   *  every start so the answer stays current if a worker later reports that
   *  Windows has no recognizer. */
  unavailableReason() {
    if (!import_obsidian.Platform.isDesktopApp) return "no-node";
    if (!import_obsidian.Platform.isWin) return "not-windows";
    return this.engine?.unavailable ?? null;
  }
  async copyTextToClipboard(file) {
    const notice = new Notice("Power Extract: reading " + file.name + "...", 0);
    try {
      const text = await this.extractText(file);
      notice.hide();
      if (!text) {
        new Notice("Power Extract: no text found in " + file.name + ".");
        return;
      }
      await navigator.clipboard.writeText(text);
      const preview = text.length > 80 ? text.slice(0, 80) + "..." : text;
      new Notice("Power Extract: copied " + text.length + " characters.\n" + preview, 6e3);
    } catch (e) {
      notice.hide();
      new Notice("Power Extract: " + (e instanceof Error ? e.message : String(e)), 8e3);
    }
  }
  /* ---------------- the worker ---------------- */
  /** Start a PowerShell hosting the recognizer. Desktop-only by manifest, so
   *  the import at the top of this file is always satisfied by the time this
   *  runs.
   *
   *  The one process this plugin ever starts, and this is the only line that
   *  starts it. It is a fixed program at a fixed path with fixed arguments:
   *  nothing a user types, nothing from a file, and nothing from another
   *  plugin reaches this call. Image paths go to the worker over stdin, well
   *  away from a command line. `shell: false` is spawn's default and is
   *  written out anyway, because it is the difference between running a
   *  program and handing a string to a command interpreter, and that should
   *  not have to be inferred from an absence. */
  spawnWorker() {
    const script = this.scriptAbsPath;
    if (!script) throw new Error("the OCR worker has not been written yet");
    return spawnProcess(powershellPath(systemRoot()), workerArgs(script), {
      windowsHide: true,
      shell: false
    });
  }
  /**
   * The worker script on disk, confirmed to be the script this build carries.
   *
   * Confirmed before every start, not once a session. The file sits in the
   * vault, which is a folder sync services write to and other applications can
   * open, and a worker that has idled out is started again from whatever the
   * file holds at that moment. A check from twenty minutes ago says nothing
   * about that, so the only check worth having is one taken with the start it
   * belongs to. While a worker is up, the script it is already running cannot
   * be swapped underneath it, so that is the one case the check is skipped.
   *
   * Rewriting on any difference covers a fresh install, an upgrade that changed
   * the script, and an edit by anything else, without having to tell them
   * apart: the only script that ever runs is the one shipped in main.js.
   *
   * Checks queue behind one another, so two images arriving together cannot
   * have one reading the file while the other is rewriting it.
   */
  ensureWorkerScript(workerRunning) {
    if (workerRunning && this.scriptReady) return this.scriptReady;
    const check = () => this.writeWorkerScript();
    this.scriptReady = (this.scriptReady ?? Promise.resolve("")).then(check, check);
    return this.scriptReady;
  }
  async writeWorkerScript() {
    const rel = `${this.manifest.dir}/ocr-worker.ps1`;
    const adapter = this.app.vault.adapter;
    let current = null;
    try {
      current = await adapter.exists(rel) ? await adapter.read(rel) : null;
    } catch {
      current = null;
    }
    try {
      if (current !== OCR_WORKER_PS1) await adapter.write(rel, OCR_WORKER_PS1);
    } catch (e) {
      console.warn("Power Extract: could not write the OCR worker", e);
      this.scriptAbsPath = null;
      return "";
    }
    this.scriptAbsPath = this.absolutePath(rel);
    return this.scriptAbsPath ?? "";
  }
  /** A vault path as the operating system sees it. Null when the vault is not
   *  a folder on disk, which is every mobile vault. */
  absolutePath(vaultRelative) {
    const adapter = this.app.vault.adapter;
    if (typeof adapter.getFullPath === "function") return adapter.getFullPath(vaultRelative);
    if (adapter.basePath) return `${adapter.basePath}/${vaultRelative}`;
    return null;
  }
  /* ---------------- cache file ---------------- */
  cachePath() {
    return `${this.manifest.dir}/ocr-cache.json`;
  }
  async readCacheFile() {
    try {
      const path = this.cachePath();
      return await this.app.vault.adapter.exists(path) ? await this.app.vault.adapter.read(path) : null;
    } catch (e) {
      console.warn("Power Extract: could not read the cache", e);
      return null;
    }
  }
  queueCacheSave() {
    this.cacheDirty = true;
    if (this.cacheTimer !== null) window.clearTimeout(this.cacheTimer);
    this.cacheTimer = window.setTimeout(() => {
      this.cacheTimer = null;
      void this.writeCacheFile();
    }, 3e3);
  }
  async writeCacheFile() {
    if (!this.settings.useCache) return;
    try {
      await this.app.vault.adapter.write(this.cachePath(), serializeCache(this.cache));
      this.cacheDirty = false;
    } catch (e) {
      console.warn("Power Extract: could not save the cache", e);
    }
  }
  cacheSummary() {
    return cacheStats(this.cache);
  }
  /** Drop cached text for images the vault no longer holds. */
  prune() {
    const live = new Set(this.app.vault.getFiles().map((f) => f.path));
    const { map, removed } = pruneCache(this.cache, live);
    this.cache = map;
    if (removed) this.queueCacheSave();
    return removed;
  }
  /** Forget everything read so far, and take the file with it.
   *
   *  Deleting rather than writing an empty one, because this is also what
   *  turning the cache off calls, and the write path declines to run when the
   *  cache is off: asking to be forgotten and leaving the text sitting on disk
   *  is the one outcome this must not have. The pending debounced write is
   *  cancelled first, or it would put the file straight back. */
  async clearCache() {
    this.cache = {};
    this.cacheDirty = false;
    if (this.cacheTimer !== null) {
      window.clearTimeout(this.cacheTimer);
      this.cacheTimer = null;
    }
    try {
      const path = this.cachePath();
      if (await this.app.vault.adapter.exists(path)) await this.app.vault.adapter.remove(path);
    } catch (e) {
      console.warn("Power Extract: could not remove the cache", e);
    }
  }
  /* ---------------- settings ---------------- */
  async loadSettings() {
    const disk = await this.readSettings();
    if (disk === null) this.loadFailed = true;
    this.settings = { ...DEFAULT_SETTINGS, ...disk ?? {} };
    this.baseline = structuredClone(this.settings);
  }
  async readSettings() {
    try {
      return await this.loadData() ?? {};
    } catch {
      return null;
    }
  }
  /**
   * The one write path for settings, matching the rest of the suite: re-read
   * the synced file and carry only the keys this device actually changed, so a
   * device that has been asleep cannot publish its stale copy over everyone
   * else's. A boot that never managed to read writes nothing at all, because
   * defaults must not land on disk over the real thing.
   */
  async persistSettings() {
    const disk = await this.readSettings();
    if (this.loadFailed && !disk) return;
    this.loadFailed = false;
    const merged = { ...this.settings };
    if (disk) {
      for (const key of Object.keys(merged)) {
        if (!(key in disk)) continue;
        const changedByUs = JSON.stringify(this.settings[key]) !== JSON.stringify(this.baseline[key]);
        if (!changedByUs) merged[key] = disk[key];
      }
    }
    Object.assign(this.settings, merged);
    await this.saveData(this.settings);
    this.baseline = structuredClone(this.settings);
  }
};
var ImagePickerModal = class extends import_obsidian.FuzzySuggestModal {
  constructor(plugin) {
    super(plugin.app);
    this.plugin = plugin;
    this.setPlaceholder("Pick an image to read");
  }
  getItems() {
    return this.plugin.app.vault.getFiles().filter((f) => this.plugin.canExtract(f));
  }
  getItemText(file) {
    return file.path;
  }
  onChooseItem(file) {
    void this.plugin.copyTextToClipboard(file);
  }
};
var PowerExtractSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(plugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }
  /** Obsidian 1.13 and up builds the tab from these and never calls display().
   *  Every row renders itself rather than declaring a `control`, so each one
   *  stays on the plugin's own save path instead of Obsidian's generic one. */
  getSettingDefinitions() {
    return [
      {
        name: "",
        searchable: false,
        // a masthead, not a setting
        render: (s) => {
          s.settingEl.empty();
          this.renderAbout(s.settingEl);
        }
      },
      ...this.rows().map(
        (row) => ({
          name: row.name,
          desc: row.desc,
          render: (s) => row.build(s)
        })
      )
    ];
  }
  /** The pre-1.13 renderer. It draws the same rows the definitions above
   *  declare, so the two only differ in who does the drawing. */
  display() {
    const root = this.containerEl;
    root.empty();
    this.renderAbout(root.createDiv({ cls: "px-about-standalone" }));
    for (const row of this.rows()) {
      const setting = new import_obsidian.Setting(root).setName(row.name);
      if (row.desc) setting.setDesc(row.desc);
      row.build(setting);
    }
  }
  renderAbout(el) {
    el.addClass("px-about");
    const head = el.createDiv({ cls: "px-about-head" });
    head.createSpan({ cls: "px-about-name", text: this.plugin.manifest.name });
    head.createSpan({ cls: "px-about-version", text: "v" + this.plugin.manifest.version });
    el.createDiv({ cls: "px-about-desc", text: this.plugin.manifest.description });
    const support = el.createDiv({ cls: "px-about-support" });
    support.createEl("a", { text: "Buy me a coffee", href: "https://buymeacoffee.com/powerplugins" });
    support.createSpan({
      text: `. One page covers every Power Plugin, so mention ${this.plugin.manifest.name} in the note, and say what would make it better while you are there. A good deal of what is in these plugins started as someone's note.`
    });
  }
  rows() {
    const plugin = this.plugin;
    const rows = [];
    rows.push({
      name: "Show notifications",
      desc: "Show popup notices from Power Extract. Turn off to keep Obsidian clear, especially on phones.",
      build: (s) => {
        s.addToggle(
          (t) => t.setValue(plugin.settings.showNotifications).onChange((v) => {
            plugin.settings.showNotifications = v;
            void plugin.persistSettings();
          })
        );
      }
    });
    rows.push({
      name: "This device",
      desc: "Where the reading happens, and whether it can happen here.",
      build: (s) => {
        const why = plugin.unavailableReason();
        const lang = plugin.api.language();
        const text = why ? capitalize(unavailableMessage(why)) : "Ready. Windows reads the images on this device" + (lang ? ", in " + lang + "." : ".");
        s.descEl.createDiv({ cls: "px-status", text });
      }
    });
    rows.push({
      name: "Text already read",
      desc: "Images are read once and remembered, so this grows as the vault is indexed.",
      build: (s) => {
        const { total, withText } = plugin.cacheSummary();
        s.descEl.createDiv({
          cls: "px-status",
          text: total ? `${total.toLocaleString()} images read, ${withText.toLocaleString()} of them holding text.` : "Nothing read yet."
        });
        s.addButton(
          (b) => b.setButtonText("Forget all").onClick(async () => {
            await plugin.clearCache();
            new Notice("Power Extract: cleared. Images will be read again as they are needed.");
            this.refresh();
          })
        );
        s.addButton(
          (b) => b.setButtonText("Tidy up").setTooltip("Drop text for images the vault no longer has").onClick(() => {
            const removed = plugin.prune();
            new Notice(removed ? `Power Extract: dropped ${removed} stale entries.` : "Power Extract: nothing to tidy.");
            this.refresh();
          })
        );
      }
    });
    rows.push({
      name: "Right-click an image to read it",
      desc: "Adds Copy text from image to the menu on any image file.",
      build: (s) => {
        s.addToggle(
          (t) => t.setValue(plugin.settings.rightClickMenu).onChange((v) => {
            plugin.settings.rightClickMenu = v;
            void plugin.persistSettings();
          })
        );
      }
    });
    rows.push({
      name: "Remember what was read",
      desc: "Keeps the text so an image is never read twice. Turning this off makes every search re-read the vault.",
      build: (s) => {
        s.addToggle(
          (t) => t.setValue(plugin.settings.useCache).onChange(async (v) => {
            plugin.settings.useCache = v;
            await plugin.persistSettings();
            if (!v) await plugin.clearCache();
            this.refresh();
          })
        );
      }
    });
    return rows;
  }
  /** Redraw after something changed the numbers on show. */
  refresh() {
    const tab = this;
    if (tab.update) tab.update();
    else tab.display();
  }
};
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* nosourcemap */