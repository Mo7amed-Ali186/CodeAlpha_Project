import UrlModel from '../../../../DB/models/urlShortener.model.js';
import { asyncHandler } from '../../../utils/errorHandler.js';
import shortid from 'shortid';

export const originalUrl = asyncHandler(async (req, res, next) => {
  const { originalUrl } = req.body; // Extract originalUrl from request body
  const baseUrl = process.env.BASE_URL; // Get BASE_URL from environment variables

  if (!originalUrl) {
    return res.status(400).json('Invalid URL'); // Return 400 status if originalUrl is missing
  }
    // Check if the originalUrl already exists in the database
    let url = await UrlModel.findOne({ originalUrl });

    if (url) {
      // If URL exists, return the existing shortened URL
      return res.status(201).json({ message: "Done", url: url.shortUrl });
    } else {
      // If URL does not exist, generate a short URL using shortid
      const shortUrl = shortid.generate();
      // Create a new document in the database using UrlModel.create()
      url = await UrlModel.create({
        originalUrl,
        shortUrl,
      });
      // Return the newly created shortened URL
      return res.json(url);    }

});
export const getShortId = asyncHandler(async (req, res, next) => {
    const { shortUrl } = req.params; // Extract 'shortUrl' from URL parameters (e.g., /api/short-url/:shortUrl)
      // Query MongoDB to find the document with matching shortUrl
      const shortUrlDocument = await UrlModel.findOne({ shortUrl });
      if (shortUrlDocument) {
        // If document found, return it as JSON response
        return res.status(200).json({ message: 'Success', shortUrlDocument });
      } else {
        // If document not found, return a 404 status with an appropriate message
        return res.status(404).json({ message: 'Short URL not found' });
      }
  
  });
  

