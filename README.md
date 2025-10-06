# Open in OnlyOffice

Open PDFs and office documents from Obsidian directly in OnlyOffice Desktop Editors.

## What it does

- Supports opening these file types in OnlyOffice: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ODT, ODS, ODP.
- Adds a right‑click action in the file menu: ✏️ Edit in OnlyOffice.
- Adds a command palette action: Open current file in OnlyOffice.
- Lets you configure the OnlyOffice executable/app path per operating system.

This plugin is desktop‑only and requires OnlyOffice Desktop Editors to be installed on your system.

## Requirements

- Obsidian 0.15.0 or later (desktop)
- OnlyOffice Desktop Editors installed:
  - macOS: OnlyOffice app available to `open -a`
  - Windows: `DesktopEditors.exe` installed
  - Linux: `desktopeditors` available on PATH (or provide a custom path in settings)

## Installation

1) From Obsidian community plugins (recommended)
- Open **Settings → Community plugins** in Obsidian
- Select **Browse**, search for “Open in OnlyOffice”, and install
- Enable the plugin

2) Manual install
- Copy `manifest.json`, `main.js`, and (optionally) `styles.css` into your vault at:
  `.obsidian/plugins/open-pdf-onlyoffice/`
- Reload Obsidian and enable the plugin in **Settings → Community plugins**

## How to use

- From the file explorer: right‑click any supported file and select **✏️ Edit in OnlyOffice**
- From the command palette: open the palette and run **Open current file in OnlyOffice** while a supported file is active

## Settings

Find settings in **Settings → Plugin options → Open in OnlyOffice**.

- macOS “open -a” parameter
  - Default: `ONLYOFFICE`
  - The plugin runs: `open -a "ONLYOFFICE" "<file>"`
- Windows path to executable
  - Default: `C:\\Program Files\\ONLYOFFICE\\DesktopEditors\\DesktopEditors.exe`
- Linux binary path
  - Default: `desktopeditors`

If OnlyOffice is installed in a non‑default location, update the corresponding path.

## Troubleshooting

- Command not found / app doesn’t launch: set the correct path in the plugin settings for your OS.
- Nothing happens from the command palette: ensure the active file is a supported type.
- Action missing from right‑click menu: ensure you are right‑clicking a supported file in the file explorer.

## Privacy and security

This plugin runs locally and opens files with OnlyOffice on your machine. It does not send data over the network.