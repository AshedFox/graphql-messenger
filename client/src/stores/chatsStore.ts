import {computed, makeAutoObservable} from "mobx";
import {createContext, useContext} from "react";
import {ChatModel, ChatUserModel, FullChatModel, MessageModel,} from "../types/models";

class ChatsStore {
    chats: ChatModel[] = [];
    chatsMessages: Map<string, MessageModel[]> = new Map<string, MessageModel[]>();
    chatsUsers: Map<string, ChatUserModel[]> = new Map<string, ChatUserModel[]>();
    selectedChatId?: string;
    isSearch: boolean = false;
    searchChats: ChatModel[] = [];

    constructor() {
        makeAutoObservable(this, undefined, {
            deep: true,
            autoBind: true,
            proxy: true
        });
    }

    @computed
    get sortedChats(): ChatModel[] {
        return this.chats.slice().sort((item1, item2) => {
            if (item1.lastMessage && item2.lastMessage) {
                return item2.lastMessage.createdAt - item1.lastMessage.createdAt || item2.createdAt - item1.createdAt;
            } else if (item1.lastMessage && !item2.lastMessage) {
                return item2.createdAt - item1.lastMessage.createdAt || item2.createdAt - item1.createdAt;
            } else if (!item1.lastMessage && item2.lastMessage) {
                return item2.lastMessage.createdAt - item1.createdAt || item2.createdAt - item1.createdAt;
            }

            return item2.createdAt - item1.createdAt;
        })
    }

    @computed
    get selectedChat(): FullChatModel | null {
        if (this.selectedChatId) {
            const messages = this.chatsMessages.get(this.selectedChatId);
            const chatUsers = this.chatsUsers.get(this.selectedChatId);
            let chat = this.chats.find(chat => chat.id === this.selectedChatId);

            if (!chat) {
                chat = this.searchChats?.find(chat => chat.id === this.selectedChatId);
            }

            if (chat && messages && chatUsers) {
                return {
                    ...chat,
                    messages,
                    chatUsers
                }
            }
        }
        return null;
    }

    //chats
    setChats = (chats: ChatModel[]) => {
        this.chatsMessages.clear();
        this.chatsUsers.clear();
        this.chats = chats;
    }
    addChats = (chats: ChatModel[]) => {
        this.chats = [...chats, ...this.chats];
    }
    addChat = (chat: ChatModel) => {
        this.chatsMessages.delete(chat.id);
        this.chatsUsers.delete(chat.id);
        this.addChats([chat]);
    }
    removeChat = (chatId: string) => {
        this.chats = this.chats.filter(chat => chat.id !== chatId);
        this.chatsMessages.delete(chatId);
        this.chatsUsers.delete(chatId);
    }
    defineChatNewLastMessage = (chatId: string) => {
        if (this.chatsMessages.has(chatId)) {
            const chatMessages = this.chatsMessages.get(chatId)!;

            this.chats = this.chats.map(chat => {
                if (chat.id === chatId) {
                    return {...chat, lastMessage: chatMessages.at(0)}
                }
                return chat;
            });
        }
    }

    //search
    setIsSearch = (isSearch: boolean) => {
        this.isSearch = isSearch;
    }
    setSearchChats = (chats: ChatModel[]) => {
        this.searchChats = chats;
    }

    //selected chat
    setSelectedChatId = (id?: string) => {
        this.selectedChatId = id;
    }

    //chats messages
    setChatMessages = (chatId: string, messages: MessageModel[]) => {
        this.chatsMessages.set(chatId, messages);
        this.defineChatNewLastMessage(chatId);
    }
    addChatMessages = (chatId: string, messages: MessageModel[], place: "start" | "end") => {
        if (this.chatsMessages.has(chatId)) {
            const oldMessages = this.chatsMessages.get(chatId)!;

            this.chatsMessages.set(chatId, place === "start" ? [...messages, ...oldMessages] : [...oldMessages, ...messages]);
        } else {
            this.setChatMessages(chatId, messages);
        }
        this.defineChatNewLastMessage(chatId);
    }
    addChatMessage = (message: MessageModel) => {
        this.addChatMessages(message.chat.id, [message], "start");
    }
    removeChatMessage = (chatId: string, messageId: string) => {
        if (this.chatsMessages.has(chatId)) {
            const messages = this.chatsMessages.get(chatId)!;
            this.chatsMessages.set(chatId, messages.filter(message => message.id !== messageId));
        }
    }

    //chats users
    setChatUsers = (chatId: string, chatUsers: ChatUserModel[]) => {
        this.chatsUsers.set(chatId, chatUsers);
    }
    addChatUsers = (chatId: string, chatUsers: ChatUserModel[], place: "start" | "end") => {
        if (this.chatsUsers.has(chatId)) {
            const oldChatUsers = this.chatsUsers.get(chatId)!;

            this.chatsUsers.set(chatId, place === "start" ? [...chatUsers, ...oldChatUsers] : [...oldChatUsers, ...chatUsers]);
        } else {
            this.setChatUsers(chatId, chatUsers);
        }
    }
    addChatUser = (chatUser: ChatUserModel) => {
        this.addChatUsers(chatUser.chat.id, [chatUser], "start");
    }
    removeChatUser = (chatId: string, userId: string) => {
        if (this.chatsUsers.has(chatId)) {
            const chatUsers = this.chatsUsers.get(chatId)!;
            this.chatsUsers.set(chatId, chatUsers.filter(chatUser => chatUser.user.id !== userId));
        }
    }
    isParticipant = (chatId: string): boolean => {
        return !!this.chats.find(chat => chat.id === chatId);
        //return !!this.chatsUsers.get(chatId)?.find(chatUser => chatUser.user.id === userId);
    }
}

export const chatsStore = new ChatsStore();

const context = createContext(chatsStore);
export const useChatsStore = () => useContext(context);
