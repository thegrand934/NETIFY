import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  description: string;
  videoUrl: string;
  trailerUrl?: string;
  thumbnailUrl: string;
  posterUrl: string;
  duration: number;
  genres: string[];
  releaseYear: number;
  isPremium: boolean;
  createdAt: Date;
}

const MovieSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  trailerUrl: { type: String },
  thumbnailUrl: { type: String, required: true },
  posterUrl: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  genres: [{ type: String }],
  releaseYear: { type: Number, required: true },
  isPremium: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMovie>('Movie', MovieSchema);
