import { IButtonComponentProps, Button } from "ave-react";
import React from "react";

export interface IRecognizeButton {
	isLoading: boolean;
	recognizing: boolean;
	error: boolean;
	onRecognize: IButtonComponentProps["onClick"];
}

export function RecognizeButton(props: IRecognizeButton) {
	const { isLoading, recognizing, error, onRecognize } = props;
	let text = "";
	if (error) {
		text = "Init Failed!";
	} else {
		if (isLoading) {
			text = "Loading ...";
		} else {
			if (recognizing) {
				text = "Wait ...";
			} else {
				text = "Recognize";
			}
		}
	}

	const enable = !error && !isLoading && !recognizing;
	return <Button text={text} enable={enable} onClick={onRecognize}></Button>;
}
