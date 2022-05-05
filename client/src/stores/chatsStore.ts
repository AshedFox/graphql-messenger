import {computed, makeAutoObservable} from "mobx";
import {createContext, useContext} from "react";
import {ChatInviteModel, ChatModel, ChatUserModel, FullChatModel, MessageModel} from "../types/models";
import {userStore} from "./userStore";

class ChatsStore {
    selectedChatId?: string;
    loading: boolean = true;
    error: boolean = false;
    isSearch: boolean = false;
    searchText: string = "";
    searchChats: ChatModel[] = [];
    private _chats: ChatModel[] = [];
    private _fullChats: Map<string, FullChatModel> = new Map<string, FullChatModel>();

    constructor() {
        makeAutoObservable(this);
    }

    @computed
    get sortedChats(): ChatModel[] {
        return this._chats.slice().sort((item1, item2) => {
            if (item1.lastMessage && item2.lastMessage) {
                return item2.lastMessage.createdAt - item1.lastMessage.createdAt || item2.createdAt - item1.createdAt;
            } else if (item1.lastMessage && !item2.lastMessage) {
                return item2.createdAt - item1.lastMessage.createdAt || item2.createdAt - item1.createdAt;
            } else if (!item1.lastMessage && item2.lastMessage) {
                return item2.lastMessage.createdAt - item1.createdAt || item2.createdAt - item1.createdAt;
            }

            return item2.createdAt - item1.createdAt;
        });
    }

    @computed
    get selectedChat(): FullChatModel | null {
        if (!this.selectedChatId) {
            return null;
        }
        const fullChat = this._fullChats.get(this.selectedChatId);

        return fullChat || null;
    }

    @computed
    get isParticipant(): boolean {
        if (this.selectedChatId && userStore.me) {
            return this.checkParticipant(this.selectedChatId);
        }
        return false;
    }

    reset = () => {
        this._chats = [];
        this._fullChats = new Map<string, FullChatModel>();
        this.selectedChatId = undefined;
        this.loading = true;
        this.error = false;
        this.isSearch = false;
        this.searchText = "";
        this.searchChats = [];
    }

    setLoading = (loading: boolean) => this.loading = loading;
    setError = (error: boolean) => this.error = error;

    // chats
    setChats = (chats: ChatModel[]) => {
        this._chats = chats;
    }
    addChat = (chat: ChatModel) => {
        this._chats = [...this._chats, chat];
    }
    addFullChat = (fullChat: FullChatModel) => {
        this._fullChats.set(fullChat.id, fullChat);
    }
    updateChat = (chat: ChatModel) => {
        this._chats = this._chats.map(c => c.id === chat.id ? chat : c);
        this.searchChats = this.searchChats.map(c => c.id === chat.id ? chat : c);

        const fullChat = this._fullChats.get(chat.id);
        if (fullChat) {
            this._fullChats.set(chat.id, {...fullChat, ...chat});
        }
    }
    shouldRenewLastSeen = (chatId: string, newLastSeen: Date) => {
        const chat = this._chats.find(chat => chat.id === chatId);
        if (!chat) {
            return false;
        }
        return !chat.lastSeen || chat.lastSeen < newLastSeen;

        //return this._chats.find(chat => chat.id === chatId)?.lastSeen < newLastSeen;
        //return this._fullChats.get(chatId)?.lastSeen < newLastSeen;
    }
    updateChatLastSeen = (chatId: string, lastSeen: Date) => {
        if (this.shouldRenewLastSeen(chatId, lastSeen)) {
            this._chats = this._chats.map(chat => {
                if (chat.id === chatId) {
                    chat.lastSeen = lastSeen;
                }
                return chat;
            });
            this.searchChats = this.searchChats.map(chat => {
                if (chat.id === chatId) {
                    chat.lastSeen = lastSeen;
                }
                return chat;
            });

            const fullChat = this._fullChats.get(chatId);

            if (fullChat) {
                this._fullChats.set(chatId, {...fullChat, lastSeen});
            }
        }
    }
    removeChat = (chatId: string) => {
        this._chats = this._chats.filter(chat => chat.id !== chatId);
        this._fullChats.delete(chatId);
    }
    removeFullChat = (chatId: string) => {
        this._fullChats.delete(chatId);
    }

    // messages
    addMessage = (message: MessageModel) => {
        const fullChat = this._fullChats.get(message.chat.id);

        if (fullChat) {
            this._fullChats.set(message.chat.id, {
                ...fullChat,
                messages: [message, ...fullChat.messages],
                lastMessage: message
            });
        }

        this._chats = this._chats.map(chat => {
            if (chat.id === message.chat.id) {
                chat.lastMessage = message;
            }
            return chat;
        });
        this.searchChats = this.searchChats.map(chat => {
            if (chat.id === message.chat.id) {
                chat.lastMessage = message;
            }
            return chat;
        });
    }
    addMessages = (chatId: string, messages: MessageModel[]) => {
        const fullChat = this._fullChats.get(chatId);

        if (fullChat) {
            this._fullChats.set(chatId, {
                ...fullChat,
                messages: [...fullChat.messages, ...messages],
            });
        }
    }
    updateMessage = (message: MessageModel) => {
        const fullChat = this._fullChats.get(message.chat.id);

        if (fullChat) {
            this._fullChats.set(message.chat.id, {
                ...fullChat,
                messages: fullChat.messages.map((msg: MessageModel) => msg.id === message.id ? message : msg),
                lastMessage: message.id === fullChat.lastMessage?.id ? message : fullChat.lastMessage
            });
        }

        this._chats = this._chats.map(chat => {
            if (chat.id === message.chat.id) {
                chat.lastMessage = message;
            }
            return chat;
        });
        this.searchChats = this.searchChats.map(chat => {
            if (chat.id === message.chat.id) {
                chat.lastMessage = message;
            }
            return chat;
        });
    }
    removeMessage = (chatId: string, messageId: string) => {
        const fullChat = this._fullChats.get(chatId);

        if (fullChat) {
            this._fullChats.set(chatId, {
                ...fullChat,
                messages: fullChat.messages.filter(message => message.id !== messageId),
                lastMessage: messageId === fullChat.lastMessage?.id ? fullChat.messages.at(1) : fullChat.lastMessage
            });
        }

        this._chats = this._chats.map(chat => {
            if (chat.id === chatId) {
                chat.lastMessage = messageId === chat.lastMessage?.id ? undefined : chat.lastMessage;
            }
            return chat;
        });
        this.searchChats = this.searchChats.map(chat => {
            if (chat.id === chatId) {
                chat.lastMessage = messageId === chat.lastMessage?.id ? undefined : chat.lastMessage;
            }
            return chat;
        });
    }

