import * as React from 'react';

import 'ninja-keys';
import { useRef, useEffect } from 'react';

import { Command } from '../../Commands';
import { useSpTheme } from '../theme-provider/ThemeProvider';

export type NinjaKeysProps = {
	placeholder?: string;
	disableHotkeys?: boolean;
	hideBreadcrumbs?: boolean;
	openHotkey?: string;
	navigationUpHotkey?: string;
	navigationDownHotkey?: string;
	closeHotkey?: string;
	goBackHotkey?: string;
	selectHotkey?: string;
	hotKeysJoinedView?: boolean;
	noAutoLoadMdIcons?: boolean;
};

export type CommandPaletteProps = NinjaKeysProps & {
	commands: Command[];
	openOnLoad?: boolean;
};

export const CommandPalette = ({ commands, openOnLoad = true, noAutoLoadMdIcons = true, ...ninjaKeyProps }: CommandPaletteProps) => {
	const ninjaKeys = useRef(null);
	const theme = useSpTheme();

	const style = {
		'--ninja-accent-color': theme.palette.themePrimary,
		'--ninja-footer-background': theme.palette.neutralLighter,
		'--ninja-key-border-radius': theme.effects.roundedCorner6,
		'--ninja-modal-shadow': theme.effects.elevation16,
		'--ninja-selected-background': theme.palette.neutralLighter,
		'--ninja-text-color': theme.semanticColors.bodyText
	};

	useEffect(() => {
		if (ninjaKeys.current) {
			ninjaKeys.current.data = commands.map((a) => ({
				...a,
				title: a.name,
				handler: a.perform
			}));

			if (openOnLoad) {
				setTimeout(() => {
					ninjaKeys.current.open();
				});
			}
		}
	}, []);

	return <ninja-keys noAutoLoadMdIcons={noAutoLoadMdIcons} {...ninjaKeyProps} ref={ninjaKeys} style={style} />;
};
