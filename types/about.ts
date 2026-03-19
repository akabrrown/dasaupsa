export interface Profile {
  id: string;
  name: string;
  title: string;
  role: 'Authority' | 'Executive';
  photo_url?: string;
  email?: string;
  bio?: string;
  display_order: number;
  linkedin_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  whatsapp_url?: string;
  created_at?: string;
  updated_at?: string;
}

export type Authority = Profile;
export type Executive = Profile;



