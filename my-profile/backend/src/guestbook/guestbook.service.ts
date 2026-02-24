import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class GuestbookService {
  private supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  async findAll() {
    const { data, error } = await this.supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Supabase findAll error:', error);
      throw error;
    }
    
    return data;
  }

  async create(dto: { name: string; message: string }) {
    console.log('📝 Attempting to create:', dto);
    
    const { data, error } = await this.supabase
      .from('guestbook')
      .insert([dto])
      .select();
    
    if (error) {
      console.error('❌ Supabase create error:', error);
      throw error;
    }
    
    console.log('✅ Created successfully:', data);
    return data;
  }

  async update(id: string, dto: { name: string; message: string }) {
    const { data, error } = await this.supabase
      .from('guestbook')
      .update(dto)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('❌ Supabase update error:', error);
      throw error;
    }
    
    return data;
  }

  async delete(id: string) {
    const { error } = await this.supabase
      .from('guestbook')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('❌ Supabase delete error:', error);
      throw error;
    }
    
    return { success: true };
  }
}