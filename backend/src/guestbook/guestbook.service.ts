import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class GuestbookService {
  private supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  async findAll() {
    const { data } = await this.supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });
    return data;
  }

  async create(dto: { name: string; message: string }) {
    const { data } = await this.supabase
      .from('guestbook')
      .insert([dto])
      .select();
    return data;
  }

  async update(id: string, dto: { name: string; message: string }) {
    const { data } = await this.supabase
      .from('guestbook')
      .update(dto)
      .eq('id', id)
      .select();
    return data;
  }

  async delete(id: string) {
    await this.supabase.from('guestbook').delete().eq('id', id);
    return { success: true };
  }
}