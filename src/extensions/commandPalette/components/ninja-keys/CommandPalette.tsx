import * as React from 'react';

import 'ninja-keys';
import { useRef, useEffect } from 'react';

import { CommandPaletteProps } from '../command-palette/CommandPaletteProps';
import { useSpTheme } from '../theme-provider/ThemeProvider';

export const CommandPalette = ({ commands }: CommandPaletteProps) => {
	const ninjaKeys = useRef(null);
	const theme = useSpTheme();

	const transformedCommands = commands.map((a) => ({
		...a,
		title: a.name,
		handler: a.perform
	}));

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
			ninjaKeys.current.data = transformedCommands;
		}
	}, []);

	return <ninja-keys ref={ninjaKeys} style={style} />;
};
