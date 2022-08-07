import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Log } from '@microsoft/sp-core-library';
import { BaseApplicationCustomizer, PlaceholderContent, PlaceholderName } from '@microsoft/sp-application-base';

import { CommandList } from './Commands';
import { SpThemeProvider } from './components/theme-provider/ThemeProvider';

// import { CommandPalette } from './components/kbar/CommandPalette';
// import { CommandPalette } from './components/react-command-palette/CommandPalette';
import { CommandPalette } from './components/ninja-keys/CommandPalette';

import * as strings from 'CommandPaletteApplicationCustomizerStrings';

const LOG_SOURCE = 'CommandPaletteApplicationCustomizer';

export default class CommandPaletteApplicationCustomizer extends BaseApplicationCustomizer<Record<string, never>> {
	private static _placeholder?: PlaceholderContent;

	public onInit(): Promise<void> {
		Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

		this.context.placeholderProvider.changedEvent.add(this, this._render);

		return;
	}

	private _render(): void {
		// Check if the application customizer has already been rendered.
		if (!CommandPaletteApplicationCustomizer._placeholder || !CommandPaletteApplicationCustomizer._placeholder.domElement) {
			// Create a DOM element in the top placeholder for the application customizer to render.
			CommandPaletteApplicationCustomizer._placeholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Bottom, {
				onDispose: () => {
					ReactDOM.unmountComponentAtNode(CommandPaletteApplicationCustomizer._placeholder.domElement);
				}
			});
		}

		try {
			ReactDOM.render(
				<SpThemeProvider observer={this} serviceScope={this.context.serviceScope}>
					<CommandPalette commands={CommandList(this.context)} />
				</SpThemeProvider>,
				CommandPaletteApplicationCustomizer._placeholder.domElement
			);
		} catch (error) {
			Log.error(LOG_SOURCE, error, this.context.serviceScope);
		}
	}
}
