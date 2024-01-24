import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listing'));
  }
};

export const getOneUserListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    next(errorHandler(404, 'Listing not found!'));
  }

  try {
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    next(errorHandler(404, 'Listing not found!'));
  }

  if (listing.userRef !== req.user.id) {
    next(errorHandler(401, 'You can edit only your own listings!'));
  }

  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit);
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    let furnished = req.query.furnished;
    let parking = req.query.parking;
    let type = req.query.type;
    let order = req.query.order || 'desc';
    let sort = req.query.sort || 'createdAt';
    const search = req.query.search || '';

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const listings = await Listing.find({
      name: { $regex: search, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
