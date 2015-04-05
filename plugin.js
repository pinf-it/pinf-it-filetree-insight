
const FSWALKER = require("./fswalker");


exports.for = function (API) {


    function indexDirectory (path) {
        var walker = new FSWALKER.Walker(path);
        var opts = {};
        opts.returnIgnoredFiles = false;
        opts.includeDependencies = false;
        opts.respectDistignore = true;
        opts.respectNestedIgnore = true;
        opts.excludeMtime = true;            
        return API.Q.nbind(walker.walk, walker)(opts).then(function (fileinfo) {
            return {
                paths: fileinfo[0],
                summary: fileinfo[1],
                hash: API.CRYPTO.createHash("md5").update(JSON.stringify(fileinfo[0])).digest("hex")
            };
        });
    }


	var exports = {};

	exports.resolve = function (resolver, config, previousResolvedConfig) {
		return resolver({}).then(function (resolvedConfig) {

            return indexDirectory(API.programDescriptor.getBootPackagePath()).then(function (info) {

                resolvedConfig.paths = info.paths;
                resolvedConfig.summary = info.summary;
                resolvedConfig.hash = info.hash;

            }).then(function () {
                return resolvedConfig;
            });
		});
	}

	exports.turn = function (resolvedConfig) {

//console.log("TURN FILETREE INSIGHT", resolvedConfig);

// TODO: Now that an mtime/size has changed we re-compute the hashes for the changed files.

	}

	exports.spin = function (resolvedConfig) {

        function triggerIndex () {
            return indexDirectory(API.programDescriptor.getBootPackagePath());
        }


        if (resolvedConfig.watch) {

            var currentFiles = JSON.stringify(resolvedConfig.paths);

            setInterval(function () {
                return triggerIndex().then(function (info) {

                    if (JSON.stringify(info.paths) !== currentFiles) {

console.log("FILE CHANGED!!!!!!!");

                    }

                }).fail(function (err) {
                    console.error(err.stack);
                });
            }, 1000);
        }
	}

	return exports;
}

