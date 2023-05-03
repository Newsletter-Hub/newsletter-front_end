import React, {
  useEffect,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
} from 'react';
import Image, { StaticImageData } from 'next/image';
import fileDownloaderImage from '@/assets/images/fileDownloaderImage.png';
import { Payload } from '@/assets/types/signup-types';
import { UserContext } from '@/pages/sign-up/[token]';

interface FileDownloaderProps {
  setValue: (file: BinaryData | string) => void;
  setPayload?: Dispatch<SetStateAction<Payload>>;
  payload?: object;
}

const FileDownloader = ({
  setValue,
  setPayload,
  payload,
}: FileDownloaderProps) => {
  const user = useContext(UserContext);
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<Blob>();
  const [fileDataURL, setFileDataURL] = useState<
    StaticImageData | string | ArrayBuffer
  >(user.avatarURL || fileDownloaderImage);

  const handleClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.preventDefault();
    if (ref.current) {
      ref.current.click();
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (ref.current?.files) {
      const file = ref.current.files[0];
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && file) {
          setFileDataURL(reader.result as string);
          if (setPayload) {
            setPayload({ ...payload, avatarURL: reader.result });
          }
        }
      };
      if (Boolean(file)) {
        reader.readAsDataURL(file);
      }
    }
  };

  useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setValue(reader.result as string);
      }
    };
    if (file) {
      reader.readAsBinaryString(file as Blob);
    }
  }, [file, setValue]);

  return (
    <div>
      <input
        type="file"
        ref={ref}
        hidden
        onChange={e => handleChange(e)}
        accept="image/png, image/jpeg"
      />
      <div className="flex flex-col items-center gap-4">
        <Image
          src={fileDataURL as string}
          width={104}
          height={104}
          alt="file downloader"
          className="rounded-xl"
        />
        <p
          className="text-2xl text-primary underline cursor-pointer"
          onClick={e => handleClick(e)}
        >
          Upload Picture
        </p>
      </div>
    </div>
  );
};

export default FileDownloader;
