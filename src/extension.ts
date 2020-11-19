import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from 'constants';
import { randomInt } from 'crypto';
import { stringify } from 'querystring';
import * as vscode from 'vscode';

let numberOptions = ["random", "increasing", "decreasing", "scale", "inverseScale"]

enum NumberStringType {
    Random = 0,
    Increasing = 1,
    Decreasing = 2,
    Scale = 3,
    InverseScale = 4
}

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
        }, () => { });
        val.then((length: number) => {
            const input2 = vscode.window.showQuickPick(numberOptions);
            const option: Thenable<NumberStringType> = input2.then((value: string | undefined) => {
                if (value != undefined) {
                    return stringToNumberStringType(value);
                } else {
                    return NumberStringType.Random
                }
            }, () => { })
            option.then((type: NumberStringType) => {
                if (length == NaN || length <= 0) {
                    vscode.window.showErrorMessage("Input is not a valid number");
                    return;
                }

                vscode.window.showWarningMessage(`Inserted number string at cursor`);
                vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(`${generateNumberString(length, type)}`));
            }, () => { })
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
            const input2 = vscode.window.showQuickPick(numberOptions);
            const option: Thenable<NumberStringType> = input2.then((value: string | undefined) => {
                if (value != undefined) {
                    return stringToNumberStringType(value);
                } else {
                    return NumberStringType.Random
                }
            }, () => { })
            option.then((type: NumberStringType) => {
                if (content.length == 0) {
                    vscode.window.showErrorMessage("Dreamwiki textbox: Content size of 0");
                    return;
                }
                vscode.window.showInformationMessage("Inserted textbox at cursor");
                vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(`${generateTextBox(content,type)}`));
            }, () => { })
        }, () => { });
    });

    context.subscriptions.push(generateNumberCommand);
    context.subscriptions.push(generateTextBoxCommand);
}

function generateTextBox(content: string, type = NumberStringType.Random): string {
    let upper = generateNumberString(content.length + 4, type);
    let lower = generateNumberString(content.length + 4, type);
    let borderL = upper.charAt(0);
    let borderR = lower.charAt(lower.length - 1);
    return `${upper}\n${borderL} ${content} ${borderR}\n${lower}`;
}

function generateNumberString(length: number, type = NumberStringType.Random): string {
    switch (type) {
        case NumberStringType.Decreasing: {
            return generateDecreasingNumberString(length);
        }
        case NumberStringType.Increasing: {
            return generateIncreasingNumberString(length);
        }
        case NumberStringType.Scale: {
            return generateScaleNumberString(length);
        }
        case NumberStringType.InverseScale: {
            return generateInverseScaleNumberString(length);
        }
        default: {
            return generateRandomNumberString(length);
        }
    }
}

function generateRandomNumberString(length: number): string {
    var str = "";
    for (let i = 0; i < length; i++) {
        str += Math.floor(Math.random() * 10)
    }
    return str;
}

function generateIncreasingNumberString(length: number): string {
    var str = "";
    const inc = 10 / length
    for (let cn = 0; cn < 10; cn += inc) {
        str += Math.floor(cn);
    }
    return str.substr(0, length);
}

function generateDecreasingNumberString(length: number): string {
    var str = "";
    const inc = 9 / length
    for (let cn = 9; cn >= 0; cn -= inc) {
        str += Math.floor(cn);
    }
    return str.substr(0, length);
}

function generateScaleNumberString(length: number): string {
    let first = Math.floor(length / 2);
    let second = length - first;
    return generateIncreasingNumberString(first) + generateDecreasingNumberString(second);
}

function generateInverseScaleNumberString(length: number): string {
    let first = Math.floor(length / 2);
    let second = length - first;
    return generateDecreasingNumberString(first) + generateIncreasingNumberString(second);
}

function stringToNumberStringType(str: string): NumberStringType {
    switch (str) {
        case "increasing": return NumberStringType.Increasing;
        case "decreasing": return NumberStringType.Decreasing;
        case "scale": return NumberStringType.Scale;
        case "inverseScale": return NumberStringType.InverseScale;
        default: return NumberStringType.Random;
    }
}