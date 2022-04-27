import styled from "styled-components";
import React, {FC, useEffect, useRef} from "react";
import Message from "./Message/Message";
import {MessageModel} from "../../types/models";
import Loader from "../shared/Loader";

const List = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 8px 54px;
  gap: 14px;
  margin-top: auto;

  width: 100%;
  max-height: 100%;
`

type Props = {
    messages: MessageModel[],
    loadMore?: () => void,
    lastId?: string,
    loadingMore?: boolean,
    userId?: string
}

const MessagesList: FC<Props> = ({
                                     messages, loadMore, lastId, loadingMore,
                                     userId
                                 }) => {
    const start = useRef<HTMLDivElement>(null);
    const end = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((e) => {
            if (e[0].isIntersecting) {
                loadMore?.();
            }
        }, {rootMargin: "10px", threshold: 0.5});

        const startCurrent = start.current;

        if (startCurrent) {
            observer.observe(startCurrent);
        }

        return () => startCurrent ? observer.unobserve(startCurrent) : undefined;
    }, [loadMore]);

    useEffect(() => {
        end.current?.scrollIntoView({behavior: "auto"});
    }, [])

    useEffect(() => {
        end.current?.scrollIntoView({behavior: "smooth"});
    }, [lastId])

    return (
        <List>
            {loadingMore ?
                <Loader size={32} stretch/> :
                <div ref={start}/>
            }
            {messages.map((message) =>
                <Message key={message.id} message={message} isSelf={message.sender.id === userId}
                />
            )}
            <div ref={end}/>
        </List>
    );
};

export default MessagesList;
