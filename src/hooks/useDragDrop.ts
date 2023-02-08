import { getAppContext } from "ave-react";
import { useEffect, useState } from "react";
import { DragDropImage, DropBehavior } from "ave-ui";

export function useDragDrop(onPathChange?: (path: string) => void) {
	const [path, setPath] = useState("");

	useEffect(() => {
		const context = getAppContext();
		const window = context.getWindow();

		window.OnDragMove((sender, dc) => {
			if (1 === dc.FileGetCount() && ["png" /*, "jpg", "jpeg"*/].some((extension) => dc.FileGet()[0].toLowerCase().endsWith(extension))) {
				dc.SetDropTip(DragDropImage.Copy, "Open this file");
				dc.SetDropBehavior(DropBehavior.Copy);
			}
		});

		window.OnDragDrop((sender, dc) => {
			const filePath = dc.FileGet()[0];
			setPath(path);
			onPathChange?.(filePath ?? "");
		});
	}, []);

	return { path };
}
