// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "multicursor-insanity" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(vscode.commands.registerCommand('multicursor-insanity.groupAbove', function () {
		const activeEditor = vscode.window.activeTextEditor
		const selections = activeEditor.selections
		selections.sort((a,b) => a.end.line - b.end.line)

		const documentText = activeEditor.document.getText()
		const lines = documentText.split('\n')

		const startLine = selections[0].start.line
		let i = startLine
		const newSelections=[]

		let new_character = selections[0].start.character
		let character1 = indexOfNonWhiteSpace(lines[i])
		let preStr1

		while (true) {
			if (character1 > -1) {
				if (i - 1 > -1) {
					const character2 = indexOfNonWhiteSpace(lines[i - 1])
					if (character2 > -1) {
						new_character = character2
						preStr1 = lines[startLine].slice(0,character1)
						const preStr2 = lines[i - 1].slice(0,character2)
						if (preStr1 === preStr2) {
							const position1 = new vscode.Position(i, new_character)
							newSelections.push(new vscode.Selection(position1,position1))
						} else {
							preStr1 = preStr2
							character1 = character2
						}
						const position2 = new vscode.Position(i - 1, new_character)
						newSelections.push(new vscode.Selection(position2,position2))
						i-=2
						break
					}

				}
			}
			i--
			while (i > -1) {
				character1 = indexOfNonWhiteSpace(lines[i])
				if (character1 > -1) {
					// endChar = Math.max(endChar, character1)
					new_character = character1
					preStr1 = lines[i].slice(0,character1)
					break
				}
				i--
			}
			break
		}
		while (i > -1) {
			if (!lines[i].length) {
				break
			}
			const character2 = indexOfNonWhiteSpace(lines[i])
			const preStr2 = lines[i].slice(0,character2)
			if (preStr1 !== preStr2) {
				break
			}

			const position = new vscode.Position(i, new_character)
			newSelections.push(new vscode.Selection(position,position))
			i--
		}
		if (newSelections.length) {
			activeEditor.selections = newSelections
			vscode.commands.executeCommand("revealLine", {lineNumber: i, at: 'top'})
		}

	}))
	context.subscriptions.push(vscode.commands.registerCommand('multicursor-insanity.groupBelow', function () {
		const activeEditor = vscode.window.activeTextEditor
		const selections = activeEditor.selections
		selections.sort((a,b) => a.end.line - b.end.line)

		const documentText = activeEditor.document.getText()
		const lines = documentText.split('\n')

		const endLine = selections[selections.length - 1].end.line
		let i = endLine
		const newSelections=[]

		let new_character = selections[selections.length - 1].end.character
		let character1 = indexOfNonWhiteSpace(lines[i])
		let preStr1

		while (true) {
			if (character1 > -1) {
				if (i + 1 < lines.length) {
					const character2 = indexOfNonWhiteSpace(lines[i + 1])
					if (character2 > -1) {
						new_character = character2
						preStr1 = lines[endLine].slice(0,character1)
						const preStr2 = lines[i + 1].slice(0,character2)
						if (preStr1 === preStr2) {
							const position1 = new vscode.Position(i, new_character)
							newSelections.push(new vscode.Selection(position1,position1))
						} else {
							preStr1 = preStr2
							character1 = character2
						}
						const position2 = new vscode.Position(i + 1, new_character)
						newSelections.push(new vscode.Selection(position2,position2))
						i+=2
						break
					}

				}
			}
			i++
			while (i < lines.length) {
				character1 = indexOfNonWhiteSpace(lines[i])
				if (character1 > -1) {
					// endChar = Math.max(endChar, character1)
					new_character = character1
					preStr1 = lines[i].slice(0,character1)
					break
				}
				i++
			}
			break
		}
		while (i < lines.length) {
			if (!lines[i].length) {
				break
			}
			const character2 = indexOfNonWhiteSpace(lines[i])
			const preStr2 = lines[i].slice(0,character2)
			if (preStr1 !== preStr2) {
				break
			}

			const position = new vscode.Position(i, new_character)
			newSelections.push(new vscode.Selection(position,position))
			i++
		}
		if (newSelections.length) {
			activeEditor.selections = newSelections
			vscode.commands.executeCommand("revealLine", {lineNumber: i, at: 'bottom'})
		}
	}))

	context.subscriptions.push(vscode.commands.registerCommand('multicursor-insanity.copyAbove', async function () {
		const activeEditor = vscode.window.activeTextEditor
		const selections = activeEditor.selections
		selections.sort((a,b) => a.end.line - b.end.line)

		const line1 = activeEditor.document.lineAt(selections[0].start.line).text;

		const character1 = indexOfNonWhiteSpace(line1)
		const preStr1 = line1.slice(0,character1)

		const start = selections[0].start.line
		const toJoin = []
		for (let i = 0; i < selections.length; i++) {
			toJoin.push(preStr1)
			toJoin.push(activeEditor.document.lineAt(i + start).text.slice(selections[i].start.character, selections[i].end.character))
			toJoin.push("\n")
		}
		toJoin.push("\n")

		await activeEditor.edit((editBuilder) => {
			editBuilder.insert(new vscode.Position(selections[0].start.line, 0), toJoin.join(''))
		});

		const newSelections=[]
		for (let i = 0; i < selections.length; i++) {
			const len = selections[i].end.character - selections[i].start.character
			newSelections.push(new vscode.Selection(new vscode.Position(start + i, character1), new vscode.Position(start + i, character1 + len)))
		}
		activeEditor.selections = newSelections

	}))
	context.subscriptions.push(vscode.commands.registerCommand('multicursor-insanity.copyBelow', async function () {
		const activeEditor = vscode.window.activeTextEditor
		const selections = activeEditor.selections
		selections.sort((a,b) => a.end.line - b.end.line)

		const line1 = activeEditor.document.lineAt(selections[0].start.line).text;

		const character1 = indexOfNonWhiteSpace(line1)
		const preStr1 = line1.slice(0,character1)

		const start = selections[0].start.line
		const toJoin = []
		toJoin.push("\n")
		for (let i = 0; i < selections.length; i++) {
			toJoin.push("\n")
			toJoin.push(preStr1)
			toJoin.push(activeEditor.document.lineAt(i + start).text.slice(selections[i].start.character, selections[i].end.character))
		}

		const endLine = selections[selections.length - 1].end.line
		const offset = endLine + 2

		await activeEditor.edit((editBuilder) => {
			editBuilder.insert(new vscode.Position(endLine, activeEditor.document.lineAt(endLine).text.length), toJoin.join(''))
		});

		const newSelections=[]
		for (let i = 0; i < selections.length; i++) {
			const len = selections[i].end.character - selections[i].start.character
			newSelections.push(new vscode.Selection(new vscode.Position(i + offset, character1), new vscode.Position(i + offset, character1 + len)))
		}
		activeEditor.selections = newSelections

		vscode.commands.executeCommand("revealLine", {lineNumber: selections.length + offset, at: 'bottom'})
	}))
	function indexOfNonWhiteSpace(str) {
		for (let j = 0; j < str.length; j++) {
			if (str[j] !== " " && str[j] !== "\t") {
				return j
			}
		}
		return -1
	}
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
