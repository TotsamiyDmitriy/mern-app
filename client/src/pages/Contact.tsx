import React, { useState } from 'react';
import { ListingType } from '../types/listing';
import axios, { AxiosResponse } from 'axios';
import { User } from '../types/userSlice';
import { Link } from 'react-router-dom';

type ContactProps = {
  listing: ListingType;
};

const Contact: React.FC<ContactProps> = ({ listing }) => {
  const [landlord, setLandlord] = useState<User | null>(null);
  const [message, setMessage] = useState<string>('');

  const onChangeHandler: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setMessage(e.target.value);
  };

  React.useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const { data } = await axios.get<User, AxiosResponse<User>>(`/api/user/${listing.userRef}`);
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <div>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p className="font-semibold">
            Contact <span>{landlord.username}</span> for <span>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            className="w-full border p-3 rounded-lg"
            name="message"
            id="message"
            rows={2}
            value={message}
            onChange={onChangeHandler}
            placeholder="Enter your message here..."
          />
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95">
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
};

export default Contact;
