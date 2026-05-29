import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
  category?: string;
  description?: string;
  image_url?: string;
}

interface FormData {
  name: string;
  price: string;
  duration: string;
  category: string;
  description: string;
}

const CATEGORY_IMAGES: Record<string, string> = {
  'Haircut & Styling': 'images/service-haircut.jpg',
  'Hair Color & Treatments': 'images/service-haircut.jpg',
  'Shaving & Beard Care': 'images/service-beard.jpg',
  'Nail Care & Grooming': 'images/service-facial.jpg',
  'Skincare & Massages': 'images/service-facial.jpg',
  'Waxing & Hair Removal': 'images/service-massage.jpg',
};

const DEFAULT_SERVICES: Service[] = [
  { id: 'svc-hc1', name: 'Hair Cut & Beard', price: 190, duration_minutes: 60, category: 'Haircut & Styling', image_url: 'images/service-haircut.jpg', description: 'Complete haircut with beard trim and shaping.' },
  { id: 'svc-hc2', name: "Men's Hair Cut", price: 130, duration_minutes: 30, category: 'Haircut & Styling', image_url: 'images/service-haircut.jpg', description: 'Precision haircut tailored to your style.' },
  { id: 'svc-hc3', name: 'Skin Fade (Perfect Skin Fade Hair Cut)', price: 160, duration_minutes: 30, category: 'Haircut & Styling', image_url: 'images/service-haircut.jpg', description: 'Perfect skin fade haircut for a clean look.' },
  { id: 'svc-hc4', name: 'Buzz Cut', price: 110, duration_minutes: 20, category: 'Haircut & Styling', image_url: 'images/service-haircut.jpg', description: 'Quick and clean buzz cut.' },
  { id: 'svc-hc5', name: 'Kids Hair Cut (Juniors)', price: 110, duration_minutes: 30, category: 'Haircut & Styling', image_url: 'images/service-haircut.jpg', description: 'Haircut for juniors in a comfortable setting.' },
  { id: 'svc-hc6', name: 'Line Up & Clean The Neck (From the back)', price: 55, duration_minutes: 15, category: 'Haircut & Styling', image_url: 'images/service-haircut.jpg', description: 'Neat line up and neck clean-up.' },
  { id: 'svc-hc7', name: 'Hair Wash and Blow Dry', price: 80, duration_minutes: 15, category: 'Haircut & Styling', image_url: 'images/service-haircut.jpg', description: 'Refreshing hair wash with blow dry finish.' },
  { id: 'svc-col1', name: 'Shades of Colors (Zero Ammonia)', price: 160, duration_minutes: 15, category: 'Hair Color & Treatments', image_url: 'images/service-haircut.jpg', description: 'Ammonia-free color shades for a natural look.' },
  { id: 'svc-col2', name: 'Hair Color for Men', price: 160, duration_minutes: 40, category: 'Hair Color & Treatments', image_url: 'images/service-haircut.jpg', description: 'Professional hair color application for men.' },
  { id: 'svc-col3', name: 'Silver Hair Color', price: 600, duration_minutes: 60, category: 'Hair Color & Treatments', image_url: 'images/service-haircut.jpg', description: 'Premium silver hair color treatment.' },
  { id: 'svc-col4', name: 'Highlights (Short Hair)', price: 360, duration_minutes: 60, category: 'Hair Color & Treatments', image_url: 'images/service-haircut.jpg', description: 'Professional highlights for short hair.' },
  { id: 'svc-col5', name: 'Highlights (Long Hair)', price: 485, duration_minutes: 60, category: 'Hair Color & Treatments', image_url: 'images/service-haircut.jpg', description: 'Professional highlights for long hair.' },
  { id: 'svc-col6', name: 'Beard Color / Dye', price: 80, duration_minutes: 15, category: 'Hair Color & Treatments', image_url: 'images/service-beard.jpg', description: 'Beard color and dye application.' },
  { id: 'svc-col7', name: 'Mask Hair Treatment (Deep conditioning)', price: 150, duration_minutes: 15, category: 'Hair Color & Treatments', image_url: 'images/service-haircut.jpg', description: 'Deep conditioning mask treatment for healthy hair.' },
  { id: 'svc-col8', name: 'Keratin Treatment', price: 550, duration_minutes: 60, category: 'Hair Color & Treatments', image_url: 'images/service-haircut.jpg', description: 'Smoothing keratin treatment for frizz-free hair.' },
  { id: 'svc-col9', name: 'Collagen Hair Treatment', price: 600, duration_minutes: 60, category: 'Hair Color & Treatments', image_url: 'images/service-haircut.jpg', description: 'Collagen hair restoration treatment.' },
  { id: 'svc-sv1', name: 'Beard Style (Trim/Shaping)', price: 80, duration_minutes: 30, category: 'Shaving & Beard Care', image_url: 'images/service-beard.jpg', description: 'Beard trim and shaping for a sharp look.' },
  { id: 'svc-sv2', name: 'Royal Shave Spa', price: 160, duration_minutes: 30, category: 'Shaving & Beard Care', image_url: 'images/service-beard.jpg', description: 'Luxurious straight razor shave with hot towels.' },
  { id: 'svc-sv3', name: 'Shave (Razor / Straight Razor)', price: 65, duration_minutes: 15, category: 'Shaving & Beard Care', image_url: 'images/service-beard.jpg', description: 'Clean shave with razor or straight razor.' },
  { id: 'svc-sv4', name: 'Express Shave Machine', price: 60, duration_minutes: 15, category: 'Shaving & Beard Care', image_url: 'images/service-beard.jpg', description: 'Quick and precise machine shave.' },
  { id: 'svc-nl1', name: 'Manicure', price: 90, duration_minutes: 30, category: 'Nail Care & Grooming', image_url: 'images/service-facial.jpg', description: 'Professional manicure for well-groomed hands.' },
  { id: 'svc-nl2', name: 'Pedicure', price: 120, duration_minutes: 45, category: 'Nail Care & Grooming', image_url: 'images/service-facial.jpg', description: 'Professional pedicure for refreshed feet.' },
  { id: 'svc-nl3', name: 'Manicure & Pedicure', price: 190, duration_minutes: 60, category: 'Nail Care & Grooming', image_url: 'images/service-facial.jpg', description: 'Complete hand and foot grooming package.' },
  { id: 'svc-nl4', name: 'Spa Manicure', price: 150, duration_minutes: 60, category: 'Nail Care & Grooming', image_url: 'images/service-facial.jpg', description: 'Luxury spa manicure experience.' },
  { id: 'svc-nl5', name: 'Spa Pedicure', price: 180, duration_minutes: 60, category: 'Nail Care & Grooming', image_url: 'images/service-facial.jpg', description: 'Luxury spa pedicure experience.' },
  { id: 'svc-nl6', name: 'Nails Cut & Shape', price: 60, duration_minutes: 60, category: 'Nail Care & Grooming', image_url: 'images/service-facial.jpg', description: 'Nail cutting and shaping service.' },
  { id: 'svc-nl7', name: 'Paraffin Wax Treatments (Feet and Hands)', price: 200, duration_minutes: 60, category: 'Nail Care & Grooming', image_url: 'images/service-facial.jpg', description: 'Paraffin wax treatment for soft hands and feet.' },
  { id: 'svc-sk1', name: 'Soothing Facial', price: 250, duration_minutes: 60, category: 'Skincare & Massages', image_url: 'images/service-facial.jpg', description: 'Relaxing and rejuvenating facial treatment.' },
  { id: 'svc-sk2', name: 'Facial Deep Cleansing Skin', price: 400, duration_minutes: 60, category: 'Skincare & Massages', image_url: 'images/service-facial.jpg', description: 'Deep cleansing facial for clear, healthy skin.' },
  { id: 'svc-sk3', name: 'Facial for Sensitive Skin', price: 350, duration_minutes: 60, category: 'Skincare & Massages', image_url: 'images/service-facial.jpg', description: 'Gentle facial treatment for sensitive skin.' },
  { id: 'svc-sk4', name: 'Face Massage', price: 50, duration_minutes: 15, category: 'Skincare & Massages', image_url: 'images/service-facial.jpg', description: 'Quick face massage for relaxation.' },
  { id: 'svc-wx1', name: 'Underarms Waxing', price: 60, duration_minutes: 60, category: 'Waxing & Hair Removal', image_url: 'images/service-massage.jpg', description: 'Underarm waxing for smooth skin.' },
  { id: 'svc-wx2', name: 'Full Arms/Legs Wax Hair Removal', price: 150, duration_minutes: 60, category: 'Waxing & Hair Removal', image_url: 'images/service-massage.jpg', description: 'Full arm or leg waxing service.' },
  { id: 'svc-wx3', name: 'Full Chest Wax Hair Removal', price: 100, duration_minutes: 60, category: 'Waxing & Hair Removal', image_url: 'images/service-massage.jpg', description: 'Full chest waxing for a smooth look.' },
  { id: 'svc-wx4', name: 'Full Back Wax Hair Removal', price: 150, duration_minutes: 60, category: 'Waxing & Hair Removal', image_url: 'images/service-massage.jpg', description: 'Full back waxing service.' },
];

