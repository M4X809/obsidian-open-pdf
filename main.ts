import { exec } from "child_process";
import {
	App,
	Editor,
	MarkdownView,
	Menu,
	Modal,
	Notice,
	Platform,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

// Remember to rename these classes and interfaces!

interface OpenOfficeSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: OpenOfficeSettings = {
	mySetting: "default",
};

export default class OpenOfficePlugin extends Plugin {
	settings: OpenOfficeSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Greet",
			(_evt: MouseEvent) => {
				// Called when the user clicks the icon.
				new Notice("This is a notice!");
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				// Support various document types that OnlyOffice can handle
				const supportedExtensions = [
					".pdf",
					".doc",
					".docx",
					".xls",
					".xlsx",
					".ppt",
					".pptx",
					".odt",
					".ods",
					".odp",
				];
				const isSupportedFile = supportedExtensions.some((ext) =>
					file.path.toLowerCase().endsWith(ext)
				);

				if (isSupportedFile) {
					const adapter = this.app.vault.adapter;
					const absolutePath = (adapter as any).getFullPath
						? (adapter as any).getFullPath(file.path)
						: require("path").join(
								(adapter as any).basePath || "",
								file.path
						  );
					console.log(absolutePath);

					menu.addItem((item) => {
						item.setTitle("✏️ Edit in OnlyOffice")
							.setIcon("document")
							.onClick(async () => {
								this.openFileInOnlyOffice(absolutePath);
							});
					});
				}
			})
		);

		// Add command to open current file in OnlyOffice
		this.addCommand({
			id: "open-in-onlyoffice",
			name: "Open current file in OnlyOffice",
			checkCallback: (checking: boolean) => {
				const activeFile = this.app.workspace.getActiveFile();
				if (!activeFile) return false;

				const supportedExtensions = [
					".pdf",
					".doc",
					".docx",
					".xls",
					".xlsx",
					".ppt",
					".pptx",
					".odt",
					".ods",
					".odp",
				];
				const isSupportedFile = supportedExtensions.some((ext) =>
					activeFile.path.toLowerCase().endsWith(ext)
				);

				if (!isSupportedFile) return false;

				if (!checking) {
					const adapter = this.app.vault.adapter;
					const absolutePath = (adapter as any).getFullPath
						? (adapter as any).getFullPath(activeFile.path)
						: require("path").join(
								(adapter as any).basePath || "",
								activeFile.path
						  );
					this.openFileInOnlyOffice(absolutePath);
				}

				return true;
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private openFileInOnlyOffice(filePath: string) {
		new Notice("Opening in OnlyOffice");

		let cmd: string;
		if (Platform.isMacOS) {
			// macOS: use 'open' command with OnlyOffice
			cmd = `open -a "ONLYOFFICE" "${filePath}"`;
		} else if (Platform.isWin) {
			// Windows: use OnlyOffice Desktop Editors
			cmd = `"C:\\Program Files\\ONLYOFFICE\\DesktopEditors\\DesktopEditors.exe" "${filePath}"`;
		} else {
			// Linux: use desktopeditors command
			cmd = `desktopeditors "${filePath}"`;
		}

		console.log(`Executing command: ${cmd}`);

		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.error(`Error opening file in OnlyOffice: ${error}`);
				new Notice(`Error opening file: ${error.message}`);
			} else {
				console.log(`File opened successfully: ${stdout}`);
			}
		});
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: OpenOfficePlugin;

	constructor(app: App, plugin: OpenOfficePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
