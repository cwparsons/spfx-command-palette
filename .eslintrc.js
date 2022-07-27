require('@rushstack/eslint-config/patch/modern-module-resolution');
module.exports = {
	extends: ['@microsoft/eslint-config-spfx/lib/profiles/default'],
	parserOptions: { tsconfigRootDir: __dirname },
	rules: {
		'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
		'@typescript-eslint/explicit-function-return-type': ['off'],
		'@microsoft/spfx/no-async-await': ['off'],
		'@typescript-eslint/typedef': ['off']
	}
};
