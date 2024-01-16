import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  StorageError,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../utils/firebase';
import {
  deleteUserFailed,
  deleteUserStart,
  deleteUserSuccess,
  signOutFailed,
  signOutStart,
  signOutSuccess,
  updateUserFailed,
  updateUserStart,
  updateUserSuccess,
} from '../redux/user/userSlice';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { User } from '../types/userSlice';
import { Link } from 'react-router-dom';

interface formDataType {
  password?: string;
  username?: string;
  email?: string;
  photoURL?: string;
}

const Profile: React.FC<unknown> = () => {
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const { currentUser, loading, error } = useAppSelector(({ userReducer }) => ({
    currentUser: userReducer.currentUser,
    loading: userReducer.loading,
    error: userReducer.error,
  }));

  const [file, setFile] = useState<File | undefined>(undefined);
  const [uploadPerc, setUploadPerc] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<StorageError | null>(null);

  const [formData, setFormData] = useState<formDataType | null>(null);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (file instanceof File) handleFileUpload(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleDelete: React.MouseEventHandler<HTMLSpanElement> = async () => {
    try {
      dispatch(deleteUserStart());
      const { data } = await axios.delete(`/api/user/delete/${currentUser?._id}`);
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      console.log(error);
      if (typeof error === 'string') {
        dispatch(deleteUserFailed(error.toUpperCase()));
      } else if (error instanceof AxiosError) {
        const message = error.response?.data.message;
        dispatch(deleteUserFailed(message));
      }
    }
  };

  const handleSignOut: React.MouseEventHandler<HTMLSpanElement> = async () => {
    try {
      dispatch(signOutStart());
      const { data } = await axios.get('/api/auth/signout');
      dispatch(signOutSuccess(data));
    } catch (error) {
      console.log(error);
      if (typeof error === 'string') {
        dispatch(signOutFailed(error.toUpperCase()));
      } else if (error instanceof AxiosError) {
        const message = error.response?.data.message;
        dispatch(signOutFailed(message));
      }
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const { data } = await axios.post<User, AxiosResponse<User>>(
        `/api/user/update/${currentUser?._id}`,
        formData,
      );
      dispatch(updateUserSuccess(data));
    } catch (error) {
      console.log(error);
      if (typeof error === 'string') {
        dispatch(updateUserFailed(error.toUpperCase()));
      } else if (error instanceof AxiosError) {
        const message = error.response?.data.message;
        dispatch(updateUserFailed(message));
      }
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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

        <input
          type="text"
          className="border p-3 rounded-lg"
          defaultValue={currentUser?.username}
          placeholder="Username"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser?.email}
          placeholder="email"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          className="border p-3 rounded-lg"
          placeholder="password"
          id="password"
          onChange={handleChange}
        />
        <button
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          disabled={loading}>
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link
          to={'/create-listing'}
          className="bg-green-700 text-white rounded-lg p-3 uppercase text-center hover:opacity-95 disabled:opacity-80">
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer" onClick={handleDelete}>
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign out
        </span>
      </div>
      <span className="text-red-700">{error ? error : ''}</span>
    </div>
  );
};

export default Profile;
