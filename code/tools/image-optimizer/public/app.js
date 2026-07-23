const state = {
  sessionId: null,
  items: [],
  optimizedItems: [],
  selectedId: null,
  filter: "all",
  preset: "case-study",
  totals: null,
}

const presets = {
  "case-study": { maxWidth: 1800, quality: 82, format: "auto" },
  thumbnail: { maxWidth: 1600, quality: 82, format: "auto" },
  poster: { maxWidth: 1800, quality: 80, format: "jpeg" },
  detail: { maxWidth: 2400, quality: 85, format: "auto" },
}

const els = {
  statusText: document.querySelector("#statusText"),
  sourceDir: document.querySelector("#sourceDir"),
  scanButton: document.querySelector("#scanButton"),
  fileInput: document.querySelector("#fileInput"),
  folderInput: document.querySelector("#folderInput"),
  optimizeButton: document.querySelector("#optimizeButton"),
  downloadButton: document.querySelector("#downloadButton"),
  outputPath: document.querySelector("#outputPath"),
  format: document.querySelector("#format"),
  maxWidth: document.querySelector("#maxWidth"),
  quality: document.querySelector("#quality"),
  qualityValue: document.querySelector("#qualityValue"),
  preventLarger: document.querySelector("#preventLarger"),
  includeAnimatedGif: document.querySelector("#includeAnimatedGif"),
  fileCount: document.querySelector("#fileCount"),
  originalTotal: document.querySelector("#originalTotal"),
  optimizedTotal: document.querySelector("#optimizedTotal"),
  savedTotal: document.querySelector("#savedTotal"),
  previewTitle: document.querySelector("#previewTitle"),
  previewMeta: document.querySelector("#previewMeta"),
  beforeImage: document.querySelector("#beforeImage"),
  afterImage: document.querySelector("#afterImage"),
  assetRows: document.querySelector("#assetRows"),
}

function setStatus(message) {
  els.statusText.textContent = message
}

function bytesLabel(bytes) {
  if (!Number.isFinite(bytes)) return "-"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function percentLabel(value) {
  if (!Number.isFinite(value)) return "-"
  return `${value.toFixed(1)}%`
}

function activeItems() {
  if (state.optimizedItems.length) {
    const byId = new Map(state.optimizedItems.map((item) => [item.id, item]))
    return state.items.map((item) => byId.get(item.id) || item)
  }
  return state.items
}

function filteredItems() {
  const items = activeItems()
  if (state.filter === "oversized") return items.filter((item) => (item.width || 0) > 2400)
  if (state.filter === "png") return items.filter((item) => item.format === "png")
  if (state.filter === "review") {
    return items.filter((item) => item.warnings?.length || item.skipped || item.animated)
  }
  return items
}

function selectedItem() {
  return activeItems().find((item) => item.id === state.selectedId) || activeItems()[0]
}

function renderStats() {
  const items = activeItems()
  const originalBytes = items.reduce((total, item) => total + (item.originalBytes || 0), 0)
  const outputBytes = state.optimizedItems.length
    ? state.optimizedItems.reduce((total, item) => total + (item.outputBytes || item.originalBytes || 0), 0)
    : null
  const savedBytes = outputBytes == null ? null : originalBytes - outputBytes
  const savedPercent = outputBytes == null || originalBytes === 0 ? null : (savedBytes / originalBytes) * 100

  els.fileCount.textContent = String(items.length)
  els.originalTotal.textContent = bytesLabel(originalBytes)
  els.optimizedTotal.textContent = outputBytes == null ? "-" : bytesLabel(outputBytes)
  els.savedTotal.textContent =
    savedBytes == null ? "-" : `${bytesLabel(Math.max(0, savedBytes))} ${percentLabel(savedPercent)}`
}

function warningText(item) {
  if (item.skipReason) return item.skipReason
  if (item.warnings?.length) return item.warnings[0]
  if (item.keptOriginal) return "Original kept"
  return ""
}

function renderRows() {
  const items = filteredItems()
  if (!items.length) {
    els.assetRows.innerHTML = `<tr><td colspan="5" class="empty-row">No matching files.</td></tr>`
    return
  }

  els.assetRows.innerHTML = items
    .map((item) => {
      const selectedClass = item.id === state.selectedId ? " is-selected" : ""
      const savedClass = item.savingsPercent < 0 ? "saved-negative" : "saved-positive"
      const output = item.outputLabel
        ? `${item.outputLabel}${item.outputFormat ? ` / ${item.outputFormat}` : ""}`
        : "-"
      const saved = Number.isFinite(item.savingsPercent)
        ? `<span class="${savedClass}">${percentLabel(item.savingsPercent)}</span>`
        : "-"
      const warning = warningText(item)

      return `
        <tr class="${selectedClass}" data-id="${item.id}">
          <td>
            <div class="file-cell">
              <span>${item.fileName || "Untitled"}</span>
              <small>${item.relativePath || ""}</small>
              ${warning ? `<small class="warning">${warning}</small>` : ""}
            </div>
          </td>
          <td><span class="pill">${item.suggestedUse || "asset"}</span></td>
          <td>${item.originalLabel || bytesLabel(item.originalBytes)}<br><small>${item.width || "-"}x${item.height || "-"}</small></td>
          <td>${output}</td>
          <td>${saved}</td>
        </tr>
      `
    })
    .join("")
}

function renderPreview() {
  const item = selectedItem()
  if (!item || !state.sessionId) {
    els.previewTitle.textContent = "No file selected"
    els.previewMeta.textContent = "-"
    els.beforeImage.removeAttribute("src")
    els.afterImage.removeAttribute("src")
    return
  }

  state.selectedId = item.id
  els.previewTitle.textContent = item.fileName || "Untitled"
  els.previewMeta.textContent = `${item.width || "-"}x${item.height || "-"} / ${item.originalLabel || bytesLabel(item.originalBytes)}`
  els.beforeImage.src = `/api/source/${state.sessionId}/${item.id}`
  els.beforeImage.alt = item.fileName || ""

  if (item.outputRelativePath && !item.skipped) {
    els.afterImage.src = `/api/output/${state.sessionId}/${item.id}`
    els.afterImage.alt = `${item.fileName || ""} optimized`
  } else {
    els.afterImage.removeAttribute("src")
    els.afterImage.alt = ""
  }
}

function render() {
  renderStats()
  renderRows()
  renderPreview()
  els.optimizeButton.disabled = !state.sessionId || !state.items.length
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options)
  const contentType = response.headers.get("content-type") || ""
  const data = contentType.includes("application/json") ? await response.json() : await response.text()
  if (!response.ok) {
    throw new Error(data.error || data || "Request failed.")
  }
  return data
}

