import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Inter } from 'next/font/google';
import Image, { StaticImageData } from 'next/image';

import { UserContext } from '@/pages/sign-up/user-info';

import { Payload } from '@/types/signup';

import CameraIcon from '@/assets/icons/camera';
import DeleteIconWithBg from '@/assets/icons/deleteWithBg';
import RechooseIconWithBg from '@/assets/icons/rechooseWithBg';
import fileDownloaderEdit from '@/assets/images/fileDownloaderEdit.svg';
import fileDownloaderImage from '@/assets/images/fileDownloaderImage.svg';

const inter = Inter({ subsets: ['latin'] });

interface FileDownloaderProps {
  setValue: (file: BinaryData | string) => void;
  setPayload?: Dispatch<SetStateAction<Payload>>;
  payload?: object;
  variant?: 'base' | 'lg';
}

const FileDownloader = ({
  setValue,
  setPayload,
  payload,
  variant = 'base',
}: FileDownloaderProps) => {
  const user = useContext(UserContext);
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<Blob | string>('');
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
  const reset = () => {
    if (ref.current) {
      ref.current.value = '';
    }
  };
  return (
    <div>
      <input
        type="file"
        ref={ref}
        hidden
        onChange={e => handleChange(e)}
        accept="image/png, image/jpeg"
      />
      {variant === 'base' ? (
        <div className="flex flex-col items-center">
          <div onClick={e => handleClick(e)} className="cursor-pointer">
            <Image
              src={fileDataURL as string}
              width={105}
              height={104}
              alt="file downloader"
              className="rounded-xl"
            />
            <div className="flex justify-end -mt-8">
              <Image
                src={fileDownloaderEdit}
                width={36}
                height={36}
                alt="file downloader edit"
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      ) : file && fileDataURL ? (
        <>
          <Image
            src={fileDataURL as string}
            alt="image"
            width={400}
            height={236}
            className="max-h-[236px] object-cover rounded-xl"
          />
          <div className="flex justify-end -mt-11 mr-2 gap-2">
            <div onClick={e => handleClick(e)}>
              <RechooseIconWithBg className="cursor-pointer" />
            </div>
            <div
              onClick={() => {
                setFile('');
                setFileDataURL('');
                reset();
              }}
            >
              <DeleteIconWithBg className="cursor-pointer" />
            </div>
          </div>
        </>
      ) : (
        <div
          className="flex flex-col px-11 py-12 bg-primary-light rounded-2xl border border-primary border-dashed justify-center items-center cursor-pointer"
          onClick={e => handleClick(e)}
        >
          <div className="mb-6">
            <CameraIcon />
          </div>
          <div className={inter.className}>
            <div className="text-center">
              <p className="text-cornflower-blue font-semibold mb-2">
                Click to upload your images
              </p>
              <p className="text-[#A8AFB5] text-sm">
                Format: .png, .jpg, .jpeg. Max size: 5 MB.
                <br /> Minimum 1236px width recommended.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDownloader;
