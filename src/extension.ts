import { randomInt } from 'crypto';
import { stringify } from 'querystring';
import * as vscode from 'vscode';

// this is called when first activated
export function activate(context: vscode.ExtensionContext) {
    console.log("dreamwiki extension activated");

    //TODO: add in hover text(?)

    /*generate number command*/
    const generateNumberCommand = vscode.commands.registerCommand("dreamwiki.generateNumbers", () => {
        const input = vscode.window.showInputBox({ "prompt": "Length of number string" }, undefined);
        const val = input.then((value: string | undefined) => {
            if (value != undefined) {
                return parseInt(value as string);
            } else {
                return 0
            }
        }, () => 0);
        val.then((length: number) => {
            if (length == NaN || length <= 0) {
                vscode.window.showErrorMessage("Input is not a valid number");
                return;
            }
            vscode.window.showWarningMessage(`Inserted number string at cursor`);
            vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(`${generateNumberString(length)}`));
        }, () => { });
    });

    const generateTextBoxCommand = vscode.commands.registerCommand("dreamwiki.generateTextBox", () => {
        const input = vscode.window.showInputBox({ "prompt": "Textbox content" }, undefined);
        const val = input.then((value: string | undefined) => {
            if (value != undefined) {
                return value;
            } else {
                return "";
            }
        }, () => "");
        val.then((content: string) => {
            if (content.length == 0) {
                vscode.window.showErrorMessage("Dreamwiki textbox: Content size of 0");
            }
            vscode.window.showInformationMessage("Inserted textbox at cursor");
            vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(`${generateTextBox(content)}`));
        }, () => { });
    });

    context.subscriptions.push(generateNumberCommand);
    context.subscriptions.push(generateTextBoxCommand);
}

function generateTextBox(content: string): string {
    let upper = generateNumberString(content.length+4);
    let lower = generateNumberString(content.length+4);
    let border = generateNumberString(1);
    return `${upper}\n${border} ${content} ${border}\n${lower}`;
}

function generateNumberString(length: number): string {
    var str = "";
    for (let i = 0; i < length; i++) {
        str+= Math.floor(Math.random()*10)
    }
    return str;
}