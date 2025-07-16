// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const path = require('path');

// cloudinary.config({
//   cloud_name: 'dv12fxp4w',
//   api_key: '188784282419438',
//   api_secret: 'Kcx3fOU-lGD5_gcA7QEDc4TSr9g',
// });

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     const originalName = file.originalname;
//     const extension = path.extname(originalName);       
//     const baseName = path.basename(originalName, extension); 
//     const cleanName = baseName.replace(/[^a-zA-Z0-9-_]/g, '_');
//     return {
//       folder: 'fyp_uploads',
//       resource_type: file.mimetype === 'application/pdf'
//         ? 'raw' 
//         : file.mimetype.startsWith('video')
//           ? 'video'
//           : 'auto',
//       public_id: `${Date.now()}-${cleanName}`,
//       format: extension.replace('.', ''), 
//     };
//   },
// });

// module.exports = {
//   cloudinary,
//   storage,
// };


const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'YOUR_CLOUD_NAME',
  api_key: 'YOUR_KEY',
  api_secret: 'YOUR_SECRET',
});

module.exports = cloudinary;
