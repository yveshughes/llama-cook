export interface VideoConfig {
  id: string;
  title: string;
  description: string;
  src: string;
  poster?: string;
  duration: number;
  width?: number;
  height?: number;
}

export const videos: VideoConfig[] = [
  {
    id: 'caprese-salad',
    title: 'Classic Caprese Salad',
    description: 'Watch as fresh tomatoes, mozzarella, and basil come together in this timeless Italian dish',
    src: '/caprese-placeholder.mp4',
    poster: '/caprese-placeholder-poster.jpg',
    duration: 12000, // 12 seconds
    width: 816,  // Actual video dimensions from the screenshot
    height: 459,
  },
];

export const getVideoById = (id: string): VideoConfig | undefined => {
  return videos.find(video => video.id === id);
};