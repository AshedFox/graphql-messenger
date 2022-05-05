import {FieldResolver, Resolver, Root} from "type-graphql";
import {MessageFile} from "../enitities/MessageFile";
import {File} from "../enitities/File";
import {Message} from "../enitities/Message";

@Resolver(MessageFile)
export class MessageFileResolver {
    @FieldResolver(() => Message)
    async message(@Root() messageFile: MessageFile): Promise<Message | null> {
        return await Message.findOne({where: {id: messageFile.messageId}, withDeleted: true});
    }

    @FieldResolver(() => File)
    async file(@Root() messageFile: MessageFile): Promise<File | null> {
        return await File.findOne({where: {id: messageFile.fileId}, withDeleted: true});
    }
}
