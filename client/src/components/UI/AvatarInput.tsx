import React, {FC, useRef} from 'react';
import Avatar from "./Avatar";
import Input from "./Input";

type Props = {
    fileSrc?: string,
    onFileChange?: (file: File) => void,
    acceptType?: string,
    size?: "small" | "medium" | "big",
    alt?: string
}

const AvatarInput: FC<Props> = ({
                                    fileSrc, size, acceptType, onFileChange
                                    , alt
                                }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <Avatar src={fileSrc} alt={alt ?? "avatar"} size={size} onClick={() => fileInputRef.current?.click()}/>
            <Input ref={fileInputRef} type={"file"} onChange={(e) => {
                if (e.target.files && onFileChange) {
                    onFileChange(e.target.files[0]);
                }
            }} style={{display: "none"}} accept={acceptType}/>
        </>
    );
};

export default AvatarInput;
