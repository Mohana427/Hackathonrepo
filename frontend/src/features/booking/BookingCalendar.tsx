import React, { useState, useEffect } from 'react';
import type { Booking } from '../../shared/types';
import { createBooking, fetchBookings, cancelBooking } from '../../shared/api';
import { AlertTriangle } from 'lucide-react';

export const BookingCalendar: React.FC = () => {
  const [assetId, setAssetId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assetId) {
      loadBookings(parseInt(assetId));
    }
  }, [assetId]);

  const loadBookings = async (id: number) => {
    try {
      const data = await fetchBookings(id);
      setBookings(data);
    } catch (err) {
      console.error(err);
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
      // Refresh list
      await loadBookings(parseInt(assetId));
      setStartTime('');
      setEndTime('');
    } catch (err: any) {
      if (err.response?.status === 409) {
        // Show conflicting time range inline
        setErrorMsg(`Conflict: Asset is already booked from ${err.response.data.detail.conflicting_range}`);
      } else {
        setErrorMsg("Error: " + (err.response?.data?.detail || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await cancelBooking(id);
      await loadBookings(parseInt(assetId));
    } catch (err: any) {
      alert("Error canceling booking: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
      
      {/* Booking Form */}
      <div className="flex-1 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Book Resource</h2>
        <form onSubmit={handleBook} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Asset ID</label>
            <input 
              type="number" 
              required 
              value={assetId} 
              onChange={e => setAssetId(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input 
              type="datetime-local" 
              required 
              value={startTime} 
              onChange={e => setStartTime(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input 
              type="datetime-local" 
              required 
              value={endTime} 
              onChange={e => setEndTime(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 rounded text-sm flex items-start gap-2">
              <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading || !assetId}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Booking...' : 'Book Now'}
          </button>
        </form>
      </div>

      {/* Bookings List (Simple Calendar View) */}
      <div className="flex-1 bg-white p-6 rounded shadow h-[500px] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Current Bookings</h2>
        {!assetId ? (
          <p className="text-gray-500 text-sm">Enter an Asset ID to see bookings.</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500 text-sm">No bookings found for this asset.</p>
        ) : (
          <div className="space-y-3">
            {bookings.map(b => (
              <div key={b.id} className={`p-3 rounded border ${b.status === 'cancelled' ? 'bg-gray-50 opacity-60' : 'bg-blue-50 border-blue-100'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      b.status === 'upcoming' ? 'bg-blue-200 text-blue-800' :
                      b.status === 'ongoing' ? 'bg-green-200 text-green-800' :
                      b.status === 'completed' ? 'bg-gray-200 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {b.status.toUpperCase()}
                    </span>
                    <p className="text-sm mt-2">
                      {new Date(b.start_time).toLocaleString()} - {new Date(b.end_time).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Booked by: Employee #{b.booked_by}</p>
                  </div>
                  {b.status === 'upcoming' && (
                    <button 
                      onClick={() => handleCancel(b.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Cancel
                    </button>
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
