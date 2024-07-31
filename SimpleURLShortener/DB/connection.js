import mongoose from 'mongoose';

export const connection = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.error("Failed to connect to DB", error);
  }
};