function getServiceCategory(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('beard') || n.includes('shave') || n.includes('shaver') || n.includes('razor')) {
    return 'Shaving & Beard Care';
  }
  if (n.includes('color') || n.includes('dye') || n.includes('highlight') || n.includes('keratin') || n.includes('collagen') || n.includes('treatment') || n.includes('mask')) {
    return 'Hair Color & Treatments';
  }
  if (n.includes('manicure') || n.includes('pedicure') || n.includes('nail') || n.includes('paraffin')) {
    return 'Nail Care & Grooming';
  }
  if (n.includes('facial') || n.includes('massage') || n.includes('skincare')) {
    return 'Skincare & Massages';
  }
  if (n.includes('waxing') || n.includes('hair removal')) {
    return 'Waxing & Hair Removal';
  }
  return 'Haircut & Styling';
}

function getServiceImageUrl(name: string, category: string): string {
  return CATEGORY_IMAGES[category] || 'images/service-haircut.jpg';
}

function getLocalStorageArray<T>(key: string, defaultVal: T[]): T[] {
  try {
    const val = localStorage.getItem(key);
    if (!val) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  } catch (e) {
    console.warn(`Failed to parse localStorage key "${key}":`, e);
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({ name: '', price: '', duration: '', category: 'Haircut & Styling', description: '' });

  const loadServices = useCallback(async () => {
    try {
      const servicesPromise = supabase
        .from('services')
        .select('*')
        .order('name', { ascending: true });
        
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Services fetch timed out')), 2500)
      );

      const { data, error } = await Promise.race([servicesPromise, timeoutPromise]);
      if (error) throw error;
      
      const dbServices = data || [];
      const mappedDbServices = dbServices.map((svc: any) => {
        const category = svc.category || getServiceCategory(svc.name || '');
        const image_url = svc.image_url || getServiceImageUrl(svc.name || '', category);
        return {
          ...svc,
          category,
          image_url
        };
      });

      setServices(mappedDbServices);
    } catch (e) {
      console.warn('Failed to load services from DB, using defaults:', e);
      const mappedLocal = DEFAULT_SERVICES.map((svc: any) => {
        const category = svc.category || getServiceCategory(svc.name || '');
        const image_url = svc.image_url || getServiceImageUrl(svc.name || '', category);
        return {
          ...svc,
          category,
          image_url
        };
      });
      setServices(mappedLocal);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadServices(); }, [loadServices]);

  function openAdd() {
    setEditingId(null);
    setForm({ name: '', price: '', duration: '', category: 'Haircut & Styling', description: '' });
    setModalOpen(true);
  }

  function openEdit(svc: Service) {
    setEditingId(svc.id);
    setForm({
      name: svc.name || '',
      price: String(svc.price || ''),
      duration: String(svc.duration_minutes || ''),
      category: svc.category || getServiceCategory(svc.name || ''),
      description: svc.description || '',
    });
    setModalOpen(true);
  }

  function openDelete(id: string) {
    setDeletingId(id);
    setDeleteModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      price: parseFloat(form.price) || 0,
      duration_minutes: parseInt(form.duration) || 30,
      description: form.description.trim(),
    };

    try {
      if (editingId) {
        if (editingId.startsWith('svc-') || editingId.startsWith('mock-')) {
          throw new Error('Local service update bypass');
        }
        const { error } = await supabase.from('services').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('services').insert([payload]);
        if (error) throw error;
      }
    } catch (err) {
      console.warn('Supabase service write failed, falling back to localStorage:', err);
    }

    const localServices = getLocalStorageArray('chelsea_local_services', DEFAULT_SERVICES);
    const image_url = getServiceImageUrl(payload.name, form.category);
    const fullPayload = {
      ...payload,
      category: form.category,
      image_url,
    };

    if (editingId) {
      const idx = localServices.findIndex((s: any) => s.id === editingId);
      if (idx !== -1) {
        localServices[idx] = { ...localServices[idx], ...fullPayload, id: editingId };
      } else {
        localServices.push({ id: editingId, ...fullPayload });
      }
    } else {
      localServices.push({
        id: `mock-svc-${Date.now()}`,
        ...fullPayload
      });
    }
    localStorage.setItem('chelsea_local_services', JSON.stringify(localServices));

    setModalOpen(false);
    await loadServices();
  }

  async function handleDelete() {
    if (!deletingId) return;
    try {
      if (deletingId.startsWith('svc-') || deletingId.startsWith('mock-')) {
        throw new Error('Local service delete bypass');
      }
      const { error } = await supabase.from('services').delete().eq('id', deletingId);
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase service delete failed, falling back to localStorage:', err);
    }
    
    const localServices = getLocalStorageArray('chelsea_local_services', DEFAULT_SERVICES);
    const filtered = localServices.filter((s: any) => s.id !== deletingId);
    localStorage.setItem('chelsea_local_services', JSON.stringify(filtered));

    setDeleteModalOpen(false);
    setDeletingId(null);
    await loadServices();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-900">Services Manager</h1>
        <button
          onClick={openAdd}
          className="px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors"
        >
          + Add New Service
        </button>
      </div>

      <div className="white-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600 border-b border-slate-100 bg-slate-50">
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Name</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Category</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Description</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Price</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Duration</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 italic">No services found.</td>
                </tr>
              ) : (
                services.map((svc) => (
                  <tr key={svc.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-slate-900 font-medium">{svc.name}</td>
                    <td className="p-4">
                      <span className="inline-block text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                        {svc.category || getServiceCategory(svc.name || '')}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-xs max-w-[220px] truncate" title={svc.description || ''}>
                      {svc.description || '—'}
                    </td>
                    <td className="p-4 text-slate-700">AED {svc.price}</td>
                    <td className="p-4 text-slate-500">{svc.duration_minutes} min</td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => openEdit(svc)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDelete(svc.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {editingId ? 'Edit Service' : 'Add New Service'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1.5">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg refined-input"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-slate-600 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-2 py-2.5 rounded-lg refined-input"
                  >
                    <option value="Haircut & Styling">Haircut & Styling</option>
                    <option value="Hair Color & Treatments">Hair Color & Treatments</option>
                    <option value="Shaving & Beard Care">Shaving & Beard Care</option>
                    <option value="Nail Care & Grooming">Nail Care & Grooming</option>
                    <option value="Skincare & Massages">Skincare & Massages</option>
                    <option value="Waxing & Hair Removal">Waxing & Hair Removal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1.5">Price (AED)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-2 py-2.5 rounded-lg refined-input"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1.5">Duration (min)</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full px-2 py-2.5 rounded-lg refined-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg refined-input resize-none"
                  placeholder="Service description..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors"
                >
                  {editingId ? 'Update Service' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteModalOpen(false); }}
        >
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Delete Service</h2>
            <p className="text-sm text-slate-500 mb-6">Are you sure you want to delete this service? This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
