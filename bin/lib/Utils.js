"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const util = require("util");
class Utils {
    static enumFiles(dir, ...exts) {
        return __awaiter(this, void 0, void 0, function* () {
            let filenames;
            try {
                filenames = (yield util.promisify(fs.readdir)(dir));
            }
            catch (ex) {
                throw new Error(`enumFiles(${dir}): error while listing the dir: ${ex}`);
            }
            return (yield Promise.all(filenames.map((filename) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const extname = path.extname(filename).toLowerCase();
                    if (exts.length <= 0 ? true : exts.length <= 1 ? exts[0] === extname : exts.includes(extname)) {
                        const filepath = path.join(dir, filename);
                        const filestat = yield util.promisify(fs.stat)(filepath);
                        if (filestat.isFile() || filestat.isSymbolicLink()) {
                            return filepath;
                        }
                    }
                }
                catch (ex) {
                    throw new Error(`enumFiles(${dir}): error while processing file ${filename}: ${ex}`);
                }
            })))).filter(v => !!v);
        });
    }
}
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map