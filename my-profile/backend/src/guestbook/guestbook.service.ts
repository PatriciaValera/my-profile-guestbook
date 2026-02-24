// backend/src/guestbook/guestbook.service.ts
import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class GuestbookService {
  private supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  async findAll() {
    try {
      const { data, error } = await this.supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching entries:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('FindAll error:', error);
      return [];
    }
  }

  async create(dto: { name: string; message: string }) {
    try {
      console.log('Creating entry:', dto); // Debug log
      
      const { data, error } = await this.supabase
        .from('guestbook')
        .insert([dto])
        .select();
      
      if (error) {
        console.error('Error creating entry:', error);
        throw error;
      }
      
      console.log('Created entry:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }
  }

  async update(id: string, dto: { name: string; message: string }) {
    try {
      const { data, error } = await this.supabase
        .from('guestbook')
        .update(dto)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error updating entry:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const { error } = await this.supabase
        .from('guestbook')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting entry:', error);
        throw error;
      }
      
      return { success: true };
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }
}