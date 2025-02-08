export interface Generation {
  id: string;
  user_id: string;
  prompt: string | null;
  input_image_url: string | null;
  output_image_url: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      generations: {
        Row: Generation;
        Insert: Omit<Generation, 'id' | 'created_at'>;
        Update: Partial<Omit<Generation, 'id'>>;
      };
    };
  };
}