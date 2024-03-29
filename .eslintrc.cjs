module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: false,
	},
	extends: [
		'eslint:recommended',
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	ignorePatterns: ['app/assets/js/src/lib/*.js'],
	rules: {
		/////////////////////////
		// Overriding defaults //
		/////////////////////////
		'no-unused-vars': [
			'error',
			{
				vars: 'all',
				args: 'none',
				ignoreRestSiblings: false,
			}
		],

		// Sometimes it's useful to use a clearer name than `this`
		'@typescript-eslint/no-this-alias': 'off',

		////////////////////////
		// Debugging warnings //
		////////////////////////
		'no-debugger': 'warn',
		'no-constant-condition': 'warn',
		'no-console': [
			'warn',
			{
				allow: ['warn', 'error'],
			},
		],
		'no-warning-comments': [
			'warn',
			{
				terms: ['TODO'],
				location: 'start',
			}
		],

		////////////////
		// Code style //
		////////////////
		'array-bracket-spacing': [
			'error',
			'never',
		],
		'arrow-parens': [
			'error',
			'always',
		],
		'arrow-spacing': [
			'error',
			{
				before: true,
				after: true,
			},
		],
		'block-spacing': [
			'error',
			'always',
		],
		'brace-style': [
			'error',
			'1tbs',
			{
				allowSingleLine: true,
			},
		],
		'comma-dangle': [
			'error',
			{
				arrays: 'always-multiline',
				objects: 'always-multiline',
				imports: 'always-multiline',
				exports: 'always-multiline',
				functions: 'only-multiline',
			},
		],
		'comma-spacing': [
			'error',
			{
				before: false,
				after: true,
			}
		],
		'comma-style': [
			'error',
			'last',
		],
		'curly': [
			'error',
			'all',
		],
		'default-case-last': 'error',
		'eol-last': [
			'error',
			'always',
		],
		'func-call-spacing': [
			'error',
			'never',
		],
		'indent': [
			'error',
			'tab',
			{
				SwitchCase: 1,
				ignoredNodes: [
					// Ignore indentation within template literals to allow them to be indented like markup
					"TemplateLiteral *",
				],
			},
		],
		'no-trailing-spaces': [
			'error',
		],
		'no-undefined': 'error',
		'no-var': 'error',
		'one-var': [
			'error',
			'never',
		],
		// I do prefer template strings, but the 'prefer-template' rule also prohibits string coercion via `'' + val`
		// 'prefer-template': 'error',
		'quotes': [
			'error',
			'single',
			{
				allowTemplateLiterals: true,
			},
		],
		'rest-spread-spacing': [
			'error',
			'never',
		],
		'semi': [
			'error',
			'always',
		],
		'semi-spacing': [
			'error',
			{
				before: false,
				after: true,
			},
		],
		'semi-style': [
			'error',
			'last',
		],
		'space-before-blocks': [
			'error',
			'always',
		],
		'space-before-function-paren': [
			'error',
			{
				anonymous: 'always',
				named: 'never',
				asyncArrow: 'always',
			},
		],
		'space-in-parens': [
			'error',
			'never',
		],
		'space-unary-ops': [
			'error',
			{
				words: true,
			},
		],
		'spaced-comment': [
			'error',
			'always',
			{
				exceptions: [
					'/',
				],
				block: {
					balanced: true,
				},
			},
		],
		'no-mixed-spaces-and-tabs': [
			'error',
			'smart-tabs',
		],
	},
	overrides: [{
		files: ['*.ts'],
		parser: '@typescript-eslint/parser',
		parserOptions: {
			tsConfigRootDir: __dirname,
			project: ['./tsconfig.json'],
		},
		plugins: [
			'@typescript-eslint',
		],
		extends: [
			'plugin:@typescript-eslint/recommended',
			'plugin:@typescript-eslint/recommended-requiring-type-checking',
		],
		rules: {
			/////////////////////////
			// Overriding defaults //
			/////////////////////////

			// Sometimes it's useful to leave a name for an unused argument,
			// in case it might be used in the future
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					vars: 'all',
					args: 'none',
					ignoreRestSiblings: false,
				}
			],

			// Sometimes it's useful to use a clearer name than `this`
			'@typescript-eslint/no-this-alias': 'off',

			// There can be value in being explicit about a type that could be inferred,
			// especially if a variable's default value might change in the future
			'@typescript-eslint/no-inferrable-types': 'off',

			// I like being able to use `'' + val` to coerce an unknown type to a string
			'@typescript-eslint/restrict-plus-operands': 'off',

			// I don't mind type coercion in string literal expressions
			'@typescript-eslint/restrict-template-expressions': 'off',

			// Using `any[]` for rest arguments can sometimes be necessary
			'@typescript-eslint/no-explicit-any': [
				'warn',
				{
					ignoreRestArgs: true,
				},
			],

			////////////////
			// Code style //
			////////////////
			'@typescript-eslint/consistent-type-assertions': [
				'error',
				{
					assertionStyle: 'as',
				},
			],
		},
	}]
};