    // chat users
    addChatUser = (chatUser: ChatUserModel) => {
        const fullChat = this._fullChats.get(chatUser.chat.id);

        if (fullChat) {
            this._fullChats.set(chatUser.chat.id, {
                ...fullChat,
                users: [...fullChat.users, chatUser]
            });
        }
    }
    addChatUsers = (chatId: string, chatUsers: ChatUserModel[]) => {
        const fullChat = this._fullChats.get(chatId);

        if (fullChat) {
            this._fullChats.set(chatId, {
                ...fullChat,
                users: [...fullChat.users, ...chatUsers]
            });
        }
    }
    updateChatUser = (chatUser: ChatUserModel) => {
        const fullChat = this._fullChats.get(chatUser.chat.id);

        if (fullChat) {
            this._fullChats.set(chatUser.chat.id, {
                ...fullChat,
                users: fullChat.users.map(cu => cu.user.id === chatUser.user.id ? chatUser : cu),
                messages: fullChat.messages.map(msg => {
                    if (msg.sender.id === chatUser.user.id) {
                        msg.sender = chatUser.user;
                    }
                    return msg;
                }),
                lastMessage: chatUser.user.id === fullChat.lastMessage?.sender.id ?
                    {...fullChat.lastMessage, sender: chatUser.user} :
                    fullChat.lastMessage
            });
        }

        this._chats = this._chats.map(chat => {
            if (chat.id === chatUser.chat.id) {
                chat.lastMessage = chatUser.user.id === chat.lastMessage?.sender.id ?
                    {...chat.lastMessage, sender: chatUser.user} :
                    chat.lastMessage;
            }
            return chat;
        });
        this.searchChats = this.searchChats.map(chat => {
            if (chat.id === chatUser.chat.id) {
                chat.lastMessage = chatUser.user.id === chat.lastMessage?.sender.id ?
                    {...chat.lastMessage, sender: chatUser.user} :
                    chat.lastMessage;
            }
            return chat;
        });
    }
    removeChatUser = (chatId: string, chatUserId: string) => {
        const fullChat = this._fullChats.get(chatId);

        if (fullChat) {
            this._fullChats.set(chatId, {
                ...fullChat,
                users: fullChat.users.filter(cu => cu.user.id !== chatUserId),
            });
        }
    }

    //invites


    //search
    setIsSearch = (isSearch: boolean) => {
        this.isSearch = isSearch;
    }
    setSearchText = (text: string) => {
        this.searchText = text;
    }
    setSearchChats = (chats: ChatModel[]) => {
        this.searchChats = chats;
    }
    removeSearchChat = (chatId: string) => {
        this.searchChats = this.searchChats.filter(chat => chat.id !== chatId);
    }
    resetSearch = () => {
        this.searchText = "";
        this.isSearch = false;
    }

    //selected chat
    setSelectedChatId = (id?: string) => {
        this.selectedChatId = id;
    }
    selectIfNoSelected = (id: string) => {
        if (!this.selectedChatId) {
            this.setSelectedChatId(id);
        }
    }
    unselectIfSelected = (id: string) => {
        if (id === this.selectedChatId) {
            this.setSelectedChatId(undefined);
        }
    }

    // invites
    addChatInvite = (chatInvite: ChatInviteModel) => {
        const fullChat = this._fullChats.get(chatInvite.chat.id);

        if (fullChat) {
            this._fullChats.set(chatInvite.chat.id, {
                ...fullChat,
                invites: [chatInvite, ...fullChat.invites]
            });
        }
    }
    updateChatInvite = (chatInvite: ChatInviteModel) => {
        const fullChat = this._fullChats.get(chatInvite.chat.id);

        if (fullChat) {
            this._fullChats.set(chatInvite.chat.id, {
                ...fullChat,
                invites: fullChat.invites.map(invite => invite.id === chatInvite.id ? chatInvite : invite)
            });
        }
    }
    removeChatInvite = (chatInvite: ChatInviteModel) => {
        const fullChat = this._fullChats.get(chatInvite.chat.id);

        if (fullChat) {
            this._fullChats.set(chatInvite.chat.id, {
                ...fullChat,
                invites: fullChat.invites.filter(invite => invite.id !== chatInvite.id)
            });
        }
    }

    checkParticipant = (chatId: string): boolean => {
        return !!this._chats.find(chat => chatId === chat.id);
    }
}

export const chatsStore = new ChatsStore();

const context = createContext(chatsStore);
export const useChatsStore = () => useContext(context);
