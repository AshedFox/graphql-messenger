import {registerEnumType} from "type-graphql";

export enum FileType {
    RAW = "raw",
    IMAGE = "image",
    VIDEO = "video",

}

registerEnumType(FileType, {
    name: "FileType"
})
