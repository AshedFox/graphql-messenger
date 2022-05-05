import React from 'react';
import styled from "styled-components";
import {formatDatetime} from "../../../services/datetimeService";
import {Avatar} from '../../UI';
import {MessageProps} from "./types";
import {FileType} from "../../../data/generated/graphql";
import {DocPreview, ImagePreview, VideoPreview} from "../../FilePreview";


const Container = styled.div`
  display: grid;
  grid-template-columns: 32px auto;
  align-items: flex-end;
  align-self: flex-start;
  //overflow-x: hidden;
  gap: 10px;
`

const Body = styled.div<{ self: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  gap: 5px;
  border-radius: 3px;
  overflow: hidden;
  background-color: ${props => props.self ? props.theme.uiPrimaryHoverBg : props.theme.uiPrimaryBg};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

const Name = styled.span`
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => props.theme.primaryText};
`

const Time = styled.span`
  font-weight: 500;
  font-size: 13px;
  white-space: nowrap;
  color: ${props => props.theme.optionalText};
`

const Text = styled.div`
  font-size: 13px;
  font-weight: 500;
  white-space: break-spaces;
  word-wrap: break-word;
  color: ${props => props.theme.primaryText};
`

const MediaList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  grid-template-rows: repeat(auto-fit, 220px);
  grid-auto-flow: dense;
  gap: 10px;
`

const DocsList = styled.div`
  display: flex;
  flex-direction: column;
`

const Message = ({message, isSelf}: MessageProps) => {
    const docs = message.attachments.filter(a => a.file.type === FileType.Raw);
    const media = message.attachments.filter(a => a.file.type !== FileType.Raw);

    return (
    <Container>
        <Avatar size={"small"} src={message.sender.avatar?.url} alt={"avatar"}/>
        <Body self={isSelf ?? false}>
            <Header>
                <Name>{message.sender.name}</Name>
                <Time>{formatDatetime(message.createdAt)}</Time>
            </Header>
            <Text>{message.text}</Text>
            {media.length > 0 &&
                <MediaList>
                    {media.map(attachment => {
                        return (
                            attachment.file.type === FileType.Image ?
                                <ImagePreview key={attachment.file.id} file={attachment.file} withDelete={false}
                                              heightLimit={"220px"} widthLimit={"100%"}
                                /> :
                                attachment.file.type === FileType.Video ?
                                    <VideoPreview key={attachment.file.id} file={attachment.file} withDelete={false}
                                                  heightLimit={"220px"} widthLimit={"100%"}
                                    /> :
                                    <DocPreview key={attachment.file.id} file={attachment.file} withDelete={false}
                                                heightLimit={"220px"} widthLimit={"100%"} withDownload={true}
                                    />
                        )
                    })}
                </MediaList>
            }
            {docs.length > 0 &&
                <DocsList>
                    {docs.map(attachment => {
                        return (
                            attachment.file.type === FileType.Image ?
                                <ImagePreview key={attachment.file.id} file={attachment.file} withDelete={false}
                                              heightLimit={"220px"} widthLimit={"100%"}
                                /> :
                                attachment.file.type === FileType.Video ?
                                    <VideoPreview key={attachment.file.id} file={attachment.file} withDelete={false}
                                                  heightLimit={"220px"} widthLimit={"100%"}
                                    /> :
                                    <DocPreview key={attachment.file.id} file={attachment.file} withDelete={false}
                                                heightLimit={"220px"} widthLimit={"100%"} withDownload={true}
                                    />
                        )
                    })}
                </DocsList>
            }
        </Body>
    </Container>
    );
};

export default Message;
