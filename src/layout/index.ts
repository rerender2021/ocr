export const containerLayout = {
	columns: `16dpx 1 16dpx 1 16dpx 192dpx 16dpx`,
	rows: `1`,
	areas: {
		image: { row: 0, column: 1 },
		text: { row: 0, column: 3 },
		control: { row: 0, column: 5 },
	},
};

export const controlLayout = {
	columns: `1`,
	rows: `16dpx 32dpx 32dpx 4dpx 1 32dpx 4dpx 150dpx`,
	areas: {
		recognize: { row: 5, column: 0 },
		progressLabel: { row: 1, column: 0 },
		progress: { row: 2, column: 0 },
	},
};
