import express from 'express';
import {
  createListing,
  getUserListings,
  getOneUserListing,
  getListings,
  deleteListing,
  updateListing,
} from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);

router.get('/get', getListings);

router.get('/:id', verifyToken, getUserListings);

router.get('/get/:id', getOneUserListing);

router.post('/update/:id', verifyToken, updateListing);

router.delete('/delete/:id', verifyToken, deleteListing);

export default router;
