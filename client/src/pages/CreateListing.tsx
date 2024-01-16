import React from 'react';

const CreateListing: React.FC = () => {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create listing</h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            className="border p-3 rounded-lg"
            placeholder="name"
            name="name"
            id="name"
            maxLength={62}
            minLength={10}
            required
          />
          <textarea
            className="border p-3 rounded-lg"
            placeholder="Description"
            name="description"
            id="description"
            required
          />
          <input
            type="text"
            className="border p-3 rounded-lg"
            placeholder="Address"
            name="address"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" name="sell" id="sell" />
              <label htmlFor="sell">Sell</label>
              <input type="checkbox" className="w-5" name="rent" id="rent" />
              <label htmlFor="rent">Rent</label>
              <input type="checkbox" className="w-5" name="parking" id="parking" />
              <label htmlFor="parking">Parking spot</label>
              <input type="checkbox" className="w-5" name="furnished" id="furnished" />
              <label htmlFor="furnished">Furnished</label>
              <input type="checkbox" className="w-5" name="offer" id="offer" />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="p-3 border-gray-300 rounded-lg"
                name="bedrooms"
                id="bedrooms"
                min={1}
                max={10}
                required
              />
              <label htmlFor="bedrooms">Beds</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="p-3 border-gray-300 rounded-lg"
                name="bathrooms"
                id="bathrooms"
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
              className="p-3 border-gray-300 rounded-lg"
              name="regularPrice"
              id="regularPrice"
              required
            />
            <div className="flex flex-col items-center">
              <label htmlFor="regularPrice">Regular price</label>
              <span className="text-xs">($ / mouth)</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="p-3 border-gray-300 rounded-lg"
              name="discountPrice"
              id="discountPrice"
              required
            />
            <div className="flex flex-col items-center">
              <label htmlFor="regularPrice">Discount price</label>
              <span className="text-xs">($ / mouth)</span>
            </div>
          </div>
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
              className="p-3 border border-gray-300 rounded w-full"
              name="images"
              id="images"
              accept="image/*"
              multiple
            />
            <button className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
              Upload
            </button>
          </div>
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-4">
            Create listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
