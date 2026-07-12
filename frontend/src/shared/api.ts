import axios from 'axios';
import type {
  Asset, Allocation, TransferRequest, OverdueAllocation,
  Booking, MaintenanceRequest, DashboardStats
} from './types';

const api = axios.create({
  baseURL: '',
});

export default api;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- ASSETS ---
export const fetchAssets = async (search?: string, status?: string) => {
  const params: Record<string, string> = {};
  if (search) params.search = search;
  if (status) params.status_filter = status;
  const res = await api.get<Asset[]>('/assets', { params });
  return res.data;
};

export const fetchAsset = async (id: number) => {
  const res = await api.get<Asset>(`/assets/${id}`);
  return res.data;
};

export const createAsset = async (data: {
  name: string; tag: string; category?: string; serial_number?: string;
  location?: string; condition?: string; is_bookable?: boolean;
  acquisition_cost?: number; acquisition_date?: string; photo_url?: string;
}) => {
  const res = await api.post<Asset>('/assets', data);
  return res.data;
};

export const updateAsset = async (id: number, data: Partial<Asset>) => {
  const res = await api.patch<Asset>(`/assets/${id}`, data);
  return res.data;
};

export const deleteAsset = async (id: number) => {
  const res = await api.delete(`/assets/${id}`);
  return res.data;
};

// --- DASHBOARD ---
export const fetchDashboardStats = async () => {
  const res = await api.get<DashboardStats>('/assets/dashboard/stats');
  return res.data;
};

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
  const res = await api.get<Booking[]>('/bookings', { params: { asset_id: assetId } });
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
