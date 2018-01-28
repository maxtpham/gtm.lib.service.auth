import * as path from "path";
import * as fs from "fs";
import * as util from "util";

export class Utils {
    public static async enumFiles(dir: string, ...exts: string[]): Promise<string[]> {
        let filenames: string[];
        try {
            filenames = (await util.promisify(fs.readdir)(dir));
        } catch (ex) {
            throw new Error(`enumFiles(${dir}): error while listing the dir: ${ex}`);
        }

        return (await Promise.all(filenames.map(async filename => {
            try {
                const extname = path.extname(filename).toLowerCase();
                if (exts.length <= 0 ? true : exts.length <= 1 ? exts[0] === extname : (<any>exts).includes(extname)) {
                    const filepath = path.join(dir, filename);
                    const filestat = await util.promisify(fs.stat)(filepath);
                    if (filestat.isFile() || filestat.isSymbolicLink()) {
                        return filepath;
                    }
                }
            } catch (ex) {
                throw new Error(`enumFiles(${dir}): error while processing file ${filename}: ${ex}`);
            }
        }))).filter(v => !!v);
    }
}