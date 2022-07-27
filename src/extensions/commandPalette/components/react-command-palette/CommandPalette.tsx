import * as React from 'react';

import ReactCommandPalette from 'react-command-palette';

import { CommandPaletteProps } from '../command-palette/CommandPaletteProps';
import './index.css';

export const CommandPalette = ({ commands }: CommandPaletteProps) => {
	const transformedCommands = commands.map((a) => ({
		...a,
		name: `${a.section} > ${a.name}`,
		command: a.perform
	}));

	return <ReactCommandPalette commands={transformedCommands} trigger={<React.Fragment />} />;
};
