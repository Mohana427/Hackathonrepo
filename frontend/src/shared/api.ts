import axios from 'axios';
import type { 
  Allocation, TransferRequest, OverdueAllocation, 
  Booking, MaintenanceRequest 
} from './types';

const api = axios.create({
  baseURL: '',
});

export default api;

// Interceptor to attach Bearer JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- ALLOCATION ---
export const fetchTransferRequests = async () => {
  const res = await api.get<TransferRequest[]>('/allocations/transfer-requests');
  return res.data;
};

export const createAllocation = async (data: { asset_id: number; employee_id?: number; department_id?: number; expected_return_date?: string }) => {
  const res = await api.post<Allocation>('/allocations', data);
  return res.data;
};

export const createTransferRequest = async (data: { allocation_id: number; requested_to_employee_id?: number; requested_to_department_id?: number }) => {
  const res = await api.post<TransferRequest>('/allocations/transfer-requests', data);
  return res.data;
};

export const approveTransferRequest = async (id: number) => {
  const res = await api.patch<TransferRequest>(`/allocations/transfer-requests/${id}/approve`);
  return res.data;
};

export const returnAllocation = async (id: number, notes?: string) => {
  const res = await api.patch<Allocation>(`/allocations/${id}/return`, { condition_check_in_notes: notes });
  return res.data;
};

export const fetchOverdueAllocations = async () => {
  const res = await api.get<OverdueAllocation[]>('/allocations/overdue');
  return res.data;
};

export const fetchAllocationHistory = async (assetId: number) => {
  const res = await api.get<Allocation[]>(`/allocations/assets/${assetId}/allocation-history`);
  return res.data;
};

// --- BOOKING ---
export const createBooking = async (data: { asset_id: number; start_time: string; end_time: string }) => {
  const res = await api.post<Booking>('/bookings', data);
  return res.data;
};

export const fetchBookings = async (assetId: number) => {
  const res = await api.get<Booking[]>(`/bookings`, { params: { asset_id: assetId } });
  return res.data;
};

export const cancelBooking = async (id: number) => {
  const res = await api.patch<Booking>(`/bookings/${id}/cancel`);
  return res.data;
};

// --- MAINTENANCE ---
export const createMaintenanceRequest = async (data: { asset_id: number; issue_description: string; priority: string; photo_url?: string }) => {
  const res = await api.post<MaintenanceRequest>('/maintenance-requests', data);
  return res.data;
};

export const approveMaintenance = async (id: number) => {
  const res = await api.patch<MaintenanceRequest>(`/maintenance-requests/${id}/approve`);
  return res.data;
};

export const rejectMaintenance = async (id: number) => {
  const res = await api.patch<MaintenanceRequest>(`/maintenance-requests/${id}/reject`);
  return res.data;
};

export const assignTechnician = async (id: number, technician_name: string) => {
  const res = await api.patch<MaintenanceRequest>(`/maintenance-requests/${id}/assign-technician`, { technician_name });
  return res.data;
};

export const resolveMaintenance = async (id: number) => {
  const res = await api.patch<MaintenanceRequest>(`/maintenance-requests/${id}/resolve`);
  return res.data;
};

export const fetchMaintenanceHistory = async (assetId: number) => {
  const res = await api.get<MaintenanceRequest[]>(`/maintenance-requests/assets/${assetId}/maintenance-history`);
  return res.data;
};
