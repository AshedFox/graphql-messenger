import {Arg, Mutation, Resolver} from "type-graphql";
import {File} from "../enitities/File";
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import {FileUpload} from 'graphql-upload/Upload.js';
import {FileService} from "../../services/fileService";


@Resolver(File)
export class FileResolver {
    private readonly fileService: FileService;

    constructor() {
        this.fileService = new FileService();
    }

    @Mutation(() => File)
    async singleUpload(@Arg("file", () => GraphQLUpload) file: FileUpload): Promise<File> {
        const result = await this.fileService.createFile(file);

        if (!result) {
            throw new Error("Failed to upload file");
        }

        return result;
    }

    @Mutation(() => [File])
    async multipleUpload(@Arg("files", () => [GraphQLUpload]) files: FileUpload[]): Promise<File[]> {
        const result: File[] = [];

        for (const file of files) {
            result.push(await this.singleUpload(file));
        }

        return result;
    }
}
