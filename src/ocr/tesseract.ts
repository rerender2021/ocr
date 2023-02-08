import path from "path";
import { createWorker } from "tesseract.js";
import { IOcrEngine, IOcrEngineOptions, IOcrResult } from "./base";

export class TesseractEngine implements IOcrEngine {
	private worker: Tesseract.Worker;

	constructor(options: IOcrEngineOptions) {
		const { onRecognize, onError } = options;
		this.worker = createWorker({
			langPath: path.resolve(__dirname, "../../lang-data"),
			logger: (m) => {
				// console.log(m);
				if (m.status === "recognizing text") {
					onRecognize?.(m.progress);
				}
			},
			errorHandler: (arg) => {
				console.error(arg);
				onError?.(arg);
			},
		});
	}

	async init() {
		await this.worker.load();
		await this.worker.loadLanguage("eng+chi_sim");
		await this.worker.initialize("eng+chi_sim");
	}

	async destroy() {
		console.log("TesseractEngine: before destroy");
		await this.worker.terminate();
		console.log("TesseractEngine: after destroy");
	}

	async recognize(buffer: Buffer): Promise<IOcrResult> {
		console.time("ocr time");
		const { data } = await this.worker.recognize(buffer);
		console.log(`ocr result: \n`, data.text);
		console.timeEnd("ocr time");
		return { text: data.text };
	}
}
