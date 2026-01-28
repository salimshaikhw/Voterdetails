// Forgot Password
export const forgotPasswordUser = (data) =>
  API.post("/auth/forgot-password", data);
// Email Confirmation
export const confirmEmailUser = (data) =>
  API.post("/auth/confirm-email", data);
// Reset Password
export const resetPasswordUser = (data) =>
  API.post("/auth/reset-password", data);
// =========================
// AUTH APIs (JWT/Identity)
// =========================

export const loginUser = (data) =>
  API.post("/auth/login", data);

export const registerUser = (data) =>
  API.post("/auth/register", data);

import axios from "axios";
import { getToken } from "./jwt";

/* =========================
   AXIOS INSTANCE
========================= */


const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

// Add a request interceptor to include JWT token
API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);



/* =========================
   CONSTITUENCY APIs
========================= */

// Constituency APIs
export const getConstituencies = () => API.get("/Constituencies");

export const createConstituency = (data) =>
  API.post("/Constituencies", data);

export const updateConstituency = (id, data) =>
  API.put(`/Constituencies/${id}`, data);

export const deleteConstituency = (id) =>
  API.delete(`/Constituencies/${id}`);

export const getConstituenciesByDistrict = (districtId) =>
  API.get(`/Constituencies/by-district/${districtId}`);


/* =========================
   BOOTH APIs
========================= */

export const getBooths = () =>
  API.get("/Booths");

export const createBooth = (data) =>
  API.post("/Booths", data);

export const updateBooth = (id, data) =>
  API.put(`/Booths/${id}`, data);

export const deleteBooth = (id) =>
  API.delete(`/Booths/${id}`);

/* =========================
   CENTER APIs
========================= */

export const getCenters = () =>
  API.get("/Centers");

export const getCentersWithTownMapping = () =>
  API.get("/Centers/with-town-mapping");

export const getCentersByTownId = (townId) =>
  API.get(`/Centers/by-town/${townId}`);

export const createCenter = (data) =>
  API.post("/Centers", data);

export const updateCenter = (id, data) =>
  API.put(`/Centers/${id}`, data);

export const deleteCenter = (id) =>
  API.delete(`/Centers/${id}`);

/* =========================
   SLOT TYPE APIs
========================= */

export const getSlotTypes = () =>
  API.get("/Slotmasters");

export const createSlotType = (data) =>
  API.post("/Slotmasters", data);

export const updateSlotType = (id, data) =>
  API.put(`/Slotmasters/${id}`, data);

export const deleteSlotType = (id) =>
  API.delete(`/Slotmasters/${id}`);

/* =========================
   SLOT APIs
========================= */

export const getSlots = () =>
  API.get("/Slotmasters");

export const createSlot = (data) =>
  API.post("/Slotmasters", data);

export const updateSlot = (id, data) =>
  API.put(`/Slotmasters/${id}`, data);

export const deleteSlot = (id) =>
  API.delete(`/Slotmasters/${id}`);

/* =========================
   HOLIDAY APIs
========================= */

export const getHolidays = () =>
  API.get("/Holidays");

export const getGlobalHolidays = () =>
  API.get("/Holidays/global");

export const getCenterHolidays = (cscId) =>
  API.get(`/Holidays/center/${cscId}`);

export const getTownHolidays = (townId) =>
  API.get(`/Holidays/town/${townId}`);

export const getSlotHolidays = (slotId) =>
  API.get(`/Holidays/slot/${slotId}`);

export const getConstituencyHolidays = (constituencyNumber) =>
  API.get(`/Holidays/constituency/${constituencyNumber}`);

export const checkIfHoliday = (params) => {
  const queryParams = new URLSearchParams();
  if (params.date) queryParams.append('date', params.date);
  if (params.cscId) queryParams.append('cscId', params.cscId);
  if (params.townId) queryParams.append('townId', params.townId);
  if (params.slotId) queryParams.append('slotId', params.slotId);
  if (params.constituencyNumber) queryParams.append('constituencyNumber', params.constituencyNumber);
  return API.get(`/Holidays/check?${queryParams.toString()}`);
};

export const getHolidayById = (id) =>
  API.get(`/Holidays/${id}`);

export const createHoliday = (data) =>
  API.post("/Holidays", data);

export const updateHoliday = (id, data) =>
  API.put(`/Holidays/${id}`, data);

export const deleteHoliday = (id) =>
  API.delete(`/Holidays/${id}`);


/* =========================
   ZONE APIs
========================= */

export const getZones = () =>
  API.get("/Zones");

export const createZone = (data) =>
  API.post("/Zones", {
    name: data.zonename
  });

export const updateZone = (id, data) =>
  API.put(`/Zones/${id}`, {
    name: data.zonename
  });

export const deleteZone = (id) =>
  API.delete(`/Zones/${id}`);


/* =========================
   UPLOAD API
========================= */

