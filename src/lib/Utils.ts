import * as path from "path";
import * as fs from "fs";
import * as util from "util";
import * as request from 'request';
import { AttachmentView } from "@gtm/lib.service";
import { Binary } from "bson";

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

    public static async fetchPhoto(url: string): Promise<AttachmentView> {
        return new Promise<AttachmentView>((resolve, reject) => {
            request({ url, encoding: null }, function (error, response, body) {
                if (!!error) {
                    reject(error);
                } else {
                    if (body && response.statusCode < 300 && response.headers['content-type']) {
                        resolve(<AttachmentView>{ media: response.headers['content-type'], data: new Binary(body, Binary.SUBTYPE_BYTE_ARRAY) })
                    } else {
                        reject(new Error(`Fetch photo error from ${url}: ${response.statusCode}-${response.statusMessage}`));
                    }
                }
            });
        });
    }
}