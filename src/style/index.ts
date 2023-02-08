import { ICodeEditorStyle, StyleIndex } from "ave-react";
import { Vec4, CodeEditorMarginType } from "ave-ui";

export const editorStyle: ICodeEditorStyle = {
	defaultVisualStyle: {
		textColor: new Vec4(170, 180, 180, 255),
	},
	defaultFontStyle: {
		size: 14,
	},
	lineNumberFontStyle: {
		size: 14,
	},
	lineNumberVisualStyle: {
		textColor: new Vec4(50, 150, 200, 255),
	},
	editorMargin: {
		type: CodeEditorMarginType.LineNumber,
		styleIndex: StyleIndex.LineNumber,
	},
	caretColor: new Vec4(255, 255, 255, 255 * 0.75),
};