export const uploadConstituencyData = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  // endpoint available at POST /api/ExcelImport/UploadData
  // Let the browser set the Content-Type (with boundary) for multipart/form-data
  return API.post("/ExcelImport/UploadData", formData);
};

/* =========================
   FAMILY BOOKING APIs
========================= */

export const getFamilyBookings = () =>
  API.get("/Families");

export const createFamilyBooking = (data) =>
  API.post("/Families", data);

export const updateFamilyBooking = (id, data) =>
  API.put(`/Families/${id}`, data);

export const deleteFamilyBooking = (id) =>
  API.delete(`/Families/${id}`);

/* =========================
   FAMILY MEMBER APIs
========================= */

export const getFamilyMembers = () =>
  API.get("/Familymembers");

export const createFamilyMember = (data) =>
  API.post("/Familymembers", data);

export const updateFamilyMember = (id, data) =>
  API.put(`/Familymembers/${id}`, data);

export const deleteFamilyMember = (id) =>
  API.delete(`/Familymembers/${id}`);

/* =========================
   FAMILY BOOKING APIs (SCREEN API)
========================= */

// This is the MAIN API for FamilyBookingTab screen
export const getFamilyBookingsWithMembersAndBookings = () =>
  API.get("/Families/with-members-and-bookings");


/* =========================
   DISTRICT APIs
========================= */

// DISTRICTS
export const getDistricts = () => API.get("/Districts");

export const getDistrictsByZone = (zoneId) =>
  API.get(`/Districts/by-zone/${zoneId}`);

export const createDistrict = (data) =>
  API.post("/Districts", {
    name: data.name,
    zoneid: data.zoneid
  });

export const updateDistrict = (id, data) =>
  API.put(`/Districts/${id}`, {
    name: data.name,
    zoneid: data.zoneid
  });

export const deleteDistrict = (id) =>
  API.delete(`/Districts/${id}`);


/* =========================
   TOWN APIs
========================= */

export const getTowns = () =>
  API.get("/Towns");

export const createTown = (data) =>
  API.post("/Towns", data);

export const updateTown = (id, data) =>
  API.put(`/Towns/${id}`, data);

export const deleteTown = (id) =>
  API.delete(`/Towns/${id}`);

/* =========================
   BLOCK APIs
========================= */

export const getBlocks = () =>
  API.get("/Blocks");

export const createBlock = (data) =>
  API.post("/Blocks", data);

export const updateBlock = (id, data) =>
  API.put(`/Blocks/${id}`, data);

export const deleteBlock = (id) =>
  API.delete(`/Blocks/${id}`);

/* =========================
   REPORT APIs
========================= */

export const getAllBookings = (filters = {}) => {
  const params = new URLSearchParams();
  
  // Pagination
  if (filters.page) params.append('page', filters.page);
  if (filters.pageSize) params.append('pageSize', filters.pageSize);
  
  // Filters
  if (filters.zoneId) params.append('zoneId', filters.zoneId);
  if (filters.districtId) params.append('districtId', filters.districtId);
  if (filters.constituencyNumber) params.append('constituencyNumber', filters.constituencyNumber);
  if (filters.boothNumber) params.append('boothNumber', filters.boothNumber);
  if (filters.townId) params.append('townId', filters.townId);
  if (filters.centerId) params.append('centerId', filters.centerId);
  if (filters.karyakartaName) params.append('karyakartaName', filters.karyakartaName);
  if (filters.karyakartaId) params.append('karyakartaId', filters.karyakartaId);
  if (filters.timePeriod) params.append('timePeriod', filters.timePeriod);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.status) params.append('status', filters.status);
  
  return API.get(`/Reports/AllBookings?${params.toString()}`);
};

export const downloadExcelReport = (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.zoneId) params.append('zoneId', filters.zoneId);
  if (filters.districtId) params.append('districtId', filters.districtId);
  if (filters.constituencyNumber) params.append('constituencyNumber', filters.constituencyNumber);
  if (filters.boothNumber) params.append('boothNumber', filters.boothNumber);
  if (filters.townId) params.append('townId', filters.townId);
  if (filters.centerId) params.append('centerId', filters.centerId);
  if (filters.karyakartaName) params.append('karyakartaName', filters.karyakartaName);
  if (filters.karyakartaId) params.append('karyakartaId', filters.karyakartaId);
  if (filters.timePeriod) params.append('timePeriod', filters.timePeriod);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.status) params.append('status', filters.status);
  
  return API.get(`/Reports/DownloadExcel?${params.toString()}`, {
    responseType: 'blob'
  });
};

/* =========================
   BOOKING SLOT APIs
========================= */

export const getBookingSlots = () =>
  API.get("/Bookingslots");

export const getBookingSlotById = (id) =>
  API.get(`/Bookingslots/${id}`);

export const createBookingSlot = (data) =>
  API.post("/Bookingslots", data);

export const updateBookingSlot = (id, data) =>
  API.put(`/Bookingslots/${id}`, data);

export const deleteBookingSlot = (id) =>
  API.delete(`/Bookingslots/${id}`);
