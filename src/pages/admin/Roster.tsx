import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Stylist {
  id: string;
  name: string;
  role: string;
  is_active: boolean;
}

interface FormData {
  name: string;
  role: string;
}

export default function AdminRoster() {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({ name: '', role: '' });

  const loadStylists = useCallback(async () => {
    try {
      const fetchPromise = supabase
        .from('stylists')
        .select('*')
        .order('name', { ascending: true });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Stylists fetch timed out')), 2500)
      );

      const raceResult = await Promise.race([fetchPromise, timeoutPromise]);
      const data = raceResult?.data;
      const error = raceResult?.error;
      if (error) throw error;

      const dbStylists = data || [];
      const localCustom = JSON.parse(localStorage.getItem('chelsea_local_stylists') || '[]');
      const combined = [...dbStylists];
      localCustom.forEach((customSty: any) => {
        if (!combined.some(s => s.id === customSty.id)) {
          combined.push(customSty);
        }
      });
      setStylists(combined);
    } catch (err) {
      console.warn('Failed to load stylists from DB, using localStorage:', err);
      const localStylists = JSON.parse(localStorage.getItem('chelsea_local_stylists') || '[]');
      if (localStylists.length === 0) {
        const defaultStylists = [
          { id: 'st-1', name: 'Alex', role: 'Barber', is_active: true },
          { id: 'st-2', name: 'Marco', role: 'Barber', is_active: true },
        ];
        localStorage.setItem('chelsea_local_stylists', JSON.stringify(defaultStylists));
        setStylists(defaultStylists);
      } else {
        setStylists(localStylists);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStylists(); }, [loadStylists]);

  function openAdd() {
    setEditingId(null);
    setForm({ name: '', role: '' });
    setModalOpen(true);
  }

  function openEdit(stylist: Stylist) {
    setEditingId(stylist.id);
    setForm({ name: stylist.name, role: stylist.role || '' });
    setModalOpen(true);
  }

  function openDelete(id: string) {
    setDeletingId(id);
    setDeleteModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;

    const payload = { name: form.name.trim(), role: form.role.trim() };

    try {
      if (editingId) {
        if (editingId.startsWith('mock-st-') || editingId.startsWith('st-')) {
          throw new Error('Local mock stylist write');
        }
        const { error } = await supabase.from('stylists').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('stylists').insert([payload]);
        if (error) throw error;
      }
    } catch (err) {
      console.warn('Supabase stylist write failed, using localStorage:', err);
      const localStylists = JSON.parse(localStorage.getItem('chelsea_local_stylists') || '[]');
      if (editingId) {
        const idx = localStylists.findIndex((s: any) => s.id === editingId);
        if (idx > -1) {
          localStylists[idx] = { ...localStylists[idx], ...payload };
        }
      } else {
        localStylists.push({
          id: `mock-st-${Date.now()}`,
          ...payload,
          is_active: true,
        });
      }
      localStorage.setItem('chelsea_local_stylists', JSON.stringify(localStylists));
    }

    setModalOpen(false);
    await loadStylists();
  }

  async function handleDelete() {
    if (!deletingId) return;
    try {
      if (deletingId.startsWith('mock-st-') || deletingId.startsWith('st-')) {
        throw new Error('Local mock stylist delete');
      }
      const { error } = await supabase.from('stylists').update({ is_active: false }).eq('id', deletingId);
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase stylist delete failed, using localStorage:', err);
      const localStylists = JSON.parse(localStorage.getItem('chelsea_local_stylists') || '[]');
      const idx = localStylists.findIndex((s: any) => s.id === deletingId);
      if (idx > -1) {
        localStylists[idx].is_active = false;
        localStorage.setItem('chelsea_local_stylists', JSON.stringify(localStylists));
      }
    }
    setDeleteModalOpen(false);
    setDeletingId(null);
    await loadStylists();
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
        <h1 className="text-xl font-bold text-white">Stylist Roster</h1>
        <button
          onClick={openAdd}
          className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:opacity-85 transition-opacity"
        >
          + Add New Stylist
        </button>
      </div>

      <div className="bg-[#0F0F0F] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#D4AF37] border-b border-white/5 bg-[#1A1814]">
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Name</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Role</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stylists.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#6B655A] italic">No stylists found.</td>
                </tr>
              ) : (
                stylists.map((stylist) => (
                  <tr key={stylist.id} className="border-b border-white/5">
                    <td className="p-4 text-white">{stylist.name}</td>
                    <td className="p-4 text-[#A3A3A3]">{stylist.role || '—'}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          stylist.is_active
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {stylist.is_active ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => openEdit(stylist)}
                        className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDelete(stylist.id)}
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
            <h2 id="modal-title" className="text-lg font-semibold text-white mb-4">
              {editingId ? 'Edit Stylist' : 'Add New Stylist'}
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
              <div>
                <label className="block text-sm text-[#A3A3A3] mb-1.5">Role</label>
                <input
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. Barber, Nail Technician"
                  className="w-full px-3 py-2.5 rounded-lg bg-[#0A0A0A] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
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
                  {editingId ? 'Update Stylist' : 'Save Stylist'}
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
            <h2 className="text-lg font-semibold text-white mb-2">Delete Stylist</h2>
            <p className="text-sm text-[#A3A3A3] mb-6">
              Are you sure you want to remove this stylist? They will be marked as unavailable.
            </p>
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
