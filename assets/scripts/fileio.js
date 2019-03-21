var fileIO = (function () {
	'use strict';

	var module;
	var $link;

	var ReadMethods = {
		TEXT: 'readAsText',
		DATA_URL: 'readAsDataURL'
	};

	module = {
		save: {
			data: function (data, filename, type) {
				// Construct a Blob and download it
				var blob;

				blob = new Blob(
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
				var url;

				if (navigator.msSaveBlob) {
					navigator.msSaveBlob(blob, filename);
				} else {
					url = URL.createObjectURL(blob);
					module.save._downloadDataUrl(url, filename);
				}
			},

			file: function (file, filename) {
				var reader;

				if (navigator.msSaveBlob) {
					navigator.msSaveBlob(file, filename);
				} else {
					reader = new FileReader();

					reader.readAsDataURL(file);
					reader.addEventListener('load', module.save._processedFile(filename));
				}
			},

			csv: function (data, filename, transpose) {
				var rows = [];
				var row;

				var fileString;

				var i;
				var j;

				if (transpose) {
					// Flip rows and columns
					for (i = 0; i < data[0].length; i++) {
						row = [];
						for (j = 0; j < data.length; j++) {
							row.push(data[j][i]);
						}
						rows.push(row);
					}
				} else {
					rows = data;
				}

				for (i = 0; i < rows.length; i++) {
					rows[i] = rows[i].join(',');
				}
				rows = rows.join('\n');

				filename = module.save._extendFilename(filename, 'csv');
				module.save.data(rows, filename, 'text/csv');
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
				var testPattern = new RegExp('\\.' + extension + '$');

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

				var $fileInput = document.createElement('input');

				$fileInput.type = 'file';
				$fileInput.addEventListener('change', module.load._loadSelectedFile($fileInput, fileLoadedCallback, readMethod));

				$fileInput.click();
			},

			_loadSelectedFile: function ($fileInput, fileLoadedCallback, readMethod) {
				return function (e) {
					var file = $fileInput.files[0];
					var reader = new FileReader();

					reader.onload = module.load._fileLoaded(fileLoadedCallback);
					reader[readMethod](file);
				};
			},

			_fileLoaded: function (fileLoadedCallback) {
				return function (e) {
					var reader = e.target;

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
