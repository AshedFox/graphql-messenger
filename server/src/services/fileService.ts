import {UploadApiResponse, v2} from "cloudinary";
import {FileUpload} from "graphql-upload";
import {FileType} from "../data/enitities/FileType";
import {v4} from "uuid";
import {Stream} from "stream";
import {File} from "../data/enitities/File";


class FilesService {
    createFile = async (file: FileUpload) => {
        const fileType = this.defineFileType(file.mimetype);
        const uploadResult = await this.uploadFile(file.createReadStream(), fileType);

        if (!uploadResult) {
            return null;
        }

        return await File.create({
            type: fileType,
            originalName: uploadResult.original_filename,
            url: uploadResult.url,
            size: uploadResult.bytes
        }).save();
    }

    private defineFileType = (mimetype: string) => {
        if (mimetype.startsWith("image")) {
            return FileType.IMAGE;
        } else if (mimetype.startsWith("video")) {
            return FileType.VIDEO;
        }

        return FileType.RAW;
    }
    private uploadFile = (stream: Stream, type: FileType) => {
        return new Promise<UploadApiResponse | null>((resolve, reject) => {
            const uploadStream = v2.uploader.upload_stream({
                public_id: v4(),
                folder: "graphql-messenger",
                resource_type: type,
            }, (err, res) => {
                if (res) {
                    resolve(res);
                } else {
                    reject(err);
                }
            });

            stream.pipe(uploadStream);
        })
    }
}

export default new FilesService();
