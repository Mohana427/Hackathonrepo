import React, { useState, useEffect } from 'react';
import type { Booking } from '../../shared/types';
import { createBooking, fetchBookings, cancelBooking } from '../../shared/api';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../../shared/Button';
import { Skeleton } from '../../shared/Skeleton';
import { toast } from 'sonner';

export const BookingCalendar: React.FC = () => {
  const [assetId, setAssetId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (assetId) {
      loadBookings(parseInt(assetId));
    }
  }, [assetId]);

  const loadBookings = async (id: number) => {
    setLoading(true);
    try {
      const data = await fetchBookings(id);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await createBooking({
        asset_id: parseInt(assetId),
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString()
      });
      await loadBookings(parseInt(assetId));
      setStartTime('');
      setEndTime('');
      toast.success('Booking created successfully');
    } catch (err: any) {
      if (err.response?.status === 409) {
        setErrorMsg(`Conflict: Asset is already booked from ${err.response.data.detail.conflicting_range}`);
        toast.error('Booking conflict detected');
      } else {
        setErrorMsg("Error: " + (err.response?.data?.detail || err.message));
        toast.error(err.response?.data?.detail || err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await cancelBooking(id);
      await loadBookings(parseInt(assetId));
      toast.success('Booking cancelled successfully');
    } catch (err: any) {
      toast.error("Error canceling booking: " + (err.response?.data?.detail || err.message));
    }
  };

  if (isInitializing) {
    return (
      <div className="p-6 max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-slate-900/50 p-6 rounded-3xl space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        <div className="flex-1 bg-slate-900/50 p-6 rounded-3xl space-y-4">
          <Skeleton className="h-8 w-48" />
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
      
      {/* Booking Form */}
      <div className="flex-1 bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-slate-800">
        <h2 className="text-2xl font-black text-white mb-6 tracking-tight">Book Resource</h2>
        <form onSubmit={handleBook} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 ml-1">Asset ID</label>
            <input 
              type="number" 
              required 
              value={assetId} 
              onChange={e => setAssetId(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-white p-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 ml-1">Start Time</label>
            <input 
              type="datetime-local" 
              required 
              value={startTime} 
              onChange={e => setStartTime(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-white p-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 ml-1">End Time</label>
            <input 
              type="datetime-local" 
              required 
              value={endTime} 
              onChange={e => setEndTime(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-white p-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
 
          {errorMsg && (
            <div className="p-3 bg-red-500/20 text-red-400 rounded-xl text-sm flex items-start gap-2 border border-red-500/30">
              <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          
          <Button 
            type="submit" 
            isLoading={loading} 
            disabled={!assetId}
            variant="primary"
            className="w-full py-3"
          >
            Book Now
          </Button>
        </form>
      </div>
 
      {/* Bookings List */}
      <div className="flex-1 bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-slate-800 h-[500px] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Current Bookings</h2>
        {!assetId ? (
          <p className="text-slate-500 text-sm italic text-center py-12">Enter an Asset ID to see bookings.</p>
        ) : loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <p className="text-slate-500 text-sm italic text-center py-12">No bookings found for this asset.</p>
        ) : (
          <div className="space-y-3">
            {bookings.map(b => (
              <div key={b.id} className={`p-4 rounded-2xl border transition-colors ${b.status === 'cancelled' ? 'bg-slate-800/30 opacity-60 border-slate-700' : 'bg-blue-500/10 border-blue-500/20'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                      b.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                      b.status === 'ongoing' ? 'bg-green-500/20 text-green-400' :
                      b.status === 'completed' ? 'bg-slate-700 text-slate-300' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {b.status}
                    </span>
                    <p className="text-sm text-white mt-2 font-medium">
                      {new Date(b.start_time).toLocaleString()} - {new Date(b.end_time).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Booked by: Employee #{b.booked_by}</p>
                  </div>
                  {b.status === 'upcoming' && (
                    <Button 
                      onClick={() => handleCancel(b.id)}
                      variant="ghost"
                      className="text-xs text-red-400 hover:text-red-300 p-2 h-auto w-auto"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
