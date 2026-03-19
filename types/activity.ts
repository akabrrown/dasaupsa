export interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  completed_at?: string;
  images: string[];
}



