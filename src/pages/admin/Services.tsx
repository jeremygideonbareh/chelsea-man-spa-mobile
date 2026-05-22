import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
}

interface FormData {
  name: string;
  price: string;
  duration: string;
}

const DEFAULT_SERVICES: Service[] = [
  { id: 'svc-1', name: 'Classic Haircut', price: 95, duration_minutes: 45 },
  { id: 'svc-2', name: 'Beard Grooming & Trim', price: 65, duration_minutes: 30 },
  { id: 'svc-3', name: 'Signature Facial Spa', price: 150, duration_minutes: 60 },
  { id: 'svc-4', name: 'Royal Hot Stone Massage', price: 220, duration_minutes: 90 },
];

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({ name: '', price: '', duration: '' });

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
      const localCustom = JSON.parse(localStorage.getItem('chelsea_local_services') || '[]');
      const combined = [...dbServices];
      
      localCustom.forEach((customSvc: any) => {
        if (!combined.some(s => s.id === customSvc.id)) {
          combined.push(customSvc);
        }
      });
      setServices(combined);
    } catch (e) {
      console.warn('Failed to load services from DB, using localStorage:', e);
      const localServices = JSON.parse(localStorage.getItem('chelsea_local_services') || '[]');
      if (localServices.length === 0) {
        localStorage.setItem('chelsea_local_services', JSON.stringify(DEFAULT_SERVICES));
        setServices(DEFAULT_SERVICES);
      } else {
        setServices(localServices);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadServices(); }, [loadServices]);

  function openAdd() {
    setEditingId(null);
    setForm({ name: '', price: '', duration: '' });
    setModalOpen(true);
  }

  function openEdit(svc: Service) {
    setEditingId(svc.id);
    setForm({
      name: svc.name,
      price: String(svc.price),
      duration: String(svc.duration_minutes),
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
      const localServices = JSON.parse(localStorage.getItem('chelsea_local_services') || '[]');
      if (editingId) {
        const idx = localServices.findIndex((s: any) => s.id === editingId);
        if (idx !== -1) {
          localServices[idx] = { ...localServices[idx], ...payload };
        } else {
          localServices.push({ id: editingId, ...payload });
        }
      } else {
        localServices.push({
          id: `mock-svc-${Date.now()}`,
          ...payload
        });
      }
      localStorage.setItem('chelsea_local_services', JSON.stringify(localServices));
    }

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
    
    const localServices = JSON.parse(localStorage.getItem('chelsea_local_services') || '[]');
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
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Price</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Duration</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#6B655A] italic">No services found.</td>
                </tr>
              ) : (
                services.map((svc) => (
                  <tr key={svc.id} className="border-b border-white/5">
                    <td className="p-4 text-white">{svc.name}</td>
                    <td className="p-4 text-[#A3A3A3]">${svc.price}</td>
                    <td className="p-4 text-[#A3A3A3]">{svc.duration_minutes} min</td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => openEdit(svc)}
                        className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDelete(svc.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#3D1A1A] text-[#E87A7A] text-xs font-semibold"
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#A3A3A3] mb-1.5">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0A0A0A] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
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
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0A0A0A] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>
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
