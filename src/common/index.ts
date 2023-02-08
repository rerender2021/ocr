import path from "path";
import { readFile } from "fs/promises";
import { getAppContext } from "ave-react";
import { AveGetClipboard, ImageContainerType, AveImage } from "ave-ui";

export function assetsPath(name: string) {
	const root = path.resolve(__dirname, "../../assets");
	return path.resolve(root, `./${name}`);
}

export function getClipboardContent() {
	const clipboard = AveGetClipboard();
	if (clipboard.HasImage()) {
		const aveImage = clipboard.GetImage();
		return aveImage;
	} else if (clipboard.HasFile()) {
		const [filePath] = clipboard.GetFile();
		if (filePath && ["png", "jpg", "jpeg"].some((extension) => filePath.endsWith(extension))) {
			return filePath;
		}
	}

	return "";
}

export async function getImageBuffer(src: string | AveImage) {
	let buffer: Buffer = null;
	if (typeof src === "string") {
		buffer = await readFile(src);
	} else {
		const codec = getAppContext().imageCodec;
		const arrayBuffer = codec.SaveArrayBuffer(src, ImageContainerType.PNG);
		buffer = Buffer.from(arrayBuffer);
	}
	return buffer;
}
