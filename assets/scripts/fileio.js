const fileIO = (function () {
	let $link;

	const ReadMethods = {
		TEXT: 'readAsText',
		DATA_URL: 'readAsDataURL'
	};

	const module = {
		save: {
			data: function (data, filename, type) {
				// Construct a Blob and download it
				let blob = new Blob(
					[data],
					{
						type: type || 'text/plain'
					}
				);

				module.save.blob(blob, filename);
			},

			json: function (data, filename) {
				try {
					if (typeof data !== 'string') {
						data = JSON.stringify(data);
					}

					filename = module.save._extendFilename(filename, 'json');
					module.save.data(data, filename, 'application/json');
				} catch (e) {
					console.error(e);
				}
			},

			blob: function (blob, filename) {
				if (navigator.msSaveBlob) {
					navigator.msSaveBlob(blob, filename);
				} else {
					let url = URL.createObjectURL(blob);
					module.save._downloadDataUrl(url, filename);
				}
			},

			file: function (file, filename) {
				if (navigator.msSaveBlob) {
					navigator.msSaveBlob(file, filename);
				} else {
					let reader = new FileReader();

					reader.readAsDataURL(file);
					reader.addEventListener('load', module.save._processedFile(filename));
				}
			},

			csv: function (data, filename, transpose, sanitise) {
				let rows = module.save._csvPrepareData(data, transpose, sanitise);

				filename = module.save._extendFilename(filename, 'csv');
				module.save.data(rows, filename, 'text/csv');
			},

			_csvPrepareData: function (data, transpose, sanitise) {
				let rows = module.save._csvShapeData(data, transpose);
				rows = module.save._csvEscape(rows, sanitise);

				for (let i = 0; i < rows.length; i++) {
					rows[i] = rows[i].join(',');
				}
				rows = rows.join('\n');

				return rows;
			},

			_csvShapeData: function (data, transpose) {
				// Pad empty cells with empty strings and,
				// if necessary, transpose the data

				let maxLength = 0;
				for (let i = 0; i < data.length; i++) {
					let row = data[i];

					maxLength = Math.max(maxLength, row.length);
				}

				// Flip rows and columns if transposing data
				let iMax = transpose ? maxLength : data.length;
				let jMax = transpose ? data.length : maxLength;

				let rows = [];
				for (let i = 0; i < iMax; i++) {
					let row = [];
					for (let j = 0; j < jMax; j++) {
						let cellValue = transpose ? data[j][i] : data[i][j];

						if (typeof cellValue === 'undefined') {
							cellValue = '';
						}

						row.push(cellValue);
					}
					rows.push(row);
				}

				return rows;
			},

			_csvEscape: function (rows, sanitise) {
				// Make sure any cells containing " or , are escaped appropriately

				for (let i = 0; i < rows.length; i++) {
					let row = rows[i];

					for (let j = 0; j < row.length; j++) {
						if (typeof row[j] === 'undefined') {
							row[j] = '';
						} else if (typeof row[j] !== 'string') {
							// Convert to string
							row[j] = '' + row[j];
						}

						if (sanitise) {
							// Prevent spreadsheet software like
							// Excel from trying to execute code
							if (row[j].match(/^[=\-+@]/)) {
								row[j] = '\t' + row[j];
							}
						}

						if (row[j].match(/,|"|\n/)) {

							// Turn any double quotes into escaped double quotes
							row[j] = row[j].replace(/"/g, '""');

							// Wrap cell in double quotes
							row[j] = '"' + row[j] + '"';
						}
					}
				}

				return rows;
			},

			_processedFile: function (filename) {
				// Callback for FileReader load event
				return function () {
					module.save._downloadDataUrl(this.result, filename);
				};
			},

			_downloadDataUrl: function (dataUrl, filename) {
				$link = $link || document.createElement('a');
				$link.href = dataUrl;
				$link.download = filename;
				$link.click();

				URL.revokeObjectURL(dataUrl);
			},

			_extendFilename: function (filename, extension) {
				let testPattern = new RegExp('\\.' + extension + '$');

				if (!testPattern.test(filename)) {
					filename += '.' + extension;
				}

				return filename;
			}
		},

		load: {
			text: function (fileLoadedCallback) {
				module.load._file(fileLoadedCallback, ReadMethods.TEXT);
			},

			image: function (fileLoadedCallback) {
				module.load._file(fileLoadedCallback, ReadMethods.DATA_URL);
			},

			_file: function (fileLoadedCallback, readMethod) {
				// Create a file input, and use it to prompt the user to select a file.
				// Once a file is selected, pass it to fileLoadedCallback

				let $fileInput = document.createElement('input');

				$fileInput.type = 'file';
				$fileInput.addEventListener('change', module.load._loadSelectedFile($fileInput, fileLoadedCallback, readMethod));

				$fileInput.click();
			},

			_loadSelectedFile: function ($fileInput, fileLoadedCallback, readMethod) {
				return function (e) {
					let file = $fileInput.files[0];
					let reader = new FileReader();

					reader.onload = module.load._fileLoaded(fileLoadedCallback);
					reader[readMethod](file);
				};
			},

			_fileLoaded: function (fileLoadedCallback) {
				return function (e) {
					let reader = e.target;

					if (reader.readyState === 2) {
						// DONE
						fileLoadedCallback(reader.result);
					}
				};
			}
		}
	};

	return {
		save: {
			data: module.save.data,
			json: module.save.json,
			blob: module.save.blob,
			file: module.save.file,
			csv: module.save.csv
		},
		load: {
			text: module.load.text,
			image: module.load.image
		}
	};
})();

export default fileIO;
