require('dotenv').config({ path: '.env.local' });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function run() {
  try {
    console.log('1. Fetching upload preset: dasa_uploads...');
    
    // 1. Update the upload preset to ensure it's unsigned and public
    const updateResult = await cloudinary.api.update_upload_preset('dasa_uploads', {
      unsigned: true,
      access_mode: 'public',
      folder: 'DASA/resources', 
      resource_type: 'auto',
    });
    console.log('Update preset result:', updateResult.message || 'Success');

    // 2. Fetch existing resources in the resources folder
    console.log('2. Fetching existing private resources...');
    let nextCursor = null;
    let totalUpdated = 0;

    do {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'DASA/resources', // Or the folder where your PDFs are
        max_results: 100,
        next_cursor: nextCursor,
      });

      for (const resource of result.resources) {
        if (resource.access_mode === 'authenticated') {
           console.log(`Updating resource to public: ${resource.public_id}`);
           // Important: Change access_mode to public
           await cloudinary.api.update(resource.public_id, {
             access_mode: 'public',
             type: 'upload'
           });
           totalUpdated++;
        }
      }
      nextCursor = result.next_cursor;
    } while (nextCursor);

    console.log(`Successfully updated ${totalUpdated} resources to public.`);

  } catch (error) {
    console.error('Cloudinary Error:', error);
  }
}

run();
