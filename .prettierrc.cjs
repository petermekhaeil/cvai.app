module.exports = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	pluginSearchDirs: false,
	plugins: [require('prettier-plugin-svelte')],
	overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }]
};
