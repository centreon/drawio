# Centreon draw.io Fork — Changes vs Upstream

This document describes all Centreon-specific changes compared to upstream draw.io `v20.5.3`.

The fork embeds the draw.io diagram editor inside Centreon's map application
(centreon-map4-web-client). The editor runs in an iframe, and all communication
with the parent Centreon application uses `window.postMessage`.

To see the full diff: `git diff -w v20.5.3 -- src/main/webapp/js/ ':!*.min.js'`

## Table of Contents

- [UI Customization](#ui-customization)
- [Centreon-Specific Features](#centreon-specific-features)
- [Editor Behavior Changes](#editor-behavior-changes)
- [Key Design Patterns](#key-design-patterns)

---

## UI Customization

Changes that remove or modify draw.io UI elements irrelevant to Centreon's
embedded context.

### `src/main/webapp/js/diagramly/Dialogs.js` (-213 lines)

Removed cloud storage dialogs (Google Drive, GitHub, OneDrive, etc.). Centreon
handles diagram persistence itself through postMessage IPC — these dialogs would
show non-functional options.

Specifically removed:

- `sysFontRadio` input element (system fonts radio button in font dialog)
- Entire Google Fonts section (radio button, font name input, URL input, preview)
- The font dialog now only shows system fonts, since Google Fonts requires
  external network access that may not be available in Centreon deployments.

### `src/main/webapp/js/diagramly/Menus.js` (~24 lines)

Removed menu items for cloud storage, collaboration, and sharing features that
are managed by Centreon's platform and irrelevant to the embedded editor.

### `src/main/webapp/js/diagramly/Minimal.js` (~35 lines)

Tailored the "min" theme (compact layout with floating panels) toolbar:

- Removed sharing, external storage, and template insertion items
- Kept floating format and sidebar panels that Centreon's map editor uses
- Preserved page tab container styling (`tabContainer.style.right = '70px'`)
  to make room for the zoom level indicator

### `src/main/webapp/js/grapheditor/Toolbar.js` (~15 lines)

Removed fill/stroke color pickers from the toolbar. Centreon manages cell
appearance through its own `editCentreonStyle` dialog, not raw draw.io style
properties. Exposing these in the toolbar would bypass Centreon's validation.

### `src/main/webapp/js/grapheditor/Sidebar.js` (~36 lines)

Reduced and reordered shape palette groups. Standard draw.io stencil libraries
are mostly irrelevant since shapes come from Centreon's resource catalog.

### `src/main/webapp/js/diagramly/sidebar/Sidebar.js` (~2 lines)

Minor palette visibility toggle (hiding search or basic shapes palette that
Centreon does not need).

---

## Centreon-Specific Features

### `src/main/webapp/js/grapheditor/Actions.js` (+270 lines)

The largest and most functionally rich changed file. Defines how draw.io actions
interact with Centreon's backend.

#### `editData` action override

Upstream draw.io's `editData` opens a dialog for editing raw XML attributes on a
cell. Centreon replaces this completely. Instead of showing a dialog, it:

1. Reads cell attributes from the underlying XML node, filtered by cell type:
   - For RESOURCE: reads `modelId`, `type`, `style`, `label`, `resourceId`
   - For LINK: reads `linkType`, `modelId`, `label`, etc.
2. Packages them as JSON and calls:
   ```javascript
   parent.postMessage(
     JSON.stringify({
       mxObject: cellAttributes,
       mxStyle: cell.getStyle(),
       event: "setShowWizardShapeProperties",
     }),
     "*",
   );
   ```
3. Centreon's React frontend opens its own resource-linking wizard.

The reason: Centreon cells need Centreon-specific properties (`modelId` linking
to a backend resource, `viewId` linking to a map page) that the generic XML
editor would expose in a confusing raw format.

#### `editCentreonStyle` action (new)

Sends the selected cell's `style` attribute (`'ICON'`, `'WEATHER'`, or
`'GEOMETRIC'`) to the parent via `postMessage` with event `'setCentreonStyle'`.
The parent then shows its own style-picker UI.

#### `createMapFromContainer` action (new)

Reads CONTAINER cell properties and sends them to the parent with event
`'createMapFromContainer'`. Allows the Centreon UI to create a new map linked to
an existing CONTAINER cell on the diagram.

#### `editContent` action override

Checks if a CONTAINER cell has both `viewId` and a non-empty `label`. If the
label matches an existing page name, shows an error (`'pageAlreadyExists'`).
Otherwise sends event `'createDrawioPageFromContainer'` to the parent. This
enables Centreon's "drill-down" navigation where clicking a CONTAINER opens a
dedicated sub-map page.

#### `pasteHere` and `duplicate` action overrides

Both clear `modelId=""` on pasted/duplicated cells so they do not claim to be
linked to a backend resource. For CONTAINER cells, they also move `viewId` to
`sourceViewId` (preserving the reference to the original map) while removing
`viewId` so the duplicate does not claim ownership of that map view.

The reason: if a user copies a cell that represents a router, the copy should
not also claim to represent the same router — it needs to be re-linked via the
wizard.

#### `deleteCells` helper (pre-delete hook)

Before any vertex is deleted, finds all connected edges and marks them as dashed
(`graph.setCellStyles(mxConstants.STYLE_DASHED, '1', edges)`). This is part of
the dashed edge semantics: dashed = "this connection involves an unresolved
resource".

### `src/main/webapp/js/grapheditor/Graph.js` (+403 lines)

#### Selection listener for WEATHER and GEOMETRIC styles

On every selection change:

- If a cell has `style === 'WEATHER'` and no overlay yet → calls
  `addWeatherIconToResource(cell)` to show the weather icon
- If a cell previously had WEATHER style but no longer does → calls
  `removeWeatherIconToResource(cell)` to remove the overlay
- If a cell has `style === 'GEOMETRIC'` and width > 84 → resets its size to
  20×20 (GEOMETRIC shapes are small geometry primitives)
- For connected edges: if selected vertex has `isDataAddedToEdge` or
  `linkType === 'SIMPLE'`, restores `dashed=0` on those edges

#### `duplicateCells` override

Sets `clones[i].setAttribute('modelId', "")` so duplicated cells do not
inherit the backend resource link.

#### `isDataAddedToEdge(edge)`

Checks if an edge has both `resourceId` and `linkType` in `['METRIC', 'STATUS']`.
Used to determine if an edge carries monitoring data.

#### `connectCell` override

When an edge is connected to a terminal:

- If the edge is a data edge or SIMPLE link with both source and target →
  sets `dashed=0` (solid line = valid connection)
- Otherwise → sets `dashed=1` (dashed line = unresolved connection)

#### `getCentrenMapImagePath(image)`

Constructs the absolute path to Centreon's own image assets using
`localStorage.getItem('centreon-url')`:

```javascript
return `${window.localStorage.getItem("centreon-url")}/modules/centreon-map4-web-client/img/${image}`;
```

#### `getValueByCell(cell, value)` — size enforcement

Enforces Centreon's size rules:

- WIDGET: minimum dimension of 84
- RESOURCE/CONTAINER with non-GEOMETRIC style: minimum dimension clamped to 84
- RESOURCE/CONTAINER with GEOMETRIC style: dimension clamped to range [20, 84]

#### `handleCentreonStyleChange(cell, cellStyle, value)`

Called when a cell's Centreon style property changes:

- Switching to GEOMETRIC → resets cell size to 20×20
- Switching away from GEOMETRIC → resets cell size to 84×84
- Switching to WEATHER → adds weather overlay
- Switching away from WEATHER → removes weather overlay

#### `addWeatherIconToResource(cell)`

Creates an `mxCellOverlay` using an SVG image fetched from
`getCentrenMapImagePath('weather.svg')` and positions it at the top-left corner
of the cell. Centreon's "weather" display shows a color-coded status icon on a
resource.

#### `setCellDimensions(cell, width, height)`

Helper that clones the cell's geometry and applies new dimensions via
`graph.getModel().setGeometry()`.

#### `mxCellEditor.startEditing` guard

Blocks in-place label editing on OUTPUT widget cells:

```javascript
if (
  cell.getAttribute("type") === "WIDGET" &&
  cell.getAttribute("widgetType") === "OUTPUT"
)
  return;
```

These widgets display dynamic content from Centreon's monitoring system and
their labels are managed externally.

### `src/main/webapp/js/grapheditor/Menus.js` (~54 lines)

#### Edit menu

Added `'editCentreonStyle'` item to the standard edit menu, alongside
`editData` and `editTooltip`.

#### Right-click context menu (`createPopupMenu` override)

The entire right-click context menu was rewritten. Upstream draw.io's popup
menu shows items for history, style, cell manipulation, connection manipulation,
and selection. Centreon's version removes all of these and replaces them with:

- Edit items: delete, cut, copy, duplicate, lock
- Arrange items (via `addPopupMenuArrangeItems`)
- Centreon items, shown conditionally by cell type:
  - `editData` for LINK/MEDIA/RESOURCE/WIDGET/CONTAINER
  - `editCentreonStyle` for RESOURCE and CONTAINER
  - `createMapFromContainer` and `editContent` for CONTAINER cells with both
    `viewId` and `label`
  - LINK_LEGEND widgets and SIMPLE-type links are excluded from Centreon items

The reason: draw.io's standard context menu exposes general diagramming features
(change style, edit XML, add connection points) that are meaningless in
Centreon's context where visual properties come from a Centreon-managed wizard.

### `src/main/webapp/js/grapheditor/Format.js` (~528 lines)

#### Size constraint enforcement in Arrange panel

Both `widthUpdate` and `heightUpdate` in the Arrange panel now route through
`graph.getValueByCell(cell, value)` before setting the geometry. When a user
manually types a size, Centreon's size constraints are enforced (e.g., a
RESOURCE cell snaps back to 84 minimum).

#### Panel simplifications

Various draw.io style options that conflict with Centreon's managed appearance
are removed or simplified.

### `src/main/webapp/js/diagramly/Pages.js` (~160 lines)

#### `DiagramPage` prototype extensions

```javascript
DiagramPage.prototype.getViewId = function() { ... }
DiagramPage.prototype.setViewId = function(value) { ... }
DiagramPage.prototype.getSaved = function() { ... }
DiagramPage.prototype.setSaved = function(value) { ... }
```

- `viewId` links a draw.io page to its corresponding Centreon map view in the
  backend database
- `saved` tracks whether the page has unsaved changes

#### Last-page deletion guard

If `this.pages.length <= 1`, shows an error dialog with message key
`'canNotDeleteContainer'` and returns early. In Centreon's model, a map always
has at least one page.

#### Unsaved dot indicator

When `page.getSaved() == 'false'`, an orange dot is rendered on the page tab:

```javascript
dot.style.backgroundColor = "#FFA500";
```

This gives visual feedback about which pages have local changes not yet synced
to the Centreon backend.

#### Change listeners for `saved` tracking

`mxGeometryChange`, `mxValueChange`, `mxStyleChange`, and `mxChildChange` all
call `this.currentPage.setSaved(false)` and `updateTabs()`. Any cell movement,
style change, value change, or structural change marks the current page as
having unsaved work.

---

## Editor Behavior Changes

### `src/main/webapp/js/grapheditor/EditorUi.js` (~77 lines)

#### Drag-drop disabled

`dragover` and `drop` event handlers on the graph container return early.
Centreon handles file import through its own workflow — allowing raw file drops
could bypass Centreon's validation and import process.

#### Weather overlay initialization on page load

When the graph view is reset (page load, page switch), iterates all vertex cells
and re-adds weather overlays for any cells with `style === 'WEATHER'`. Ensures
weather icons persist across page navigation.

### `src/main/webapp/js/diagramly/EditorUi.js` (+360 lines)

#### Drag-drop disabled (redundant layer)

Same `return;` guards added to `dragover`/`drop` handlers in the diagramly-layer
EditorUi. Belt-and-suspenders approach since both grapheditor and diagramly
layers register their own drag handlers.

#### postMessage handling

Receives messages from the Centreon parent application to load/save diagrams,
switch pages, and update cell data. This is the inbound side of the IPC
contract.

### `src/main/webapp/js/diagramly/Editor.js` (~24 lines)

Configuration flags adjusted for embedded context:

- `Editor.enableWebFonts = false` — web font loading disabled for CSP
  compliance in Centreon's server environment
- `Editor.enableServiceWorker` disabled — the PWA service worker is irrelevant
  for an embedded iframe
- Compression settings adjusted

---

## Key Design Patterns

### postMessage IPC

All draw.io ↔ Centreon communication uses `parent.postMessage` with JSON
payloads:

```javascript
parent.postMessage(JSON.stringify({
    event: '<eventName>',
    mxObject: [cellAttributes...],
    mxStyle: '<styleString>'
}), '*');
```

Events sent from draw.io to Centreon:

- `setShowWizardShapeProperties` — open resource-linking wizard
- `setCentreonStyle` — open style-picker (ICON/WEATHER/GEOMETRIC)
- `createMapFromContainer` — create a new map from a container cell
- `createDrawioPageFromContainer` — add a new page linked to a container

### Cell Type Contract

Every Centreon cell has a `type` XML attribute:

- **RESOURCE** — represents a monitored resource (host, service)
- **CONTAINER** — a grouping element that can link to a sub-map
- **LINK** — a connection between resources (SIMPLE, METRIC, or STATUS)
- **MEDIA** — an image or media element
- **WIDGET** — a dynamic display element (OUTPUT, LINK_LEGEND, etc.)

Additional key attributes:

- `modelId` — links a cell to a Centreon backend resource. Empty = "unlinked"
- `viewId` — links a page or container to a map view
- `style` — Centreon visual style: `ICON`, `WEATHER`, or `GEOMETRIC`
- `linkType` — for LINK cells: `SIMPLE`, `METRIC`, or `STATUS`
- `resourceId` — for data-bearing links: the monitored resource providing data

### Dashed Edge Semantics

Dashed edges = "this connection involves an unresolved resource". This visual
language is implemented across multiple files:

- **Actions.js** `deleteCells`: marks edges dashed when a vertex is deleted
- **Actions.js** `pasteHere`/`duplicate`: clears `modelId`, so connected edges
  become dashed on next redraw
- **Graph.js** selection listener: restores `dashed=0` on edges when a vertex
  with data is selected
- **Graph.js** `connectCell`: sets `dashed=0` when edge has both endpoints
  resolved, `dashed=1` otherwise

### Size Enforcement

Centreon enforces cell sizes based on type and style:

| Cell Type          | Style     | Size Rules     |
| ------------------ | --------- | -------------- |
| WIDGET             | any       | minimum 84×84  |
| RESOURCE/CONTAINER | GEOMETRIC | 20×20 to 84×84 |
| RESOURCE/CONTAINER | other     | minimum 84×84  |

Enforced in:

- `Graph.js` `getValueByCell` — runtime enforcement
- `Format.js` width/height inputs — Arrange panel enforcement
- `Graph.js` `handleCentreonStyleChange` — resets size on style switch
