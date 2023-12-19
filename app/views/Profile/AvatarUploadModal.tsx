import { useState, FormEvent, useEffect, useRef } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import ImageCropper from "./ImageCropper";
import { uploadUserAvatar } from "@/services/functions/user";
import { useSelector } from "@/hooks/redux";

type AvatarUploadModalProps = {
  visible: boolean;
  onClose: () => void;
  onAvatarUploaded: (avatar: string) => void;
};

export default function AvatarUploadModal(props: AvatarUploadModalProps) {
  const { visible, onClose, onAvatarUploaded } = props;
  const user = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState<File>();
  const cropper = useRef<{ crop: () => Promise<Blob | null> }>(null);

  const [isUploading, setIsUploading] = useState(false);
  const abortControllerRef = useRef<AbortController>();
  const handleFileChange = function (e: FormEvent) {
    const files = (e.target as HTMLInputElement).files;
    if (files) {
      console.log(files[0]);
      setImageFile(files[0]);
    } else {
      setImageFile(undefined);
    }
  };

  const handleCrop = function () {
    if (isUploading) {
      return;
    }
    setIsUploading(true);
    cropper.current
      ?.crop()
      .then((blob) => {
        if (!blob) {
          return;
        }
        const ac = new AbortController();
        abortControllerRef.current = ac;
        return uploadUserAvatar(
          { avatar: blob, token: user.token },
          ac.signal,
        ).then((res) => {
          onAvatarUploaded(res.avatar);
        });
      })
      .finally(() => {
        setIsUploading(false);
        abortControllerRef.current = undefined;
      });
  };

  function handleCancel() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = undefined;
    }
    onClose();
  }

  function handleModalClosed() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = undefined;
    }
    setImageFile(undefined);
  }

  return (
    <Modal visible={visible} onClose={onClose} onClosed={handleModalClosed}>
      <div className="bg-white p-4 rounded">
        <div>
          {imageFile && <ImageCropper file={imageFile} ref={cropper} />}
          <label className="mt-4">
            <span>{imageFile ? "重新选择" : "选择文件"}</span>
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept="image/*"
            />
          </label>
        </div>
        <div className="flex gap-x-4 justify-end">
          <Button onClick={handleCancel} type="text">
            取消
          </Button>
          <Button loading={isUploading} onClick={handleCrop}>
            确定
          </Button>
        </div>
      </div>
    </Modal>
  );
}
