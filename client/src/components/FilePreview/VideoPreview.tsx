import React, {FC} from 'react';
import styled from "styled-components";
import {IconButton} from "../UI";
import {CgClose} from "react-icons/cg";
import {FileModel} from "../../types/models";


const Container = styled.div<{heightLimit?: string, widthLimit?: string, fitContent?: boolean}>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  min-width: ${props => props.widthLimit ?? "120px"};;
  min-height: ${props => props.heightLimit ?? "72px"};
  height: 100%;
  width: ${props => props.fitContent ? "fit-content" : "100%"};
  border-radius: 3px;
  overflow: hidden;
`

const Video = styled.video`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`

const RemoveButton = styled(IconButton)`
  position: absolute;
  right: 0;
  top: 0;
  background-color: ${props => props.theme.primaryBg};
`

type OptionalProps =
    | {withDelete: true, onDelete: () => void}
    | {withDelete: false, onDelete?: never}

type Props = {
    file: FileModel,
    heightLimit?: string,
    widthLimit?: string,
    fitContent?: boolean
} & OptionalProps

const VideoPreview: FC<Props> = ({file, withDelete, onDelete,
                                     heightLimit, widthLimit, fitContent}) => (
    <Container heightLimit={heightLimit} widthLimit={widthLimit} fitContent={fitContent}>
        <Video src={file.url} controls={true}/>
        {withDelete &&
            <RemoveButton onClick={onDelete}>
                <CgClose size={18}/>
            </RemoveButton>
        }
    </Container>
);

export default VideoPreview;
