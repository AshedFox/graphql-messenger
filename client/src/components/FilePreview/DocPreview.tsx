import React, {FC} from 'react';
import styled from "styled-components";
import {IoDocument} from "react-icons/io5";
import {IconButton} from "../UI";
import {FileModel} from "../../types/models";
import {CgClose} from "react-icons/cg";

const DocContainer = styled.a<{heightLimit?: string, widthLimit?: string, withDownload?: boolean}>`
  display: flex;
  padding: 10px;
  overflow: hidden;
  border-radius: 3px;
  position: relative;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  height: fit-content;
  width: fit-content;
  //max-height: ${props => props.heightLimit ?? "min-content"};
  max-width: 220px;
  gap: 5px;
  background-color: ${props => props.theme.primaryBg};
  cursor: ${props => props.withDownload ? "pointer" : "default"};
  //pointer-events: ${props => props.withDownload ? "all" : "none"};
`

const DocIcon = styled(IoDocument)`
  color: ${props => props.theme.primaryText};
  min-width: 32px;
  min-height: 32px;
  width: 32px;
  height: 32px;
`

const TextContainer = styled.div<{withDownload?: boolean}>`
  overflow: hidden;
  gap: 5px;
`

const Text = styled.div`
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => props.theme.primaryText};
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
    withDownload?: boolean
} & OptionalProps;

const DocPreview: FC<Props> = ({heightLimit, widthLimit, onDelete,
                                   withDelete, file, withDownload}) =>  (
    <DocContainer heightLimit={heightLimit} widthLimit={widthLimit} withDownload={withDownload}
                  download={file.originalName} href={withDownload ? file.url : undefined} target={"_blank"}>
        <DocIcon size={32}/>
        <TextContainer>
            <Text>{file.originalName}</Text>
            <Text>{file.size}Б</Text>
            {withDelete &&
                <RemoveButton onClick={onDelete}>
                    <CgClose size={18}/>
                </RemoveButton>
            }
        </TextContainer>
    </DocContainer>
);

export default DocPreview;
