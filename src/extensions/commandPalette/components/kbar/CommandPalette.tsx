import * as React from 'react';

import { KBarProvider, KBarPortal, KBarPositioner, KBarAnimator, KBarSearch, useMatches, KBarResults, ActionImpl, ActionId } from 'kbar';

import { CommandPaletteProps } from '../command-palette/CommandPaletteProps';
import { useSpTheme } from '../theme-provider/ThemeProvider';

export const CommandPalette = ({ commands }: CommandPaletteProps) => {
	const theme = useSpTheme();

	const transformedCommands = commands.map((a) => ({
		...a,
		name: `${a.section} > ${a.name}`
	}));

	const positionerStyle = {
		backgroundColor: theme.palette.blackTranslucent40,
		fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
		zIndex: 1000
	} as const;

	const searchStyle = {
		background: theme.semanticColors.bodyBackground,
		border: 'none',
		boxSizing: 'border-box',
		color: theme.semanticColors.bodyText,
		fontSize: '16px',
		outline: 'none',
		padding: '12px 16px',
		width: '100%'
	} as const;

	const animatorStyle = {
		background: theme.semanticColors.bodyBackground,
		borderRadius: theme.effects.roundedCorner6,
		boxShadow: theme.effects.elevation16,
		color: theme.semanticColors.bodyText,
		maxWidth: '600px',
		overflow: 'hidden',
		width: '100%'
	} as const;

	return (
		<KBarProvider actions={transformedCommands}>
			<KBarPortal>
				<KBarPositioner style={positionerStyle}>
					<KBarAnimator style={animatorStyle}>
						<KBarSearch style={searchStyle} />
						<RenderResults />
					</KBarAnimator>
				</KBarPositioner>
			</KBarPortal>
		</KBarProvider>
	);
};

const ResultItem = React.forwardRef(
	(
		{
			action,
			active,
			currentRootActionId
		}: {
			action: ActionImpl;
			active: boolean;
			currentRootActionId: ActionId;
		},
		ref: React.Ref<HTMLDivElement>
	) => {
		const ancestors = React.useMemo(() => {
			if (!currentRootActionId) return action.ancestors;
			const index = action.ancestors.findIndex((ancestor) => ancestor.id === currentRootActionId);
			// +1 removes the currentRootAction; e.g.
			// if we are on the 'Set theme' parent action,
			// the UI should not display 'Set theme… > Dark'
			// but rather just 'Dark'
			return action.ancestors.slice(index + 1);
		}, [action.ancestors, currentRootActionId]);

		const theme = useSpTheme();

		return (
			<div
				ref={ref}
				style={{
					padding: '12px 16px',
					background: active ? theme.semanticColors.bodyBackgroundHovered : 'transparent',
					borderLeft: `2px solid ${active ? theme.palette.themePrimary : 'transparent'}`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					cursor: 'pointer'
				}}
			>
				<div
					style={{
						display: 'flex',
						gap: '8px',
						alignItems: 'center',
						fontSize: 14
					}}
				>
					{action.icon && action.icon}
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<div>
							{ancestors.length > 0 &&
								ancestors.map((ancestor) => (
									<React.Fragment key={ancestor.id}>
										<span
											style={{
												opacity: 0.5,
												marginRight: 8
											}}
										>
											{ancestor.name}
										</span>
										<span
											style={{
												marginRight: 8
											}}
										>
											&rsaquo;
										</span>
									</React.Fragment>
								))}
							<span>{action.name}</span>
						</div>

						{action.subtitle && <span style={{ fontSize: 12 }}>{action.subtitle}</span>}
					</div>
				</div>

				{action.shortcut?.length ? (
					<div aria-hidden style={{ display: 'grid', gridAutoFlow: 'column', gap: '4px' }}>
						{action.shortcut.map((sc) => (
							<kbd
								key={sc}
								style={{
									padding: '4px 6px',
									background: 'rgba(0 0 0 / .1)',
									borderRadius: '4px',
									fontSize: 14
								}}
							>
								{sc}
							</kbd>
						))}
					</div>
				) : null}
			</div>
		);
	}
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function RenderResults() {
	const { results, rootActionId } = useMatches();

	const groupNameStyle = {
		padding: '8px 16px',
		fontSize: '10px',
		textTransform: 'uppercase' as const,
		opacity: 0.5
	} as const;

	return (
		<KBarResults
			items={results}
			onRender={({ item, active }) =>
				typeof item === 'string' ? (
					<div style={groupNameStyle}>{item}</div>
				) : (
					<ResultItem action={item} active={active} currentRootActionId={rootActionId} />
				)
			}
		/>
	);
}
