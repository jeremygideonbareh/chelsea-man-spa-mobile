export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: 'admin' | 'staff' | 'customer' | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: 'admin' | 'staff' | 'customer' | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          role?: 'admin' | 'staff' | 'customer' | null;
        };
      };
      customers: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
        };
      };
      services: {
        Row: {
          id: string;
          name: string | null;
          description: string | null;
          price: number | null;
          duration_minutes: number | null;
          image_url: string | null;
          category: string | null;
        };
        Insert: {
          id?: string;
          name?: string | null;
          description?: string | null;
          price?: number | null;
          duration_minutes?: number | null;
          image_url?: string | null;
          category?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
          description?: string | null;
          price?: number | null;
          duration_minutes?: number | null;
          image_url?: string | null;
          category?: string | null;
        };
      };
      bookings: {
        Row: {
          id: string;
          customer_id: string | null;
          service_id: string | null;
          booking_time: string | null;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          customer_id?: string | null;
          service_id?: string | null;
          booking_time?: string | null;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          customer_id?: string | null;
          service_id?: string | null;
          booking_time?: string | null;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | null;
          created_at?: string | null;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Customer = Database['public']['Tables']['customers']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];
export type Booking = Database['public']['Tables']['bookings']['Row'];
