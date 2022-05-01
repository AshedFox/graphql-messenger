import styled from "styled-components";
import React, {FC, useEffect, useLayoutEffect, useRef} from "react";
import Message from "./Message";
import {MessageModel} from "../../types/models";
import usePrevious from "../../hooks/usePrevious";
import {AiOutlineArrowDown} from "react-icons/ai";
import {IconButton} from "../UI";

const Container = styled.div`
  display: flex;
  position: relative;
  overflow: hidden;

  width: 100%;
  height: 100%;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 14px;
  margin-top: auto;
  width: 100%;
  max-height: 100%;
  padding: 16px 54px;

  /* width */

  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */

  ::-webkit-scrollbar-track {
    background: transparent;
    margin: 4px;
  }

  /* Handle */

  ::-webkit-scrollbar-thumb {
    background: ${props => `${props.theme.secondaryBg}81`};
    border-radius: 4px;
  }

  /* Handle on hover */

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => `${props.theme.uiSecondaryHoverBg}81`};
  }
`

const EmptyMessage = styled.div`
  font-size: 18px;
  color: ${props => props.theme.primaryText};
  margin: auto;
  padding: 30px;
`

const ReturnButton = styled(IconButton)`
  position: absolute;
  right: 28px;
  bottom: 20px;
`

type Props = {
    messages: MessageModel[],
    order?: "actual" | "reverse"
    loadMore?: () => void,
    userId?: string,
    emptyMessage?: string
}

const MessagesList: FC<Props> = ({
                                     messages, order, loadMore, userId,
                                     emptyMessage
                                 }) => {
    const start = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const prevLastId = usePrevious(messages.at(-1)?.id)
    const lastScrollPosition = usePrevious(listRef.current ?
        (listRef.current.scrollHeight - listRef.current.offsetHeight + listRef.current.clientHeight) :
        undefined
    );

    const handleBottomScroll = () => {
        listRef.current?.scrollTo({behavior: "smooth", left: 0, top: listRef.current.scrollHeight})
    }

    useEffect(() => {
        const observer = new IntersectionObserver((e) => {
            if (e[0].isIntersecting) {
                loadMore?.();
            }
        }, {rootMargin: "20px", threshold: 0.5});

        const startCurrent = start.current;

        if (startCurrent) {
            observer.observe(startCurrent);
        }

        return () => startCurrent ? observer.unobserve(startCurrent) : undefined;
    }, [loadMore]);


    useLayoutEffect(() => {
        if (prevLastId !== messages.at(-1)?.id) {
            if (listRef.current) {
                listRef.current?.scrollBy(0, lastScrollPosition ?
                    listRef.current.scrollHeight - lastScrollPosition :
                    listRef.current.scrollHeight
                );
            }
        }
    }, [messages]);

    if (messages.length === 0) {
        return <EmptyMessage>{emptyMessage}</EmptyMessage>
    }

    return (
        <Container>
            <List ref={listRef}>
                <div ref={start}/>
                {(order ?? "actual") === "actual" ?
                    messages.map((message) => {
                        return (
                            <Message key={message.id} message={message} isSelf={message.sender.id === userId}/>
                        )
                    }) :
                    messages.slice().reverse().map((message) => {
                        return (
                            <Message key={message.id} message={message} isSelf={message.sender.id === userId}/>
                        )
                    })
                }
            </List>
            <ReturnButton onClick={handleBottomScroll}>
                <AiOutlineArrowDown size={30}/>
            </ReturnButton>
        </Container>
    );
};

export default MessagesList;
