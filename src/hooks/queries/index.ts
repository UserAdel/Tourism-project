import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import type { Activity, ActivityReview, BookingFormData } from '../../types';
import { normalizeActivity } from '../../utils/activityImages';

export interface Category {
  _id?: string;
  id: string;
  name: {
    en: string;
    fr: string;
  };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminCategory extends Category {
  _id: string;
  isActive: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface AdminBookingRequest extends BookingFormData {
  _id: string;
  activityName: string;
  status: 'pending' | 'new' | 'contacted' | 'confirmed' | 'cancelled';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminContactRequest extends ContactFormData {
  _id: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminActivity extends Activity {
  _id: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ActivityReviewPayload = Pick<ActivityReview, 'name' | 'country' | 'rating' | 'comment'>;

export interface AdminDashboardData {
  stats: {
    activities: number;
    bookings: number;
    newBookings: number;
    contacts: number;
    newContacts: number;
    categories: number;
  };
  bookings: AdminBookingRequest[];
  contacts: AdminContactRequest[];
  activities: AdminActivity[];
  categories: AdminCategory[];
}

interface AdminActivityMutationPayload {
  activity: Activity & { isActive?: boolean };
  imageFile?: File | null;
  galleryFiles?: File[];
  videoThumbnailFiles?: Array<{ index: number; file: File }>;
  videoReviewThumbnailFiles?: Array<{ index: number; file: File }>;
}

function buildActivityFormData({
  activity,
  imageFile,
  galleryFiles,
  videoThumbnailFiles,
  videoReviewThumbnailFiles,
}: AdminActivityMutationPayload) {
  const formData = new FormData();
  formData.append('payload', JSON.stringify(activity));

  if (imageFile) {
    formData.append('image', imageFile);
  }

  galleryFiles?.forEach((file) => {
    formData.append('gallery', file);
  });

  videoThumbnailFiles?.forEach(({ index, file }) => {
    formData.append(`videoThumbnail_${index}`, file);
  });

  videoReviewThumbnailFiles?.forEach(({ index, file }) => {
    formData.append(`videoReviewThumbnail_${index}`, file);
  });

  return formData;
}

export function useActivities() {
  return useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const response = await api.get('/activities');
      return response.data.data.activities as Activity[];
    },
    select: (activities) => activities.map(normalizeActivity),
  });
}

export function useActivity(slug?: string) {
  return useQuery({
    queryKey: ['activities', slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      const response = await api.get(`/activities/${slug}`);
      return response.data.data.activity as Activity;
    },
    select: normalizeActivity,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data.data.categories as Category[];
    },
  });
}

export function useCreateBookingRequest() {
  return useMutation({
    mutationFn: async (payload: BookingFormData) => {
      const response = await api.post('/bookings', payload);
      return response.data.data.booking;
    },
  });
}

export function useCreateContactRequest() {
  return useMutation({
    mutationFn: async (payload: ContactFormData) => {
      const response = await api.post('/contacts', payload);
      return response.data.data.contact;
    },
  });
}

export function useCreateActivityReview(slug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ActivityReviewPayload) => {
      const response = await api.post(`/activities/${slug}/reviews`, payload);
      return response.data.data.review as ActivityReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', slug] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const response = await api.get('/admin/dashboard');
      return response.data.data as AdminDashboardData;
    },
  });
}

export function useAdminActivity(id?: string) {
  return useQuery({
    queryKey: ['admin-activity', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await api.get(`/admin/activities/${id}`);
      return response.data.data.activity as AdminActivity;
    },
  });
}

export function useUpdateAdminActivityReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      activityId,
      reviewId,
      payload,
    }: {
      activityId: string;
      reviewId: string;
      payload: ActivityReviewPayload;
    }) => {
      const response = await api.patch(
        `/admin/activities/${activityId}/reviews/${reviewId}`,
        payload
      );
      return response.data.data.review as ActivityReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['admin-activity'] });
    },
  });
}

export function useDeleteAdminActivityReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      activityId,
      reviewId,
    }: {
      activityId: string;
      reviewId: string;
    }) => {
      const response = await api.delete(`/admin/activities/${activityId}/reviews/${reviewId}`);
      return response.data.data.activity as AdminActivity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['admin-activity'] });
    },
  });
}

export function useUpdateBookingRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      adminNotes,
    }: {
      id: string;
      status: AdminBookingRequest['status'];
      adminNotes?: string;
    }) => {
      const response = await api.patch(`/admin/bookings/${id}`, { status, adminNotes });
      return response.data.data.booking as AdminBookingRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
  });
}

export function useUpdateContactRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      adminNotes,
    }: {
      id: string;
      status: AdminContactRequest['status'];
      adminNotes?: string;
    }) => {
      const response = await api.patch(`/admin/contacts/${id}`, { status, adminNotes });
      return response.data.data.contact as AdminContactRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
  });
}

export function useDeleteContactRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/admin/contacts/${id}`);
      return response.data.data.contact as AdminContactRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
  });
}

export function useCreateAdminActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AdminActivityMutationPayload) => {
      const response = await api.post('/admin/activities', buildActivityFormData(payload));
      return response.data.data.activity as AdminActivity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['admin-activity'] });
    },
  });
}

export function useUpdateAdminActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: AdminActivityMutationPayload;
    }) => {
      const response = await api.patch(`/admin/activities/${id}`, buildActivityFormData(payload));
      return response.data.data.activity as AdminActivity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['admin-activity'] });
    },
  });
}

export function useDeleteAdminActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/admin/activities/${id}`);
      return response.data.data.activity as AdminActivity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['admin-activity'] });
    },
  });
}

export function useCreateAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Pick<AdminCategory, 'id' | 'name' | 'isActive'>) => {
      const response = await api.post('/admin/activity-categories', payload);
      return response.data.data.category as AdminCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Pick<AdminCategory, 'id' | 'name' | 'isActive'>;
    }) => {
      const response = await api.patch(`/admin/activity-categories/${id}`, payload);
      return response.data.data.category as AdminCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/admin/activity-categories/${id}`);
      return response.data.data.category as AdminCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
