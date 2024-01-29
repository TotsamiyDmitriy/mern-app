import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ListingType } from '../types/listing';
import axios, { AxiosResponse } from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import ListingCard from '../components/ListingCard';

const Home = () => {
  const [offerListings, setOfferListings] = useState<ListingType[]>();
  const [saleListings, setSaleListings] = useState<ListingType[]>();
  const [rentListings, setRentListings] = useState<ListingType[]>();

  SwiperCore.use([Navigation]);

  React.useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const { data } = await axios.get<ListingType[], AxiosResponse<ListingType[]>>(
          '/api/listing/get?offer=true&limit=4',
        );
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const { data } = await axios.get<ListingType[], AxiosResponse<ListingType[]>>(
          '/api/listing/get?type=rent&limit=4',
        );
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const { data } = await axios.get<ListingType[], AxiosResponse<ListingType[]>>(
          '/api/listing/get?type=sale&limit=4',
        );
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className=" text-gray-400 text-xs sm:text-sm">
          MERNState is the best place to find your next perfect place to live.
          <br />
          <Link
            to={'/search'}
            className="text-xs sm:text-sm text-blue-800 font-bold hover:underline">
            Let's get started...
          </Link>
        </div>
      </div>
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageURLs[0]}) center no-repeat`,
                  backgroundSize: 'contain',
                }}
                className="h-[500px]"></div>
            </SwiperSlide>
          ))}
      </Swiper>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-6 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent offers</h2>
              <Link className="text-sm text-blue-800 hover:underline" to={'/search?offer=true'}>
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id}></ListingCard>
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent rents</h2>
              <Link className="text-sm text-blue-800 hover:underline" to={'/search?type=rent'}>
                Show more place for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id}></ListingCard>
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent sales</h2>
              <Link className="text-sm text-blue-800 hover:underline" to={'/search&type=sale'}>
                Show more place for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id}></ListingCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
