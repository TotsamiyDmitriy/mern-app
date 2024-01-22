import axios, { AxiosError, AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ListingType } from '../types/listing';

import SwiperCore from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking } from 'react-icons/fa';

const Listing: React.FC = () => {
  const [listing, setListing] = useState<ListingType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();

  SwiperCore.use([Navigation]);

  React.useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      try {
        const { data } = await axios.get<ListingType, AxiosResponse<ListingType>>(
          `/api/listing/get/${params.id}`,
        );
        setListing(data);
        setLoading(false);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error);
          setError(error.message);
          setLoading(false);
        } else if (typeof error === 'string') {
          setError(error);
        }
      }
    };
    fetchListing();
  }, [params.id]);
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && <p className="text-center my-7 text-2xl">{error}</p>}
      {listing && !loading && !error && (
        <div className="">
          <Swiper navigation>
            {listing.imageURLs.map((url) => (
              <SwiperSlide key={url}>
                <div
                  key={url}
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-1 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600 my-2 text-sm">
              <FaMapMarkerAlt />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === 'rent' ? 'For rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountPrice}
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="flex flex-row flex-wrap items-center gap-4 sm:gap-6 text-green-900 font-semibold text-sm">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed />
                {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath />
                {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking />
                {listing.parking ? `Parking spot` : `No parking`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair />
                {listing.furnished ? `Furnished` : `Unfurnished`}
              </li>
            </ul>
          </div>
        </div>
      )}
    </main>
  );
};

export default Listing;
