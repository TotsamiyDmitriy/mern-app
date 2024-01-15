import React, { useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import {
  StorageError,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../utils/firebase';

interface formDataType {
  password?: string;
  username?: string;
  email?: string;
  photoURL: string;
}

const Profile: React.FC<unknown> = () => {
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const currentUser = useAppSelector(({ userReducer }) => userReducer.currentUser);

  const [file, setFile] = useState<File | undefined>(undefined);
  const [uploadPerc, setUploadPerc] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<StorageError | null>(null);

  const [formData, setFormData] = useState<formDataType | null>(null);

  React.useEffect(() => {
    if (file instanceof File) handleFileUpload(file);
  }, [file]);

  const handleFileUpload = (file: File) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadPerc(Math.round(progress));
      },
      (err) => {
        setUploadError(err);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, photoURL: downloadURL });
        });
      },
    );
  };

  const FileSeterOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    } else {
      setFile(undefined);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input type="file" onChange={FileSeterOnChange} ref={fileRef} accept="image/*" hidden />

        <img
          onClick={() => {
            fileRef?.current?.click();
          }}
          className="rounded-full h-24 w-24 object-cover cursor-pointer mt-2 self-center"
          src={formData?.photoURL || currentUser?.photoURL}
          alt="avatar"
        />

        {uploadError ? (
          <span className="text-red-700 mx-auto ">{uploadError.message}</span>
        ) : uploadPerc && uploadPerc > 0 && uploadPerc < 100 ? (
          <span className="text-green-700 mx-auto ">{`Uploading ${uploadPerc}%`}</span>
        ) : uploadPerc === 100 ? (
          <span className="text-green-700 mx-auto ">Image successfully uploaded!</span>
        ) : (
          ''
        )}

        <input type="text" className="border p-3 rounded-lg" placeholder="Username" id="username" />
        <input type="email" className="border p-3 rounded-lg" placeholder="email" id="email" />
        <input
          type="password"
          className="border p-3 rounded-lg"
          placeholder="password"
          id="password"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
};

export default Profile;
