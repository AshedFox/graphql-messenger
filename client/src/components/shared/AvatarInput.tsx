import React, {FC, useRef} from 'react';
import Avatar from "./Avatar";
import Input from "./Input";

type Props = {
    fileUrl?: string,
    onFileChange?: (file: File) => void,
    acceptType?: string
}

const AvatarInput: FC<Props> = ({fileUrl, acceptType, onFileChange}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <Avatar src={fileUrl} alt={"avatar"} onClick={() => fileInputRef.current?.click()}/>
            <Input ref={fileInputRef} type={"file"} onChange={(e) => {
                if (e.target.files && onFileChange) {
                    onFileChange(e.target.files[0]);
                }
            }} style={{display: "none"}} accept={acceptType}/>
        </>
    );
};

export default AvatarInput;
