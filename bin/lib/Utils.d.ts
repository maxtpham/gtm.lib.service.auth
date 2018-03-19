import { AttachmentView } from "@gtm/lib.service";
export declare class Utils {
    static enumFiles(dir: string, ...exts: string[]): Promise<string[]>;
    static fetchPhoto(url: string): Promise<AttachmentView>;
}
