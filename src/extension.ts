import * as vscode from 'vscode';

const specialText = "DBSTART|4e58eb22-829d-462d-8319-7d35ff84df67|2|@|BEGIN|2|@|OUT_START|3|@|";

function convertTextToCSV(text: string): string {
    // Remove the unwanted starting text
    const cleanedText = text.slice(specialText.length);

    // Remove everything after OUT_END
    const endIndex = cleanedText.indexOf('OUT_END');
    const csvText = endIndex !== -1 ? cleanedText.substring(0, endIndex) : cleanedText;

    // Remove trailing |
    const trimmedText = csvText.trim();

    // Replace separator and line ending
    const formattedText = trimmedText
        .replace(/\|#\|/g, '\n')
        .replace(/\|\^\|/g, ',');

    return formattedText;
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('boomi-db-to-csv-document-converter.convertToCSV', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const text = document.getText(); // Get entire content of the document

            const csvText = convertTextToCSV(text);

            editor.edit(editBuilder => {
                const wholeDocumentRange = new vscode.Range(
                    document.positionAt(0),
                    document.positionAt(text.length)
                );
                editBuilder.replace(wholeDocumentRange, csvText);
            });

            vscode.window.showInformationMessage('Converted text to CSV');
            
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
