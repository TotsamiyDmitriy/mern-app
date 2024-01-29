import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListingType } from '../types/listing';
import axios, { AxiosResponse } from 'axios';
import ListingCard from '../components/ListingCard';

interface SidebarDataType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  search: string;
  type: 'all' | 'rent' | 'sale';
  parking: boolean;
  furnished: boolean;
  offer: boolean;
  sort: string;
  order: string;
}

const Search: React.FC = () => {
  const [sidebarData, setSidebarData] = useState<SidebarDataType>({
    search: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });
  const [listings, setListings] = useState<ListingType[]>([]);
  const [loading, setLoading] = useState(false);

  const [showMore, setShowMore] = useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const search = urlParams.get('search');
    const type = urlParams.get('type');
    const parking = urlParams.get('parking');
    const furnished = urlParams.get('furnished');
    const offer = urlParams.get('offer');
    const sort = urlParams.get('sort');
    const order = urlParams.get('order');

    if (search || type || parking || furnished || offer || sort || order) {
      setSidebarData({
        search: search || '',
        type: (type as SidebarDataType['type']) || 'all',
        parking: parking === 'true' ? true : false,
        furnished: furnished === 'true' ? true : false,
        offer: offer === 'true' ? true : false,
        sort: sort || 'created_at',
        order: order || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const { data } = await axios.get<ListingType[], AxiosResponse<ListingType[]>>(
        `/api/listing/get?${searchQuery}`,
      );
      if (data.length > 8) {
        setShowMore(true);
      }
      setListings(data);
      setLoading(false);
    };
    fetchListings();
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => {
    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, search: e.target.value });
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setSidebarData({
        ...sidebarData,
        [e.target.id]: e.currentTarget.checked,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const onShowMoreClick: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    const numberOfListings = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', `${numberOfListings}`);
    const searchQuery = urlParams.toString();
    const { data } = await axios.get(`/api/listing/get?${searchQuery}`);
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    for (const key in sidebarData) {
      urlParams.set(key, sidebarData[key]);
    }
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 sm:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term:</label>
            <input
              type="text"
              className="border rounded-lg p-3 w-full"
              id="searchTerm"
              placeholder="Search..."
              value={sidebarData.search}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="whitespace-nowrap font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="all"
                checked={sidebarData.type === 'all'}
                onChange={handleChange}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="rent"
                checked={sidebarData.type === 'rent'}
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="sale"
                checked={sidebarData.type === 'sale'}
                onChange={handleChange}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="offer"
                checked={sidebarData.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="whitespace-nowrap font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="parking"
                checked={sidebarData.parking}
                onChange={handleChange}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="furnished"
                checked={sidebarData.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Sort:</label>
            <select
              className="border rounded-lg p-3"
              id="sort_order"
              onChange={handleChange}
              defaultValue={'created_at_desc'}>
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xt text-slate-700">No listing found!</p>
          )}
          {loading && <p className="text-xl text-slate-700 text-center w-full">Loading...</p>}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing}></ListingCard>
            ))}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full">
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
