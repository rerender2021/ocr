import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AveRenderer, Grid, Window, CodeEditor, IButtonComponentProps, getAppContext, IIconResource, Progress, Label, ICodeEditorComponentProps, IWindowComponentProps } from "ave-react";
import { AveImage, Picture as NativePicture, App, ThemePredefined_Dark, StretchMode, AveGetClipboard, CodeEditor as NativeEditor } from "ave-ui";
import { TesseractEngine } from "./ocr";
import { IImageView, ImageView, RecognizeButton } from "./components";
import { getClipboardContent, getImageBuffer } from "./common";
import { containerLayout, controlLayout } from "./layout";
import { useDragDrop, useHotKey } from "./hooks";
import { iconResource } from "./resource";
import { debounce } from "debounce";
import { editorStyle } from "./style";

function onInit(app: App) {
	const context = getAppContext();
	context.setIconResource(iconResource as unknown as IIconResource);
}

function initTheme() {
	const context = getAppContext();
	const themeImage = context.getThemeImage();
	const themeDark = new ThemePredefined_Dark();
	themeDark.SetStyle(themeImage, 0);
}

export function OCR() {
	// const defaultSrc = assetsPath("chi_sim.png");
	const defaultSrc = "";
	const [src, setSrc] = useState<string | AveImage>(defaultSrc);
	useDragDrop((path) => setSrc(path));

	const [ocrText, setOcrText] = useState<string>("");
	const refEditor = useRef<NativeEditor>(null);
	const onInitEditor = useCallback<ICodeEditorComponentProps["onInit"]>((editor) => {
		refEditor.current = editor;
	}, []);

	const refPicture = useRef<NativePicture>();
	const onLoadImage = useCallback<IImageView["onLoadImage"]>((byo2, data, picture) => {
		refPicture.current = picture;
	}, []);

	//
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [recognizing, setRecognizing] = useState(false);

	const ocrEngine = useMemo(
		() =>
			new TesseractEngine({
				onRecognize: (progress) => {
					console.log(`onRecognize, progress: ${progress}`);
					setProgress(progress);
				},
				onError: (message) => {
					setError(true);
				},
			}),
		[]
	);

	const onRecognize: IButtonComponentProps["onClick"] = debounce(
		async (sender) => {
			if (!src || recognizing) {
				return;
			}
			try {
				setProgress(0);
				setRecognizing(true);
				const buffer = await getImageBuffer(src);
				const result = await ocrEngine.recognize(buffer);
				setOcrText(result.text);
			} catch (error) {
				console.error(`recognize failed: `, error);
			} finally {
				setProgress(1);
				setRecognizing(false);
			}
		},
		500,
		true
	);

	const onPaste = useCallback<IButtonComponentProps["onClick"]>(() => {
		const content = getClipboardContent();
		console.log(`clipboard content: `, content);
		if (content) {
			setSrc(content);
		}
	}, []);

	const onCopy = useCallback<IButtonComponentProps["onClick"]>(() => {
		const clipboard = AveGetClipboard();
		const doc = refEditor?.current.DocGet();
		if (doc) {
			const length = doc.GetLength();
			const text = doc.CharGet(0, length);
			clipboard.SetText(text);
			console.log("onCopy: \n", text);
		}
	}, []);

	const onClose = useCallback<IWindowComponentProps["onClose"]>(() => {
		ocrEngine.destroy();
	}, []);

	useHotKey({
		paste: onPaste,
		copy: onCopy,
	});

	useEffect(() => {
		initTheme();

		ocrEngine
			.init()
			.then(() => {
				setIsLoading(false);
				setError(false);
			})
			.catch(() => {
				setError(true);
			});
	}, []);

	return (
		<Window title="OCR" onInit={onInit} onClose={onClose}>
			<Grid style={{ layout: containerLayout }}>
				<Grid style={{ area: containerLayout.areas.image }}>
					<ImageView src={src} onLoadImage={onLoadImage} stretchMode={StretchMode.Fit}></ImageView>
				</Grid>
				<Grid style={{ area: containerLayout.areas.text }}>
					<CodeEditor text={ocrText} readonly style={editorStyle} onInit={onInitEditor}></CodeEditor>
				</Grid>
				<Grid style={{ area: containerLayout.areas.control, layout: controlLayout }}>
					<Grid style={{ area: controlLayout.areas.progress }}>
						<Progress value={Math.floor(progress * 100)} animation></Progress>
					</Grid>
					<Grid style={{ area: controlLayout.areas.progressLabel }}>
						<Label text={progress === 0 ? "progress" : `progress: ${(progress * 100).toFixed(1)}%`}></Label>
					</Grid>
					<Grid style={{ area: controlLayout.areas.recognize }}>
						<RecognizeButton isLoading={isLoading} recognizing={recognizing} error={error} onRecognize={onRecognize}></RecognizeButton>
					</Grid>
				</Grid>
			</Grid>
		</Window>
	);
}

AveRenderer.render(<OCR />);
