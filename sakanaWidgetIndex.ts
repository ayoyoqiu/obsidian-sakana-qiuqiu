import SakanaWidget from 'component/wrapper';
import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

declare const app: any;

interface SakanaWidgetPluginSettings {
	widgets: SakanaWidgetInterface[];
	lastWidget: string;
}

const DEFAULT_SETTINGS: SakanaWidgetPluginSettings = {
	widgets: [],
	lastWidget: '',
}

export default class SakanaWidgetPlugin extends Plugin {
	sakanaBoxEl: HTMLElement | undefined;
	sakanaEl: HTMLElement;
	sakanaWidget: SakanaWidget | undefined;
	settings: SakanaWidgetPluginSettings;

	async onload() {

		// Register Settings Stuff
		await this.registerSettings();

		this.app.workspace.onLayoutReady(()=> {
			this.loadSakanaWidgets();
			this.addSakanaWidget();
		});

		this.addCommand({
			id: 'show-sakana-widget',
			name: 'Show Sakana Widget',
			hotkeys: [],
			callback: () => {
				if(!this.sakanaBoxEl) {
					this.addSakanaWidget();
				}
			},
		});

		this.addCommand({
			id: 'hide-sakana-widget',
			name: 'Hide Sakana Widget',
			hotkeys: [],
			callback: () => {
				if(this.sakanaBoxEl) {
					this.detachSakanaWidget();
				}
			},
		});
	}

	private addSakanaWidget() {

		this.sakanaBoxEl = document.body.createEl('div', { attr: { id: 'sakana-widget-box' }, cls: 'sakana-widget-box' });
		this.sakanaEl = this.sakanaBoxEl.createEl('div', { attr: { id: 'sakana-widget' }, cls: 'sakana-widget' });

		this.sakanaWidget = new SakanaWidget({ character: this.settings.lastWidget ? this.settings.lastWidget : 'qiuqiu' , autoFit: true }).setState({ i: 0.03, d: 0.99,  }).mount('#sakana-widget');

	}

	async onunload() {
		if(this.sakanaWidget) {
			await this.saveCurrentWidgetName();
			this.sakanaWidget.unmount();
		}
		if(this.sakanaBoxEl) {
			this.sakanaBoxEl.detach();
		}
	}

	async registerSettings() {
		await this.loadSettings();
		this.addSettingTab(new SakanaWidgetSettingTab(this.app, this));
		this.registerInterval(window.setTimeout(() => {
				this.saveSettings();
			}, 100)
		);
	}

	async saveCurrentWidgetName() {
		const lastCharacter = this.sakanaWidget;
		if (lastCharacter) {
			this.settings.lastWidget = lastCharacter._char;
			await this.saveSettings();
		}
	}

	async detachSakanaWidget() {
		if (this.sakanaBoxEl) {
			await this.saveCurrentWidgetName();

			this.sakanaBoxEl.detach();
			this.sakanaBoxEl = undefined;
			this.sakanaWidget = undefined;
		}
	}

	getCoverRealPath(imageUrl: string) {
		if (!imageUrl) return "";

		if (
			imageUrl.startsWith("http://") ||
			imageUrl.startsWith("https://")
		) {
			return imageUrl;
		}

		const file = app.metadataCache.getFirstLinkpathDest(imageUrl, "");

		if (file) {
			if (
				["png", "jpg", "jpeg", "gif", "bmp", "svg"].includes(
					file.extension
				)
			) {
				return app.vault.getResourcePath(file);
			}
		}

		return "";
	}

	loadSakanaWidgets() {
		if(this.settings.widgets.length > 0) {
			this.settings.widgets.forEach((widget) => {
				const selfWidget = SakanaWidget.getCharacter('qiuqiu');
				if (selfWidget) selfWidget.image = this.getCoverRealPath(widget.url);
				if (selfWidget) SakanaWidget.registerCharacter(widget.name, selfWidget);
			});
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


class SakanaWidgetSettingTab extends PluginSettingTab {
	plugin: SakanaWidgetPlugin;
	private applyDebounceTimer: number = 0;

	constructor(app: App, plugin: SakanaWidgetPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	applySettingsUpdate() {
		clearTimeout(this.applyDebounceTimer);
		const plugin = this.plugin;
		this.applyDebounceTimer = window.setTimeout(() => {
			plugin.saveSettings();
		}, 100);
	}


	display(): void {
		const { containerEl } = this;
		const { settings } = this.plugin;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Qiuqiu Widget Settings' });

		new Setting(containerEl)
			.setName('Add new widget')
			.setDesc('Create a new widget to play with ~ 🐱')
			.addButton((button) => button
				.setButtonText('+')
				.onClick(async () => {
					settings.widgets.push({
						name: `Widget ${settings.widgets.length + 1}`,
						url: "",
					});
					this.applySettingsUpdate();
					this.display();
				}));

		this.displayMacroSettings();
	}

	displayMacroSettings(): void {
		const { containerEl } = this;
		const { settings } = this.plugin;

		settings.widgets.forEach((widget, index) => {
			const topLevelSetting = new Setting(containerEl)
				.setClass('widget-setting')
				.setName(`QiuqiuWidget #${index + 1}`)
				.addButton((button) => button
					.setButtonText('Delete Widget')
					.onClick(async () => {
						settings.widgets.splice(index, 1);
						this.applySettingsUpdate();
						this.display();
					}));

			const mainSettingsEl = topLevelSetting.settingEl.createEl('div', 'widget-main-settings');

			mainSettingsEl.createEl('label', { text: 'Widget Name' });
			mainSettingsEl.createEl('input', {
				cls: 'name-input',
				type: 'text',
				value: widget.name,
			}).on('change', '.name-input', async (evt: Event) => {
				const target = evt.target as HTMLInputElement;
				settings.widgets[index] = { ...widget, name: target.value };
				this.applySettingsUpdate();
			});

			mainSettingsEl.createEl('label', { text: 'Url Link' });
			mainSettingsEl.createEl('input', {
				cls: 'url-input',
				type: 'text',
				value: widget.url,
			}).on('change', '.url-input', async (evt: Event) => {
				const target = evt.target as HTMLInputElement;
				settings.widgets[index] = { ...widget, url: target.value };
				this.applySettingsUpdate();
			});
		});
	}
}
