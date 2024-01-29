import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { app } from '../utils/firebase';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useAppSelector } from '../redux/hooks';
import { useNavigate } from 'react-router-dom';
import { ListingType } from '../types/listing';

const CreateListing: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [formData, setFormData] = useState<ListingType>({
    imageURLs: [],
    name: '',
    description: '',
    address: '',
    regularPrice: 0,
    discountPrice: 0,
    bedrooms: 0,
    bathrooms: 0,
    furnished: false,
    parking: false,
    type: 'rent',
    offer: false,
    userRef: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const [progressImage, setProgressImage] = useState<number | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const currentUser = useAppSelector(({ userReducer }) => userReducer.currentUser);
  const navigate = useNavigate();

  const handleImagesSubmit: React.MouseEventHandler<HTMLButtonElement> = async () => {
    if (files && files?.length > 0 && files.length < 7) {
      const promises: Promise<string>[] = [];

      // type of FileList is not Array, but in constructor have a iterator, we can forEach him to optimizing process
      Array.from(files).forEach((file) => {
        promises.push(storeImage(file));
      });
      //When all Promises is resolved or someone is rejected, return Promise that will return result of all promises and do this itrerable, or error if that rejected.

      Promise.all(promises)
        .then((URLs): void => {
          //inject imageURLs if all good

          setFormData({ ...formData, imageURLs: formData.imageURLs.concat(URLs) });
          setProgressImage(null);
        })
        .catch(() => {
          setImageUploadError('Image upload failed (2 mb max per image)');
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
    }
  };

  const storeImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          console.log(`Upload is ${progress}% done`);
          setProgressImage(progress);
        },
        (error) => {
          reject(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
            setImageUploadError(null);
          });
        },
      );
    });
  };

  const handleDeleteImage = (__e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
    setFormData({
      ...formData,
      imageURLs: formData.imageURLs.filter((__url, index) => index !== id),
    });
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    if (e.target.id === 'rent' || e.target.id === 'sale') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    } else if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: !formData[e.target.id],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageURLs.length < 1) return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice) {
        return setError('Discount price must be lower than regular price');
      }
      setIsLoading(true);
      setError(null);
      const { data } = await axios.post<ListingType, AxiosResponse<ListingType>>(
        '/api/listing/create',
        { ...formData, userRef: currentUser?._id },
      );
      console.log(data);
      setIsLoading(false);
      navigate(`/listing/${data._id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
        setError(error.message);
        setIsLoading(false);
      }
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            onChange={handleChange}
            value={formData.name}
            className="border p-3 rounded-lg"
            placeholder="name"
            name="name"
            id="name"
            maxLength={62}
            minLength={10}
            required
          />
          <textarea
            onChange={handleChange}
            value={formData.description}
            className="border p-3 rounded-lg"
            placeholder="Description"
            name="description"
            id="description"
            required
          />
          <input
            type="text"
            onChange={handleChange}
            value={formData.address}
            className="border p-3 rounded-lg"
            placeholder="Address"
            name="address"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                name="sale"
                onChange={handleChange}
                checked={formData.type === 'sale'}
                id="sale"
              />
              <label htmlFor="sale">Sale</label>
              <input
                type="checkbox"
                className="w-5"
                name="rent"
                onChange={handleChange}
                checked={formData.type === 'rent'}
                id="rent"
              />
              <label htmlFor="rent">Rent</label>
              <input
                type="checkbox"
                className="w-5"
                name="parking"
                onChange={handleChange}
                checked={formData.parking}
                id="parking"
              />
              <label htmlFor="parking">Parking spot</label>
              <input
                type="checkbox"
                className="w-5"
                name="furnished"
                onChange={handleChange}
                checked={formData.furnished}
                id="furnished"
              />
              <label htmlFor="furnished">Furnished</label>
              <input
                type="checkbox"
                className="w-5"
                name="offer"
                onChange={handleChange}
                checked={formData.offer}
                id="offer"
              />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                onChange={handleChange}
                className="p-3 border-gray-300 rounded-lg"
                name="bedrooms"
                id="bedrooms"
                value={formData.bedrooms}
                min={1}
                max={10}
                required
              />
              <label htmlFor="bedrooms">Beds</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                onChange={handleChange}
                className="p-3 border-gray-300 rounded-lg"
                name="bathrooms"
                id="bathrooms"
                value={formData.bathrooms}
                min={1}
                max={10}
                required
              />
              <label htmlFor="bathrooms">Baths</label>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              onChange={handleChange}
              className="p-3 border-gray-300 rounded-lg"
              name="regularPrice"
              id="regularPrice"
              value={formData.regularPrice}
              required
            />
            <div className="flex flex-col items-center">
              <label htmlFor="regularPrice">Regular price</label>
              {formData.type === 'rent' && <span className="text-xs">($ / mouth)</span>}
            </div>
          </div>
          {formData.offer && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                onChange={handleChange}
                className="p-3 border-gray-300 rounded-lg"
                name="discountPrice"
                value={formData.discountPrice}
                id="discountPrice"
                required
              />
              <div className="flex flex-col items-center">
                <label htmlFor="regularPrice">Discount price</label>
                {formData.type === 'rent' && <span className="text-xs">($ / mouth)</span>}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              name="images"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImagesSubmit}
              className="p-3 w-24 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:text-gray-600 disabled:border-gray-600"
              disabled={!!progressImage}>
              {progressImage ? `${progressImage}%` : `Upload`}
            </button>
            <span className="text-red-600 tex-sm">{imageUploadError ? imageUploadError : ''}</span>
          </div>
          {formData.imageURLs.length > 0 &&
            formData.imageURLs.map((url, id) => {
              return (
                <div
                  key={`div_${id}`}
                  className="flex flex-row justify-between p-3 border border-gray-300 rounded-lg">
                  <img
                    key={`img_${id}`}
                    className="w-20 h-20 p-2 border border-gray-300 object-contain rounded-lg"
                    src={url}
                    alt={`image_${id}`}
                  />
                  <button
                    type="button"
                    onClick={(e) => handleDeleteImage(e, id)}
                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
                    Delete
                  </button>
                </div>
              );
            })}
          <button
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-4"
            disabled={isLoading || !!progressImage}>
            {isLoading ? 'Creating...' : 'Create listing'}
          </button>
          {error ? <span className="text-red-500">{error}</span> : ''}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
