import express from 'express';
import { createListing } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);

router.post('/create', createListing);

router.post('/update', verifyToken, createListing);

router.delete('/delete', verifyToken, createListing);

export default router;
