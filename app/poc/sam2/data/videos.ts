export interface VideoConfig {
  id: string;
  title: string;
  description: string;
  src: string;
  poster?: string;
  duration: number;
}

export const videos: VideoConfig[] = [
  {
    id: 'caprese-salad',
    title: 'Classic Caprese Salad',
    description: 'Watch as fresh tomatoes, mozzarella, and basil come together in this timeless Italian dish',
    src: '/videos/caprese-salad.mp4',
    poster: '/videos/caprese-salad-poster.jpg',
    duration: 12000, // 12 seconds
  },
];

export const getVideoById = (id: string): VideoConfig | undefined => {
  return videos.find(video => video.id === id);
};