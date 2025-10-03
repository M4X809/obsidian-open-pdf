import { exec } from "child_process";
import {
	App,
	Notice,
	Platform,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

interface OpenOfficeSettings {
	macosPath: string;
	windowsPath: string;
	linuxPath: string;
}

const DEFAULT_SETTINGS: OpenOfficeSettings = {
	macosPath: "ONLYOFFICE",
	windowsPath:
		"C:\\Program Files\\ONLYOFFICE\\DesktopEditors\\DesktopEditors.exe",
	linuxPath: "desktopeditors",
};

export default class OpenOfficePlugin extends Plugin {
	settings: OpenOfficeSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new OpenOfficeSettingTab(this.app, this));

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
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
			if (this.settings.macosPath === "") {
				new Notice("MacOS open -a parameter is not set");
				return;
			}
			// macOS: use 'open' command with OnlyOffice
			cmd = `open -a "${this.settings.macosPath}" "${filePath}"`;
			// cmd = `/Applications/ONLYOFFICE.app/Contents/MacOS/ONLYOFFICE "${filePath}"`;
		} else if (Platform.isWin) {
			if (this.settings.windowsPath === "") {
				new Notice("Windows path to ONLYOFFICE executable is not set");
				return;
			}
			// Windows: use OnlyOffice Desktop Editors
			cmd = `"${this.settings.windowsPath}" "${filePath}"`;
		} else {
			if (this.settings.linuxPath === "") {
				new Notice("Linux path to ONLYOFFICE binary is not set");
				return;
			}
			// Linux: use desktopeditors command
			cmd = `${this.settings.linuxPath} "${filePath}"`;
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

class OpenOfficeSettingTab extends PluginSettingTab {
	plugin: OpenOfficePlugin;

	constructor(app: App, plugin: OpenOfficePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		const platform = Platform.isMacOS
			? "macOS"
			: Platform.isWin
			? "Windows"
			: "Linux";

		switch (platform) {
			case "macOS":
				new Setting(containerEl)
					.addText((text) =>
						text
							.setPlaceholder("MacOS open -a parameter")
							.setValue(this.plugin.settings.macosPath)

							.onChange(async (value) => {
								this.plugin.settings.macosPath = value;
								await this.plugin.saveSettings();
							})
					)
					.setDesc(
						`Default is "ONLYOFFICE". The command will be executed as "open -a \"${this.plugin.settings.macosPath}\" \${filePath}"`
					)
					.setName(`MacOS "open -a" parameter.`);
				break;
			case "Windows":
				new Setting(containerEl)
					.addText((text) =>
						text
							.setPlaceholder("ONLYOFFICE executable path")
							.setValue(this.plugin.settings.windowsPath)
							.onChange(async (value) => {
								this.plugin.settings.windowsPath = value;
								await this.plugin.saveSettings();
							})
					)
					.setName("Windows path to ONLYOFFICE executable")
					.setDesc(
						'Default is "C:\\Program Files\\ONLYOFFICE\\DesktopEditors\\DesktopEditors.exe"'
					);
				break;
			case "Linux":
				new Setting(containerEl)
					.addText((text) =>
						text
							.setPlaceholder("ONLYOFFICE binary path")
							.setValue(this.plugin.settings.linuxPath)
							.onChange(async (value) => {
								this.plugin.settings.linuxPath = value;
								await this.plugin.saveSettings();
							})
					)
					.setName("Linux path to ONLYOFFICE binary")
					.setDesc("This setting has no default value");
				break;
		}

		// new Setting(containerEl)
		// 	.setName("Setting #1")
		// 	.setDesc("It's a secret")
		// 	.addText((text) =>
		// 		text
		// 			.setPlaceholder("Enter your secret")
		// 			.setValue(this.plugin.settings.mySetting)
		// 			.onChange(async (value) => {
		// 				this.plugin.settings.mySetting = value;
		// 				await this.plugin.saveSettings();
		// 			})
		// 	);
	}
}
