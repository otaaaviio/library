import { Injectable, OnModuleInit } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
config();

@Injectable()
export class CloudinaryService implements OnModuleInit {
  onModuleInit() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(imageBase64: string, public_id: string): Promise<string> {
    await cloudinary.uploader
      .upload(imageBase64, {
        public_id: public_id,
      })
      .catch((err) => {
        throw err;
      });

    return cloudinary.url(public_id, {
      fetch_format: 'auto',
      quality: 'auto',
    });
  }
}