function loadSession(data) {
  state.sessionId = data.sessionId
  state.items = data.items || []
  state.optimizedItems = []
  state.selectedId = state.items[0]?.id || null
  state.totals = null
  els.downloadButton.classList.add("is-disabled")
  els.downloadButton.href = "#"
  els.outputPath.textContent = "No output yet"
  render()
}

async function scanFolder() {
  setStatus("Scanning")
  els.scanButton.disabled = true
  try {
    const data = await requestJson("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceDir: els.sourceDir.value,
        limit: 500,
      }),
    })
    loadSession(data)
    setStatus(`${data.items.length} files ready`)
  } catch (error) {
    setStatus(error.message)
  } finally {
    els.scanButton.disabled = false
  }
}

async function uploadFiles(fileList) {
  const files = Array.from(fileList || []).filter((file) => file.type.startsWith("image/"))
  if (!files.length) return

  setStatus("Loading files")
  const form = new FormData()
  files.forEach((file) => {
    form.append("images", file)
    form.append("paths", file.webkitRelativePath || file.name)
  })

  try {
    const data = await requestJson("/api/upload", {
      method: "POST",
      body: form,
    })
    loadSession(data)
    setStatus(`${data.items.length} files ready`)
  } catch (error) {
    setStatus(error.message)
  }
}

function settings() {
  return {
    preset: state.preset,
    format: els.format.value,
    maxWidth: Number(els.maxWidth.value),
    quality: Number(els.quality.value),
    preventLarger: els.preventLarger.checked,
    includeAnimatedGif: els.includeAnimatedGif.checked,
  }
}

async function optimize() {
  if (!state.sessionId) return

  setStatus("Optimizing")
  els.optimizeButton.disabled = true
  try {
    const data = await requestJson(`/api/optimize/${state.sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings()),
    })
    state.optimizedItems = data.items || []
    state.totals = data.totals
    els.downloadButton.href = data.downloadUrl
    els.downloadButton.classList.remove("is-disabled")
    els.outputPath.textContent = data.outputDir || "Output ready"
    setStatus(`Saved ${percentLabel(data.totals?.savingsPercent || 0)}`)
    render()
  } catch (error) {
    setStatus(error.message)
  } finally {
    els.optimizeButton.disabled = false
  }
}

function applyPreset(name) {
  state.preset = name
  const preset = presets[name]
  if (!preset) return
  els.maxWidth.value = preset.maxWidth
  els.quality.value = preset.quality
  els.qualityValue.textContent = String(preset.quality)
  els.format.value = preset.format

  document.querySelectorAll(".segment").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.preset === name)
  })
}

els.scanButton.addEventListener("click", scanFolder)
els.fileInput.addEventListener("change", (event) => uploadFiles(event.target.files))
els.folderInput.addEventListener("change", (event) => uploadFiles(event.target.files))
els.optimizeButton.addEventListener("click", optimize)
els.quality.addEventListener("input", () => {
  els.qualityValue.textContent = els.quality.value
})

document.querySelectorAll(".segment").forEach((button) => {
  button.addEventListener("click", () => applyPreset(button.dataset.preset))
})

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter
    document.querySelectorAll(".filter").forEach((entry) => {
      entry.classList.toggle("is-active", entry === button)
    })
    render()
  })
})

els.assetRows.addEventListener("click", (event) => {
  const row = event.target.closest("tr[data-id]")
  if (!row) return
  state.selectedId = row.dataset.id
  render()
})

document.addEventListener("dragover", (event) => {
  event.preventDefault()
})

document.addEventListener("drop", (event) => {
  event.preventDefault()
  uploadFiles(event.dataTransfer.files)
})

applyPreset("case-study")
render()
