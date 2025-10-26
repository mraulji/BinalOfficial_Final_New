import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database Types
export interface CarouselItem {
  id: string
  url: string
  title: string
  subtitle: string
  position: number
  created_at?: string
  updated_at?: string
}

export interface GalleryItem {
  id: string
  url: string
  title?: string
  category?: string
  is_primary?: boolean
  created_at?: string
  updated_at?: string
}

export interface BudgetEntry {
  id: string
  customer_name: string
  email: string
  phone?: string
  event_date?: string
  services: string[]
  total_amount: number
  additional_notes?: string
  created_at?: string
  updated_at?: string
}

// Carousel Operations
export const carouselAPI = {
  // Get all carousel items
  async getAll(): Promise<CarouselItem[]> {
    console.log('🔄 Fetching carousel items from Supabase...')
    const { data, error } = await supabase
      .from('carousel_items')
      .select('*')
      .order('position', { ascending: true })
    
    if (error) {
      console.error('❌ Error fetching carousel:', error)
      throw error
    }
    
    console.log('✅ Carousel items loaded:', data?.length || 0)
    return data || []
  },

  // Update carousel item
  async updateItem(id: string, url: string): Promise<CarouselItem> {
    console.log(`🔄 Updating carousel item ${id} with new URL...`)
    const { data, error } = await supabase
      .from('carousel_items')
      .update({ 
        url, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error updating carousel:', error)
      throw error
    }
    
    console.log('✅ Carousel item updated:', data)
    return data
  },

  // Create carousel item
  async createItem(item: Omit<CarouselItem, 'created_at' | 'updated_at'>): Promise<CarouselItem> {
    console.log('🔄 Creating new carousel item...')
    const { data, error } = await supabase
      .from('carousel_items')
      .insert({
        ...item,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error creating carousel item:', error)
      throw error
    }
    
    console.log('✅ Carousel item created:', data)
    return data
  }
}

// Gallery Operations
export const galleryAPI = {
  // Get all gallery items
  async getAll(): Promise<GalleryItem[]> {
    console.log('🔄 Fetching gallery items from Supabase...')
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Error fetching gallery:', error)
      throw error
    }
    
    console.log('✅ Gallery items loaded:', data?.length || 0)
    return data || []
  },

  // Update gallery item
  async updateItem(id: string, url: string): Promise<GalleryItem> {
    console.log(`🔄 Updating gallery item ${id} with new URL...`)
    const { data, error } = await supabase
      .from('gallery_items')
      .update({ 
        url, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error updating gallery:', error)
      throw error
    }
    
    console.log('✅ Gallery item updated:', data)
    return data
  },

  // Create gallery item
  async createItem(item: Omit<GalleryItem, 'created_at' | 'updated_at'>): Promise<GalleryItem> {
    console.log('🔄 Creating new gallery item...')
    const { data, error } = await supabase
      .from('gallery_items')
      .insert({
        ...item,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error creating gallery item:', error)
      throw error
    }
    
    console.log('✅ Gallery item created:', data)
    return data
  }
}

// Budget Operations
export const budgetAPI = {
  // Get all budget entries
  async getAll(): Promise<BudgetEntry[]> {
    console.log('🔄 Fetching budget entries from Supabase...')
    const { data, error } = await supabase
      .from('budget_entries')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Error fetching budget entries:', error)
      throw error
    }
    
    console.log('✅ Budget entries loaded:', data?.length || 0)
    return data || []
  },

  // Create budget entry
  async createEntry(entry: Omit<BudgetEntry, 'id' | 'created_at' | 'updated_at'>): Promise<BudgetEntry> {
    console.log('🔄 Creating new budget entry...')
    const { data, error } = await supabase
      .from('budget_entries')
      .insert({
        ...entry,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error creating budget entry:', error)
      throw error
    }
    
    console.log('✅ Budget entry created:', data)
    return data
  }
}

// Real-time subscriptions for live updates
export const subscribeToChanges = {
  // Subscribe to carousel changes
  carousel: (callback: (payload: any) => void) => {
    console.log('🔄 Subscribing to carousel changes...')
    return supabase
      .channel('carousel_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'carousel_items' }, 
        callback
      )
      .subscribe()
  },

  // Subscribe to gallery changes
  gallery: (callback: (payload: any) => void) => {
    console.log('🔄 Subscribing to gallery changes...')
    return supabase
      .channel('gallery_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'gallery_items' }, 
        callback
      )
      .subscribe()
  }
}