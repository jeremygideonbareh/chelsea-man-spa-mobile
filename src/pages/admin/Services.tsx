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

const DEFAULT_SERVICES: Service[] = [
  {
    id: 'svc-1',
    name: 'Classic Haircut',
    price: 95,
    duration_minutes: 45,
    category: 'Hair',
    image_url: 'images/service-haircut.jpg',
    description: 'Premium haircut tailored to your style.'
  },
  {
    id: 'svc-2',
    name: 'Beard Grooming & Trim',
    price: 65,
    duration_minutes: 30,
    category: 'Beard',
    image_url: 'images/service-beard.jpg',
    description: 'Beard shaping, line-up, and beard oil treatment.'
  },
  {
    id: 'svc-3',
    name: 'Signature Facial Spa',
    price: 150,
    duration_minutes: 60,
    category: 'Spa',
    image_url: 'images/service-facial.jpg',
    description: 'Deep cleansing and skin rejuvenation facial.'
  },
  {
    id: 'svc-4',
    name: 'Royal Hot Stone Massage',
    price: 220,
    duration_minutes: 90,
    category: 'Spa',
    image_url: 'images/service-massage.jpg',
    description: 'Ultimate relaxation massage using heated volcanic stones.'
  },
];

function getServiceCategory(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('beard') || n.includes('shave') || n.includes('mustache') || n.includes('trim')) {
    return 'Beard';
  }
  if (n.includes('spa') || n.includes('facial') || n.includes('massage') || n.includes('scrub') || n.includes('towel') || n.includes('stone') || n.includes('wash')) {
    return 'Spa';
  }
  return 'Hair';
}

function getServiceImageUrl(name: string, category: string): string {
  const cat = category.toLowerCase();
  if (cat === 'beard') {
    return 'images/service-beard.jpg';
  }
  if (cat === 'spa') {
    if (name.toLowerCase().includes('massage')) {
      return 'images/service-massage.jpg';
    }
    return 'images/service-facial.jpg';
  }
  return 'images/service-haircut.jpg';
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
  const [form, setForm] = useState<FormData>({ name: '', price: '', duration: '', category: 'Hair', description: '' });

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

      const localCustom = getLocalStorageArray('chelsea_local_services', DEFAULT_SERVICES);
      const mappedLocalCustom = localCustom.map((svc: any) => {
        const category = svc.category || getServiceCategory(svc.name || '');
        const image_url = svc.image_url || getServiceImageUrl(svc.name || '', category);
        return {
          ...svc,
          category,
          image_url
        };
      });

      // Merge: local customized versions take precedence (override database categories/descriptions/etc.)
      const combined = mappedDbServices.map((dbSvc) => {
        const localVersion = mappedLocalCustom.find((s: any) => s.id === dbSvc.id);
        if (localVersion) {
          return {
            ...dbSvc,
            ...localVersion,
          };
        }
        return dbSvc;
      });

      mappedLocalCustom.forEach((customSvc: any) => {
        if (!combined.some(s => s.id === customSvc.id)) {
          combined.push(customSvc);
        }
      });
      setServices(combined);
    } catch (e) {
      console.warn('Failed to load services from DB, using localStorage:', e);
      const localServices = getLocalStorageArray('chelsea_local_services', DEFAULT_SERVICES);
      const mappedLocal = localServices.map((svc: any) => {
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
    setForm({ name: '', price: '', duration: '', category: 'Hair', description: '' });
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

    // Always sync with localStorage to keep locally consistent
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
        <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Services Manager</h1>
        <button
          onClick={openAdd}
          className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:opacity-85 transition-opacity"
        >
          + Add New Service
        </button>
      </div>

      <div className="bg-[#0F0F0F] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#D4AF37] border-b border-white/5 bg-[#1A1814]">
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
                  <td colSpan={6} className="p-8 text-center text-[#6B655A] italic">No services found.</td>
                </tr>
              ) : (
                services.map((svc) => (
                  <tr key={svc.id} className="border-b border-white/5">
                    <td className="p-4 text-white font-medium">{svc.name}</td>
                    <td className="p-4">
                      <span className="inline-block text-[10px] px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] font-semibold">
                        {svc.category || getServiceCategory(svc.name || '')}
                      </span>
                    </td>
                    <td className="p-4 text-[#A3A3A3] text-xs max-w-[220px] truncate" title={svc.description || ''}>
                      {svc.description || '—'}
                    </td>
                    <td className="p-4 text-[#A3A3A3]">AED {svc.price}</td>
                    <td className="p-4 text-[#A3A3A3]">{svc.duration_minutes} min</td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => openEdit(svc)}
                        className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:opacity-85 transition-opacity"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDelete(svc.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#3D1A1A] text-[#E87A7A] text-xs font-semibold hover:bg-red-500/20 transition-colors"
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
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="bg-[#12110E] border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-white mb-4">
              {editingId ? 'Edit Service' : 'Add New Service'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-[#A3A3A3] mb-1.5">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#0A0A0A] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-[#A3A3A3] mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-2 py-2.5 rounded-lg bg-[#0A0A0A] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  >
                    <option value="Hair">Hair</option>
                    <option value="Beard">Beard</option>
                    <option value="Spa">Spa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#A3A3A3] mb-1.5">Price (AED)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-2 py-2.5 rounded-lg bg-[#0A0A0A] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#A3A3A3] mb-1.5">Duration (min)</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full px-2 py-2.5 rounded-lg bg-[#0A0A0A] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#A3A3A3] mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#0A0A0A] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                  placeholder="Service description..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-[#A3A3A3] text-sm font-medium hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#D4AF37] text-black text-sm font-semibold hover:opacity-85 transition-opacity"
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
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteModalOpen(false); }}
        >
          <div className="bg-[#12110E] border border-white/10 rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-white mb-2">Delete Service</h2>
            <p className="text-sm text-[#A3A3A3] mb-6">Are you sure you want to delete this service? This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-[#A3A3A3] text-sm font-medium hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#3D1A1A] text-[#E87A7A] text-sm font-semibold hover:bg-red-500/20 transition-colors"
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
