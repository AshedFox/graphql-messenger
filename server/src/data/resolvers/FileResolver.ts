import {Arg, Mutation, Resolver} from "type-graphql";
import {File} from "../enitities/File";
import {FileUpload, GraphQLUpload} from "graphql-upload";
import fileService from "../../services/fileService";


@Resolver(File)
export class FileResolver {
    @Mutation(() => File)
    async singleUpload(@Arg("file", () => GraphQLUpload) file: FileUpload): Promise<File> {
        const result = await fileService.createFile(file);

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
