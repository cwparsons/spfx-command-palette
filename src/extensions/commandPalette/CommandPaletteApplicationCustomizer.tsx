import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BaseApplicationCustomizer, PlaceholderContent, PlaceholderName } from '@microsoft/sp-application-base';
import { Log } from '@microsoft/sp-core-library';
import { lazy, Suspense } from 'react';

import { SpThemeProvider } from './components/theme-provider/ThemeProvider';

import * as strings from 'CommandPaletteApplicationCustomizerStrings';

const LOG_SOURCE = 'CommandPaletteApplicationCustomizer';

export default class CommandPaletteApplicationCustomizer extends BaseApplicationCustomizer<Record<string, never>> {
	private static _placeholder?: PlaceholderContent;
	private openCommandPalette = this._openCommandPalette.bind(this);

	public onInit(): Promise<void> {
		Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

		this._createPlaceholder();

		document.addEventListener('keydown', this.openCommandPalette);

		return;
	}

	protected onDispose(): void {
		document.removeEventListener('keydown', this.openCommandPalette);
	}

	private _createPlaceholder(): void {
		// Check if the application customizer has already been rendered.
		if (!CommandPaletteApplicationCustomizer._placeholder || !CommandPaletteApplicationCustomizer._placeholder.domElement) {
			// Create a DOM element in the top placeholder for the application customizer to render.
			CommandPaletteApplicationCustomizer._placeholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Bottom, {
				onDispose: () => {
					ReactDOM.unmountComponentAtNode(CommandPaletteApplicationCustomizer._placeholder.domElement);
				}
			});
		}
	}

	private _openCommandPalette(ev: KeyboardEvent): void {
		ev.preventDefault();

		if (ev.key === 'k' && (ev.ctrlKey || ev.metaKey)) {
			this.context.placeholderProvider.changedEvent.add(this, this._render);

			document.removeEventListener('keydown', this.openCommandPalette);
		}
	}

	private async _render(): Promise<void> {
		const { CommandList } = await import(/* webpackChunkName: "commandpalette-commandlist" */ './Commands');

		const CommandPalette = lazy(() =>
			import(/* webpackChunkName: "commandpalette-ninjakeys" */ './components/ninja-keys/CommandPalette').then((module) => ({
				default: module.CommandPalette
			}))
		);

		try {
			ReactDOM.render(
				<SpThemeProvider observer={this} serviceScope={this.context.serviceScope}>
					<Suspense fallback={<div />}>
						<CommandPalette commands={CommandList(this.context)} />
					</Suspense>
				</SpThemeProvider>,
				CommandPaletteApplicationCustomizer._placeholder.domElement
			);
		} catch (error) {
			Log.error(LOG_SOURCE, error, this.context.serviceScope);
		}
	}
}
